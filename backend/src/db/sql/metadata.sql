drop table if exists artist_albums;
drop table if exists album_songs;
drop table if exists artist_songs;
drop table if exists artists cascade;
drop table if exists albums cascade;
drop table if exists songs cascade;
drop index if exists artist_name;
drop index if exists album_name;
drop index if exists song_name;

create table artists (
    id uuid primary key default gen_random_uuid(),
    name varchar(255) not null,
    image varchar(255),
    description text 
);
create index artist_name on artists using hash (name);

create type album_t as enum ('album', 'single');
create table albums (
    id uuid primary key default gen_random_uuid(),
    name varchar(255) not null,
    image varchar(255),
    album_type album_t not null default 'album',
    release_date date -- only look at year and month value; used for disambiguating albums/songs from different artists
);
create index album_name on albums using hash (name);

create table songs (
    id uuid primary key default gen_random_uuid(),
    name varchar(255) not null,
    image varchar(255) -- DELETE
);
create index song_name on songs using hash (name);

-- Join tables
-- TODO: Determine what to do when artist is deleted; delete linked songs? restrict?
create table artist_albums (
    artist_id uuid references artists(id) on delete cascade,
    album_id uuid references albums(id) on delete cascade,
    primary key (artist_id, album_id)
);

create table album_songs (
    album_id uuid references albums(id) on delete cascade,
    song_id uuid references songs(id) on delete cascade,
    disc_number smallint not null default 1, -- disc_number is 1 unless there are more discs
    album_position smallint, -- album_position is nullable for representing unknown position in album
    -- TODO: Ensure validity of disc_number and position on change: HARD!
    primary key (album_id, song_id),
    unique (album_id, song_id, disc_number, album_position),
    -- unique constraint does not get checked if any column (i.e.album_position) is null
    check (not (disc_number > 1 and album_position is null))
    -- If disc_number is > 1, song's position in album must be known (since it is on discs)
);

create table artist_songs (
    artist_id uuid references artists(id) on delete cascade,
    song_id uuid references songs(id) on delete cascade,
    primary key (artist_id, song_id)
);

-- For easy viewing
drop view if exists artist_album_songs;
create view artist_album_songs as 
    select 
        s.*,
        coalesce(array_agg(ar.id || ' ' || ar.name)
            filter (where ar.id is not null), '{}') as artists,
        coalesce(array_agg(ab.id || ' ' || ab.name) 
            filter (where ab.id is not null), '{}') as albums
    from songs s
    join artist_songs ars
    on s.id = ars.song_id
    join artists ar
    on ars.artist_id = ar.id
    left join album_songs abs
    on s.id = abs.song_id
    left join albums ab
    on abs.album_id = ab.id
    group by s.id;
