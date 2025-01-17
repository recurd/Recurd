drop table if exists user_services;
drop table if exists user_followers;
drop table if exists users;

create table users (
    id uuid primary key default gen_random_uuid(),
    username varchar(100) unique not null,
    password varchar(255) not null
    display_name varchar(100) not null,
    image text,
    stats JSONB,
);
-- When switching switching from username/password only to adding oauth login,
-- Update username and password fields to possibly null

create table user_services_t (
    id serial primary key,
    service_type varchar(50) not null unique
);

create table user_services (
    user_id uuid references users(id) on delete cascade,
    service_id int references user_services_t(id) on delete cascade,
    access_token text not null,
    refresh_token text not null,
    expires_at timestamp,
    last_updated timestamp,
    primary key (user_id, service_id)
);
-- last_updated keeps track of the time the account's listening history was last updated

create table user_followers (
    followee uuid references users(id) on delete cascade,
    follower uuid references users(id) on delete cascade,
    time_stamp timestamp not null default now(),
    primary key (followee, follower)
);