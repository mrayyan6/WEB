const { MongoClient } = require("mongodb");
const xlsx = require("xlsx");
const path = require("path");

async function importLeads() {
  const client = new MongoClient("mongodb://localhost:27017");
  await client.connect();

  const db = client.db("task");
  const collection = db.collection("leads");

  const filePath = path.join(__dirname, "../data.xlsx");
  const wb = xlsx.readFile(filePath);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(ws);

  const data = rows.map((row) => ({
    ...row,
    date_created:
      typeof row.date_created === "number"
        ? new Date((row.date_created - 25569) * 86400 * 1000)
        : new Date(row.date_created),
    days_to_convert: row.days_to_convert ?? null,
  }));

  await collection.deleteMany({});
  const result = await collection.insertMany(data);
  console.log(`Imported ${result.insertedCount} leads into task.leads`);

  await client.close();
}

importLeads().catch((err) => {
  console.error(err);
  process.exit(1);
});
