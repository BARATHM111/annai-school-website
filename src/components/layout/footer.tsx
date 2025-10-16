import Link from "next/link"
import { GraduationCap, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube, Heart, Award, ArrowRight } from "lucide-react"

const quickLinks = [
  { name: "About Us", href: "/about" },
  { name: "Academics", href: "/#academics-section" },
  { name: "Admissions", href: "/admissions" },
  { name: "Gallery", href: "/gallery" },
  { name: "News & Events", href: "/#news-section" },
]

const importantLinks = [
  { name: "Contact Us", href: "/contact" },
  { name: "Apply Now", href: "/auth/signup" },
  { name: "Admin Portal", href: "/auth/signin" },
  { name: "Student Dashboard", href: "/dashboard" },
]

export default function Footer() {
  return (
    <footer className="bg-[oklch(0.18_0.04_240)] text-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* School Info */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-start space-x-3 mb-4">
              <div className="p-2 bg-accent/20 backdrop-blur-sm rounded-lg">
                <GraduationCap className="h-7 w-7 text-accent" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">Annai Matriculation School</h3>
                <p className="text-sm text-accent font-medium italic">THE FOUNDATION OF YOUR CHILD'S FUTURE</p>
              </div>
            </div>
            
            <div className="pl-0 md:pl-12 space-y-4">
              <p className="text-white/80 leading-relaxed max-w-md">
                A premier educational institution committed to nurturing young minds and building 
                future leaders through quality education with motherly care.
              </p>
              
              <div className="flex items-center gap-2 text-sm">
                <span className="text-white/70 font-medium">LOVE • SERVICE • PURITY</span>
              </div>
            </div>
            
            {/* Contact Info */}
            <div className="mt-6 space-y-3 pl-0 md:pl-12">
              <div className="flex items-start space-x-3 group">
                <div className="p-1.5 bg-white/10 rounded group-hover:bg-accent/20 transition-colors">
                  <MapPin className="h-4 w-4 text-accent flex-shrink-0" />
                </div>
                <span className="text-sm text-white/70 leading-relaxed">
                  ANNAI MATRICULATION SCHOOL<br />
                  Zeebra Garden, College Road,<br />
                  Tirupur - 641 602
                </span>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="p-1.5 bg-white/10 rounded group-hover:bg-accent/20 transition-colors">
                  <Phone className="h-4 w-4 text-accent" />
                </div>
                <a href="tel:9443083242" className="text-sm text-white/70 hover:text-accent transition-colors">
                  94430 83242
                </a>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="p-1.5 bg-white/10 rounded group-hover:bg-accent/20 transition-colors">
                  <Mail className="h-4 w-4 text-accent" />
                </div>
                <a href="mailto:info@annaischool.edu" className="text-sm text-white/70 hover:text-accent transition-colors">
                  info@annaischool.edu
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
              <div className="w-1 h-5 bg-accent rounded-full"></div>
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-accent transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Important Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
              <div className="w-1 h-5 bg-accent rounded-full"></div>
              Important
            </h4>
            <ul className="space-y-2.5">
              {importantLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-accent transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Achievement Badge */}
            <div className="mt-6 p-3 bg-white/5 backdrop-blur-sm border border-accent/20 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Award className="h-4 w-4 text-accent" />
                <p className="text-xs font-bold text-white">25+ Years</p>
              </div>
              <p className="text-xs text-white/60">of Educational Excellence</p>
            </div>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-white/10 mt-10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex space-x-3">
              <Link href="#" className="p-2 bg-white/10 rounded-full hover:bg-accent/20 transition-all group">
                <Facebook className="h-4 w-4 text-white/70 group-hover:text-accent transition-colors" />
              </Link>
              <Link href="#" className="p-2 bg-white/10 rounded-full hover:bg-accent/20 transition-all group">
                <Twitter className="h-4 w-4 text-white/70 group-hover:text-accent transition-colors" />
              </Link>
              <Link href="#" className="p-2 bg-white/10 rounded-full hover:bg-accent/20 transition-all group">
                <Instagram className="h-4 w-4 text-white/70 group-hover:text-accent transition-colors" />
              </Link>
              <Link href="#" className="p-2 bg-white/10 rounded-full hover:bg-accent/20 transition-all group">
                <Youtube className="h-4 w-4 text-white/70 group-hover:text-accent transition-colors" />
              </Link>
            </div>
            <p className="text-sm text-white/50">
              © {new Date().getFullYear()} Annai Matriculation School. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
