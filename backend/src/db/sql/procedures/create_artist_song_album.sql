drop procedure create_artist_song_album;
create or replace procedure create_artist_song_album (
    out song_id songs.id%type,
    out artist_ids uuid[],
    out album_id uuid,
    song_name songs.name%type,
    artist_names varchar(255)[],
    album_name albums.name%type = null,
    song_metadata jsonb = null,
    artists_metadata jsonb = null, -- array of json
    album_metadata jsonb = null
)
language plpgsql
as $$
declare 
    artist_id artists.id%type;
begin
    -- Requires artist name
    if array_length(artist_names, 1) = 0 then
        raise exception 'create_artist_song_album() requires at least one artist name!';
    -- Require that artist_names and artists_metadata has the same length if the latter is non-null
    elsif artists_metadata is not null and array_length(artist_names, 1) <> jsonb_array_length(artists_metadata) then
        raise exception 'create_artist_song_album(): length of artist names and artists metadata need to match!';
    end if;

    -- Insert songs
    insert into songs (name, image)
    values (song_name, song_metadata->>'image')
    returning id into song_id;

    -- Insert artists
    artist_ids := '{}'::uuid[];
    for ind in 1..array_length(artist_names, 1) loop
        artist_id = null;
        insert into artists (name, image, description)  -- jsonb subscripting starts at 0! wtf!
        values (artist_names[ind], artists_metadata[ind-1]->>'image', artists_metadata[ind-1]->>'description')
        returning id into artist_id;
        artist_ids := array_append(artist_ids, artist_id);
    end loop;

    -- Insert album, if provided
    if album_name is not null then 
        RAISE NOTICE 'Album Metadata: %', album_metadata;
        insert into albums (name, image, album_type, release_date)
        values (album_name, album_metadata->>'image', 
            case when album_metadata ? 'album_type'
                then (album_metadata->>'album_type')::album_t
                else 'album' end, -- TODO: fix this! (trigger)
                to_timestamp(cast((album_metadata->>'release_date') as double precision))::date)
        returning id into album_id;
    end if;

    -- Insert into artist_songs and artist_albums
    for ind in 1..array_length(artist_ids, 1) loop
        -- Insert into artist_songs
        insert into artist_songs (artist_id, song_id)
        values (artist_ids[ind], song_id);

        -- Insert into artist_albums
        if album_name is not null then 
            insert into artist_albums (artist_id, album_id)
            values (artist_ids[ind], album_id);
        end if;
    end loop;

    -- Insert into albums_songs
    if album_name is not null then 
        insert into album_songs (album_id, song_id)
            values (album_id, song_id);
    end if;
end;
$$;