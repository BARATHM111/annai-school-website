-- Separate Gallery Tables
-- Creates individual tables for Gallery, Achievers, and Sports

USE annai_school;

-- Drop old combined table if exists
DROP TABLE IF EXISTS gallery_items;

-- 1. Gallery Table (School Events, Activities, Celebrations)
CREATE TABLE IF NOT EXISTS gallery (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500) NOT NULL,
  image_path VARCHAR(500),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by VARCHAR(255),
  INDEX idx_active (is_active),
  INDEX idx_order (display_order),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Achievers Table (Student Achievements, Awards, Recognitions)
CREATE TABLE IF NOT EXISTS achievers (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  student_name VARCHAR(255),
  achievement_date DATE,
  image_url VARCHAR(500) NOT NULL,
  image_path VARCHAR(500),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by VARCHAR(255),
  INDEX idx_active (is_active),
  INDEX idx_order (display_order),
  INDEX idx_date (achievement_date),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Sports Table (Sports Events, Competitions, Athletics)
CREATE TABLE IF NOT EXISTS sports (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date DATE,
  location VARCHAR(255),
  image_url VARCHAR(500) NOT NULL,
  image_path VARCHAR(500),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by VARCHAR(255),
  INDEX idx_active (is_active),
  INDEX idx_order (display_order),
  INDEX idx_date (event_date),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data for Gallery
INSERT INTO gallery (title, description, image_url, display_order, is_active) VALUES
('Annual Day Celebration 2024', 'Students performing cultural dance at annual day', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800', 1, 1),
('Science Exhibition', 'Students showcasing their innovative science projects', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800', 2, 1),
('Independence Day 2024', 'Flag hoisting ceremony and celebrations', 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800', 3, 1),
('Classroom Activities', 'Interactive learning sessions in progress', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800', 4, 1),
('Cultural Festival', 'Students celebrating cultural diversity', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', 5, 1);

-- Insert sample data for Achievers
INSERT INTO achievers (title, description, student_name, achievement_date, image_url, display_order, is_active) VALUES
('State Level Chess Champion', 'Gold Medal winner at State Chess Championship', 'Raj Kumar', '2024-01-15', 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800', 1, 1),
('National Science Olympiad Winner', 'Secured 1st rank in National Science Olympiad', 'Priya Sharma', '2024-02-20', 'https://images.unsplash.com/photo-1567168544813-cc03465b4fa8?w=800', 2, 1),
('Best Student Award 2024', 'Overall excellence in academics and sports', 'Arjun Patel', '2024-03-10', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800', 3, 1),
('Art Competition Winner', 'First prize in State Level Art Competition', 'Ananya Singh', '2024-04-05', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800', 4, 1);

-- Insert sample data for Sports
INSERT INTO sports (title, description, event_date, location, image_url, display_order, is_active) VALUES
('Inter-School Cricket Tournament', 'Won district level cricket championship', '2024-01-25', 'City Sports Complex', 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800', 1, 1),
('Annual Sports Day', 'Students participating in track and field events', '2024-02-15', 'School Ground', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800', 2, 1),
('Basketball Championship', 'Girls team secured runner-up position', '2024-03-20', 'State Stadium', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800', 3, 1),
('Swimming Competition', 'Multiple medals in inter-school swimming meet', '2024-04-10', 'Aquatic Center', 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=800', 4, 1),
('Football Tournament', 'Boys team won regional football championship', '2024-05-05', 'Regional Stadium', 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800', 5, 1);

-- Verify tables
SELECT 'Gallery table created with' as info, COUNT(*) as total_items FROM gallery;
SELECT 'Achievers table created with' as info, COUNT(*) as total_items FROM achievers;
SELECT 'Sports table created with' as info, COUNT(*) as total_items FROM sports;

SELECT '✅ All tables created successfully!' as message;
