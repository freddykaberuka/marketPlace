/*
  Warnings:

  - Added the required column `categoryId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stock` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- Step 1: Add the new columns as nullable
ALTER TABLE "Product"
ADD COLUMN "categoryId" TEXT,
ADD COLUMN "description" TEXT,
ADD COLUMN "stock" INTEGER,
ADD COLUMN "updatedAt" TIMESTAMP(3);

-- Step 2: Update existing rows with default values
UPDATE "Product"
SET 
  "categoryId" = 'default-category-id',  -- Provide a default category ID
  "description" = 'No description',      -- Provide a default description
  "stock" = 0,                           -- Provide a default stock value
  "updatedAt" = CURRENT_TIMESTAMP;       -- Set updatedAt to the current timestamp

-- Step 3: Make the columns NOT NULL
ALTER TABLE "Product"
ALTER COLUMN "categoryId" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "stock" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;

-- Step 4: Create the Category table
CREATE TABLE "Category" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,

  CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- Step 5: Create a unique index on the Category name
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- Step 6: Add a foreign key constraint
ALTER TABLE "Product"
ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;