const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const initialNotes = [
  {
    title: "Supply and demand",
    date: "Sep 28",
    terms: JSON.stringify(["demand", "supply", "price", "inflation"]),
    text: "The relationship between supply and demand is a fundamental concept in economics that dictates the pricing structure of a market. When the demand for a product or service rises but the supply remains stagnant, the price naturally goes up. This happens because more people are competing for a limited resource. Conversely, if supply increases and demand stays the same, the price will drop. A prolonged imbalance, particularly when demand consistently outpaces supply across an economy, can lead to inflation—a general, sustained rise in the prices of goods and services, which gradually reduces purchasing power."
  },
  {
    title: "Rizal's life and works",
    date: "Sep 30",
    terms: JSON.stringify(["Rizal", "Noli", "Dapitan", "novel"]),
    text: "Dr. José Rizal, the national hero of the Philippines, wrote the seminal novel 'Noli Me Tangere' to expose the inequities of the Spanish colonial government and the Catholic clergy. The book sparked national awakening and eventually led to the Philippine Revolution. Because of his reformist writings and growing influence, the Spanish authorities considered him a threat and exiled him to Dapitan, a remote town in Mindanao. During his exile, he did not remain idle; instead, he built a school for boys, practiced medicine, engaged in agriculture, and conducted extensive scientific research on local flora and fauna."
  },
  {
    title: "Photosynthesis Overview",
    date: "Oct 9",
    terms: JSON.stringify(["light", "chlorophyll", "energy"]),
    text: "Photosynthesis is a vital biological process used by plants, algae, and certain bacteria to convert light energy into chemical energy. This energy is stored in carbohydrate molecules, such as sugars, which are synthesized from carbon dioxide and water. The process is primarily driven by chlorophyll, a green pigment found in chloroplasts, which absorbs light most efficiently in the blue and red portions of the electromagnetic spectrum. Oxygen is released as a byproduct, making photosynthesis crucial not just for the survival of the plants themselves, but for maintaining the oxygen levels in Earth's atmosphere."
  },
  {
    title: "Web Design Principles",
    date: "Oct 8",
    terms: JSON.stringify(["ui", "ux", "minimalism"]),
    text: "Great web design is often invisible to the user. It prioritizes function and clarity over unnecessary decoration. One of the core principles is the effective use of negative (or white) space, which helps guide the user's eye and prevents cognitive overload. Typography also plays a massive role; choosing the right font pairings and establishing a clear visual hierarchy (using size, weight, and color) ensures that the most critical information is absorbed first. Ultimately, the goal of modern UI/UX is to reduce friction—making it as easy as possible for users to accomplish their tasks without feeling lost or overwhelmed."
  },
  {
    title: "Reading List & Summaries",
    date: "Oct 5",
    terms: JSON.stringify(["books", "habits", "design"]),
    text: "My current reading list focuses on personal development and design thinking. First is 'Atomic Habits' by James Clear, which explores how tiny, incremental changes in our daily routines can compound into massive life transformations over time. He emphasizes systems over goals. Second is 'The Design of Everyday Things' by Don Norman, a foundational text that explains why some products satisfy customers while others frustrate them. It introduces concepts like affordances, signifiers, and the critical importance of user-centered design in bridging the gap between how things look and how they actually work."
  }
];

async function main() {
  console.log('Migrating hardcoded notes to SQLite database...');

  // Clear existing notes to prevent duplicate runs
  await prisma.note.deleteMany();

  for (const note of initialNotes) {
    const created = await prisma.note.create({ data: note });
    console.log(`  ✓ Inserted note #${created.id}: "${created.title}"`);
  }

  const count = await prisma.note.count();
  console.log(`\nSuccessfully migrated ${count} notes to SQLite database!`);
}

main()
  .catch((e) => {
    console.error('Error migrating data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
