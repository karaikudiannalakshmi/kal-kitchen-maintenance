import { useState } from 'react' 
import { CATS, getCat } from '../data.js'
import { C, SL, IB, DB } from '../theme.js'
import { daysUntil, fmtDate, inr } from '../utils.js'
import { Pill, StatCard } from '../components/Atoms.jsx'
import EqModal from '../components/EqModal.jsx'
import TaskModal from '../components/TaskModal.jsx'

export default function EquipmentTab({ eq, sched, repairs, saveEq, deleteEq, saveTask }) {
  const [modal,  setModal]  = useState(null)
  const [taskM,  setTaskM]  = useState(null)
  const [selCat, setSelCat] = useState('all')

  const vis       = eq.filter(e => selCat === 'all' || e.catId === selCat)
  const ovTotal   = sched.filter(s => { const du = daysUntil(s.nextDue); return s.lastDone && du !== null && du < 0 }).length
  const repTotal  = repairs.reduce((s, r) => s + (r.total || 0), 0)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Equipment</h2>
        <button
          onClick={() => setModal({})}
          style={{ background: '#F59E0B', color: '#000', border: 'none', borderRadius: 7, padding: '8px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
        >
          ＋ Add
        </button>
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
        <Pill label="All" active={selCat === 'all'} onClick={() => setSelCat('all')} />
        {CATS.map(c => <Pill key={c.id} label={`${c.icon} ${c.label}`} active={selCat === c.id} onClick={() => setSelCat(c.id)} />)}
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 18 }}>
        <StatCard label="Equipment"   value={eq.length} />
        <StatCard label="PM Tasks"    value={sched.length}  color="#60A5FA" />
        <StatCard label="PM Overdue"  value={ovTotal}       color={ovTotal > 0 ? '#EF4444' : '#22C55E'} />
        <StatCard label="Repair Cost" value={inr(repTotal)} color="#EF4444" />
      </div>

      {/* Per-category sections */}
      {CATS.filter(c => selCat === 'all' || c.id === selCat).map(cat => {
        const eqs = vis.filter(e => e.catId === cat.id)
        if (!eqs.length) return null
        return (
          <div key={cat.id} style={{ marginBottom: 20 }}>
            <div style={{ ...SL, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              {cat.icon} {cat.label}
              <span style={{ color: C.border }}>·</span>
              {eqs.length} unit{eqs.length > 1 ? 's' : ''}
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
              {eqs.map((e, i) => {
                const rows     = sched.filter(s => s.eqId === e.id)
                const ov       = rows.filter(s => { const du = daysUntil(s.nextDue); return s.lastDone && du !== null && du < 0 }).length
                const nd       = rows.filter(s => !s.lastDone).length
                const repCost  = repairs.filter(r => r.eqId === e.id).reduce((s, r) => s + (r.total || 0), 0)
                const repCount = repairs.filter(r => r.eqId === e.id).length
                return (
                  <div key={e.id} style={{ padding: '11px 14px', borderBottom: i < eqs.length - 1 ? `1px solid ${C.border}` : 'none', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 160 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{e.name}</div>
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>
                        {e.subtype}{e.loc ? ` · ${e.loc}` : ''}{e.make ? ` · ${e.make} ${e.model}` : ''}
                        {e.installDate ? ` · Installed ${fmtDate(e.installDate)}` : ''}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: C.blue }}>{rows.length} PM</span>
                      {ov > 0    && <span style={{ background: C.redDim, color: C.red, fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 20 }}>{ov} overdue</span>}
                      {nd > 0    && <span style={{ background: C.subtle, color: C.muted, fontSize: 11, padding: '2px 7px', borderRadius: 20 }}>{nd} not done</span>}
                      {repCount > 0 && <span style={{ fontSize: 11, color: C.red, fontFamily: 'monospace', fontWeight: 700 }}>{inr(repCost)} repairs ({repCount})</span>}
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button style={{ ...IB, fontSize: 12, padding: '4px 10px' }} onClick={() => setTaskM({ eqId: e.id })}>＋ Task</button>
                      <button style={{ ...IB, fontSize: 12, padding: '4px 10px' }} onClick={() => setModal({ ...e })}>✏️ Edit</button>
                      <button style={{ ...DB, fontSize: 12, padding: '4px 10px' }} onClick={() => deleteEq(e.id)}>🗑 Delete</button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {vis.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: C.muted }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
          <div style={{ fontWeight: 700 }}>No equipment yet</div>
        </div>
      )}

      {modal !== null && <EqModal   initial={modal.id ? modal : null}  onSave={saveEq}   onClose={() => setModal(null)} />}
      {taskM  !== null && <TaskModal initial={null} eqId={taskM?.eqId} onSave={saveTask}  onClose={() => setTaskM(null)} />}
    </div>
  )
}
