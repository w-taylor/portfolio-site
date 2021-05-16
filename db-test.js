function dbtest() {
	const { Pool, Client } = require('pg');

	const pool = new Pool();

	pool.query('SELECT NOW()', (err,res) => {
		console.log('connection successful');
		pool.end();
	});
};

module.exports = {
	dbtest
};