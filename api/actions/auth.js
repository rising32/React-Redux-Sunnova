import passport from 'passport';
import pg from 'pg';
import {hashPassword} from 'utils/password';

export function logout(req) {
  return new Promise((resolve) => {
    req.session.destroy(() => {
      req.session = null;
      return resolve(null);
    });
  });
}

export function login(req, res, next) {
  return new Promise((resolve, reject) => {
    passport.authenticate('local', function authenticate(err, user, info) {
      if (err) return reject(err);
      if (!user) return reject(info);

      req.user = user;
      req.session.user = user;
      resolve(user);
    })(req, res, next);
  });
}

export function loadAuth(req) {
  return new Promise((resolve) => {
    if (process.env.NODE_ENV === 'development') {
      pg.connect(process.env.DATABASE_URL + '?ssl=true', function Query(err, client, done) {
        if (err) throw err;

        const query = 'SELECT * FROM mobile.users WHERE id = 3';
        client.query(query, function getObj(error, result) {
          const obj = result ? result.rows[0] : {};
          resolve(obj);
          req.user = obj;
          req.session.user = obj;
          done();
        });
      });
    } else {
      resolve(req.user || req.session.user || null);
    }
  });
}

export function changePassword(req) {
  return new Promise((resolve, reject) => {
    const {userId, oldPassword, newPassword} = req.body;

    pg.connect(process.env.DATABASE_URL + '?ssl=true', function Query(err, client, done) {
      if (err) throw err;

      const query = 'SELECT * FROM mobile.users WHERE id = $1';
      client.query(query, [userId], function getObj(error, result) {
        if (!result && result.rows.length !== 1) {
          reject('no user found');
          done();
          return;
        }

        const user = result.rows[0];
        hashPassword(oldPassword, user.salt, (error, result) => {
          if (result !== user.password) {
            reject('wrong password');
            done();
            return;
          }

          hashPassword(newPassword, (error, result, salt) => {
            if (error) {
              reject('wrong new password');
              done();
              return;
            }

            const queryUpdate = 'UPDATE mobile.users SET password = $1, salt = $2 WHERE id = $3';
            client.query(queryUpdate, [result, salt, userId], () => {
              resolve(true);
              done();
            });
          });
        });
      });
    });
  });
}
