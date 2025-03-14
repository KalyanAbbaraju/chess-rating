import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Elo Estimate',
  description: 'Elo Estimate\'s privacy policy explains how we collect, use, and protect your personal information when using our chess rating calculators and tools.'
};

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Privacy Policy</h1>
      
      <div className="space-y-8 text-gray-700">
        <p className="text-lg leading-relaxed mb-8">
          At Elo Estimate, we respect your privacy and are committed to protecting your personal data.
          This privacy policy explains how we collect, use, and safeguard your information when you use our website.
        </p>
        
        <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-800 border-b pb-2">Information We Collect</h2>
        <p className="text-gray-700 mb-6">
          Elo Estimate is designed to minimize data collection. We collect and process the following data:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li className="leading-relaxed">
            <span className="font-semibold">Calculation Data:</span> Information you input into our rating calculators (such as 
            chess ratings, game results, and other related parameters). This data is processed locally in your 
            browser and is not stored on our servers.
          </li>
          <li className="leading-relaxed">
            <span className="font-semibold">Contact Information:</span> If you use our contact form, we collect your name, email address, 
            and message content to respond to your inquiry.
          </li>
          <li className="leading-relaxed">
            <span className="font-semibold">Usage Data:</span> Basic information about how you use our website, including IP address, 
            browser type, pages visited, and time spent on the site. This is collected using cookies and similar technologies.
          </li>
        </ul>
        
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">How We Use Your Data</h2>
          <p className="mb-4 leading-relaxed">We use your data for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li className="leading-relaxed">To provide and maintain our chess tools and calculators</li>
            <li className="leading-relaxed">To respond to your inquiries and support requests</li>
            <li className="leading-relaxed">To analyze usage patterns and improve our website</li>
            <li className="leading-relaxed">To detect and prevent technical issues and security breaches</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Cookies</h2>
          <p className="mb-4 leading-relaxed">
            We use essential cookies to ensure the proper functioning of our website. You can set your browser to 
            refuse all or some browser cookies, but this may prevent some parts of our site from functioning properly.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Third-Party Services</h2>
          <p className="mb-4 leading-relaxed">
            We may use third-party services such as analytics providers and email service providers. These services 
            may collect and process data as part of their functionality. All third-party providers we use are compliant 
            with applicable data protection regulations.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Data Security</h2>
          <p className="mb-4 leading-relaxed">
            We have implemented appropriate security measures to prevent your personal data from being accidentally lost, 
            used, or accessed in an unauthorized way. We limit access to your personal data to those employees, agents, 
            contractors, and other third parties who have a business need to know.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Data Protection Rights</h2>
          <p className="mb-4 leading-relaxed">Under data protection laws, you have rights including:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li className="leading-relaxed">The right to access your personal data</li>
            <li className="leading-relaxed">The right to correct inaccurate personal data</li>
            <li className="leading-relaxed">The right to erasure of your personal data</li>
            <li className="leading-relaxed">The right to restrict processing of your personal data</li>
            <li className="leading-relaxed">The right to data portability</li>
            <li className="leading-relaxed">The right to object to processing of your personal data</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Contact Us</h2>
          <p className="mb-4 leading-relaxed">
            If you have any questions about this privacy policy or our privacy practices, please contact us through our{' '}
            <Link href="/contact" className="text-blue-600 hover:text-blue-800 underline">Contact Form</Link>.
          </p>
        </section>
      </div>
    </div>
  );
} 