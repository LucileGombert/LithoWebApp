-- AlterTable
ALTER TABLE "_CrystalChakras" ADD CONSTRAINT "_CrystalChakras_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_CrystalChakras_AB_unique";

-- AlterTable
ALTER TABLE "_CrystalCompatibility" ADD CONSTRAINT "_CrystalCompatibility_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_CrystalCompatibility_AB_unique";

-- AlterTable
ALTER TABLE "_CrystalCreationTypes" ADD CONSTRAINT "_CrystalCreationTypes_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_CrystalCreationTypes_AB_unique";

-- AlterTable
ALTER TABLE "_CrystalIncompatibility" ADD CONSTRAINT "_CrystalIncompatibility_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_CrystalIncompatibility_AB_unique";

-- AlterTable
ALTER TABLE "_CrystalToPrecaution" ADD CONSTRAINT "_CrystalToPrecaution_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_CrystalToPrecaution_AB_unique";

-- AlterTable
ALTER TABLE "_CrystalZodiacs" ADD CONSTRAINT "_CrystalZodiacs_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_CrystalZodiacs_AB_unique";
