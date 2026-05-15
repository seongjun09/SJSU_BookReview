'use client'

import { useState } from 'react'

interface StarRatingProps {
  value: number
  onChange?: (value: number) => void
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function StarRating({
  value,
  onChange,
  readonly = false,
  size = 'md',
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0)

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  }

  const active = hovered || value

  return (
    <div
      className="flex items-center gap-0.5"
      onMouseLeave={() => !readonly && setHovered(0)}
      role={readonly ? undefined : 'radiogroup'}
      aria-label="별점"
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={readonly ? 'button' : 'button'}
          disabled={readonly}
          aria-label={readonly ? undefined : `${star}점`}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          className={[
            'transition-transform duration-100',
            readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110',
          ].join(' ')}
        >
          <svg
            className={sizeClasses[size]}
            viewBox="0 0 24 24"
            fill={star <= active ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={1.5}
            style={{
              color: star <= active ? 'var(--color-star)' : 'var(--color-muted-foreground)',
              opacity: star <= active ? 1 : 0.4,
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
            />
          </svg>
        </button>
      ))}
    </div>
  )
}
