CREATE TABLE "House" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "crestUrl" TEXT,
    "joinCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "House_pkey" PRIMARY KEY ("id")
);


CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "houseId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);


CREATE TABLE "Score" (
    "id" TEXT NOT NULL,
    "houseId" TEXT NOT NULL,
    "gameDay" INTEGER NOT NULL,
    "choleric" INTEGER NOT NULL,
    "melancholic" INTEGER NOT NULL,
    "sanguine" INTEGER NOT NULL,
    "phlegmatic" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Faction" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Faction_pkey" PRIMARY KEY ("id")
);


CREATE TABLE "FactionMember" (
    "factionId" TEXT NOT NULL,
    "houseId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FactionMember_pkey" PRIMARY KEY ("factionId","houseId")
);


CREATE UNIQUE INDEX "House_joinCode_key" ON "House"("joinCode");


CREATE UNIQUE INDEX "Member_houseId_clientId_key" ON "Member"("houseId", "clientId");


ALTER TABLE "Member" ADD CONSTRAINT "Member_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "House"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "Score" ADD CONSTRAINT "Score_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "House"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "FactionMember" ADD CONSTRAINT "FactionMember_factionId_fkey" FOREIGN KEY ("factionId") REFERENCES "Faction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "FactionMember" ADD CONSTRAINT "FactionMember_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "House"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
