-- Create branches table for multi-campus management
CREATE TABLE IF NOT EXISTS branches (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  display_name VARCHAR(200) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  logo_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_default (is_default),
  INDEX idx_enabled (is_enabled),
  INDEX idx_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default branches (Tirupur and Uthukuli)
INSERT INTO branches (id, name, display_name, address, phone, email, is_enabled, is_default, display_order) 
VALUES
  ('tirupur', 'Tirupur Campus', 'Annai Matriculation School - Tirupur', 'Tirupur, Tamil Nadu', '+91 1234567890', 'tirupur@annaischool.edu', true, true, 1),
  ('uthukuli', 'Uthukuli Campus', 'Annai Matriculation School - Uthukuli', 'Uthukuli, Tamil Nadu', '+91 0987654321', 'uthukuli@annaischool.edu', true, false, 2);

-- Query to view all branches
-- SELECT * FROM branches ORDER BY display_order;

-- Query to get enabled branches only
-- SELECT * FROM branches WHERE is_enabled = true ORDER BY display_order;

-- Query to get default branch
-- SELECT * FROM branches WHERE is_default = true LIMIT 1;
