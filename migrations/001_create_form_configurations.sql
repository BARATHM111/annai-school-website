-- Migration: Create form_configurations table for dynamic form fields
-- This allows admins to control what fields appear in signup/registration forms

-- Create table if not exists
CREATE TABLE IF NOT EXISTS form_configurations (
    id VARCHAR(36) PRIMARY KEY,
    field_name VARCHAR(100) NOT NULL,
    field_label VARCHAR(200) NOT NULL,
    field_type ENUM('text', 'email', 'phone', 'date', 'select', 'textarea', 'file', 'checkbox', 'radio', 'number') NOT NULL,
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
    
    UNIQUE KEY unique_field_name (field_name),
    INDEX idx_section (section),
    INDEX idx_display_order (display_order),
    INDEX idx_visible (is_visible)
);

-- Insert default form fields
INSERT INTO form_configurations (id, field_name, field_label, field_type, is_required, is_visible, section, display_order, placeholder, help_text, options) VALUES
-- Personal Information
(UUID(), 'firstName', 'First Name', 'text', TRUE, TRUE, 'personal', 1, 'Enter first name', NULL, NULL),
(UUID(), 'middleName', 'Middle Name', 'text', FALSE, TRUE, 'personal', 2, 'Enter middle name', NULL, NULL),
(UUID(), 'lastName', 'Last Name', 'text', TRUE, TRUE, 'personal', 3, 'Enter last name', NULL, NULL),
(UUID(), 'dateOfBirth', 'Date of Birth', 'date', TRUE, TRUE, 'personal', 4, NULL, 'Student must be at least 3 years old', NULL),
(UUID(), 'gender', 'Gender', 'select', TRUE, TRUE, 'personal', 5, NULL, NULL, JSON_ARRAY('Male', 'Female', 'Other')),
(UUID(), 'bloodGroup', 'Blood Group', 'select', FALSE, TRUE, 'personal', 6, NULL, NULL, JSON_ARRAY('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-')),
(UUID(), 'nationality', 'Nationality', 'text', TRUE, TRUE, 'personal', 7, 'e.g., Indian', NULL, NULL),
(UUID(), 'religion', 'Religion', 'select', FALSE, TRUE, 'personal', 8, NULL, NULL, JSON_ARRAY('Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Other')),
(UUID(), 'category', 'Category', 'select', FALSE, TRUE, 'personal', 9, NULL, NULL, JSON_ARRAY('General', 'OBC', 'SC', 'ST', 'Other')),

-- Contact Information
(UUID(), 'email', 'Email Address', 'email', TRUE, TRUE, 'contact', 1, 'Enter email address', 'Will be used for login', NULL),
(UUID(), 'mobile', 'Mobile Number', 'phone', TRUE, TRUE, 'contact', 2, 'Enter 10-digit mobile number', 'Primary contact number', NULL),
(UUID(), 'alternateMobile', 'Alternate Mobile', 'phone', FALSE, TRUE, 'contact', 3, 'Enter alternate mobile number', NULL, NULL),
(UUID(), 'currentAddress', 'Current Address', 'textarea', TRUE, TRUE, 'contact', 4, 'Enter complete current address', NULL, NULL),
(UUID(), 'permanentAddress', 'Permanent Address', 'textarea', TRUE, TRUE, 'contact', 5, 'Enter permanent address', 'Check "Same as Current" if addresses match', NULL),
(UUID(), 'pincode', 'PIN Code', 'text', FALSE, TRUE, 'contact', 6, 'Enter 6-digit PIN code', NULL, NULL),

-- Parent/Guardian Information
(UUID(), 'fatherName', "Father's Name", 'text', TRUE, TRUE, 'parent', 1, "Enter father's full name", NULL, NULL),
(UUID(), 'fatherOccupation', "Father's Occupation", 'text', FALSE, TRUE, 'parent', 2, "Enter father's occupation", NULL, NULL),
(UUID(), 'fatherMobile', "Father's Mobile", 'phone', TRUE, TRUE, 'parent', 3, "Enter father's mobile number", NULL, NULL),
(UUID(), 'fatherEmail', "Father's Email", 'email', FALSE, TRUE, 'parent', 4, "Enter father's email address", NULL, NULL),
(UUID(), 'motherName', "Mother's Name", 'text', TRUE, TRUE, 'parent', 5, "Enter mother's full name", NULL, NULL),
(UUID(), 'motherOccupation', "Mother's Occupation", 'text', FALSE, TRUE, 'parent', 6, "Enter mother's occupation", NULL, NULL),
(UUID(), 'motherMobile', "Mother's Mobile", 'phone', TRUE, TRUE, 'parent', 7, "Enter mother's mobile number", NULL, NULL),
(UUID(), 'motherEmail', "Mother's Email", 'email', FALSE, TRUE, 'parent', 8, "Enter mother's email address", NULL, NULL),
(UUID(), 'guardianName', 'Guardian Name', 'text', FALSE, TRUE, 'parent', 9, 'If different from parents', 'Only if guardian is different', NULL),
(UUID(), 'guardianContact', 'Guardian Contact', 'phone', FALSE, TRUE, 'parent', 10, 'Enter guardian contact number', NULL, NULL),

-- Academic Information
(UUID(), 'applyingForGrade', 'Applying for Grade/Class', 'select', TRUE, TRUE, 'academic', 1, NULL, 'Select the grade you are applying for', JSON_ARRAY('Nursery', 'LKG', 'UKG', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12')),
(UUID(), 'previousSchool', 'Previous School Name', 'text', FALSE, TRUE, 'academic', 2, 'Enter previous school name', 'Leave blank if applying for Nursery/LKG', NULL),
(UUID(), 'previousClass', 'Previous Class/Grade', 'text', FALSE, TRUE, 'academic', 3, 'e.g., Grade 10, Class X', NULL, NULL),
(UUID(), 'board', 'Previous Board', 'select', FALSE, TRUE, 'academic', 4, NULL, NULL, JSON_ARRAY('CBSE', 'ICSE', 'State Board', 'IB', 'IGCSE', 'Other')),
(UUID(), 'previousPercentage', 'Previous Class Percentage/Grade', 'text', FALSE, TRUE, 'academic', 5, 'e.g., 85% or A+', NULL, NULL),

-- Documents
(UUID(), 'studentPhoto', 'Student Photo', 'file', TRUE, TRUE, 'documents', 1, NULL, 'Passport size photo (JPEG/PNG, max 2MB)', NULL),
(UUID(), 'birthCertificate', 'Birth Certificate', 'file', TRUE, TRUE, 'documents', 2, NULL, 'PDF or image file (max 5MB)', NULL),
(UUID(), 'marksheet', 'Previous Marksheet', 'file', FALSE, TRUE, 'documents', 3, NULL, 'Latest academic records', NULL),
(UUID(), 'transferCertificate', 'Transfer Certificate', 'file', FALSE, TRUE, 'documents', 4, NULL, 'TC from previous school (if applicable)', NULL),

-- Additional Information
(UUID(), 'specialNeeds', 'Special Educational Needs', 'textarea', FALSE, TRUE, 'additional', 1, 'Any learning disabilities or special requirements', 'Please provide details if applicable', NULL),
(UUID(), 'medicalConditions', 'Medical Conditions', 'textarea', FALSE, TRUE, 'additional', 2, 'Please mention any medical conditions or allergies', NULL, NULL),
(UUID(), 'transportRequired', 'School Transport Required', 'select', FALSE, TRUE, 'additional', 3, NULL, NULL, JSON_ARRAY('Yes', 'No'));
