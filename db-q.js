const { Pool, Client } = require('pg');

const pool = new Pool();

const query= `
INSERT INTO users (email, age)
VALUES ('test@gmail.com', 44)
`;

pool.query(query, (err, res) => {
	if (err) {
		console.error(err);
		return;
	}
	console.log('Table created');
	pool.end();
});
