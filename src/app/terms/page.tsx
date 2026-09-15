// src/app/terms/page.tsx
import LegalPage from '@/components/LegalPage';

export const metadata = {
  title: 'Terms & Conditions | UBFSF',
  description: 'Terms and conditions for using the United Black Family Scholarship Foundation website.',
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      subtitle="The rules for using ubfsf.org, our content, and our programs."
      updated="September 13, 2026"
      sections={[
        {
          title: '1. Acceptance of Terms',
          body: [
            'By accessing or using this website (ubfsf.org) you agree to these Terms & Conditions. If you do not agree, please discontinue use of the site. We may update these terms from time to time; continued use after updates take effect constitutes acceptance.',
          ],
        },
        {
          title: '2. About Us',
          body: [
            'The United Black Family Scholarship Foundation (UBFSF) is a 501(c)(3) nonprofit organization with a mailing address of P.O. Box 862, Bristow, OK 74010, United States.',
          ],
        },
        {
          title: '3. Use of the Website',
          body: [
            'You agree to use the website only for lawful purposes and in a manner that does not disrupt its operation or infringe the rights of others. You may not:',
          ],
          bullets: [
            'Attempt to access restricted areas, data, or administrative functions.',
            'Interfere with the security, performance, or availability of the site.',
            'Use automated tools or scrapers in a manner that degrades service for other users.',
            'Impersonate UBFSF or its representatives.',
            'Submit false, misleading, or unlawful information through our forms.',
          ],
        },
        {
          title: '4. Content and Intellectual Property',
          body: [
            'Unless otherwise stated, all text, images, graphics, logos, video, and other materials on this website are owned by or licensed to UBFSF and are protected by applicable intellectual property laws.',
            'You may share links to our public content on social media. You may not reproduce, republish, or commercially exploit our content without prior written permission, except where otherwise expressly permitted (for example, quotes clearly attributed to UBFSF or its named participants).',
          ],
        },
        {
          title: '5. Donations and Payments',
          body: [
            'Donations are processed securely through our payment processor, GiveLively. By donating, you agree to GiveLively\'s terms of service as well as these terms. All donations are made voluntarily and, unless otherwise stated, are non-refundable except as described in our Refund & Cancellation Policy.',
          ],
        },
        {
          title: '6. Disclaimer of Warranties and Liability',
          body: [
            'This website, its content, and its programs are provided on an "as is" basis, without warranties of any kind, express or implied. UBFSF does not guarantee any particular outcome from its programs, coaching, or materials. Program content is educational and informational in nature and is not a substitute for professional medical, legal, financial, or mental-health advice.',
            'To the maximum extent permitted by law, UBFSF is not liable for direct, indirect, incidental, or consequential damages arising from your use of this website or reliance on its content.',
          ],
        },
        {
          title: '7. User-Submitted Content',
          body: [
            'By submitting content to us (for example, messages, testimonials, or comments), you grant UBFSF a non-exclusive, royalty-free, worldwide license to use, reproduce, and display that content in connection with our mission. Do not submit content you do not have the right to share.',
          ],
        },
        {
          title: '8. Privacy and Data Protection',
          body: [
            'Your use of this website is also governed by our Privacy Policy and Cookie Policy, both of which are incorporated into these terms by reference. We process personal data in accordance with applicable law, including the GDPR, UK GDPR, and CCPA/CPRA where they apply.',
          ],
        },
        {
          title: '9. Third-Party Links and Services',
          body: [
            'This website may link to or embed third-party services (for example, Beehiiv newsletters, GiveLively donations, YouTube videos, or Web3Forms submissions). We are not responsible for the content, privacy practices, or availability of third-party services. Your use of those services is subject to their own terms and privacy policies.',
          ],
        },
        {
          title: '10. Governing Law and Dispute Resolution',
          body: [
            'These Terms & Conditions are governed by the laws of the State of Oklahoma, United States of America, without regard to conflict-of-laws rules.',
            'If a dispute arises, we encourage you to contact us first at news@ubfsf.org so we can attempt an amicable resolution. Any legal disputes not resolved informally shall be subject to the exclusive jurisdiction of the courts of the State of Oklahoma, to the extent permitted by law. Nothing in these terms limits any mandatory consumer-protection rights you may hold under the law applicable to you.',
          ],
        },
        {
          title: '11. Severability and Contact',
          body: [
            'If any provision of these terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect. Questions? Contact us at news@ubfsf.org or 1-918-924-5872.',
          ],
        },
      ]}
    />
  );
}