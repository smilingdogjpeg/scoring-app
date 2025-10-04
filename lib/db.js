import prisma from './lib/db.js';

async function test() {
  const house = await prisma.house.create({
    data: {
      name: 'Test House',
      joinCode: 'TEST1234'
    },
  });
  console.log(house);
}

test();
