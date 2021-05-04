const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'testdb',
    password: 'poophead',
    port: 5432,
});

const query = `
CREATE TABLE users (
    email varchar,
    firstName varchar,
    lastName varchar,
    age int
);
`;

client.query(query, (err, res) => {
    if (err) {
	console.log('Failed...');
        console.error(err);
        return;
    }
    console.log('Table is successfully created');
    client.end();
});
