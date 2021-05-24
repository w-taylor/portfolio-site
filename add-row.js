function addRow(date,postBody) {
	const { Pool } = require('pg');
    const query = {
        text: 'INSERT INTO testtwo(age,pbody) VALUES($1,$2) RETURNING *',
        values: [date, postBody],
    };

	const pool = new Pool();

	pool.query(query, (err,res) => {
		if (err) {
            console.log(err.stack)
          } else {
            console.log(res.rows[0])
          }
	});
};

module.exports = {
	addRow
};
