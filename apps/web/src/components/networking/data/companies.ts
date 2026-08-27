export interface CompanySection {
  heading: string;
  paragraphs: string[];
}

export interface CompanySocials {
  facebook: string | null;
  instagram: string | null;
  linkedin: string | null;
  website: string | null;
}

export interface CompanyRecruiter {
  id: string;
  linkedin: string;
  name: string;
  title: string;
}

export interface Company {
  id: string;
  industry: string;
  location: string;
  name: string;
  recruiters: CompanyRecruiter[];
  sections: CompanySection[];
  size: string;
  socials: CompanySocials;
}

const companySections = (name: string, industry: string): CompanySection[] => [
  {
    heading: "About",
    paragraphs: [
      `${name} is a ${industry.toLowerCase()} company hiring across product, engineering, and go-to-market. Use this profile to track recruiters and hiring managers you want to stay in touch with.`,
    ],
  },
  {
    heading: "Why network here",
    paragraphs: [
      `Warm intros and timely follow-ups matter more than cold volume. Keep notes on who owns recruiting for roles you care about, and revisit before you apply.`,
      `Ask about team structure, interview process, and what “good” looks like in the first 90 days — then tailor your outreach around those answers.`,
    ],
  },
];

const companyRecruiters = (
  companyId: string,
  people: { linkedin: string; name: string; title: string }[]
): CompanyRecruiter[] =>
  people.map((person, index) => ({
    ...person,
    id: `${companyId}-recruiter-${index + 1}`,
  }));

export const companies: Company[] = [
  {
    id: "1",
    industry: "Developer tools",
    location: "San Francisco, CA",
    name: "Vercel",
    recruiters: companyRecruiters("1", [
      {
        linkedin: "https://www.linkedin.com/in/example-vercel-recruiter",
        name: "Alex Rivera",
        title: "Technical Recruiter",
      },
      {
        linkedin: "https://www.linkedin.com/in/example-vercel-talent",
        name: "Jordan Lee",
        title: "Talent Partner, Engineering",
      },
    ]),
    sections: companySections("Vercel", "Developer tools"),
    size: "501–1,000",
    socials: {
      facebook: "https://www.facebook.com/vercel",
      instagram: "https://www.instagram.com/vercel",
      linkedin: "https://www.linkedin.com/company/vercel",
      website: "https://vercel.com",
    },
  },
  {
    id: "2",
    industry: "Technology",
    location: "Mountain View, CA",
    name: "Google",
    recruiters: companyRecruiters("2", [
      {
        linkedin: "https://www.linkedin.com/in/example-google-recruiter",
        name: "Sam Patel",
        title: "University Recruiter",
      },
      {
        linkedin: "https://www.linkedin.com/in/example-google-hiring",
        name: "Morgan Chen",
        title: "Technical Sourcer",
      },
      {
        linkedin: "https://www.linkedin.com/in/example-google-tpm",
        name: "Casey Brooks",
        title: "Recruiting Manager",
      },
    ]),
    sections: companySections("Google", "Technology"),
    size: "10,001+",
    socials: {
      facebook: "https://www.facebook.com/Google",
      instagram: "https://www.instagram.com/google",
      linkedin: "https://www.linkedin.com/company/google",
      website: "https://google.com",
    },
  },
  {
    id: "3",
    industry: "Technology",
    location: "Redmond, WA",
    name: "Microsoft",
    recruiters: companyRecruiters("3", [
      {
        linkedin: "https://www.linkedin.com/in/example-microsoft-recruiter",
        name: "Riley Nguyen",
        title: "Technical Recruiter",
      },
      {
        linkedin: "https://www.linkedin.com/in/example-microsoft-talent",
        name: "Avery Kim",
        title: "Senior Sourcer",
      },
    ]),
    sections: companySections("Microsoft", "Technology"),
    size: "10,001+",
    socials: {
      facebook: "https://www.facebook.com/Microsoft",
      instagram: "https://www.instagram.com/microsoft",
      linkedin: "https://www.linkedin.com/company/microsoft",
      website: "https://microsoft.com",
    },
  },
  {
    id: "4",
    industry: "Consumer electronics",
    location: "Cupertino, CA",
    name: "Apple",
    recruiters: companyRecruiters("4", [
      {
        linkedin: "https://www.linkedin.com/in/example-apple-recruiter",
        name: "Taylor Brooks",
        title: "Recruiting Partner",
      },
      {
        linkedin: "https://www.linkedin.com/in/example-apple-sourcer",
        name: "Jamie Ortiz",
        title: "Technical Sourcer",
      },
    ]),
    sections: companySections("Apple", "Consumer electronics"),
    size: "10,001+",
    socials: {
      facebook: "https://www.facebook.com/apple",
      instagram: "https://www.instagram.com/apple",
      linkedin: "https://www.linkedin.com/company/apple",
      website: "https://apple.com",
    },
  },
  {
    id: "5",
    industry: "Social media",
    location: "Menlo Park, CA",
    name: "Meta",
    recruiters: companyRecruiters("5", [
      {
        linkedin: "https://www.linkedin.com/in/example-meta-recruiter",
        name: "Quinn Morales",
        title: "Technical Recruiter",
      },
      {
        linkedin: "https://www.linkedin.com/in/example-meta-talent",
        name: "Harper Diaz",
        title: "Talent Acquisition Partner",
      },
    ]),
    sections: companySections("Meta", "Social media"),
    size: "10,001+",
    socials: {
      facebook: "https://www.facebook.com/Meta",
      instagram: "https://www.instagram.com/meta",
      linkedin: "https://www.linkedin.com/company/meta",
      website: "https://meta.com",
    },
  },
  {
    id: "6",
    industry: "E-commerce",
    location: "Seattle, WA",
    name: "Amazon",
    recruiters: companyRecruiters("6", [
      {
        linkedin: "https://www.linkedin.com/in/example-amazon-recruiter",
        name: "Drew Sullivan",
        title: "Recruiting Coordinator",
      },
      {
        linkedin: "https://www.linkedin.com/in/example-amazon-sourcer",
        name: "Cameron Blake",
        title: "Technical Sourcer",
      },
    ]),
    sections: companySections("Amazon", "E-commerce"),
    size: "10,001+",
    socials: {
      facebook: "https://www.facebook.com/Amazon",
      instagram: "https://www.instagram.com/amazon",
      linkedin: "https://www.linkedin.com/company/amazon",
      website: "https://amazon.com",
    },
  },
  {
    id: "7",
    industry: "Fintech",
    location: "San Francisco, CA",
    name: "Stripe",
    recruiters: companyRecruiters("7", [
      {
        linkedin: "https://www.linkedin.com/in/example-stripe-recruiter",
        name: "Reese Park",
        title: "Technical Recruiter",
      },
      {
        linkedin: "https://www.linkedin.com/in/example-stripe-talent",
        name: "Skyler Amin",
        title: "Talent Partner",
      },
    ]),
    sections: companySections("Stripe", "Fintech"),
    size: "5,001–10,000",
    socials: {
      facebook: null,
      instagram: "https://www.instagram.com/stripe",
      linkedin: "https://www.linkedin.com/company/stripe",
      website: "https://stripe.com",
    },
  },
  {
    id: "8",
    industry: "Productivity",
    location: "San Francisco, CA",
    name: "Notion",
    recruiters: companyRecruiters("8", [
      {
        linkedin: "https://www.linkedin.com/in/example-notion-recruiter",
        name: "Finley Cruz",
        title: "People Ops Recruiter",
      },
      {
        linkedin: "https://www.linkedin.com/in/example-notion-hiring",
        name: "Rowan Ellis",
        title: "Engineering Recruiter",
      },
    ]),
    sections: companySections("Notion", "Productivity"),
    size: "501–1,000",
    socials: {
      facebook: "https://www.facebook.com/NotionHQ",
      instagram: "https://www.instagram.com/notionhq",
      linkedin: "https://www.linkedin.com/company/notion-so",
      website: "https://notion.so",
    },
  },
  {
    id: "9",
    industry: "Recruiting",
    location: "Austin, TX",
    name: "Indeed",
    recruiters: companyRecruiters("9", [
      {
        linkedin: "https://www.linkedin.com/in/example-indeed-recruiter",
        name: "Parker Singh",
        title: "Recruiting Lead",
      },
      {
        linkedin: "https://www.linkedin.com/in/example-indeed-talent",
        name: "Eden Walsh",
        title: "Talent Sourcer",
      },
    ]),
    sections: companySections("Indeed", "Recruiting"),
    size: "10,001+",
    socials: {
      facebook: "https://www.facebook.com/Indeed",
      instagram: "https://www.instagram.com/indeed",
      linkedin: "https://www.linkedin.com/company/indeed-com",
      website: "https://indeed.com",
    },
  },
  {
    id: "10",
    industry: "Professional network",
    location: "Sunnyvale, CA",
    name: "LinkedIn",
    recruiters: companyRecruiters("10", [
      {
        linkedin: "https://www.linkedin.com/in/example-linkedin-recruiter",
        name: "Hayden Cole",
        title: "Technical Recruiter",
      },
      {
        linkedin: "https://www.linkedin.com/in/example-linkedin-talent",
        name: "Blake Torres",
        title: "University Recruiter",
      },
    ]),
    sections: companySections("LinkedIn", "Professional network"),
    size: "10,001+",
    socials: {
      facebook: "https://www.facebook.com/LinkedIn",
      instagram: "https://www.instagram.com/linkedin",
      linkedin: "https://www.linkedin.com/company/linkedin",
      website: "https://linkedin.com",
    },
  },
];

export const getCompanyById = (id: string): Company | undefined =>
  companies.find((company) => company.id === id);

export const getCompanyPath = (id: string): string => `/networking/${id}`;
