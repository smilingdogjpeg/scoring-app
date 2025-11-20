import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data (in correct order due to relations)
  await prisma.score.deleteMany();
  await prisma.game.deleteMany();
  await prisma.house.deleteMany();
  await prisma.faction.deleteMany();

  console.log('Cleared existing data');

  // Create Factions first
  const factionBalance = await prisma.faction.create({
    data: {
      name: "Faction Balance",
      motto: "United in equilibrium",
    },
  });

  const steelAlliance = await prisma.faction.create({
    data: {
      name: "The Steel Alliance",
      motto: "Strength through unity",
    },
  });

  const grandCoalition = await prisma.faction.create({
    data: {
      name: "The Grand Coalition",
      motto: "Many houses, one destiny",
    },
  });

  console.log('Created factions');

  // Create Houses
  const houses = await Promise.all([
    prisma.house.create({
      data: {
        name: "House of Boils",
        motto: "One's pus is another's salve",
        crestUrl: "https://upload.wikimedia.org/wikipedia/commons/9/96/Escut_dels_vescomtes_de_Cabrera.png",
        strength: "choleric",
        weakness: "melancholic",
        password: "boils123",
        factionId: grandCoalition.id,
      },
    }),
    prisma.house.create({
      data: {
        name: "House of Miasma",
        motto: "From dust arise",
        crestUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Blason_Sceau_Raymond_B%C3%A9ranger_IV_Barcelone.svg/1280px-Blason_Sceau_Raymond_B%C3%A9ranger_IV_Barcelone.svg.png",
        strength: "choleric",
        weakness: "phlegmatic",
        password: "miasma123",
        factionId: factionBalance.id,
      },
    }),
    prisma.house.create({
      data: {
        name: "Plague Doctors",
        motto: "memento mori",
        crestUrl: "https://upload.wikimedia.org/wikipedia/commons/7/74/Coat_of_arms_of_the_Crusaders_with_the_Red_Star.svg",
        strength: "melancholic",
        weakness: "sanguine",
        password: "plague123",
        factionId: factionBalance.id,
      },
    }),
    prisma.house.create({
      data: {
        name: "House of Crimson Tides",
        motto: "Blood flows eternal",
        crestUrl: "https://upload.wikimedia.org/wikipedia/commons/2/28/Imperial_Coat_of_Arms_of_the_Empire_of_Austria.svg",
        strength: "sanguine",
        weakness: "phlegmatic",
        password: "crimson123",
        factionId: grandCoalition.id,
      },
    }),
    prisma.house.create({
      data: {
        name: "House of Whispers",
        motto: "Silence speaks volumes",
        crestUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Coat_of_Arms_of_Blagodarny.png",
        strength: "phlegmatic",
        weakness: "choleric",
        password: "whispers123",
        factionId: steelAlliance.id,
      },
    }),
    prisma.house.create({
      data: {
        name: "House of Iron Will",
        motto: "Unyielding as steel",
        crestUrl: "https://upload.wikimedia.org/wikipedia/commons/d/dd/Coat_of_arms_of_Greenland.svg",
        strength: "choleric",
        weakness: "sanguine",
        password: "iron123",
        factionId: steelAlliance.id,
      },
    }),
    prisma.house.create({
      data: {
        name: "House of Twilight",
        motto: "Between light and shadow",
        crestUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Coat_of_arms_of_Illyria_%28yellow_star%29.svg",
        strength: "melancholic",
        weakness: "choleric",
        password: "twilight123",
        factionId: grandCoalition.id,
      },
    }),
    prisma.house.create({
      data: {
        name: "House of Golden Dawn",
        motto: "Rise with the sun",
        crestUrl: "https://upload.wikimedia.org/wikipedia/commons/1/12/Lesser_Coat_of_Arms_of_Yellow_Ukraine.svg",
        strength: "sanguine",
        weakness: "melancholic",
        password: "golden123",
        factionId: grandCoalition.id,
      },
    }),
    prisma.house.create({
      data: {
        name: "House of Frost",
        motto: "Cold hearts, clear minds",
        crestUrl: "https://upload.wikimedia.org/wikipedia/commons/b/be/Coat_of_arms_of_Paul_Nguy%E1%BB%85n_Thanh_Hoan.svg",
        strength: "phlegmatic",
        weakness: "sanguine",
        password: "frost123",
        factionId: grandCoalition.id,
      },
    }),
    prisma.house.create({
      data: {
        name: "House of Verdant Roots",
        motto: "From earth we grow",
        crestUrl: "https://upload.wikimedia.org/wikipedia/commons/5/56/Coat_of_Arms_of_Monza_%28ancient%29.svg",
        strength: "melancholic",
        weakness: "phlegmatic",
        password: "verdant123",
        factionId: grandCoalition.id,
      },
    }),
    prisma.house.create({
      data: {
        name: "House of the Silver Moon",
        motto: "By moonlight we endure",
        crestUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Coat_of_Arms_of_the_Principality_of_Abkhazia.svg",
        strength: "phlegmatic",
        weakness: "choleric",
        password: "silver123",
      },
    }),
    prisma.house.create({
      data: {
        name: "House of Ember",
        motto: "From ashes we rise",
        crestUrl: "https://upload.wikimedia.org/wikipedia/commons/0/05/Coat_of_arms_of_the_British_Virgin_Islands.svg",
        strength: "choleric",
        weakness: "phlegmatic",
        password: "ember123",
      },
    }),
    prisma.house.create({
      data: {
        name: "House of Eternal Vigil",
        motto: "Ever watchful, never sleeping",
        crestUrl: "https://upload.wikimedia.org/wikipedia/commons/1/11/Coat_of_arms_of_Bosnia_and_Herzegovina_%281889%E2%80%931918%29.svg",
        strength: "melancholic",
        weakness: "sanguine",
        password: "vigil123",
      },
    }),
  ]);

  console.log('Created houses');

  // Create Games with Scores
  const game1 = await prisma.game.create({
    data: {
      name: "The Great Tournament of 1453",
      description: "A grand tournament where houses competed in tests of strength, wisdom, and balance.",
      scores: {
        create: [
          {
            houseId: houses[0].id, // House of Boils
            choleric: 150,
            phlegmatic: 45,
            melancholic: 120,
            sanguine: 67,
          },
          {
            houseId: houses[3].id, // House of Crimson Tides
            choleric: 89,
            phlegmatic: 23,
            melancholic: 78,
            sanguine: 145,
          },
          {
            houseId: houses[6].id, // House of Twilight
            choleric: 45,
            phlegmatic: 98,
            melancholic: 134,
            sanguine: 56,
          },
        ],
      },
    },
  });

  const game2 = await prisma.game.create({
    data: {
      name: "Battle of the Four Humours",
      description: "An epic confrontation testing mastery of all four humours in a single day.",
      scores: {
        create: [
          {
            houseId: houses[1].id, // House of Miasma
            choleric: 200,
            phlegmatic: 12,
            melancholic: 45,
            sanguine: 89,
          },
          {
            houseId: houses[2].id, // Plague Doctors
            choleric: 34,
            phlegmatic: 11,
            melancholic: 156,
            sanguine: 78,
          },
          {
            houseId: houses[7].id, // House of Golden Dawn
            choleric: 67,
            phlegmatic: 123,
            melancholic: 45,
            sanguine: 234,
          },
          {
            houseId: houses[8].id, // House of Frost
            choleric: 56,
            phlegmatic: 189,
            melancholic: 78,
            sanguine: 34,
          },
        ],
      },
    },
  });

  const game3 = await prisma.game.create({
    data: {
      name: "The Equilibrium Challenge",
      scores: {
        create: [
          {
            houseId: houses[4].id, // House of Whispers
            choleric: 78,
            phlegmatic: 167,
            melancholic: 56,
            sanguine: 89,
          },
          {
            houseId: houses[5].id, // House of Iron Will
            choleric: 234,
            phlegmatic: 45,
            melancholic: 89,
            sanguine: 34,
          },
          {
            houseId: houses[9].id, // House of Verdant Roots
            choleric: 112,
            phlegmatic: 67,
            melancholic: 178,
            sanguine: 89,
          },
        ],
      },
    },
  });

  const game4 = await prisma.game.create({
    data: {
      name: "The Moonlit Trials",
      description: "A nocturnal competition testing endurance and wisdom under the pale moon.",
      scores: {
        create: [
          {
            houseId: houses[10].id, // House of Silver Moon
            choleric: 67,
            phlegmatic: 234,
            melancholic: 123,
            sanguine: 89,
          },
          {
            houseId: houses[2].id, // Plague Doctors
            choleric: 52,
            phlegmatic: 12,
            melancholic: 78,
            sanguine: 156,
          },
          {
            houseId: houses[6].id, // House of Twilight
            choleric: 122,
            phlegmatic: 200,
            melancholic: 311,
            sanguine: 133,
          },
        ],
      },
    },
  });

  const game5 = await prisma.game.create({
    data: {
      name: "The Inferno Gauntlet",
      description: "A test of raw power and fiery determination through trials of flame.",
      scores: {
        create: [
          {
            houseId: houses[11].id, // House of Ember
            choleric: 378,
            phlegmatic: 56,
            melancholic: 89,
            sanguine: 167,
          },
          {
            houseId: houses[0].id, // House of Boils
            choleric: 450,
            phlegmatic: 178,
            melancholic: 414,
            sanguine: 167,
          },
          {
            houseId: houses[5].id, // House of Iron Will
            choleric: 444,
            phlegmatic: 89,
            melancholic: 156,
            sanguine: 27,
          },
        ],
      },
    },
  });

  const game6 = await prisma.game.create({
    data: {
      name: "The Vigil of Shadows",
      description: "An ancient rite where houses prove their worth through contemplation and vigilance.",
      scores: {
        create: [
          {
            houseId: houses[12].id, // House of Eternal Vigil
            choleric: 98,
            phlegmatic: 145,
            melancholic: 412,
            sanguine: 67,
          },
          {
            houseId: houses[4].id, // House of Whispers
            choleric: 123,
            phlegmatic: 322,
            melancholic: 100,
            sanguine: 189,
          },
          {
            houseId: houses[9].id, // House of Verdant Roots
            choleric: 177,
            phlegmatic: 89,
            melancholic: 300,
            sanguine: 145,
          },
          {
            houseId: houses[7].id, // House of Golden Dawn
            choleric: 167,
            phlegmatic: 222,
            melancholic: 78,
            sanguine: 378,
          },
        ],
      },
    },
  });

  console.log('Created games with scores');

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });