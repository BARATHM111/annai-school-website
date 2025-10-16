-- Add branch_id to all relevant tables for branch-specific data isolation
-- Run this script AFTER creating the branches table

-- 1. Add branch_id to student_application_form
ALTER TABLE student_application_form 
ADD COLUMN branch_id VARCHAR(50) DEFAULT 'tirupur' AFTER id,
ADD INDEX idx_branch_id (branch_id),
ADD FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE RESTRICT;

-- Update existing records to tirupur (default/main campus)
UPDATE student_application_form SET branch_id = 'tirupur' WHERE branch_id IS NULL;

-- Make branch_id NOT NULL after updating
ALTER TABLE student_application_form MODIFY branch_id VARCHAR(50) NOT NULL;

-- 2. Add branch_id to active_students
ALTER TABLE active_students 
ADD COLUMN branch_id VARCHAR(50) DEFAULT 'tirupur' AFTER id,
ADD INDEX idx_branch_id (branch_id),
ADD FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE RESTRICT;

UPDATE active_students SET branch_id = 'tirupur' WHERE branch_id IS NULL;
ALTER TABLE active_students MODIFY branch_id VARCHAR(50) NOT NULL;

-- 3. Add branch_id to career_applications
ALTER TABLE career_applications 
ADD COLUMN branch_id VARCHAR(50) DEFAULT 'tirupur' AFTER id,
ADD INDEX idx_branch_id (branch_id),
ADD FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE RESTRICT;

UPDATE career_applications SET branch_id = 'tirupur' WHERE branch_id IS NULL;
ALTER TABLE career_applications MODIFY branch_id VARCHAR(50) NOT NULL;

-- 4. Add branch_id to contacts
ALTER TABLE contacts 
ADD COLUMN branch_id VARCHAR(50) DEFAULT 'tirupur' AFTER id,
ADD INDEX idx_branch_id (branch_id),
ADD FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE RESTRICT;

UPDATE contacts SET branch_id = 'tirupur' WHERE branch_id IS NULL;
ALTER TABLE contacts MODIFY branch_id VARCHAR(50) NOT NULL;

-- 5. Add branch_id to academics
ALTER TABLE academics 
ADD COLUMN branch_id VARCHAR(50) DEFAULT 'tirupur' AFTER id,
ADD INDEX idx_branch_id (branch_id),
ADD FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE RESTRICT;

UPDATE academics SET branch_id = 'tirupur' WHERE branch_id IS NULL;
ALTER TABLE academics MODIFY branch_id VARCHAR(50) NOT NULL;

-- 6. Add branch_id to gallery
ALTER TABLE gallery 
ADD COLUMN branch_id VARCHAR(50) DEFAULT 'tirupur' AFTER id,
ADD INDEX idx_branch_id (branch_id),
ADD FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE RESTRICT;

UPDATE gallery SET branch_id = 'tirupur' WHERE branch_id IS NULL;
ALTER TABLE gallery MODIFY branch_id VARCHAR(50) NOT NULL;

-- 7. Add branch_id to achievers
ALTER TABLE achievers 
ADD COLUMN branch_id VARCHAR(50) DEFAULT 'tirupur' AFTER id,
ADD INDEX idx_branch_id (branch_id),
ADD FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE RESTRICT;

UPDATE achievers SET branch_id = 'tirupur' WHERE branch_id IS NULL;
ALTER TABLE achievers MODIFY branch_id VARCHAR(50) NOT NULL;

-- 8. Add branch_id to sports
ALTER TABLE sports 
ADD COLUMN branch_id VARCHAR(50) DEFAULT 'tirupur' AFTER id,
ADD INDEX idx_branch_id (branch_id),
ADD FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE RESTRICT;

UPDATE sports SET branch_id = 'tirupur' WHERE branch_id IS NULL;
ALTER TABLE sports MODIFY branch_id VARCHAR(50) NOT NULL;

-- 9. Add branch_id to newsevent
ALTER TABLE newsevent 
ADD COLUMN branch_id VARCHAR(50) DEFAULT 'tirupur' AFTER id,
ADD INDEX idx_branch_id (branch_id),
ADD FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE RESTRICT;

UPDATE newsevent SET branch_id = 'tirupur' WHERE branch_id IS NULL;
ALTER TABLE newsevent MODIFY branch_id VARCHAR(50) NOT NULL;

-- 10. Add branch_id to announcement
ALTER TABLE announcement 
ADD COLUMN branch_id VARCHAR(50) DEFAULT 'tirupur' AFTER id,
ADD INDEX idx_branch_id (branch_id),
ADD FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE RESTRICT;

UPDATE announcement SET branch_id = 'tirupur' WHERE branch_id IS NULL;
ALTER TABLE announcement MODIFY branch_id VARCHAR(50) NOT NULL;

-- 11. Add branch_id to carousel_images
ALTER TABLE carousel_images 
ADD COLUMN branch_id VARCHAR(50) DEFAULT 'tirupur' AFTER id,
ADD INDEX idx_branch_id (branch_id),
ADD FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE RESTRICT;

UPDATE carousel_images SET branch_id = 'tirupur' WHERE branch_id IS NULL;
ALTER TABLE carousel_images MODIFY branch_id VARCHAR(50) NOT NULL;

-- 12. Add branch_id to admission_form_fields (if you want branch-specific form fields)
ALTER TABLE admission_form_fields 
ADD COLUMN branch_id VARCHAR(50) DEFAULT NULL AFTER id,
ADD INDEX idx_branch_id (branch_id),
ADD FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE;

-- Note: NULL branch_id means form field applies to all branches
-- If you want to make branch-specific form fields, set branch_id

-- Verify all changes
SELECT 
    'student_application_form' as table_name,
    COUNT(*) as total_records,
    COUNT(DISTINCT branch_id) as unique_branches
FROM student_application_form
UNION ALL
SELECT 'active_students', COUNT(*), COUNT(DISTINCT branch_id) FROM active_students
UNION ALL
SELECT 'career_applications', COUNT(*), COUNT(DISTINCT branch_id) FROM career_applications
UNION ALL
SELECT 'contacts', COUNT(*), COUNT(DISTINCT branch_id) FROM contacts
UNION ALL
SELECT 'academics', COUNT(*), COUNT(DISTINCT branch_id) FROM academics
UNION ALL
SELECT 'gallery', COUNT(*), COUNT(DISTINCT branch_id) FROM gallery
UNION ALL
SELECT 'achievers', COUNT(*), COUNT(DISTINCT branch_id) FROM achievers
UNION ALL
SELECT 'sports', COUNT(*), COUNT(DISTINCT branch_id) FROM sports
UNION ALL
SELECT 'newsevent', COUNT(*), COUNT(DISTINCT branch_id) FROM newsevent
UNION ALL
SELECT 'announcement', COUNT(*), COUNT(DISTINCT branch_id) FROM announcement
UNION ALL
SELECT 'carousel_images', COUNT(*), COUNT(DISTINCT branch_id) FROM carousel_images;

-- Sample queries to check branch-specific data
-- SELECT * FROM student_application_form WHERE branch_id = 'tirupur';
-- SELECT * FROM active_students WHERE branch_id = 'uthukuli';
-- SELECT * FROM carousel_images WHERE branch_id = 'tirupur';
