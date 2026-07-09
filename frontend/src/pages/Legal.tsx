import React from 'react';

type LegalPageProps = {
  title: string;
  content: React.ReactNode;
};

export const LegalPage: React.FC<LegalPageProps> = ({ title, content }) => {
  return (
    <div className="legal-page">
      <div className="container legal-container">
        <div className="legal-header">
          <h1>{title}</h1>
          <p>Dimpho ke Lesego Catering</p>
        </div>
        <div className="legal-content">
          {content}
        </div>
      </div>
    </div>
  );
};

export const PrivacyPolicy = () => (
  <LegalPage 
    title="Privacy Policy"
    content={
      <>
        <p>Last Updated: {new Date().toLocaleDateString()}</p>
        <h2>1. Introduction</h2>
        <p>Welcome to Dimpho ke Lesego Catering. We are committed to protecting your personal information and your right to privacy.</p>
        
        <h2>2. Information We Collect</h2>
        <p>We collect personal information that you provide to us, such as name, address, contact information, passwords and security data, and payment information.</p>
        
        <h2>3. How We Use Your Information</h2>
        <p>We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
        
        <h2>4. Will Your Information Be Shared With Anyone?</h2>
        <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>
      </>
    }
  />
);

export const TermsAndConditions = () => (
  <LegalPage 
    title="Terms & Conditions"
    content={
      <>
        <p>Last Updated: {new Date().toLocaleDateString()}</p>
        <h2>1. Agreement to Terms</h2>
        <p>These Terms and Conditions constitute a legally binding agreement made between you and Dimpho ke Lesego Catering, concerning your access to and use of our website and catering services.</p>
        
        <h2>2. Services</h2>
        <p>We provide professional catering services. All quotes provided are subject to our availability and must be formally accepted before services are secured.</p>
        
        <h2>3. Payment Terms</h2>
        <p>A deposit is required to secure your booking. Full payment details and deadlines will be outlined in your final quote and invoice.</p>
        
        <h2>4. Cancellations</h2>
        <p>Please refer to our Refund Policy for detailed information regarding cancellations and deposits.</p>
      </>
    }
  />
);

export const RefundPolicy = () => (
  <LegalPage 
    title="Refund Policy"
    content={
      <>
        <p>Last Updated: {new Date().toLocaleDateString()}</p>
        <h2>1. Deposit and Booking</h2>
        <p>A non-refundable deposit of 50% is required to secure your event date. This deposit covers initial planning, ingredient sourcing, and secures our team's availability.</p>
        
        <h2>2. Cancellations</h2>
        <p>If you cancel your event more than 14 days before the scheduled date, you will not be billed for the remaining balance. The initial 50% deposit remains non-refundable.</p>
        <p>Cancellations made within 14 days of the event will be charged the full amount, as preparations and food orders will have already been finalized.</p>
        
        <h2>3. Changes to Guest Count</h2>
        <p>Final guest counts must be provided 7 days prior to the event. Reductions in guest counts after this time will not result in a refund, as ingredients will have already been purchased based on the initial count.</p>
        
        <h2>4. Exceptions</h2>
        <p>In the rare event that Dimpho ke Lesego Catering must cancel services due to unforeseen extreme circumstances, a full refund (including the deposit) will be issued immediately.</p>
      </>
    }
  />
);

export const AccessibilityStatement = () => (
  <LegalPage 
    title="Accessibility Statement"
    content={
      <>
        <p>Last Updated: {new Date().toLocaleDateString()}</p>
        <h2>Our Commitment</h2>
        <p>Dimpho ke Lesego Catering is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone, and applying the relevant accessibility standards.</p>
        
        <h2>Conformance Status</h2>
        <p>The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. We strive to maintain WCAG 2.1 Level AA conformance.</p>
        
        <h2>Feedback</h2>
        <p>We welcome your feedback on the accessibility of our website. Please let us know if you encounter accessibility barriers by contacting us via our contact page.</p>
      </>
    }
  />
);
