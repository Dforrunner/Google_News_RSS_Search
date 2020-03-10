const User = {
    table: {
        create: `
                    CREATE TABLE IF NOT EXISTS user (
                        UserID INT UNSIGNED AUTO_INCREMENT NOT NULL,
                        name VARCHAR(124) NOT NULL,
                        email VARCHAR(255) NOT NULL,
                        password VARCHAR(255) NOT NULL,
                        created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
                        PRIMARY KEY (UserID)
                    )
                `
    },
    create: `
        INSERT INTO user (name, email, password) 
        VALUES (?, ?, ?)
    `,
    getEmail: `
        SELECT email
        FROM user
        WHERE email = ?
        LIMIT 1
    `
};

const Article = {
    table: {
        create: `
                    CREATE TABLE IF NOT EXISTS articles(
                        ArticleID INT UNSIGNED AUTO_INCREMENT NOT NULL, 
                        pubDate DATETIME NOT NULL,
                        title VARCHAR(255) NOT NULL,
                        link VARCHAR(2048) NOT NULL,
                        source VARCHAR(64),
                        user_id INT UNSIGNED,
                        PRIMARY KEY (ArticleID),
                        CONSTRAINT FK1 FOREIGN KEY (user_id) REFERENCES user(UserID) ON DELETE CASCADE
                    )
                `
    },
    createOne: `
        INSERT INTO Articles (pubDate, title, link, source, UserID) 
        VALUES (?, ?, ?, ?, ?)
    `,
    createMultiple: `
        INSERT INTO Articles (pubDate, title, link, source, UserID) 
        VALUES ?
    `
};

module.exports = {User, Article};