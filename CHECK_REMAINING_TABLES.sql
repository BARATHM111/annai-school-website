-- Check structure of remaining tables for Uthukuli content

-- Check published_news structure
DESCRIBE published_news;
SELECT * FROM published_news LIMIT 1;

-- Check gallery structure  
DESCRIBE gallery;
SELECT * FROM gallery LIMIT 1;

-- Check about_sections structure
DESCRIBE about_sections;
SELECT * FROM about_sections LIMIT 1;

-- Also check newsevent (might be the one being used)
DESCRIBE newsevent;
SELECT * FROM newsevent LIMIT 1;
