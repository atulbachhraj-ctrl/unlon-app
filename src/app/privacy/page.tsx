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

export default function PrivacyPage() {
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
        Privacy Policy
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
        <p style={paragraph}>
          UNLON (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is operated by Atul Bachhraj. This Privacy Policy explains how we collect, use, store, and protect your personal data when you use the UNLON application (the &ldquo;App&rdquo;), accessible at{' '}
          <a href="https://unlon-app.vercel.app" style={{ color: '#FF7040', textDecoration: 'underline' }}>
            unlon-app.vercel.app
          </a>. This policy is designed to comply with the Information Technology Act, 2000, the IT (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, and the Digital Personal Data Protection Act, 2023 (DPDP Act).
        </p>

        {/* 1 */}
        <h2 style={sectionTitle}>1. Information We Collect</h2>
        <p style={{ ...paragraph, fontWeight: 600 }}>Information you provide directly:</p>
        <ul style={list}>
          <li style={{ marginBottom: '0.4rem' }}>Email address and/or phone number (for account creation and login)</li>
          <li style={{ marginBottom: '0.4rem' }}>Full name and display name</li>
          <li style={{ marginBottom: '0.4rem' }}>Date of birth / age</li>
          <li style={{ marginBottom: '0.4rem' }}>City and location</li>
          <li style={{ marginBottom: '0.4rem' }}>Profile information (bio, photos, vibes/interests, gender, preferences)</li>
          <li>Content you create (messages, confessions, posts, audio recordings)</li>
        </ul>
        <p style={{ ...paragraph, fontWeight: 600, marginTop: '1rem' }}>Information collected automatically:</p>
        <ul style={list}>
          <li style={{ marginBottom: '0.4rem' }}>Usage data (features used, time spent, interaction patterns)</li>
          <li style={{ marginBottom: '0.4rem' }}>Device information (device type, operating system, browser type)</li>
          <li style={{ marginBottom: '0.4rem' }}>IP address</li>
          <li>App performance data and crash logs</li>
        </ul>

        {/* 2 */}
        <h2 style={sectionTitle}>2. How We Use Your Information</h2>
        <p style={paragraph}>We use the information we collect to:</p>
        <ul style={list}>
          <li style={{ marginBottom: '0.4rem' }}>Create and manage your account</li>
          <li style={{ marginBottom: '0.4rem' }}>Power matching algorithms and suggest compatible connections</li>
          <li style={{ marginBottom: '0.4rem' }}>Personalize your experience (feed, recommendations, night mode)</li>
          <li style={{ marginBottom: '0.4rem' }}>Ensure user safety through content moderation and abuse prevention</li>
          <li style={{ marginBottom: '0.4rem' }}>Analyze usage patterns to improve the App</li>
          <li>Send you important communications (account updates, security alerts, feature announcements)</li>
        </ul>

        {/* 3 */}
        <h2 style={sectionTitle}>3. Anonymous Data (Confessions)</h2>
        <p style={paragraph}>
          When you post a Confession or use other anonymous features, your identity is not displayed to other users. However, we retain an internal association between your user ID and your anonymous content. This is necessary for:
        </p>
        <ul style={list}>
          <li style={{ marginBottom: '0.4rem' }}>Content moderation and enforcing Community Guidelines</li>
          <li style={{ marginBottom: '0.4rem' }}>Responding to legal requests from law enforcement</li>
          <li>Preventing abuse and ensuring platform safety</li>
        </ul>
        <p style={paragraph}>
          We do not expose this association to other users under normal circumstances.
        </p>

        {/* 4 */}
        <h2 style={sectionTitle}>4. Data Sharing &amp; Disclosure</h2>
        <p style={{ ...paragraph, fontWeight: 600 }}>We do not sell your personal data.</p>
        <p style={paragraph}>We may share your data only in the following limited situations:</p>
        <ul style={list}>
          <li style={{ marginBottom: '0.4rem' }}>
            <strong>Service providers:</strong> We use Supabase (database and authentication) and Vercel (hosting and deployment) to operate the App. These providers process data on our behalf under their own privacy policies and appropriate data processing agreements.
          </li>
          <li style={{ marginBottom: '0.4rem' }}>
            <strong>Legal compliance:</strong> We may disclose your data if required by Indian law, court order, or lawful government request.
          </li>
          <li>
            <strong>Safety:</strong> We may share data to prevent fraud, protect user safety, or enforce our Terms of Service.
          </li>
        </ul>

        {/* 5 */}
        <h2 style={sectionTitle}>5. Data Retention</h2>
        <p style={paragraph}>
          We retain your personal data for as long as your account is active. If you choose to delete your account, we will remove your personal data from our active systems within 30 days. Some data may be retained longer where required by law (e.g., financial transaction records) or for legitimate purposes such as fraud prevention.
        </p>
        <p style={paragraph}>
          Anonymous confessions may persist after account deletion if they have been stripped of all identifying information.
        </p>

        {/* 6 */}
        <h2 style={sectionTitle}>6. Data Security</h2>
        <p style={paragraph}>We implement reasonable security measures to protect your data, including:</p>
        <ul style={list}>
          <li style={{ marginBottom: '0.4rem' }}>Encryption in transit using HTTPS/TLS</li>
          <li style={{ marginBottom: '0.4rem' }}>Supabase Row Level Security (RLS) policies to restrict database access</li>
          <li style={{ marginBottom: '0.4rem' }}>Secure password hashing (bcrypt) for credentials</li>
          <li>Access controls limiting who can view user data internally</li>
        </ul>
        <p style={paragraph}>
          While we strive to protect your data, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
        </p>

        {/* 7 */}
        <h2 style={sectionTitle}>7. Your Rights (Under the DPDP Act, 2023)</h2>
        <p style={paragraph}>As a user in India, you have the following rights regarding your personal data:</p>
        <ul style={list}>
          <li style={{ marginBottom: '0.4rem' }}><strong>Right to Access:</strong> Request a summary of the personal data we hold about you</li>
          <li style={{ marginBottom: '0.4rem' }}><strong>Right to Correction:</strong> Request correction of inaccurate or incomplete data</li>
          <li style={{ marginBottom: '0.4rem' }}><strong>Right to Erasure:</strong> Request deletion of your personal data (subject to legal retention requirements)</li>
          <li style={{ marginBottom: '0.4rem' }}><strong>Right to Data Portability:</strong> Request your data in a structured, machine-readable format</li>
          <li><strong>Right to Withdraw Consent:</strong> Withdraw your consent for data processing at any time (this may affect your ability to use the App)</li>
        </ul>
        <p style={paragraph}>
          To exercise any of these rights, contact us at{' '}
          <a href="mailto:atulbachhraj@gmail.com" style={{ color: '#FF7040', textDecoration: 'underline' }}>
            atulbachhraj@gmail.com
          </a>. We will respond within 30 days.
        </p>

        {/* 8 */}
        <h2 style={sectionTitle}>8. Cookies &amp; Local Storage</h2>
        <p style={paragraph}>
          UNLON uses minimal cookies, limited to session management and authentication. We do not use third-party tracking cookies or advertising cookies. Session data is stored locally on your device and is cleared when you log out.
        </p>

        {/* 9 */}
        <h2 style={sectionTitle}>9. Children&apos;s Privacy</h2>
        <p style={paragraph}>
          UNLON is not intended for children under the age of 13. We do not knowingly collect personal data from children under 13. Users between 13 and 18 may use the App only with verifiable parental or guardian consent, as required by the DPDP Act. If we become aware that a child under 13 has provided personal data, we will promptly delete that information.
        </p>

        {/* 10 */}
        <h2 style={sectionTitle}>10. Third-Party Services</h2>
        <p style={paragraph}>The App relies on the following third-party services:</p>
        <ul style={list}>
          <li style={{ marginBottom: '0.4rem' }}><strong>Supabase:</strong> Database storage, authentication, and real-time features</li>
          <li><strong>Vercel:</strong> Application hosting, deployment, and edge functions</li>
        </ul>
        <p style={paragraph}>
          These services have their own privacy policies. We encourage you to review them. We do not control how these third parties handle your data beyond our contractual agreements with them.
        </p>

        {/* 11 */}
        <h2 style={sectionTitle}>11. Changes to This Policy</h2>
        <p style={paragraph}>
          We may update this Privacy Policy from time to time. When we make significant changes, we will notify you through the App via in-app notification or a banner. Your continued use of the App after such notification constitutes your acceptance of the updated policy.
        </p>

        {/* 12 */}
        <h2 style={sectionTitle}>12. Grievance Officer</h2>
        <p style={paragraph}>
          In accordance with the Information Technology Act, 2000 and the rules made thereunder, the Grievance Officer for UNLON is:
        </p>
        <p style={paragraph}>
          <strong>Name:</strong> Atul Bachhraj<br />
          <strong>Email:</strong>{' '}
          <a href="mailto:atulbachhraj@gmail.com" style={{ color: '#FF7040', textDecoration: 'underline' }}>
            atulbachhraj@gmail.com
          </a>
        </p>
        <p style={paragraph}>
          The Grievance Officer shall acknowledge your complaint within 24 hours and resolve it within 15 days from the date of receipt.
        </p>

        {/* 13 */}
        <h2 style={sectionTitle}>13. Contact Us</h2>
        <p style={paragraph}>
          If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us:
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
        <Link href="/terms" style={{ color: 'rgba(255,243,236,0.35)', fontSize: '0.8rem', textDecoration: 'none' }}>
          Terms of Service
        </Link>
        <Link href="/guidelines" style={{ color: 'rgba(255,243,236,0.35)', fontSize: '0.8rem', textDecoration: 'none' }}>
          Community Guidelines
        </Link>
      </div>
    </div>
  );
}
