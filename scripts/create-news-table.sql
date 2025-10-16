-- Create news table for storing school news and events
CREATE TABLE IF NOT EXISTS news (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50) DEFAULT 'news',
  imageUrl VARCHAR(500),
  published BOOLEAN DEFAULT true,
  date DATETIME NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  INDEX idx_published (published),
  INDEX idx_category (category),
  INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample news
INSERT INTO news (id, title, description, content, category, published, date, createdAt, updatedAt) VALUES
('NEWS1760068800001', 'School Reopening Announcement', 'Annai Matriculation School will reopen on June 1st, 2025', 'Dear Parents and Students,\n\nWe are pleased to announce that Annai Matriculation School will reopen for the new academic year on June 1st, 2025. We look forward to welcoming all our students back to school.\n\nPlease ensure that all admission formalities are completed before the reopening date.\n\nThank you for your continued support.', 'announcement', true, NOW(), NOW(), NOW()),
('NEWS1760068800002', 'Annual Sports Day', 'Join us for our Annual Sports Day on March 15th', 'We are excited to announce our Annual Sports Day will be held on March 15th, 2025.\n\nVarious sporting events and competitions will take place throughout the day. Parents are cordially invited to attend and cheer for their children.\n\nVenue: School Sports Ground\nTime: 9:00 AM - 4:00 PM', 'event', true, NOW(), NOW(), NOW()),
('NEWS1760068800003', 'Academic Excellence Awards', 'Congratulations to our top performers', 'We are proud to announce that our students have achieved outstanding results in the recent examinations.\n\n10 students scored above 95% in the board exams, bringing great honor to our institution.\n\nWe congratulate all the students for their hard work and dedication.', 'achievement', true, NOW(), NOW(), NOW());
