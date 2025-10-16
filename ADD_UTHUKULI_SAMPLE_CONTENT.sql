-- ========================================
-- UTHUKULI BRANCH SAMPLE CONTENT
-- Add sample data for Carousel, News, Gallery, and Achievers
-- ========================================

-- ========================================
-- 1. CAROUSEL IMAGES (Hero Section)
-- ========================================
INSERT INTO carousel_images (id, branch_id, image_url, title, subtitle, display_order, is_active) VALUES
(UUID(), 'uthukuli', '/images/uthukuli/carousel/campus-entrance.jpg', 'Welcome to Annai School Uthukuli', 'Where Excellence Meets Innovation', 1, true),
(UUID(), 'uthukuli', '/images/uthukuli/carousel/classroom.jpg', 'Modern Learning Environment', 'State-of-the-art Classrooms & Smart Boards', 2, true),
(UUID(), 'uthukuli', '/images/uthukuli/carousel/sports-day.jpg', 'Sports & Physical Education', 'Building Strong Minds & Bodies', 3, true),
(UUID(), 'uthukuli', '/images/uthukuli/carousel/science-lab.jpg', 'Advanced Laboratory Facilities', 'Hands-on Learning Experience', 4, true),
(UUID(), 'uthukuli', '/images/uthukuli/carousel/library.jpg', 'Rich Library Collection', 'Over 5,000 Books & Digital Resources', 5, true);

-- ========================================
-- 2. NEWS & ANNOUNCEMENTS
-- ========================================
INSERT INTO news (id, branch_id, title, description, category, image_url, date, published) VALUES
(UUID(), 'uthukuli', 'Annual Day Celebration 2025', 'Our Annual Day was a grand success with students showcasing their talents through dance, drama, and music performances. Parents and guests were thoroughly entertained by the spectacular show put together by our talented students and dedicated teachers.', 'events', '/images/uthukuli/news/annual-day-2025.jpg', '2025-01-15', true),

(UUID(), 'uthukuli', 'Science Exhibition Winners', 'Congratulations to our Grade 9 students who won 1st prize in the District Level Science Exhibition! Their innovative project on "Renewable Energy Solutions" impressed judges and visitors alike. This achievement brings great pride to our school.', 'achievements', '/images/uthukuli/news/science-exhibition.jpg', '2025-01-10', true),

(UUID(), 'uthukuli', 'New Computer Lab Inauguration', 'We are thrilled to announce the inauguration of our state-of-the-art computer lab with 40 latest generation computers. This facility will enhance our students\' digital literacy and coding skills, preparing them for the technology-driven future.', 'facilities', '/images/uthukuli/news/computer-lab.jpg', '2025-01-05', true),

(UUID(), 'uthukuli', 'Sports Day 2024 - Grand Success', 'Our annual Sports Day was held with great enthusiasm! Students participated in various track and field events, demonstrating exceptional sportsmanship and athletic abilities. The event concluded with an exciting relay race and prize distribution ceremony.', 'sports', '/images/uthukuli/news/sports-day-2024.jpg', '2024-12-20', true),

(UUID(), 'uthukuli', 'Parent-Teacher Meeting - January 2025', 'We invite all parents for the Parent-Teacher Meeting scheduled for January 25th, 2025. This is an excellent opportunity to discuss your child\'s academic progress, behavior, and overall development. Please make sure to attend this important meeting.', 'announcements', '/images/uthukuli/news/ptm-january.jpg', '2025-01-12', true),

(UUID(), 'uthukuli', 'Cultural Fest - "Kalakaar 2025"', 'Join us for our grand cultural festival "Kalakaar 2025" featuring dance competitions, singing contests, drama performances, and art exhibitions. Students from all grades will showcase their creative talents. Date: February 10th, 2025.', 'events', '/images/uthukuli/news/cultural-fest.jpg', '2025-01-08', true);

-- ========================================
-- 3. GALLERY IMAGES
-- ========================================

-- Campus & Infrastructure
INSERT INTO gallery_images (id, branch_id, category, image_url, title, description, display_order, is_featured) VALUES
(UUID(), 'uthukuli', 'infrastructure', '/images/uthukuli/gallery/main-building.jpg', 'Main School Building', 'Our beautiful school building with modern architecture and spacious classrooms', 1, true),
(UUID(), 'uthukuli', 'infrastructure', '/images/uthukuli/gallery/playground.jpg', 'Sports Ground', 'Expansive playground with facilities for cricket, football, and athletics', 2, true),
(UUID(), 'uthukuli', 'infrastructure', '/images/uthukuli/gallery/auditorium.jpg', 'School Auditorium', 'Well-equipped auditorium for assemblies, events, and cultural programs', 3, false),
(UUID(), 'uthukuli', 'infrastructure', '/images/uthukuli/gallery/reception.jpg', 'Reception Area', 'Welcoming reception area with modern facilities', 4, false);

-- Classrooms & Labs
INSERT INTO gallery_images (id, branch_id, category, image_url, title, description, display_order, is_featured) VALUES
(UUID(), 'uthukuli', 'facilities', '/images/uthukuli/gallery/smart-classroom.jpg', 'Smart Classroom', 'Technology-enabled classrooms with smart boards and projectors', 1, true),
(UUID(), 'uthukuli', 'facilities', '/images/uthukuli/gallery/science-lab.jpg', 'Science Laboratory', 'Well-equipped science lab with modern apparatus and safety equipment', 2, true),
(UUID(), 'uthukuli', 'facilities', '/images/uthukuli/gallery/computer-lab.jpg', 'Computer Lab', 'State-of-the-art computer lab with latest hardware and software', 3, false),
(UUID(), 'uthukuli', 'facilities', '/images/uthukuli/gallery/library.jpg', 'School Library', 'Extensive library collection with comfortable reading spaces', 4, false),
(UUID(), 'uthukuli', 'facilities', '/images/uthukuli/gallery/activity-room.jpg', 'Activity Room', 'Dedicated space for arts, crafts, and creative activities', 5, false);

-- Events & Activities
INSERT INTO gallery_images (id, branch_id, category, image_url, title, description, display_order, is_featured) VALUES
(UUID(), 'uthukuli', 'events', '/images/uthukuli/gallery/annual-day.jpg', 'Annual Day Celebration', 'Students performing at our grand annual day function', 1, true),
(UUID(), 'uthukuli', 'events', '/images/uthukuli/gallery/independence-day.jpg', 'Independence Day', 'Flag hoisting ceremony and patriotic celebrations', 2, false),
(UUID(), 'uthukuli', 'events', '/images/uthukuli/gallery/republic-day.jpg', 'Republic Day', 'Students participating in Republic Day parade', 3, false),
(UUID(), 'uthukuli', 'events', '/images/uthukuli/gallery/science-fair.jpg', 'Science Fair', 'Students presenting innovative science projects', 4, true),
(UUID(), 'uthukuli', 'events', '/images/uthukuli/gallery/cultural-program.jpg', 'Cultural Program', 'Dance and music performances by talented students', 5, false);

-- Sports Activities
INSERT INTO gallery_images (id, branch_id, category, image_url, title, description, display_order, is_featured) VALUES
(UUID(), 'uthukuli', 'sports', '/images/uthukuli/gallery/cricket-match.jpg', 'Cricket Tournament', 'Inter-house cricket championship match', 1, true),
(UUID(), 'uthukuli', 'sports', '/images/uthukuli/gallery/athletics.jpg', 'Athletics Meet', 'Students competing in track and field events', 2, false),
(UUID(), 'uthukuli', 'sports', '/images/uthukuli/gallery/yoga-session.jpg', 'Yoga Session', 'Daily yoga and meditation classes for wellness', 3, false),
(UUID(), 'uthukuli', 'sports', '/images/uthukuli/gallery/kabaddi.jpg', 'Kabaddi Practice', 'Students training for state-level kabaddi competition', 4, false);

-- Student Life
INSERT INTO gallery_images (id, branch_id, category, image_url, title, description, display_order, is_featured) VALUES
(UUID(), 'uthukuli', 'students', '/images/uthukuli/gallery/morning-assembly.jpg', 'Morning Assembly', 'Students during daily morning assembly and prayer', 1, false),
(UUID(), 'uthukuli', 'students', '/images/uthukuli/gallery/group-study.jpg', 'Group Study', 'Students engaged in collaborative learning', 2, false),
(UUID(), 'uthukuli', 'students', '/images/uthukuli/gallery/art-class.jpg', 'Art Class', 'Students creating beautiful artworks', 3, false),
(UUID(), 'uthukuli', 'students', '/images/uthukuli/gallery/music-class.jpg', 'Music Class', 'Students learning classical and western music', 4, false);

-- ========================================
-- 4. ACHIEVERS / TOPPERS
-- ========================================
INSERT INTO achievers (id, branch_id, student_name, achievement_title, description, category, achievement_date, image_url, grade, display_order, is_featured) VALUES
(UUID(), 'uthukuli', 'Priya Ramesh', 'State Rank 3 - Class 10 Board Exams', 'Secured 98.5% marks in CBSE Board Exams 2024 and achieved State Rank 3. Her dedication and hard work are truly inspiring.', 'academic', '2024-05-15', '/images/uthukuli/achievers/priya-ramesh.jpg', '10', 1, true),

(UUID(), 'uthukuli', 'Arun Kumar', 'Gold Medal - District Chess Championship', 'Won Gold Medal in Under-14 District Chess Championship. He defeated 50+ participants to clinch the top position.', 'sports', '2024-11-20', '/images/uthukuli/achievers/arun-kumar.jpg', '8', 2, true),

(UUID(), 'uthukuli', 'Divya Lakshmi', 'National Level Science Olympiad Winner', 'Secured All India Rank 15 in National Science Olympiad. Her project on "Water Conservation" received special recognition.', 'academic', '2024-09-10', '/images/uthukuli/achievers/divya-lakshmi.jpg', '9', 3, true),

(UUID(), 'uthukuli', 'Karthik Selvam', 'Best Speaker - State Level Debate', 'Awarded Best Speaker at Tamil Nadu State Level Debate Competition. His eloquence and knowledge impressed all judges.', 'cultural', '2024-10-05', '/images/uthukuli/achievers/karthik-selvam.jpg', '11', 4, false),

(UUID(), 'uthukuli', 'Meera Krishnan', '100% in Mathematics - Class 12', 'Achieved perfect 100/100 score in Mathematics in CBSE Class 12 Board Exams. She is passionate about pursuing engineering.', 'academic', '2024-05-15', '/images/uthukuli/achievers/meera-krishnan.jpg', '12', 5, true),

(UUID(), 'uthukuli', 'Rahul Venkat', 'Silver Medal - State Athletics Meet', 'Won Silver Medal in 100m sprint at State Level Athletics Championship. He completed the race in 11.2 seconds.', 'sports', '2024-12-02', '/images/uthukuli/achievers/rahul-venkat.jpg', '10', 6, false),

(UUID(), 'uthukuli', 'Anjali Devi', 'Best Performer - Bharatanatyam Competition', 'Won First Prize in District Level Bharatanatyam Competition. Her graceful performance mesmerized the audience.', 'cultural', '2024-08-15', '/images/uthukuli/achievers/anjali-devi.jpg', '7', 7, false),

(UUID(), 'uthukuli', 'Suresh Babu', 'Young Scientist Award', 'Received Young Scientist Award for innovative project on "Solar Energy Harvesting". The project was displayed at state exhibition.', 'academic', '2024-10-20', '/images/uthukuli/achievers/suresh-babu.jpg', '9', 8, false);

-- ========================================
-- 5. ABOUT SECTION CONTENT
-- ========================================
-- (Assuming about_section table exists with branch-specific content)
INSERT INTO about_section (id, branch_id, section_type, heading, content, image_url, display_order) VALUES
(UUID(), 'uthukuli', 'mission', 'Our Mission', 'To provide holistic education that nurtures academic excellence, character development, and social responsibility. We strive to create well-rounded individuals who are prepared to face the challenges of tomorrow with confidence and compassion.', '/images/uthukuli/about/mission.jpg', 1),

(UUID(), 'uthukuli', 'vision', 'Our Vision', 'To be a leading educational institution in Tamil Nadu, recognized for academic excellence, innovative teaching methods, and value-based education. We envision creating future leaders who contribute positively to society.', '/images/uthukuli/about/vision.jpg', 2),

(UUID(), 'uthukuli', 'values', 'Our Values', 'Integrity, Excellence, Respect, Innovation, and Service to Society form the core values of our institution. We instill these values in our students through daily practice and role modeling.', '/images/uthukuli/about/values.jpg', 3),

(UUID(), 'uthukuli', 'facilities', 'Our Facilities', 'Modern infrastructure with smart classrooms, well-equipped laboratories, extensive library, spacious playground, computer lab with latest technology, and separate activity rooms for arts, music, and dance.', '/images/uthukuli/about/facilities.jpg', 4);

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- Check Carousel Images
SELECT 'Carousel Images for Uthukuli:' as section;
SELECT COUNT(*) as total_images, branch_id FROM carousel_images WHERE branch_id = 'uthukuli' GROUP BY branch_id;

-- Check News Items
SELECT 'News Items for Uthukuli:' as section;
SELECT COUNT(*) as total_news, branch_id FROM news WHERE branch_id = 'uthukuli' GROUP BY branch_id;

-- Check Gallery Images
SELECT 'Gallery Images for Uthukuli:' as section;
SELECT category, COUNT(*) as count FROM gallery_images WHERE branch_id = 'uthukuli' GROUP BY category;

-- Check Achievers
SELECT 'Achievers for Uthukuli:' as section;
SELECT COUNT(*) as total_achievers, branch_id FROM achievers WHERE branch_id = 'uthukuli' GROUP BY branch_id;

-- Summary
SELECT 'SUMMARY - Uthukuli Branch Sample Content:' as info;
SELECT 
    (SELECT COUNT(*) FROM carousel_images WHERE branch_id = 'uthukuli') as carousel_images,
    (SELECT COUNT(*) FROM news WHERE branch_id = 'uthukuli') as news_items,
    (SELECT COUNT(*) FROM gallery_images WHERE branch_id = 'uthukuli') as gallery_images,
    (SELECT COUNT(*) FROM achievers WHERE branch_id = 'uthukuli') as achievers;
