// src/app/refund/page.tsx
import LegalPage from '@/components/LegalPage';

export const metadata = { title: 'Refund & Cancellation Policy | UBFSF', description: 'Cancellation and refund terms for UBFSF programs, donations, and services.' };

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="Refund & Cancellation Policy"
      subtitle="Refund eligibility, timeframes, and step-by-step cancellation procedures for all of our programs, services, and donations."
      updated="September 13, 2026"
      sections={[{
        title: '1. Who This Policy Covers',
        body: ['This policy applies to all UBFSF programs, services, training conference registrations, and paid offerings received through our website (ubfsf.org). It does not apply to donations processed through our third-party payment processor, which are governed separately below.', 'We strongly encourage all customers to review all terms carefully before purchasing or registering for any program.'],
      }, {
        title: '2. Refund Eligibility Timeframes',
        body: [
          'Refund eligibility depends on the type of service or program purchased. The timeframes below are subject to the specific terms of any individual program offering. Where a program offers a separate published refund policy, that policy supersedes this general overview.',
        ],
        bullets: [
          'Conference or program registration: Full refund available if you cancel at least 48 hours before the event start date. Cancellations within 48 hours of an event are generally not eligible for a refund unless exceptional circumstances are approved by UBFSF in writing.',
          'Coaching or training services: Refund eligibility depends on the terms of the specific engagement. Please review your service agreement and contact us before disputing charges.',
          'Physical merchandise (if any): Refund eligibility depends on condition and inventory constraints at time of return, subject to applicable state law.',
        ],
      }, {
        title: '3. How to Request a Refund or Cancellation',
        body: [
          'To request a refund or cancellation, please follow these steps:',
        ],
        bullets: [
          'Step 1 — Contact us by email at news@ubfsf.org or by phone at 1-918-924-5872.',
          'Step 2 — In your request, include your full name, the program or service in question, the date of purchase/registration, and the reason for your refund request.',
          'Step 3 — Allow up to 10 business days for us to review your request and respond.',
          'Step 4 — If approved, refunds are typically issued to the original payment method within 5–10 business days of approval, depending on your financial institution.',
        ],
      }, {
        title: '4. Non-Refundable and Limited-Refund Items',
        body: [
          'Certain items and situations are non-refundable by policy, including but not limited to:',
        ],
        bullets: [
          'Donations, unless excess or duplicate contributions are made — handled directly by our payment processor.',
          'Program seats or materials that have already been delivered in full where partial service was rendered and accepted.',
          'Cancellations made after the applicable deadline for the program in question.',
        ],
      }, {
        title: '5. Donations',
        body: [
          'All charitable donations made to UBFSF through our website are generally non-refundable. Donations are processed securely by our third-party payment processor, GiveLively. If you believe a donation was made in error — for example, a duplicate charge — please contact us immediately at news@ubfsf.org or 1-918-924-5872. Where required by applicable law, consumer refund rights may not be waived by this policy.',
        ],
      }, {
        title: '6. Coupon, Promo, and Discount Codes',
        body: [
          'Discounts and promo codes are subject to the terms of the specific offer and may not be combined unless expressly stated. Refunds on purchases made with a discount code may be issued net of the discount amount, at our discretion.',
        ],
      }, {
        title: '7. Our Commitment to Fairness',
        body: [
          'If you are dissatisfied for any other reason not covered by the above, please contact us at news@ubfsf.org. We will review your case on its merits and do our best to reach a fair resolution, within our discretion. We believe in standing behind our programs and treating every supporter and participant fairly.',
        ],
      }, {
        title: '8. Complaints and Disputes',
        body: [
          'If you are unable to resolve a refund issue with us directly, you have the right to escalate the matter to the appropriate consumer protection authority in your jurisdiction (for example, your state Attorney General\'s office or the FTC in the United States). Questions? Contact us at news@ubfsf.org or 1-918-924-5872.',
        ],
      }, {
        title: '9. Changes to This Policy',
        body: [
          'We may update this policy from time to time. Any changes will be posted on this page with an updated "last updated" date. Continued use of our services after any change constitutes acceptance of the updated policy.',
        ],
      }, {
        title: '10. Contact',
        body: [
          'Questions about refunds or cancellations? Email news@ubfsf.org or call 1-918-924-5872.',
        ],
      }]}
    />
  );
}