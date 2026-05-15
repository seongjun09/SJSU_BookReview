'use client'

import { useState, useMemo, useEffect } from 'react'
import { BookCard, type Book } from './book-card'
import { BookStats } from './book-stats'
import { AddBookModal } from './add-book-modal'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

type SortKey = 'recent' | 'rating' | 'title'
type FilterGenre = '전체' | string

const GENRES_ALL = ['전체', '소설', '에세이', '자기계발', '역사', '과학', '철학', '시', '만화', '기타']

export function ReadingLog() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editBook, setEditBook] = useState<Book | null>(null)
  const [sortKey, setSortKey] = useState<SortKey>('recent')
  const [filterGenre, setFilterGenre] = useState<FilterGenre>('전체')
  const [search, setSearch] = useState('')

  // 데이터 가져오기
  const fetchBooks = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('read_at', { ascending: false })

      if (error) throw error
      setBooks(data || [])
    } catch (error) {
      console.error('Error fetching books:', error)
      toast.error('데이터를 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const filtered = useMemo(() => {
    let result = books

    if (filterGenre !== '전체') {
      result = result.filter((b) => b.genre === filterGenre)
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter(
        (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
      )
    }

    return [...result].sort((a, b) => {
      if (sortKey === 'recent') return new Date(b.read_at).getTime() - new Date(a.read_at).getTime()
      if (sortKey === 'rating') return b.rating - a.rating
      if (sortKey === 'title') return a.title.localeCompare(b.title, 'ko')
      return 0
    })
  }, [books, filterGenre, search, sortKey])

  const handleSave = async (data: Omit<Book, 'id'>) => {
    try {
      if (editBook) {
        const { error } = await supabase
          .from('books')
          .update(data)
          .eq('id', editBook.id)

        if (error) throw error
        toast.success('책 정보가 수정되었습니다.')
      } else {
        const { error } = await supabase
          .from('books')
          .insert([data])

        if (error) throw error
        toast.success('새로운 책이 등록되었습니다.')
      }
      fetchBooks()
      setEditBook(null)
    } catch (error) {
      console.error('Error saving book:', error)
      toast.error('저장 중 오류가 발생했습니다.')
    }
  }

  const handleEdit = (book: Book) => {
    setEditBook(book)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id)

      if (error) throw error
      setBooks((prev) => prev.filter((b) => b.id !== id))
      toast.success('책이 삭제되었습니다.')
    } catch (error) {
      console.error('Error deleting book:', error)
      toast.error('삭제 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold text-foreground leading-none">내 독서 노트</h1>
              <p className="text-xs text-muted-foreground mt-0.5">My Reading Journal</p>
            </div>
          </div>

          <button
            onClick={() => { setEditBook(null); setModalOpen(true) }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span className="hidden sm:inline">책 추가</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
        {/* Stats */}
        <BookStats books={books} />

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="search"
              placeholder="제목 또는 저자로 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
            />
          </div>

          {/* Sort */}
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="px-3 py-2 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
          >
            <option value="recent">최근 읽은 순</option>
            <option value="rating">별점 높은 순</option>
            <option value="title">제목 가나다순</option>
          </select>
        </div>

        {/* Genre filter */}
        <div className="flex gap-2 flex-wrap -mt-4">
          {GENRES_ALL.map((g) => (
            <button
              key={g}
              onClick={() => setFilterGenre(g)}
              className={[
                'px-3 py-1 rounded-full text-sm font-medium transition-colors border',
                filterGenre === g
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-muted-foreground border-border hover:text-foreground',
              ].join(' ')}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Book grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
              <svg className="w-8 h-8 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-foreground">아직 기록된 책이 없어요</p>
              <p className="text-sm text-muted-foreground mt-1">
                {search || filterGenre !== '전체' ? '검색 조건을 바꿔보세요' : '첫 번째 책을 기록해보세요'}
              </p>
            </div>
            {!search && filterGenre === '전체' && (
              <button
                onClick={() => { setEditBook(null); setModalOpen(true) }}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                책 추가하기
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((book) => (
              <BookCard key={book.id} book={book} onDelete={handleDelete} onEdit={handleEdit} />
            ))}
          </div>
        )}

        {/* Count */}
        {!loading && filtered.length > 0 && (
          <p className="text-sm text-muted-foreground text-center -mt-4">
            {filtered.length}권의 책
          </p>
        )}
      </main>

      <AddBookModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditBook(null) }}
        onSave={handleSave}
        editBook={editBook}
      />
    </div>
  )
}
