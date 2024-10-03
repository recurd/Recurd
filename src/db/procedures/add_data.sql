create or replace procedure add_data (
    out listen_id listens.id%type,
    out song_id songs.id%type,
    out artists jsonb,
    out album jsonb = null,
    user_id users.id%type,
    song_name songs.name%type,
    artist_names varchar(255)[],
    album_name albums.name%type = null,
    time_stamp listens.time_stamp%type = now()
)
language plpgsql
as $$
declare 

begin

end;
$$;