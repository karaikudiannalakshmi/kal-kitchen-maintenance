import { CATS, getCat } from '../data.js'
import { C } from '../theme.js'
import { daysUntil, fmtFull, inr } from '../utils.js'
import { StatCard } from '../components/Atoms.jsx'

export default function DashboardTab({ eq, sched, repairs }) {
  const overdue   = sched.filter(s => { const du = daysUntil(s.nextDue); return s.enabled && s.lastDone && du !== null && du < 0 })
  const dueSoon   = sched.filter(s => { const du = daysUntil(s.nextDue); return s.enabled && du !== null && du >= 0 && du <= 7 })
  const openRep   = repairs.filter(r => r.status === 'Open')
  const totalCost = repairs.reduce((s, r) => s + (r.total || 0), 0)

  const costByEq = eq
    .map(e => ({
      e,
      cost:  repairs.filter(r => r.eqId === e.id).reduce((s, r) => s + (r.total || 0), 0),
      count: repairs.filter(r => r.eqId === e.id).length,
    }))
    .filter(x => x.cost > 0)
    .sort((a, b) => b.cost - a.cost)
  const maxCost = costByEq[0]?.cost || 1

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>Dashboard</h2>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 18 }}>
        <StatCard label="Equipment"       value={eq.length} />
        <StatCard label="PM Overdue"      value={overdue.length}  color={overdue.length  > 0 ? C.red    : C.green} />
        <StatCard label="Due in 7 days"   value={dueSoon.length}  color={dueSoon.length  > 0 ? C.accent : C.green} />
        <StatCard label="Open Repairs"    value={openRep.length}  color={openRep.length  > 0 ? C.red    : C.green} />
        <StatCard label="Total Repair Cost" value={inr(totalCost)} color={C.red} sub={`${repairs.length} repairs`} />
      </div>

      {/* Overdue PM */}
      {overdue.length > 0 && (
        <div style={{ background: C.redDim + '55', border: `1px solid ${C.red}44`, borderRadius: 10, padding: 14, marginBottom: 14 }}>
          <div style={{ color: C.red, fontWeight: 700, marginBottom: 8 }}>⚠ Overdue PM — {overdue.length} task{overdue.length > 1 ? 's' : ''}</div>
          {overdue.slice(0, 5).map(s => {
            const e = eq.find(x => x.id === s.eqId)
            const du = daysUntil(s.nextDue)
            return (
              <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: `1px solid ${C.red}22`, fontSize: 13 }}>
                <span>{e?.name} — {s.task.slice(0, 45)}{s.task.length > 45 ? '…' : ''}</span>
                <span style={{ color: C.red, fontWeight: 700, flexShrink: 0, marginLeft: 8 }}>{Math.abs(du)}d overdue</span>
              </div>
            )
          })}
          {overdue.length > 5 && <div style={{ fontSize: 12, color: C.muted, marginTop: 6 }}>+{overdue.length - 5} more — see PM Schedule tab</div>}
        </div>
      )}

      {/* Open repairs */}
      {openRep.length > 0 && (
        <div style={{ background: C.orangeDim + '55', border: `1px solid ${C.orange}44`, borderRadius: 10, padding: 14, marginBottom: 14 }}>
          <div style={{ color: C.orange, fontWeight: 700, marginBottom: 8 }}>🔴 Open Repairs — {openRep.length} pending</div>
          {openRep.map(r => {
            const e = eq.find(x => x.id === r.eqId)
            return (
              <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: `1px solid ${C.orange}22`, fontSize: 13 }}>
                <span>{e?.name} — {r.problem.slice(0, 50)}{r.problem.length > 50 ? '…' : ''}</span>
                <span style={{ color: C.muted, flexShrink: 0, marginLeft: 8 }}>{fmtFull(r.date)}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Repair cost bar chart */}
      {costByEq.length > 0 && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
          <div style={{ fontWeight: 700, marginBottom: 14, display: 'flex', justifyContent: 'space-between' }}>
            <span>Repair Cost by Equipment</span>
            <span style={{ color: C.red, fontFamily: 'monospace' }}>{inr(totalCost)}</span>
          </div>
          {costByEq.map(({ e, cost, count }) => (
            <div key={e.id} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                <span style={{ fontWeight: 600 }}>{e.name}</span>
                <span style={{ color: C.red, fontFamily: 'monospace', fontWeight: 700 }}>
                  {inr(cost)} <span style={{ color: C.muted, fontWeight: 400, fontSize: 11 }}>({count} repair{count > 1 ? 's' : ''})</span>
                </span>
              </div>
              <div style={{ background: C.subtle, borderRadius: 4, height: 8 }}>
                <div style={{ width: `${(cost / maxCost) * 100}%`, background: C.red, borderRadius: 4, height: '100%', transition: 'width .4s' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PM health by category */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 12 }}>PM Health by Category</div>
        {CATS.map(cat => {
          const catEq    = eq.filter(e => e.catId === cat.id)
          const catSched = sched.filter(s => catEq.some(e => e.id === s.eqId) && s.enabled)
          const ov = catSched.filter(s => { const du = daysUntil(s.nextDue); return s.lastDone && du !== null && du < 0 }).length
          const ok = catSched.filter(s => s.lastDone && daysUntil(s.nextDue) >= 0).length
          const nd = catSched.filter(s => !s.lastDone).length
          const repCost = repairs.filter(r => catEq.some(e => e.id === r.eqId)).reduce((s, r) => s + (r.total || 0), 0)
          if (!catEq.length) return null
          return (
            <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{cat.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{cat.label} <span style={{ color: C.muted, fontWeight: 400, fontSize: 11 }}>{catEq.length} unit{catEq.length > 1 ? 's' : ''}</span></div>
                <div style={{ display: 'flex', gap: 8, fontSize: 11, marginTop: 3 }}>
                  {ov > 0 && <span style={{ color: C.red,    fontWeight: 700 }}>{ov} overdue</span>}
                  {ok > 0 && <span style={{ color: C.green              }}>{ok} on track</span>}
                  {nd > 0 && <span style={{ color: C.muted              }}>{nd} not started</span>}
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: 11 }}>
                <div style={{ color: C.blue }}>{catSched.length} tasks</div>
                <div style={{ color: C.red  }}>{inr(repCost)} repairs</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
