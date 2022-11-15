/*
  Warnings:

  - You are about to drop the column `collectionId` on the `Album` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Album" DROP CONSTRAINT "Album_collectionId_fkey";

-- AlterTable
ALTER TABLE "Album" DROP COLUMN "collectionId";

-- CreateTable
CREATE TABLE "_AlbumToCollection" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AlbumToCollection_AB_unique" ON "_AlbumToCollection"("A", "B");

-- CreateIndex
CREATE INDEX "_AlbumToCollection_B_index" ON "_AlbumToCollection"("B");

-- AddForeignKey
ALTER TABLE "_AlbumToCollection" ADD CONSTRAINT "_AlbumToCollection_A_fkey" FOREIGN KEY ("A") REFERENCES "Album"("albumId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlbumToCollection" ADD CONSTRAINT "_AlbumToCollection_B_fkey" FOREIGN KEY ("B") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
