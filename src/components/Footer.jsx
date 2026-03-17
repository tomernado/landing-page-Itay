export default function Footer() {
  return (
    <footer
      className="text-center py-10 px-6 text-sm"
      style={{
        color:      '#334155',
        borderTop:  '1px solid rgba(255,255,255,.06)',
      }}
    >
      <p className="mb-1">© 2025 איתי יצחקי — כל הזכויות שמורות</p>
      <p>
        אתר זה נבנה על ידי{' '}
        <a
          href="https://www.linkedin.com/in/tomer-cohen-486457346/"
          target="_blank"
          rel="noopener"
          style={{ color: '#475569', textDecoration: 'underline', textUnderlineOffset: '3px' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#ff8cab')}
          onMouseLeave={e => (e.currentTarget.style.color = '#475569')}
        >
          תומר כהן
        </a>
      </p>
    </footer>
  )
}
