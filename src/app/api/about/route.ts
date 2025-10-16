import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { query } from '@/lib/mysql'
import { getBranchFromRequest } from '@/lib/branch-utils'

const defaultContent = {
  title: 'About Our School',
  subtitle: 'Nurturing minds with motherly care since establishment',
  mainContent: `At Annai Matriculation School, we believe our school is "THE FOUNDATION OF YOUR CHILD'S FUTURE". Our motto is "LOVE - SERVICE - PURITY".

The school is being run by professionally qualified and well-experienced promoters having more than twenty years of experience in the field of Child Education, School Education, and training who are committed to leaving a mark in the educational field in twin cities.

Initially, we started the School as Primary School. With our continuous effort and dedication towards education, which was well acknowledged by the parents, today we are running Classes until 10th Standard.

In 10th Standard, we have got 100% Results for the past 6 years. Also, we have got Centum in Social Science for the Academic year 2012. It is the sincere effort from the Management and staff together that we make this a success.`,
  vision: 'To provide quality education with motherly care, nurturing every child to reach their full potential and become responsible citizens of tomorrow.',
  mission: 'To create a learning environment that fosters academic excellence, character development, and holistic growth through innovative teaching methods and personalized attention.',
  facilities: [
    {
      title: 'Computer Lab',
      description: 'Modern computer lab equipped with latest technology to help students develop digital literacy and coding skills.',
      image: '/images/about/computer-lab.jpg',
      visible: true
    },
    {
      title: 'Library',
      description: 'Well-stocked library with a wide collection of books, magazines, and digital resources to foster a love for reading.',
      image: '/images/about/library.jpg',
      visible: true
    },
    {
      title: 'Chemistry Lab',
      description: 'Fully equipped science laboratory where students conduct experiments and explore scientific concepts hands-on.',
      image: '/images/about/chemistry-lab.jpg',
      visible: true
    },
    {
      title: 'Play Area',
      description: 'Safe and spacious playground for physical activities, sports, and recreation to ensure overall development.',
      image: '/images/about/play-area.jpg',
      visible: true
    }
  ],
  timeline: [
    {
      year: '2000',
      title: 'Foundation',
      description: 'Annai Matriculation School was established with a vision to provide quality education with motherly care.',
      visible: true
    },
    {
      year: '2005',
      title: 'Expansion to Primary',
      description: 'Expanded from Pre-KG to Primary classes, welcoming more students into our loving environment.',
      visible: true
    },
    {
      year: '2010',
      title: 'Secondary Education',
      description: 'Extended our services to include secondary education up to 10th Standard.',
      visible: true
    },
    {
      year: '2012',
      title: 'First Centum Achievement',
      description: 'Achieved Centum in Social Science, marking our commitment to academic excellence.',
      visible: true
    },
    {
      year: '2018',
      title: '100% Success Rate',
      description: 'Achieved 100% pass rate in 10th Standard board exams, a record maintained for 6 consecutive years.',
      visible: true
    },
    {
      year: '2025',
      title: 'Today',
      description: 'Continuing our legacy with 1200+ students and 25+ years of educational excellence.',
      visible: true
    }
  ],
  showVision: true,
  showMission: true,
  showTimeline: true
}

// GET - Fetch about content (BRANCH-SPECIFIC)
export async function GET(request: NextRequest) {
  try {
    // Get current branch
    const branchId = getBranchFromRequest(request)
    console.log(`Fetching about content for branch: ${branchId}`)

    // Fetch main about section
    const aboutSections = await query(
      'SELECT * FROM about_sections WHERE branch_id = ?',
      [branchId]
    )

    // Fetch facilities
    const facilities = await query(
      'SELECT * FROM about_facilities WHERE branch_id = ? AND visible = 1 ORDER BY display_order ASC',
      [branchId]
    )

    // Fetch timeline
    const timeline = await query(
      'SELECT * FROM about_timeline WHERE branch_id = ? AND visible = 1 ORDER BY display_order ASC',
      [branchId]
    )

    // If no data exists, return default
    if (!aboutSections || aboutSections.length === 0) {
      return NextResponse.json({
        success: true,
        data: { ...defaultContent, facilities: [], timeline: [] }
      })
    }

    const aboutSection = aboutSections[0]
    const content = {
      title: aboutSection.title,
      subtitle: aboutSection.subtitle,
      mainContent: aboutSection.main_content,
      vision: aboutSection.vision,
      mission: aboutSection.mission,
      showVision: aboutSection.show_vision,
      showMission: aboutSection.show_mission,
      showTimeline: aboutSection.show_timeline,
      facilities: facilities.map((f: any) => ({
        title: f.title,
        description: f.description,
        image: f.image,
        visible: f.visible
      })),
      timeline: timeline.map((t: any) => ({
        year: t.year,
        title: t.title,
        description: t.description,
        visible: t.visible
      }))
    }

    console.log(`✅ Found about content for branch ${branchId}`)

    return NextResponse.json({
      success: true,
      data: content
    })
  } catch (error) {
    console.error('Error fetching about content:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch content' },
      { status: 500 }
    )
  }
}

// PUT - Update about content (Admin only) (BRANCH-SPECIFIC)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Get current branch
    const branchId = getBranchFromRequest(request)
    console.log(`Updating about content for branch: ${branchId}`)

    const body = await request.json()

    // Validate required fields
    if (!body.title?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      )
    }

    // Check if about section exists for this branch
    const existing = await query(
      'SELECT id FROM about_sections WHERE branch_id = ?',
      [branchId]
    )

    if (existing && existing.length > 0) {
      // Update existing
      await query(
        `UPDATE about_sections 
         SET title = ?, subtitle = ?, main_content = ?, vision = ?, mission = ?, 
             show_vision = ?, show_mission = ?, show_timeline = ?, updated_at = NOW()
         WHERE branch_id = ?`,
        [
          body.title,
          body.subtitle || '',
          body.mainContent || '',
          body.vision || '',
          body.mission || '',
          body.showVision !== false,
          body.showMission !== false,
          body.showTimeline !== false,
          branchId
        ]
      )
    } else {
      // Insert new
      await query(
        `INSERT INTO about_sections 
         (id, branch_id, title, subtitle, main_content, vision, mission, show_vision, show_mission, show_timeline) 
         VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          branchId,
          body.title,
          body.subtitle || '',
          body.mainContent || '',
          body.vision || '',
          body.mission || '',
          body.showVision !== false,
          body.showMission !== false,
          body.showTimeline !== false
        ]
      )
    }

    // Update facilities if provided
    if (body.facilities && Array.isArray(body.facilities)) {
      // Delete existing facilities for this branch
      await query('DELETE FROM about_facilities WHERE branch_id = ?', [branchId])
      
      // Insert new facilities
      for (let i = 0; i < body.facilities.length; i++) {
        const facility = body.facilities[i]
        await query(
          `INSERT INTO about_facilities 
           (id, branch_id, title, description, image, display_order, visible) 
           VALUES (UUID(), ?, ?, ?, ?, ?, ?)`,
          [
            branchId,
            facility.title,
            facility.description || '',
            facility.image || '',
            i + 1,
            facility.visible !== false
          ]
        )
      }
    }

    // Update timeline if provided
    if (body.timeline && Array.isArray(body.timeline)) {
      // Delete existing timeline for this branch
      await query('DELETE FROM about_timeline WHERE branch_id = ?', [branchId])
      
      // Insert new timeline
      for (let i = 0; i < body.timeline.length; i++) {
        const item = body.timeline[i]
        await query(
          `INSERT INTO about_timeline 
           (id, branch_id, year, title, description, display_order, visible) 
           VALUES (UUID(), ?, ?, ?, ?, ?, ?)`,
          [
            branchId,
            item.year,
            item.title,
            item.description || '',
            i + 1,
            item.visible !== false
          ]
        )
      }
    }

    console.log(`✅ About content updated for branch ${branchId}`)

    return NextResponse.json({
      success: true,
      message: 'Content updated successfully'
    })
  } catch (error) {
    console.error('Error updating about content:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update content' },
      { status: 500 }
    )
  }
}
