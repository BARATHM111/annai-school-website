-- ========================================
-- FIX: Make Uthukuli Images Visible on Frontend
-- Replace local paths with working Unsplash placeholder images
-- ========================================

-- Fix Carousel Images - Use Unsplash for immediate visibility
UPDATE carousel_images 
SET imageUrl = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&h=1080&fit=crop&q=80' 
WHERE branch_id = 'uthukuli' AND title LIKE '%Welcome%';

UPDATE carousel_images 
SET imageUrl = 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1920&h=1080&fit=crop&q=80' 
WHERE branch_id = 'uthukuli' AND title LIKE '%Learning%';

UPDATE carousel_images 
SET imageUrl = 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1920&h=1080&fit=crop&q=80' 
WHERE branch_id = 'uthukuli' AND title LIKE '%Sports%';

UPDATE carousel_images 
SET imageUrl = 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1920&h=1080&fit=crop&q=80' 
WHERE branch_id = 'uthukuli' AND title LIKE '%Laboratory%';

UPDATE carousel_images 
SET imageUrl = 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1920&h=1080&fit=crop&q=80' 
WHERE branch_id = 'uthukuli' AND title LIKE '%Library%';

-- Fix Achievers Images - Use diverse portrait images
UPDATE achievers 
SET image_url = 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&q=80' 
WHERE branch_id = 'uthukuli' AND student_name = 'Priya Ramesh';

UPDATE achievers 
SET image_url = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80' 
WHERE branch_id = 'uthukuli' AND student_name = 'Arun Kumar';

UPDATE achievers 
SET image_url = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&q=80' 
WHERE branch_id = 'uthukuli' AND student_name = 'Divya Lakshmi';

UPDATE achievers 
SET image_url = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&q=80' 
WHERE branch_id = 'uthukuli' AND student_name = 'Karthik Selvam';

UPDATE achievers 
SET image_url = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&q=80' 
WHERE branch_id = 'uthukuli' AND student_name = 'Meera Krishnan';

UPDATE achievers 
SET image_url = 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&q=80' 
WHERE branch_id = 'uthukuli' AND student_name = 'Rahul Venkat';

UPDATE achievers 
SET image_url = 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop&q=80' 
WHERE branch_id = 'uthukuli' AND student_name = 'Anjali Devi';

UPDATE achievers 
SET image_url = 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop&q=80' 
WHERE branch_id = 'uthukuli' AND student_name = 'Suresh Babu';

-- Verify images are updated
SELECT '✅ Carousel Images Updated:' as status;
SELECT title, LEFT(imageUrl, 50) as image_preview FROM carousel_images WHERE branch_id = 'uthukuli' ORDER BY displayOrder;

SELECT '✅ Achievers Images Updated:' as status;
SELECT student_name, LEFT(image_url, 50) as image_preview FROM achievers WHERE branch_id = 'uthukuli' ORDER BY display_order;

SELECT '✅ All images now use working URLs - check frontend!' as message;
