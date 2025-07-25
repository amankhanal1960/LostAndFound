
-- DROP TABLE IF EXISTS comments;
-- DROP TABLE IF EXISTS claims;
-- DROP TABLE IF EXISTS items;
-- DROP TABLE IF EXISTS users;

-- DROP TYPE IF EXISTS claim_status CASCADE;
-- DROP TYPE IF EXISTS item_status  CASCADE;
-- DROP TYPE IF EXISTS item_type    CASCADE;

-- Users Table
CREATE TABLE users (
  userid        SERIAL       PRIMARY KEY,
  contactnumber VARCHAR(20) UNIQUE,
  fullname      VARCHAR(200)            NOT NULL,
  passwordhash  VARCHAR(255),
  email         VARCHAR(255) UNIQUE     NOT NULL,
  image         TEXT,
  oauth_provider VARCHAR(50),
  createdat     TIMESTAMPTZ DEFAULT NOW()
);

-- Items Table
CREATE TYPE item_type AS ENUM ('LOST', 'FOUND');
CREATE TYPE item_status AS ENUM ('OPEN', 'RESOLVED');

CREATE TABLE items (
  itemid      SERIAL       PRIMARY KEY,
  name        VARCHAR(200) NOT NULL,
  description TEXT,
  image       TEXT,                             
  type        item_type    NOT NULL,
  reportedby  INT          NOT NULL REFERENCES users(userid) ON DELETE CASCADE,
  reportedat  TIMESTAMPTZ  DEFAULT NOW(),
  updatedat TIMESTAMPTZ    DEFAULT NOW(),
  status      item_status  DEFAULT 'OPEN',
  location    VARCHAR(255),
  category    VARCHAR(50)
);

-- Claims Table
CREATE TYPE claim_status AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

CREATE TABLE claims (
  claimid     SERIAL       PRIMARY KEY,
  itemid      INT          NOT NULL REFERENCES items(itemid) ON DELETE CASCADE,
  claimerid   INT          NOT NULL REFERENCES users(userid) ON DELETE CASCADE,
  claimtext   TEXT         NOT NULL,
  claimedat   TIMESTAMPTZ  DEFAULT NOW(),
  status      claim_status DEFAULT 'PENDING'
);

-- comment Table
CREATE TABLE comments (
  commentid   SERIAL      PRIMARY KEY,
  itemid      INT         NOT NULL REFERENCES items(itemid) ON DELETE CASCADE,
  userid      INT         NOT NULL REFERENCES users(userid) ON DELETE CASCADE,
  parentid    INT         REFERENCES comments(commentid) ON DELETE CASCADE,
  content      TEXT        NOT NULL,
  createdat   TIMESTAMPTZ DEFAULT NOW(),
  updatedat   TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX idx_items_status   ON items(status);
CREATE INDEX idx_items_type     ON items(type);
CREATE INDEX idx_items_location ON items(location);
CREATE INDEX idx_items_category ON items(category);

CREATE INDEX idx_claims_status  ON claims(status);

CREATE INDEX idx_comments_item ON comments(itemid);
CREATE INDEX idx_comments_parent ON comments(parentid);
CREATE INDEX idx_comments_user ON comments(userid);



SELECT * FROM users;
SELECT * FROM claims;
SELECT * FROM items;
-- SELECT * FROM comments;
-- DELETE FROM items;