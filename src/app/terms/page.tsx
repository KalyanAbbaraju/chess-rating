import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Elo Estimate',
  description: 'Read Elo Estimate\'s terms of service to understand the rules and regulations for using our chess rating calculators and other chess tools.'
};

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Terms of Service</h1>
      
      <div className="space-y-8 text-gray-700">
        <p className="text-lg leading-relaxed mb-8">
          Welcome to Elo Estimate. These terms and conditions outline the rules and regulations for the use of our website.
          By accessing this website, we assume you accept these terms and conditions in full. Do not continue to use
          Elo Estimate if you do not accept all of the terms and conditions stated on this page.
        </p>
        
        <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-800 border-b pb-2">Use of Our Services</h2>
        <p className="text-gray-700 mb-6">
          Elo Estimate provides chess rating calculators and tools for informational purposes only. The information obtained
          through our calculators is an estimate and may not reflect official ratings issued by chess organizations.
        </p>
        
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Calculation Accuracy</h2>
          <p className="mb-4 leading-relaxed">
            While we strive to provide accurate calculations based on published formulas from chess rating authorities, 
            we make no warranty or guarantee regarding the accuracy of our calculators. The results should be considered 
            estimates and may differ from official calculations due to various factors, including special rules, exceptions, 
            or changes to the official rating formulas.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">User Responsibilities</h2>
          <p className="mb-4 leading-relaxed">You agree that while using our website:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li className="leading-relaxed">You will not use our website in any way that causes, or may cause, damage to the website or impairment of its availability</li>
            <li className="leading-relaxed">You will not engage in any activity that is unlawful, illegal, fraudulent or harmful</li>
            <li className="leading-relaxed">You will not use our website to copy, store, host, transmit, send, use, publish or distribute any material which infringes copyright</li>
            <li className="leading-relaxed">You will not use our website to transmit or send unsolicited commercial communications</li>
          </ul>
        </section>
        
        <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-800 border-b pb-2">Intellectual Property</h2>
        <p className="text-gray-700 mb-6">
          The content on Elo Estimate, including but not limited to text, graphics, logos, icons, images, and software,
          is the property of Elo Estimate and is protected by copyright and other intellectual property laws. You may not
          reproduce, distribute, or use our content without express permission.
        </p>
        
        <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-800 border-b pb-2">Limitation of Liability</h2>
        <p className="text-gray-700 mb-6">
          Elo Estimate and its operators shall not be held liable for any direct, indirect, incidental, consequential,
          or punitive damages arising from your use of the website or any information it contains.
        </p>
        
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Third-Party Links</h2>
          <p className="mb-4 leading-relaxed">
            Our website may contain links to third-party websites. These links are provided for your convenience and do not 
            signify our endorsement of the website(s) or their content. We have no control over the nature, content, and 
            availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorsement 
            of the views expressed within them.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Modifications</h2>
          <p className="mb-4 leading-relaxed">
            We reserve the right to modify these terms of service at any time without prior notice. By continuing to use the 
            website after changes to the terms, you consent to the updated terms.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Contact Us</h2>
          <p className="mb-4 leading-relaxed">
            If you have any questions about these terms of service, please contact us through our{' '}
            <Link href="/contact" className="text-blue-600 hover:text-blue-800 underline">Contact Form</Link>.
          </p>
        </section>
      </div>
    </div>
  );
} 