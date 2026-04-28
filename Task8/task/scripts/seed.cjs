const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");

const URI = "mongodb://localhost:27017";

async function seed() {
  const client = new MongoClient(URI);
  await client.connect();

  const db = client.db("task");
  const users = db.collection("users");

  const entries = [
    { username: "owner",    password: await bcrypt.hash("owner123", 10), role: "owner"    },
    { username: "employee", password: await bcrypt.hash("emp123",   10), role: "employee" },
  ];

  for (const entry of entries) {
    const result = await users.updateOne(
      { username: entry.username },
      { $setOnInsert: entry },
      { upsert: true }
    );
    if (result.upsertedCount > 0) {
      console.log(`Inserted: ${entry.username} (${entry.role})`);
    } else {
      console.log(`Already exists: ${entry.username} — skipped`);
    }
  }

  await client.close();
  console.log("Done.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
