import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { query } from "./mysql"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        identifier: { label: "Email/Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          return null
        }

        try {
          const identifier = credentials.identifier.toLowerCase()
          
          // Check if identifier contains '@' to determine if it's email (for admin)
          const isEmail = identifier.includes('@')
          
          // Check for admin user (admins use email)
          if (isEmail && identifier === 'admin@annaischool.edu') {
            // Hardcoded admin for now
            const isValidPassword = credentials.password === 'admin123'
            if (isValidPassword) {
              return {
                id: 'admin-1',
                email: identifier,
                name: 'School Administrator',
                role: 'admin',
              }
            }
          }
          
          // Check for student in database (student_application_form table)
          // Students use username, not email
          const students = await query(
            `SELECT id, applicationId, studentName, parentName, phoneNumber, username, password, status
             FROM student_application_form
             WHERE username = ?`,
            [identifier]
          )

          if (students && students.length > 0) {
            const student = students[0]
            
            // Verify password (if password field exists)
            if (student.password) {
              const isValidPassword = await bcrypt.compare(credentials.password, student.password)
              
              if (isValidPassword) {
                return {
                  id: student.id,
                  email: student.phoneNumber + '@student.annaischool.edu', // Use phone as email placeholder
                  name: student.studentName,
                  role: 'student',
                  username: student.username,
                }
              }
            }
          }

        } catch (error) {
          console.error('Auth error:', error)
        }

        return null
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.username = user.username
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.username = token.username as string
      }
      return session
    }
  }
}
