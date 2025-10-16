'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import AdminSidebar from '@/components/admin/optimized-sidebar'

export default function TestStatusPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userEmail, setUserEmail] = useState('')
  const [applicationStatus, setApplicationStatus] = useState('')
  const [comment, setComment] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session || session.user.role !== "admin") {
    router.push("/auth/signin")
    return null
  }

  const handleUpdateStatus = async () => {
    if (!userEmail || !applicationStatus) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsUpdating(true)
    try {
      const response = await fetch('/api/admin/update-application-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail,
          status: applicationStatus,
          comment: comment || `Status updated to ${applicationStatus} by admin`
        })
      })

      const result = await response.json()

      if (result.success) {
        toast.success(`Application status updated to ${applicationStatus}`)
        setUserEmail('')
        setApplicationStatus('')
        setComment('')
      } else {
        toast.error(result.error || 'Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update status')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCreateTestApplication = async () => {
    try {
      const response = await fetch('/api/test-application', {
        method: 'POST'
      })

      const result = await response.json()

      if (result.success) {
        toast.success(`Test application created: ${result.data.applicationId}`)
        setUserEmail(result.data.userEmail)
      } else {
        toast.error(result.error || 'Failed to create test application')
      }
    } catch (error) {
      console.error('Error creating test application:', error)
      toast.error('Failed to create test application')
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Test Application Status Updates</h1>
            
            <div className="space-y-6">
              {/* Create Test Application */}
              <Card>
                <CardHeader>
                  <CardTitle>Create Test Application</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button onClick={handleCreateTestApplication} className="w-full">
                    Create Test Application for Current User
                  </Button>
                </CardContent>
              </Card>

              {/* Update Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Update Application Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="userEmail">User Email</Label>
                    <Input
                      id="userEmail"
                      type="email"
                      placeholder="Enter user email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="status">New Status</Label>
                    <Select value={applicationStatus} onValueChange={setApplicationStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="under_review">Under Review</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="comment">Comment (Optional)</Label>
                    <Textarea
                      id="comment"
                      placeholder="Add a comment about the status change"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </div>

                  <Button 
                    onClick={handleUpdateStatus} 
                    disabled={isUpdating}
                    className="w-full"
                  >
                    {isUpdating ? 'Updating...' : 'Update Status'}
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setApplicationStatus('approved')
                      setComment('Congratulations! Your application has been approved. Welcome to Annai School!')
                    }}
                    className="w-full"
                  >
                    Set to Approved (with welcome message)
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setApplicationStatus('rejected')
                      setComment('We regret to inform you that your application was not successful this time. Please feel free to apply again next year.')
                    }}
                    className="w-full"
                  >
                    Set to Rejected (with message)
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setApplicationStatus('under_review')
                      setComment('Your application is currently being reviewed by our admission committee. We will update you soon.')
                    }}
                    className="w-full"
                  >
                    Set to Under Review
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
