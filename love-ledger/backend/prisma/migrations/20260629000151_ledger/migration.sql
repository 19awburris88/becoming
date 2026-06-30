-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "birthday" TIMESTAMP(3),
    "anniversary" TIMESTAMP(3),
    "phone" TEXT,
    "email" TEXT,
    "photo" TEXT,
    "favorites" JSONB NOT NULL DEFAULT '{}',
    "sizes" JSONB NOT NULL DEFAULT '{}',
    "loveProfile" JSONB NOT NULL DEFAULT '{}',
    "notes" TEXT,
    "lastContact" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImportantDate" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "reminderDays" INTEGER[],
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImportantDate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Memory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "tags" TEXT[],
    "photos" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Memory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gift" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "occasion" TEXT NOT NULL,
    "budget" DOUBLE PRECISION,
    "purchaseLink" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Idea',
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reminder" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "sendAt" TIMESTAMP(3) NOT NULL,
    "channel" TEXT NOT NULL,
    "sent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MemoryToPerson" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "Person_userId_idx" ON "Person"("userId");

-- CreateIndex
CREATE INDEX "ImportantDate_personId_idx" ON "ImportantDate"("personId");

-- CreateIndex
CREATE INDEX "Memory_userId_idx" ON "Memory"("userId");

-- CreateIndex
CREATE INDEX "Gift_userId_idx" ON "Gift"("userId");

-- CreateIndex
CREATE INDEX "Gift_personId_idx" ON "Gift"("personId");

-- CreateIndex
CREATE INDEX "Reminder_userId_sendAt_idx" ON "Reminder"("userId", "sendAt");

-- CreateIndex
CREATE UNIQUE INDEX "_MemoryToPerson_AB_unique" ON "_MemoryToPerson"("A", "B");

-- CreateIndex
CREATE INDEX "_MemoryToPerson_B_index" ON "_MemoryToPerson"("B");

-- AddForeignKey
ALTER TABLE "ImportantDate" ADD CONSTRAINT "ImportantDate_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gift" ADD CONSTRAINT "Gift_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MemoryToPerson" ADD CONSTRAINT "_MemoryToPerson_A_fkey" FOREIGN KEY ("A") REFERENCES "Memory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MemoryToPerson" ADD CONSTRAINT "_MemoryToPerson_B_fkey" FOREIGN KEY ("B") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
