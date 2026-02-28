-- Add category column to posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Berita';

-- Update existing rows to have a default category
UPDATE posts SET category = 'Berita' WHERE category IS NULL;
