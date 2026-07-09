'use client';

import {
  FaLinkedinIn,
  FaFacebookF,
  FaTwitter,
  FaGlobe,
  FaChevronRight,
  FaTimes
} from 'react-icons/fa';
import { MdLocationOn, MdEmail } from 'react-icons/md';
import Image from 'next/image';
import siteLogo from '../../../public/The_Logo/linuxeon_logo.png';
import Paragraph from '../reusable-components/Paragraph';
import Heading from '../reusable-components/Heading';
import Link from 'next/link';
import { useState } from 'react';
import { useSubscribeEmailMutation } from '@/redux/api/communication/emailSubscriptionApi';
import { toast } from 'react-hot-toast';
import { Loader2, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { standardsData } from '@/utils/constant/standards';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subscribeEmail, { isLoading }] = useSubscribeEmailMutation();
  const router = useRouter();

  // Show only 6 standards in footer
  const displayedStandards = standardsData.slice(0, 6);
  const hasMoreStandards = standardsData.length > 6;

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      const response = await subscribeEmail({ email }).unwrap();

      if (response.success) {
        toast.success(response.message || 'Subscribed successfully!');
        setIsSubscribed(true);
        setEmail('');

        setTimeout(() => {
          setIsSubscribed(false);
        }, 5000);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to subscribe. Please try again.');
    }
  };

  const handleStandardClick = (id: string) => {
    setIsModalOpen(false);
    router.push(`/standards/${id}`);
  };

  return (
    <>
      <footer className='bg-gray-100 text-gray-900 pt-10 border-t border-gray-200'>
        {/* Main Grid */}
        <div className='container mx-auto px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8'>
          {/* Logo & Info */}
          <div className='col-span-2'>
            <Image
              src={siteLogo}
              alt='Accreditation Body'
              width={800}
              height={600}
              className='mb-4 w-64 h-28 '
            />

            <div className='flex items-start gap-2 mb-3'>
              <MdLocationOn className='text-blue-400 mt-1' />
              <Paragraph className='text-sm'>
                International Accreditation & Certification Body ensuring global
                compliance and standards.
              </Paragraph>
            </div>

            <div className='flex items-center gap-2 mb-2'>
              <MdEmail className='text-blue-400' />
              <Paragraph className='text-sm'>support@accreditation.org</Paragraph>
            </div>

            {/* Social */}
            <div className='flex gap-3 mt-5'>
              {[FaLinkedinIn, FaFacebookF, FaTwitter, FaGlobe].map((Icon, i) => (
                <Link
                  key={i}
                  href='#'
                  className='bg-blue-600 hover:bg-blue-500 p-2 rounded-full text-white transition'
                >
                  <Icon />
                </Link>
              ))}
            </div>
          </div>

          {/* Accreditation Services */}
          <div>
            <div className='text-xl font-semibold mb-4 text-gray-900'>
              Accreditation Services
            </div>
            <ul className='space-y-2 text-sm'>
              {[
                { name: 'Initial Accreditation', path: '/accreditation-services/initial-accreditation' },
                { name: 'Surveillance Audit', path: '/accreditation-services/surveillance-audit' },
                { name: 'Re-Accreditation', path: '/accreditation-services/re-accreditation' },
                { name: 'Scope Extension', path: '/accreditation-services/scope-extension' },
                { name: 'Remote Assessment', path: '/accreditation-services/remote-assessment' },
                { name: 'Witness Assessment', path: '/accreditation-services/witness-assessment' }
              ].map((item, index) => (
                <li
                  key={index}
                  className='hover:text-blue-500 cursor-pointer transition-colors duration-200'
                  onClick={() => router.push(item.path)}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Certification Standards - Updated */}
          <div>
            <div className='text-xl font-semibold mb-4 text-gray-900'>
              Standards We Cover
            </div>
            <ul className='space-y-2 text-sm'>
              {displayedStandards.map((item) => (
                <li
                  key={item.id}
                  className='hover:text-blue-500 cursor-pointer transition-colors duration-200 group'
                  onClick={() => handleStandardClick(item.id)}
                >
                  <span className='font-medium'>{item.name}</span>
                  <span className='text-gray-500 text-xs ml-1 group-hover:text-blue-400 transition-colors duration-200'>
                    {item.description}
                  </span>
                </li>
              ))}
              <li
                className='text-blue-600 hover:text-blue-700 cursor-pointer font-medium flex items-center gap-1 group transition-colors duration-200 mt-1'
                onClick={() => setIsModalOpen(true)}
              >
                <span>View All Standards</span>
                <FaChevronRight className='w-3 h-3 group-hover:translate-x-1 transition-transform duration-200' />
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <div className='text-xl font-semibold mb-4 text-gray-900'>
              Quick Links
            </div>
            <ul className='space-y-2 text-sm'>
              {[
                { name: 'About Us', path: '/about' },
                { name: 'Verify Certificate', path: '/certificate-verification' },
                { name: 'Apply for Accreditation', path: '/register' },
                { name: 'Standards', path: '/standards' },
                { name: 'News & Updates', path: '/' },
                { name: 'Contact', path: '/contact' }
              ].map((item, index) => (
                <li
                  key={index}
                  className='hover:text-blue-500 cursor-pointer transition-colors duration-200'
                  onClick={() => router.push(item.path)}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className='container mx-auto mt-12 px-4 sm:px-6'>
          <div className='bg-gradient-to-r from-green-700 to-blue-600 rounded-xl p-6 md:p-8'>
            <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
              <div>
                <Heading className='text-xl text-white mb-2'>
                  Stay Updated
                </Heading>
                <Paragraph className='text-sm text-gray-200'>
                  Get latest accreditation updates, standards, and compliance
                  news.
                </Paragraph>
              </div>

              <form onSubmit={handleSubscribe} className='flex gap-2 w-full md:w-auto'>
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='Enter your email'
                  className='px-4 py-2 rounded-lg w-full md:w-64 placeholder:text-white text-white border border-gray-100 focus:outline-none '
                  disabled={isLoading || isSubscribed}
                />
                <button
                  type='submit'
                  disabled={isLoading || isSubscribed}
                  className='bg-white text-blue-700 px-5 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap'
                >
                  {isLoading ? (
                    <Loader2 className='w-4 h-4 animate-spin' />
                  ) : isSubscribed ? (
                    <>
                      <CheckCircle className='w-4 h-4' />
                      Subscribed
                    </>
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='container mx-auto mt-10 border-t border-gray-400 py-5 px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-3'>
          <Paragraph className='text-sm'>
            © {new Date().getFullYear()} Accreditation Body. All rights reserved.
          </Paragraph>

          <div className='flex flex-wrap items-center gap-3 text-sm'>
            <Link href='/privacy-policy' className='hover:text-blue-400'>
              Privacy Policy
            </Link>

            <span>|</span>

            <Link href='/terms-of-service' className='hover:text-blue-400'>
              Terms of Service
            </Link>

            <span>|</span>

            <Link href='/cookie-policy' className='hover:text-blue-400'>
              Cookie Policy
            </Link>
          </div>
        </div>
      </footer>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className='fixed inset-0 bg-black/60 backdrop-blur-sm z-40'
              onClick={() => setIsModalOpen(false)}
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
                duration: 0.4
              }}
              className='fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none'
            >
              <div
                className='bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden pointer-events-auto'
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className='bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white relative'>
                  <h2 className='text-2xl font-bold'>All Standards We Cover</h2>
                  <p className='text-white/80 text-sm mt-1'>
                    Click on any standard to learn more about it
                  </p>
                  <div className='absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl'></div>
                </div>

                {/* Modal Content */}
                <div className='p-6 overflow-y-auto max-h-[60vh]'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                    {standardsData.map((item, index) => {
                      const colors = [
                        'from-blue-500 to-blue-600',
                        'from-emerald-500 to-emerald-600',
                        'from-purple-500 to-purple-600',
                        'from-orange-500 to-orange-600',
                        'from-red-500 to-red-600',
                        'from-indigo-500 to-indigo-600',
                        'from-cyan-500 to-cyan-600',
                        'from-pink-500 to-pink-600',
                      ];
                      const color = colors[index % colors.length];

                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                          whileHover={{ scale: 1.03, y: -2 }}
                          whileTap={{ scale: 0.97 }}
                          className={`
                      relative p-4 rounded-xl cursor-pointer
                      bg-gradient-to-r ${color} text-white
                      shadow-md hover:shadow-xl
                      transition-all duration-300
                      group overflow-hidden
                    `}
                          onClick={() => handleStandardClick(item.id)}
                        >
                          <div className='absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-xl'></div>
                          <div className='relative z-10'>
                            <div className='flex items-center justify-between'>
                              <div>
                                <h3 className='font-semibold text-sm'>
                                  {item.name}
                                </h3>
                                <p className='text-white/80 text-xs mt-0.5'>
                                  {item.description}
                                </p>
                              </div>
                              <FaChevronRight className='w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300' />
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className='p-4 border-t border-gray-100 bg-gray-50'>
                  <p className='text-xs text-gray-500 text-center'>
                    {standardsData.length} standards available • Click to view details
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}


