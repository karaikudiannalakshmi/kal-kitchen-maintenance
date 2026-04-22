import { useState, useEffect } from 'react'
import { INIT_EQ, INIT_REPAIRS, DEFAULT_TASKS, FREQ } from './data.js'
import { C } from './theme.js'
import { uid, addDays, todayStr } from './utils.js'
import { COLS, fsSet, fsUpdate, fsDel, fsBatchSet, fsBatchDel, fsGetAll, fsSubscribe } from './firebase.js'

import DashboardTab from './tabs/DashboardTab.jsx'
import ScheduleTab  from './tabs/ScheduleTab.jsx'
import TodayTab     from './tabs/TodayTab.jsx'
import RepairsTab   from './tabs/RepairsTab.jsx'
import EquipmentTab from './tabs/EquipmentTab.jsx'
import HistoryTab   from './tabs/HistoryTab.jsx'

function buildSchedForEq(eq) {
  return (DEFAULT_TASKS[eq.catId] || []).map(t => ({
    id: uid(), eqId: eq.id, taskId: t.id,
    task: t.task, freq: t.freq,
    lastDone: null, nextDue: null, enabled: true,
  }))
}

const TABS = [
  { id: 'dashboard', label: 'Dashboard',   icon: '📊' },
  { id: 'schedule',  label: 'PM Schedule', icon: '📋' },
  { id: 'today',     label: 'Today',       icon: '✅' },
  { id: 'repairs',   label: 'Repairs',     icon: '🛠' },
  { id: 'equipment', label: 'Equipment',   icon: '🔧' },
  { id: 'history',   label: 'History',     icon: '🕐' },
]

export default function App() {
  const [tab,     setTab]     = useState('dashboard')
  const [eq,      setEq]      = useState([])
  const [sched,   setSched]   = useState([])
  const [repairs, setRepairs] = useState([])
  const [loading, setLoading] = useState(true)

  // ── Subscribe to all three Firestore collections ───────────────────────
  useEffect(() => {
    let loaded = { eq: false, sched: false, repairs: false }

    function checkDone() {
      if (loaded.eq && loaded.sched && loaded.repairs) setLoading(false)
    }

    const u1 = fsSubscribe(COLS.equipment, data => { setEq(data);      loaded.eq      = true; checkDone() })
    const u2 = fsSubscribe(COLS.schedule,  data => { setSched(data);   loaded.sched   = true; checkDone() })
    const u3 = fsSubscribe(COLS.repairs,   data => { setRepairs(data); loaded.repairs = true; checkDone() })

    return () => { u1(); u2(); u3() }
  }, [])

  // ── Seed initial data if Firestore is empty (first run only) ──────────
  useEffect(() => {
    if (loading) return
    if (eq.length === 0) {
      const initSched = INIT_EQ.flatMap(buildSchedForEq)
      fsBatchSet(COLS.equipment, INIT_EQ)
      fsBatchSet(COLS.schedule,  initSched)
      fsBatchSet(COLS.repairs,   INIT_REPAIRS)
    }
  }, [loading])   // runs once after first load completes

  // ── Equipment CRUD ────────────────────────────────────────────────────
  async function saveEq(data) {
    if (data.id) {
      await fsSet(COLS.equipment, data.id, data)
    } else {
      const newEq = { ...data, id: uid() }
      const newRows = buildSchedForEq(newEq)
      await fsSet(COLS.equipment, newEq.id, newEq)
      await fsBatchSet(COLS.schedule, newRows)
    }
  }

  async function deleteEq(id) {
    if (!confirm('Delete this equipment and all its PM tasks and repair logs?')) return
    await fsDel(COLS.equipment, id)
    await fsBatchDel(COLS.schedule, sched.filter(s => s.eqId === id).map(s => s.id))
    await fsBatchDel(COLS.repairs,  repairs.filter(r => r.eqId === id).map(r => r.id))
  }

  // ── Task CRUD ─────────────────────────────────────────────────────────
  async function saveTask(data) {
    if (data.id) {
      await fsUpdate(COLS.schedule, data.id, { task: data.task, freq: data.freq })
    } else {
      const newRow = {
        id: uid(), eqId: data.eqId, taskId: 'custom_' + uid(),
        task: data.task, freq: data.freq,
        lastDone: null, nextDue: null, enabled: true,
      }
      await fsSet(COLS.schedule, newRow.id, newRow)
    }
  }

  async function deleteTask(id) {
    if (!confirm('Delete this PM task?')) return
    await fsDel(COLS.schedule, id)
  }

  async function markDone(id) {
    const row = sched.find(s => s.id === id)
    if (!row) return
    await fsUpdate(COLS.schedule, id, {
      lastDone: todayStr(),
      nextDue:  addDays(FREQ[row.freq]?.days || 30),
    })
  }

  async function toggleEnabled(id) {
    const row = sched.find(s => s.id === id)
    if (!row) return
    await fsUpdate(COLS.schedule, id, { enabled: !row.enabled })
  }

  // ── Repair CRUD ───────────────────────────────────────────────────────
  async function saveRepair(data) {
    if (data.id) {
      await fsSet(COLS.repairs, data.id, data)
    } else {
      const newRep = { ...data, id: uid() }
      await fsSet(COLS.repairs, newRep.id, newRep)
    }
  }

  async function deleteRepair(id) {
    if (!confirm('Delete this repair record?')) return
    await fsDel(COLS.repairs, id)
  }

  const ctx = { eq, sched, repairs, saveEq, deleteEq, saveTask, deleteTask, markDone, toggleEnabled, saveRepair, deleteRepair }
  const today = new Date()

  // ── Loading screen ────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <style>{`@keyframes pulse { from { opacity:.3 } to { opacity:1 } }`}</style>
        <div style={{ fontSize: 36 }}>🍳</div>
        <div style={{ color: C.accent, fontWeight: 700, fontSize: 18 }}>KAL Kitchen</div>
        <div style={{ color: C.muted, fontSize: 13 }}>Loading maintenance data…</div>
        <div style={{ width: 120, height: 4, background: C.border, borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ width: '60%', height: '100%', background: C.accent, borderRadius: 4, animation: 'pulse 1s infinite alternate' }} />
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
      `}</style>

      {/* Header */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: '11px 16px', display: 'flex', alignItems: 'center', gap: 10, position: 'sticky', top: 0, zIndex: 100 }}>
        <span style={{ fontSize: 20 }}>🍳</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: C.accent }}>KAL Kitchen</div>
          <div style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: '.08em' }}>Maintenance Manager</div>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: 11, color: C.muted }}>
          {today.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', background: C.surface, borderBottom: `1px solid ${C.border}`, overflowX: 'auto' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: '0 0 auto', padding: '8px 14px', background: 'transparent', border: 'none',
            color: tab === t.id ? C.accent : C.muted,
            borderBottom: tab === t.id ? `2px solid ${C.accent}` : '2px solid transparent',
            fontWeight: tab === t.id ? 700 : 400, fontSize: 11, cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
          }}>
            <span style={{ fontSize: 16 }}>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Page content */}
      <div style={{ padding: '16px 14px', maxWidth: 960, margin: '0 auto' }}>
        {tab === 'dashboard' && <DashboardTab {...ctx} />}
        {tab === 'schedule'  && <ScheduleTab  {...ctx} />}
        {tab === 'today'     && <TodayTab     {...ctx} />}
        {tab === 'repairs'   && <RepairsTab   {...ctx} />}
        {tab === 'equipment' && <EquipmentTab {...ctx} />}
        {tab === 'history'   && <HistoryTab   {...ctx} />}
      </div>
    </div>
  )
}
