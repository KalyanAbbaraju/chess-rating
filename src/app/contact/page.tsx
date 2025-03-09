import React from 'react';
import ContactForm from '@/components/contact/ContactForm';

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto pt-8 pb-16 px-4">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <p className="text-gray-600 mb-8">
        Have questions or feedback about our chess tools? We'd love to hear from you!
      </p>
      
      <ContactForm />
    </div>
  );
} 