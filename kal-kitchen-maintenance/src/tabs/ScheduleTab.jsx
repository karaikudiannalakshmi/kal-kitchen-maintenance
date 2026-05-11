import { useState } from 'react'
import { CATS, FREQ, FREQ_ORDER, getCat } from '../data.js'
import { C, SL, IB, DB, PB, GB } from '../theme.js'
import { daysUntil } from '../utils.js'
import{Pill,FreqFilterBar,Dot,StatusChip}from'../components/Atoms.jsx'
import EqModal from '../components/EqModal.jsx'
import TaskModal from '../components/TaskModal.jsx'

export default function ScheduleTab({ eq, sched, saveEq, deleteEq, saveTask, deleteTask, markDone, toggleEnabled }) {
  const [selCat,  setSelCat]  = useState('all')
  const [selFreq, setSelFreq] = useState('all')
  const [openEq,  setOpenEq]  = useState(() => new Set(eq.map(e => e.id)))
  const [eqM,     setEqM]     = useState(null)
  const [taskM,   setTaskM]   = useState(null)

  function tog(id) {
    setOpenEq(prev => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }
  const vis = eq.filter(e => selCat === 'all' || e.catId === selCat)

  return (
    <div>
      {/* Filters */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ ...SL, marginBottom: 6 }}>Category</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
          <Pill label="All" active={selCat === 'all'} onClick={() => setSelCat('all')} />
          {CATS.map(c => <Pill key={c.id} label={`${c.icon} ${c.label}`} active={selCat === c.id} onClick={() => setSelCat(c.id)} />)}
        </div>
        <div style={{ ...SL, marginBottom: 6 }}>Frequency</div>
        <FreqFilterBar selFreq={selFreq} setSelFreq={setSelFreq} />
      </div>

      {/* Equipment accordion */}
      {vis.map(e => {
        const cat     = getCat(e.catId)
        const allRows = sched.filter(s => s.eqId === e.id)
        const eqRows  = allRows.filter(s => selFreq === 'all' || s.freq === selFreq)
        if (!eqRows.length && selFreq !== 'all') return null
        const open    = openEq.has(e.id)
        const overdue = allRows.filter(s => { const du = daysUntil(s.nextDue); return s.lastDone && du !== null && du < 0 }).length

        return (
          <div key={e.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden', marginBottom: 12 }}>
            {/* Header */}
            <div style={{ padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 8, background: open ? C.subtle : 'transparent', borderBottom: open ? `1px solid ${C.border}` : 'none', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 18, cursor: 'pointer' }} onClick={() => tog(e.id)}>{cat?.icon}</span>
              <div style={{ flex: 1, minWidth: 120, cursor: 'pointer' }} onClick={() => tog(e.id)}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{e.name}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{e.subtype} · {e.loc}{e.make ? ` · ${e.make} ${e.model}` : ''}</div>
              </div>
              {overdue > 0 && <span style={{ background: C.redDim, color: C.red, fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 20 }}>{overdue} overdue</span>}
              <span style={{ fontSize: 11, color: C.muted }}>{allRows.length} tasks</span>
              <button style={{ ...IB }} title="Edit equipment"  onClick={() => setEqM({ ...e })}>✏️</button>
              <button style={{ ...IB }} title="Add PM task"     onClick={() => setTaskM({ eqId: e.id })}>＋</button>
              <button style={{ ...DB }} title="Delete equipment" onClick={() => deleteEq(e.id)}>🗑</button>
              <span style={{ color: C.muted, fontSize: 12, cursor: 'pointer' }} onClick={() => tog(e.id)}>{open ? '▲' : '▼'}</span>
            </div>

            {/* Tasks grouped by frequency */}
            {open && FREQ_ORDER.map(fk => {
              if (selFreq !== 'all' && selFreq !== fk) return null
              const grp = eqRows.filter(s => s.freq === fk)
              if (!grp.length) return null
              const f = FREQ[fk]
              return (
                <div key={fk}>
                  <div style={{ padding: '4px 14px', background: `${f.bg}88`, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: f.color, fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '.06em' }}>{f.label}</span>
                    <span style={{ fontSize: 11, color: C.muted }}>{grp.length} task{grp.length > 1 ? 's' : ''}</span>
                  </div>
                  {grp.map(row => (
                    <div key={row.id} style={{ padding: '9px 14px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 8, opacity: row.enabled ? 1 : 0.4, flexWrap: 'wrap' }}>
                      <Dot row={row} />
                      <span style={{ flex: 1, fontSize: 13, lineHeight: 1.4, minWidth: 120 }}>{row.task}</span>
                      <StatusChip row={row} />
                      <button onClick={() => markDone(row.id)} style={{ background: C.greenDim, color: C.green, border: `1px solid ${C.green}40`, borderRadius: 6, padding: '4px 11px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>✔</button>
                      <button style={{ ...IB }} onClick={() => setTaskM({ eqId: e.id, row })}>✏️</button>
                      <button style={{ ...IB, color: row.enabled ? C.muted : C.accent }} onClick={() => toggleEnabled(row.id)}>{row.enabled ? '⏸' : '▶'}</button>
                      <button style={{ ...DB }} onClick={() => deleteTask(row.id)}>🗑</button>
                    </div>
                  ))}
                </div>
              )
            })}

            {open && (
              <div style={{ padding: '8px 14px', borderTop: `1px solid ${C.border}` }}>
                <button onClick={() => setTaskM({ eqId: e.id })} style={{ ...GB, fontSize: 12, padding: '5px 14px' }}>
                  ＋ Add PM Task to {e.name}
                </button>
              </div>
            )}
          </div>
        )
      })}

      <button onClick={() => setEqM({})} style={{ ...PB, width: '100%', padding: 12, borderRadius: 10, marginTop: 4 }}>
        ＋ Add Equipment
      </button>

      {eqM   !== null && <EqModal   initial={eqM.id   ? eqM   : null} onSave={saveEq}   onClose={() => setEqM(null)} />}
      {taskM  !== null && <TaskModal initial={taskM.row ? taskM.row : null} eqId={taskM?.eqId} onSave={saveTask}  onClose={() => setTaskM(null)} />}
    </div>
  )
}
