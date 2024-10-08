drop table if exists artist_albums;
drop table if exists album_songs;
drop table if exists artists;
drop table if exists albums;
drop table if exists songs;
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
    album_type album_t default 'album',
    release_date date -- only look at year and month value; used for disambiguating albums/songs from different artists
);
create index album_name on albums using hash (name);

create table songs (
    id uuid primary key default gen_random_uuid(),
    name varchar(255) not null,
    image varchar(255)
    -- is_single boolean not null default false
);
create index song_name on songs using hash (name);

-- Join tables
create table artist_albums (
    artist_id uuid references artists(id) on delete cascade,
    album_id uuid references albums(id) on delete cascade,
    primary key (artist_id, album_id)
);

create table album_songs (
    album_id uuid references albums(id) on delete cascade,
    song_id uuid references songs(id) on delete cascade,
    primary key (album_id, song_id)
);

create table artist_songs (
    artist_id uuid references artists(id) on delete cascade,
    song_id uuid references songs(id) on delete cascade,
    primary key (artist_id, song_id)
);