import { useState } from 'react'
import { getCat } from '../data.js'
import { C, IS, PB, GB } from '../theme.js'
import { todayStr, inr } from '../utils.js'
import { Field } from './Atoms.jsx'

export default function RepairModal({ initial, eq, onSave, onClose }) {
  const blank = {
    eqId: eq[0]?.id || '',
    date: todayStr(),
    problem: '',
    action: '',
    parts: '',
    vendor: '',
    labour: 0,
    parts_cost: 0,
    status: 'Open',
  }
  const [form, setForm] = useState(initial || blank)
  const fld = v => setForm(p => ({ ...p, ...v }))
  const total = (Number(form.labour) || 0) + (Number(form.parts_cost) || 0)

  function submit() {
    if (!form.eqId || !form.problem.trim()) return
    onSave({ ...form, labour: Number(form.labour) || 0, parts_cost: Number(form.parts_cost) || 0, total })
    onClose()
  }

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.78)', backdropFilter: 'blur(4px)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
    >
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 22, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: C.red, marginBottom: 18 }}>
          {form.id ? 'Edit Repair Log' : 'Log Repair'}
        </div>

        <Field label="Equipment *">
          <select value={form.eqId} onChange={e => fld({ eqId: e.target.value })} style={{ ...IS }}>
            {eq.map(e => {
              const cat = getCat(e.catId)
              return <option key={e.id} value={e.id}>{cat?.icon} {e.name}</option>
            })}
          </select>
        </Field>

        <Field label="Date *">
          <input type="date" value={form.date} onChange={e => fld({ date: e.target.value })} style={{ ...IS }} />
        </Field>

        <Field label="Problem / Issue *">
          <textarea rows={2} value={form.problem} onChange={e => fld({ problem: e.target.value })}
            placeholder="Describe what went wrong" style={{ ...IS, resize: 'vertical' }} />
        </Field>

        <Field label="Action Taken">
          <textarea rows={2} value={form.action} onChange={e => fld({ action: e.target.value })}
            placeholder="What was done to fix it" style={{ ...IS, resize: 'vertical' }} />
        </Field>

        <Field label="Parts Replaced / Used">
          <input value={form.parts} onChange={e => fld({ parts: e.target.value })}
            placeholder="e.g. Thermostat unit, solenoid valve" style={{ ...IS }} />
        </Field>

        <Field label="Vendor / Technician">
          <input value={form.vendor} onChange={e => fld({ vendor: e.target.value })}
            placeholder="e.g. AMC Team, In-house" style={{ ...IS }} />
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Field label="Labour Cost (₹)">
            <input type="number" value={form.labour} onChange={e => fld({ labour: e.target.value })} style={{ ...IS }} />
          </Field>
          <Field label="Parts Cost (₹)">
            <input type="number" value={form.parts_cost} onChange={e => fld({ parts_cost: e.target.value })} style={{ ...IS }} />
          </Field>
        </div>

        <div style={{ background: C.subtle, borderRadius: 8, padding: '10px 14px', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: C.muted }}>Total Cost</span>
          <span style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 700, color: C.red }}>{inr(total)}</span>
        </div>

        <Field label="Status">
          <div style={{ display: 'flex', gap: 8 }}>
            {['Open', 'Closed'].map(s => (
              <button key={s} onClick={() => fld({ status: s })} style={{
                padding: '6px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                border: `1px solid ${form.status === s ? (s === 'Open' ? C.red : C.green) : C.border}`,
                background: form.status === s ? (s === 'Open' ? C.redDim : C.greenDim) : 'transparent',
                color: form.status === s ? (s === 'Open' ? C.red : C.green) : C.muted,
              }}>
                {s === 'Open' ? '🔴 Open' : '🟢 Closed'}
              </button>
            ))}
          </div>
        </Field>

        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <button style={{ ...PB }} onClick={submit}>{form.id ? 'Save Changes' : 'Log Repair'}</button>
          <button style={{ ...GB }} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
