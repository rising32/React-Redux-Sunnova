const pg = require('pg');
import authy from 'authy';

export function useAuthy(req) {
  const id = req.body.id;
  const authyService = authy('FHAjM22RfAZ1CWUT8ZoUMo6tMGUowsjJ');

  return new Promise((resolve, reject) => {
    pg.connect(process.env.DATABASE_URL + '?ssl=true', function Query(err, client, done) {
      if (err) throw err;
      const query = 'SELECT phone, phone_prefix, authy_id, email FROM mobile.users WHERE id=($1)';

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
        if (!result || result.rows.length !== 1 || !result.rows[0].authy_id) {
          console.log('authy_id not find');

          authyService.register_user(data.email, data.phone, data.phone_prefix, (err, res) => {
            console.log(err, res);
            if (res && res.user.id) {
              const authyId = res.user.id;
              client.query('UPDATE mobile.users SET authy_id = $1 WHERE id = $2', [authyId, id]);

              authyService.request_sms(data.authy_id, function SendSMS(err, res) {
                console.log(err, res);
              });
            }
          });
        } else {
          authyService.request_sms(data.authy_id, function SendSMS(err, res) {
            console.log(err, res);
          });
        }

        resolve({
          id: 1,
        });

        done();
      });
    });
  });
}


export function validateCodeAuthy(req) {
  const { id, code } = req.body;
  const authyService = authy('FHAjM22RfAZ1CWUT8ZoUMo6tMGUowsjJ');

  return new Promise((resolve, reject) => {
    pg.connect(process.env.DATABASE_URL + '?ssl=true', function Query(err, client, done) {
      if (err) throw err;
      const query = 'SELECT phone, phone_prefix, authy_id FROM mobile.users WHERE id=($1)';

      client.query(query, [id], function CB(error, result) {
        if (error) {
          console.log(error, result);
        }

        if (!result || result.rows.length !== 1 || !result.rows[0].authy_id) {
          console.log('authy_id not find');
          return;
        }

        const data = result.rows[0];
        console.log(id, code);
        authyService.verify(data.authy_id, code, (err, res) => {
          console.log(err, res);

          if (!err && (res && res.success)) {
            resolve(true);
          } else {
            reject(err);
          }
        });
        done();
      });
    });
  });
}

 // authyService.phones().verification_start(data.phone, data.phone_prefix, 'sms', function Verify(err, res) {
      //   console.log(err, res);
      // });

        // authyService.request_sms(data.authy_id, function SendSMS(err, res) {
        //   console.log(err, res);
        // });
