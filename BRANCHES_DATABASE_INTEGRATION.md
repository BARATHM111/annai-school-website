# Branches Management System - Database Integration

## ✅ Complete Implementation

I've integrated the branches system with your database! Now you can manage all campus branches from the admin panel.

---

## 📁 Files Created

### 1. **SQL Script**
- `sql/create_branches.sql`
  - Creates `branches` table
  - Inserts Tirupur and Uthukuli campuses

### 2. **API Routes**
- `src/app/api/branches/route.ts` - Public API for fetching enabled branches
- `src/app/api/admin/branches/route.ts` - Admin API for CRUD operations

### 3. **Admin Page**
- `src/app/admin/branches/page.tsx` - Full management interface

### 4. **Updated Files**
- `src/contexts/BranchContext.tsx` - Now fetches from database
- `src/components/branch/BranchSwitcher.tsx` - Uses dynamic branches
- `src/components/admin/optimized-sidebar.tsx` - Added Branches menu

---

## 🗄️ Database Schema

### Table: `branches`

```sql
CREATE TABLE branches (
  id VARCHAR(50) PRIMARY KEY,              -- e.g., 'tirupur', 'uthukuli'
  name VARCHAR(100) NOT NULL,              -- e.g., 'Tirupur Campus'
  display_name VARCHAR(200) NOT NULL,      -- Full name
  address TEXT NOT NULL,                   -- Full address
  phone VARCHAR(20) NOT NULL,              -- Contact number
  email VARCHAR(100) NOT NULL,             -- Branch email
  is_enabled BOOLEAN DEFAULT true,         -- Show in switcher?
  is_default BOOLEAN DEFAULT false,        -- Default campus
  display_order INT DEFAULT 0,             -- Order in list
  logo_url VARCHAR(255),                   -- Branch logo (optional)
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Default Data

| ID | Name | Display Name | Default | Enabled |
|----|------|--------------|---------|---------|
| tirupur | Tirupur Campus | Annai School - Tirupur | ✅ | ✅ |
| uthukuli | Uthukuli Campus | Annai School - Uthukuli | ❌ | ✅ |

---

## 🚀 Installation

### Step 1: Run SQL Script
```bash
mysql -u root -p annai_school < sql/create_branches.sql
```

### Step 2: Verify
```sql
SELECT * FROM branches ORDER BY display_order;
-- Should show 2 rows (Tirupur and Uthukuli)
```

### Step 3: Access Admin
1. Login to admin panel
2. Click **"Branches"** in sidebar
3. Manage campuses!

---

## 💻 Admin Features

### View All Branches
- Card-based layout
- Shows all branch details
- Default branch highlighted
- Enabled/disabled status

### Add New Branch
Click "Add New Branch":
- **Branch ID**: Unique identifier (e.g., 'coimbatore')
- **Branch Name**: Display name
- **Full Display Name**: Complete school name
- **Address**: Full address
- **Phone**: Contact number
- **Email**: Branch email
- **Logo URL**: Optional logo path
- **Display Order**: Position in list
- **Enabled**: Show in switcher
- **Set as Default**: Default campus

### Edit Branch
- Click pencil icon on any branch
- Modify all details
- Branch ID cannot be changed

### Reorder Branches
- Use ↑ ↓ arrows
- Changes display order in switcher

### Set Default Branch
- Click "Set as Default" button
- Only one branch can be default
- Users without saved preference see default

### Enable/Disable
- Click eye icon
- Disabled branches hidden from public switcher
- Still accessible in admin

### Delete Branch
- Click trash icon
- Cannot delete default branch
- Confirmation required

---

## 🔄 How It Works

### Frontend Flow

1. **App Loads** → BranchContext fetches branches from `/api/branches`
2. **User Switches** → Selection saved to localStorage
3. **Page Refresh** → Saved selection restored
4. **New User** → Default branch automatically selected

### Branch Switcher

- Appears in **public navbar** (top right)
- Appears in **admin sidebar** (below logo)
- Shows enabled branches only
- Current branch highlighted with checkmark

### Database Integration

```typescript
// Public API - Returns enabled branches only
GET /api/branches
Response: {
  success: true,
  data: [...branches],
  default: 'tirupur'
}

// Admin API - Full CRUD
GET    /api/admin/branches     // All branches
POST   /api/admin/branches     // Create
PUT    /api/admin/branches     // Update
DELETE /api/admin/branches?id  // Delete
```

---

## 🎯 Features

✅ **Database-Driven** - All branch data from MySQL  
✅ **Dynamic Switcher** - Auto-updates when branches change  
✅ **Default Branch** - Configurable default campus  
✅ **Enable/Disable** - Show/hide without deletion  
✅ **Reordering** - Visual position management  
✅ **Validation** - Prevents deleting default branch  
✅ **Fallback** - Uses hardcoded if database fails  
✅ **Persistent** - localStorage saves user choice  

---

## 📝 API Endpoints

### Public Endpoints

#### GET `/api/branches`
Fetch all enabled branches

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "tirupur",
      "name": "Tirupur Campus",
      "display_name": "Annai Matriculation School - Tirupur",
      "address": "Tirupur, Tamil Nadu",
      "phone": "+91 1234567890",
      "email": "tirupur@annaischool.edu",
      "is_default": true,
      "display_order": 1
    }
  ],
  "default": "tirupur"
}
```

### Admin Endpoints

#### GET `/api/admin/branches`
Fetch all branches (admin only)

#### POST `/api/admin/branches`
Create new branch

**Request:**
```json
{
  "id": "coimbatore",
  "name": "Coimbatore Campus",
  "display_name": "Annai Matriculation School - Coimbatore",
  "address": "Coimbatore, Tamil Nadu",
  "phone": "+91 9876543210",
  "email": "coimbatore@annaischool.edu",
  "is_enabled": true,
  "is_default": false,
  "display_order": 3
}
```

#### PUT `/api/admin/branches`
Update existing branch

#### DELETE `/api/admin/branches?id=coimbatore`
Delete branch (cannot delete default)

---

## 🔐 Security

- ✅ Admin-only access for management
- ✅ Public read-only for branch switcher
- ✅ Parameterized SQL queries
- ✅ Input validation
- ✅ Cannot delete default branch
- ✅ Unique ID enforcement

---

## 🎨 UI Screenshots

### Admin Page Features:
1. **Card Layout** - Each branch in beautiful card
2. **Status Badges** - Default/Enabled/Disabled indicators
3. **Quick Actions** - Edit, Delete, Enable/Disable, Reorder
4. **Icon Indicators** - Building icon, contact details
5. **Responsive** - Works on all screen sizes

### Branch Switcher:
1. **Dropdown Menu** - Clean branch selection
2. **Current Branch** - Highlighted with checkmark
3. **Branch Details** - Name and address shown
4. **Smooth Transitions** - 300ms fade effect

---

## 🧪 Testing

### Test Admin Management
1. ✅ Login as admin
2. ✅ Navigate to Branches
3. ✅ View existing 2 branches
4. ✅ Click "Add New Branch"
5. ✅ Create test branch (e.g., Coimbatore)
6. ✅ Edit a branch
7. ✅ Reorder branches
8. ✅ Toggle enabled/disabled
9. ✅ Set different default branch
10. ✅ Delete test branch

### Test Public Switcher
1. ✅ View homepage
2. ✅ Click branch switcher
3. ✅ See enabled branches only
4. ✅ Switch to different branch
5. ✅ Refresh page - selection persists
6. ✅ Check admin panel shows same selection

---

## 🔄 Migration from Hardcoded

**Before:**
- Branches defined in `lib/branches.ts`
- Hardcoded Tirupur and Uthukuli
- Required code changes to add branches

**After:**
- Branches stored in MySQL database
- Managed via admin panel
- No code changes needed
- Dynamic and scalable

---

## 📊 Database Queries

### Get All Enabled Branches
```sql
SELECT * FROM branches 
WHERE is_enabled = true 
ORDER BY display_order;
```

### Get Default Branch
```sql
SELECT * FROM branches 
WHERE is_default = true 
LIMIT 1;
```

### Update Branch
```sql
UPDATE branches 
SET name = ?, display_name = ?, address = ?, 
    phone = ?, email = ?, is_enabled = ?
WHERE id = ?;
```

### Set New Default
```sql
-- Remove default from all
UPDATE branches SET is_default = false;

-- Set new default
UPDATE branches SET is_default = true WHERE id = ?;
```

---

## 🚨 Important Notes

1. **Branch ID Immutable**: Cannot change after creation
2. **Default Branch**: Must always have one default branch
3. **Cannot Delete Default**: Set another as default first
4. **Fallback System**: Uses hardcoded branches if DB fails
5. **Same Colors**: All branches use same Tailwind theme

---

## 🎯 Benefits

✅ **Centralized Management** - One place to manage all branches  
✅ **No Code Changes** - Add branches via admin panel  
✅ **Scalable** - Support unlimited branches  
✅ **User-Friendly** - Easy branch switching  
✅ **Consistent UI** - Same design for all branches  
✅ **Database-Driven** - Single source of truth  

---

## 📞 Next Steps

### Optional Enhancements

1. **Branch-Specific Data**
   - Add `branch_id` to tables
   - Filter data by current branch
   - Branch-specific admissions

2. **Branch Logo Upload**
   - File upload for branch logos
   - Display in switcher

3. **Branch Settings**
   - Per-branch configurations
   - Custom contact forms
   - Branch-specific features

---

**Status**: ✅ **Complete & Production Ready**  
**Installation**: Run SQL script and you're done!  
**Management**: Admin → Branches

🎉 **Your branches system is fully database-integrated!**
