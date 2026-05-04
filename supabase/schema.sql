-- ============================================
-- Dourous-Net – Supabase SQL Setup (Updated)
-- ============================================

-- 1. STUDENTS TABLE (Public profile for Auth users)
create table if not exists public.students (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz default now()
);

-- 2. TEACHERS TABLE
create table if not exists public.teachers (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  subject     text not null,
  description text,
  photo_url   text,
  created_at  timestamptz default now()
);

-- 3. SESSIONS TABLE
create table if not exists public.sessions (
  id                uuid primary key default gen_random_uuid(),
  student_id        uuid not null references auth.users(id) on delete cascade,
  teacher_id        uuid not null references public.teachers(id) on delete cascade,
  date              date not null,
  time              text,
  status            text not null default 'pending'
                      check (status in ('pending','confirmed','completed')),
  homework_file_url text,
  created_at        timestamptz default now()
);

-- 4. ROW LEVEL SECURITY
alter table public.students enable row level security;
create policy "Students can view own profile" on public.students for select using (auth.uid() = id);
create policy "Students can update own profile" on public.students for update using (auth.uid() = id);

alter table public.teachers enable row level security;
create policy "Teachers are viewable by authenticated users" on public.teachers for select to authenticated using (true);

alter table public.sessions enable row level security;
create policy "Students can view own sessions" on public.sessions for select to authenticated using (auth.uid() = student_id);
create policy "Students can insert own sessions" on public.sessions for insert to authenticated with check (auth.uid() = student_id);

-- 5. TRIGGER: Create student profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.students (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 6. STORAGE – homeworks bucket
insert into storage.buckets (id, name, public) values ('homeworks', 'homeworks', true) on conflict (id) do nothing;

create policy "Authenticated users can upload homeworks"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'homeworks' AND auth.uid()::text = (storage.foldername(name))[1]);

create policy "Homeworks are publicly readable"
  on storage.objects for select to public using (bucket_id = 'homeworks');

-- 7. SAMPLE DATA (Teachers)
insert into public.teachers (name, subject, description, photo_url) values
  ('Dr. Youssef Benali',   'Mathématiques', 'Docteur en mathématiques appliquées avec 12 ans d''expérience. Spécialiste en algèbre et analyse.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200'),
  ('Prof. Fatima Zahra',   'Physique',      'Ingénieure passionnée par la transmission du savoir. Cours de physique du collège au bac.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200'),
  ('M. Karim Ouazzani',    'Français',      'Littéraire de formation, ancien correcteur au baccalauréat. Aide à la rédaction et grammaire.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200'),
  ('Mme. Nadia El Fassi',  'Anglais',       'Certifiée CELTA. Conversation, grammaire et préparation aux certifications internationales.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200'),
  ('Dr. Hassan Chafik',    'Chimie',        'Chercheur en chimie organique. Cours particuliers du collège au supérieur.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200'),
  ('Prof. Sara Bensouda',  'Informatique',  'Ingénieure logicielle. Initiation à la programmation (Python, JS) et développement web.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200'),
  ('M. Ahmed El Mansouri', 'Mathématiques', 'Expert en préparation aux concours des grandes écoles. Pédagogie active et résultats garantis.', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200&h=200'),
  ('Mme. Sofia Alami',     'SVT',           'Passionnée par les sciences de la vie. Accompagnement personnalisé pour le baccalauréat.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200'),
  ('M. Omar Tazi',         'Économie',      'Ancien consultant financier. Explique les concepts économiques avec clarté et exemples concrets.', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200')
on conflict do nothing;
