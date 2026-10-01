-- =============================================================
-- Việt Phục Remix — Diễn đàn Cộng đồng (Supabase / PostgreSQL)
-- Chạy toàn bộ file này trong Supabase Dashboard → SQL Editor.
-- Sau đó đặt VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY trong .env
-- =============================================================

create extension if not exists pgcrypto;

-- ---------- Bảng ----------
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id text not null check (char_length(author_id) between 3 and 80),
  author_name text not null check (char_length(author_name) between 1 and 60),
  author_avatar text not null default '',
  author_token text not null,
  category text not null check (category in ('showcase', 'qa', 'culture', 'events')),
  title text not null check (char_length(title) between 1 and 140),
  content text not null default '' check (char_length(content) <= 5000),
  images text[] not null default '{}' check (cardinality(images) <= 6),
  tags text[] not null default '{}' check (cardinality(tags) <= 10),
  look jsonb,
  likes_count integer not null default 0,
  comments_count integer not null default 0,
  reports_count integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists posts_created_at_idx on public.posts (created_at desc);
create index if not exists posts_tags_idx on public.posts using gin (tags);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  parent_id uuid references public.comments (id) on delete cascade,
  author_id text not null,
  author_name text not null check (char_length(author_name) between 1 and 60),
  author_avatar text not null default '',
  author_token text not null,
  content text not null check (char_length(content) between 1 and 1500),
  likes_count integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists comments_post_idx on public.comments (post_id, created_at);

create table if not exists public.post_likes (
  post_id uuid not null references public.posts (id) on delete cascade,
  user_id text not null,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table if not exists public.comment_likes (
  comment_id uuid not null references public.comments (id) on delete cascade,
  user_id text not null,
  created_at timestamptz not null default now(),
  primary key (comment_id, user_id)
);

create table if not exists public.post_reports (
  post_id uuid not null references public.posts (id) on delete cascade,
  user_id text not null,
  reason text not null default '' check (char_length(reason) <= 300),
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

-- ---------- Trigger đếm ----------
create or replace function public.bump_counter() returns trigger
language plpgsql security definer set search_path = public as $$
declare d integer := case when tg_op = 'INSERT' then 1 else -1 end;
begin
  if tg_table_name = 'post_likes' then
    update posts set likes_count = greatest(0, likes_count + d) where id = coalesce(new.post_id, old.post_id);
  elsif tg_table_name = 'comment_likes' then
    update comments set likes_count = greatest(0, likes_count + d) where id = coalesce(new.comment_id, old.comment_id);
  elsif tg_table_name = 'post_reports' then
    update posts set reports_count = greatest(0, reports_count + d) where id = coalesce(new.post_id, old.post_id);
  elsif tg_table_name = 'comments' then
    update posts set comments_count = greatest(0, comments_count + d) where id = coalesce(new.post_id, old.post_id);
  end if;
  return null;
end $$;

drop trigger if exists post_likes_count on public.post_likes;
create trigger post_likes_count after insert or delete on public.post_likes for each row execute function public.bump_counter();
drop trigger if exists comment_likes_count on public.comment_likes;
create trigger comment_likes_count after insert or delete on public.comment_likes for each row execute function public.bump_counter();
drop trigger if exists post_reports_count on public.post_reports;
create trigger post_reports_count after insert or delete on public.post_reports for each row execute function public.bump_counter();
drop trigger if exists comments_count on public.comments;
create trigger comments_count after insert or delete on public.comments for each row execute function public.bump_counter();

-- Khách không được tự đặt bộ đếm khi tạo bài
create or replace function public.reset_counters() returns trigger language plpgsql as $$
begin
  new.likes_count := 0;
  new.comments_count := 0;
  new.reports_count := 0;
  new.created_at := now();
  return new;
end $$;
drop trigger if exists posts_reset_counters on public.posts;
create trigger posts_reset_counters before insert on public.posts for each row execute function public.reset_counters();

-- ---------- Xóa nội dung của chính mình bằng token thiết bị ----------
create or replace function public.delete_own_post(p_id uuid, p_token text) returns void
language sql security definer set search_path = public as $$
  delete from posts where id = p_id and author_token = p_token;
$$;

create or replace function public.delete_own_comment(p_id uuid, p_token text) returns void
language sql security definer set search_path = public as $$
  delete from comments where id = p_id and author_token = p_token;
$$;

-- ---------- Row Level Security ----------
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.post_likes enable row level security;
alter table public.comment_likes enable row level security;
alter table public.post_reports enable row level security;

drop policy if exists "read posts" on public.posts;
create policy "read posts" on public.posts for select using (true);
drop policy if exists "create posts" on public.posts;
create policy "create posts" on public.posts for insert with check (true);

drop policy if exists "read comments" on public.comments;
create policy "read comments" on public.comments for select using (true);
drop policy if exists "create comments" on public.comments;
create policy "create comments" on public.comments for insert with check (true);

drop policy if exists "likes rw" on public.post_likes;
create policy "likes rw" on public.post_likes for all using (true) with check (true);
drop policy if exists "comment likes rw" on public.comment_likes;
create policy "comment likes rw" on public.comment_likes for all using (true) with check (true);
drop policy if exists "reports insert" on public.post_reports;
create policy "reports insert" on public.post_reports for insert with check (true);

-- Ẩn token khỏi API đọc công khai
revoke select on public.posts from anon, authenticated;
grant select (id, author_id, author_name, author_avatar, category, title, content, images, tags, look,
              likes_count, comments_count, reports_count, created_at) on public.posts to anon, authenticated;
revoke select on public.comments from anon, authenticated;
grant select (id, post_id, parent_id, author_id, author_name, author_avatar, content, likes_count, created_at)
  on public.comments to anon, authenticated;
grant insert on public.posts, public.comments, public.post_reports to anon, authenticated;
grant select, insert, delete on public.post_likes, public.comment_likes to anon, authenticated;
grant execute on function public.delete_own_post(uuid, text), public.delete_own_comment(uuid, text) to anon, authenticated;

-- ---------- Storage bucket cho ảnh ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('community', 'community', true, 3145728, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

drop policy if exists "community images upload" on storage.objects;
create policy "community images upload" on storage.objects for insert
  with check (bucket_id = 'community' and (storage.foldername(name))[1] = 'posts');
drop policy if exists "community images read" on storage.objects;
create policy "community images read" on storage.objects for select using (bucket_id = 'community');
