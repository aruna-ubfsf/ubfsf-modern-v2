// src/app/privacy/page.tsx
import LegalPage from '@/components/LegalPage';

export const metadata = {
  title: 'Privacy Policy | UBFSF',
  description: 'How the United Black Family Scholarship Foundation collects, uses, stores, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      subtitle="How we collect, use, store, and protect your personal information — and the rights you hold over it."
      updated="September 13, 2026"
      sections={[
        {
          title: '1. Who We Are',
          body: [
            'This Privacy Policy applies to the United Black Family Scholarship Foundation ("UBFSF," "we," "our," or "us"), a 501(c)(3) nonprofit organization. Our website (ubfsf.org) is operated for the purposes of sharing our mission, programs, news, and opportunities to donate, volunteer, or subscribe.',
            'Official contact information: United Black Family Scholarship Foundation, P.O. Box 862, Bristow, OK 74010, United States. Email: news@ubfsf.org. Phone: 1-918-924-5872.',
          ],
        },
        {
          title: '2. Information We Collect',
          body: [
            'We practice data minimization: we only collect the information needed to provide the service you request.',
          ],
          bullets: [
            'Contact form: name, email address, and the message you submit.',
            'Newsletter subscriptions (via our third-party provider Beehiiv): email address and subscription preferences.',
            'Donations (processed by our third-party payment processor GiveLively): name, email, billing address, donation amount, and payment method details. We never see or store your full card or bank details.',
            'Volunteer and program inquiries: information you voluntarily provide.',
            'Technical data: IP address, browser type, device type, and pages visited, collected through standard server logs for security and performance.',
          ],
        },
        {
          title: '3. How We Use Your Information',
          body: [
            'We use the information we collect solely for the following purposes:',
          ],
          bullets: [
            'Responding to inquiries you send through our contact form.',
            'Delivering newsletters and updates you have explicitly subscribed to.',
            'Processing donations and issuing donation receipts.',
            'Coordinating volunteer opportunities and program participation.',
            'Maintaining the security and proper functioning of our website.',
          ],
        },
        {
          title: '4. Cookies and Similar Technologies',
          body: [
            'Our website uses cookies and similar technologies as described in our Cookie Policy. We do not run advertising or cross-site tracking pixels on this website, and any optional third-party embeds (such as video streaming or newsletter signup forms) will only load after you give your consent.',
            'You can review our full Cookie Policy at /cookies and change your cookie preferences at any time using the cookie settings banner.',
          ],
        },
        {
          title: '5. Third-Party Services',
          body: [
            'We rely on the following vetted third-party services. Each has its own privacy policy, and we only share the minimum data required for the service to function:',
          ],
          bullets: [
            'Beehiiv — email newsletter delivery and subscription management.',
            'GiveLively — secure online donation processing.',
            'Web3Forms — contact form submission delivery.',
            'YouTube (Google) — embedded video playback on our program pages.',
          ],
        },
        {
          title: '6. Data Retention and Storage',
          body: [
            'We retain personal information only as long as necessary for the purpose for which it was collected, or as required by law (including applicable nonprofit, tax, and accounting record-keeping requirements):',
          ],
          bullets: [
            'Contact form messages: up to 24 months after the inquiry is resolved.',
            'Newsletter data: until you unsubscribe or request deletion, or after 24 months of inactivity.',
            'Donation records: as required by U.S. federal tax law and our accounting policies (typically 7 years).',
            'Server and security logs: up to 12 months.',
          ],
        },
{
          title: '7. Your Privacy Rights',
          body: [
            'Depending on where you reside, you may have the following rights over your personal information:',
          ],
          bullets: [
            'Right of Access — request a copy of the personal information we hold about you.',
            'Right to Rectification — request corrections to inaccurate or incomplete data.',
            'Right to Erasure ("Right to Be Forgotten") — request deletion of your personal data.',
            'Right to Object / Opt-Out — object to processing or withdraw consent at any time.',
            'California residents (CCPA/CPRA): the right to know, delete, and opt out of the sale or sharing of personal information. We do not sell personal information.',
            'EU/UK residents (GDPR/UK GDPR): the rights of access, rectification, erasure, restriction, data portability, and objection.',
          ],
        },
        {
          title: '8. How to Exercise Your Rights',
          body: [
            'To exercise any of the rights above, email privacy requests to news@ubfsf.org or write to P.O. Box 862, Bristow, OK 74010, United States. To help us protect your privacy, we may ask you to verify your identity before acting on a request.',
            'We typically respond within 30 days. For most requests there is no fee; a reasonable fee may apply only where permitted by law for manifestly unfounded or excessive requests.',
          ],
        },
        {
          title: '9. Data Security',
          body: [
            'We use appropriate technical and organizational measures to protect personal information, including HTTPS encryption in transit, access controls on any databases, and vetting of third-party processors. Donation payment data is handled exclusively by our PCI-DSS compliant payment processor and never stored by us.',
          ],
        },
        {
          title: "10. Children's Privacy",
          body: [
            'Our website and programs are directed at adults (18+). We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected data from a child, contact us and we will remove it promptly.',
          ],
        },
        {
          title: '11. International Transfers',
          body: [
            'Our organization is based in the United States. If you are located in the EU, UK, or another jurisdiction whose law imposes transfer restrictions, please be aware that data you submit may be stored or processed on servers in the United States. Where required (e.g., under the GDPR/UK GDPR), we rely on applicable adequacy or safeguard mechanisms.',
          ],
        },
        {
          title: '12. Policy Updates and Contact',
          body: [
            'We may update this Privacy Policy from time to time. Material changes will be noted by updating the "Last updated" date above. Continued use of this website after changes take effect constitutes acceptance of the updated policy.',
            'Questions? Contact: news@ubfsf.org or 1-918-924-5872.',
          ],
        },
      ]}
    />
  );
}