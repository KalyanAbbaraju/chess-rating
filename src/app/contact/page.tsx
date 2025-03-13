import React from 'react';
import ContactForm from '@/components/contact/ContactForm';
import { Mail } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="container mx-auto pt-12 pb-16 px-4 sm:px-6 md:max-w-4xl">
      {/* Header with decorative top border */}
      <div className="relative mb-10 pb-5">
        <div className="absolute top-0 left-0 w-20 h-1 bg-blue-600"></div>
        <h1 className="text-3xl font-bold mt-6 text-gray-800 flex items-center">
          <Mail className="w-6 h-6 mr-3 text-blue-600" />
          Contact Us
        </h1>
        <p className="text-gray-500 mt-2 text-lg">We'd love to hear from you</p>
      </div>
      
      {/* Contact form - now takes full width */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-100">Send us a message</h2>
        <ContactForm />
      </div>
    </div>
  );
} 