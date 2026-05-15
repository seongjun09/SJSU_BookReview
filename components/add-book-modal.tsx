'use client'

import { useEffect, useState } from 'react'
import { StarRating } from './star-rating'
import type { Book } from './book-card'

const COVER_COLORS = [
  '#8B5E3C', '#5C6B4A', '#2D4A6E', '#7A3B3B',
  '#4A5568', '#6B4A7A', '#3B6B5A', '#7A6B3B',
  '#5A3B6B', '#3B5A6B', '#6B5A3B', '#3B6B3B',
]

const GENRES = ['소설', '에세이', '자기계발', '역사', '과학', '철학', '시', '만화', '기타']

interface AddBookModalProps {
  open: boolean
  onClose: () => void
  onSave: (book: Omit<Book, 'id'>) => void
  editBook?: Book | null
}

const emptyForm = {
  title: '',
  author: '',
  cover_color: COVER_COLORS[0],
  rating: 0,
  memo: '',
  read_at: new Date().toISOString().slice(0, 10),
  genre: '소설',
}

export function AddBookModal({ open, onClose, onSave, editBook }: AddBookModalProps) {
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (editBook) {
      setForm({
        title: editBook.title,
        author: editBook.author,
        cover_color: editBook.cover_color,
        rating: editBook.rating,
        memo: editBook.memo,
        read_at: editBook.read_at.slice(0, 10),
        genre: editBook.genre,
      })
    } else {
      setForm(emptyForm)
    }
  }, [editBook, open])

  if (!open) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.author.trim()) return
    onSave(form)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-serif text-lg font-semibold text-foreground">
            {editBook ? '책 수정하기' : '새 책 기록하기'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="닫기"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
          {/* Cover color picker */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">책 표지 색상</label>
            <div className="flex flex-wrap gap-2">
              {COVER_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, cover_color: color }))}
                  className="w-8 h-8 rounded-lg border-2 transition-transform hover:scale-110"
                  style={{
                    background: color,
                    borderColor: form.cover_color === color ? 'var(--color-foreground)' : 'transparent',
                    transform: form.cover_color === color ? 'scale(1.15)' : undefined,
                  }}
                  aria-label={`색상 ${color}`}
                />
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className="text-sm font-medium text-foreground">
              책 제목 <span className="text-destructive">*</span>
            </label>
            <input
              id="title"
              type="text"
              required
              placeholder="ex. 채식주의자"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
            />
          </div>

          {/* Author */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="author" className="text-sm font-medium text-foreground">
              저자 <span className="text-destructive">*</span>
            </label>
            <input
              id="author"
              type="text"
              required
              placeholder="ex. 한강"
              value={form.author}
              onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
            />
          </div>

          {/* Genre + Date */}
          <div className="flex gap-3">
            <div className="flex flex-col gap-1.5 flex-1">
              <label htmlFor="genre" className="text-sm font-medium text-foreground">장르</label>
              <select
                id="genre"
                value={form.genre}
                onChange={(e) => setForm((f) => ({ ...f, genre: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
              >
                {GENRES.map((g) => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <label htmlFor="read_at" className="text-sm font-medium text-foreground">읽은 날짜</label>
              <input
                id="read_at"
                type="date"
                value={form.read_at}
                onChange={(e) => setForm((f) => ({ ...f, read_at: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
              />
            </div>
          </div>

          {/* Rating */}
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground">별점</span>
            <StarRating value={form.rating} onChange={(v) => setForm((f) => ({ ...f, rating: v }))} size="lg" />
          </div>

          {/* Memo */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="memo" className="text-sm font-medium text-foreground">메모</label>
            <textarea
              id="memo"
              rows={4}
              placeholder="이 책에 대한 생각이나 인상 깊었던 구절을 적어보세요..."
              value={form.memo}
              onChange={(e) => setForm((f) => ({ ...f, memo: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition resize-none leading-relaxed"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              {editBook ? '수정 완료' : '기록 저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
