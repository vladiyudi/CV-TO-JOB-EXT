import React from 'react';

function PrivacyPolicy() {
  const styles = {
    container: {
      maxWidth: '800px',
      margin: '20px auto',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
      lineHeight: '1.6',
    },
    heading1: {
      color: '#333',
      marginBottom: '20px',
      fontSize: '28px',
    },
    heading2: {
      color: '#444',
      marginTop: '20px',
      marginBottom: '10px',
      fontSize: '22px',
    },
    paragraph: {
      marginBottom: '15px',
      fontSize: '16px',
    },
    list: {
      marginBottom: '20px',
      paddingLeft: '20px',
    },
    listItem: {
      marginBottom: '10px',
    },
    bold: {
      fontWeight: 'bold',
    },
  };

  return (
    <div style={styles.container} className='rajdhani-regular'>
      <h1 style={styles.heading1}>Privacy Policy for SuperCV Chrome Extension and Web App</h1>
      <p style={styles.paragraph}><span style={styles.bold}>Effective Date:</span> 10/10/2024</p>

      <p style={styles.paragraph}>At <span style={styles.bold}>SuperCV</span>, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you use our Chrome extension.</p>

      <h2 style={styles.heading2}>1. Information We Collect</h2>
      <p style={styles.paragraph}>When you use the <span style={styles.bold}>SuperCV</span> extension, we may collect the following information:</p>
      <ul style={styles.list}>
        <li style={styles.listItem}><span style={styles.bold}>Job Descriptions:</span> When capturing job descriptions from LinkedIn to tailor your CV.</li>
        <li style={styles.listItem}><span style={styles.bold}>Personal Information:</span> When you log in using your Google account, we collect your email and basic profile information (name, profile picture) through Google OAuth 2.0.</li>
        <li style={styles.listItem}><span style={styles.bold}>CV Data:</span> Any CV data you choose to upload or generate through the extension.</li>
        <li style={styles.listItem}><span style={styles.bold}>Usage Data:</span> Non-personally identifiable data such as browsing activity on LinkedIn job pages and how you interact with the extension.</li>
      </ul>

      <h2 style={styles.heading2}>2. How We Use Your Information</h2>
      <p style={styles.paragraph}>We use the information collected to:</p>
      <ul style={styles.list}>
        <li style={styles.listItem}>Provide the primary service of tailoring your CV based on job descriptions from LinkedIn.</li>
        <li style={styles.listItem}>Generate PDFs of your tailored CVs.</li>
        <li style={styles.listItem}>Store your preferences and settings for a better user experience.</li>
        <li style={styles.listItem}>Improve the performance and functionality of the extension.</li>
      </ul>

      <h2 style={styles.heading2}>3. Data Storage and Security</h2>
      <p style={styles.paragraph}>We store your data securely on trusted servers and use encryption to protect sensitive information. We do not sell or share your personal data with third parties except as required for the functioning of the extension (e.g., Google APIs) or by law.</p>

      <h2 style={styles.heading2}>4. Third-Party Services</h2>
      <p style={styles.paragraph}><span style={styles.bold}>SuperCV</span> interacts with third-party services including:</p>
      <ul style={styles.list}>
        <li style={styles.listItem}><span style={styles.bold}>Google OAuth 2.0</span> for user authentication.</li>
        <li style={styles.listItem}><span style={styles.bold}>Google APIs</span> for accessing your Google profile and generating PDFs.</li>
        <li style={styles.listItem}>Any other APIs necessary for tailoring and submitting your CV to job applications.</li>
      </ul>

      <h2 style={styles.heading2}>5. Your Rights</h2>
      <p style={styles.paragraph}>You have the right to:</p>
      <ul style={styles.list}>
        <li style={styles.listItem}>Access and modify the information you provide through the extension.</li>
        <li style={styles.listItem}>Request the deletion of your personal data from our servers.</li>
        <li style={styles.listItem}>Revoke access to your Google account by managing your permissions through Google.</li>
      </ul>

      <h2 style={styles.heading2}>6. Changes to this Privacy Policy</h2>
      <p style={styles.paragraph}>We may update this policy from time to time. Any changes will be posted on this page, and the updated policy will take effect immediately upon posting.</p>

      <h2 style={styles.heading2}>7. Contact Us</h2>
      <p style={styles.paragraph}>If you have any questions or concerns about this Privacy Policy, please contact us at privacy@conversation-design.tech.</p>
    </div>
  );
}

export default PrivacyPolicy;
