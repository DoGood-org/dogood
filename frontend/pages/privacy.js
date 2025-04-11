// frontend/pages/privacy.js

import Head from 'next/head';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <Head>
        <title>Privacy Policy - DoGood</title>
        <meta name="description" content="Privacy policy of DoGood platform." />
      </Head>

      <header className="bg-teal-500 py-6">
        <h1 className="text-center text-white text-4xl font-bold">Privacy Policy</h1>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
          <p>
            Your privacy is important to us. This policy outlines how DoGood collects, uses,
            and protects your personal data when you use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
          <ul className="list-disc pl-6">
            <li>Personal identification information (Name, email, phone number, etc.).</li>
            <li>Location data (when explicitly allowed by the user).</li>
            <li>Usage data and cookies to enhance user experience.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How We Use Information</h2>
          <p>We use collected information to:</p>
          <ul className="list-disc pl-6">
            <li>Provide and maintain our services.</li>
            <li>Personalize user experience.</li>
            <li>Communicate with users (notifications, newsletters, updates).</li>
            <li>Improve our services and analyze trends.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
          <p>
            We implement robust security measures to protect your data, including encryption,
            secure storage, and strict access controls.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Sharing Your Information</h2>
          <p>
            We do not sell or rent your personal data. Data may be shared with third-party
            service providers strictly to provide our services (e.g., payment processing,
            analytics).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6">
            <li>Access, update, or delete your personal information.</li>
            <li>Withdraw consent at any time.</li>
            <li>Request restrictions or object to processing your data.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
          <p>
            We may update our privacy policy periodically. Any changes will be posted on this
            page, and significant changes will be communicated via email.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p>
            For any questions about this privacy policy, please contact us at{' '}
            <a href="mailto:support@dogood.org" className="text-teal-600 hover:underline">
              support@dogood.org
            </a>.
          </p>
        </section>
      </main>

      <footer className="bg-gray-800 text-center py-4 text-white">
        © {new Date().getFullYear()} DoGood. All rights reserved.
      </footer>
    </div>
  );
}