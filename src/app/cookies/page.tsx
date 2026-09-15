// src/app/cookies/page.tsx
import LegalPage from '@/components/LegalPage';

export const metadata = {
  title: 'Cookie Policy | UBFSF',
  description: 'The cookies and similar technologies used on ubfsf.org and how you can control them.',
};

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      subtitle="The cookies and similar technologies we use, why we use them, and how to control them."
      updated="September 13, 2026"
      sections={[
        {
          title: '1. What Are Cookies?',
          body: [
            'Cookies are small text files placed on your device by websites to remember information between visits. "Similar technologies" include local storage (for example, saved preferences on your device) and third-party embeds that may set their own cookies.',
          ],
        },
        {
          title: '2. Our Approach: Consent First',
          body: [
            'We are committed to transparency. We do not use advertising networks or cross-site tracking pixels on this website. Optional third-party content — such as embedded videos or the newsletter signup form — is blocked until you actively consent.',
            'When you first visit, you can choose "Accept All," "Reject All," or "Manage Preferences." You can change your choices at any time via the cookie settings banner. The categories below describe each type of technology we use.',
          ],
        },
        {
          title: '3. Essential / Functional',
          body: [
            'These technologies are required for core site functionality and are always active. They do not track you across sites.',
          ],
          bullets: [
            'Consent preference storage — remembers your cookie choices on your device (local storage). Duration: until you clear your browser data or change your preferences.',
            'Theme preference — remembers whether you selected light or dark display mode (local storage). Duration: until changed.',
            'GiveLively donation widget — our secure payment processor sets its own technical/functional cookies when you interact with the donation form. Duration: session / as set by GiveLively.',
            'Web3Forms contact form — transmits your message; does not set tracking cookies.',
          ],
        },
        {
          title: '4. Marketing / Third-Party Embeds (consent required)',
          body: [
            'These load only after you accept marketing cookies or choose to load the specific embed:',
          ],
          bullets: [
            'Beehiiv (newsletter signup iframe) — may set cookies for subscription preferences and analytics. Duration: as set by Beehiiv.',
            'YouTube embedded videos — may set cookies (including for video preferences and, if you are signed in, Google account preferences). Duration: as set by YouTube/Google.',
          ],
        },
        {
          title: '5. Analytics / Advertising',
          body: [
            'We do not currently run web analytics scripts, advertising pixels, or cross-site tracking on this website. If we add analytics in the future, we will update this policy and require your consent before loading them.',
          ],
        },
        {
          title: '6. How to Manage or Delete Cookies',
          body: [
            'You can manage your choices on this site using the cookie settings banner (the button is available in the footer), or through your browser\'s cookie settings. To reject cookies entirely in your browser, consult your browser\'s help documentation. You can also clear cookies and cached data for ubfsf.org at any time.',
          ],
        },
        {
          title: '7. Contact',
          body: [
            'Questions about this Cookie Policy? Email news@ubfsf.org or call 1-918-924-5872.',
          ],
        },
      ]}
    />
  );
}