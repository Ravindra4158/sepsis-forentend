import React from 'react'

const VARIANTS = {
  primary:   { bg:'var(--green)',    color:'var(--text-inverse)', border:'transparent' },
  secondary: { bg:'var(--cyan)',     color:'var(--text-inverse)', border:'transparent' },
  danger:    { bg:'var(--red)',      color:'#fff',                border:'transparent' },
  success:   { bg:'var(--green)',    color:'#fff',                border:'transparent' },
  ghost:     { bg:'rgba(255,255,255,0.58)', color:'var(--text-secondary)', border:'var(--border)' },
  outline:   { bg:'transparent',     color:'var(--green)',        border:'var(--green-border)' },
  'outline-red': { bg:'transparent', color:'var(--red)',          border:'var(--red-border)' },
}

const SIZES = {
  sm: { padding:'5px 12px',  fontSize:'0.78rem', height:'30px'  },
  md: { padding:'8px 18px',  fontSize:'0.85rem', height:'36px'  },
  lg: { padding:'11px 24px', fontSize:'0.95rem', height:'44px'  },
}

export default function Button({
  children, variant='primary', size='md', fullWidth=false,
  loading=false, disabled=false, icon, iconRight,
  onClick, type='button', style={}, ...props
}) {
  const v = VARIANTS[variant] || VARIANTS.primary
  const s = SIZES[size]       || SIZES.md

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        gap: 7, fontWeight: 600, letterSpacing: '0.02em',
        borderRadius: 'var(--radius-full)',
        border: `1px solid ${v.border}`,
        background: v.bg, color: v.color,
        width: fullWidth ? '100%' : undefined,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'var(--transition-fast)',
        whiteSpace: 'nowrap',
        boxShadow: variant === 'primary' || variant === 'secondary' ? 'var(--shadow-sm)' : 'none',
        ...s, ...style,
      }}
    >
      {loading
        ? <span style={{ width:14, height:14, border:`2px solid currentColor`,
            borderTopColor:'transparent', borderRadius:'50%',
            display:'inline-block', animation:'spin 0.7s linear infinite' }} />
        : icon && <span style={{ flexShrink:0 }}>{icon}</span>
      }
      {children}
      {!loading && iconRight && <span style={{ flexShrink:0 }}>{iconRight}</span>}
    </button>
  )
}
