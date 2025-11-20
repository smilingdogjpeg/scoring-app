-- CreateEnum
CREATE TYPE "Humour" AS ENUM ('choleric', 'phlegmatic', 'melancholic', 'sanguine');

-- CreateTable
CREATE TABLE "House" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "motto" TEXT NOT NULL,
    "crestUrl" TEXT,
    "strength" "Humour" NOT NULL,
    "weakness" "Humour" NOT NULL,
    "password" TEXT NOT NULL,
    "factionId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "House_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faction" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "motto" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Faction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Score" (
    "id" SERIAL NOT NULL,
    "houseId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "choleric" INTEGER NOT NULL,
    "phlegmatic" INTEGER NOT NULL,
    "melancholic" INTEGER NOT NULL,
    "sanguine" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "House" ADD CONSTRAINT "House_factionId_fkey" FOREIGN KEY ("factionId") REFERENCES "Faction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "House"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
