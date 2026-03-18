import { motion } from 'framer-motion'
import SectionStars from './SectionStars'

const FEATURES = [
  {
    icon: '🎤',
    title: 'הנחייה מגבשת וייחודית',
    desc: 'כל אירוע מקבל טון, קצב ואנרגיה מדויקים. הנחייה שמחברת את הקהל, מוציאה שמחה ויוצרת רגעים שנזכרים לשנים.',
    color: '#ff3b6b',
    glow: 'rgba(255,59,107,.18)',
    gradient: 'linear-gradient(135deg, rgba(255,59,107,.15), rgba(255,59,107,.04))',
    border: 'rgba(255,59,107,.22)',
  },
  {
    icon: '🎧',
    title: 'דיג׳י כלול בחבילה',
    desc: 'תקליטן מקצועי עם ציוד מהשורה הראשונה. מוזיקה שמניעה את הקהל — מהכניסה ועד הריקוד האחרון.',
    color: '#c026d3',
    glow: 'rgba(192,38,211,.18)',
    gradient: 'linear-gradient(135deg, rgba(192,38,211,.15), rgba(192,38,211,.04))',
    border: 'rgba(192,38,211,.22)',
  },
  {
    icon: '📆',
    title: 'לו״ז מסודר מא׳ עד ת׳',
    desc: 'ניהול מקצועי של הטיימינג לאורך כל הערב. אתם נהנים, אנחנו מוודאים שכל רגע מתנהל בדיוק כפי שתוכנן.',
    color: '#ff8cab',
    glow: 'rgba(255,140,171,.18)',
    gradient: 'linear-gradient(135deg, rgba(255,140,171,.15), rgba(255,140,171,.04))',
    border: 'rgba(255,140,171,.22)',
  },
  {
    icon: '📸',
    title: 'חבילת צילום מקצועית',
    desc: 'אופציה להרחבה לחבילת צילום:\n• מגנטים ללא הגבלה + סטילס\n• סטילס בלבד',
    color: '#facc15',
    glow: 'rgba(250,204,21,.14)',
    gradient: 'linear-gradient(135deg, rgba(250,204,21,.12), rgba(250,204,21,.03))',
    border: 'rgba(250,204,21,.20)',
  },
]

const cardVariants = {
  hidden:  { opacity: 0, y: 40, scale: 0.96 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.65, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Features() {
  return (
    <section id="features" className="reveal py-14 px-6 relative overflow-hidden">
      <SectionStars count={8} />
      {/* Section background blob */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(192,38,211,.06), transparent 70%)',
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold mb-4"
            style={{
              background: 'rgba(192,38,211,.10)',
              border: '1px solid rgba(192,38,211,.25)',
              color: '#d946ef',
            }}
          >
            ✦ מה כלול בחבילה
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="font-black text-white"
            style={{ fontSize: 'clamp(26px, 4vw, 42px)' }}
          >
            הכל תחת{' '}
            <span className="gradient-text">גג אחד</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mt-3 max-w-xl mx-auto"
            style={{ color: '#64748b', fontSize: '16px', lineHeight: 1.8 }}
          >
            חבילה מלאה שמכסה את כל מה שצריך לאירוע מושלם — בלי הטרחה של לחפש ולתאם בין ספקים שונים.
          </motion.p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              whileHover={{ y: -8, transition: { duration: 0.3, ease: 'easeOut' } }}
              className="feature-card group cursor-default"
              style={{
                background: f.gradient,
                border: `1px solid ${f.border}`,
                padding: '20px 18px',
                '--card-glow': f.glow,
              }}
            >
              {/* Icon bubble */}
              <div
                className="mb-3 w-11 h-11 rounded-xl flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: `rgba(255,255,255,.07)`,
                  border: `1px solid ${f.border}`,
                  boxShadow: `0 4px 20px ${f.glow}`,
                }}
              >
                {f.icon}
              </div>

              {/* Title */}
              <h3
                className="font-black mb-2 leading-snug"
                style={{ fontSize: '15px', color: '#f0f4ff' }}
              >
                {f.title}
              </h3>

              {/* Description */}
              <p
                style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.7, whiteSpace: 'pre-line' }}
              >
                {f.desc}
              </p>

              {/* Bottom accent line */}
              <div
                className="mt-3 h-0.5 rounded-full transition-all duration-300 group-hover:opacity-100"
                style={{
                  background: `linear-gradient(90deg, ${f.color}, transparent)`,
                  opacity: 0.35,
                  width: '60%',
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
