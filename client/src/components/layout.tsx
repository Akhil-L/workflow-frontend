import { Link, useLocation } from "wouter";
import { useStore } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  GraduationCap, 
  CreditCard, 
  LogOut, 
  Bell,
  Menu,
  X,
  ChevronRight,
  Globe,
  Shield,
  Briefcase,
  User
} from "lucide-react";
import { useState } from "react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { currentUser, logout, notifications, markNotificationRead } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => n.userId === currentUser?.id && !n.read).length;

  const navItems = currentUser?.role === 'admin' 
    ? [{ label: "Admin Portal", href: "/admin", icon: Shield }]
    : currentUser?.role === 'client'
    ? [{ label: "Client Portal", href: "/client", icon: Briefcase }]
    : [
        { label: "Work Hub", href: "/dashboard", icon: LayoutDashboard },
        { label: "Academy", href: "/training", icon: GraduationCap },
        { label: "Earnings", href: "/payouts", icon: CreditCard },
        { label: "My Profile", href: "/profile", icon: User },
      ];

  const publicLinks = [
    { label: "For Businesses", href: "/businesses" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const handleLogout = async () => {
    try {
      await fetch("https://workflow-backend-mdfx.onrender.com/api/logout", {
        method: "POST",
        credentials: "include"
      });
    } catch (error) {
      console.error("Logout request failed:", error);
    }
    logout();
    setLocation("/auth");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Premium Navbar */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-11 w-11 bg-gradient-to-tr from-blue-700 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-all duration-300 group-hover:rotate-3">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-heading font-black tracking-tight text-slate-900 leading-none">LEXINGTON</span>
                <span className="text-[10px] font-bold text-blue-600 tracking-[0.25em] uppercase mt-1">Global Systems</span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-2">
              {publicLinks.map(link => (
                <Link key={link.href} href={link.href}>
                  <Button variant="ghost" className="text-slate-600 font-bold hover:text-blue-600 hover:bg-blue-50/50 rounded-xl px-4 transition-all">
                    {link.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-5">
            {currentUser ? (
              <>
                <div className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50">
                  {navItems.map(item => (
                    <Link key={item.href} href={item.href}>
                      <Button 
                        variant={location === item.href ? "secondary" : "ghost"} 
                        className={`gap-2 h-10 px-5 rounded-xl font-bold transition-all duration-300 ${location === item.href ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'}`}
                      >
                        <item.icon className={`h-4 w-4 ${location === item.href ? 'text-blue-600' : 'text-slate-400'}`} /> {item.label}
                      </Button>
                    </Link>
                  ))}
                </div>

                <div className="flex items-center gap-3 border-l border-slate-200 pl-5 ml-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="relative h-11 w-11 rounded-2xl bg-slate-100/50 hover:bg-blue-50 border border-slate-200/50 transition-all">
                        <Bell className="h-5 w-5 text-slate-600" />
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 h-5 w-5 bg-blue-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                            {unreadCount}
                          </span>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80 p-3 rounded-2xl shadow-2xl border-slate-200/60 glass-card">
                      <div className="flex items-center justify-between px-3 py-2 mb-2">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Notifications</span>
                        {unreadCount > 0 && <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">New</span>}
                      </div>
                      <DropdownMenuSeparator className="bg-slate-100 mb-2" />
                      {notifications.filter(n => n.userId === currentUser.id).length === 0 ? (
                        <div className="py-12 flex flex-col items-center gap-3 text-slate-400">
                          <Bell className="h-8 w-8 opacity-20" />
                          <p className="text-sm font-medium italic">All caught up</p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {notifications.filter(n => n.userId === currentUser.id).slice(0, 5).map(n => (
                            <DropdownMenuItem key={n.id} className="p-3 rounded-xl flex flex-col items-start gap-1 cursor-pointer hover:bg-blue-50/50 focus:bg-blue-50 transition-all" onClick={() => markNotificationRead(n.id)}>
                              <div className="flex justify-between w-full items-start">
                                <span className={`font-bold text-sm ${n.read ? 'text-slate-700' : 'text-blue-700'}`}>{n.title}</span>
                                {!n.read && <span className="h-2 w-2 bg-blue-500 rounded-full mt-1.5 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>}
                              </div>
                              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{n.message}</p>
                            </DropdownMenuItem>
                          ))}
                        </div>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="gap-3 h-11 pl-2 pr-4 rounded-2xl hover:bg-slate-100/50 border border-transparent hover:border-slate-200/50 transition-all group">
                        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-blue-500/20 group-hover:rotate-6 transition-transform">
                          {currentUser.name[0]}
                        </div>
                        <div className="hidden md:flex flex-col items-start">
                          <span className="text-sm font-bold text-slate-900 leading-none">{currentUser.name}</span>
                          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1 opacity-70">{currentUser.role}</span>
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 p-3 rounded-2xl shadow-2xl border-slate-200/60 glass-card">
                      <div className="px-4 py-3 flex flex-col bg-slate-50 rounded-xl mb-2">
                        <span className="text-sm font-black text-slate-900">{currentUser.name}</span>
                        <span className="text-xs font-medium text-slate-500 truncate">{currentUser.email}</span>
                      </div>
                      <DropdownMenuSeparator className="bg-slate-100 mb-2" />
                      {currentUser.role === 'worker' && (
                        <DropdownMenuItem className="font-bold cursor-pointer p-3 rounded-xl transition-colors" onClick={() => setLocation("/profile")}>
                          <User className="h-4 w-4 mr-3" /> View Profile
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-red-600 font-bold focus:bg-red-50 focus:text-red-600 cursor-pointer p-3 rounded-xl transition-colors" onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-3" /> Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <Button variant="ghost" size="icon" className="md:hidden h-11 w-11 rounded-2xl bg-slate-100/50" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                  {isMobileMenuOpen ? <X /> : <Menu />}
                </Button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link href="/auth">
                  <Button variant="ghost" className="font-bold text-slate-600">Login</Button>
                </Link>
                <Link href="/auth?tab=register">
                  <Button className="bg-blue-600 hover:bg-blue-500 font-bold shadow-lg shadow-blue-200">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 p-4 space-y-2">
          {navItems.map(item => (
            <Link key={item.href} href={item.href}>
              <Button variant="ghost" className="w-full justify-start gap-3 h-12 font-bold" onClick={() => setIsMobileMenuOpen(false)}>
                <item.icon className="h-5 w-5" /> {item.label}
              </Button>
            </Link>
          ))}
          <DropdownMenuSeparator />
          {publicLinks.map(link => (
            <Link key={link.href} href={link.href}>
              <Button variant="ghost" className="w-full justify-start h-12 font-bold" onClick={() => setIsMobileMenuOpen(false)}>
                {link.label}
              </Button>
            </Link>
          ))}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Corporate Footer */}
      <footer className="bg-slate-900 text-white pt-20 pb-12 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <Globe className="h-8 w-8 text-blue-500" />
                <span className="text-2xl font-heading font-black tracking-tight uppercase">Lexington Global</span>
              </div>
              <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                Enterprise-grade data processing and verification systems for the modern global economy. Certified accuracy at scale.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase text-sm tracking-widest">Platform</h4>
              <ul className="space-y-4 text-slate-400 font-medium">
                <li><Link href="/businesses" className="hover:text-blue-400 transition-colors">For Businesses</Link></li>
                <li><Link href="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact Support</Link></li>
                <li><Link href="/auth?tab=register" className="hover:text-blue-400 transition-colors">Apply as Specialist</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase text-sm tracking-widest">Legal</h4>
              <ul className="space-y-4 text-slate-400 font-medium">
                <li><Link href="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/payout-policy" className="hover:text-blue-400 transition-colors">Payout Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
            <p>© 2026 Lexington Global Systems. All rights reserved.</p>
            <div className="flex gap-8">
              <span className="flex items-center gap-2"><Shield className="h-4 w-4" /> Bank-Grade Security</span>
              <span className="flex items-center gap-2"><Globe className="h-4 w-4" /> Global Infrastructure</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
