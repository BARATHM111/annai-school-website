import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface ApplicationStatus {
  hasApplication: boolean
  status?: 'submitted' | 'pending' | 'under_review' | 'approved' | 'rejected' | 'incomplete'
  applicationId?: string
  submittedAt?: string
  lastUpdated?: string
  isLoading: boolean
  error?: string
}

export function useApplicationStatus(): ApplicationStatus {
  const { data: session } = useSession()
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus>({
    hasApplication: false,
    isLoading: true
  })

  useEffect(() => {
    const checkApplicationStatus = async () => {
      if (!session?.user || session.user.role === 'admin') {
        setApplicationStatus({
          hasApplication: false,
          isLoading: false
        })
        return
      }

      try {
        setApplicationStatus(prev => ({ ...prev, isLoading: true }))
        
        const response = await fetch('/api/student/application-status')
        const result = await response.json()

        if (result.success) {
          // User has an application
          setApplicationStatus({
            hasApplication: true,
            status: result.data.status,
            applicationId: result.data.applicationId,
            submittedAt: result.data.submittedAt,
            lastUpdated: result.data.lastUpdated,
            isLoading: false
          })
        } else if (result.error === 'NO_APPLICATION') {
          // User has no application
          setApplicationStatus({
            hasApplication: false,
            isLoading: false
          })
        } else {
          // Other error
          setApplicationStatus({
            hasApplication: false,
            isLoading: false,
            error: result.error || 'Failed to check application status'
          })
        }
      } catch (error) {
        console.error('Error checking application status:', error)
        setApplicationStatus({
          hasApplication: false,
          isLoading: false,
          error: 'Failed to check application status'
        })
      }
    }

    checkApplicationStatus()

    // Listen for application submission events
    const handleApplicationSubmitted = () => {
      checkApplicationStatus()
    }

    window.addEventListener('applicationSubmitted', handleApplicationSubmitted)
    
    return () => {
      window.removeEventListener('applicationSubmitted', handleApplicationSubmitted)
    }
  }, [session])

  return applicationStatus
}
