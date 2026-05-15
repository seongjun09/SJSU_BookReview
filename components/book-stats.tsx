import type { Book } from './book-card'

interface BookStatsProps {
  books: Book[]
}

export function BookStats({ books }: BookStatsProps) {
  const total = books.length
  const avgRating = total > 0 ? books.reduce((s, b) => s + b.rating, 0) / total : 0
  const thisYear = new Date().getFullYear()
  const thisYearCount = books.filter((b) => new Date(b.read_at).getFullYear() === thisYear).length

  const stats = [
    { label: '총 독서', value: total, unit: '권' },
    { label: '평균 별점', value: avgRating.toFixed(1), unit: '점' },
    { label: `${thisYear}년`, value: thisYearCount, unit: '권' },
  ]

  return (
    <div className="flex gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="flex-1 bg-card border border-border rounded-xl p-4 text-center shadow-sm"
        >
          <div className="text-2xl font-bold text-primary font-serif">
            {s.value}
            <span className="text-sm font-normal text-muted-foreground ml-0.5">{s.unit}</span>
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
        </div>
      ))}
    </div>
  )
}
