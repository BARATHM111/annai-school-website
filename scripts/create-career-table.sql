-- Career Applications Table
-- Stores teacher job applications with resume and status tracking

USE annai_school;

-- Create career_applications table
CREATE TABLE IF NOT EXISTS career_applications (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  
  -- Personal Information
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  date_of_birth DATE,
  gender ENUM('Male', 'Female', 'Other'),
  address TEXT,
  
  -- Branch Selection
  branch ENUM('Tiruppur', 'Uthukuli') NOT NULL,
  
  -- Professional Information
  position_applied VARCHAR(255) NOT NULL,
  qualification VARCHAR(255),
  experience_years INT DEFAULT 0,
  subject_specialization VARCHAR(255),
  previous_school VARCHAR(255),
  
  -- Resume/Documents
  resume_url VARCHAR(500) NOT NULL,
  resume_filename VARCHAR(255),
  cover_letter TEXT,
  
  -- Additional Information
  expected_salary VARCHAR(100),
  available_from DATE,
  languages_known VARCHAR(255),
  certifications TEXT,
  
  -- Application Status
  status ENUM('pending', 'under_review', 'shortlisted', 'rejected', 'hired') DEFAULT 'pending',
  admin_notes TEXT,
  reviewed_by VARCHAR(255),
  reviewed_at TIMESTAMP NULL,
  
  -- Timestamps
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes
  INDEX idx_email (email),
  INDEX idx_branch (branch),
  INDEX idx_status (status),
  INDEX idx_position (position_applied),
  INDEX idx_applied_at (applied_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data
INSERT INTO career_applications (
  full_name, email, phone, date_of_birth, gender, address,
  branch, position_applied, qualification, experience_years, subject_specialization,
  resume_url, resume_filename, cover_letter, status
) VALUES
(
  'Priya Sharma', 
  'priya.sharma@example.com', 
  '+91 9876543210', 
  '1990-05-15', 
  'Female', 
  '123 Main Street, Coimbatore',
  'Tiruppur',
  'Mathematics Teacher',
  'M.Sc Mathematics, B.Ed',
  5,
  'Mathematics, Statistics',
  '/uploads/resumes/sample_resume_1.pdf',
  'priya_sharma_resume.pdf',
  'I am passionate about teaching mathematics and have 5 years of experience...',
  'under_review'
),
(
  'Rajesh Kumar', 
  'rajesh.kumar@example.com', 
  '+91 9876543211', 
  '1988-08-20', 
  'Male', 
  '456 Park Road, Tiruppur',
  'Uthukuli',
  'Science Teacher',
  'M.Sc Physics, B.Ed',
  8,
  'Physics, Chemistry',
  '/uploads/resumes/sample_resume_2.pdf',
  'rajesh_kumar_resume.pdf',
  'Experienced science teacher with a track record of excellent results...',
  'shortlisted'
),
(
  'Ananya Reddy', 
  'ananya.reddy@example.com', 
  '+91 9876543212', 
  '1992-03-10', 
  'Female', 
  '789 School Lane, Uthukuli',
  'Tiruppur',
  'English Teacher',
  'MA English Literature, B.Ed',
  3,
  'English Language, Literature',
  '/uploads/resumes/sample_resume_3.pdf',
  'ananya_reddy_resume.pdf',
  'Creative and enthusiastic English teacher dedicated to student success...',
  'pending'
);

-- Create a view for admin dashboard statistics
CREATE OR REPLACE VIEW career_stats AS
SELECT 
  COUNT(*) as total_applications,
  SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_count,
  SUM(CASE WHEN status = 'under_review' THEN 1 ELSE 0 END) as under_review_count,
  SUM(CASE WHEN status = 'shortlisted' THEN 1 ELSE 0 END) as shortlisted_count,
  SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected_count,
  SUM(CASE WHEN status = 'hired' THEN 1 ELSE 0 END) as hired_count,
  SUM(CASE WHEN branch = 'Tiruppur' THEN 1 ELSE 0 END) as tiruppur_count,
  SUM(CASE WHEN branch = 'Uthukuli' THEN 1 ELSE 0 END) as uthukuli_count
FROM career_applications;

-- Verify table creation
SELECT 'Career applications table created!' as message;
SELECT * FROM career_stats;
SELECT COUNT(*) as sample_applications FROM career_applications;
