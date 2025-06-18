-- users
create table users (
  id serial primary key,
  email varchar(255) not null unique,
  password varchar(255) not null,
  name varchar(255) not null,
  nickname varchar(255) not null,
  role varchar(255) not null,
  phone varchar(255),
  profile_image varchar(255),
  created_at timestamp default current_timestamp
);

-- lectures
create table lectures (
  id serial primary key,
  instructor_id int not null references users(id),
  title varchar(255) not null,
  description text,
  price int default 0,
  category varchar(255) not null,
  created_at timestamp default current_timestamp
);

-- videos
create table videos (
  id serial primary key,
  lecture_id int not null references lectures(id),
  title varchar(255) not null,
  video_url varchar(255) not null,
  order_index int not null,
  duration_sec int
);

-- payments
create table payments (
  id serial primary key,
  user_id int not null references users(id),
  lecture_id int not null references lectures(id),
  amount int not null,
  paid_at timestamp default current_timestamp
);

-- subscriptions
create table subscriptions (
  id serial primary key,
  user_id int not null references users(id),
  instructor_id int not null references users(id),
  started_at timestamp default current_timestamp,
  expired_at timestamp not null,
  is_auto_renew boolean default false
);

-- reviews
create table reviews (
  id serial primary key,
  user_id int not null references users(id),
  lecture_id int not null references lectures(id),
  rating int check (rating >= 1 and rating <= 5),
  content text,
  created_at timestamp default current_timestamp
);

-- progress
create table progress (
  id serial primary key,
  user_id int not null references users(id),
  video_id int not null references videos(id),
  current_time int default 0,
  is_completed boolean default false,
  updated_at timestamp default current_timestamp
);

-- notifications
create table notifications (
  id serial primary key,
  user_id int not null references users(id),
  type varchar(255) not null,
  message text not null,
  link_url varchar(255),
  is_read boolean default false,
  created_at timestamp default current_timestamp
);

-- posts
create table posts (
  id serial primary key,
  user_id int not null references users(id),
  category varchar(255) not null,
  title varchar(255) not null,
  content text not null,
  created_at timestamp default current_timestamp
);

-- comments
create table comments (
  id serial primary key,
  post_id int not null references posts(id),
  user_id int not null references users(id),
  content text not null,
  created_at timestamp default current_timestamp
);

-- follows
create table follows (
  id serial primary key,
  follower_id int not null references users(id),
  following_id int not null references users(id),
  created_at timestamp default current_timestamp
);

-- challenges
create table challenges (
  id serial primary key,
  instructor_id int not null references users(id),
  title varchar(255) not null,
  description text,
  duration_day int not null,
  created_at timestamp default current_timestamp
);

-- participants
create table participants (
  id serial primary key,
  challenge_id int not null references challenges(id),
  user_id int not null references users(id),
  certified_days int default 0,
  last_certified_at timestamp
);

-- wishlists
create table wishlists (
  id serial primary key,
  user_id int not null references users(id),
  lecture_id int not null references lectures(id),
  created_at timestamp default current_timestamp
);
