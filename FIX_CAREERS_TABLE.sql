-- Drop the incorrectly created table
DROP TABLE IF EXISTS careers_page_content;

-- Create careers_page_content table for editable careers page content
-- NOTE: This is COMMON for both branches (not branch-specific)
CREATE TABLE IF NOT EXISTS careers_page_content (
    id VARCHAR(36) PRIMARY KEY,
    section VARCHAR(50) NOT NULL,
    content_key VARCHAR(100) NOT NULL,
    content_value TEXT,
    content_type ENUM('text', 'number', 'image', 'url', 'json') DEFAULT 'text',
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_section_key (section, content_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default content for careers page
-- Header Section
INSERT INTO careers_page_content (id, section, content_key, content_value, content_type) VALUES
(UUID(), 'header', 'title', 'Join Our Teaching Team', 'text'),
(UUID(), 'header', 'description', 'Be part of our mission to provide quality education. Apply now for teaching positions at our Tiruppur or Uthukuli branches.', 'text');

-- Application Status Section
INSERT INTO careers_page_content (id, section, content_key, content_value, content_type) VALUES
(UUID(), 'status', 'heading', 'Already Applied?', 'text'),
(UUID(), 'status', 'subheading', 'Check your application status', 'text'),
(UUID(), 'status', 'button_text', 'Check Status', 'text');

-- Tiruppur Branch Card
INSERT INTO careers_page_content (id, section, content_key, content_value, content_type) VALUES
(UUID(), 'branch_tiruppur', 'name', 'Tiruppur Branch', 'text'),
(UUID(), 'branch_tiruppur', 'description', 'Main campus with state-of-the-art facilities and experienced faculty', 'text');

-- Uthukuli Branch Card
INSERT INTO careers_page_content (id, section, content_key, content_value, content_type) VALUES
(UUID(), 'branch_uthukuli', 'name', 'Uthukuli Branch', 'text'),
(UUID(), 'branch_uthukuli', 'description', 'Growing campus with modern infrastructure and collaborative environment', 'text');

-- Success Message Section
INSERT INTO careers_page_content (id, section, content_key, content_value, content_type) VALUES
(UUID(), 'success', 'title', 'Application Submitted Successfully!', 'text'),
(UUID(), 'success', 'message', 'Thank you for applying to Annai School. We will review your application and get back to you soon.', 'text'),
(UUID(), 'success', 'status_message', 'You can check your application status using your email:', 'text'),
(UUID(), 'success', 'button_text', 'Check Application Status', 'text');

-- Form Section Labels (for customizing form field labels)
INSERT INTO careers_page_content (id, section, content_key, content_value, content_type) VALUES
(UUID(), 'form_labels', 'personal_info_heading', 'Personal Information', 'text'),
(UUID(), 'form_labels', 'full_name', 'Full Name', 'text'),
(UUID(), 'form_labels', 'email', 'Email', 'text'),
(UUID(), 'form_labels', 'phone', 'Phone', 'text'),
(UUID(), 'form_labels', 'date_of_birth', 'Date of Birth', 'text'),
(UUID(), 'form_labels', 'gender', 'Gender', 'text'),
(UUID(), 'form_labels', 'address', 'Address', 'text'),
(UUID(), 'form_labels', 'professional_info_heading', 'Professional Information', 'text'),
(UUID(), 'form_labels', 'branch', 'Preferred Branch', 'text'),
(UUID(), 'form_labels', 'position', 'Position Applied For', 'text'),
(UUID(), 'form_labels', 'qualification', 'Highest Qualification', 'text'),
(UUID(), 'form_labels', 'experience', 'Years of Experience', 'text'),
(UUID(), 'form_labels', 'subject', 'Subject Specialization', 'text'),
(UUID(), 'form_labels', 'previous_school', 'Previous School/Institution', 'text'),
(UUID(), 'form_labels', 'additional_info_heading', 'Additional Information', 'text'),
(UUID(), 'form_labels', 'resume', 'Resume/CV', 'text'),
(UUID(), 'form_labels', 'cover_letter', 'Cover Letter', 'text'),
(UUID(), 'form_labels', 'expected_salary', 'Expected Salary', 'text'),
(UUID(), 'form_labels', 'available_from', 'Available From', 'text'),
(UUID(), 'form_labels', 'languages', 'Languages Known', 'text'),
(UUID(), 'form_labels', 'certifications', 'Certifications', 'text'),
(UUID(), 'form_labels', 'submit_button', 'Submit Application', 'text');
