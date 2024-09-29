-- Option for album ratings/reviews; WE ARE NOT USING THESE (see Opinion tables in user.sql)
-- Separate tables for reviews and ratings
create table album_ratings (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id) on delete cascade,
    album_id uuid references albums(id) on delete set null,
    time_stamp timestamp default now(),
    rating smallint check (rating >= 1 or rating <= 10)
);

create table album_reviews (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id) on delete cascade,
    album_id uuid references albums(id) on delete set null,
    time_stamp timestamp default now(),
    review text
);
-- likes or comments?

create table song_ratings (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id) on delete cascade,
    song_id uuid references songs(id) on delete set null,
    time_stamp timestamp default now(),
    rating smallint check (rating >= 1 or rating <= 10)
);

create table song_reviews (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id) on delete cascade,
    song_id uuid references songs(id) on delete set null,
    time_stamp timestamp default now(),
    review text
);

-- Join tables
create table album_rating_reviews (
    rating_id uuid unique references album_ratings(id) on delete cascade,
    review_id uuid unique references album_reviews(id) on delete cascade,
    primary key (rating_id, review_id)
);
-- TODO: constraint ensure rating and review album id are the same

create table song_rating_reviews (
    rating_id uuid unique references song_ratings(id) on delete cascade,
    review_id uuid unique references song_reviews(id) on delete cascade,
    primary key (rating_id, review_id)
);