import { useState } from 'react'

const PHOTO_OPTIONS = [
  { value: 'צלם מגנטים + סטילס', label: 'צלם מגנטים + סטילס' },
  { value: 'צלם סטילס',          label: 'צלם סטילס' },
  { value: 'לא מעוניינ/ת',       label: 'לא מעוניינ/ת' },
]

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  )
}

export default function ContactForm() {
  const [fields, setFields] = useState({
    name: '', phone: '', event: '', photo: '', notes: '',
  })
  const [errors, setErrors]   = useState({})
  const [sent,   setSent]     = useState(false)

  const set = (k, v) => setFields(f => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!fields.name.trim())  e.name  = true
    if (!fields.phone.trim()) e.phone = true
    if (!fields.event.trim()) e.event = true
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const sendWhatsApp = () => {
    if (!validate()) {
      alert('נא למלא שם מלא, טלפון וסוג אירוע לפני שליחה.')
      return
    }
    const lines = [
      'היי איתי! אשמח להשאיר פרטים לאירוע מטורף 🎉',
      'שם: '        + fields.name,
      'טלפון: '     + fields.phone,
      'סוג אירוע: ' + fields.event,
      'חבילת צילום: ' + (fields.photo || '-'),
      'הערות: '     + (fields.notes || '-'),
      '',
    ]
    window.open(
      'https://wa.me/972559950111?text=' + encodeURIComponent(lines.join('\n')),
      '_blank',
    )
    setSent(true)
  }

  const fieldStyle = (key) => ({
    background:  errors[key] ? 'rgba(255,59,107,.08)' : 'rgba(255,255,255,.06)',
    border:      `1px solid ${errors[key] ? '#ff3b6b' : 'rgba(255,255,255,.12)'}`,
    borderRadius: '12px',
    color: '#f0f4ff',
    width: '100%',
    padding: '13px 16px',
    fontSize: '16px',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color .15s, background .15s, box-shadow .15s',
  })

  return (
    <section id="form" className="reveal pb-24 px-6">
      <div className="max-w-2xl mx-auto">

        {/* Glass card */}
        <div
          className="rounded-3xl p-10 md:p-14"
          style={{
            background:     'rgba(255,255,255,.04)',
            backdropFilter: 'blur(24px)',
            border:         '1px solid rgba(255,255,255,.09)',
            boxShadow:      '0 32px 96px rgba(0,0,0,.55)',
          }}
        >
          {/* Header */}
          <div className="mb-8">
            <h2
              className="font-black text-white mb-2"
              style={{ fontSize: 'clamp(22px, 3vw, 30px)' }}
            >
              בדוק זמינות —{' '}
              <span className="gradient-text">בלי התחייבות</span>
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '15px' }}>
              מלא את הפרטים ואחזור אליך תוך 24 שעות עם הצעה מותאמת אישית.
            </p>
          </div>

          {/* ── Form fields ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Label text="שם מלא">
              <input
                type="text"
                placeholder="ישראל ישראלי"
                value={fields.name}
                onChange={e => set('name', e.target.value)}
                style={fieldStyle('name')}
                onFocus={e => { e.target.style.borderColor = '#ff3b6b'; e.target.style.boxShadow = '0 0 0 4px rgba(255,59,107,.13)' }}
                onBlur={e =>  { if (!errors.name) { e.target.style.borderColor = 'rgba(255,255,255,.12)'; e.target.style.boxShadow = 'none' } }}
              />
            </Label>
            <Label text="טלפון נייד">
              <input
                type="tel"
                placeholder="05X-XXXXXXX"
                value={fields.phone}
                onChange={e => set('phone', e.target.value)}
                style={fieldStyle('phone')}
                onFocus={e => { e.target.style.borderColor = '#ff3b6b'; e.target.style.boxShadow = '0 0 0 4px rgba(255,59,107,.13)' }}
                onBlur={e =>  { if (!errors.phone) { e.target.style.borderColor = 'rgba(255,255,255,.12)'; e.target.style.boxShadow = 'none' } }}
              />
            </Label>
          </div>

          <div className="mb-5">
            <Label text="סוג האירוע">
              <input
                type="text"
                placeholder="בר/בת מצווה, יום הולדת, אירוע חברה..."
                value={fields.event}
                onChange={e => set('event', e.target.value)}
                style={fieldStyle('event')}
                onFocus={e => { e.target.style.borderColor = '#ff3b6b'; e.target.style.boxShadow = '0 0 0 4px rgba(255,59,107,.13)' }}
                onBlur={e =>  { if (!errors.event) { e.target.style.borderColor = 'rgba(255,255,255,.12)'; e.target.style.boxShadow = 'none' } }}
              />
            </Label>
          </div>

          {/* Photographer radio */}
          <div className="mb-5">
            <p
              className="mb-3 font-extrabold tracking-widest"
              style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}
            >
              הוסף צלם (מעבר לדיג׳י הכלול)
            </p>
            <div className="flex flex-wrap gap-2">
              {PHOTO_OPTIONS.map(opt => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 cursor-pointer rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-150"
                  style={{
                    background:   fields.photo === opt.value ? 'rgba(255,59,107,.15)' : 'rgba(255,255,255,.05)',
                    border:       `1px solid ${fields.photo === opt.value ? 'rgba(255,59,107,.4)' : 'rgba(255,255,255,.10)'}`,
                    color:        fields.photo === opt.value ? '#ff8cab' : '#94a3b8',
                  }}
                >
                  <input
                    type="radio"
                    name="photo"
                    value={opt.value}
                    checked={fields.photo === opt.value}
                    onChange={e => set('photo', e.target.value)}
                    className="accent-[#ff3b6b]"
                    style={{ accentColor: '#ff3b6b' }}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-7">
            <Label text="הערות נוספות">
              <textarea
                placeholder="מה חשוב לך לציין?"
                rows={4}
                value={fields.notes}
                onChange={e => set('notes', e.target.value)}
                style={{ ...fieldStyle('notes'), resize: 'vertical', minHeight: '100px' }}
                onFocus={e => { e.target.style.borderColor = '#ff3b6b'; e.target.style.boxShadow = '0 0 0 4px rgba(255,59,107,.13)' }}
                onBlur={e =>  { e.target.style.borderColor = 'rgba(255,255,255,.12)'; e.target.style.boxShadow = 'none' }}
              />
            </Label>
          </div>

          {/* Send button */}
          {sent ? (
            <div
              className="w-full rounded-2xl py-4 text-center font-black text-lg"
              style={{ background: 'rgba(74,222,128,.12)', border: '1px solid rgba(74,222,128,.3)', color: '#4ade80' }}
            >
              ✅ תודה! קיבלנו את הפרטים — נחזור אליך ממש בקרוב.
            </div>
          ) : (
            <button
              type="button"
              onClick={sendWhatsApp}
              className="w-full flex items-center justify-center gap-3 rounded-2xl py-4 text-white font-black text-lg transition-all duration-200 hover:-translate-y-1"
              style={{
                background:  'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                boxShadow:   '0 6px 28px rgba(37,211,102,.36)',
                fontSize:    '17px',
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 12px 40px rgba(37,211,102,.52)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 6px 28px rgba(37,211,102,.36)')}
            >
              <WhatsAppIcon />
              שליחת פרטים ב־WhatsApp
            </button>
          )}

          <p className="text-center mt-3 text-xs" style={{ color: '#475569' }}>
            לעולם לא נמסור את הפרטים שלך לגורם אחר.
          </p>

          {/* Direct WhatsApp link */}
          <div className="flex justify-start mt-4">
            <button
              type="button"
              onClick={() => window.open('https://wa.me/972559950111', '_blank')}
              className="text-sm font-bold transition-colors duration-150"
              style={{ color: '#4ade80', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              onMouseEnter={e => (e.currentTarget.style.color = '#86efac')}
              onMouseLeave={e => (e.currentTarget.style.color = '#4ade80')}
            >
              💬 להודעה ישירה בוואטסאפ
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function Label({ text, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span
        className="font-extrabold tracking-widest"
        style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}
      >
        {text}
      </span>
      {children}
    </label>
  )
}
