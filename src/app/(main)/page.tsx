import { generateDynamicMetadata } from '@/metadata/generateMetadata';
import Link from 'next/link';

export async function generateMetadata() {
  return generateDynamicMetadata({
    title: 'Event Booking System | Dashboard',
    description: 'Manage events and bookings seamlessly with our comprehensive booking system. Create events, track bookings, and monitor seat availability in real-time.',
    keywords: [
      'event booking',
      'event management',
      'booking system',
      'ticket booking',
      'event dashboard',
      'seat reservation',
      'booking management',
      'event calendar',
      'ticket management',
      'event scheduler'
    ]
  });
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden font-sans antialiased">
      {/* Background Orbs */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-float-slow"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-float-delayed"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl py-2 font-extrabold tracking-tight bg-gradient-to-b from-white via-gray-200 to-gray-500 bg-clip-text text-transparent mb-4">
              Event Booking System
            </h1>
            <p className="text-gray-400 text-base md:text-lg flex items-center justify-center gap-2.5 font-medium">
              <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              Centralized Control Panel
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            
            {/* Events Management Card */}
            <Link href="/events" className="group relative block">
              <div className="relative h-full overflow-hidden rounded-xl bg-gray-900/30 backdrop-blur-md p-8 border border-gray-800/80 transition-all duration-300 ease-out group-hover:scale-[1.01] group-hover:border-emerald-500/40 group-hover:bg-gray-900/50 shadow-2xl">
                {/* Micro Ambient Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    {/* Icon & Action Wrapper */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-3.5 bg-gray-900 border border-gray-800 rounded-xl text-emerald-400 group-hover:text-emerald-300 group-hover:border-emerald-500/30 group-hover:bg-emerald-950/20 transition-all duration-300 shadow-inner">
                        <svg className="w-6 h-6 transform group-hover:scale-105 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      
                      {/* Refined Context Arrow */}
                      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 group-hover:text-emerald-400 transition-colors duration-300">
                        <span>Manage</span>
                        <svg className="w-4 h-4 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300 ease-out" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-100 group-hover:text-white transition-colors duration-300 mb-2">
                      Events Management
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                      Create, edit, and orchestrate scheduling frameworks. Configure pricing brackets, track structural capacities, and customize reservations.
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Booking Management Card */}
            <Link href="/bookings" className="group relative block">
              <div className="relative h-full overflow-hidden rounded-xl bg-gray-900/30 backdrop-blur-md p-8 border border-gray-800/80 transition-all duration-300 ease-out group-hover:scale-[1.01] group-hover:border-blue-500/40 group-hover:bg-gray-900/50 shadow-2xl">
                {/* Micro Ambient Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    {/* Icon & Action Wrapper */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-3.5 bg-gray-900 border border-gray-800 rounded-xl text-blue-400 group-hover:text-blue-300 group-hover:border-blue-500/30 group-hover:bg-blue-950/20 transition-all duration-300 shadow-inner">
                        <svg className="w-6 h-6 transform group-hover:scale-105 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                      </div>
                      
                      {/* Refined Context Arrow */}
                      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 group-hover:text-blue-400 transition-colors duration-300">
                        <span>Review</span>
                        <svg className="w-4 h-4 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300 ease-out" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-100 group-hover:text-white transition-colors duration-300 mb-2">
                      Booking Management
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                      Audit transaction logs, verify individual user receipts, filter statuses, and track system confirmations securely in real-time.
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Optimized Animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float-slow {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes float-delayed {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(10px); }
          }
          .animate-float-slow {
            animation: float-slow 10s ease-in-out infinite;
          }
          .animate-float-delayed {
            animation: float-delayed 12s ease-in-out infinite;
          }
        `
      }} />
    </div>
  );
}