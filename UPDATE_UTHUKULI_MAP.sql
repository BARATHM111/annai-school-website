-- Update Uthukuli branch with new Google Maps Street View embed URL
UPDATE branch_contact_info 
SET 
    google_maps_embed_url = 'https://www.google.com/maps/embed?pb=!4v1760610952788!6m8!1m7!1sQRuZZLAdZghvliQSlAIHoA!2m2!1d11.13586230007473!2d77.44992371108717!3f12.732299!4f0!5f0.7820865974627469',
    google_maps_lat = 11.135862,
    google_maps_lng = 77.449924,
    updated_at = NOW()
WHERE branch_id = 'uthukuli';

-- Verify the update
SELECT branch_id, google_maps_lat, google_maps_lng, 
       LEFT(google_maps_embed_url, 50) as embed_url_preview 
FROM branch_contact_info 
WHERE branch_id = 'uthukuli';
