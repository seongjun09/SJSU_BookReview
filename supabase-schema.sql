-- 1. books 테이블 생성
create table public.books (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now() not null,
  title text not null,
  author text not null,
  cover_color text default '#8B5E3C',
  rating int2 check (rating >= 0 and rating <= 5) default 0,
  memo text,
  read_at date default now() not null,
  genre text default '소설',
  user_id uuid default auth.uid() -- 로그인 기능을 대비해 사용자 ID 컬럼 추가
);

-- 2. RLS(Row Level Security) 설정 (보안)
alter table public.books enable row level security;

-- 3. 정책 설정 (개발 단계용: 누구나 모든 권한)
-- 참고: 실제 배포 시에는 'auth.uid() = user_id' 조건으로 제한하는 것이 보안상 안전합니다.
create policy "Anyone can do anything" on public.books
  for all
  using (true)
  with check (true);

-- 4. 인덱스 추가 (조회 성능 향상)
create index idx_books_user_id on public.books(user_id);
create index idx_books_read_at on public.books(read_at desc);
