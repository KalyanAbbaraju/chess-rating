import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Terms of Service</h1>
      
      <div className="space-y-8 text-gray-700">
        <p className="text-lg">
          Last updated: {new Date().toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}
        </p>
        
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Introduction</h2>
          <p className="mb-4 leading-relaxed">
            Welcome to Chess Companion. These terms and conditions outline the rules and regulations for the use of our website.
            By accessing this website, we assume you accept these terms and conditions in full. Do not continue to use 
            Chess Companion if you do not accept all of the terms and conditions stated on this page.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Website Use</h2>
          <p className="mb-4 leading-relaxed">
            Chess Companion provides chess rating calculators and tools for informational purposes only. The information obtained 
            from our tools should not be considered official ratings or official advice regarding chess ratings. Official ratings 
            are determined solely by the respective chess organizations (US Chess Federation, FIDE, etc.).
          </p>
        </section>
        
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
        
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Intellectual Property</h2>
          <p className="mb-4 leading-relaxed">
            The content on Chess Companion, including but not limited to text, graphics, logos, icons, images, and software, 
            is the property of Chess Companion and is protected by copyright and other intellectual property laws. You may not 
            reproduce, duplicate, copy, sell, resell, or exploit any portion of this website without express written permission.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Limitation of Liability</h2>
          <p className="mb-4 leading-relaxed">
            Chess Companion and its operators shall not be held liable for any direct, indirect, incidental, consequential, 
            or special damages arising out of or in any way connected with the use of our website, services, or content. This 
            includes, but is not limited to, damages for loss of profits, data, or other intangible losses, even if we have been 
            advised of the possibility of such damages.
          </p>
        </section>
        
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