import cloudinary from 'cloudinary';
import multiparty from 'multiparty';
import shortid from 'shortid';
import pg from 'pg';

export function uploadProfilePicture(req) {
  return new Promise((resolve, reject) => {
    cloudinary.config({
      cloud_name: 'hlxnduaid',
      api_key: '347177741897436',
      api_secret: 'LsxHszOEk0IR6B-g_NKl7crUtBI'
    });

    const uuid = shortid.generate();
    const form = new multiparty.Form();
    form.parse(req, (err, fields, files) => {
      console.log(err, fields, files);
      const userId = fields.user_id[0];
      if (!userId) {
        reject('No User ID given');
        return;
      }
      const { path: tempPath } = files.image[0];

      cloudinary.uploader.upload(tempPath, (result) => {
        console.log(result);
        pg.connect(process.env.DATABASE_URL + '?ssl=true', function Query(err, client, done) {
          if (err) throw err;
          const query = 'UPDATE mobile.users SET profile_picture = $1 WHERE id = $2';
          const imageUrl = cloudinary.url('profile_picture_' + uuid + '.jpg', { width: 250, height: 250, crop: 'thumb', gravity: 'face' });
          console.log(query, [imageUrl, userId]);
          client.query(query, [imageUrl, userId], function getRows(error) {
            if (error) {
              console.log(error);
            }
            done();
            resolve(imageUrl);
          });
        });
      }, { public_id: 'profile_picture_' + uuid });
    });
  });
}
