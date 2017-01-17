const Client = require('pg-native');

export function saveBills(req) {
  const {leadId, bills } = req.body;
  console.log(req.body);
  console.log(leadId, bills);

  return new Promise((resolve) => {
    const client = new Client();
    client.connect(process.env.DATABASE_URL + '?ssl=true', function Query(err) {
      if (err) throw err;

      const months = [];
      bills.forEach((bill) => {
        const month = `(${leadId}, ${bill.month}, ${bill.year}, ${bill.value})`;
        months.push(month);
      });

      const query = `
          INSERT INTO mobile.lead_electricity_bills (lead_id, month, year, value) VALUES ${months.join(', ')} ON CONFLICT (lead_id, month, year) DO UPDATE SET value = EXCLUDED.value;
      `;

      console.log(query);

      client.query(query, function CB(error, result) {
        console.log(result, error);

        resolve({
          id: leadId
        });
      });
    });
  });
}
