import { useEffect, useState } from 'react'

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789█▓▒░'

const randomChar = () => CHARSET[Math.floor(Math.random() * CHARSET.length)]

export const ShuffleNoticiasTitle = ({ text = 'NOTICIAS', className = '' }) => {
  const [display, setDisplay] = useState(() => text.split('').map(() => ' '))

  useEffect(() => {
    const target = text.split('')
    setDisplay(target.map(() => ' '))
    let frame = 0
    const totalFrames = 45
    const interval = setInterval(() => {
      frame += 1
      setDisplay(() =>
        target.map((ch, i) => {
          if (ch === ' ') return ' '
          const settleStart = 8 + i * 3
          if (frame >= totalFrames) return ch
          if (frame >= settleStart) return ch
          return randomChar()
        })
      )
      if (frame >= totalFrames) clearInterval(interval)
    }, 45)
    return () => clearInterval(interval)
  }, [text])

  return (
    <h1
      className={`select-none text-center ${className}`}
      style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 'clamp(1rem, 4vw, 1.75rem)',
        letterSpacing: '0.06em',
        color: '#f2f2f2',
        textShadow: '3px 3px 0 #000, 5px 5px 0 rgba(40,40,40,0.8)',
      }}
      aria-label={text}
    >
      {display.map((c, idx) => (
        <span key={`${idx}-${c}`} className="inline-block min-w-[0.45ch] text-center">
          {c}
        </span>
      ))}
    </h1>
  )
}
