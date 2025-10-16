-- Update both Tirupur and Uthukuli branch maps with custom Google Maps embeds

-- Update Tirupur branch with directions map (Railway Station to School)
UPDATE branch_contact_info 
SET 
    google_maps_embed_url = 'https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d221.43007532195878!2d77.32285476704243!3d11.11254487780464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e6!4m5!1s0x3ba907af6b2d6db9%3A0x16007c27dc81fc1f!2sTiruppur%2C%20Railways%20Ticket%20Booking%20Office%2C%20Sirupooluvapatti%2C%20Khaderpet%2C%20Rayapuram%2C%20Tiruppur%2C%20Tamil%20Nadu!3m2!1d11.1085741!2d77.3397627!4m5!1s0x3ba907018eac662d%3A0x859cc72daeef8563!2sCollege%20Rd%2C%20Masco%20Nagar%2C%20Shivshakthi%20Nagar%2C%20Kozhi%20Ponnai%20Thottam%2C%20Tiruppur%2C%20Tamil%20Nadu%20641602!3m2!1d11.1123659!2d77.3232811!5e1!3m2!1sen!2sin!4v1760610471008!5m2!1sen!2sin',
    google_maps_lat = 11.1123659,
    google_maps_lng = 77.3232811,
    updated_at = NOW()
WHERE branch_id = 'tirupur';

-- Update Uthukuli branch with Street View embed
UPDATE branch_contact_info 
SET 
    google_maps_embed_url = 'https://www.google.com/maps/embed?pb=!4v1760610952788!6m8!1m7!1sQRuZZLAdZghvliQSlAIHoA!2m2!1d11.13586230007473!2d77.44992371108717!3f12.732299!4f0!5f0.7820865974627469',
    google_maps_lat = 11.135862,
    google_maps_lng = 77.449924,
    updated_at = NOW()
WHERE branch_id = 'uthukuli';

-- Verify both updates
SELECT branch_id, 
       google_maps_lat, 
       google_maps_lng, 
       LEFT(google_maps_embed_url, 60) as embed_url_preview,
       CASE 
           WHEN google_maps_embed_url LIKE '%6m8%' THEN 'Street View'
           WHEN google_maps_embed_url LIKE '%!4m13!3e6%' THEN 'Directions'
           ELSE 'Location'
       END as map_type
FROM branch_contact_info 
WHERE branch_id IN ('tirupur', 'uthukuli')
ORDER BY branch_id;
