CREATE DATABASE toungue_node;

USE toungue_node;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nickname VARCHAR(50) NOT NULL UNIQUE,
    age INT NOT NULL,
    city VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_post_author 
    FOREIGN KEY (user_id) 
    REFERENCES users(id) 
    ON DELETE CASCADE
);

CREATE TABLE interactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    type ENUM('like', 'comment') NOT NULL,
    content TEXT, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_interaction_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_interaction_post FOREIGN KEY (post_id) 
        REFERENCES posts(id) ON DELETE CASCADE
)

-- Values

INSERT INTO users (nickname, age, city) VALUES 
('Arnold', 78, 'Thal'),            -- Has 1 post and 1 comment made on others
('WriterOnly', 30, 'Berlin'),      -- Has 1 post, but no interactions of his own
('LikerOnly', 22, 'Paris'),       -- No posts, only 1 like made on Arnold
('PowerUser', 28, 'Madrid'),      -- Has 2 posts and 2 interactions (1 comment, 1 self-comment)
('SocialStar', 35, 'Amsterdam'),   -- Has 1 post and 2 likes made on others
('CasualDave', 40, 'London'),      -- Has 1 post and 1 comment made on others
('GhostReader', 19, 'Stockholm'),  -- No posts, only 1 like made on Madrid
('TheLoner', 25, 'Rome');          -- The "Empty" case: No posts, no interactions

INSERT INTO posts (user_id, title, content, published_at) VALUES 
(1, 'I will be back', 'First post from Thal.', '2026-03-24 08:00:00'),   -- 1 Like (from Paris)
(2, 'Berlin Nightlife', 'Best clubs guide.', '2026-03-01 10:00:00'),      -- 1 Like, 1 Comment
(4, 'Tapas Tour', 'Madrid food guide.', '2026-03-10 08:30:00'),           -- 1 Like
(4, 'Tech in Spain', 'Startup scene news.', '2026-03-20 15:00:00'),       -- 1 Like, 1 Comment (Self)
(5, 'Canals of Amsterdam', 'Sunset view.', '2026-03-22 12:00:00'),         -- 0 Interactions (The "Zero" case)
(6, 'London Fog', 'Typical UK weather.', '2026-03-23 09:00:00');          -- 1 Comment (from Madrid)

INSERT INTO interactions (user_id, post_id, type, content, created_at) VALUES 
(3, 1, 'like', NULL, '2026-03-24 09:00:00'),             -- Paris user likes Arnold post
(4, 6, 'comment', 'I love London!', '2026-03-23 10:00:00'), -- Madrid user comments on London post
(5, 2, 'like', NULL, '2026-03-11 09:00:00'),             -- Amsterdam user likes Berlin post
(5, 3, 'like', NULL, '2026-03-21 18:00:00'),             -- Amsterdam user likes Madrid post
(1, 2, 'comment', 'Great post!', '2026-03-12 11:30:00'),    -- Arnold comments on Berlin post
(7, 4, 'like', NULL, '2026-03-23 15:00:00'),             -- Stockholm user likes Madrid post
(4, 4, 'comment', 'Very true.', '2026-03-23 16:00:00');     -- Madrid user self-comment