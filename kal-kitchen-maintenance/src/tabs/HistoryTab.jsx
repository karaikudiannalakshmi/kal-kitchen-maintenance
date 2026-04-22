import { getCat } from '../data.js'
import { C } from '../theme.js'
import { fmtDate } from '../utils.js'
import { FBadge } from '../components/Atoms.jsx'

export default function HistoryTab({ eq, sched }) {
  const done = sched
    .filter(s => s.lastDone)
    .map(s => ({ s, e: eq.find(x => x.id === s.eqId) }))
    .filter(x => x.e)
    .sort((a, b) => new Date(b.s.lastDone) - new Date(a.s.lastDone))

  if (!done.length) {
    return (
      <div style={{ textAlign: 'center', padding: 40, color: C.muted }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
        <div style={{ fontWeight: 700 }}>No PM history yet</div>
        <div style={{ fontSize: 13, marginTop: 4 }}>Mark tasks Done to build the log.</div>
      </div>
    )
  }

  // Group by date
  const grouped = {}
  done.forEach(x => {
    const d = x.s.lastDone
    if (!grouped[d]) grouped[d] = []
    grouped[d].push(x)
  })

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>PM History</h2>
      {Object.entries(grouped).map(([date, items]) => (
        <div key={date} style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: C.accent, fontWeight: 700, fontFamily: 'monospace', marginBottom: 7, letterSpacing: '.06em' }}>
            {new Date(date).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
            <span style={{ color: C.muted, fontWeight: 400, marginLeft: 8 }}>{items.length} task{items.length > 1 ? 's' : ''}</span>
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
            {items.map(({ s, e }, i) => {
              const cat = getCat(e.catId)
              return (
                <div key={s.id} style={{ padding: '10px 14px', borderBottom: i < items.length - 1 ? `1px solid ${C.border}` : 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{cat?.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{s.task}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{e.name} · {e.loc}</div>
                  </div>
                  <FBadge fk={s.freq} />
                  <span style={{ fontSize: 11, color: C.green, flexShrink: 0, whiteSpace: 'nowrap' }}>Next {fmtDate(s.nextDue)}</span>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
