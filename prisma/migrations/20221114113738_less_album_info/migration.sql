/*
  Warnings:

  - The primary key for the `Album` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `albumName` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the column `artist` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the column `largeImageUrl` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the column `releaseYear` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Album` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Album_albumId_key";

-- AlterTable
ALTER TABLE "Album" DROP CONSTRAINT "Album_pkey",
DROP COLUMN "albumName",
DROP COLUMN "artist",
DROP COLUMN "id",
DROP COLUMN "largeImageUrl",
DROP COLUMN "releaseYear",
DROP COLUMN "url",
ADD CONSTRAINT "Album_pkey" PRIMARY KEY ("albumId");
