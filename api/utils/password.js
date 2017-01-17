import crypto from 'crypto';

const LEN = 128;
const SALT_LEN = 32;
const ITERATIONS = 2000;
const DIGEST = 'sha256';

export function hashPassword(password, salt, cb) {
  const len = LEN / 2;
  let callback = cb;

  if (arguments.length === 3) {
    crypto.pbkdf2(password, salt, ITERATIONS, len, DIGEST, function CB(err, derivedKey) {
      if (err) {
        return callback(err);
      }

      return callback(null, derivedKey.toString('hex'));
    });
  } else {
    callback = salt;
    crypto.randomBytes(SALT_LEN / 2, function CB(err, salt) {
      if (err) {
        return callback(err);
      }

      const saltHex = salt.toString('hex');
      crypto.pbkdf2(password, saltHex, ITERATIONS, len, DIGEST, function CB(err, derivedKey) {
        if (err) {
          return callback(err);
        }

        callback(null, derivedKey.toString('hex'), saltHex);
      });
    });
  }
}
