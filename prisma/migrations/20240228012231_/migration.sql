-- CreateTable
CREATE TABLE "Configs" (
    "id" SERIAL NOT NULL,
    "minimumPrice" INTEGER NOT NULL,
    "pricePerMeters" INTEGER NOT NULL,

    CONSTRAINT "Configs_pkey" PRIMARY KEY ("id")
);
