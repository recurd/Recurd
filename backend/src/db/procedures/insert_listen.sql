drop procedure insert_listen;

-- Given song_name (required), artist_names (required), and album name, 
-- create necessary song/artists/album records and add a listen record in the listen table
-- Metadata:
-- If metadata is provided of the song/artist/album, they will be included when
-- the song/artist/album is inserted into the database. Otherwise they are ignored.
-- The format of the metadata is json: {"columnName":"value"}
create or replace procedure insert_listen (
    out listen_id listens.id%type,
    out song_id songs.id%type,
    out artists json,
    out album json,
    user_id users.id%type,
    song_name songs.name%type,
    artist_names varchar(255)[], -- doesn't support array type with column ref; need manual update on type change
    album_name albums.name%type = null,
    song_metadata json = null,
    artists_metadata json = null, -- array of json
    album_metadata json = null,
    time_stamp listens.time_stamp%type = now()
)
language plpgsql
as $$
declare 

begin
    -- Requires non-empty song name
    if song_name is null or song_name = '' then
        raise exception 'add_listen() requires non-empty song name!';
    -- Requires artist name
    elsif array_length(artist_names, 1) = 0 then
        raise exception 'add_listen() requires at least one artist name!';
    end if;

    -- Look at existing records of songs + artists that 
    -- match the provided song and artists names
    -- If they are an EXACT match, utilize existing records
    -- If not, create new song and artists, and link them
    -- Then, look at existing records for albums matching the album name
        -- If album does not exist but song does, create album and link song to it, assuming 
        -- that the artists of the album are exactly the artists of the song
        -- Lookup order of album:
            -- Song name + album name + all of album's artist names (in album's metadata)
            -- Song name + album name + at least one of album's artist names
            -- Song name + album name + all of song's artist names
            -- Song name + album name + at least one of song's artist names
            -- Otherwise, assume album does not exist
        -- Note that we don't assume the artists of the album are the same as the artists of the song

    if album_name is null then
        begin
            select 
                s.id,
                json_agg(json_build_object('id', ar.id, 'name', ar.name)) artists
            into strict 
                song_id,
                artists
            from songs s
                join artist_songs ars
                    on s.id = ars.song_id
                join artists ar
                    on ars.artist_id = ar.id
                where s.name = song_name
                group by s.id
                having array_agg(ar.name) = artist_names;
        exception
            when NO_DATA_FOUND then
                -- No execption, have to manually add data
                null;
                -- call add_data();
            when TOO_MANY_ROWS then
                -- raise exception!! somehow database is broken, too song ids
                raise exception 'add_listen(): song (%) and artist names (%) not unique!', 
                    song_name, artist_names;
        end;
    else 
        begin
            select 
                t.id,
                json_build_object('id', al.id, 'name', al.name) album
            into strict
                song_id,
                artists,
                album
            from 
                -- Subquery equivalent to the one in first case
                (select 
                    s.id,
                    json_agg(json_build_object('id', ar.id, 'name', ar.name)) artists
                from songs s
                    join artist_songs ars
                        on s.id = ars.song_id
                    join artists ar
                        on ars.artist_id = ar.id
                    where s.name = 'Song 1'
                    group by s.id
                    having array_agg(ar.name) = artist_names
                ) t
                join album_songs als
                    on t.id = als.song_id
                join albums al
                    on als.album_id = al.id
                where al.name = album_name;
        exception
            when NO_DATA_FOUND then
                -- No execption, have to manually add data
                null;
            when TOO_MANY_ROWS then
                -- raise exception!! somehow database is broken, too song ids
                raise exception 'add_listen(): song (%), artist names (%), 
                    and album name (%) not unique!', 
                    song_name, artist_names, album_name;
        end;
    end if;

    -- At last, insert into listens table
    insert into listens (time_stamp, user_id, song_id) 
        values (add_listen.time_stamp, add_listen.user_id, add_listen.song_id)
    returning id into listen_id;
end; $$;