import type { PrivacySection } from "@/type/privacy.type"

export const PRIVACY = {
  title: "Privacy",
  description:
    "What this site collects when you book a call, who else sees it, and how to see, fix or delete your details.",
  lastUpdated:
    "Last updated: [launch date]. If this page changes, this date changes too.",
  sections: [
    {
      heading: "What I collect",
      body: "When you book a call, the booking tool asks for your name, your email and any notes you add. I use them only to hold the call and reply to you. I don't sell your data.",
    },
    {
      heading: "Who else sees it",
      body: "Cal.com runs the booking, so it keeps your booking details under its own privacy policy. The company that hosts this site keeps basic server logs, like any website. If you email me, your message stays in my inbox. No one else gets your details.",
    },
    {
      heading: "Visit counts and cookies",
      body: 'This site counts visits with [analytics tool, named before launch], which doesn\'t use cookies. There are no ad or tracking cookies, and nothing here follows you to other sites, so a "Do Not Track" setting changes nothing. The booking popup comes from Cal.com, which may set its own cookies so booking works.',
    },
    {
      heading: "Your choices",
      body: "Email me to see, fix or delete the details I have about you. I'll reply within 24 hours.",
    },
    {
      heading: "Questions",
      body: "Email me at hello@criztian.dev with any question about your data.",
    },
  ] satisfies PrivacySection[],
}
