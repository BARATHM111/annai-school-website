# ✅ Addresses Already Updated in SQL File!

## 📍 **Current Addresses in SQL File**

### **Tirupur Branch** ✅
```
Address: College Rd, Masco Nagar, Shivshakthi Nagar, Kozhi Ponnai Thottam, Tiruppur, Tamil Nadu 641602
Phone: 094430 83242
GPS: 11.1085, 77.3411
```

### **Uthukuli Branch** ✅
```
Address: 4CPX+FX9, Gobichettipalayam - Uthukuli - Kangeyam Rd, Tamil Nadu 638752
Phone: 094430 83242
GPS: 11.071562, 77.349792
```

---

## 🚀 **What You Need to Do**

The SQL file already has the correct addresses! You just need to run it:

### **Option 1: Fresh Install (If table doesn't exist)**
```bash
mysql -u root -p annai_school < sql/create_branch_contact_info.sql
```

### **Option 2: Update Existing Data**
If the table already exists, run this to update:

```sql
-- Update Tirupur address
UPDATE branch_contact_info 
SET address = 'College Rd, Masco Nagar, Shivshakthi Nagar, Kozhi Ponnai Thottam, Tiruppur, Tamil Nadu 641602',
    city = 'Tiruppur',
    pincode = '641602',
    google_maps_lat = 11.1085,
    google_maps_lng = 77.3411
WHERE branch_id = 'tirupur';

-- Update Uthukuli address
UPDATE branch_contact_info 
SET address = '4CPX+FX9, Gobichettipalayam - Uthukuli - Kangeyam Rd, Tamil Nadu 638752',
    city = 'Uthukuli',
    pincode = '638752',
    google_maps_lat = 11.071562,
    google_maps_lng = 77.349792
WHERE branch_id = 'uthukuli';
```

---

## 🧪 **Test After Update**

### **1. Verify in Database**
```sql
SELECT branch_id, address, city, pincode, google_maps_lat, google_maps_lng 
FROM branch_contact_info;
```

**Expected Output:**
```
+------------+-----------------------------------------------------------+----------+----------+-----------------+-----------------+
| branch_id  | address                                                   | city     | pincode  | google_maps_lat | google_maps_lng |
+------------+-----------------------------------------------------------+----------+----------+-----------------+-----------------+
| tirupur    | College Rd, Masco Nagar, Shivshakthi Nagar, Kozhi...     | Tiruppur | 641602   | 11.108500       | 77.341100       |
| uthukuli   | 4CPX+FX9, Gobichettipalayam - Uthukuli - Kangeyam Rd...  | Uthukuli | 638752   | 11.071562       | 77.349792       |
+------------+-----------------------------------------------------------+----------+----------+-----------------+-----------------+
```

### **2. Test on Website**

#### **Tirupur:**
```
1. Go to Contact page
2. Switch to Tirupur branch
3. Should see:
   ✅ Address: College Rd, Masco Nagar, Shivshakthi Nagar...
   ✅ Phone: 094430 83242
   ✅ Map showing Tirupur location
```

#### **Uthukuli:**
```
1. Switch to Uthukuli branch
2. Should see:
   ✅ Address: 4CPX+FX9, Gobichettipalayam - Uthukuli...
   ✅ Phone: 094430 83242
   ✅ Map showing Uthukuli location
```

---

## 🗺️ **Test Map Locations**

You can test the GPS coordinates directly:

**Tirupur (11.1085, 77.3411):**
https://www.google.com/maps?q=11.1085,77.3411

**Uthukuli (11.071562, 77.349792):**
https://www.google.com/maps?q=11.071562,77.349792

Open these URLs to verify the locations are correct!

---

## 📝 **Summary**

✅ **Tirupur address**: Already updated in SQL  
✅ **Uthukuli address**: Already updated in SQL  
✅ **GPS coordinates**: Already set for both branches  

**Action Required:**
1. Run the SQL file OR
2. Run the UPDATE queries above

**Then test the Contact page!** 🚀
