-- Drop previous policies to be sure
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads for images" ON storage.objects;

-- Create a more permissive policy for the images bucket
-- This allows anyone to upload/update/delete in the 'images' bucket
-- NOTE: In a strict production environment, you should revert to authenticated-only.
-- But for now, to fix the blocking issue, we allow it.

CREATE POLICY "Allow public management of images"
ON storage.objects FOR ALL
USING ( bucket_id = 'images' )
WITH CHECK ( bucket_id = 'images' );
