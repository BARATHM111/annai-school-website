-- ========================================
-- OPTIONAL: Use Placeholder Images from Unsplash
-- This script updates all Uthukuli images to use free placeholder images
-- Run this if you want to see the content immediately without uploading images
-- ========================================

-- Update Carousel Images with Education-themed Unsplash images
UPDATE carousel_images SET image_url = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&h=1080&fit=crop' WHERE branch_id = 'uthukuli' AND title LIKE '%Welcome%';
UPDATE carousel_images SET image_url = 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1920&h=1080&fit=crop' WHERE branch_id = 'uthukuli' AND title LIKE '%Learning Environment%';
UPDATE carousel_images SET image_url = 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1920&h=1080&fit=crop' WHERE branch_id = 'uthukuli' AND title LIKE '%Sports%';
UPDATE carousel_images SET image_url = 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1920&h=1080&fit=crop' WHERE branch_id = 'uthukuli' AND title LIKE '%Laboratory%';
UPDATE carousel_images SET image_url = 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1920&h=1080&fit=crop' WHERE branch_id = 'uthukuli' AND title LIKE '%Library%';

-- Update News Images
UPDATE news SET image_url = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop' WHERE branch_id = 'uthukuli' AND title LIKE '%Annual Day%';
UPDATE news SET image_url = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop' WHERE branch_id = 'uthukuli' AND title LIKE '%Science%';
UPDATE news SET image_url = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop' WHERE branch_id = 'uthukuli' AND title LIKE '%Computer Lab%';
UPDATE news SET image_url = 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop' WHERE branch_id = 'uthukuli' AND title LIKE '%Sports Day%';
UPDATE news SET image_url = 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop' WHERE branch_id = 'uthukuli' AND title LIKE '%Parent%';
UPDATE news SET image_url = 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop' WHERE branch_id = 'uthukuli' AND title LIKE '%Cultural%';

-- Update Gallery Images - Infrastructure
UPDATE gallery_images SET image_url = 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&h=800&fit=crop' WHERE branch_id = 'uthukuli' AND title LIKE '%Main%Building%';
UPDATE gallery_images SET image_url = 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1200&h=800&fit=crop' WHERE branch_id = 'uthukuli' AND title LIKE '%Sports Ground%';
UPDATE gallery_images SET image_url = 'https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?w=1200&h=800&fit=crop' WHERE branch_id = 'uthukuli' AND title LIKE '%Auditorium%';
UPDATE gallery_images SET image_url = 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&h=800&fit=crop' WHERE branch_id = 'uthukuli' AND title LIKE '%Reception%';

-- Update Gallery Images - Facilities
UPDATE gallery_images SET image_url = 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&h=800&fit=crop' WHERE branch_id = 'uthukuli' AND title LIKE '%Smart Classroom%';
UPDATE gallery_images SET image_url = 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&h=800&fit=crop' WHERE branch_id = 'uthukuli' AND category = 'facilities' AND title LIKE '%Science%';
UPDATE gallery_images SET image_url = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=800&fit=crop' WHERE branch_id = 'uthukuli' AND category = 'facilities' AND title LIKE '%Computer%';
UPDATE gallery_images SET image_url = 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200&h=800&fit=crop' WHERE branch_id = 'uthukuli' AND category = 'facilities' AND title LIKE '%Library%';
UPDATE gallery_images SET image_url = 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=1200&h=800&fit=crop' WHERE branch_id = 'uthukuli' AND title LIKE '%Activity Room%';

-- Update Gallery Images - Events
UPDATE gallery_images SET image_url = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=800&fit=crop' WHERE branch_id = 'uthukuli' AND category = 'events' AND title LIKE '%Annual%';
UPDATE gallery_images SET image_url = 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=1200&h=800&fit=crop' WHERE branch_id = 'uthukuli' AND title LIKE '%Independence%';
UPDATE gallery_images SET image_url = 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&h=800&fit=crop' WHERE branch_id = 'uthukuli' AND title LIKE '%Republic%';
UPDATE gallery_images SET image_url = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=800&fit=crop' WHERE branch_id = 'uthukuli' AND category = 'events' AND title LIKE '%Science%';
UPDATE gallery_images SET image_url = 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=800&fit=crop' WHERE branch_id = 'uthukuli' AND category = 'events' AND title LIKE '%Cultural%';

-- Update Gallery Images - Sports
UPDATE gallery_images SET image_url = 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&h=800&fit=crop' WHERE branch_id = 'uthukuli' AND title LIKE '%Cricket%';
UPDATE gallery_images SET image_url = 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=800&fit=crop' WHERE branch_id = 'uthukuli' AND title LIKE '%Athletics%';
UPDATE gallery_images SET image_url = 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=800&fit=crop' WHERE branch_id = 'uthukuli' AND title LIKE '%Yoga%';
UPDATE gallery_images SET image_url = 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&h=800&fit=crop' WHERE branch_id = 'uthukuli' AND title LIKE '%Kabaddi%';

-- Update Gallery Images - Students
UPDATE gallery_images SET image_url = 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1200&h=800&fit=crop' WHERE branch_id = 'uthukuli' AND title LIKE '%Morning Assembly%';
UPDATE gallery_images SET image_url = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=800&fit=crop' WHERE branch_id = 'uthukuli' AND title LIKE '%Group Study%';
UPDATE gallery_images SET image_url = 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=1200&h=800&fit=crop' WHERE branch_id = 'uthukuli' AND title LIKE '%Art Class%';
UPDATE gallery_images SET image_url = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop' WHERE branch_id = 'uthukuli' AND title LIKE '%Music%';

-- Update Achievers Images (Student portraits)
UPDATE achievers SET image_url = 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop' WHERE branch_id = 'uthukuli' AND student_name = 'Priya Ramesh';
UPDATE achievers SET image_url = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' WHERE branch_id = 'uthukuli' AND student_name = 'Arun Kumar';
UPDATE achievers SET image_url = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop' WHERE branch_id = 'uthukuli' AND student_name = 'Divya Lakshmi';
UPDATE achievers SET image_url = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop' WHERE branch_id = 'uthukuli' AND student_name = 'Karthik Selvam';
UPDATE achievers SET image_url = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop' WHERE branch_id = 'uthukuli' AND student_name = 'Meera Krishnan';
UPDATE achievers SET image_url = 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop' WHERE branch_id = 'uthukuli' AND student_name = 'Rahul Venkat';
UPDATE achievers SET image_url = 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop' WHERE branch_id = 'uthukuli' AND student_name = 'Anjali Devi';
UPDATE achievers SET image_url = 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop' WHERE branch_id = 'uthukuli' AND student_name = 'Suresh Babu';

-- Update About Section Images
UPDATE about_section SET image_url = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=800&fit=crop' WHERE branch_id = 'uthukuli' AND section_type = 'mission';
UPDATE about_section SET image_url = 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1200&h=800&fit=crop' WHERE branch_id = 'uthukuli' AND section_type = 'vision';
UPDATE about_section SET image_url = 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&h=800&fit=crop' WHERE branch_id = 'uthukuli' AND section_type = 'values';
UPDATE about_section SET image_url = 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&h=800&fit=crop' WHERE branch_id = 'uthukuli' AND section_type = 'facilities';

SELECT '✅ All Uthukuli images updated with Unsplash placeholders!' as status;
SELECT 'Note: These are temporary placeholder images. Replace with actual school photos via admin panel.' as note;
