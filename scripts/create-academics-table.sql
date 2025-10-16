-- Create academics table for storing academic programs
CREATE TABLE IF NOT EXISTS academics (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  grades VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  features TEXT,
  displayOrder INT DEFAULT 0,
  published BOOLEAN DEFAULT true,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX idx_published (published),
  INDEX idx_order (displayOrder)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default academic programs
INSERT INTO academics (id, title, grades, description, features, displayOrder, published, createdAt, updatedAt) VALUES
('ACAD1760072800001', 'Primary Education', 'Grades 1-5', 'Foundational learning with focus on creativity, critical thinking, and character development. Our primary education program nurtures young minds through interactive learning and hands-on activities.', 'Interactive Learning,Character Development,Creative Activities,Basic Literacy & Numeracy', 1, true, NOW(), NOW()),
('ACAD1760072800002', 'Middle School', 'Grades 6-8', 'Comprehensive curriculum with emphasis on skill development, subject mastery, and personality growth. Students are prepared for higher education with strong academic foundation.', 'Subject Specialization,Skill Development,Laboratory Work,Extra-curricular Activities', 2, true, NOW(), NOW()),
('ACAD1760072800003', 'High School', 'Grades 9-12', 'Specialized streams and career guidance to prepare students for board examinations and future careers. Focus on academic excellence and competitive exam preparation.', 'Stream Selection,Career Counseling,Board Exam Preparation,College Guidance', 3, true, NOW(), NOW());
