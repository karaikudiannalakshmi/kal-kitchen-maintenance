import { useState } from 'react'
import { FREQ, FREQ_ORDER } from '../data.js'
import { C, IS, PB, GB } from '../theme.js'
import { Field } from './Atoms.jsx'

export default function TaskModal({ initial, eqId, onSave, onClose }) {
  const [form, setForm] = useState(initial || { task: '', freq: 'W' })
  const fld = v => setForm(p => ({ ...p, ...v }))

  function submit() {
    if (!form.task.trim()) return
    onSave({ ...form, eqId })
    onClose()
  }

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.78)', backdropFilter: 'blur(4px)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
    >
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 22, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: C.accent, marginBottom: 18 }}>
          {form.id ? 'Edit PM Task' : 'Add PM Task'}
        </div>

        <Field label="Task Description">
          <textarea
            rows={3}
            value={form.task}
            onChange={e => fld({ task: e.target.value })}
            placeholder="e.g. Clean grease filter / drip tray"
            style={{ ...IS, resize: 'vertical' }}
          />
        </Field>

        <Field label="Frequency">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {FREQ_ORDER.map(fk => {
              const fr = FREQ[fk]
              return (
                <button key={fk} onClick={() => fld({ freq: fk })} style={{
                  padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  border: `1px solid ${form.freq === fk ? fr.color : C.border}`,
                  background: form.freq === fk ? fr.bg : 'transparent',
                  color: form.freq === fk ? fr.color : C.muted,
                }}>
                  {fr.label}
                </button>
              )
            })}
          </div>
        </Field>

        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ ...PB }} onClick={submit}>{form.id ? 'Save Changes' : 'Add Task'}</button>
          <button style={{ ...GB }} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
