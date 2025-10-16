-- Gallery Management Tables
-- Creates tables for Gallery, Achievers, and Sports sections

USE annai_school;

-- Main gallery items table
CREATE TABLE IF NOT EXISTS gallery_items (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  category ENUM('gallery', 'achievers', 'sports') NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500) NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by VARCHAR(255),
  INDEX idx_category (category),
  INDEX idx_active (is_active),
  INDEX idx_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data for Gallery
INSERT INTO gallery_items (category, title, description, image_url, display_order, is_active) VALUES
('gallery', 'Annual Day Celebration 2024', 'Students performing cultural dance at annual day', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800', 1, 1),
('gallery', 'Science Exhibition', 'Students showcasing their innovative science projects', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800', 2, 1),
('gallery', 'Independence Day 2024', 'Flag hoisting ceremony and celebrations', 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800', 3, 1),
('gallery', 'Classroom Activities', 'Interactive learning sessions in progress', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800', 4, 1);

-- Insert sample data for Achievers
INSERT INTO gallery_items (category, title, description, image_url, display_order, is_active) VALUES
('achievers', 'State Level Chess Champion', 'Congratulations to Raj Kumar for winning Gold Medal', 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800', 1, 1),
('achievers', 'National Science Olympiad Winner', 'Priya Sharma secured 1st rank in National Science Olympiad', 'https://images.unsplash.com/photo-1567168544813-cc03465b4fa8?w=800', 2, 1),
('achievers', 'Best Student Award 2024', 'Arjun Patel awarded for overall excellence', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800', 3, 1);

-- Insert sample data for Sports
INSERT INTO gallery_items (category, title, description, image_url, display_order, is_active) VALUES
('sports', 'Inter-School Cricket Tournament', 'Our team won the district level cricket championship', 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800', 1, 1),
('sports', 'Annual Sports Day', 'Students participating in various track and field events', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800', 2, 1),
('sports', 'Basketball Championship', 'Girls team secured runner-up position in state championship', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800', 3, 1),
('sports', 'Swimming Competition', 'Students won multiple medals in inter-school swimming meet', 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=800', 4, 1);

SELECT 'Gallery tables created successfully!' as message;
