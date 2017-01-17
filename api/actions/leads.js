const pg = require('pg');

export function getLead(req) {
  const id = req.body.id;
  return new Promise((resolve) => {
    pg.connect(process.env.DATABASE_URL + '?ssl=true', function Query(err, client, done) {
      if (err) throw err;

      const query = 'SELECT * FROM mobile.leads WHERE id = ' + parseInt(id, 10);
      client.query(query, function getObj(error, result) {
        const obj = result ? result.rows[0] : {};
        if (obj.user_id) {
          client.query('SELECT firstname, middlename, lastname, id FROM mobile.users WHERE id = $1', [obj.user_id], function getObj(error, result) {
            if (result && result.rows[0]) {
              obj.user = result.rows[0];
            }

            resolve({
              data: obj
            });
          });
        } else {
          resolve({
            data: obj
          });
        }
        done();
      });
    });
  });
}

export function getLeads(req) {
  const args = req.body;
  return new Promise((resolve) => {
    pg.connect(process.env.DATABASE_URL + '?ssl=true', function Query(err, client, done) {
      if (err) throw err;

      let where = '';
      if (args.filter !== 'all') {
        where = ' WHERE type = \'' + args.filter + '\' ';
      }

      const query = 'SELECT * FROM mobile.leads ' + where + ' ORDER BY ' + args.order + ' ' + (args.ascending ? 'ASC' : 'DESC') + ' LIMIT 100 OFFSET ' + (args.page - 1) * 100 + ';';
      const countQuery = 'SELECT count(*) FROM mobile.leads';

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

export function getArrays(req) {
  const args = req.body;
  return new Promise((resolve) => {
    pg.connect(process.env.DATABASE_URL + '?ssl=true', function Query(err, client, done) {
      if (err) throw err;

      const query = 'SELECT * FROM salesforce.lead_arrays__c WHERE sfid = $1';

      client.query(query, [args.sfid], function getCount(error, result) {
        const res = result ? result.rows : [];
        done();
        resolve({
          data: res
        });
      });
    });
  });
}

export function deleteLead(req) {
  const args = req.body;
  console.log(args);
  return new Promise((resolve, reject) => {
    pg.connect(process.env.DATABASE_URL + '?ssl=true', function Query(err, client, done) {
      if (err) throw err;
      // const query = 'SELECT * FROM salesforce.lead WHERE partner_account__C=\'001E000000jmYvWIAU\' LIMIT 50;';

      const query = 'DELETE FROM mobile.leads WHERE id = $1';
      const queryContacts = 'DELETE FROM mobile.contacts WHERE lead_id = $1';

      client.query(query, [args.id], function CB(error, result) {
        if (error) {
          console.log(error, result);
          reject(false);
          return;
        }

        client.query(queryContacts, [args.id], () => {
          resolve(true);
          done();
        });
      });
    });
  });
}

export function saveLead(req) {
  const args = req.body.object;
  return new Promise((resolve) => {
    pg.connect(process.env.DATABASE_URL + '?ssl=true', function Query(err, client, done) {
      if (err) throw err;

      const query = 'INSERT into mobile.leads (firstname, middlename, lastname, email, phone, street, city, postalcode, country, state, deleted, created_at, updated_at,flagged, canceled, testing, type, user_id, owner, electricity_provider, electricity_plan, electricity_january, electricity_multiplier, electricity_yearly, address_lat, address_lng) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26) RETURNING id';
      const paramsKey = ['firstname', 'middlename', 'lastname', 'email', 'phone', 'street', 'city', 'postalcode', 'country', 'state', 'deleted', 'created_at', 'updated_at', 'flagged', 'canceled', 'testing', 'type', 'user_id', 'owner', 'electricity_provider', 'electricity_plan', 'electricity_january', 'electricity_multiplier', 'electricity_yearly', 'address_lat', 'address_lng'];

      const defaults = {
        flagged: false,
        deleted: false,
        canceled: false,
        testing: false,
        type: 'existing',
        created_at: new Date(),
        updated_at: new Date(),
      };

      const params = paramsKey.map(function FindValue(key) {
        let value = null;
        if (args.hasOwnProperty(key)) {
          value = args[key];
        }

        if (value === null || value === '') {
          if (defaults.hasOwnProperty(key)) {
            value = defaults[key];
          } else {
            value = null;
          }
        }

        return value;
      });

      client.query(query, params, function CB(error, result) {
        console.log(error);

        const leadId = result.rows[0].id;
        if (leadId && args.contacts) {
          console.log('[contacts] Saving contacts');
          const contacts = args.contacts;

          contacts.forEach((person) => {
            const arr = [leadId, person.firstname, person.middlename, person.lastname, person.phone, person.email, '1', new Date(), new Date()];
            client.query('INSERT INTO mobile.contacts (lead_id, firstname, middlename, lastname, phone, email, phone_prefix, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', arr, (error, result) => {
              if (error) {
                console.log(error, result);
              }
            });
          });
        }

        resolve({
          id: leadId
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
      const paramsKey = ['firstname', 'middlename', 'lastname', 'email', 'phone', 'street', 'city', 'postalcode', 'country', 'state', 'deleted', 'created_at', 'updated_at', 'flagged', 'canceled', 'testing', 'type', 'user_id', 'owner', 'electricity_provider', 'electricity_plan', 'electricity_january', 'electricity_multiplier', 'electricity_yearly', 'address_lat', 'address_lng', 'genability_account_id'];
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
      if (strSET === '') {
        console.log('[q][update] No fields given to update.');
        resolve(true);
        return;
      }
      // update the updated_at field
      strSET += ', updated_at = $' + paramIndex;
      params.push(new Date());

      const query = 'UPDATE mobile.leads SET ' + strSET + ' WHERE id = ' + parseInt(id, 10);

      console.log('[q] ' + query);

      client.query(query, params, function CB() {
        resolve({
          id: id,
        });
        done();
      });
    });
  });
}

export function assignLead() {
  return new Promise((resolve) => {
    pg.connect(process.env.DATABASE_URL + '?ssl=true', function Query(err, client, done) {
      if (err) throw err;
      const query = 'SELECT * FROM salesforce.contact WHERE recordtypeid = \'012E0000000MaG5IAK\' AND accountid = \'001E000000jmYvWIAU\' ORDER BY name;';

      client.query(query, function getRows(error, result) {
        done();
        resolve({
          data: result.rows
        });
      });
    });
  });
}
