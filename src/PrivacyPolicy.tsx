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

const PrivacyPolicy = () => {

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

                <h1>Privacy Policy</h1>

                <p><strong>Effective Date:</strong> {new Date().getFullYear()}-01-01</p>

                <p>
                    At Pajzo ("we," "our," or "us"), we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
                </p>

                <h2>1. Information We Collect</h2>
                <p>We may collect information about you in a variety of ways. The information we may collect includes:</p>
                <ul>
                    <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, and telephone number, that you voluntarily give to us when you register with the site or our mobile application or when you choose to participate in various activities related to the site and our mobile application.</li>
                    <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the site.</li>
                </ul>

                <h2>2. Use of Your Information</h2>
                <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the site to:</p>
                <ul>
                    <li>Create and manage your account.</li>
                    <li>Process your orders and delivering services.</li>
                    <li>Email you regarding your account or order.</li>
                    <li>Fulfill and manage purchases, orders, payments, and other transactions related to the site.</li>
                    <li>Generate a personal profile about you to make future visits to the site more personalized.</li>
                    <li>Monitor and analyze usage and trends to improve your experience with the site.</li>
                </ul>

                <h2>3. Disclosure of Your Information</h2>
                <p>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
                <ul>
                    <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.</li>
                    <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.</li>
                </ul>

                <h2>4. Security of Your Information</h2>
                <p>
                    We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                </p>

                <h2>5. Policy for Children</h2>
                <p>
                    We do not knowingly solicit information from or market to children under the age of 13. If you become aware of any data we have collected from children under age 13, please contact us using the contact information provided below.
                </p>

                <h2>6. Contact Us</h2>
                <p>
                    If you have questions or comments about this Privacy Policy, please contact us at:
                </p>
                <p>
                    <strong>Pajzo</strong><br />
                    Email: info@pajzo.com<br />
                    Phone: +386 71 391 382
                </p>

                <div style={{ height: '50px' }}></div>
            </ContentWrapper>

            <SectionDivider variant="curve" />

        </PolicyContainer>
    );
};

export default PrivacyPolicy;
