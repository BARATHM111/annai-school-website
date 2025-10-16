-- Create homepage_content table for editable homepage sections
CREATE TABLE IF NOT EXISTS homepage_content (
    id VARCHAR(36) PRIMARY KEY,
    branch_id VARCHAR(50) NOT NULL,
    section VARCHAR(50) NOT NULL,
    content_key VARCHAR(100) NOT NULL,
    content_value TEXT,
    content_type ENUM('text', 'number', 'image', 'url', 'json') DEFAULT 'text',
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
    UNIQUE KEY unique_branch_section_key (branch_id, section, content_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default Tirupur data
-- Stats Section
INSERT INTO homepage_content (id, branch_id, section, content_key, content_value, content_type, display_order) VALUES
(UUID(), 'tirupur', 'stats', 'stat1_value', '1,200+', 'text', 1),
(UUID(), 'tirupur', 'stats', 'stat1_label', 'Students Enrolled', 'text', 1),
(UUID(), 'tirupur', 'stats', 'stat2_value', '80+', 'text', 2),
(UUID(), 'tirupur', 'stats', 'stat2_label', 'Qualified Teachers', 'text', 2),
(UUID(), 'tirupur', 'stats', 'stat3_value', '25+', 'text', 3),
(UUID(), 'tirupur', 'stats', 'stat3_label', 'Years of Excellence', 'text', 3),
(UUID(), 'tirupur', 'stats', 'stat4_value', '15+', 'text', 4),
(UUID(), 'tirupur', 'stats', 'stat4_label', 'Academic Programs', 'text', 4);

-- About Section
INSERT INTO homepage_content (id, branch_id, section, content_key, content_value, content_type) VALUES
(UUID(), 'tirupur', 'about', 'heading', 'About Annai School', 'text'),
(UUID(), 'tirupur', 'about', 'description', 'For over 25 years, Annai School has been a beacon of educational excellence, committed to providing quality education that shapes character, builds confidence, and prepares students for a successful future.', 'text'),
(UUID(), 'tirupur', 'about', 'image_url', '/uploads/carousel/carousel-1759697591466.jpg', 'image'),
(UUID(), 'tirupur', 'about', 'button_text', 'Learn More About Us', 'text'),
(UUID(), 'tirupur', 'about', 'button_url', '/about', 'url');

-- Founder Section
INSERT INTO homepage_content (id, branch_id, section, content_key, content_value, content_type) VALUES
(UUID(), 'tirupur', 'founder', 'heading', 'About Our Founder', 'text'),
(UUID(), 'tirupur', 'founder', 'subheading', 'Leadership with Experience and Dedication', 'text'),
(UUID(), 'tirupur', 'founder', 'name', 'Mrs. Lakshmi Kathiresan', 'text'),
(UUID(), 'tirupur', 'founder', 'title', 'Founder & Principal', 'text'),
(UUID(), 'tirupur', 'founder', 'image_url', '/images/founder/corres (1).jpg', 'image'),
(UUID(), 'tirupur', 'founder', 'excellence_text', 'The school is being run by professionally qualified and well-experienced promoters having more than twenty years of experience in the field of Child Education, School Education and training who are committed to leave a mark in the educational field in twin cities.', 'text'),
(UUID(), 'tirupur', 'founder', 'supervision_text', 'The school is being run under the direct supervision of the promoters on a day to day basis.', 'text'),
(UUID(), 'tirupur', 'founder', 'academician_text', 'Mrs. Lakshmi Kathiresan is a renowned academician with more than 20 years of experience in the field of education.', 'text');

-- CTA Section
INSERT INTO homepage_content (id, branch_id, section, content_key, content_value, content_type) VALUES
(UUID(), 'tirupur', 'cta', 'heading', 'Ready to Join Our School Family?', 'text'),
(UUID(), 'tirupur', 'cta', 'description', 'Take the first step towards your child''s bright future. Apply for admission today!', 'text'),
(UUID(), 'tirupur', 'cta', 'primary_button_text', 'Apply Now', 'text'),
(UUID(), 'tirupur', 'cta', 'primary_button_url', '/admissions/register', 'url'),
(UUID(), 'tirupur', 'cta', 'secondary_button_text', 'Contact Us', 'text'),
(UUID(), 'tirupur', 'cta', 'secondary_button_url', '/contact', 'url');

-- Insert default Uthukuli data
-- Stats Section
INSERT INTO homepage_content (id, branch_id, section, content_key, content_value, content_type, display_order) VALUES
(UUID(), 'uthukuli', 'stats', 'stat1_value', '800+', 'text', 1),
(UUID(), 'uthukuli', 'stats', 'stat1_label', 'Students Enrolled', 'text', 1),
(UUID(), 'uthukuli', 'stats', 'stat2_value', '50+', 'text', 2),
(UUID(), 'uthukuli', 'stats', 'stat2_label', 'Qualified Teachers', 'text', 2),
(UUID(), 'uthukuli', 'stats', 'stat3_value', '20+', 'text', 3),
(UUID(), 'uthukuli', 'stats', 'stat3_label', 'Years of Excellence', 'text', 3),
(UUID(), 'uthukuli', 'stats', 'stat4_value', '12+', 'text', 4),
(UUID(), 'uthukuli', 'stats', 'stat4_label', 'Academic Programs', 'text', 4);

-- About Section
INSERT INTO homepage_content (id, branch_id, section, content_key, content_value, content_type) VALUES
(UUID(), 'uthukuli', 'about', 'heading', 'About Annai School - Uthukuli', 'text'),
(UUID(), 'uthukuli', 'about', 'description', 'For over 20 years, Annai School Uthukuli Campus has been committed to providing quality education that shapes character, builds confidence, and prepares students for a successful future.', 'text'),
(UUID(), 'uthukuli', 'about', 'image_url', '/uploads/carousel/carousel-1759697591466.jpg', 'image'),
(UUID(), 'uthukuli', 'about', 'button_text', 'Learn More About Us', 'text'),
(UUID(), 'uthukuli', 'about', 'button_url', '/about', 'url');

-- Founder Section
INSERT INTO homepage_content (id, branch_id, section, content_key, content_value, content_type) VALUES
(UUID(), 'uthukuli', 'founder', 'heading', 'About Our Founder', 'text'),
(UUID(), 'uthukuli', 'founder', 'subheading', 'Leadership with Experience and Dedication', 'text'),
(UUID(), 'uthukuli', 'founder', 'name', 'Mrs. Lakshmi Kathiresan', 'text'),
(UUID(), 'uthukuli', 'founder', 'title', 'Founder & Principal', 'text'),
(UUID(), 'uthukuli', 'founder', 'image_url', '/images/founder/corres (1).jpg', 'image'),
(UUID(), 'uthukuli', 'founder', 'excellence_text', 'The school is being run by professionally qualified and well-experienced promoters having more than twenty years of experience in the field of Child Education, School Education and training who are committed to leave a mark in the educational field.', 'text'),
(UUID(), 'uthukuli', 'founder', 'supervision_text', 'The school is being run under the direct supervision of the promoters on a day to day basis.', 'text'),
(UUID(), 'uthukuli', 'founder', 'academician_text', 'Mrs. Lakshmi Kathiresan is a renowned academician with more than 20 years of experience in the field of education.', 'text');

-- CTA Section
INSERT INTO homepage_content (id, branch_id, section, content_key, content_value, content_type) VALUES
(UUID(), 'uthukuli', 'cta', 'heading', 'Ready to Join Our School Family?', 'text'),
(UUID(), 'uthukuli', 'cta', 'description', 'Take the first step towards your child''s bright future. Apply for admission today!', 'text'),
(UUID(), 'uthukuli', 'cta', 'primary_button_text', 'Apply Now', 'text'),
(UUID(), 'uthukuli', 'cta', 'primary_button_url', '/admissions/register', 'url'),
(UUID(), 'uthukuli', 'cta', 'secondary_button_text', 'Contact Us', 'text'),
(UUID(), 'uthukuli', 'cta', 'secondary_button_url', '/contact', 'url');
