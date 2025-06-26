-- UUID
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 역할 (강사/수강생/관리자)
CREATE TYPE user_role AS ENUM ('instructor', 'student', 'admin');

-- 회원가입 인증 코드

CREATE TABLE email_verification_codes (
    email       VARCHAR(320) PRIMARY KEY,
    code        VARCHAR(6) NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    verified    BOOLEAN DEFAULT FALSE
);

-- 핵심 사용자 테이블

CREATE TABLE users (
    id                INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email             VARCHAR(320)  NOT NULL UNIQUE,
    password          VARCHAR(255),
    name              VARCHAR(255)  NOT NULL UNIQUE,
    nickname          VARCHAR(255)  NOT NULL UNIQUE,
    role              user_role     NOT NULL,
    phone             VARCHAR(30),
    profile_image     TEXT,
    point_balance     NUMERIC(10, 2)           DEFAULT 0,
    public_id         UUID          NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    created_at        TIMESTAMPTZ   DEFAULT CURRENT_TIMESTAMP,
    oauth_provider    VARCHAR(50),
    oauth_id          VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    notif_marketing          BOOLEAN DEFAULT TRUE,
    notif_lecture_updates    BOOLEAN DEFAULT TRUE,
    notif_chat               BOOLEAN DEFAULT TRUE,
    toast_enabled            BOOLEAN DEFAULT TRUE,
    UNIQUE (oauth_provider, oauth_id)
);

-- 강사 프로필

CREATE TABLE instructor_profiles (
    instructor_id      INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    introduction       TEXT,
    banner_image       TEXT,
    sns_url            TEXT,
    career             TEXT,
    subscription_price NUMERIC(10, 2)  NOT NULL,
    created_at         TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 강좌, 강좌 영상

CREATE TABLE lectures (
    id            INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    public_id     UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    instructor_id INT  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title         VARCHAR(255) NOT NULL,
    description   TEXT,
    price         NUMERIC(10, 2) DEFAULT 0,
    category      VARCHAR(255) NOT NULL,
    thumbnail     TEXT,
    created_at    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE videos (
    id            INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    lecture_id    INT NOT NULL REFERENCES lectures(id) ON DELETE CASCADE,
    title         VARCHAR(255) NOT NULL,
    video_url     TEXT NOT NULL,
    thumbnail     TEXT,
    order_index   INT NOT NULL,
    duration_sec  INT,
    UNIQUE (lecture_id, order_index)
);

-- 포인트 상품 / 이력

CREATE TABLE point_packages (
    id       INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name     VARCHAR(255) NOT NULL,
    price    NUMERIC(10, 2) NOT NULL,
    amount   INT NOT NULL,
    bonus    INT DEFAULT 0
);

CREATE TABLE point_histories (
    id            INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id       INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    change_amount INT NOT NULL,
    source        VARCHAR(255) NOT NULL,
    detail        VARCHAR(255),
    created_at    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 구독, 강좌 구매

CREATE TABLE subscriptions (
    id             INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id        INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    instructor_id  INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    started_at     TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expired_at     TIMESTAMPTZ NOT NULL,
    is_auto_renew  BOOLEAN  DEFAULT FALSE,
    price          NUMERIC(10, 2)      NOT NULL,
    CHECK (user_id <> instructor_id)
);

CREATE TABLE lecture_purchases (
    id            INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id       INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lecture_id    INT NOT NULL REFERENCES lectures(id) ON DELETE CASCADE,
    price         NUMERIC(10, 2) NOT NULL,
    purchased_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, lecture_id)
);

-- 커뮤니티: 리뷰 / 진행도 / 게시글 / 댓글 / 팔로우 / 좋아요

CREATE TABLE reviews (
    id         INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id    INT NOT NULL REFERENCES users(id)     ON DELETE CASCADE,
    lecture_id INT NOT NULL REFERENCES lectures(id)  ON DELETE CASCADE,
    rating     INT CHECK (rating BETWEEN 1 AND 5),
    content    TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, lecture_id)
);

CREATE TABLE progress (
    id              INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id         INT NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
    video_id        INT NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
    current_seconds INT DEFAULT 0,
    is_completed    BOOLEAN DEFAULT FALSE,
    updated_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, video_id)
);

CREATE TABLE posts (
    id         INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    public_id  UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category   VARCHAR(255) NOT NULL,
    title      VARCHAR(255) NOT NULL,
    content    TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments (
    id         INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    post_id    INT NOT NULL REFERENCES posts(id)  ON DELETE CASCADE,
    user_id    INT NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
    content    TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE follows (
    id            INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    follower_id   INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id  INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (follower_id, following_id),
    CHECK (follower_id <> following_id)
);

-- 좋아요 : 타입별 개별 테이블로 분리

CREATE TABLE lecture_likes (
    id          INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id     INT NOT NULL REFERENCES users(id)     ON DELETE CASCADE,
    lecture_id  INT NOT NULL REFERENCES lectures(id)  ON DELETE CASCADE,
    created_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, lecture_id)
);

CREATE TABLE review_likes (
    id          INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id     INT NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
    review_id   INT NOT NULL REFERENCES reviews(id)  ON DELETE CASCADE,
    created_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, review_id)
);

CREATE TABLE post_likes (
    id          INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id     INT NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
    post_id     INT NOT NULL REFERENCES posts(id)   ON DELETE CASCADE,
    created_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, post_id)
);

CREATE TABLE comment_likes (
    id          INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id     INT NOT NULL REFERENCES users(id)      ON DELETE CASCADE,
    comment_id  INT NOT NULL REFERENCES comments(id)   ON DELETE CASCADE,
    created_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, comment_id)
);

-- 알림

CREATE TABLE notifications (
    id          INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type        VARCHAR(255) NOT NULL,
    message     TEXT NOT NULL,
    link_url    TEXT,
    is_read     BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    toast_sent  BOOLEAN DEFAULT FALSE
);

-- 채팅: 방 / 멤버 / 메시지 / 토스트 상태

CREATE TABLE lecture_chat_rooms (
    id          INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    lecture_id  INT NOT NULL REFERENCES lectures(id) ON DELETE CASCADE,
    room_name   VARCHAR(255),
    created_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (lecture_id)
);

CREATE TABLE dm_chat_rooms (
    id            INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    lecture_id    INT NOT NULL REFERENCES lectures(id) ON DELETE CASCADE,
    student_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    instructor_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    room_name     VARCHAR(255),
    created_at    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (lecture_id, student_id),
    CHECK (student_id <> instructor_id)
);

CREATE TABLE lecture_chat_members (
    room_id     INT NOT NULL REFERENCES lecture_chat_rooms(id) ON DELETE CASCADE,
    user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    is_muted    BOOLEAN DEFAULT FALSE,
    last_read_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (room_id, user_id)
);

CREATE TABLE lecture_chat_messages (
    id         INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    room_id    INT NOT NULL REFERENCES lecture_chat_rooms(id) ON DELETE CASCADE,
    user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message    TEXT,
    image_url  TEXT,
    sent_at    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CHECK (message IS NOT NULL OR image_url IS NOT NULL)
);

CREATE TABLE dm_chat_members (
    room_id     INT NOT NULL REFERENCES dm_chat_rooms(id) ON DELETE CASCADE,
    user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    is_muted    BOOLEAN DEFAULT FALSE,
    last_read_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (room_id, user_id)
);

CREATE TABLE dm_chat_messages (
    id         INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    room_id    INT NOT NULL REFERENCES dm_chat_rooms(id) ON DELETE CASCADE,
    user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message    TEXT,
    image_url  TEXT,
    sent_at    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CHECK (message IS NOT NULL OR image_url IS NOT NULL)
);

CREATE TABLE lecture_toast_chat_status (
    user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message_id  INT NOT NULL REFERENCES lecture_chat_messages(id) ON DELETE CASCADE,
    toast_sent  BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (user_id, message_id)
);

CREATE TABLE dm_toast_chat_status (
    user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message_id  INT NOT NULL REFERENCES dm_chat_messages(id) ON DELETE CASCADE,
    toast_sent  BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (user_id, message_id)
);

-- 인덱스 생성

CREATE INDEX idx_point_histories_user_id ON point_histories (user_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions (user_id);
CREATE INDEX idx_subscriptions_instructor_id ON subscriptions (instructor_id);
CREATE INDEX IF NOT EXISTS idx_users_public_id ON users(public_id);
CREATE INDEX IF NOT EXISTS idx_users_oauth ON users(oauth_provider, oauth_id);
CREATE INDEX idx_posts_user_id ON posts (user_id);
CREATE INDEX idx_comments_post_id ON comments (post_id);
CREATE INDEX idx_comments_user_id ON comments (user_id);
