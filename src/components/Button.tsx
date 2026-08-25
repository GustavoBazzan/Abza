import { useState, type ButtonHTMLAttributes, type CSSProperties } from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const SIZES: Record<Size, { height: number; padding: string; fontSize: number; gap: number }> = {
  sm: { height: 38, padding: '0 18px', fontSize: 14, gap: 8 },
  md: { height: 46, padding: '0 24px', fontSize: 15, gap: 9 },
  lg: { height: 56, padding: '0 32px', fontSize: 17, gap: 10 },
};

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  style?: CSSProperties;
}

export function Button({ children, variant = 'primary', size = 'md', fullWidth = false, disabled = false, style, ...rest }: ButtonProps) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const s = SIZES[size];

  const base: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s.gap,
    height: s.height,
    padding: s.padding,
    fontSize: s.fontSize,
    fontFamily: 'var(--font-text)',
    fontWeight: 'var(--fw-bold)',
    letterSpacing: '.005em',
    borderRadius: 'var(--radius-pill)',
    border: '1.5px solid transparent',
    cursor: 'pointer',
    width: fullWidth ? '100%' : 'auto',
    whiteSpace: 'nowrap',
    textDecoration: 'none',
    transition: 'background 120ms var(--ease-standard), color 120ms var(--ease-standard), border-color 120ms var(--ease-standard), box-shadow 120ms var(--ease-standard), transform 120ms var(--ease-standard)',
    transform: press ? 'translateY(1px)' : 'none',
    opacity: disabled ? 0.5 : 1,
    pointerEvents: disabled ? 'none' : 'auto',
  };

  const variants: Record<Variant, CSSProperties> = {
    primary: {
      background: hover ? 'var(--color-accent-hover)' : 'var(--abza-red)',
      color: '#fff',
      boxShadow: hover ? 'var(--shadow-red)' : 'var(--shadow-red-sm)',
    },
    secondary: {
      background: hover ? 'var(--ink-800)' : 'var(--ink-900)',
      color: '#fff',
      boxShadow: hover ? 'var(--shadow-md)' : 'var(--shadow-sm)',
    },
    outline: {
      background: hover ? 'var(--ink-900)' : 'transparent',
      color: hover ? '#fff' : 'var(--ink-900)',
      borderColor: 'var(--ink-900)',
    },
    ghost: {
      background: hover ? 'var(--color-accent-soft)' : 'transparent',
      color: 'var(--abza-red)',
    },
  };

  return (
    <button
      style={{ ...base, ...variants[variant], ...style }}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      {...rest}
    >
      {children}
    </button>
  );
}
