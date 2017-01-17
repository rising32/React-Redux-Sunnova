const pg = require('pg');
const twilio = require('twilio')('ACf702f2d16186876d982cf13c2249a4ea', 'a1380e8b2270af7d5f17bb1e0c030c7e');

export function sendSMS(req) {
  const phoneFrom = '+18329253323';
  const { id, body } = req.body;

  return new Promise((resolve, reject) => {
    pg.connect(process.env.DATABASE_URL + '?ssl=true', function Query(err, client, done) {
      if (err) throw err;
      const query = 'SELECT phone, phone_prefix FROM mobile.users WHERE id=($1)';

      client.query(query, [id], function CB(error, result) {
        if (error) {
          console.log(error, result);
        }
        if (!result || result.rows.length !== 1) {
          console.log('failed to load user');
          reject('failed to load user');
          return;
        }

        const data = result.rows[0];
        twilio.sendMessage({
          to: `+${data.phone_prefix}${data.phone}`,
          from: phoneFrom,
          body: body
        }, (err, response) => {
          console.log(err, response);
        });

        resolve(true);
        done();
      });
    });
  });
}
