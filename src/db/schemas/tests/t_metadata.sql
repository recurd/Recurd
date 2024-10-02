-- INSERT ARTISTS

INSERT INTO artists (id, name, image, description) 
VALUES 
('9db9e7b1-b6ee-4d3e-92ab-ffd08767910f', 'Quang Pham', '', '');

INSERT INTO artists (id, name, image, description) 
VALUES 
('b2cae670-1514-4316-a77d-e9504f7856e9', 'Allen Liao', '', '');

-- INSERT ALBUMS

insert into albums (id, name, image)
values ('6c630e24-b085-450f-820e-511c520d9123', 'Quangs mixtape', ''); -- ID: 

insert into albums (id, name, image)
values ('9674d959-e42b-4e55-a76a-18058b778a4c', 'Allens mixtape', '');

-- INSERT SONGS

insert into songs (id, name)
values ('e38935b9-5e14-439c-be85-b56e547d98d9', 'Song 1');

insert into songs (id, name)
values ('891132fa-3f10-4edd-8651-6225551d285a', 'Song 2');

insert into songs (id, name)
values ('ab1abd0e-9d92-42ca-8f6a-b1cc16508c68', 'Song 3');

insert into songs (id, name)
values ('cd95b5ca-4f74-42de-9e43-c70b40b19053', 'Song 4');

-- INSERT ARTIST_ALBUMS

insert into artist_albums (artist_id, album_id)
values ('9db9e7b1-b6ee-4d3e-92ab-ffd08767910f', '6c630e24-b085-450f-820e-511c520d9123'); -- Quang => Quang's mixtape

insert into artist_albums (artist_id, album_id)
values ('b2cae670-1514-4316-a77d-e9504f7856e9', '6c630e24-b085-450f-820e-511c520d9123'); -- Allen => Quang's mixtape

insert into artist_albums (artist_id, album_id)
values ('b2cae670-1514-4316-a77d-e9504f7856e9', '9674d959-e42b-4e55-a76a-18058b778a4c'); -- Allen => Allen's mixtape

-- INSERT ALBUM_SONGS

insert into album_songs (album_id, song_id)
values ('6c630e24-b085-450f-820e-511c520d9123', 'e38935b9-5e14-439c-be85-b56e547d98d9'); -- Quang's mixtape => Song 1

insert into album_songs (album_id, song_id)
values ('6c630e24-b085-450f-820e-511c520d9123', '891132fa-3f10-4edd-8651-6225551d285a'); -- Quang's mixtape => Song 2

insert into album_songs (album_id, song_id)
values ('9674d959-e42b-4e55-a76a-18058b778a4c', 'ab1abd0e-9d92-42ca-8f6a-b1cc16508c68'); -- Allen's mixtape => Song 3

insert into album_songs (album_id, song_id)
values ('9674d959-e42b-4e55-a76a-18058b778a4c', 'cd95b5ca-4f74-42de-9e43-c70b40b19053'); -- Allen's mixtape => Song 4

-- INSERT ARTIST_SONGS

insert into artist_songs (artist_id, song_id)
values ('9db9e7b1-b6ee-4d3e-92ab-ffd08767910f', 'e38935b9-5e14-439c-be85-b56e547d98d9'); -- Quang => Song 1

insert into artist_songs (artist_id, song_id)
values ('b2cae670-1514-4316-a77d-e9504f7856e9', 'e38935b9-5e14-439c-be85-b56e547d98d9'); -- Allen => Song 1

insert into artist_songs (artist_id, song_id)
values ('9db9e7b1-b6ee-4d3e-92ab-ffd08767910f', '891132fa-3f10-4edd-8651-6225551d285a'); -- Quang => Song 2

insert into artist_songs (artist_id, song_id)
values ('b2cae670-1514-4316-a77d-e9504f7856e9', 'ab1abd0e-9d92-42ca-8f6a-b1cc16508c68'); -- Allen => Song 3

insert into artist_songs (artist_id, song_id)
values ('b2cae670-1514-4316-a77d-e9504f7856e9', 'cd95b5ca-4f74-42de-9e43-c70b40b19053'); -- Allen => Song 4

-- INSERT LISTENS

insert into listens (user_id, song_id)
values ('3d7ce88b-714b-45e9-b26a-27ae77c9bdf3', 'e38935b9-5e14-439c-be85-b56e547d98d9'); -- quang listens: Song 1 QA

insert into listens (user_id, song_id)
values ('3d7ce88b-714b-45e9-b26a-27ae77c9bdf3', '891132fa-3f10-4edd-8651-6225551d285a'); -- quang listens: Song 2 Q

insert into listens (user_id, song_id)
values ('3d7ce88b-714b-45e9-b26a-27ae77c9bdf3', 'ab1abd0e-9d92-42ca-8f6a-b1cc16508c68'); -- quang listens: Song 3 A

insert into listens (user_id, song_id)
values ('3d7ce88b-714b-45e9-b26a-27ae77c9bdf3', 'cd95b5ca-4f74-42de-9e43-c70b40b19053'); -- quang listens: Song 4 A

-- Get artist's albums
select al.id, al.name, al.image
from artist_albums aa
join albums al
on aa.album_id = al.id
and aa.artist_id = '9db9e7b1-b6ee-4d3e-92ab-ffd08767910f';

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