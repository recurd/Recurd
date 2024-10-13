call create_artist_song_album(null, null, null, 'test song 3', '{test artist 3}', 'test album 3');

call create_artist_song_album(
        null, null, null, 
        'test song 4', '{test artist 4}', 'test album 4', 
        '{"image": "song 4 image"}', 
        '[{"image": "artist 4 image", "description": "artist 4 desc"}]', 
        '{"image":"album 4 image", "album_type":"single","release_date":"1728160179"}');

delete from songs where name like 'test song %';
delete from artists where name like 'test artist %';
delete from albums where name like 'test album %';