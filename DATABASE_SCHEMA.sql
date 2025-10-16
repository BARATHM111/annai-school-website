-- =====================================================
-- ANNAI SCHOOL MANAGEMENT SYSTEM - DATABASE SCHEMA
-- =====================================================
-- Generated based on frontend code analysis
-- Supports: User Management, Admissions, Student Records, 
-- Content Management, File Uploads, and Administration
-- =====================================================

-- Enable UUID extension for PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CORE USER MANAGEMENT TABLES
-- =====================================================

-- Users table for authentication and basic user info
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'teacher', 'student', 'parent')),
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'pending')),
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User profiles for detailed information
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(20) CHECK (gender IN ('Male', 'Female', 'Other')),
    blood_group VARCHAR(10) CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    nationality VARCHAR(100),
    religion VARCHAR(100),
    category VARCHAR(50) CHECK (category IN ('General', 'OBC', 'SC', 'ST', 'Other')),
    profile_photo VARCHAR(500),
    phone VARCHAR(20),
    alternate_phone VARCHAR(20),
    current_address TEXT,
    permanent_address TEXT,
    emergency_contact_name VARCHAR(100),
    emergency_contact_relationship VARCHAR(50),
    emergency_contact_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ADMISSION MANAGEMENT TABLES
-- =====================================================

-- Form configuration for dynamic admission forms
CREATE TABLE form_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    field_name VARCHAR(100) NOT NULL,
    field_label VARCHAR(200) NOT NULL,
    field_type VARCHAR(50) NOT NULL CHECK (field_type IN ('text', 'email', 'phone', 'date', 'select', 'textarea', 'file', 'checkbox', 'radio')),
    is_required BOOLEAN DEFAULT FALSE,
    is_visible BOOLEAN DEFAULT TRUE,
    placeholder VARCHAR(200),
    help_text TEXT,
    options JSONB, -- For select, radio, checkbox fields
    validation_rules JSONB, -- Custom validation rules
    display_order INTEGER NOT NULL,
    section VARCHAR(50) NOT NULL CHECK (section IN ('personal', 'contact', 'parent', 'academic', 'documents', 'additional')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Applications table for admission applications
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id VARCHAR(50) UNIQUE NOT NULL, -- Human readable ID like APP2024001
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'waitlisted')),
    applying_for_grade VARCHAR(50) NOT NULL,
    academic_year INTEGER NOT NULL,
    
    -- Personal Information (from form)
    personal_info JSONB NOT NULL,
    
    -- Contact Information
    contact_info JSONB NOT NULL,
    
    -- Parent/Guardian Information
    parent_info JSONB NOT NULL,
    
    -- Academic Information
    academic_info JSONB NOT NULL,
    
    -- Additional Information
    additional_info JSONB,
    
    -- Document URLs
    documents JSONB,
    
    -- Admin notes and comments
    admin_notes TEXT,
    reviewer_id UUID REFERENCES users(id),
    reviewed_at TIMESTAMP,
    
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Application status history for tracking changes
CREATE TABLE application_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    comment TEXT,
    changed_by UUID NOT NULL REFERENCES users(id),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- STUDENT MANAGEMENT TABLES
-- =====================================================

-- Students table for enrolled students
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR(50) UNIQUE NOT NULL, -- Human readable ID like STU2024001
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    application_id UUID REFERENCES applications(id),
    
    -- Academic Information
    current_grade VARCHAR(50) NOT NULL,
    section VARCHAR(10),
    roll_number VARCHAR(20),
    academic_year INTEGER NOT NULL,
    enrollment_date DATE NOT NULL,
    
    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated', 'transferred', 'dropped')),
    status_reason TEXT,
    status_updated_at TIMESTAMP,
    
    -- Parent Information
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
    
    -- Previous School Information
    previous_school VARCHAR(200),
    previous_class VARCHAR(50),
    previous_board VARCHAR(100),
    previous_percentage VARCHAR(10),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- Document verification for students
CREATE TABLE student_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL CHECK (document_type IN ('photo', 'birth_certificate', 'marksheet', 'transfer_certificate', 'aadhar_card', 'other')),
    document_name VARCHAR(200) NOT NULL,
    document_url VARCHAR(500) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP,
    verification_notes TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ACADEMIC MANAGEMENT TABLES
-- =====================================================

-- Academic years
CREATE TABLE academic_years (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    year INTEGER UNIQUE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'upcoming')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Grades/Classes
CREATE TABLE grades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grade_name VARCHAR(50) NOT NULL,
    grade_level INTEGER NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sections within grades
CREATE TABLE sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grade_id UUID NOT NULL REFERENCES grades(id) ON DELETE CASCADE,
    section_name VARCHAR(10) NOT NULL,
    capacity INTEGER DEFAULT 30,
    class_teacher_id UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student enrollments (for tracking year-wise enrollments)
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id),
    grade_id UUID NOT NULL REFERENCES grades(id),
    section_id UUID REFERENCES sections(id),
    enrollment_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'transferred', 'dropped', 'completed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CONTENT MANAGEMENT TABLES
-- =====================================================

-- News and announcements
CREATE TABLE news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    content TEXT,
    image_url VARCHAR(500),
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    publish_date DATE,
    author_id UUID NOT NULL REFERENCES users(id),
    views INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Carousel images for homepage
CREATE TABLE carousel_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200),
    description TEXT,
    image_url VARCHAR(500) NOT NULL,
    link_url VARCHAR(500),
    display_order INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- About page content management
CREATE TABLE about_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section VARCHAR(100) NOT NULL,
    title VARCHAR(200),
    content TEXT,
    image_url VARCHAR(500),
    display_order INTEGER,
    is_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- FILE MANAGEMENT TABLES
-- =====================================================

-- File uploads tracking
CREATE TABLE file_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    original_name VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    upload_type VARCHAR(100) NOT NULL CHECK (upload_type IN ('profile', 'document', 'news', 'carousel', 'about', 'other')),
    uploaded_by UUID NOT NULL REFERENCES users(id),
    related_entity_type VARCHAR(100), -- 'student', 'application', 'news', etc.
    related_entity_id UUID,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SYSTEM CONFIGURATION TABLES
-- =====================================================

-- System settings
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(50) DEFAULT 'string' CHECK (setting_type IN ('string', 'number', 'boolean', 'json')),
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit logs for tracking important changes
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

-- Profile indexes
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

-- Application indexes
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_academic_year ON applications(academic_year);
CREATE INDEX idx_applications_application_id ON applications(application_id);

-- Student indexes
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_student_id ON students(student_id);
CREATE INDEX idx_students_status ON students(status);
CREATE INDEX idx_students_academic_year ON students(academic_year);
CREATE INDEX idx_students_current_grade ON students(current_grade);

-- Document indexes
CREATE INDEX idx_student_documents_student_id ON student_documents(student_id);
CREATE INDEX idx_student_documents_type ON student_documents(document_type);

-- Enrollment indexes
CREATE INDEX idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX idx_enrollments_academic_year_id ON enrollments(academic_year_id);

-- Content indexes
CREATE INDEX idx_news_status ON news(status);
CREATE INDEX idx_news_publish_date ON news(publish_date);
CREATE INDEX idx_carousel_images_active ON carousel_images(is_active);

-- File upload indexes
CREATE INDEX idx_file_uploads_uploaded_by ON file_uploads(uploaded_by);
CREATE INDEX idx_file_uploads_type ON file_uploads(upload_type);
CREATE INDEX idx_file_uploads_entity ON file_uploads(related_entity_type, related_entity_id);

-- =====================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_carousel_images_updated_at BEFORE UPDATE ON carousel_images FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_about_content_updated_at BEFORE UPDATE ON about_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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

-- Insert default admin user
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

-- Insert default form configuration (based on frontend form-config.json)
INSERT INTO form_configurations (field_name, field_label, field_type, is_required, is_visible, placeholder, help_text, display_order, section, options) VALUES
('studentName', 'Student Full Name', 'text', TRUE, TRUE, 'Enter student''s full name', 'Enter the complete name as per official documents', 1, 'personal', NULL),
('dateOfBirth', 'Date of Birth', 'date', TRUE, TRUE, NULL, 'Select the date of birth', 2, 'personal', NULL),
('gender', 'Gender', 'select', TRUE, TRUE, NULL, NULL, 3, 'personal', '["Male", "Female", "Other"]'),
('bloodGroup', 'Blood Group', 'select', FALSE, TRUE, NULL, NULL, 4, 'personal', '["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]'),
('nationality', 'Nationality', 'text', TRUE, TRUE, 'Enter nationality', NULL, 5, 'personal', NULL),
('religion', 'Religion', 'text', FALSE, TRUE, 'Enter religion (optional)', NULL, 6, 'personal', NULL),
('category', 'Category', 'select', TRUE, TRUE, NULL, NULL, 7, 'personal', '["General", "OBC", "SC", "ST", "Other"]'),
('email', 'Email Address', 'email', TRUE, TRUE, 'Enter email address', NULL, 8, 'contact', NULL),
('mobile', 'Mobile Number', 'phone', TRUE, TRUE, 'Enter 10-digit mobile number', NULL, 9, 'contact', NULL),
('alternateMobile', 'Alternate Mobile', 'phone', FALSE, TRUE, 'Enter alternate mobile number', NULL, 10, 'contact', NULL),
('currentAddress', 'Current Address', 'textarea', TRUE, TRUE, 'Enter complete current address', NULL, 11, 'contact', NULL),
('permanentAddress', 'Permanent Address', 'textarea', TRUE, TRUE, 'Enter complete permanent address', NULL, 12, 'contact', NULL),
('fatherName', 'Father''s Name', 'text', TRUE, TRUE, 'Enter father''s full name', NULL, 13, 'parent', NULL),
('fatherOccupation', 'Father''s Occupation', 'text', TRUE, TRUE, 'Enter father''s occupation', NULL, 14, 'parent', NULL),
('fatherMobile', 'Father''s Mobile', 'phone', TRUE, TRUE, 'Enter father''s mobile number', NULL, 15, 'parent', NULL),
('fatherEmail', 'Father''s Email', 'email', FALSE, TRUE, 'Enter father''s email address', NULL, 16, 'parent', NULL),
('motherName', 'Mother''s Name', 'text', TRUE, TRUE, 'Enter mother''s full name', NULL, 17, 'parent', NULL),
('motherOccupation', 'Mother''s Occupation', 'text', TRUE, TRUE, 'Enter mother''s occupation', NULL, 18, 'parent', NULL),
('motherMobile', 'Mother''s Mobile', 'phone', TRUE, TRUE, 'Enter mother''s mobile number', NULL, 19, 'parent', NULL),
('motherEmail', 'Mother''s Email', 'email', FALSE, TRUE, 'Enter mother''s email address', NULL, 20, 'parent', NULL),
('guardianName', 'Guardian Name (if applicable)', 'text', FALSE, TRUE, 'Enter guardian''s name', NULL, 21, 'parent', NULL),
('guardianContact', 'Guardian Contact', 'phone', FALSE, TRUE, 'Enter guardian''s contact number', NULL, 22, 'parent', NULL),
('previousSchool', 'Previous School', 'text', TRUE, TRUE, 'Enter previous school name', NULL, 23, 'academic', NULL),
('previousClass', 'Previous Class', 'select', TRUE, TRUE, NULL, NULL, 24, 'academic', '["Nursery", "LKG", "UKG", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"]'),
('board', 'Previous School Board', 'select', TRUE, TRUE, NULL, NULL, 25, 'academic', '["CBSE", "ICSE", "State Board", "IGCSE", "IB", "Other"]'),
('applyingForGrade', 'Applying for Grade', 'select', TRUE, TRUE, NULL, NULL, 26, 'academic', '["Nursery", "LKG", "UKG", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"]'),
('previousPercentage', 'Previous Academic Performance (%)', 'text', FALSE, TRUE, 'Enter percentage or grade', NULL, 27, 'academic', NULL),
('studentPhoto', 'Student Photograph', 'file', TRUE, TRUE, NULL, 'Upload recent passport size photograph', 28, 'documents', NULL),
('birthCertificate', 'Birth Certificate', 'file', TRUE, TRUE, NULL, 'Upload birth certificate', 29, 'documents', NULL),
('marksheet', 'Previous Class Marksheet', 'file', TRUE, TRUE, NULL, 'Upload previous class marksheet/report card', 30, 'documents', NULL),
('transferCertificate', 'Transfer Certificate', 'file', FALSE, TRUE, NULL, 'Upload transfer certificate (if applicable)', 31, 'documents', NULL),
('aadharCard', 'Aadhar Card', 'file', FALSE, TRUE, NULL, 'Upload Aadhar card copy', 32, 'documents', NULL),
('specialNeeds', 'Special Needs/Medical Conditions', 'textarea', FALSE, TRUE, 'Mention any special needs or medical conditions', NULL, 33, 'additional', NULL),
('interests', 'Interests & Hobbies', 'select', FALSE, TRUE, NULL, NULL, 34, 'additional', '["Sports", "Music", "Dance", "Art", "Reading", "Science", "Technology", "Drama", "Other"]'),
('hearAboutUs', 'How did you hear about us?', 'select', FALSE, TRUE, NULL, NULL, 35, 'additional', '["Website", "Social Media", "Friends/Family", "Advertisement", "School Visit", "Other"]');

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for complete student information
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

-- View for application summary
CREATE VIEW application_summary AS
SELECT 
    a.id,
    a.application_id,
    a.status,
    a.applying_for_grade,
    a.academic_year,
    u.email,
    a.personal_info->>'firstName' as first_name,
    a.personal_info->>'lastName' as last_name,
    a.contact_info->>'mobile' as mobile,
    a.submitted_at,
    a.reviewed_at
FROM applications a
JOIN users u ON a.user_id = u.id;

-- =====================================================
-- FUNCTIONS FOR BUSINESS LOGIC
-- =====================================================

-- Function to generate application ID
CREATE OR REPLACE FUNCTION generate_application_id(year INTEGER)
RETURNS VARCHAR(50) AS $$
DECLARE
    next_number INTEGER;
    app_id VARCHAR(50);
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(application_id FROM 8) AS INTEGER)), 0) + 1
    INTO next_number
    FROM applications 
    WHERE application_id LIKE 'APP' || year || '%';
    
    app_id := 'APP' || year || LPAD(next_number::TEXT, 4, '0');
    RETURN app_id;
END;
$$ LANGUAGE plpgsql;

-- Function to generate student ID
CREATE OR REPLACE FUNCTION generate_student_id(year INTEGER)
RETURNS VARCHAR(50) AS $$
DECLARE
    next_number INTEGER;
    student_id VARCHAR(50);
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(student_id FROM 8) AS INTEGER)), 0) + 1
    INTO next_number
    FROM students 
    WHERE student_id LIKE 'STU' || year || '%';
    
    student_id := 'STU' || year || LPAD(next_number::TEXT, 4, '0');
    RETURN student_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SECURITY POLICIES (Row Level Security)
-- =====================================================

-- Enable RLS on sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_documents ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data (except admins)
CREATE POLICY user_own_data ON users
    FOR ALL
    USING (id = current_setting('app.current_user_id')::UUID OR 
           EXISTS (SELECT 1 FROM users WHERE id = current_setting('app.current_user_id')::UUID AND role = 'admin'));

-- Similar policies for other tables...
CREATE POLICY profile_own_data ON user_profiles
    FOR ALL
    USING (user_id = current_setting('app.current_user_id')::UUID OR 
           EXISTS (SELECT 1 FROM users WHERE id = current_setting('app.current_user_id')::UUID AND role = 'admin'));

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE users IS 'Core user authentication and basic information';
COMMENT ON TABLE user_profiles IS 'Detailed user profile information';
COMMENT ON TABLE applications IS 'Student admission applications';
COMMENT ON TABLE students IS 'Enrolled student records';
COMMENT ON TABLE form_configurations IS 'Dynamic form field configurations for admission forms';
COMMENT ON TABLE file_uploads IS 'File upload tracking and metadata';
COMMENT ON TABLE system_settings IS 'Application configuration settings';
COMMENT ON TABLE audit_logs IS 'System audit trail for important actions';

-- =====================================================
-- END OF SCHEMA
-- =====================================================
