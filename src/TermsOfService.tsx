import React, { useEffect } from 'react';
import styled from 'styled-components';
import SectionDivider from './components/SectionDivider';

// Simple event-based navigation helper
const navigate = (path: string) => {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
};

const PolicyContainer = styled.div`
  background-color: #ffffff;
  color: #333333;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  padding-top: 100px; /* Header space */
  padding-bottom: 100px;
`;

const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
  
  h1 {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 40px;
    background: linear-gradient(90deg, #111, #555);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  h2 {
    font-size: 1.8rem;
    color: #111;
    margin-top: 40px;
    margin-bottom: 20px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding-bottom: 10px;
  }

  p {
    font-size: 1.1rem;
    line-height: 1.8;
    margin-bottom: 20px;
    color: #444;
  }

  ul {
    list-style-type: disc;
    padding-left: 20px;
    margin-bottom: 20px;
    
    li {
      margin-bottom: 10px;
      color: #444;
    }
  }
`;

const BackButton = styled.a`
  display: inline-block;
  margin-bottom: 40px;
  color: #111;
  text-decoration: none;
  font-weight: 500;
  opacity: 0.7;
  transition: opacity 0.3s;
  cursor: pointer;
  
  &:hover {
    opacity: 1;
    text-decoration: underline;
  }
`;

const TermsOfService = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <PolicyContainer>
      <ContentWrapper>
        <BackButton href="/" onClick={handleBack}>← Back to Home</BackButton>

        <h1>Terms of Service</h1>

        <p><strong>Effective Date:</strong> {new Date().getFullYear()}-01-01</p>

        <p>
          Welcome to Pajzo! These Terms of Service ("Terms") govern your use of our website and services. By accessing or using our services, you agree to be bound by these Terms.
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>By using our services, you confirm that you accept these Terms and that you agree to comply with them. If you do not agree to these Terms, you must not use our services.</p>

        <h2>2. Changes to Terms</h2>
        <p>We may modify these Terms at any time. We will post the revised Terms on this page and update the "Effective Date" above. Your continued use of our services after any changes constitutes your acceptance of the new Terms.</p>

        <h2>3. Use of Services</h2>
        <p>You agree to use our services only for lawful purposes along with the following conditions:</p>
        <ul>
          <li>You must not misuse our services or help anyone else do so.</li>
          <li>You agree not to disrupt or interfere with the security or operation of our services.</li>
          <li>You are responsible for any content you transmit through our services.</li>
        </ul>

        <h2>4. Intellectual Property</h2>
        <p>
          All content, features, and functionality of our services, including text, graphics, logos, and software, are the exclusive property of Pajzo and its licensors and are protected by international copyright, trademark, and other intellectual property laws.
        </p>

        <h2>5. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, in no event will Pajzo, its affiliates, officers, employees, or agents be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the services.
        </p>

        <h2>6. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at:
        </p>
        <p>
          <strong>Pajzo</strong><br />
          Email: info@pajzo.com
        </p>

        <div style={{ height: '50px' }}></div>
      </ContentWrapper>

      <SectionDivider variant="curve" />

    </PolicyContainer>
  );
};

export default TermsOfService;
