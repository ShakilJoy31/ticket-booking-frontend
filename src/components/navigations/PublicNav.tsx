'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import navbarLogo from '../../../public/The_Logo/linuxeon_logo.png';
import { Button } from '@/components/ui/button';
import {
  Compass,
  Menu,
  MessageSquare,
  Users,
  X,
  Sparkles,
  Globe,
  Shield,
  Award,
  Briefcase,
  CheckCircle,
  ArrowRight,
  Zap,
  ClipboardList,
  TestTube,
  BadgeCheck,
  UserCheck,
  Link2
} from 'lucide-react';
import LanguageSwitcher from '../reusable-components/LanguageSwitcher';
import { getUserInfo } from '@/utils/helper/userFromToken';
import { useGetClientByIdQuery } from '@/redux/api/authentication/authApi';
import FloatingButtons from './FloatingButtons';

const navLinks = [
  {
    name: 'Services',
    path: '/service',
    icon: <Briefcase className='w-4 h-4' />,
    description: 'Explore our solutions',
    dropdownItems: [
      {
        name: 'Management System Certifications',
        path: '/service/management-system-certifications',
        icon: <ClipboardList className='w-4 h-4' />,
        description: 'ISO/IEC 17021 for Management System'
      },
      {
        name: 'Inspections, Testing & Calibration',
        path: '/service/inspections-testing-calibration',
        icon: <TestTube className='w-4 h-4' />,
        description: 'ISO/IEC 17020 & ISO/IEC 17025'
      },
      {
        name: 'Product Certification',
        path: '/service/product-certification',
        icon: <BadgeCheck className='w-4 h-4' />,
        description: 'ISO/IEC 17065 for Product Certification'
      },
      {
        name: 'Personnel Certification',
        path: '/service/personnel-certification',
        icon: <UserCheck className='w-4 h-4' />,
        description: 'ISO/IEC 17024 for Personnel Certification'
      }
    ]
  },
  {
    name: 'Standards',
    path: '/standards',
    icon: <Award className='w-4 h-4' />,
    description: 'Industry benchmarks',
  },
  {
    name: 'Verification',
    path: '/certificate-verification',
    icon: <CheckCircle className='w-4 h-4' />,
    description: 'Verify credentials'
  },
  {
    name: 'Alliance',
    path: '/alliance',
    icon: <Link2 className='w-4 h-4' />,
    description: 'Verify credentials'
  },
  {
    name: 'About',
    path: '/about',
    icon: <Users className='w-4 h-4' />,
    description: 'Our story'
  },
  {
    name: 'Contact',
    path: '/contact',
    icon: <MessageSquare className='w-4 h-4' />,
    description: 'Get in touch'
  }
];

export default function PublicNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userId, setUserId] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data: userData } = useGetClientByIdQuery(userId ? userId : '', {
    skip: !userId
  });

  useEffect(() => {
    const fetchUser = async () => {
      const userInfo = await getUserInfo();
      if (userInfo) {
        setUserId(userInfo.id);
      }
    };
    fetchUser();
  }, [router]);

  if (userData) {
    router.push('/redirect?to=/admin/dashboard');
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        router.push('/login-super-admin');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDropdownEnter = (linkPath: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(linkPath);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const isActiveLink = (linkPath: string) => {
    if (linkPath === '/') return pathname === '/';
    if (linkPath === '/service') {
      return pathname === '/service' || pathname.startsWith('/service/');
    }
    return pathname.startsWith(linkPath);
  };

  const isServiceDropdownActive = () => {
    return pathname.startsWith('/service/') && pathname !== '/service';
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border-b border-gray-100/50'
          : 'bg-white/80 backdrop-blur-md border-b border-gray-100/30'
          }`}
      >
        <div className='max-w-[1400px] mx-auto w-full flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8'>
          {/* Logo */}
          <div
            onClick={() => router.push('/')}
            className='cursor-pointer flex-shrink-0 group relative'
          >
            <div className='relative w-[140px] sm:w-[160px] lg:w-[180px] transition-transform duration-300 group-hover:scale-105'>
              <Image
                src={navbarLogo}
                alt='Linuxeon Logo'
                width={180}
                height={70}
                className='w-full h-auto'
                priority
              />
            </div>
            <div className='absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-300 group-hover:w-full'></div>
          </div>

          {/* Desktop Navigation */}
          <nav className='hidden lg:flex items-center gap-1 xl:gap-2'>
            {navLinks.map((link) => (
              <div
                key={link.path}
                className='relative'
                onMouseEnter={() => handleDropdownEnter(link.path)}
                onMouseLeave={handleDropdownLeave}
              >
                <Link
                  href={link.path}
                  className={`relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${isActiveLink(link.path) || (link.path === '/service' && isServiceDropdownActive())
                    ? 'text-blue-600 bg-blue-50/80 shadow-sm'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
                    }`}
                >
                  <span className='opacity-70'>{link.icon}</span>
                  <span>{link.name}</span>
                  {link?.dropdownItems?.length > 0 && (
                    <svg className="w-3 h-3 ml-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                  {!isActiveLink(link.path) && (
                    <span className='absolute inset-0 rounded-xl scale-95 opacity-0 bg-gradient-to-r from-blue-50/0 to-cyan-50/0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100'></span>
                  )}
                </Link>

                {isActiveLink(link.path) && (
                  <span className='absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full'></span>
                )}

                {/* Services Dropdown Menu */}
                {activeDropdown === link.path && link.dropdownItems && (
                  <div className='absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100/50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200'>
                    <div className='p-3 space-y-1'>
                      {link.dropdownItems.map((item) => (
                        <Link
                          key={item.path}
                          href={item.path}
                          className={`flex items-start gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${pathname === item.path
                            ? 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600'
                            : 'text-gray-700 hover:bg-blue-50/50 hover:text-blue-600'
                            }`}
                        >
                          <span className={`mt-0.5 ${pathname === item.path ? 'text-blue-500' : 'text-gray-400'}`}>
                            {item.icon}
                          </span>
                          <div>
                            <p className="text-sm font-semibold">{item.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop Right Side */}
          <div className='hidden md:flex items-center gap-3 lg:gap-4'>
            <LanguageSwitcher />



            <div className="ai-button group">
              <button
                onClick={() => router.push("/login")}
                className="relative z-10 flex items-center gap-2 cursor-pointer rounded-full bg-white px-6 py-1 text-black font-medium overflow-hidden
    transition-all duration-300
    hover:-translate-y-0.5
    hover:shadow-[0_8px_25px_rgba(66,133,244,0.25)]
    active:translate-y-0
    active:scale-[0.97]"
              >
                {/* Shine Effect */}
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/80 to-transparent group-hover:translate-x-full transition-transform duration-700"></span>

                <Zap className="relative z-10 w-4 h-4 text-blue-600 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />

                <span className="relative z-10">Login</span>
              </button>
            </div>



          </div>

          {/* Mobile Menu Button */}
          <div className='lg:hidden flex items-center gap-3'>
            <LanguageSwitcher />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className='relative p-2 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-300 focus:outline-none'
              aria-label='Toggle menu'
            >
              {isMobileMenuOpen ? (
                <X size={24} className='animate-in spin-in-180 duration-200' />
              ) : (
                <Menu size={24} className='animate-in fade-in duration-200' />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className='lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-100/50 shadow-2xl animate-in slide-in-from-top-2 duration-300 max-h-[80vh] overflow-y-auto'>
            <div className='max-w-[1400px] mx-auto p-4 space-y-1'>
              {navLinks.map((link) => (
                <div key={link.path}>
                  <Link
                    href={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActiveLink(link.path) || (link.path === '/service' && isServiceDropdownActive())
                      ? 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50/80 hover:text-blue-600'
                      }`}
                  >
                    <span className={`opacity-70 ${isActiveLink(link.path) ? 'text-blue-500' : ''}`}>
                      {link.icon}
                    </span>
                    <span>{link.name}</span>
                    {isActiveLink(link.path) && (
                      <Sparkles className='w-4 h-4 text-blue-400 ml-auto' />
                    )}
                  </Link>

                  {/* Mobile Dropdown Items */}
                  {link.dropdownItems && (
                    <div className="ml-8 mt-1 space-y-1 border-l-2 border-blue-100 pl-4">
                      {link.dropdownItems.map((item) => (
                        <Link
                          key={item.path}
                          href={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-start gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${pathname === item.path
                            ? 'text-blue-600 bg-blue-50/50'
                            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/30'
                            }`}
                        >
                          <span className="mt-0.5 text-gray-400">{item.icon}</span>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-gray-400">{item.description}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className='h-px bg-gradient-to-r from-blue-200/50 to-cyan-200/50 my-2'></div>

              <div className='grid grid-cols-2 gap-2 p-2'>
                <Button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    router.push('/login');
                  }}
                  className='bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:shadow-lg transition-all duration-300'
                >
                  Login
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Floating Buttons - WhatsApp & Chatbot */}
      <FloatingButtons />
    </>
  );
}

