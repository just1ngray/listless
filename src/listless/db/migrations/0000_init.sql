CREATE TABLE lists (
    -- id is a crypto random unique identifier of the list
    id TEXT PRIMARY KEY,

    -- mutkey is the public key used to verify future changes to the name or
    -- items of the list. if NULL, then all there is no verification step
    mutkey BLOB,

    -- expected to be encrypted on the front-end for zero knowledge
    name BLOB,

    -- epoch ms the list was first created at
    created_at INTEGER NOT NULL
);

CREATE TABLE list_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    list_id TEXT NOT NULL,

    -- arbitrary storage of the list item. e.g., could be an encrypted json
    -- object like {"label":"Milk","qty":2,"done":false}. the DB does not care
    item BLOB NOT NULL,

    -- epoch ms the item was first created at
    created_at INTEGER NOT NULL,

    -- epoch ms the item was last updated at
    updated_at INTEGER NOT NULL,

    FOREIGN KEY (list_id) REFERENCES lists(id)
);
