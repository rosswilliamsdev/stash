import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { getPinnedItems, getRecentItems, getItemStats } from "../src/lib/db/items";

async function testItemsData() {
  console.log("🧪 Testing Items Data Fetching\n");
  console.log("=" .repeat(50));

  try {
    // Get demo user
    const demoUser = await prisma.user.findUnique({
      where: { email: "demo@stash.io" },
    });

    if (!demoUser) {
      console.error("❌ Demo user not found. Run: npm run db:seed");
      return;
    }

    console.log(`✅ Found demo user: ${demoUser.email}`);
    console.log(`   User ID: ${demoUser.id}\n`);

    // Test getPinnedItems
    console.log("📌 Testing getPinnedItems():");
    console.log("-".repeat(50));
    const pinnedItems = await getPinnedItems(demoUser.id, 5);
    console.log(`Found ${pinnedItems.length} pinned items:`);
    pinnedItems.forEach((item, index) => {
      console.log(`  ${index + 1}. "${item.title}"`);
      console.log(`     Type: ${item.itemType.name} (${item.itemType.icon})`);
      console.log(`     Color: ${item.itemType.color}`);
      console.log(`     Content Preview: ${item.content?.substring(0, 50)}...`);
      console.log("");
    });

    // Test getRecentItems
    console.log("\n⏰ Testing getRecentItems():");
    console.log("-".repeat(50));
    const recentItems = await getRecentItems(demoUser.id, 10);
    console.log(`Found ${recentItems.length} recent items:`);
    recentItems.forEach((item, index) => {
      console.log(`  ${index + 1}. "${item.title}"`);
      console.log(`     Type: ${item.itemType.name}`);
      console.log(`     Pinned: ${item.isPinned ? "Yes" : "No"}`);
      console.log(`     Favorite: ${item.isFavorite ? "Yes" : "No"}`);
      console.log(`     Created: ${item.createdAt.toLocaleDateString()}`);
      console.log("");
    });

    // Test getItemStats
    console.log("\n📊 Testing getItemStats():");
    console.log("-".repeat(50));
    const stats = await getItemStats(demoUser.id);
    console.log(`Total Items: ${stats.total}`);
    console.log(`Pinned Items: ${stats.pinned}`);
    console.log(`Favorite Items: ${stats.favorites}`);
    console.log(`\nItems by Type:`);

    // Get item type names for better display
    const itemTypes = await prisma.itemType.findMany({
      where: { isSystem: true },
    });

    stats.byType.forEach((stat) => {
      const typeName = itemTypes.find((t) => t.id === stat.itemTypeId)?.name || "Unknown";
      console.log(`  - ${typeName}: ${stat.count}`);
    });

    console.log("\n" + "=".repeat(50));
    console.log("✅ All item data tests passed!");

  } catch (error) {
    console.error("\n❌ Error testing items data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testItemsData();
