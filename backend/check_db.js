import pkg from 'pg';
const { Client } = pkg;

async function checkUser() {
  const client = new Client({
    connectionString: "postgresql://postgres.mwrkrtelawgepjqwhmeh:uptoskills9090@aws-1-ap-south-1.pooler.supabase.com:5432/postgres",
  });

  try {
    await client.connect();

    const res = await client.query(`
      SELECT * FROM user_profiles WHERE user_id = '26b471bc-0eae-4641-8767-d13c0f6194e3';
    `);

    console.log("User Profile in Postgres:");
    console.log(res.rows[0]);

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

checkUser();
