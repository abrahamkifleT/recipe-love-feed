-- Add video_url column to recipes
ALTER TABLE public.recipes ADD COLUMN video_url text;

-- Create storage bucket for recipe videos
INSERT INTO storage.buckets (id, name, public) VALUES ('recipe-videos', 'recipe-videos', true);

-- Allow public read access
CREATE POLICY "Recipe videos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'recipe-videos');

-- Allow authenticated users to upload
CREATE POLICY "Users can upload recipe videos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'recipe-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own videos
CREATE POLICY "Users can delete their own recipe videos"
ON storage.objects FOR DELETE
USING (bucket_id = 'recipe-videos' AND auth.uid()::text = (storage.foldername(name))[1]);