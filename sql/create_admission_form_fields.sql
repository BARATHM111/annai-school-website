-- Create admission_form_fields table
-- This table stores configuration for the signup/admission form fields

CREATE TABLE IF NOT EXISTS admission_form_fields (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  field_name VARCHAR(100) NOT NULL UNIQUE,
  field_label VARCHAR(200) NOT NULL,
  field_type ENUM('text', 'email', 'tel', 'number', 'select', 'textarea', 'date') NOT NULL DEFAULT 'text',
  field_placeholder VARCHAR(255),
  is_required BOOLEAN DEFAULT true,
  is_enabled BOOLEAN DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  options JSON,
  validation_rules JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_enabled (is_enabled),
  INDEX idx_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default form fields based on current SimpleSignupForm structure
INSERT INTO admission_form_fields 
  (id, field_name, field_label, field_type, field_placeholder, is_required, is_enabled, display_order, options, validation_rules) 
VALUES
  (UUID(), 'studentName', 'Student Name', 'text', 'Enter student full name', true, true, 1, NULL, JSON_OBJECT('minLength', 2, 'maxLength', 200)),
  (UUID(), 'parentName', 'Parent/Guardian Name', 'text', 'Enter parent/guardian name', true, true, 2, NULL, JSON_OBJECT('minLength', 2, 'maxLength', 200)),
  (UUID(), 'phoneNumber', 'Phone Number', 'tel', 'Enter primary contact number', true, true, 3, NULL, JSON_OBJECT('pattern', '^[0-9]{10}$', 'message', 'Please enter a valid 10-digit phone number')),
  (UUID(), 'alternateNumber', 'Alternate Phone Number', 'tel', 'Enter alternate contact number (optional)', false, true, 4, NULL, JSON_OBJECT('pattern', '^[0-9]{10}$', 'message', 'Please enter a valid 10-digit phone number')),
  (UUID(), 'applyingForClass', 'Applying for Class', 'select', 'Select class', true, true, 5, 
    JSON_ARRAY('Pre-KG', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'), 
    NULL
  );

-- Query to view all fields
-- SELECT * FROM admission_form_fields ORDER BY display_order;

-- Query to get enabled fields only
-- SELECT * FROM admission_form_fields WHERE is_enabled = true ORDER BY display_order;
