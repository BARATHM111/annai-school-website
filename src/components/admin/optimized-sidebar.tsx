"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { memo } from "react"
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  LogOut,
  GraduationCap,
  Images,
  Newspaper,
  ClipboardList,
  Info,
  BookOpen,
  MessageSquare,
  ImagePlus,
  Briefcase,
  MapPin,
  Home
} from "lucide-react"
import { BranchSwitcher } from "@/components/branch/BranchSwitcher"

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Homepage", href: "/admin/homepage", icon: Home },
  { name: "Applications", href: "/admin/applications", icon: FileText },
  { name: "Students", href: "/admin/students", icon: Users },
  { name: "Careers", href: "/admin/careers", icon: Briefcase },
  { name: "Careers Page", href: "/admin/careers-page", icon: Briefcase },
  { name: "Branches", href: "/admin/branches", icon: Users },
  { name: "About Page", href: "/admin/about", icon: Info },
  { name: "Academics", href: "/admin/academics", icon: BookOpen },
  { name: "Gallery Management", href: "/admin/gallery-management", icon: ImagePlus },
  { name: "News Management", href: "/admin/news", icon: Newspaper },
  { name: "Branch Contact", href: "/admin/branch-contact", icon: MapPin },
  { name: "Contact Messages", href: "/admin/contacts", icon: MessageSquare },
  { name: "Form Fields", href: "/admin/form-fields", icon: FileText },
  { name: "Carousel", href: "/admin/carousel", icon: Images },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

// Memoized navigation item to prevent unnecessary re-renders
const NavItem = memo(({ item, isActive }: { item: typeof navigation[0], isActive: boolean }) => (
  <Link
    href={item.href}
    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive
        ? "bg-blue-600 text-white"
        : "text-gray-300 hover:bg-gray-800 hover:text-white"
      }`}
    prefetch={true}
  >
    <item.icon className="mr-3 h-5 w-5" />
    {item.name}
  </Link>
))
NavItem.displayName = "NavItem"

function AdminSidebar() {
  const pathname = usePathname()

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900">
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b border-gray-800">
        <GraduationCap className="h-8 w-8 text-blue-400" />
        <div className="ml-3">
          <h2 className="text-lg font-semibold text-white">Annai School</h2>
          <p className="text-sm text-gray-400">Admin Portal</p>
        </div>
      </div>

      {/* Branch Switcher */}
      <div className="px-4 py-3 border-b border-gray-800">
        <BranchSwitcher />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2 scroll-smooth scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
        {navigation.map((item) => (
          <NavItem
            key={item.href}
            item={item}
            isActive={pathname === item.href}
          />
        ))}
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t border-gray-800">
        <Button
          onClick={handleSignOut}
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}

// Export memoized version to prevent unnecessary re-renders
export default memo(AdminSidebar)
