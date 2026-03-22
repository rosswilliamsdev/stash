import "dotenv/config";
import prisma from "../src/lib/prisma";

async function testDatabase() {
  try {
    console.log("🔍 Testing database connection...\n");

    // Test 1: Check database connection
    console.log("1️⃣ Testing raw query...");
    const result = await prisma.$queryRaw<Array<{ version: string }>>`
      SELECT version();
    `;
    console.log(`✅ Connected to PostgreSQL`);
    console.log(`   Version: ${result[0].version.split(" ")[0]}\n`);

    // Test 2: Check if tables exist
    console.log("2️⃣ Checking database tables...");
    const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename::TEXT as tablename
      FROM pg_catalog.pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `;
    console.log(`✅ Found ${tables.length} tables:`);
    tables.forEach((table) => {
      console.log(`   - ${table.tablename}`);
    });
    console.log();

    // Test 3: Count records in each table
    console.log("3️⃣ Checking table counts...");
    const [
      userCount,
      itemTypeCount,
      itemCount,
      collectionCount,
      tagCount,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.itemType.count(),
      prisma.item.count(),
      prisma.collection.count(),
      prisma.tag.count(),
    ]);

    console.log(`✅ Record counts:`);
    console.log(`   Users:       ${userCount}`);
    console.log(`   Item Types:  ${itemTypeCount}`);
    console.log(`   Items:       ${itemCount}`);
    console.log(`   Collections: ${collectionCount}`);
    console.log(`   Tags:        ${tagCount}`);
    console.log();

    console.log("✨ Database test completed successfully!");
  } catch (error) {
    console.error("❌ Database test failed:");
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
