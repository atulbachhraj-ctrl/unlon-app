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

export default function GuidelinesPage() {
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
        Community Guidelines
      </h1>
      <p style={{ ...muted, fontSize: '0.8rem', marginBottom: '0.5rem' }}>
        Last updated: April 2026
      </p>
      <p style={{ ...paragraph, marginBottom: '2rem' }}>
        UNLON is your space to connect, vibe, and be yourself. To keep it safe and fun for everyone, here are the ground rules. They apply to everything you do on the app &mdash; profiles, chats, confessions, audio rooms, all of it.
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
        <h2 style={sectionTitle}>1. Be Respectful</h2>
        <p style={paragraph}>
          Treat people the way you&apos;d want to be treated. Disagreements happen, but there&apos;s no room for bullying, harassment, or hate speech on UNLON. This includes targeting someone based on their race, religion, gender, sexual orientation, disability, or any other personal characteristic.
        </p>
        <p style={paragraph}>
          If someone asks you to stop, stop. Boundaries matter here.
        </p>

        {/* 2 */}
        <h2 style={sectionTitle}>2. Keep It Real</h2>
        <p style={paragraph}>
          Be yourself. Seriously. No fake profiles, no catfishing, no pretending to be someone you&apos;re not. Don&apos;t impersonate other users, celebrities, or public figures. If we find out your profile is fake, it&apos;s getting taken down.
        </p>
        <p style={paragraph}>
          Use real photos of yourself. Stock images, AI-generated faces, and other people&apos;s photos don&apos;t count.
        </p>

        {/* 3 */}
        <h2 style={sectionTitle}>3. Consent Matters</h2>
        <p style={paragraph}>
          Don&apos;t screenshot and share private conversations without the other person&apos;s permission. Don&apos;t share someone&apos;s personal information (phone number, address, photos) without their consent. Respect people&apos;s boundaries in chats and audio rooms.
        </p>
        <p style={paragraph}>
          If someone isn&apos;t interested, take the L gracefully and move on. Nobody owes you a conversation.
        </p>

        {/* 4 */}
        <h2 style={sectionTitle}>4. No Explicit Content</h2>
        <p style={paragraph}>
          Keep it clean. No nudity, no sexually explicit photos or messages, no sexual solicitation. This applies to profile pictures, chat messages, confessions, and audio rooms. UNLON is not that kind of app.
        </p>
        <p style={paragraph}>
          Suggestive content that clearly crosses into explicit territory will be removed, and repeat offenders will be banned.
        </p>

        {/* 5 */}
        <h2 style={sectionTitle}>5. No Spam</h2>
        <p style={paragraph}>
          Don&apos;t use UNLON to promote products, run ads, or send chain messages. No commercial solicitation, no MLM pitches, no &ldquo;join my channel&rdquo; spam. This is a social app, not a marketplace.
        </p>
        <p style={paragraph}>
          Automated accounts, bots, and scripts are not allowed.
        </p>

        {/* 6 */}
        <h2 style={sectionTitle}>6. Anonymous Does Not Mean Consequence-Free</h2>
        <p style={paragraph}>
          Confessions and anonymous features are for sharing real thoughts, not for tearing people down. Your identity may be hidden from other users, but we still know who posted what. Anonymous content is monitored for safety and is subject to the same rules as everything else.
        </p>
        <p style={paragraph}>
          Using anonymity to harass, threaten, or target someone will result in immediate action against your account.
        </p>

        {/* 7 */}
        <h2 style={sectionTitle}>7. Report Bad Behavior</h2>
        <p style={paragraph}>
          See something that doesn&apos;t belong? Use the report button. Every report is reviewed by our team, and we aim to investigate and take action within 48 hours. You can report profiles, messages, confessions, and audio room behavior.
        </p>
        <p style={paragraph}>
          Filing false reports to get someone unfairly banned is itself a violation and will be treated accordingly.
        </p>

        {/* 8 */}
        <h2 style={sectionTitle}>8. Zero Tolerance</h2>
        <p style={paragraph}>The following will result in immediate and permanent action:</p>
        <ul style={list}>
          <li style={{ marginBottom: '0.4rem' }}>Threats of violence or physical harm</li>
          <li style={{ marginBottom: '0.4rem' }}>Doxxing (sharing someone&apos;s private information to harm them)</li>
          <li style={{ marginBottom: '0.4rem' }}>Underage users (under 13) or any form of child exploitation</li>
          <li style={{ marginBottom: '0.4rem' }}>Illegal activity of any kind (drug dealing, scams, fraud)</li>
          <li style={{ marginBottom: '0.4rem' }}>Sharing non-consensual intimate images</li>
          <li>Terrorism-related content or extremist recruitment</li>
        </ul>
        <p style={paragraph}>
          There are no warnings for these. Your account will be terminated and we will cooperate with law enforcement if needed.
        </p>

        {/* 9 */}
        <h2 style={sectionTitle}>9. What Happens When You Break the Rules</h2>
        <p style={paragraph}>
          For most violations, we follow a progressive approach:
        </p>
        <ul style={list}>
          <li style={{ marginBottom: '0.4rem' }}><strong>First offense:</strong> Warning and content removal</li>
          <li style={{ marginBottom: '0.4rem' }}><strong>Second offense:</strong> Temporary suspension (24 hours to 7 days depending on severity)</li>
          <li><strong>Third offense:</strong> Permanent ban</li>
        </ul>
        <p style={paragraph}>
          Severe violations (see Zero Tolerance above) skip straight to a permanent ban.
        </p>

        {/* 10 */}
        <h2 style={sectionTitle}>10. Appeal Process</h2>
        <p style={paragraph}>
          Think we got it wrong? You can appeal a suspension or ban by emailing{' '}
          <a href="mailto:atulbachhraj@gmail.com" style={{ color: '#FF7040', textDecoration: 'underline' }}>
            atulbachhraj@gmail.com
          </a>{' '}
          within 7 days of the action. Include your username and explain why you believe the decision should be reversed. We&apos;ll review your appeal and get back to you within 7 business days.
        </p>
        <p style={paragraph}>
          Appeals for Zero Tolerance violations are reviewed but are very rarely overturned.
        </p>

        {/* Closing */}
        <div
          style={{
            marginTop: '2rem',
            padding: '1.25rem',
            background: 'rgba(255,80,32,0.06)',
            borderRadius: '0.75rem',
            border: '1px solid rgba(255,80,32,0.12)',
          }}
        >
          <p style={{ ...paragraph, marginBottom: 0, textAlign: 'center' }}>
            UNLON is what we make it together. Be kind, be real, and look out for each other. If you see something wrong, say something. Let&apos;s keep this space worth coming back to.
          </p>
        </div>
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
        <Link href="/privacy" style={{ color: 'rgba(255,243,236,0.35)', fontSize: '0.8rem', textDecoration: 'none' }}>
          Privacy Policy
        </Link>
      </div>
    </div>
  );
}
