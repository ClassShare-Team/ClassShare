-- UUID
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 핵심 사용자 테이블

CREATE TABLE users (
    id                SERIAL PRIMARY KEY,
    email             VARCHAR(255)  NOT NULL UNIQUE,
    password          VARCHAR(255),
    name              VARCHAR(255)  NOT NULL,
    nickname          VARCHAR(255)  NOT NULL,
    role              VARCHAR(255)  NOT NULL,                       -- 'instructor' / 'student' / 'admin'
    phone             VARCHAR(255),
    profile_image     VARCHAR(255),
    point_balance     INT           DEFAULT 0,
    public_id         CHAR(36)      NOT NULL UNIQUE  DEFAULT (gen_random_uuid()::text),
    created_at        TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    oauth_provider    VARCHAR(50),
    oauth_id          VARCHAR(255)  UNIQUE,
    notif_marketing          BOOLEAN DEFAULT TRUE,
    notif_lecture_updates    BOOLEAN DEFAULT TRUE,
    notif_chat               BOOLEAN DEFAULT TRUE,
    toast_enabled            BOOLEAN DEFAULT TRUE
);

-- 강사 프로필

CREATE TABLE instructor_profiles (
    instructor_id     INT PRIMARY KEY REFERENCES users(id),
    introduction      TEXT,
    banner_image      VARCHAR(255),
    sns_url           VARCHAR(255),
    career            TEXT,
    subscription_price INT  NOT NULL,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 강좌, 강좌 영상

CREATE TABLE lectures (
    id            SERIAL PRIMARY KEY,
    public_id     CHAR(36)  NOT NULL UNIQUE DEFAULT (gen_random_uuid()::text),
    instructor_id INT       NOT NULL REFERENCES users(id),
    title         VARCHAR(255) NOT NULL,
    description   TEXT,
    price         INT DEFAULT 0,
    category      VARCHAR(255) NOT NULL,
    thumbnail     VARCHAR(255),
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE videos (
    id            SERIAL PRIMARY KEY,
    lecture_id    INT NOT NULL REFERENCES lectures(id) ON DELETE CASCADE,
    title         VARCHAR(255) NOT NULL,
    video_url     VARCHAR(255) NOT NULL,
    thumbnail     VARCHAR(255),
    order_index   INT NOT NULL,
    duration_sec  INT,
    UNIQUE (lecture_id, order_index)
);

-- 포인트 상품 / 이력

CREATE TABLE point_packages (
    id       SERIAL PRIMARY KEY,
    name     VARCHAR(255) NOT NULL,
    price    INT NOT NULL,        -- 원 단위
    amount   INT NOT NULL,        -- 지급 포인트
    bonus    INT DEFAULT 0
);

CREATE TABLE point_histories (
    id            SERIAL PRIMARY KEY,
    user_id       INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    change_amount INT NOT NULL,
    source        VARCHAR(255) NOT NULL,   -- 'charge' / 'lecture_purchase' 등
    detail        VARCHAR(255),
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 구독, 강좌 구매

CREATE TABLE subscriptions (
    id             SERIAL PRIMARY KEY,
    user_id        INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    instructor_id  INT NOT NULL REFERENCES users(id),
    started_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expired_at     TIMESTAMP NOT NULL,
    is_auto_renew  BOOLEAN  DEFAULT FALSE,
    price          INT      NOT NULL
);

CREATE TABLE lecture_purchases (
    id            SERIAL PRIMARY KEY,
    user_id       INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lecture_id    INT NOT NULL REFERENCES lectures(id),
    price         INT NOT NULL,
    purchased_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, lecture_id)
);

-- 커뮤니티: 리뷰 / 진행도 / 게시글 / 댓글 / 팔로우 / 좋아요

CREATE TABLE reviews (
    id         SERIAL PRIMARY KEY,
    user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lecture_id INT NOT NULL REFERENCES lectures(id) ON DELETE CASCADE,
    rating     INT CHECK (rating BETWEEN 1 AND 5),
    content    TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE progress (
    id               SERIAL PRIMARY KEY,
    user_id          INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    video_id         INT NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
    current_seconds  INT DEFAULT 0,
    is_completed     BOOLEAN DEFAULT FALSE,
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, video_id)
);

CREATE TABLE posts (
    id         SERIAL PRIMARY KEY,
    public_id  CHAR(36) NOT NULL UNIQUE DEFAULT (gen_random_uuid()::text),
    user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category   VARCHAR(255) NOT NULL,
    title      VARCHAR(255) NOT NULL,
    content    TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments (
    id         SERIAL PRIMARY KEY,
    post_id    INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content    TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE follows (
    id            SERIAL PRIMARY KEY,
    follower_id   INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id  INT NOT NULL REFERENCES users(id),
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE likes (
    id           SERIAL PRIMARY KEY,
    user_id      INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_type  VARCHAR(255) NOT NULL CHECK (target_type IN ('lecture','review','post','comment')),
    target_id    INT  NOT NULL,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, target_type, target_id)
);

-- 알림

CREATE TABLE notifications (
    id          SERIAL PRIMARY KEY,
    user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type        VARCHAR(255) NOT NULL,
    message     TEXT NOT NULL,
    link_url    VARCHAR(255),
    is_read     BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    toast_sent  BOOLEAN DEFAULT FALSE
);

-- 채팅: 방 / 멤버 / 메시지 / 토스트 상태

CREATE TABLE chat_rooms (
    id          SERIAL PRIMARY KEY,
    room_type   VARCHAR(255) NOT NULL,       -- 'class' / 'dm'
    target_id   INT NOT NULL,
    student_id  INT REFERENCES users(id),
    room_name   VARCHAR(255),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (room_type, target_id),
    UNIQUE (room_type, target_id, student_id)
);

CREATE TABLE chat_members (
    room_id       INT NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
    user_id       INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_muted      BOOLEAN DEFAULT FALSE,
    last_read_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (room_id, user_id)
);

CREATE TABLE chat_messages (
    id         SERIAL PRIMARY KEY,
    room_id    INT NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
    user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message    TEXT,
    image_url  VARCHAR(255),
    sent_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE toast_chat_status (
    user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message_id  INT NOT NULL REFERENCES chat_messages(id) ON DELETE CASCADE,
    toast_sent  BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (user_id, message_id)
);
