import { useState } from 'react'
import { INIT_EQ, INIT_REPAIRS, DEFAULT_TASKS } from './data.js'
import { C } from './theme.js'
import { uid, addDays, todayStr } from './utils.js'
import { FREQ } from './data.js'

import DashboardTab from './tabs/DashboardTab.jsx'
import ScheduleTab  from './tabs/ScheduleTab.jsx'
import TodayTab     from './tabs/TodayTab.jsx'
import RepairsTab   from './tabs/RepairsTab.jsx'
import EquipmentTab from './tabs/EquipmentTab.jsx'
import HistoryTab   from './tabs/HistoryTab.jsx'

// Build schedule rows for a given equipment item
function buildSchedForEq(eq) {
  return (DEFAULT_TASKS[eq.catId] || []).map(t => ({
    id: uid(), eqId: eq.id, taskId: t.id,
    task: t.task, freq: t.freq,
    lastDone: null, nextDue: null, enabled: true,
  }))
}

const INIT_SCHED = INIT_EQ.flatMap(buildSchedForEq)

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
  const [eq,      setEq]      = useState(INIT_EQ)
  const [sched,   setSched]   = useState(INIT_SCHED)
  const [repairs, setRepairs] = useState(INIT_REPAIRS)

  // ── Equipment CRUD ────────────────────────────────────────────────────
  function saveEq(data) {
    if (data.id) {
      setEq(prev => prev.map(e => e.id === data.id ? data : e))
    } else {
      const newEq = { ...data, id: uid() }
      setEq(prev => [...prev, newEq])
      setSched(prev => [...prev, ...buildSchedForEq(newEq)])
    }
  }
  function deleteEq(id) {
    if (!confirm('Delete this equipment and all its PM tasks and repair logs?')) return
    setEq(prev => prev.filter(e => e.id !== id))
    setSched(prev => prev.filter(s => s.eqId !== id))
    setRepairs(prev => prev.filter(r => r.eqId !== id))
  }

  // ── Task CRUD ─────────────────────────────────────────────────────────
  function saveTask(data) {
    if (data.id) {
      setSched(prev => prev.map(s => s.id === data.id ? { ...s, task: data.task, freq: data.freq } : s))
    } else {
      setSched(prev => [...prev, {
        id: uid(), eqId: data.eqId, taskId: 'custom_' + uid(),
        task: data.task, freq: data.freq,
        lastDone: null, nextDue: null, enabled: true,
      }])
    }
  }
  function deleteTask(id) {
    if (!confirm('Delete this PM task?')) return
    setSched(prev => prev.filter(s => s.id !== id))
  }
  function markDone(id) {
    setSched(prev => prev.map(s => {
      if (s.id !== id) return s
      return { ...s, lastDone: todayStr(), nextDue: addDays(FREQ[s.freq]?.days || 30) }
    }))
  }
  function toggleEnabled(id) {
    setSched(prev => prev.map(s => s.id !== id ? s : { ...s, enabled: !s.enabled }))
  }

  // ── Repair CRUD ───────────────────────────────────────────────────────
  function saveRepair(data) {
    if (data.id) {
      setRepairs(prev => prev.map(r => r.id === data.id ? data : r))
    } else {
      setRepairs(prev => [...prev, { ...data, id: uid() }])
    }
  }
  function deleteRepair(id) {
    if (!confirm('Delete this repair record?')) return
    setRepairs(prev => prev.filter(r => r.id !== id))
  }

  const ctx = { eq, sched, repairs, saveEq, deleteEq, saveTask, deleteTask, markDone, toggleEnabled, saveRepair, deleteRepair }

  const today = new Date()

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
