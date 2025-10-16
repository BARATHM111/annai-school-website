# ✅ Both Campus Maps Updated!

## 🗺️ **Tirupur & Uthukuli Custom Map Embeds**

Both branches now have custom Google Maps embeds with different views!

---

## 🎯 **What Each Branch Shows**

### **Tirupur Branch:**
- 🧭 **Directions Map**
- Shows route from Railway Station to School
- Helpful for visitors using public transport
- Interactive route view

### **Uthukuli Branch:**
- 👁️ **Street View**
- 360° panoramic view of the school
- Visitors can see the actual building
- Immersive experience

---

## 🚀 **QUICK APPLY - Choose One Option**

### **Option 1: Update Both at Once (Recommended)**
```bash
mysql -u root -p annai_school < UPDATE_BOTH_MAPS.sql
```

### **Option 2: Update Individually**
```bash
# Tirupur only
mysql -u root -p annai_school < UPDATE_TIRUPUR_MAP.sql

# Uthukuli only
mysql -u root -p annai_school < UPDATE_UTHUKULI_MAP.sql
```

### **Option 3: Manual SQL**
```sql
-- Update Tirupur (Directions)
UPDATE branch_contact_info 
SET 
    google_maps_embed_url = 'https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d221.43007532195878!2d77.32285476704243!3d11.11254487780464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e6!4m5!1s0x3ba907af6b2d6db9%3A0x16007c27dc81fc1f!2sTiruppur%2C%20Railways%20Ticket%20Booking%20Office%2C%20Sirupooluvapatti%2C%20Khaderpet%2C%20Rayapuram%2C%20Tiruppur%2C%20Tamil%20Nadu!3m2!1d11.1085741!2d77.3397627!4m5!1s0x3ba907018eac662d%3A0x859cc72daeef8563!2sCollege%20Rd%2C%20Masco%20Nagar%2C%20Shivshakthi%20Nagar%2C%20Kozhi%20Ponnai%20Thottam%2C%20Tiruppur%2C%20Tamil%20Nadu%20641602!3m2!1d11.1123659!2d77.3232811!5e1!3m2!1sen!2sin!4v1760610471008!5m2!1sen!2sin',
    google_maps_lat = 11.1123659,
    google_maps_lng = 77.3232811
WHERE branch_id = 'tirupur';

-- Update Uthukuli (Street View)
UPDATE branch_contact_info 
SET 
    google_maps_embed_url = 'https://www.google.com/maps/embed?pb=!4v1760610952788!6m8!1m7!1sQRuZZLAdZghvliQSlAIHoA!2m2!1d11.13586230007473!2d77.44992371108717!3f12.732299!4f0!5f0.7820865974627469',
    google_maps_lat = 11.135862,
    google_maps_lng = 77.449924
WHERE branch_id = 'uthukuli';
```

---

## 🧪 **TEST IT**

### **Test Tirupur Map:**
```
1. Go to /contact
2. Select Tirupur branch (or visit from Tirupur subdomain)
3. Scroll to map
4. See DIRECTIONS from railway station ✅
```

### **Test Uthukuli Map:**
```
1. Go to /contact
2. Select Uthukuli branch (or visit from Uthukuli subdomain)
3. Scroll to map
4. See STREET VIEW of the school ✅
```

---

## 📊 **Comparison**

| Branch | Map Type | Purpose | Benefit |
|--------|----------|---------|---------|
| **Tirupur** | 🧭 Directions | Show route from station | Helps visitors find the way |
| **Uthukuli** | 👁️ Street View | Show school building | Visitors can see actual place |

---

## 💡 **Map Types Explained**

### **Directions Map (Tirupur):**
```
✅ Shows route from Point A to Point B
✅ Travel time and distance
✅ Step-by-step directions
✅ Different transport modes
✅ Great for first-time visitors
```

### **Street View (Uthukuli):**
```
✅ 360° panoramic view
✅ See actual school building
✅ Virtual tour experience
✅ Navigate around the location
✅ Great for showcasing campus
```

---

## 🔄 **How to Change Later**

### **Via Admin Panel:**
```
1. Go to /admin/branch-contact
2. Select branch (Tirupur or Uthukuli)
3. Find "Google Maps Embed URL" field
4. Paste new embed URL
5. Click Save
6. Done! ✅
```

### **Getting Different Map Types:**

**For Directions:**
```
1. Go to Google Maps
2. Click "Directions"
3. Set From and To locations
4. Click Share → Embed a map
5. Copy URL from src="..."
```

**For Street View:**
```
1. Go to Google Maps
2. Drag the yellow person icon to the map
3. Navigate to desired view
4. Click Share → Embed a map
5. Copy URL from src="..."
```

**For Location Pin:**
```
1. Go to Google Maps
2. Search/click on location
3. Click Share → Embed a map
4. Copy URL from src="..."
```

---

## 🎨 **Current Setup**

### **Tirupur:**
```
📍 Location: College Rd, Masco Nagar, Tiruppur
🗺️ Map Type: Directions
🚉 From: Tiruppur Railway Station
🏫 To: Annai School Tirupur
📐 Coordinates: 11.1123659, 77.3232811
```

### **Uthukuli:**
```
📍 Location: Uthukuli, Tamil Nadu
🗺️ Map Type: Street View
👁️ View: 360° panoramic view
📐 Coordinates: 11.135862, 77.449924
```

---

## 📁 **Files Created**

1. ✅ `UPDATE_TIRUPUR_MAP.sql` - Tirupur directions map
2. ✅ `UPDATE_UTHUKULI_MAP.sql` - Uthukuli street view
3. ✅ `UPDATE_BOTH_MAPS.sql` - Both updates in one file

---

## ✅ **Verification Query**

After running the SQL, verify:
```sql
SELECT 
    branch_id,
    google_maps_lat,
    google_maps_lng,
    CASE 
        WHEN google_maps_embed_url LIKE '%6m8%' THEN 'Street View'
        WHEN google_maps_embed_url LIKE '%!4m13!3e6%' THEN 'Directions'
        ELSE 'Location Pin'
    END as map_type,
    CHAR_LENGTH(google_maps_embed_url) as url_length
FROM branch_contact_info 
WHERE branch_id IN ('tirupur', 'uthukuli');
```

**Expected Output:**
```
+------------+-------------+-------------+-------------+------------+
| branch_id  | lat         | lng         | map_type    | url_length |
+------------+-------------+-------------+-------------+------------+
| tirupur    | 11.1123659  | 77.3232811  | Directions  | 450+       |
| uthukuli   | 11.135862   | 77.449924   | Street View | 150+       |
+------------+-------------+-------------+-------------+------------+
```

---

## 🎯 **Benefits**

### **Before:**
- ❌ Simple location pins
- ❌ Generic map view
- ❌ Same experience for both

### **After:**
- ✅ Tirupur: Helpful directions from station
- ✅ Uthukuli: Immersive street view
- ✅ Different experiences per branch
- ✅ Better user engagement
- ✅ More professional appearance

---

## 🚨 **Important Notes**

1. **Embed URLs take priority over lat/lng**
   - If embed URL is set, it's used
   - If not set, falls back to lat/lng coordinates

2. **Both methods work together**
   - Coordinates are still saved
   - Backup if embed URL fails
   - Used for other features

3. **Easy to update**
   - Via admin panel
   - Or via SQL
   - No code changes needed

---

## ✅ **Summary**

**Updated:**
- ✅ Tirupur: Directions map from railway station
- ✅ Uthukuli: Street View of school

**How to Apply:**
```bash
mysql -u root -p annai_school < UPDATE_BOTH_MAPS.sql
```

**Test:**
- Visit /contact for each branch
- See different map experiences

**Status**: ✅ **READY TO DEPLOY!**

**Run the SQL and your maps are live!** 🗺️✨
