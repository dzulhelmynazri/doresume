export const INBOX_CATEGORIES = [
  "VERIFICATION",
  "REJECTION",
  "INTERVIEW",
  "ASSESSMENT",
  "REMINDER",
  "OFFER",
  "APPLIED",
] as const;

export type InboxCategory = (typeof INBOX_CATEGORIES)[number];

export const INBOX_FILTERS = [
  { label: "All", value: "all" },
  { label: "Verification", value: "VERIFICATION" },
  { label: "Rejection", value: "REJECTION" },
  { label: "Interview", value: "INTERVIEW" },
  { label: "Assessment", value: "ASSESSMENT" },
  { label: "Reminder", value: "REMINDER" },
  { label: "Offer", value: "OFFER" },
  { label: "Applied", value: "APPLIED" },
] as const;

export type InboxFilter = (typeof INBOX_FILTERS)[number]["value"];

export interface InboxMail {
  category: InboxCategory;
  date: string;
  email: string;
  name: string;
  subject: string;
  teaser: string;
}

export const INBOX_MAILS: InboxMail[] = [
  {
    category: "INTERVIEW",
    date: "09:34 AM",
    email: "williamsmith@example.com",
    name: "William Smith",
    subject: "Meeting Tomorrow",
    teaser:
      "Hi team, just a reminder about our meeting tomorrow at 10 AM.\nPlease come prepared with your project updates.",
  },
  {
    category: "APPLIED",
    date: "Yesterday",
    email: "alicesmith@example.com",
    name: "Alice Smith",
    subject: "Re: Project Update",
    teaser:
      "Thanks for the update. The progress looks great so far.\nLet's schedule a call to discuss the next steps.",
  },
  {
    category: "REMINDER",
    date: "2 days ago",
    email: "bobjohnson@example.com",
    name: "Bob Johnson",
    subject: "Weekend Plans",
    teaser:
      "Hey everyone! I'm thinking of organizing a team outing this weekend.\nWould you be interested in a hiking trip or a beach day?",
  },
  {
    category: "ASSESSMENT",
    date: "2 days ago",
    email: "emilydavis@example.com",
    name: "Emily Davis",
    subject: "Re: Question about Budget",
    teaser:
      "I've reviewed the budget numbers you sent over.\nCan we set up a quick call to discuss some potential adjustments?",
  },
  {
    category: "OFFER",
    date: "1 week ago",
    email: "michaelwilson@example.com",
    name: "Michael Wilson",
    subject: "Important Announcement",
    teaser:
      "Please join us for an all-hands meeting this Friday at 3 PM.\nWe have some exciting news to share about the company's future.",
  },
  {
    category: "VERIFICATION",
    date: "1 week ago",
    email: "sarahbrown@example.com",
    name: "Sarah Brown",
    subject: "Re: Feedback on Proposal",
    teaser:
      "Thank you for sending over the proposal. I've reviewed it and have some thoughts.\nCould we schedule a meeting to discuss my feedback in detail?",
  },
  {
    category: "REJECTION",
    date: "1 week ago",
    email: "davidlee@example.com",
    name: "David Lee",
    subject: "New Project Idea",
    teaser:
      "I've been brainstorming and came up with an interesting project concept.\nDo you have time this week to discuss its potential impact and feasibility?",
  },
  {
    category: "INTERVIEW",
    date: "1 week ago",
    email: "oliviawilson@example.com",
    name: "Olivia Wilson",
    subject: "Vacation Plans",
    teaser:
      "Just a heads up that I'll be taking a two-week vacation next month.\nI'll make sure all my projects are up to date before I leave.",
  },
  {
    category: "VERIFICATION",
    date: "1 week ago",
    email: "jamesmartin@example.com",
    name: "James Martin",
    subject: "Re: Conference Registration",
    teaser:
      "I've completed the registration for the upcoming tech conference.\nLet me know if you need any additional information from my end.",
  },
  {
    category: "APPLIED",
    date: "1 week ago",
    email: "sophiawhite@example.com",
    name: "Sophia White",
    subject: "Team Dinner",
    teaser:
      "To celebrate our recent project success, I'd like to organize a team dinner.\nAre you available next Friday evening? Please let me know your preferences.",
  },
];
