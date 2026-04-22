export function uid() {
  return Math.random().toString(36).slice(2, 9)
}

export function addDays(n) {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

export function daysUntil(s) {
  if (!s) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.ceil((new Date(s) - today) / 86400000)
}

export function fmtDate(s) {
  if (!s) return '—'
  return new Date(s).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })
}

export function fmtFull(s) {
  if (!s) return '—'
  return new Date(s).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function inr(n) {
  return '₹' + (n || 0).toLocaleString('en-IN')
}

export function todayStr() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.toISOString().split('T')[0]
}
