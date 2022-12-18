`CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            forename VARCHAR(255) NOT NULL,
            surname VARCHAR(255) NOT NULL,
            email VARCHAR (255) NOT NULL,
            password TEXT NOT NULL
        );
CREATE TABLE comments (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            comment TEXT NOT NULL
        );
INSERT INTO comments VALUES (default, 'Ty', 'Miejsce na Twoj komentarz'),(default, 'Ty', 'Miejsce na Twoj komentarz'),(default, 'Ty', 'Miejsce na Twoj komentarz');
`