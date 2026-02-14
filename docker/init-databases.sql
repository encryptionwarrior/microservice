CREATE USER auth_user WITH PASSWORD 'auth_pass';
CREATE USER notes_user WITH PASSWORD 'notes_pass';

CREATE DATABASE auth_db OWNER auth_user;
CREATE DATABASE notes_db OWNER notes_user;
