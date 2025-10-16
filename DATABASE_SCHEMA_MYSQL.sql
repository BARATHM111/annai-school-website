-- =====================================================
-- ANNAI SCHOOL MANAGEMENT SYSTEM - MYSQL SCHEMA
-- =====================================================
-- Pure MySQL schema based on frontend code analysis
-- No Prisma - Direct MySQL implementation
-- =====================================================

-- Create database
CREATE DATABASE IF NOT EXISTS annai_school_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE annai_school_db;

-- =====================================================
-- CORE USER MANAGEMENT TABLES
-- =====================================================

-- Users table for authentication
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'teacher', 'student', 'parent') DEFAULT 'student',
    status ENUM('active', 'inactive', 'suspended', 'pending') DEFAULT 'active',
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires DATETIME,
    last_login DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_users_email (email),
    INDEX idx_users_role (role),
    INDEX idx_users_status (status)
);

-- User profiles for detailed information
CREATE TABLE user_profiles (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender ENUM('Male', 'Female', 'Other'),
    blood_group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
    nationality VARCHAR(100),
    religion VARCHAR(100),
    category ENUM('General', 'OBC', 'SC', 'ST', 'Other'),
    profile_photo VARCHAR(500),
    phone VARCHAR(20),
    alternate_phone VARCHAR(20),
    current_address TEXT,
    permanent_address TEXT,
    emergency_contact_name VARCHAR(100),
    emergency_contact_relationship VARCHAR(50),
    emergency_contact_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_profile (user_id),
    INDEX idx_user_profiles_user_id (user_id)
);

-- =====================================================
-- ADMISSION MANAGEMENT TABLES
-- =====================================================

-- Form configuration for dynamic admission forms
CREATE TABLE form_configurations (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    field_name VARCHAR(100) NOT NULL,
    field_label VARCHAR(200) NOT NULL,
    field_type ENUM('text', 'email', 'phone', 'date', 'select', 'textarea', 'file', 'checkbox', 'radio') NOT NULL,
    is_required BOOLEAN DEFAULT FALSE,
    is_visible BOOLEAN DEFAULT TRUE,
    placeholder VARCHAR(200),
    help_text TEXT,
    options JSON,
    validation_rules JSON,
    display_order INT NOT NULL,
    section ENUM('personal', 'contact', 'parent', 'academic', 'documents', 'additional') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_field_name (field_name)
);

-- Applications table for admission applications
CREATE TABLE applications (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    application_id VARCHAR(50) UNIQUE NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    status ENUM('draft', 'submitted', 'under_review', 'approved', 'rejected', 'waitlisted') DEFAULT 'submitted',
    applying_for_grade VARCHAR(50) NOT NULL,
    academic_year INT NOT NULL,
    personal_info JSON NOT NULL,
    contact_info JSON NOT NULL,
    parent_info JSON NOT NULL,
    academic_info JSON NOT NULL,
    additional_info JSON,
    documents JSON,
    admin_notes TEXT,
    reviewer_id VARCHAR(36),
    reviewed_at DATETIME,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_applications_user_id (user_id),
    INDEX idx_applications_status (status),
    INDEX idx_applications_academic_year (academic_year),
    INDEX idx_applications_application_id (application_id)
);

-- Application status history for tracking changes
CREATE TABLE application_status_history (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    application_id VARCHAR(36) NOT NULL,
    status VARCHAR(50) NOT NULL,
    comment TEXT,
    changed_by VARCHAR(36) NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE RESTRICT
);

-- =====================================================
-- STUDENT MANAGEMENT TABLES
-- =====================================================

-- Students table for enrolled students
CREATE TABLE students (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    student_id VARCHAR(50) UNIQUE NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    application_id VARCHAR(36),
    current_grade VARCHAR(50) NOT NULL,
    section VARCHAR(10),
    roll_number VARCHAR(20),
    academic_year INT NOT NULL,
    enrollment_date DATE NOT NULL,
    status ENUM('active', 'inactive', 'graduated', 'transferred', 'dropped') DEFAULT 'active',
    status_reason TEXT,
    status_updated_at DATETIME,
    father_name VARCHAR(100),
    father_occupation VARCHAR(100),
    father_mobile VARCHAR(20),
    father_email VARCHAR(255),
    mother_name VARCHAR(100),
    mother_occupation VARCHAR(100),
    mother_mobile VARCHAR(20),
    mother_email VARCHAR(255),
    guardian_name VARCHAR(100),
    guardian_contact VARCHAR(20),
    previous_school VARCHAR(200),
    previous_class VARCHAR(50),
    previous_board VARCHAR(100),
    previous_percentage VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_students_user_id (user_id),
    INDEX idx_students_student_id (student_id),
    INDEX idx_students_status (status),
    INDEX idx_students_academic_year (academic_year),
    INDEX idx_students_current_grade (current_grade)
);

-- Document verification for students
CREATE TABLE student_documents (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    student_id VARCHAR(36) NOT NULL,
    document_type ENUM('photo', 'birth_certificate', 'marksheet', 'transfer_certificate', 'aadhar_card', 'other') NOT NULL,
    document_name VARCHAR(200) NOT NULL,
    document_url VARCHAR(500) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by VARCHAR(36),
    verified_at DATETIME,
    verification_notes TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_student_documents_student_id (student_id),
    INDEX idx_student_documents_type (document_type)
);

-- =====================================================
-- ACADEMIC MANAGEMENT TABLES
-- =====================================================

-- Academic years
CREATE TABLE academic_years (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    year INT UNIQUE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    status ENUM('active', 'completed', 'upcoming') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Grades/Classes
CREATE TABLE grades (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    grade_name VARCHAR(50) NOT NULL,
    grade_level INT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sections within grades
CREATE TABLE sections (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    grade_id VARCHAR(36) NOT NULL,
    section_name VARCHAR(10) NOT NULL,
    capacity INT DEFAULT 30,
    class_teacher_id VARCHAR(36),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (grade_id) REFERENCES grades(id) ON DELETE CASCADE,
    FOREIGN KEY (class_teacher_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Student enrollments
CREATE TABLE enrollments (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    student_id VARCHAR(36) NOT NULL,
    academic_year_id VARCHAR(36) NOT NULL,
    grade_id VARCHAR(36) NOT NULL,
    section_id VARCHAR(36),
    enrollment_date DATE NOT NULL,
    status ENUM('active', 'transferred', 'dropped', 'completed') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE RESTRICT,
    FOREIGN KEY (grade_id) REFERENCES grades(id) ON DELETE RESTRICT,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE SET NULL,
    INDEX idx_enrollments_student_id (student_id),
    INDEX idx_enrollments_academic_year_id (academic_year_id)
);

-- =====================================================
-- CONTENT MANAGEMENT TABLES
-- =====================================================

-- News and announcements
CREATE TABLE news (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    content TEXT,
    image_url VARCHAR(500),
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    publish_date DATE,
    author_id VARCHAR(36) NOT NULL,
    views INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_news_status (status),
    INDEX idx_news_publish_date (publish_date)
);

-- Carousel images for homepage
CREATE TABLE carousel_images (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(200),
    description TEXT,
    image_url VARCHAR(500) NOT NULL,
    link_url VARCHAR(500),
    display_order INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_carousel_images_active (is_active)
);

-- About page content management
CREATE TABLE about_content (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    section VARCHAR(100) NOT NULL,
    title VARCHAR(200),
    content TEXT,
    image_url VARCHAR(500),
    display_order INT,
    is_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- FILE MANAGEMENT TABLES
-- =====================================================

-- File uploads tracking
CREATE TABLE file_uploads (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    original_name VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    upload_type ENUM('profile', 'document', 'news', 'carousel', 'about', 'other') NOT NULL,
    uploaded_by VARCHAR(36) NOT NULL,
    related_entity_type VARCHAR(100),
    related_entity_id VARCHAR(36),
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_file_uploads_uploaded_by (uploaded_by),
    INDEX idx_file_uploads_type (upload_type),
    INDEX idx_file_uploads_entity (related_entity_type, related_entity_id)
);

-- =====================================================
-- SYSTEM CONFIGURATION TABLES
-- =====================================================

-- System settings
CREATE TABLE system_settings (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Audit logs for tracking important changes
CREATE TABLE audit_logs (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(36),
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================================
-- INITIAL DATA SEEDING
-- =====================================================

-- Insert default academic year
INSERT INTO academic_years (year, start_date, end_date, is_current, status) 
VALUES (2024, '2024-04-01', '2025-03-31', TRUE, 'active');

-- Insert default grades
INSERT INTO grades (grade_name, grade_level, description) VALUES
('Nursery', 0, 'Pre-primary education'),
('LKG', 1, 'Lower Kindergarten'),
('UKG', 2, 'Upper Kindergarten'),
('Grade 1', 3, 'Primary Grade 1'),
('Grade 2', 4, 'Primary Grade 2'),
('Grade 3', 5, 'Primary Grade 3'),
('Grade 4', 6, 'Primary Grade 4'),
('Grade 5', 7, 'Primary Grade 5'),
('Grade 6', 8, 'Middle School Grade 6'),
('Grade 7', 9, 'Middle School Grade 7'),
('Grade 8', 10, 'Middle School Grade 8'),
('Grade 9', 11, 'High School Grade 9'),
('Grade 10', 12, 'High School Grade 10'),
('Grade 11', 13, 'Senior Secondary Grade 11'),
('Grade 12', 14, 'Senior Secondary Grade 12');

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password_hash, role, status, email_verified) 
VALUES ('admin@annaischool.edu', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hL.ckstG.', 'admin', 'active', TRUE);

-- Insert admin profile
INSERT INTO user_profiles (user_id, first_name, last_name) 
VALUES ((SELECT id FROM users WHERE email = 'admin@annaischool.edu'), 'School', 'Administrator');

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('school_name', 'Annai School', 'string', 'Name of the school', TRUE),
('school_address', 'School Address Here', 'string', 'School address', TRUE),
('school_phone', '+91-XXXXXXXXXX', 'string', 'School contact number', TRUE),
('school_email', 'info@annaischool.edu', 'string', 'School email address', TRUE),
('admission_open', 'true', 'boolean', 'Whether admissions are currently open', TRUE),
('current_academic_year', '2024', 'number', 'Current academic year', TRUE),
('max_file_size', '5242880', 'number', 'Maximum file upload size in bytes', FALSE),
('allowed_file_types', '["image/jpeg","image/png","image/gif","application/pdf"]', 'json', 'Allowed file types for upload', FALSE);

-- =====================================================
-- STORED PROCEDURES FOR BUSINESS LOGIC
-- =====================================================

DELIMITER //

-- Generate application ID
CREATE FUNCTION generate_application_id(year INT) 
RETURNS VARCHAR(50)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE next_number INT DEFAULT 1;
    DECLARE app_id VARCHAR(50);
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(application_id, 8) AS UNSIGNED)), 0) + 1
    INTO next_number
    FROM applications 
    WHERE application_id LIKE CONCAT('APP', year, '%');
    
    SET app_id = CONCAT('APP', year, LPAD(next_number, 4, '0'));
    RETURN app_id;
END//

-- Generate student ID
CREATE FUNCTION generate_student_id(year INT) 
RETURNS VARCHAR(50)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE next_number INT DEFAULT 1;
    DECLARE student_id VARCHAR(50);
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(student_id, 8) AS UNSIGNED)), 0) + 1
    INTO next_number
    FROM students 
    WHERE student_id LIKE CONCAT('STU', year, '%');
    
    SET student_id = CONCAT('STU', year, LPAD(next_number, 4, '0'));
    RETURN student_id;
END//

DELIMITER ;

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- Complete student information view
CREATE VIEW student_complete_info AS
SELECT 
    s.id,
    s.student_id,
    s.current_grade,
    s.section,
    s.roll_number,
    s.academic_year,
    s.status,
    u.email,
    up.first_name,
    up.middle_name,
    up.last_name,
    up.date_of_birth,
    up.gender,
    up.phone,
    up.current_address,
    s.father_name,
    s.father_mobile,
    s.mother_name,
    s.mother_mobile,
    s.enrollment_date,
    s.created_at
FROM students s
JOIN users u ON s.user_id = u.id
JOIN user_profiles up ON u.id = up.user_id;

-- Application summary view
CREATE VIEW application_summary AS
SELECT 
    a.id,
    a.application_id,
    a.status,
    a.applying_for_grade,
    a.academic_year,
    u.email,
    JSON_UNQUOTE(JSON_EXTRACT(a.personal_info, '$.firstName')) as first_name,
    JSON_UNQUOTE(JSON_EXTRACT(a.personal_info, '$.lastName')) as last_name,
    JSON_UNQUOTE(JSON_EXTRACT(a.contact_info, '$.mobile')) as mobile,
    a.submitted_at,
    a.reviewed_at
FROM applications a
JOIN users u ON a.user_id = u.id;

-- =====================================================
-- END OF SCHEMA
-- =====================================================
