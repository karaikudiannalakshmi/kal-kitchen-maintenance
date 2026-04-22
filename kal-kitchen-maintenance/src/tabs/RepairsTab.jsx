import { useState } from 'react'
import { getCat } from '../data.js'
import { C, IB, DB } from '../theme.js'
import { daysUntil, fmtFull, inr } from '../utils.js'
import { Pill } from '../components/Atoms.jsx'
import RepairModal from '../components/RepairModal.jsx'

export default function RepairsTab({ eq, repairs, saveRepair, deleteRepair }) {
  const [modal,    setModal]   = useState(null)
  const [selEq,    setSelEq]   = useState('all')
  const [selStat,  setSelStat] = useState('all')
  const [detail,   setDetail]  = useState(null)

  const visible = repairs
    .filter(r => selEq   === 'all' || r.eqId   === selEq)
    .filter(r => selStat === 'all' || r.status  === selStat)
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  const totalCost  = visible.reduce((s, r) => s + (r.total || 0), 0)
  const openCount  = repairs.filter(r => r.status === 'Open').length

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Repairs</h2>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
            {repairs.length} records · {inr(repairs.reduce((s, r) => s + (r.total || 0), 0))} total
            {openCount > 0 && <span style={{ color: C.red, marginLeft: 8, fontWeight: 700 }}>{openCount} open</span>}
          </div>
        </div>
        <button
          onClick={() => setModal({})}
          style={{ background: C.red, color: '#fff', border: 'none', borderRadius: 7, padding: '8px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
        >
          ＋ Log Repair
        </button>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: C.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Equipment</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
          <Pill label="All" active={selEq === 'all'} onClick={() => setSelEq('all')} />
          {eq.filter(e => repairs.some(r => r.eqId === e.id)).map(e => (
            <Pill key={e.id} label={`${getCat(e.catId)?.icon} ${e.name}`} active={selEq === e.id} onClick={() => setSelEq(e.id)} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {[['all','All'], ['Open','🔴 Open'], ['Closed','🟢 Closed']].map(([v, l]) => (
            <Pill key={v} label={l} active={selStat === v} onClick={() => setSelStat(v)}
              ac={v === 'Open' ? C.red : v === 'Closed' ? C.green : undefined}
              ab={v === 'Open' ? C.redDim : v === 'Closed' ? C.greenDim : undefined}
            />
          ))}
          <span style={{ marginLeft: 'auto', fontFamily: 'monospace', color: C.red, fontWeight: 700, fontSize: 14 }}>{inr(totalCost)}</span>
        </div>
      </div>

      {/* Empty state */}
      {visible.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: C.muted }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🛠</div>
          <div style={{ fontWeight: 700 }}>No repairs logged yet</div>
        </div>
      )}

      {/* Repair cards */}
      {visible.map(r => {
        const e      = eq.find(x => x.id === r.eqId)
        const cat    = getCat(e?.catId)
        const isOpen = r.status === 'Open'
        const isExp  = detail === r.id

        return (
          <div key={r.id} style={{ background: C.card, border: `1px solid ${isOpen ? C.red : C.border}`, borderRadius: 12, marginBottom: 10, overflow: 'hidden' }}>
            {/* Card header — tap to expand */}
            <div
              style={{ padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', cursor: 'pointer' }}
              onClick={() => setDetail(isExp ? null : r.id)}
            >
              <span style={{ fontSize: 18, flexShrink: 0 }}>{cat?.icon}</span>
              <div style={{ flex: 1, minWidth: 140 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{e?.name || 'Unknown'}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>{r.problem.slice(0, 60)}{r.problem.length > 60 ? '…' : ''}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: 'monospace', fontWeight: 700, color: r.total > 0 ? C.red : C.muted, fontSize: 15 }}>{inr(r.total)}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{fmtFull(r.date)}</div>
              </div>
              <span style={{ background: isOpen ? C.redDim : C.greenDim, color: isOpen ? C.red : C.green, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>{r.status}</span>
            </div>

            {/* Expanded detail */}
            {isExp && (
              <div style={{ padding: '0 14px 14px', borderTop: `1px solid ${C.border}` }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12, marginBottom: 12 }}>
                  {[
                    { l: 'Action Taken', v: r.action      || '—' },
                    { l: 'Parts Used',   v: r.parts        || '—' },
                    { l: 'Vendor',       v: r.vendor       || '—' },
                    { l: 'Labour Cost',  v: inr(r.labour)         },
                    { l: 'Parts Cost',   v: inr(r.parts_cost)     },
                    { l: 'Total Cost',   v: inr(r.total)          },
                  ].map(({ l, v }) => (
                    <div key={l} style={{ background: C.subtle, borderRadius: 8, padding: '8px 10px' }}>
                      <div style={{ fontSize: 10, color: C.muted, marginBottom: 3, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '.05em' }}>{l}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: l.includes('Cost') ? C.red : C.text }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={{ ...IB, fontSize: 12 }} onClick={() => { setDetail(null); setModal({ ...r }) }}>✏️ Edit</button>
                  <button style={{ ...IB, fontSize: 12, color: isOpen ? C.green : C.muted }} onClick={() => saveRepair({ ...r, status: isOpen ? 'Closed' : 'Open' })}>
                    {isOpen ? '🟢 Mark Closed' : '🔴 Reopen'}
                  </button>
                  <button style={{ ...DB, fontSize: 12 }} onClick={() => { setDetail(null); deleteRepair(r.id) }}>🗑 Delete</button>
                </div>
              </div>
            )}
          </div>
        )
      })}

      {modal !== null && (
        <RepairModal initial={modal.id ? modal : null} eq={eq} onSave={saveRepair} onClose={() => setModal(null)} />
      )}
    </div>
  )
}
