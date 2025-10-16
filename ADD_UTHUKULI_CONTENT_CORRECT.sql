-- ========================================
-- UTHUKULI BRANCH SAMPLE CONTENT (CORRECTED)
-- Using actual table structures from your database
-- ========================================

-- ========================================
-- 1. CAROUSEL IMAGES (Hero Section)
-- Table: carousel_images (using imageUrl, displayOrder, isActive)
-- ========================================
INSERT INTO carousel_images (id, branch_id, imageUrl, title, description, displayOrder, isActive) VALUES
(UUID(), 'uthukuli', '/images/uthukuli/carousel/campus-entrance.jpg', 'Welcome to Annai School Uthukuli', 'Where Excellence Meets Innovation', 1, 1),
(UUID(), 'uthukuli', '/images/uthukuli/carousel/classroom.jpg', 'Modern Learning Environment', 'State-of-the-art Classrooms & Smart Boards', 2, 1),
(UUID(), 'uthukuli', '/images/uthukuli/carousel/sports-day.jpg', 'Sports & Physical Education', 'Building Strong Minds & Bodies', 3, 1),
(UUID(), 'uthukuli', '/images/uthukuli/carousel/science-lab.jpg', 'Advanced Laboratory Facilities', 'Hands-on Learning Experience', 4, 1),
(UUID(), 'uthukuli', '/images/uthukuli/carousel/library.jpg', 'Rich Library Collection', 'Over 5,000 Books & Digital Resources', 5, 1);

-- ========================================
-- 2. NEWS & ANNOUNCEMENTS
-- Table: published_news
-- ========================================
-- First check the structure of published_news
DESCRIBE published_news;

-- If published_news has similar structure, insert news items
-- (Adjust columns based on DESCRIBE output - I'll create a separate script)

-- ========================================
-- 3. GALLERY IMAGES
-- Table: gallery (not gallery_images)
-- ========================================
DESCRIBE gallery;

-- ========================================
-- 4. ACHIEVERS / TOPPERS
-- Table: achievers (using title, not achievement_title)
-- ========================================
INSERT INTO achievers (id, branch_id, student_name, title, description, achievement_date, image_url, display_order, is_active) VALUES
(UUID(), 'uthukuli', 'Priya Ramesh', 'State Rank 3 - Class 10 Board Exams', 'Secured 98.5% marks in CBSE Board Exams 2024 and achieved State Rank 3. Her dedication and hard work are truly inspiring.', '2024-05-15', '/images/uthukuli/achievers/priya-ramesh.jpg', 1, 1),

(UUID(), 'uthukuli', 'Arun Kumar', 'Gold Medal - District Chess Championship', 'Won Gold Medal in Under-14 District Chess Championship. He defeated 50+ participants to clinch the top position.', '2024-11-20', '/images/uthukuli/achievers/arun-kumar.jpg', 2, 1),

(UUID(), 'uthukuli', 'Divya Lakshmi', 'National Level Science Olympiad Winner', 'Secured All India Rank 15 in National Science Olympiad. Her project on "Water Conservation" received special recognition.', '2024-09-10', '/images/uthukuli/achievers/divya-lakshmi.jpg', 3, 1),

(UUID(), 'uthukuli', 'Karthik Selvam', 'Best Speaker - State Level Debate', 'Awarded Best Speaker at Tamil Nadu State Level Debate Competition. His eloquence and knowledge impressed all judges.', '2024-10-05', '/images/uthukuli/achievers/karthik-selvam.jpg', 4, 1),

(UUID(), 'uthukuli', 'Meera Krishnan', '100% in Mathematics - Class 12', 'Achieved perfect 100/100 score in Mathematics in CBSE Class 12 Board Exams. She is passionate about pursuing engineering.', '2024-05-15', '/images/uthukuli/achievers/meera-krishnan.jpg', 5, 1),

(UUID(), 'uthukuli', 'Rahul Venkat', 'Silver Medal - State Athletics Meet', 'Won Silver Medal in 100m sprint at State Level Athletics Championship. He completed the race in 11.2 seconds.', '2024-12-02', '/images/uthukuli/achievers/rahul-venkat.jpg', 6, 1),

(UUID(), 'uthukuli', 'Anjali Devi', 'Best Performer - Bharatanatyam Competition', 'Won First Prize in District Level Bharatanatyam Competition. Her graceful performance mesmerized the audience.', '2024-08-15', '/images/uthukuli/achievers/anjali-devi.jpg', 7, 1),

(UUID(), 'uthukuli', 'Suresh Babu', 'Young Scientist Award', 'Received Young Scientist Award for innovative project on "Solar Energy Harvesting". The project was displayed at state exhibition.', '2024-10-20', '/images/uthukuli/achievers/suresh-babu.jpg', 8, 1);

-- ========================================
-- 5. ABOUT SECTIONS
-- Table: about_sections (likely)
-- ========================================
DESCRIBE about_sections;

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- Check Carousel Images
SELECT 'Carousel Images for Uthukuli:' as section;
SELECT COUNT(*) as total_images, branch_id FROM carousel_images WHERE branch_id = 'uthukuli' GROUP BY branch_id;

-- Check Achievers
SELECT 'Achievers for Uthukuli:' as section;
SELECT COUNT(*) as total_achievers, branch_id FROM achievers WHERE branch_id = 'uthukuli' GROUP BY branch_id;

-- Summary
SELECT 'SUMMARY - Uthukuli Branch Content:' as info;
SELECT 
    (SELECT COUNT(*) FROM carousel_images WHERE branch_id = 'uthukuli') as carousel_images,
    (SELECT COUNT(*) FROM achievers WHERE branch_id = 'uthukuli') as achievers;
