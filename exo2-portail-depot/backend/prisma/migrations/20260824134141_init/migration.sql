-- CreateTable
CREATE TABLE "Avocat" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Avocat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Depot" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "pinhash" TEXT NOT NULL,
    "filecount" INTEGER NOT NULL,
    "expirelink" TIMESTAMP(3) NOT NULL,
    "completedfile" TIMESTAMP(3),
    "failpin" INTEGER NOT NULL DEFAULT 0,
    "lock" TIMESTAMP(3),
    "create" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownid" TEXT NOT NULL,

    CONSTRAINT "Depot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Depotfichier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "object" TEXT NOT NULL,
    "create" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requestid" TEXT NOT NULL,

    CONSTRAINT "Depotfichier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Avocat_email_key" ON "Avocat"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Depot_token_key" ON "Depot"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Depotfichier_object_key" ON "Depotfichier"("object");

-- AddForeignKey
ALTER TABLE "Depot" ADD CONSTRAINT "Depot_ownid_fkey" FOREIGN KEY ("ownid") REFERENCES "Avocat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Depotfichier" ADD CONSTRAINT "Depotfichier_requestid_fkey" FOREIGN KEY ("requestid") REFERENCES "Depot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
