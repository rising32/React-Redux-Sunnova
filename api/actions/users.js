const pg = require('pg');

export function getAllUsers() {
  return new Promise((resolve) => {
    pg.connect(process.env.DATABASE_URL + '?ssl=true', function Query(err, client, done) {
      if (err) throw err;

      const query = 'SELECT id, firstname, lastname FROM mobile.users ORDER BY lastname';
      const countQuery = 'SELECT count(*) FROM mobile.users';

      console.log('[q] ' + query);

      client.query(countQuery, function getCount(error, result) {
        const count = result.rows[0].count;

        client.query(query, function getRows(error, result) {
          const res = result ? result.rows : [];
          done();
          resolve({
            count: count,
            data: res
          });
        });
        done();
      });
    });
  });
}


export function updateLead(req) {
  const id = req.body.id;
  const obj = req.body.object;
  return new Promise((resolve) => {
    pg.connect(process.env.DATABASE_URL + '?ssl=true', function Query(err, client, done) {
      if (err) throw err;

      const params = [];
      let strSET = '';
      let paramIndex = 1;
      const paramsKey = ['firstname', 'middlename', 'lastname', 'email', 'password', 'salt', 'authy_id', 'phone', 'phone_prefix', 'company_id', 'created_at', 'updated_at'];
      for (let index = 0; index < paramsKey.length; index++) {
        const key = paramsKey[index];
        if (obj.hasOwnProperty(key)) {
          params.push(obj[key]);

          if (strSET.length !== 0) {
            strSET += ', ';
          }

          strSET += key + ' = $' + paramIndex;
          paramIndex += 1;
        }
      }

      // update the updated_at field
      strSET += ', updated_at = $' + paramIndex;
      params.push(new Date());

      const query = 'UPDATE mobile.users SET ' + strSET + ' WHERE id = ' + parseInt(id, 10);

      console.log('[q] ' + query);

      client.query(query, params, function CB(error, result) {
        console.log(error);
        console.log(result.rows);

        resolve({
          id: id,
        });
        done();
      });
    });
  });
}