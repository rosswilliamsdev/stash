import "dotenv/config";
import prisma from "../src/lib/prisma";
import { getRecentCollections } from "../src/lib/db/collections";

async function testCollections() {
  console.log("🧪 Testing Collections Data...\n");

  // Get demo user
  const demoUser = await prisma.user.findUnique({
    where: { email: "demo@stash.io" },
  });

  if (!demoUser) {
    console.error("❌ Demo user not found. Run: npm run db:seed");
    process.exit(1);
  }

  console.log(`✅ Found demo user: ${demoUser.email}\n`);

  // Fetch collections using the same function as the dashboard
  const collections = await getRecentCollections(demoUser.id, 6);

  console.log(`📚 Found ${collections.length} collections:\n`);

  collections.forEach((collection, index) => {
    console.log(`${index + 1}. ${collection.name}`);
    console.log(`   Description: ${collection.description || "None"}`);
    console.log(`   Items: ${collection.itemCount}`);
    console.log(`   Favorite: ${collection.isFavorite ? "⭐" : "No"}`);
    console.log(`   Border Color: ${collection.dominantTypeColor}`);
    console.log(
      `   Type Icons: ${collection.typeIcons
        .map((t) => `${t.icon} (${t.color})`)
        .join(", ")}`
    );
    console.log();
  });

  console.log("✨ Collections test completed successfully!");
}

testCollections()
  .catch((e) => {
    console.error("❌ Test failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
