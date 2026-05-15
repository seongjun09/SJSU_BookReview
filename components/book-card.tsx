'use client'

import { useState } from 'react'
import { StarRating } from './star-rating'

export interface Book {
  id: string
  title: string
  author: string
  cover_color: string
  rating: number
  memo: string
  read_at: string
  genre: string
}

interface BookCardProps {
  book: Book
  onDelete: (id: string) => void
  onEdit: (book: Book) => void
}

const SPINE_PATTERNS = [
  'repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(255,255,255,0.06) 8px, rgba(255,255,255,0.06) 9px)',
  'none',
  'repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(255,255,255,0.05) 6px, rgba(255,255,255,0.05) 7px)',
]

export function BookCard({ book, onDelete, onEdit }: BookCardProps) {
  const [showMemo, setShowMemo] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const patternIndex = book.id.charCodeAt(0) % SPINE_PATTERNS.length

  return (
    <article className="group relative flex flex-col bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Book cover area */}
      <div
        className="h-40 relative flex items-end p-4"
        style={{ background: book.cover_color, backgroundImage: SPINE_PATTERNS[patternIndex] }}
      >
        {/* Shine overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

        {/* Genre badge */}
        <span className="relative z-10 text-xs font-medium px-2 py-0.5 rounded-full bg-black/20 text-white/90 backdrop-blur-sm">
          {book.genre}
        </span>

        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button
            onClick={() => onEdit(book)}
            className="w-7 h-7 rounded-full bg-white/80 hover:bg-white text-foreground flex items-center justify-center shadow-sm transition-colors"
            aria-label="수정"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
            </svg>
          </button>
          {confirmDelete ? (
            <button
              onClick={() => onDelete(book.id)}
              className="w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-sm transition-colors"
              aria-label="삭제 확인"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              onBlur={() => setTimeout(() => setConfirmDelete(false), 200)}
              className="w-7 h-7 rounded-full bg-white/80 hover:bg-red-100 text-foreground hover:text-red-600 flex items-center justify-center shadow-sm transition-colors"
              aria-label="삭제"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Book info */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        <div>
          <h3 className="font-semibold text-foreground leading-snug text-balance line-clamp-2">{book.title}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">{book.author}</p>
        </div>

        <div className="flex items-center justify-between">
          <StarRating value={book.rating} readonly size="sm" />
          <time className="text-xs text-muted-foreground">
            {new Date(book.read_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </time>
        </div>

        {/* Memo toggle */}
        {book.memo && (
          <button
            onClick={() => setShowMemo((v) => !v)}
            className="mt-1 text-left text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            <svg className={`w-3.5 h-3.5 transition-transform ${showMemo ? 'rotate-90' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
            {showMemo ? '메모 접기' : '메모 보기'}
          </button>
        )}
        {showMemo && book.memo && (
          <p className="text-sm text-foreground/80 leading-relaxed bg-secondary/60 rounded-lg p-3 border-l-2 border-accent">
            {book.memo}
          </p>
        )}
      </div>
    </article>
  )
}
