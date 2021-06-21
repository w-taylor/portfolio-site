function addRow(date,postBody) {
	const { Pool } = require('pg');
	let query = {
        text: 'INSERT INTO testtwo(age,pbody) VALUES($1,$2) RETURNING *',
        values: [date, postBody]
    };

	const pool = new Pool();

	pool.query(query, (err,res) => {
		if (err) {
            console.log(err.stack);
		return;
          } else {
            console.log(res.rows[0])
          }
	});

	query = {
		text: 'SELECT age FROM testtwo'
	};
	
	console.log("count get start");
	pool.query(query, (err,res) => {
		if (err) {
			console.log(err.stack);
		} else {
			let posts = res.rows;
			console.log(posts);
			console.log(posts.length);
			if (posts.length < 10) {return};
			prunePost(posts, pool);
		}
	});
};
	
	
function prunePost(posts, pool){
	let target = parseInt(posts[0].age);
	for (let x = 0; x < posts.length; x++) {
		let cand = parseInt(posts[x].age);
		if (cand < target) {
			target = cand;
		};
	};
	
	target = target.toString();

	query = {
		text: 'DELETE FROM testtwo WHERE age = $1',
		values: [target]
	};

	pool.query(query, (err,res) => {
		if (err) {
			console.log(err.stack)
		} else {
			console.log(res.rows)
		}
	});
};

module.exports = {
	addRow
};
