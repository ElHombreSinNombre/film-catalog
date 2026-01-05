create table movies (
  id bigint primary key generated always as identity, 
  imdb_id varchar(255) not null unique,   
  tmdb_id varchar(255) not null unique,             
  favourite boolean default false, 
  vote_average float default 0 
);

alter table movies enable row level security;

create policy "Public full access" 
on movies for all 
using (true) 
with check (true);