-- Create branch_contact_info table for branch-specific contact details
CREATE TABLE IF NOT EXISTS branch_contact_info (
    id VARCHAR(36) PRIMARY KEY,
    branch_id VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),
    phone VARCHAR(50) NOT NULL,
    phone_secondary VARCHAR(50),
    email VARCHAR(255) NOT NULL,
    email_secondary VARCHAR(255),
    whatsapp VARCHAR(50),
    office_hours TEXT,
    google_maps_embed_url TEXT,
    google_maps_lat DECIMAL(10, 8),
    google_maps_lng DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
    UNIQUE KEY unique_branch_contact (branch_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert contact info for Tirupur branch
INSERT INTO branch_contact_info (
    id, 
    branch_id, 
    address, 
    city, 
    state, 
    pincode, 
    phone, 
    email,
    google_maps_lat,
    google_maps_lng,
    office_hours
) VALUES (
    UUID(),
    'tirupur',
    'College Rd, Masco Nagar, Shivshakthi Nagar, Kozhi Ponnai Thottam, Tiruppur, Tamil Nadu 641602',
    'Tiruppur',
    'Tamil Nadu',
    '641602',
    '094430 83242',
    'annai.tirupur@school.com',
    11.1085,
    77.3411,
    'Mon - Fri: 8:00 AM - 4:00 PM\nSat: 8:00 AM - 1:00 PM'
);

-- Insert contact info for Uthukuli branch
INSERT INTO branch_contact_info (
    id, 
    branch_id, 
    address, 
    city, 
    state, 
    pincode, 
    phone, 
    email,
    google_maps_lat,
    google_maps_lng,
    office_hours
) VALUES (
    UUID(),
    'uthukuli',
    '4CPX+FX9, Gobichettipalayam - Uthukuli - Kangeyam Rd, Tamil Nadu 638752',
    'Uthukuli',
    'Tamil Nadu',
    '638752',
    '094430 83242',
    'annai.uthukuli@school.com',
    11.071562,
    77.349792,
    'Mon - Fri: 8:00 AM - 4:00 PM\nSat: 8:00 AM - 1:00 PM'
);
