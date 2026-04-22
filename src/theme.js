export const C = {
  bg:         '#0D1117',
  surface:    '#161B22',
  card:       '#1C2333',
  border:     '#2D3A50',
  accent:     '#F59E0B',
  accentDim:  '#78350F',
  green:      '#22C55E',
  greenDim:   '#14532D',
  red:        '#EF4444',
  redDim:     '#450A0A',
  blue:       '#60A5FA',
  blueDim:    '#1E3A5F',
  orange:     '#FB923C',
  orangeDim:  '#7C2D12',
  text:       '#E6EDF3',
  muted:      '#7D8590',
  subtle:     '#21293B',
}

// Shared inline style objects
export const SL = {
  fontSize: 11, color: C.muted, fontWeight: 700,
  textTransform: 'uppercase', letterSpacing: '.06em',
}
export const IB = {
  background: 'transparent', border: `1px solid ${C.border}`,
  borderRadius: 6, padding: '4px 9px', fontSize: 13, color: C.muted, cursor: 'pointer',
}
export const DB = {
  background: C.redDim, color: C.red, border: 'none',
  borderRadius: 6, padding: '4px 9px', fontSize: 13, cursor: 'pointer',
}
export const PB = {
  background: C.accent, color: '#000', border: 'none',
  borderRadius: 7, padding: '8px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
}
export const GB = {
  background: 'transparent', color: C.muted, border: `1px solid ${C.border}`,
  borderRadius: 7, padding: '8px 16px', fontSize: 13, cursor: 'pointer',
}
export const IS = {
  background: C.subtle, color: C.text, border: `1px solid ${C.border}`,
  borderRadius: 8, padding: '8px 12px', fontFamily: 'inherit',
  fontSize: 14, width: '100%', outline: 'none',
}
