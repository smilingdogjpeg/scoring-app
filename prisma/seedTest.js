import prisma from "../lib/db.js";

async function main() {
  await prisma.house.create({
    data: {
      name: "Test House",
      motto: "Testing is fun!",
      strength: "choleric",
      weakness: "melancholic"
    },
  });
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
