'use client';

import Link from 'next/link';

const sectionTitle: React.CSSProperties = {
  fontFamily: "'Syne', sans-serif",
  fontWeight: 700,
  fontSize: '1.15rem',
  background: 'linear-gradient(135deg, #FF5020, #FF7040)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  marginTop: '2rem',
  marginBottom: '0.75rem',
};

const paragraph: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '0.9rem',
  lineHeight: 1.7,
  color: 'rgba(255,243,236,0.85)',
  marginBottom: '0.75rem',
};

const muted: React.CSSProperties = {
  color: 'rgba(255,243,236,0.35)',
};

const list: React.CSSProperties = {
  ...paragraph,
  paddingLeft: '1.25rem',
  listStyleType: 'disc',
};

export default function TermsPage() {
  return (
    <div>
      {/* Back button */}
      <Link
        href="/signup"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '0.85rem',
          color: '#FF7040',
          textDecoration: 'none',
          marginBottom: '1.5rem',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF7040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
        </svg>
        Back to Sign Up
      </Link>

      {/* Title */}
      <h1
        style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: '1.75rem',
          color: '#FFF3EC',
          marginBottom: '0.25rem',
        }}
      >
        Terms of Service
      </h1>
      <p style={{ ...muted, fontSize: '0.8rem', marginBottom: '2rem' }}>
        Effective Date: April 1, 2026
      </p>

      <div
        style={{
          background: '#130709',
          borderRadius: '1rem',
          padding: '1.5rem',
          border: '1px solid rgba(255,243,236,0.06)',
        }}
      >
        {/* 1 */}
        <h2 style={sectionTitle}>1. Acceptance of Terms</h2>
        <p style={paragraph}>
          By creating an account on UNLON or using any part of our service (the &ldquo;App&rdquo;), you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;). If you do not agree, please do not use the App. These Terms constitute a legally binding agreement between you and Atul Bachhraj (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;UNLON&rdquo;), the operator of UNLON, accessible at{' '}
          <a href="https://unlon-app.vercel.app" style={{ color: '#FF7040', textDecoration: 'underline' }}>
            unlon-app.vercel.app
          </a>.
        </p>

        {/* 2 */}
        <h2 style={sectionTitle}>2. Eligibility</h2>
        <p style={paragraph}>
          You must be at least 18 years of age to use UNLON without restriction. Users between the ages of 13 and 17 may use the App only with verifiable parental or guardian consent, in compliance with the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023 (India). Users under 13 are strictly prohibited from using the App.
        </p>
        <p style={paragraph}>
          By using UNLON, you represent and warrant that you meet the applicable age requirements and, if you are a minor, that your parent or guardian has consented to your use.
        </p>

        {/* 3 */}
        <h2 style={sectionTitle}>3. Account Registration &amp; Security</h2>
        <p style={paragraph}>
          You are responsible for providing accurate information during registration and for maintaining the confidentiality of your login credentials. You agree to notify us immediately of any unauthorized access to your account. UNLON is not liable for any loss arising from your failure to secure your account.
        </p>

        {/* 4 */}
        <h2 style={sectionTitle}>4. User Conduct</h2>
        <p style={paragraph}>You agree not to:</p>
        <ul style={list}>
          <li style={{ marginBottom: '0.4rem' }}>Harass, bully, stalk, or threaten any other user</li>
          <li style={{ marginBottom: '0.4rem' }}>Post or share hate speech, discriminatory content, or content that incites violence</li>
          <li style={{ marginBottom: '0.4rem' }}>Upload or distribute illegal, obscene, or sexually explicit material</li>
          <li style={{ marginBottom: '0.4rem' }}>Impersonate another person or entity, or create fake profiles</li>
          <li style={{ marginBottom: '0.4rem' }}>Use the App for spam, advertising, or any commercial solicitation</li>
          <li style={{ marginBottom: '0.4rem' }}>Attempt to reverse-engineer, hack, or interfere with the App&apos;s functionality</li>
          <li>Share content that violates the intellectual property rights of others</li>
        </ul>
        <p style={paragraph}>
          Violations of these rules may result in warnings, suspension, or permanent termination of your account at our discretion.
        </p>

        {/* 5 */}
        <h2 style={sectionTitle}>5. Content Ownership &amp; License</h2>
        <p style={paragraph}>
          You retain ownership of all content you create and share on UNLON (including text, images, audio, and profile information). By posting content on the App, you grant UNLON a non-exclusive, worldwide, royalty-free, sublicensable license to use, display, reproduce, and distribute your content solely for the purpose of operating and improving the App.
        </p>
        <p style={paragraph}>
          You may delete your content at any time. Upon deletion, we will remove it from public view within a reasonable timeframe, though cached or archived copies may persist briefly.
        </p>

        {/* 6 */}
        <h2 style={sectionTitle}>6. Anonymous Features (Confessions)</h2>
        <p style={paragraph}>
          UNLON offers anonymous posting features such as Confessions. While your identity is hidden from other users, all anonymous content is still subject to our Community Guidelines and these Terms. We retain internal records (including user IDs) linked to anonymous content for moderation, safety, and legal compliance purposes.
        </p>
        <p style={paragraph}>
          Anonymity does not shield you from consequences if your content violates our rules or applicable law.
        </p>

        {/* 7 */}
        <h2 style={sectionTitle}>7. Matching &amp; Messaging</h2>
        <p style={paragraph}>
          UNLON provides matching and messaging features designed around consent-based interactions. You may only message users who have mutually matched or consented to receive messages from you. Unsolicited or harassing messages are strictly prohibited.
        </p>
        <p style={paragraph}>
          UNLON does not guarantee any particular outcome from matching features. Matches are generated using algorithmic suggestions and are not endorsements of any user.
        </p>

        {/* 8 */}
        <h2 style={sectionTitle}>8. Premium Subscriptions (Future)</h2>
        <p style={paragraph}>
          UNLON may offer premium subscription plans in the future. If introduced, the following will apply:
        </p>
        <ul style={list}>
          <li style={{ marginBottom: '0.4rem' }}>Subscription fees will be clearly displayed before purchase</li>
          <li style={{ marginBottom: '0.4rem' }}>Subscriptions will auto-renew unless cancelled before the renewal date</li>
          <li style={{ marginBottom: '0.4rem' }}>You may cancel your subscription at any time through your account settings</li>
          <li>Refunds will be handled in accordance with applicable Indian consumer protection laws and the specific refund policy published at the time of purchase</li>
        </ul>

        {/* 9 */}
        <h2 style={sectionTitle}>9. Virtual Gifts</h2>
        <p style={paragraph}>
          UNLON may offer virtual gifts as digital goods within the App. Virtual gifts are non-refundable, non-transferable, and hold no real-world monetary value. They are licensed to you for personal, non-commercial use within the App only.
        </p>

        {/* 10 */}
        <h2 style={sectionTitle}>10. Termination</h2>
        <p style={paragraph}>
          UNLON reserves the right to suspend or permanently terminate your account at any time, with or without notice, for any violation of these Terms, our Community Guidelines, or applicable law. You may also delete your own account at any time through your account settings.
        </p>
        <p style={paragraph}>
          Upon termination, your right to use the App ceases immediately. We may retain certain data as required by law or for legitimate business purposes (e.g., fraud prevention).
        </p>

        {/* 11 */}
        <h2 style={sectionTitle}>11. Disclaimer of Warranties</h2>
        <p style={paragraph}>
          UNLON is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind, whether express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not warrant that the App will be uninterrupted, secure, or error-free.
        </p>

        {/* 12 */}
        <h2 style={sectionTitle}>12. Limitation of Liability</h2>
        <p style={paragraph}>
          To the fullest extent permitted by applicable law, Atul Bachhraj and UNLON shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, data, or goodwill, arising out of or in connection with your use of the App. Our total liability for any claim arising from the App shall not exceed the amount you have paid us in the 12 months preceding the claim, or INR 1,000, whichever is greater.
        </p>

        {/* 13 */}
        <h2 style={sectionTitle}>13. Governing Law &amp; Jurisdiction</h2>
        <p style={paragraph}>
          These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these Terms or your use of the App shall be subject to the exclusive jurisdiction of the courts in your city of residence, or the courts of Delhi, India, at the election of the complainant.
        </p>

        {/* 14 */}
        <h2 style={sectionTitle}>14. Changes to These Terms</h2>
        <p style={paragraph}>
          We may update these Terms from time to time. When we do, we will notify you through the App (via in-app notification or a banner). Continued use of the App after changes are posted constitutes your acceptance of the updated Terms.
        </p>

        {/* 15 */}
        <h2 style={sectionTitle}>15. Contact Us</h2>
        <p style={paragraph}>
          If you have any questions or concerns about these Terms, please contact us:
        </p>
        <p style={paragraph}>
          Atul Bachhraj<br />
          Email:{' '}
          <a href="mailto:atulbachhraj@gmail.com" style={{ color: '#FF7040', textDecoration: 'underline' }}>
            atulbachhraj@gmail.com
          </a>
        </p>
      </div>

      {/* Footer links */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1.5rem',
          marginTop: '2rem',
          paddingBottom: '2rem',
        }}
      >
        <Link href="/privacy" style={{ color: 'rgba(255,243,236,0.35)', fontSize: '0.8rem', textDecoration: 'none' }}>
          Privacy Policy
        </Link>
        <Link href="/guidelines" style={{ color: 'rgba(255,243,236,0.35)', fontSize: '0.8rem', textDecoration: 'none' }}>
          Community Guidelines
        </Link>
      </div>
    </div>
  );
}
