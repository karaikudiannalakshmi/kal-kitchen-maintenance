import { C, SL, IB, DB, PB, GB, IS } from '../theme.js'
import { FREQ, FREQ_ORDER } from '../data.js'
import { daysUntil, fmtDate, inr } from '../utils.js'

export function FBadge({ fk }) {
  const f = FREQ[fk] || FREQ.M
  return (
    <span style={{ background: f.bg, color: f.color, fontSize: 11, fontWeight: 700, padding: '2px 9px', borderRadius: 20, whiteSpace: 'nowrap', flexShrink: 0 }}>
      {f.label}
    </span>
  )
}

export function StatusChip({ row }) {
  const du = daysUntil(row.nextDue)
  if (!row.lastDone) return <span style={{ fontSize: 11, color: C.muted, whiteSpace: 'nowrap' }}>Never done</span>
  if (du === null) return null
  if (du < 0)  return <span style={{ fontSize: 11, color: C.red,    fontWeight: 700, whiteSpace: 'nowrap' }}>⚠ {Math.abs(du)}d overdue</span>
  if (du <= 3) return <span style={{ fontSize: 11, color: C.accent,  fontWeight: 700, whiteSpace: 'nowrap' }}>Due in {du}d</span>
  return              <span style={{ fontSize: 11, color: C.green,   whiteSpace: 'nowrap' }}>Next {fmtDate(row.nextDue)}</span>
}

export function Dot({ row }) {
  const du = daysUntil(row.nextDue)
  const col = !row.lastDone ? C.muted : du < 0 ? C.red : du <= 3 ? C.accent : C.green
  return <span style={{ width: 7, height: 7, borderRadius: '50%', background: col, display: 'inline-block', flexShrink: 0 }} />
}

export function Pill({ label, active, onClick, ac, ab }) {
  return (
    <button onClick={onClick} style={{
      padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer',
      border: `1px solid ${active ? (ac || C.accent) : C.border}`,
      background: active ? (ab || C.accentDim) : 'transparent',
      color: active ? (ac || C.accent) : C.muted,
    }}>
      {label}
    </button>
  )
}

export function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 13 }}>
      <label style={{ ...SL, display: 'block', marginBottom: 5 }}>{label}</label>
      {children}
    </div>
  )
}

export function StatCard({ label, value, sub, color }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '12px 14px', flex: '1 1 120px', minWidth: 0 }}>
      <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'monospace', color: color || C.text }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

export function FreqFilterBar({ selFreq, setSelFreq }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      <Pill label="All" active={selFreq === 'all'} onClick={() => setSelFreq('all')} />
      {FREQ_ORDER.map(fk => {
        const f = FREQ[fk]
        return <Pill key={fk} label={f.label} active={selFreq === fk} onClick={() => setSelFreq(fk)} ac={f.color} ab={f.bg} />
      })}
    </div>
  )
}

export { C, SL, IB, DB, PB, GB, IS }
