import { useState } from 'react'
import { CATS, DEFAULT_TASKS, getCat } from '../data.js'
import { C, IS, PB, GB, SL } from '../theme.js'
import { Field } from './Atoms.jsx'

export default function EqModal({ initial, onSave, onClose }) {
  const blank = { name: '', catId: 'cooking', subtype: '', loc: 'Main Kitchen', make: '', model: '', installDate: '' }
  const [form, setForm] = useState(initial || blank)
  const fld = v => setForm(p => ({ ...p, ...v }))
  const subtypes = getCat(form.catId)?.subtypes || []
  const taskCount = DEFAULT_TASKS[form.catId]?.length || 0

  function submit() {
    if (!form.name.trim()) return
    onSave(form)
    onClose()
  }

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.78)', backdropFilter: 'blur(4px)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
    >
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 22, width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: C.accent, marginBottom: 18 }}>
          {form.id ? 'Edit Equipment' : 'Add Equipment'}
        </div>

        <Field label="Equipment Name *">
          <input value={form.name} onChange={e => fld({ name: e.target.value })} placeholder="e.g. Combi Oven (Hall 2)" style={{ ...IS }} />
        </Field>
        <Field label="Category *">
          <select value={form.catId} onChange={e => fld({ catId: e.target.value, subtype: '' })} style={{ ...IS }}>
            {CATS.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
          </select>
        </Field>
        <Field label="Sub-type">
          <select value={form.subtype} onChange={e => fld({ subtype: e.target.value })} style={{ ...IS }}>
            <option value="">— Select sub-type —</option>
            {subtypes.map(s => <option key={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Location">
          <input value={form.loc} onChange={e => fld({ loc: e.target.value })} placeholder="e.g. Main Kitchen" style={{ ...IS }} />
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Field label="Make / Brand">
            <input value={form.make} onChange={e => fld({ make: e.target.value })} placeholder="e.g. Rational" style={{ ...IS }} />
          </Field>
          <Field label="Model No.">
            <input value={form.model} onChange={e => fld({ model: e.target.value })} placeholder="e.g. SCC 61" style={{ ...IS }} />
          </Field>
        </div>
        <Field label="Installation Date">
          <input type="date" value={form.installDate} onChange={e => fld({ installDate: e.target.value })} style={{ ...IS }} />
        </Field>

        {!form.id && (
          <div style={{ background: C.subtle, borderRadius: 8, padding: '10px 14px', fontSize: 12, color: C.muted, marginBottom: 14 }}>
            💡 <strong style={{ color: C.text }}>{taskCount} default PM tasks</strong> for {getCat(form.catId)?.label} will be auto-loaded.
          </div>
        )}

        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ ...PB }} onClick={submit}>{form.id ? 'Save Changes' : 'Add Equipment'}</button>
          <button style={{ ...GB }} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
