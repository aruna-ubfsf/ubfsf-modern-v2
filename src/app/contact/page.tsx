// src/app/contact/page.tsx
'use client';

import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";

export default function ContactPage() {
  const [result, setResult] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setResult({ type: null, message: '' });

    const formData = new FormData(event.target as HTMLFormElement);
    formData.append("access_key", "074ac587-7d26-4fb7-9784-ed3ae96a236c");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        setResult({
          type: 'success',
          message: '✅ Thank you! Your message has been sent successfully.'
        });
        (event.target as HTMLFormElement).reset();
      } else {
        setResult({
          type: 'error',
          message: '❌ Failed to send. Please try again.'
        });
      }
    } catch (error) {
      setResult({
        type: 'error',
        message: '❌ Network error. Please check your connection.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#1a1a1a] transition-colors duration-300 font-serif">
      
      {/* HERO SECTION */}
      <section className="relative bg-black text-white py-24 md:py-32 px-6 md:px-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FFB81C]/20 to-transparent"></div>
        </div>
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-block bg-[#FFB81C] text-black px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
            Get in Touch
          </div>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-6 text-white">
            Contact <span className="text-[#FFB81C]">Us</span>
          </h1>
          <div className="w-20 h-1 bg-[#FFB81C] mx-auto mb-8"></div>
          <p className="text-xl md:text-2xl text-stone-300 max-w-3xl mx-auto leading-relaxed font-light">
            We'd love to hear from you. Reach out with any questions, inquiries, or concerns.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="max-w-6xl mx-auto py-16 md:py-24 px-6 md:px-20">
        <div className="grid md:grid-cols-2 gap-16">
          
          {/* LEFT COLUMN - Contact Info */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black dark:text-white tracking-tight">
              Let's <span className="text-[#FFB81C]">Connect</span>
            </h2>
            <div className="w-16 h-1 bg-[#FFB81C] mb-8"></div>
            
            <p className="text-base text-stone-600 dark:text-stone-400 leading-relaxed mb-10">
              Thank you for taking the time to contact United Black Family Scholarship Foundation. 
              If you have any questions, inquiries, and/or concerns, feel free to let us know in the form. 
              You can also visit us at one of our social media pages.
            </p>
            
            {/* Contact Details */}
            <div className="space-y-6 p-8 bg-stone-50 dark:bg-[#2a2a2a] rounded-xl border border-stone-200 dark:border-stone-800 mb-10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#FFB81C]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#FFB81C] text-lg">📍</span>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                    Address
                  </p>
                  <p className="text-sm text-stone-700 dark:text-stone-300">
                    P.O. Box 862<br />
                    Bristow, OK 74010
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#FFB81C]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#FFB81C] text-lg">📧</span>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                    Email
                  </p>
                  <a 
                    href="mailto:news@ubfsf.org" 
                    className="text-sm text-stone-700 dark:text-stone-300 hover:text-[#FFB81C] transition-colors"
                  >
                    news@ubfsf.org
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#FFB81C]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#FFB81C] text-lg">📞</span>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                    Phone
                  </p>
                  <a 
                    href="tel:+19189245872" 
                    className="text-sm text-stone-700 dark:text-stone-300 hover:text-[#FFB81C] transition-colors"
                  >
                    1-918-924-5872
                  </a>
                </div>
              </div>
            </div>
            
            {/* Social Media */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#FFB81C] mb-4">
                Follow Us
              </h3>
              <div className="flex gap-4">
                <a
                  href="https://www.facebook.com/unitedblack.familyscholarshipfoundation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-stone-100 dark:bg-[#2a2a2a] hover:bg-[#1877F2] hover:text-white flex items-center justify-center transition-all duration-300 group"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5 text-stone-600 dark:text-stone-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/ubfsforg/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-stone-100 dark:bg-[#2a2a2a] hover:bg-gradient-to-br hover:from-[#f09433] hover:via-[#e6683c] hover:to-[#dc2743] hover:text-white flex items-center justify-center transition-all duration-300 group"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5 text-stone-600 dark:text-stone-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/@unitedblackfamilyscholarsh4337"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-stone-100 dark:bg-[#2a2a2a] hover:bg-[#FF0000] hover:text-white flex items-center justify-center transition-all duration-300 group"
                  aria-label="YouTube"
                >
                  <svg className="w-5 h-5 text-stone-600 dark:text-stone-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/company/united-black-family-scholarship-foundation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-stone-100 dark:bg-[#2a2a2a] hover:bg-[#0A66C2] hover:text-white flex items-center justify-center transition-all duration-300 group"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5 text-stone-600 dark:text-stone-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          {/* RIGHT COLUMN - Contact Form with Web3Forms */}
          <div>
            <div className="bg-stone-50 dark:bg-[#2a2a2a] p-8 md:p-10 rounded-xl border border-stone-200 dark:border-stone-800">
              <h3 className="text-lg font-bold text-black dark:text-white mb-2">
                Send Us a Message
              </h3>
              <p className="text-sm text-stone-500 dark:text-stone-400 mb-6">
                We'll get back to you as soon as possible.
              </p>

              {/* Success/Error Messages */}
              {result.type === 'success' && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-green-700 dark:text-green-300 text-sm font-medium">{result.message}</p>
                </div>
              )}

              {result.type === 'error' && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-700 dark:text-red-300 text-sm font-medium">{result.message}</p>
                </div>
              )}
              
              <form onSubmit={onSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="w-full px-4 py-3 bg-white dark:bg-[#1a1a1a] border border-stone-200 dark:border-stone-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB81C] focus:border-transparent transition text-black dark:text-white placeholder:text-stone-400"
                    placeholder="John Doe"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="w-full px-4 py-3 bg-white dark:bg-[#1a1a1a] border border-stone-200 dark:border-stone-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB81C] focus:border-transparent transition text-black dark:text-white placeholder:text-stone-400"
                    placeholder="john@example.com"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    className="w-full px-4 py-3 bg-white dark:bg-[#1a1a1a] border border-stone-200 dark:border-stone-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB81C] focus:border-transparent transition text-black dark:text-white placeholder:text-stone-400 resize-none"
                    placeholder="Your message here..."
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full px-8 py-4 bg-[#FFB81C] text-black text-xs font-black uppercase tracking-widest hover:bg-yellow-500 transition-all rounded-lg ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
        
        {/* Bottom CTA */}
        <div className="mt-24 pt-16 border-t border-stone-200 dark:border-stone-800 flex flex-col md:flex-row gap-6 justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold text-black dark:text-white">
              Join Us in <span className="text-[#FFB81C]">Rebuilding</span> Community
            </h3>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
              Together, we can create lasting change.
            </p>
          </div>
          <div className="flex gap-4 flex-wrap">
            <Link 
              href="/programs" 
              className="px-8 py-4 bg-[#FFB81C] text-black text-xs font-black uppercase tracking-widest hover:bg-yellow-500 transition-all rounded-lg"
            >
              Explore Programs
            </Link>
            <Link 
              href="/donate" 
              className="px-8 py-4 border-2 border-[#FFB81C] text-[#FFB81C] hover:bg-[#FFB81C] hover:text-black transition-all rounded-lg font-black text-xs uppercase tracking-widest"
            >
              Donate Now
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}