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

insert into artistAlbums (artist_id, album_id)
values ('9db9e7b1-b6ee-4d3e-92ab-ffd08767910f', '6c630e24-b085-450f-820e-511c520d9123'); -- Quang => Quang's mixtape

insert into artistAlbums (artist_id, album_id)
values ('9db9e7b1-b6ee-4d3e-92ab-ffd08767910f', '9674d959-e42b-4e55-a76a-18058b778a4c'); -- Quang => Quang's EP

insert into artistAlbums (artist_id, album_id)
values ('b2cae670-1514-4316-a77d-e9504f7856e9', '6c630e24-b085-450f-820e-511c520d9123'); -- Allen => Quang's mixtape

insert into albumSongs (album_id, song_id)
values ('6c630e24-b085-450f-820e-511c520d9123', 'e38935b9-5e14-439c-be85-b56e547d98d9'); -- Quang's mixtape => Quangs song

insert into albumSongs (album_id, song_id)
values ('6c630e24-b085-450f-820e-511c520d9123', '891132fa-3f10-4edd-8651-6225551d285a'); -- Quang's mixtape => songery

-- Get artist's albums
select al.id, al.name, al.image
from artistAlbums aa
join albums al
on aa.album_id = al.id
and aa.artist_id = '9db9e7b1-b6ee-4d3e-92ab-ffd08767910f';

-- Get album's artists
select ar.id, ar.name, ar.image
from artistAlbums aa
join artists ar
on ar.id = aa.artist_id
and aa.album_id = '6c630e24-b085-450f-820e-511c520d9123';

-- Get album's songs
select s.id, s.name
from albumSongs ass
join songs s
on ass.song_id = s.id
and ass.album_id = '6c630e24-b085-450f-820e-511c520d9123';