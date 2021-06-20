function getPosts(){
	const { Pool } = require('pg');
	const pool = new Pool();
	const query = {
		name: 'get-posts',
		text: 'SELECT pbody FROM testtwo'
	};
	
	pool.query(query, (err, res) => {
		if (err) {
			console.log(err.stack)
		} else {
			let posts = res.rows;
			console.log(posts);
		}
	});
};

module.exports = { getPosts };
