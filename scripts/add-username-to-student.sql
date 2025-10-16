-- Add username column to student_application_form table
-- Run this in your MySQL database

USE annai_school;

-- Add username column (unique for login purposes)
ALTER TABLE student_application_form 
ADD COLUMN IF NOT EXISTS username VARCHAR(50) UNIQUE NULL AFTER email;

-- Create an index on username for faster lookups
CREATE INDEX IF NOT EXISTS idx_student_username ON student_application_form(username);

SELECT 'Username column added successfully! You can now generate usernames for students.' as status;
