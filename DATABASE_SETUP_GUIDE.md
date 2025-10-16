# Database Setup Guide - Annai School Management System

## Overview

This guide will help you migrate from the current file-based database system to a proper PostgreSQL database using Prisma ORM. The new database schema is designed to be fully compatible with your existing frontend code while providing better performance, data integrity, and scalability.

## Prerequisites

Before starting, ensure you have:
- Node.js (v18 or higher)
- PostgreSQL database server
- Access to your current project files

## Step 1: Environment Setup

### 1.1 Copy Environment File
```bash
cp env.example .env
```

### 1.2 Configure Database Connection
Edit your `.env` file and update the database URL:

```env
# For PostgreSQL (recommended)
DATABASE_URL="postgresql://username:password@localhost:5432/annai_school_db"

# For MySQL (alternative)
# DATABASE_URL="mysql://username:password@localhost:3306/annai_school_db"

# For SQLite (development only)
# DATABASE_URL="file:./dev.db"
```

### 1.3 Configure Other Settings
Update the following in your `.env` file:
```env
NEXTAUTH_SECRET="your-secure-random-string-here"
NEXTAUTH_URL="http://localhost:3000"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

## Step 2: Install Dependencies

### 2.1 Install New Dependencies
```bash
npm install @prisma/client prisma
```

### 2.2 Install All Dependencies
```bash
npm install
```

## Step 3: Database Setup

### 3.1 Generate Prisma Client
```bash
npm run db:generate
```

### 3.2 Create Database (if it doesn't exist)
For PostgreSQL:
```sql
CREATE DATABASE annai_school_db;
```

### 3.3 Push Schema to Database
```bash
npm run db:push
```

### 3.4 Seed Initial Data
```bash
npm run db:seed
```

## Step 4: Data Migration (From JSON Files)

### 4.1 Backup Current Data
First, backup your existing JSON files:
```bash
mkdir backup
cp -r data/ backup/
```

### 4.2 Create Migration Script
Create `scripts/migrate-data.ts`:

```typescript
import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import { join } from 'path'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function migrateData() {
  console.log('🔄 Starting data migration...')

  // Migrate profiles
  try {
    const profilesData = JSON.parse(readFileSync(join(process.cwd(), 'data/profiles.json'), 'utf8'))
    
    for (const [email, profile] of Object.entries(profilesData as any)) {
      // Create user if doesn't exist
      const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          email,
          passwordHash: await bcrypt.hash('defaultPassword123', 12),
          role: 'STUDENT',
          status: 'ACTIVE',
          emailVerified: true
        }
      })

      // Create profile
      await prisma.userProfile.upsert({
        where: { userId: user.id },
        update: {
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          phone: profile.phone || '',
          dateOfBirth: profile.date_of_birth ? new Date(profile.date_of_birth) : null,
          currentAddress: profile.address || '',
          profilePhoto: profile.profile_photo || null
        },
        create: {
          userId: user.id,
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          phone: profile.phone || '',
          dateOfBirth: profile.date_of_birth ? new Date(profile.date_of_birth) : null,
          currentAddress: profile.address || '',
          profilePhoto: profile.profile_photo || null
        }
      })
    }
    console.log('✅ Profiles migrated')
  } catch (error) {
    console.log('⚠️ No profiles to migrate or error:', error.message)
  }

  // Migrate applications
  try {
    const applicationsData = JSON.parse(readFileSync(join(process.cwd(), 'data/applications.json'), 'utf8'))
    
    for (const [email, application] of Object.entries(applicationsData as any)) {
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) continue

      await prisma.application.upsert({
        where: { applicationId: application.application_id },
        update: {},
        create: {
          applicationId: application.application_id,
          userId: user.id,
          status: application.status?.toUpperCase() || 'SUBMITTED',
          applyingForGrade: application.personal_info?.applyingForGrade || 'Grade 1',
          academicYear: new Date().getFullYear(),
          personalInfo: application.personal_info || {},
          contactInfo: application.contact_info || {},
          parentInfo: application.parent_info || {},
          academicInfo: application.academic_info || {},
          additionalInfo: application.additional_info || {},
          documents: application.documents || {},
          adminNotes: application.notes || '',
          submittedAt: application.submitted_at ? new Date(application.submitted_at) : new Date()
        }
      })

      // Migrate status history
      if (application.status_history) {
        for (const history of application.status_history) {
          await prisma.applicationStatusHistory.create({
            data: {
              applicationId: (await prisma.application.findUnique({ 
                where: { applicationId: application.application_id } 
              }))!.id,
              status: history.status,
              comment: history.comment || '',
              changedBy: (await prisma.user.findFirst({ where: { role: 'ADMIN' } }))!.id,
              changedAt: history.date ? new Date(history.date) : new Date()
            }
          })
        }
      }
    }
    console.log('✅ Applications migrated')
  } catch (error) {
    console.log('⚠️ No applications to migrate or error:', error.message)
  }

  console.log('🎉 Data migration completed!')
}

migrateData()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('❌ Migration failed:', e)
    prisma.$disconnect()
    process.exit(1)
  })
```

### 4.3 Run Migration Script
```bash
npx tsx scripts/migrate-data.ts
```

## Step 5: Update Application Code

### 5.1 Create Prisma Client Instance
Create `lib/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### 5.2 Update Database Functions
Replace the file-based database functions in `lib/database.ts` with Prisma-based ones:

```typescript
import { prisma } from './prisma'
import { Prisma } from '@prisma/client'

// Profile functions
export const profileDb = {
  getProfile: async (email: string) => {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    })
    return user?.profile || null
  },

  upsertProfile: async (email: string, profileData: any) => {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) throw new Error('User not found')

    return await prisma.userProfile.upsert({
      where: { userId: user.id },
      update: {
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        phone: profileData.phone || '',
        dateOfBirth: profileData.dateOfBirth ? new Date(profileData.dateOfBirth) : null,
        currentAddress: profileData.address || '',
        profilePhoto: profileData.profilePhoto || null
      },
      create: {
        userId: user.id,
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        phone: profileData.phone || '',
        dateOfBirth: profileData.dateOfBirth ? new Date(profileData.dateOfBirth) : null,
        currentAddress: profileData.address || '',
        profilePhoto: profileData.profilePhoto || null
      }
    })
  },

  updateProfilePhoto: async (email: string, photoUrl: string) => {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return null

    return await prisma.userProfile.update({
      where: { userId: user.id },
      data: { profilePhoto: photoUrl }
    })
  }
}

// Application functions
export const applicationDb = {
  getApplication: async (email: string) => {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return null

    return await prisma.application.findFirst({
      where: { userId: user.id },
      include: { statusHistory: true }
    })
  },

  createApplication: async (email: string, applicationData: any) => {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) throw new Error('User not found')

    return await prisma.application.create({
      data: {
        applicationId: applicationData.applicationId,
        userId: user.id,
        status: applicationData.status || 'SUBMITTED',
        applyingForGrade: applicationData.applyingForGrade,
        academicYear: applicationData.academicYear || new Date().getFullYear(),
        personalInfo: applicationData.personalInfo || {},
        contactInfo: applicationData.contactInfo || {},
        parentInfo: applicationData.parentInfo || {},
        academicInfo: applicationData.academicInfo || {},
        additionalInfo: applicationData.additionalInfo || {},
        documents: applicationData.documents || {}
      }
    })
  },

  updateApplicationStatus: async (email: string, status: string, comment: string, notes?: string) => {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return null

    const application = await prisma.application.findFirst({
      where: { userId: user.id }
    })
    if (!application) return null

    // Update application
    const updatedApplication = await prisma.application.update({
      where: { id: application.id },
      data: {
        status: status as any,
        adminNotes: notes || application.adminNotes
      }
    })

    // Add status history
    await prisma.applicationStatusHistory.create({
      data: {
        applicationId: application.id,
        status,
        comment,
        changedBy: (await prisma.user.findFirst({ where: { role: 'ADMIN' } }))!.id
      }
    })

    return updatedApplication
  },

  getAllApplications: async () => {
    return await prisma.application.findMany({
      include: {
        user: {
          include: { profile: true }
        },
        statusHistory: true
      }
    })
  },

  deleteApplication: async (email: string) => {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return false

    const application = await prisma.application.findFirst({
      where: { userId: user.id }
    })
    if (!application) return false

    await prisma.application.delete({
      where: { id: application.id }
    })
    return true
  }
}
```

## Step 6: Testing

### 6.1 Start Development Server
```bash
npm run dev
```

### 6.2 Test Key Features
1. **User Authentication**: Try logging in with admin credentials
2. **Profile Management**: Test profile photo upload and data updates
3. **Application System**: Submit a test application
4. **Admin Functions**: Test application review and status updates

### 6.3 Open Prisma Studio (Optional)
```bash
npm run db:studio
```
This opens a web interface to view and edit your database data.

## Step 7: Production Deployment

### 7.1 Environment Variables
Set these environment variables in your production environment:
```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://your-domain.com"
```

### 7.2 Deploy Database Schema
```bash
npm run db:migrate:deploy
```

### 7.3 Seed Production Data
```bash
npm run db:seed
```

## Troubleshooting

### Common Issues

#### 1. Connection Errors
- Verify database credentials in `.env`
- Ensure database server is running
- Check firewall settings

#### 2. Migration Errors
- Ensure database is empty before first migration
- Check for conflicting data types
- Verify user permissions

#### 3. Seed Errors
- Check if admin user already exists
- Verify required fields are provided
- Check for unique constraint violations

#### 4. Application Errors
- Clear Next.js cache: `rm -rf .next`
- Regenerate Prisma client: `npm run db:generate`
- Check console for detailed error messages

### Useful Commands

```bash
# Reset database (WARNING: Deletes all data)
npm run db:reset

# View database schema
npx prisma db pull

# Format Prisma schema
npx prisma format

# Validate Prisma schema
npx prisma validate

# Generate migration from schema changes
npx prisma migrate dev --name your-migration-name
```

## Performance Optimization

### 1. Database Indexes
The schema includes optimized indexes for common queries. Monitor query performance and add additional indexes as needed.

### 2. Connection Pooling
For production, consider using connection pooling:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/annai_school_db?connection_limit=20&pool_timeout=20"
```

### 3. Query Optimization
Use Prisma's `include` and `select` options to fetch only required data:
```typescript
const user = await prisma.user.findUnique({
  where: { email },
  select: {
    id: true,
    email: true,
    profile: {
      select: {
        firstName: true,
        lastName: true,
        profilePhoto: true
      }
    }
  }
})
```

## Backup and Recovery

### 1. Database Backup
```bash
# PostgreSQL
pg_dump annai_school_db > backup.sql

# Restore
psql annai_school_db < backup.sql
```

### 2. Schema Backup
```bash
# Export current schema
npx prisma db pull --print > schema-backup.prisma
```

## Next Steps

After successful migration:

1. **Remove old files**: Archive or remove JSON data files
2. **Update documentation**: Update API documentation
3. **Monitor performance**: Set up database monitoring
4. **Plan backups**: Implement automated backup strategy
5. **Security review**: Review database security settings

## Support

If you encounter issues during migration:

1. Check the troubleshooting section above
2. Review Prisma documentation: https://www.prisma.io/docs
3. Check application logs for detailed error messages
4. Ensure all environment variables are correctly set

The new database system provides better performance, data integrity, and scalability while maintaining full compatibility with your existing frontend code.
