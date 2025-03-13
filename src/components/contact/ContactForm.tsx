'use client';

import React, { useState } from 'react';
import { Mail, User, MessageSquare } from 'lucide-react';

interface ContactFormProps {
  className?: string;
}

export default function ContactForm({ className = '' }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    error: false,
    message: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ submitted: false, submitting: true, error: false, message: '' });
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Something went wrong');
      }
      
      setStatus({
        submitted: true,
        submitting: false,
        error: false,
        message: 'Thank you! Your message has been sent successfully.'
      });
      
      // Reset form after successful submission
      setFormData({ name: '', email: '', message: '' });
      
    } catch (error) {
      setStatus({
        submitted: false,
        submitting: false,
        error: true,
        message: error instanceof Error ? error.message : 'An error occurred. Please try again.'
      });
    }
  };
  
  return (
    <div className={className}>
      {status.submitted ? (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-6 flex items-start">
          <svg className="w-5 h-5 mr-2 mt-0.5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p>{status.message}</p>
        </div>
      ) : status.error ? (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 flex items-start">
          <svg className="w-5 h-5 mr-2 mt-0.5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p>{status.message}</p>
        </div>
      ) : null}
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="pl-10 w-full rounded-md border border-gray-200 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2.5 transition-colors"
              placeholder="John Doe"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail size={18} className="text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="pl-10 w-full rounded-md border border-gray-200 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2.5 transition-colors"
              placeholder="you@example.com"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Your Message
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute top-3 left-3 pointer-events-none">
              <MessageSquare size={18} className="text-gray-400" />
            </div>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              className="pl-10 w-full rounded-md border border-gray-200 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2.5 transition-colors resize-none"
              placeholder="Type your message here..."
            />
          </div>
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            disabled={status.submitting}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-6 rounded-md font-medium transition-colors shadow-sm disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {status.submitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Message
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 