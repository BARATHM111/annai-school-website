// MySQL implementation supporting both classic mysql and mysql2 packages
let mysql: any = null
let isClassicMySQL = false

// Try to import mysql first, then mysql2, fall back to mock if neither available
try {
  const mysqlClassic = require('mysql')
  console.log('✅ MySQL (classic) loaded successfully')
  isClassicMySQL = true

  // Create a promise-based wrapper for classic mysql
  mysql = {
    createPool: (config: any) => {
      const pool = mysqlClassic.createPool({
        ...config,
        acquireTimeout: config.acquireTimeout || 60000,
        timeout: config.timeout || 60000,
        reconnect: config.reconnect !== false
      })

      return {
        execute: (sql: string, params: any[] = []) => {
          return new Promise((resolve, reject) => {
            pool.query(sql, params, (error: any, results: any, fields: any) => {
              if (error) {
                console.error('MySQL query error:', error)
                reject(error)
              } else {
                resolve([results, fields])
              }
            })
          })
        },

        getConnection: () => {
          return new Promise((resolve, reject) => {
            pool.getConnection((error: any, connection: any) => {
              if (error) {
                reject(error)
              } else {
                // Wrap connection methods to be promise-based
                const wrappedConnection = {
                  execute: (sql: string, params: any[] = []) => {
                    return new Promise((res, rej) => {
                      connection.query(sql, params, (err: any, results: any, fields: any) => {
                        if (err) rej(err)
                        else res([results, fields])
                      })
                    })
                  },
                  beginTransaction: () => new Promise((res, rej) => {
                    connection.beginTransaction((err: any) => err ? rej(err) : res(undefined))
                  }),
                  commit: () => new Promise((res, rej) => {
                    connection.commit((err: any) => err ? rej(err) : res(undefined))
                  }),
                  rollback: () => new Promise((res, rej) => {
                    connection.rollback((err: any) => err ? rej(err) : res(undefined))
                  }),
                  release: () => connection.release()
                }
                resolve(wrappedConnection)
              }
            })
          })
        },

        end: () => new Promise((resolve) => {
          pool.end(() => resolve(undefined))
        })
      }
    }
  }
} catch (error) {
  console.warn('⚠️ MySQL not installed - using mock database functions')
  console.warn('   Install mysql for production: npm install mysql')
  mysql = null
}

// Parse DATABASE_URL for connection config
function parseDatabaseUrl(url: string) {
  const match = url.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/)
  if (!match) {
    throw new Error('Invalid DATABASE_URL format')
  }

  return {
    host: match[3],
    port: parseInt(match[4]),
    user: match[1],
    password: match[2],
    database: match[5]
  }
}

// Database connection configuration
// Supports DATABASE_URL, Railway variables (MYSQLHOST, etc.), and custom variables (DB_HOST, etc.)
const dbConfig = process.env.DATABASE_URL
  ? parseDatabaseUrl(process.env.DATABASE_URL)
  : {
    host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT || '3306'),
    user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
    database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'annai_school'
  }

// Add connection pool settings
const poolConfig = {
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
}

// Create connection pool
const pool = mysql ? mysql.createPool(poolConfig) : null

// Database connection utility
export class Database {
  private static instance: Database
  private pool: any

  private constructor() {
    this.pool = pool
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }

  // Execute query with parameters
  async query(sql: string, params: any[] = []): Promise<any> {
    if (!this.pool) {
      console.warn('Database not connected - returning empty result')
      return []
    }
    try {
      const [rows] = await this.pool.execute(sql, params)
      return rows
    } catch (error) {
      console.error('Database query error:', error)
      throw error
    }
  }

  // Execute query and return first row
  async queryOne(sql: string, params: any[] = []): Promise<any> {
    const rows = await this.query(sql, params)
    return Array.isArray(rows) && rows.length > 0 ? rows[0] : null
  }

  // Execute insert and return inserted ID
  async insert(sql: string, params: any[] = []): Promise<string> {
    if (!this.pool) {
      console.warn('Database not connected - returning mock ID')
      return Date.now().toString()
    }
    try {
      const [result] = await this.pool.execute(sql, params) as any
      // Handle both classic mysql and mysql2 result formats
      const insertId = result.insertId || result.insertId?.toString() || Date.now().toString()
      return insertId.toString()
    } catch (error) {
      console.error('Database insert error:', error)
      throw error
    }
  }

  // Execute update/delete and return affected rows
  async execute(sql: string, params: any[] = []): Promise<number> {
    if (!this.pool) {
      console.warn('Database not connected - returning 0 affected rows')
      return 0
    }
    try {
      const [result] = await this.pool.execute(sql, params) as any
      return result.affectedRows
    } catch (error) {
      console.error('Database execute error:', error)
      throw error
    }
  }

  // Begin transaction
  async beginTransaction(): Promise<any> {
    if (!this.pool) {
      console.warn('Database not connected - returning mock connection')
      return { commit: async () => { }, rollback: async () => { }, release: () => { } }
    }
    const connection = await this.pool.getConnection()
    await connection.beginTransaction()
    return connection
  }

  // Commit transaction
  async commitTransaction(connection: any): Promise<void> {
    await connection.commit()
    connection.release()
  }

  // Rollback transaction
  async rollbackTransaction(connection: any): Promise<void> {
    await connection.rollback()
    connection.release()
  }

  // Close connection pool
  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end()
    }
  }
}

// Export singleton instance
export const db = Database.getInstance()

// Export standalone query function for convenience
export async function query(sql: string, params: any[] = []): Promise<any> {
  return await db.query(sql, params)
}

// Helper functions for your existing database schema
export const dbHelpers = {
  // Generate application ID
  generateApplicationId(): string {
    const year = new Date().getFullYear()
    const random = Math.random().toString(36).substr(2, 6).toUpperCase()
    return `APP${year}${random}`
  },

  // Generate unique ID
  generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
  },

  // Admin functions
  async getAdminByEmail(email: string): Promise<any> {
    if (!mysql) {
      // Mock admin for development
      if (email === 'admin@annaischool.edu') {
        return {
          id: 'admin-1',
          name: 'School Administrator',
          email: 'admin@annaischool.edu',
          password: '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // hashed 'admin123'
          role: 'admin'
        }
      }
      return null
    }
    return await db.queryOne(
      'SELECT * FROM admin WHERE email = ?',
      [email]
    )
  },

  async createAdmin(data: { name: string; email: string; password: string }): Promise<string> {
    const id = this.generateId()
    await db.insert(
      'INSERT INTO admin (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [id, data.name, data.email, data.password, 'admin']
    )
    return id
  },

  // Student/Application functions (using your existing student table)
  async getStudentByEmail(email: string): Promise<any> {
    if (!mysql) {
      // Mock student data for development
      return null
    }
    return await db.queryOne(
      'SELECT * FROM student_application_form WHERE email = ?',
      [email]
    )
  },

  async getStudentByUsername(username: string): Promise<any> {
    if (!mysql) {
      // Mock student data for development
      return null
    }
    return await db.queryOne(
      'SELECT * FROM student_application_form WHERE username = ?',
      [username]
    )
  },

  async getStudentByApplicationId(applicationId: string): Promise<any> {
    return await db.queryOne(
      'SELECT * FROM student_application_form WHERE applicationId = ?',
      [applicationId]
    )
  },

  async getAllStudents(): Promise<any[]> {
    return await db.query('SELECT * FROM student_application_form ORDER BY appliedAt DESC')
  },

  async createApplication(data: any): Promise<{ id: string; applicationId: string }> {
    const id = this.generateId()
    const applicationId = this.generateApplicationId()

    await db.insert(`
      INSERT INTO student_application_form (
        id, applicationId, firstName, middleName, lastName, dateOfBirth, gender,
        bloodGroup, nationality, religion, category, photoUrl, email, mobile,
        alternateMobile, currentAddress, permanentAddress, fatherName, fatherOccupation,
        fatherMobile, fatherEmail, motherName, motherOccupation, motherMobile, motherEmail,
        guardianName, guardianContact, previousSchool, previousClass, board, applyingForGrade,
        previousPercentage, transferCertUrl, birthCertUrl, marksheetUrl, specialNeeds,
        interests, hearAboutUs, status, notes, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, applicationId, data.firstName, data.middleName || null, data.lastName,
      data.dateOfBirth, data.gender, data.bloodGroup || null, data.nationality,
      data.religion || null, data.category, data.photoUrl || null, data.email,
      data.mobile, data.alternateMobile || null, data.currentAddress, data.permanentAddress,
      data.fatherName, data.fatherOccupation, data.fatherMobile, data.fatherEmail,
      data.motherName, data.motherOccupation, data.motherMobile, data.motherEmail,
      data.guardianName || null, data.guardianContact || null, data.previousSchool,
      data.previousClass, data.board, data.applyingForGrade, data.previousPercentage || null,
      data.transferCertUrl || null, data.birthCertUrl || null, data.marksheetUrl || null,
      data.specialNeeds || null, data.interests || null, data.hearAboutUs || null,
      'pending', data.notes || null, new Date()
    ])

    return { id, applicationId }
  },

  async updateApplicationStatus(applicationId: string, status: string, notes?: string): Promise<number> {
    return await db.execute(
      'UPDATE student_application_form SET status = ?, notes = ?, updatedAt = ? WHERE applicationId = ?',
      [status, notes || null, new Date(), applicationId]
    )
  },

  async deleteApplication(applicationId: string): Promise<number> {
    return await db.execute(
      'DELETE FROM student_application_form WHERE applicationId = ?',
      [applicationId]
    )
  },

  // News/Events functions
  async getAllNews(): Promise<any[]> {
    return await db.query('SELECT * FROM newsevent ORDER BY date DESC')
  },

  async getPublishedNews(): Promise<any[]> {
    return await db.query('SELECT * FROM newsevent WHERE published = 1 ORDER BY date DESC')
  },

  async createNews(data: { title: string; description: string; category: string; imageUrl?: string; date: Date }): Promise<string> {
    const id = this.generateId()
    await db.insert(
      'INSERT INTO newsevent (id, title, description, category, imageUrl, date, published) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, data.title, data.description, data.category, data.imageUrl || null, data.date, 1]
    )
    return id
  },

  async updateNews(id: string, data: any): Promise<number> {
    return await db.execute(
      'UPDATE newsevent SET title = ?, description = ?, category = ?, imageUrl = ?, date = ?, published = ? WHERE id = ?',
      [data.title, data.description, data.category, data.imageUrl || null, data.date, data.published ? 1 : 0, id]
    )
  },

  async deleteNews(id: string): Promise<number> {
    return await db.execute('DELETE FROM newsevent WHERE id = ?', [id])
  },

  // Announcements functions
  async getAllAnnouncements(): Promise<any[]> {
    return await db.query('SELECT * FROM announcement ORDER BY createdAt DESC')
  },

  async getPublishedAnnouncements(): Promise<any[]> {
    return await db.query('SELECT * FROM announcement WHERE published = 1 ORDER BY createdAt DESC')
  },

  async createAnnouncement(data: { title: string; content: string; published?: boolean }): Promise<string> {
    const id = this.generateId()
    await db.insert(
      'INSERT INTO announcement (id, title, content, published, updatedAt) VALUES (?, ?, ?, ?, ?)',
      [id, data.title, data.content, data.published ? 1 : 0, new Date()]
    )
    return id
  },

  async updateAnnouncement(id: string, data: any): Promise<number> {
    return await db.execute(
      'UPDATE announcement SET title = ?, content = ?, published = ?, updatedAt = ? WHERE id = ?',
      [data.title, data.content, data.published ? 1 : 0, new Date(), id]
    )
  },

  async deleteAnnouncement(id: string): Promise<number> {
    return await db.execute('DELETE FROM announcement WHERE id = ?', [id])
  },

  // User profile functions (using student table)
  async getUserProfile(email: string): Promise<any> {
    const student = await this.getStudentByEmail(email)
    if (!student) return null

    return {
      email: student.email,
      firstName: student.firstName,
      lastName: student.lastName,
      phone: student.mobile,
      profilePhoto: student.photoUrl,
      dateOfBirth: student.dateOfBirth,
      address: student.currentAddress
    }
  },

  async updateUserProfile(email: string, data: any): Promise<number> {
    return await db.execute(
      'UPDATE student SET firstName = ?, lastName = ?, mobile = ?, photoUrl = ?, updatedAt = ? WHERE email = ?',
      [data.firstName, data.lastName, data.phone, data.profilePhoto, new Date(), email]
    )
  }
}

// Error handling utility
export function handleDbError(error: any): Error {
  if (error.code === 'ER_DUP_ENTRY') {
    return new Error('A record with this information already exists')
  }
  if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    return new Error('Referenced record not found')
  }
  if (error.code === 'ER_ROW_IS_REFERENCED_2') {
    return new Error('Cannot delete record - it is referenced by other records')
  }
  return error
}
