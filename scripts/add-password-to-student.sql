-- Add password column to student table if it doesn't exist
-- Run this in your MySQL database

USE annai_school;

-- Add password column
ALTER TABLE student 
ADD COLUMN IF NOT EXISTS password VARCHAR(255) NULL AFTER nationality;

-- Update existing records to have a default password (you can change this)
-- UPDATE student SET password = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hL.ckstG.' WHERE password IS NULL;
-- Note: The above hashed password is 'password123' - uncomment if you want to set a default

SELECT 'Password column added/verified successfully!' as status;
