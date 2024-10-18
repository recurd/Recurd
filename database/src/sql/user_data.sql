drop table if exists listens;
drop table if exists album_opinions;
drop table if exists song_opinions;

create table listens (
    id uuid primary key default gen_random_uuid(),
    time_stamp timestamp not null default now(),
    user_id uuid references users(id) on delete cascade not null,
    song_id uuid references songs(id) on delete restrict not null
);
-- "on delete restrict" prevent deletion of songs with scrobbles
-- If table joins are costly, might need to denormalize fields like artist names and ids
-- inside arrays, which cant guarantee info remains up to date
-- the reason why I'm not caching now is this table will likely be the most biggest and most read/write table,
-- so caching will be very expensive as well

create table album_opinions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id) on delete cascade not null,
    album_id uuid references albums(id) on delete restrict not null,
    time_stamp timestamp not null default now(),
    rating smallint check (rating >= 1 or rating <= 10),
    review text,
    check (rating is not null or review is not null)
);
-- likes or comments?

create table song_opinions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id) on delete cascade not null,
    song_id uuid references songs(id) on delete restrict not null,
    time_stamp timestamp not null default now(),
    rating smallint check (rating >= 1 or rating <= 10),
    review text,
    check (rating is not null or review is not null)
);