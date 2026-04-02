-- CreateTable
CREATE TABLE "CreationType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreationType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chakra" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "description" TEXT,
    "position" INTEGER NOT NULL,

    CONSTRAINT "Chakra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZodiacSign" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT,
    "element" TEXT,

    CONSTRAINT "ZodiacSign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Precaution" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Precaution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stock" (
    "id" SERIAL NOT NULL,
    "crystalId" INTEGER NOT NULL,
    "perlesCailloux" INTEGER NOT NULL DEFAULT 0,
    "perles2mm" INTEGER NOT NULL DEFAULT 0,
    "perles4mm" INTEGER NOT NULL DEFAULT 0,
    "perles6mm" INTEGER NOT NULL DEFAULT 0,
    "pierresRoulees" INTEGER NOT NULL DEFAULT 0,
    "pierresBrutes" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Crystal" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT NOT NULL,
    "colors" TEXT[],
    "imageUrl" TEXT,
    "virtues" TEXT[],
    "properties" TEXT[],
    "hardness" DOUBLE PRECISION,
    "origin" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Crystal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CrystalCreationTypes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CrystalChakras" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CrystalZodiacs" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CrystalToPrecaution" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CrystalCompatibility" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CrystalIncompatibility" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "CreationType_name_key" ON "CreationType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Chakra_name_key" ON "Chakra"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ZodiacSign_name_key" ON "ZodiacSign"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_crystalId_key" ON "Stock"("crystalId");

-- CreateIndex
CREATE UNIQUE INDEX "Crystal_name_key" ON "Crystal"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Crystal_slug_key" ON "Crystal"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_CrystalCreationTypes_AB_unique" ON "_CrystalCreationTypes"("A", "B");

-- CreateIndex
CREATE INDEX "_CrystalCreationTypes_B_index" ON "_CrystalCreationTypes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CrystalChakras_AB_unique" ON "_CrystalChakras"("A", "B");

-- CreateIndex
CREATE INDEX "_CrystalChakras_B_index" ON "_CrystalChakras"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CrystalZodiacs_AB_unique" ON "_CrystalZodiacs"("A", "B");

-- CreateIndex
CREATE INDEX "_CrystalZodiacs_B_index" ON "_CrystalZodiacs"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CrystalToPrecaution_AB_unique" ON "_CrystalToPrecaution"("A", "B");

-- CreateIndex
CREATE INDEX "_CrystalToPrecaution_B_index" ON "_CrystalToPrecaution"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CrystalCompatibility_AB_unique" ON "_CrystalCompatibility"("A", "B");

-- CreateIndex
CREATE INDEX "_CrystalCompatibility_B_index" ON "_CrystalCompatibility"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CrystalIncompatibility_AB_unique" ON "_CrystalIncompatibility"("A", "B");

-- CreateIndex
CREATE INDEX "_CrystalIncompatibility_B_index" ON "_CrystalIncompatibility"("B");

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_crystalId_fkey" FOREIGN KEY ("crystalId") REFERENCES "Crystal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CrystalCreationTypes" ADD CONSTRAINT "_CrystalCreationTypes_A_fkey" FOREIGN KEY ("A") REFERENCES "CreationType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CrystalCreationTypes" ADD CONSTRAINT "_CrystalCreationTypes_B_fkey" FOREIGN KEY ("B") REFERENCES "Crystal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CrystalChakras" ADD CONSTRAINT "_CrystalChakras_A_fkey" FOREIGN KEY ("A") REFERENCES "Chakra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CrystalChakras" ADD CONSTRAINT "_CrystalChakras_B_fkey" FOREIGN KEY ("B") REFERENCES "Crystal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CrystalZodiacs" ADD CONSTRAINT "_CrystalZodiacs_A_fkey" FOREIGN KEY ("A") REFERENCES "Crystal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CrystalZodiacs" ADD CONSTRAINT "_CrystalZodiacs_B_fkey" FOREIGN KEY ("B") REFERENCES "ZodiacSign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CrystalToPrecaution" ADD CONSTRAINT "_CrystalToPrecaution_A_fkey" FOREIGN KEY ("A") REFERENCES "Crystal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CrystalToPrecaution" ADD CONSTRAINT "_CrystalToPrecaution_B_fkey" FOREIGN KEY ("B") REFERENCES "Precaution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CrystalCompatibility" ADD CONSTRAINT "_CrystalCompatibility_A_fkey" FOREIGN KEY ("A") REFERENCES "Crystal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CrystalCompatibility" ADD CONSTRAINT "_CrystalCompatibility_B_fkey" FOREIGN KEY ("B") REFERENCES "Crystal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CrystalIncompatibility" ADD CONSTRAINT "_CrystalIncompatibility_A_fkey" FOREIGN KEY ("A") REFERENCES "Crystal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CrystalIncompatibility" ADD CONSTRAINT "_CrystalIncompatibility_B_fkey" FOREIGN KEY ("B") REFERENCES "Crystal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
