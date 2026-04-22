import { useState, useMemo } from 'react'
import { FREQ } from '../data.js'
import { C } from '../theme.js'
import { daysUntil } from '../utils.js'
import { FBadge } from '../components/Atoms.jsx'

export default function TodayTab({ eq, sched, markDone }) {
  const [ticked, setTicked] = useState(new Set())

  const tasks = useMemo(() => {
    const out = []
    sched.forEach(row => {
      if (!row.enabled) return
      const e = eq.find(x => x.id === row.eqId)
      if (!e) return
      const du = daysUntil(row.nextDue)
      if (row.freq === 'D' || (du !== null && du <= 0)) out.push({ row, e, du })
    })
    return out.sort((a, b) => (a.du ?? 999) - (b.du ?? 999))
  }, [eq, sched])

  function tick(id) {
    setTicked(prev => new Set([...prev, id]))
    markDone(id)
  }

  const pending = tasks.filter(x => !ticked.has(x.row.id))
  const done    = tasks.filter(x =>  ticked.has(x.row.id))
  const pct     = tasks.length ? Math.round((done.length / tasks.length) * 100) : 100

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Today's Checklist</h2>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{pending.length} pending · {done.length} done</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 24, fontWeight: 700, color: pct === 100 ? C.green : C.accent }}>{pct}%</div>
          <div style={{ fontSize: 11, color: C.muted }}>complete</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ background: C.border, borderRadius: 6, height: 6, marginBottom: 18 }}>
        <div style={{ width: `${pct}%`, background: pct === 100 ? C.green : C.accent, borderRadius: 6, height: '100%', transition: 'width .3s' }} />
      </div>

      {tasks.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: C.muted }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>😴</div>
          <div style={{ fontWeight: 700 }}>No tasks due today</div>
        </div>
      )}

      {pct === 100 && tasks.length > 0 && (
        <div style={{ textAlign: 'center', padding: 28, color: C.green, marginBottom: 14 }}>
          <div style={{ fontSize: 34, marginBottom: 6 }}>🎉</div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>All done for today!</div>
        </div>
      )}

      {/* Pending tasks */}
      {pending.length > 0 && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden', marginBottom: 14 }}>
          {pending.map(({ row, e, du }) => {
            const isOv = du !== null && du < 0
            return (
              <div key={row.id} style={{
                padding: '11px 14px', borderBottom: `1px solid ${C.border}`,
                display: 'flex', alignItems: 'flex-start', gap: 10,
                borderLeft: `3px solid ${isOv ? C.red : row.freq === 'D' ? FREQ.D.color : C.accent}`,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4 }}>{row.task}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 3, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <span>{e.name}</span>
                    <FBadge fk={row.freq} />
                    {isOv && <span style={{ color: C.red, fontWeight: 700 }}>{Math.abs(du)}d overdue</span>}
                  </div>
                </div>
                <button onClick={() => tick(row.id)} style={{
                  background: C.greenDim, color: C.green, border: `1px solid ${C.green}40`,
                  borderRadius: 7, padding: '7px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer', flexShrink: 0,
                }}>✔ Done</button>
              </div>
            )
          })}
        </div>
      )}

      {/* Completed */}
      {done.length > 0 && (
        <div>
          <div style={{ fontSize: 11, color: C.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>✅ Completed</div>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
            {done.map(({ row, e }) => (
              <div key={row.id} style={{ padding: '9px 14px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 8, opacity: 0.5 }}>
                <span style={{ color: C.green, fontSize: 14 }}>✔</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, textDecoration: 'line-through', color: C.muted }}>{row.task}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{e.name}</div>
                </div>
                <FBadge fk={row.freq} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
