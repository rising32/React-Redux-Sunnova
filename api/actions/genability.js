const request = require('request');
const pg = require('pg');

import shortid from 'shortid';

const appID = 'a8885317-4d77-47a9-95ce-cc6ab0d3ed09';
const appKey = '4f2ebc3f-48c7-4d2a-b982-ec376db47afd';

export function getServingEntity(req) {
  const { postalcode } = req.body;
  const url = 'https://api.genability.com/rest/public/lses?zipCode=' + postalcode + '&residentialServiceTypes=ELECTRICITY';
  console.log(url);
  return new Promise((resolve, reject) => {
    if (!postalcode) {
      reject('No postalcode given.');
      return;
    }
    request.get(url, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        console.log(body);
        const obj = JSON.parse(body);
        resolve(obj.results);
      } else {
        reject({ error, response });
      }
    }).auth(appID, appKey);
  });
}

export function getTariffs(req) {
  const { uuid } = req.body;
  const url = 'https://api.genability.com/rest/v1/accounts/pid/' + uuid + '/tariffs';
  console.log(url);
  return new Promise((resolve, reject) => {
    request.get(url, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        console.log('getTariffs finished');
        const obj = JSON.parse(body);
        resolve(obj.results);
      } else {
        reject({ error, response });
      }
    }).auth(appID, appKey);
  });
}

export function register(address, name) {
  const uuid = shortid.generate();

  const input = {
    providerAccountId: uuid,
    accountName: name,
    address: {
      addressString: address
    },
    properties: {
      customerClass: {
        keyName: 'customerClass',
        dataValue: '1'
      }
    }
  };

  const url = 'https://api.genability.com/rest/v1/accounts';
  console.log(url, input);
  return new Promise((resolve, reject) => {
    request({
      method: 'PUT',
      url,
      json: true,
      body: input,
    }, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        console.log(body);
        resolve(uuid);
      } else {
        reject({ error, response });
      }
    }).auth(appID, appKey);
  });
}

export function getMonthlyValues(req) {
  const { accountId, leadId } = req.body;

  const promise = new Promise((resolve) => {
    pg.connect(process.env.DATABASE_URL + '?ssl=true', function Query(err, client, done) {
      if (err) throw err;

      const query = 'SELECT * FROM mobile.lead_electricity_bills WHERE lead_id = $1';
      console.log('[q] ' + query);

      client.query(query, [leadId], function getBills(error, result) {
        console.log(result, error);

        const res = result ? result.rows : [];
        done();
        resolve(res);
      });
    });
  });

  const inputBills = [];
  return promise.then((data) => {
    data.forEach((bill) => {
      const nextMonth = bill.month === 12 ? 1 : bill.month + 1;
      const toYear = nextMonth === 1 ? bill.year + 1 : bill.year;
      const item = {
        fromDateTime: `${bill.year}-${bill.month}-01`,
        toDateTime: `${toYear}-${nextMonth}-01`,
        quantityUnit: '$',
        quantityValue: bill.value
      };

      inputBills.push(item);
    });

    const profileId = `${accountId}-profile`;

    const input = {
      providerAccountId: accountId,
      providerProfileId: profileId,
      isDefault: true,
      serviceTypes: 'ELECTRICITY',
      sourceId: 'ReadingEntry',
      readingData: inputBills
    };

    const url = 'https://api.genability.com/rest/v1/profiles';
    console.log('profile: ', JSON.stringify(input));

    return new Promise((resolve, reject) => {
      request({
        method: 'PUT',
        url,
        json: true,
        body: input,
      }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          console.log(body);
          const url = 'https://api.genability.com/rest/v1/accounts/analysis';
          const input = {
            providerAccountId: accountId,
            fromDateTime: '2015-01-01',
            useIntelligentBaselining: true,
            propertyInputs: [{
              scenarios: 'before,after, solar',
              keyName: profileId,
              dataValue: 'example_account_electricity_profile'
            }]
          };

          console.log('analysis: ', JSON.stringify(input));

          console.log('analysis:');
          request({
            method: 'POST',
            url,
            json: true,
            body: input,
          }, (error, response, body) => {
            if (!error && response.statusCode === 200) {
              resolve(body);
            } else {
              reject({ error, response });
            }
          }).auth(appID, appKey);
        } else {
          reject({ error, response });
        }
      }).auth(appID, appKey);
    });
  });
}

export function createAccount(req) {
  const { address, name } = req.body;
  return register(address, name);
}
