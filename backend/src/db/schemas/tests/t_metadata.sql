INSERT INTO artists (id, name, image, description) 
VALUES 
('9db9e7b1-b6ee-4d3e-92ab-ffd08767910f', 'Quang Pham', 'cab', 'Amazing'); -- ID: 

INSERT INTO artists (id, name, image, description) 
VALUES 
('b2cae670-1514-4316-a77d-e9504f7856e9', 'Allen Liao', '', '');

insert into albums (id, name, image)
values ('6c630e24-b085-450f-820e-511c520d9123', 'Quangs mixtape', ''); -- ID: 

insert into albums (id, name, image)
values ('9674d959-e42b-4e55-a76a-18058b778a4c', 'Quangs EP', '');

insert into songs (id, name)
values ('e38935b9-5e14-439c-be85-b56e547d98d9', 'Quangs song');

insert into songs (id, name)
values ('891132fa-3f10-4edd-8651-6225551d285a', 'songery');

insert into artist_albums (artist_id, album_id)
values ('9db9e7b1-b6ee-4d3e-92ab-ffd08767910f', '6c630e24-b085-450f-820e-511c520d9123'); -- Quang => Quang's mixtape

insert into album_songs (album_id, song_id)
values ('6c630e24-b085-450f-820e-511c520d9123', 'e38935b9-5e14-439c-be85-b56e547d98d9'); -- Quang's mixtape => Quangs song

insert into artist_songs (artist_id, song_id)
values ('9db9e7b1-b6ee-4d3e-92ab-ffd08767910f', 'e38935b9-5e14-439c-be85-b56e547d98d9'); -- Quang owns Quang's song

insert into artist_albums (artist_id, album_id)
values ('9db9e7b1-b6ee-4d3e-92ab-ffd08767910f', '9674d959-e42b-4e55-a76a-18058b778a4c'); -- Quang => Quang's EP

insert into artist_albums (artist_id, album_id)
values ('b2cae670-1514-4316-a77d-e9504f7856e9', '6c630e24-b085-450f-820e-511c520d9123'); -- Allen => Quang's mixtape

insert into artist_albums (artist_id, album_id)
values ('9db9e7b1-b6ee-4d3e-92ab-ffd08767910f', '6c630e24-b085-450f-820e-511c520d9123'); -- Quang => Quang's mixtape

insert into album_songs (album_id, song_id)
values ('6c630e24-b085-450f-820e-511c520d9123', '891132fa-3f10-4edd-8651-6225551d285a'); -- Quang's mixtape => songery

insert into artist_songs (artist_id, song_id)
values ('b2cae670-1514-4316-a77d-e9504f7856e9', '891132fa-3f10-4edd-8651-6225551d285a'); -- Allen owns songery

insert into artist_songs (artist_id, song_id)
values ('9db9e7b1-b6ee-4d3e-92ab-ffd08767910f', '891132fa-3f10-4edd-8651-6225551d285a'); -- Quang owns songery

-- Get artist's albums
select al.id, al.name, al.image
from artist_albums aa
    join albums al
    on aa.album_id = al.id
    and aa.artist_id = '9db9e7b1-b6ee-4d3e-92ab-ffd08767910f';

-- Get artist's songs
select s.id, s.name
from artist_songs ass
    join songs s
    on ass.song_id = s.id
    and ass.artist_id = '9db9e7b1-b6ee-4d3e-92ab-ffd08767910f';

-- Get album's artists
select ar.id, ar.name, ar.image
from artist_albums aa
    join artists ar
    on ar.id = aa.artist_id
    and aa.album_id = '6c630e24-b085-450f-820e-511c520d9123';

-- Get album's songs
select s.id, s.name
from album_songs ass
    join songs s
    on ass.song_id = s.id
    and ass.album_id = '6c630e24-b085-450f-820e-511c520d9123';

-- Get a song by exact match on its name and artist name(s)
-- Artist fields are aggregated into json
select s.*, 
    json_agg(json_build_object('id', ar.id, 'name', ar.name)) artists
from songs s
    join artist_songs ass
        on s.id = ass.song_id
    join artists ar
        on ass.artist_id = ar.id
    -- where s.name = 'songery'
    group by s.id;
    -- having array_agg(ar.name) = array['Allen Liao', 'Quang Pham']::varchar[];

-- Get a song by exact match on its name, artist name(s), and album name
select 
    t.*,
    json_build_object('id', al.id, 'name', al.name) album
from 
    -- Subquery equivalent to the one above
    (select 
        s.*, 
        json_agg(json_build_object('id', ar.id, 'name', ar.name)) artists
    from songs s
        join artist_songs ars
            on s.id = ars.song_id
        join artists ar
            on ars.artist_id = ar.id
        where s.name = 'Song 1'
        group by s.id
        -- having array_agg(ar.name) = array['Allen Liao', 'Quang Pham']::varchar[];
    ) t
    join album_songs als
        on t.id = als.song_id
    join albums al
        on als.album_id = al.id
    where al.name = 'Quangs mixtape';