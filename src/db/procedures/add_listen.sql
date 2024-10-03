-- TODO: implement and call add_listen_spotify() procedure to handle importing spotify metadata
drop procedure add_listen;
create or replace procedure add_listen (
    out listen_id listens.id%type,
    out song_id songs.id%type,
    out artists jsonb,
    out album jsonb,
    user_id users.id%type,
    song_name songs.name%type,
    artist_names varchar(255)[], -- doesn't support array type with column ref; need manual update on type change
    album_name albums.name%type = null,
    time_stamp listens.time_stamp%type = now()
)
language plpgsql
as $$
declare 

begin
    -- Requires non-empty song name
    if song_name is null or song_name = '' then
        raise exception 'add_listen() requires non-empty song name!';
    end if;
    -- Requires artist name
    if array_length(artist_names, 1) = 0 then
        raise exception 'add_listen() requires at least one artist name!';
    end if;

    -- Look at existing records of songs+artists(+albums) that 
    -- match the provided song, artists (and album, if exists) names.
    -- If they are an EXACT match, utilize those IDs. 
    -- If not, create new song, artists (and album) and return those IDs.

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