function getPosts(){
	const { Pool } = require('pg');
	const pool = new Pool();
	const query = {
		name: 'get-posts',
		text: 'SELECT pbody FROM testtwo ORDER BY age LIMIT 5'
	};
	
	pool.query(query, (err, res) => {
		if (err) {
			console.log(err.stack)
		} else {
			console.log(res.rows)
		}
	});
};

module.exports = { getPosts };
