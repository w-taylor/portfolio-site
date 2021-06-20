async function addRow(date,postBody) {
	try {
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
	let posts = await (async function () {
		pool.query(query, (err,res) => {
			if (err) {
				console.log(err.stack);
				return -1;
			} else {
				let posts = res.rows;
				console.log(posts);
				console.log(posts.length);
				if (posts.length < 20) {return -1};
				return posts;
			}
		})
	})();
	
	console.log(posts);
	
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
	} catch(err) {
		console.log(err);
	};
};

module.exports = {
	addRow
};
