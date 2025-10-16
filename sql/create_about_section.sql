-- Create about_sections table with branch isolation
CREATE TABLE IF NOT EXISTS about_sections (
    id VARCHAR(36) PRIMARY KEY,
    branch_id VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    main_content TEXT,
    vision TEXT,
    mission TEXT,
    show_vision BOOLEAN DEFAULT TRUE,
    show_mission BOOLEAN DEFAULT TRUE,
    show_timeline BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
    UNIQUE KEY unique_branch_about (branch_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create about_facilities table
CREATE TABLE IF NOT EXISTS about_facilities (
    id VARCHAR(36) PRIMARY KEY,
    branch_id VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image VARCHAR(500),
    display_order INT DEFAULT 0,
    visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create about_timeline table
CREATE TABLE IF NOT EXISTS about_timeline (
    id VARCHAR(36) PRIMARY KEY,
    branch_id VARCHAR(50) NOT NULL,
    year VARCHAR(10) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0,
    visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default data for Tirupur branch
INSERT INTO about_sections (id, branch_id, title, subtitle, main_content, vision, mission, show_vision, show_mission, show_timeline)
VALUES (
    UUID(),
    'tirupur',
    'About Our School - Tirupur Campus',
    'Nurturing minds with motherly care since establishment',
    'At Annai Matriculation School, we believe our school is "THE FOUNDATION OF YOUR CHILD\'S FUTURE". Our motto is "LOVE - SERVICE - PURITY".\n\nThe school is being run by professionally qualified and well-experienced promoters having more than twenty years of experience in the field of Child Education, School Education, and training who are committed to leaving a mark in the educational field in twin cities.\n\nInitially, we started the School as Primary School. With our continuous effort and dedication towards education, which was well acknowledged by the parents, today we are running Classes until 10th Standard.\n\nIn 10th Standard, we have got 100% Results for the past 6 years. Also, we have got Centum in Social Science for the Academic year 2012. It is the sincere effort from the Management and staff together that we make this a success.',
    'To provide quality education with motherly care, nurturing every child to reach their full potential and become responsible citizens of tomorrow.',
    'To create a learning environment that fosters academic excellence, character development, and holistic growth through innovative teaching methods and personalized attention.',
    TRUE,
    TRUE,
    TRUE
);

-- Insert default data for Uthukuli branch
INSERT INTO about_sections (id, branch_id, title, subtitle, main_content, vision, mission, show_vision, show_mission, show_timeline)
VALUES (
    UUID(),
    'uthukuli',
    'About Our School - Uthukuli Campus',
    'Nurturing minds with motherly care since establishment',
    'At Annai Matriculation School, we believe our school is "THE FOUNDATION OF YOUR CHILD\'S FUTURE". Our motto is "LOVE - SERVICE - PURITY".\n\nThe school is being run by professionally qualified and well-experienced promoters having more than twenty years of experience in the field of Child Education, School Education, and training who are committed to leaving a mark in the educational field in twin cities.\n\nInitially, we started the School as Primary School. With our continuous effort and dedication towards education, which was well acknowledged by the parents, today we are running Classes until 10th Standard.\n\nIn 10th Standard, we have got 100% Results for the past 6 years. Also, we have got Centum in Social Science for the Academic year 2012. It is the sincere effort from the Management and staff together that we make this a success.',
    'To provide quality education with motherly care, nurturing every child to reach their full potential and become responsible citizens of tomorrow.',
    'To create a learning environment that fosters academic excellence, character development, and holistic growth through innovative teaching methods and personalized attention.',
    TRUE,
    TRUE,
    TRUE
);

-- Default facilities for Tirupur
INSERT INTO about_facilities (id, branch_id, title, description, image, display_order, visible) VALUES
(UUID(), 'tirupur', 'Computer Lab', 'Modern computer lab equipped with latest technology to help students develop digital literacy and coding skills.', '/images/about/computer-lab.jpg', 1, TRUE),
(UUID(), 'tirupur', 'Library', 'Well-stocked library with a wide collection of books, magazines, and digital resources to foster a love for reading.', '/images/about/library.jpg', 2, TRUE),
(UUID(), 'tirupur', 'Chemistry Lab', 'Fully equipped science laboratory where students conduct experiments and explore scientific concepts hands-on.', '/images/about/chemistry-lab.jpg', 3, TRUE),
(UUID(), 'tirupur', 'Play Area', 'Safe and spacious playground for physical activities, sports, and recreation to ensure overall development.', '/images/about/play-area.jpg', 4, TRUE);

-- Default facilities for Uthukuli
INSERT INTO about_facilities (id, branch_id, title, description, image, display_order, visible) VALUES
(UUID(), 'uthukuli', 'Computer Lab', 'Modern computer lab equipped with latest technology to help students develop digital literacy and coding skills.', '/images/about/computer-lab.jpg', 1, TRUE),
(UUID(), 'uthukuli', 'Library', 'Well-stocked library with a wide collection of books, magazines, and digital resources to foster a love for reading.', '/images/about/library.jpg', 2, TRUE),
(UUID(), 'uthukuli', 'Chemistry Lab', 'Fully equipped science laboratory where students conduct experiments and explore scientific concepts hands-on.', '/images/about/chemistry-lab.jpg', 3, TRUE),
(UUID(), 'uthukuli', 'Play Area', 'Safe and spacious playground for physical activities, sports, and recreation to ensure overall development.', '/images/about/play-area.jpg', 4, TRUE);

-- Default timeline for Tirupur
INSERT INTO about_timeline (id, branch_id, year, title, description, display_order, visible) VALUES
(UUID(), 'tirupur', '2000', 'Foundation', 'Annai Matriculation School was established with a vision to provide quality education with motherly care.', 1, TRUE),
(UUID(), 'tirupur', '2005', 'Expansion to Primary', 'Expanded from Pre-KG to Primary classes, welcoming more students into our loving environment.', 2, TRUE),
(UUID(), 'tirupur', '2010', 'Secondary Education', 'Extended our services to include secondary education up to 10th Standard.', 3, TRUE),
(UUID(), 'tirupur', '2012', 'First Centum Achievement', 'Achieved Centum in Social Science, marking our commitment to academic excellence.', 4, TRUE),
(UUID(), 'tirupur', '2018', '100% Success Rate', 'Achieved 100% pass rate in 10th Standard board exams, a record maintained for 6 consecutive years.', 5, TRUE),
(UUID(), 'tirupur', '2025', 'Today', 'Continuing our legacy with 1200+ students and 25+ years of educational excellence.', 6, TRUE);

-- Default timeline for Uthukuli
INSERT INTO about_timeline (id, branch_id, year, title, description, display_order, visible) VALUES
(UUID(), 'uthukuli', '2000', 'Foundation', 'Annai Matriculation School was established with a vision to provide quality education with motherly care.', 1, TRUE),
(UUID(), 'uthukuli', '2005', 'Expansion to Primary', 'Expanded from Pre-KG to Primary classes, welcoming more students into our loving environment.', 2, TRUE),
(UUID(), 'uthukuli', '2010', 'Secondary Education', 'Extended our services to include secondary education up to 10th Standard.', 3, TRUE),
(UUID(), 'uthukuli', '2012', 'First Centum Achievement', 'Achieved Centum in Social Science, marking our commitment to academic excellence.', 4, TRUE),
(UUID(), 'uthukuli', '2018', '100% Success Rate', 'Achieved 100% pass rate in 10th Standard board exams, a record maintained for 6 consecutive years.', 5, TRUE),
(UUID(), 'uthukuli', '2025', 'Today', 'Continuing our legacy with 1200+ students and 25+ years of educational excellence.', 6, TRUE);
