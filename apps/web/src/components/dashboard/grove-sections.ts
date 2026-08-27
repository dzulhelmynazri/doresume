export interface JobSection {
  heading: string;
  paragraphs: string[];
}

export const GROVE_SECTIONS: JobSection[] = [
  {
    heading: "Description",
    paragraphs: [
      "Grove Collaborative is a sustainability-focused consumer products company creating household and personal care essentials that are effective, beautifully designed, and healthier for people and the planet. We are a certified B Corp, plastic-neutral, and on a mission to transform the CPG industry for good.",
    ],
  },
  {
    heading: "Engineering at Grove",
    paragraphs: [
      "The Grove product, engineering, and design team is rooted in a data and goal-driven culture. We take ownership of big business and technology challenges and solve them quickly and robustly. We operate in small, autonomous teams, build on a modern and evolving stack, and deploy frequently to deliver value to the business as fast as possible. We value trust, collaboration, and shared ownership.",
    ],
  },
  {
    heading: "About the Opportunity",
    paragraphs: [
      "We're looking for a senior engineer whose center of gravity is the front end, but who follows a problem wherever it goes — into an API, a data model, a third-party integration, a build pipeline.",
      "We care far more about how you think than about which frameworks are on your resume. Our storefront runs on Shopify today, and parts of it won't tomorrow. The stack has changed before and will change again. What we need is someone who can walk into unfamiliar territory, figure out how it actually works, and make a good call about it.",
      "This isn't a role for someone waiting to be told what to build. We want a true self-starter: endlessly curious, genuinely ambitious, and humble enough to be trusted with real influence.",
      "You'll lead projects end to end — shaping the problem with product and design, collaborating with other engineers on the approach, making the architectural calls, shipping, and then looking at what the numbers say.",
      "To be clear about scope: this is a senior individual contributor role. You'll lead projects but you won't be managing people or owning org-wide technical strategy. You'll be in the code.",
    ],
  },
  {
    heading: "What You'll Own",
    paragraphs: [
      "Project leadership — Lead front end and full stack initiatives from ambiguous problem statement to shipped, measured outcome. Make the architecture calls, sequence the work, and keep the project honest about tradeoffs.",
      "Product and design partnership — Work shoulder to shoulder with product managers and designers. We expect you to have opinions about the experience itself, not just how to build what you were handed.",
      "Craft, performance, and quality — Own performance, stability, accessibility, and maintainability in the code you and your team ship, at the scale Grove actually runs at.",
      "Ecosystem integration — Partner across our third-party ecosystem — mobile apps, subscription services, analytics, search and discovery, loyalty — to build experiences that feel like one product instead of six vendors.",
      "AI-assisted development — Use AI tooling aggressively as a force multiplier, and hold the line on quality while you do it.",
      "Design system — Partner with UX Design to define and scale our design system and UI component library.",
      "Measurement — Work with analytics partners to make sure the tracking exists to tell you whether what you shipped actually worked.",
      "Best practices — Champion testing, documentation, and workflows the rest of the team can build on.",
    ],
  },
  {
    heading: "About You",
    paragraphs: [
      "7+ years building and operating production web applications, with the front end as your strongest area.",
      "Deep expertise in JavaScript and TypeScript, at least one modern component framework (React, Vue, Svelte, or similar), state management, and performance optimization for consumer-facing applications.",
      "Genuinely comfortable working across the stack — APIs, data models, integrations, CI, the browser, and the boring infrastructure in between.",
      "New technology doesn't scare you. You've been dropped into an unfamiliar framework, language, or platform and gotten productive fast, and you can point to a time you did it. You evaluate new tools on the merits instead of defaulting to what you already know or chasing whatever is new.",
      "You're honest about what you don't know. You can say “I haven't worked with that” without flinching, and you don't paper over the gap with a confident guess.",
      "You lead projects, not just tickets. You've taken something vague, made it concrete, brought other people along, and shipped it.",
      "You think like a designer and a product person. You notice when a flow is confusing, you push back when a spec doesn't make sense for the customer, and you can tell the difference between polish that matters and polish that doesn't.",
      "You work well with others. You give direct feedback kindly, you take it well, and people want you on their project.",
      "A real sense of ownership and pride in the experiences you ship and the code you leave behind.",
      "You write things down, and people understand them. You can walk a PM or a designer through a technical tradeoff without hiding behind jargon, and the decisions you make stay legible to whoever picks up the code six months later.",
      "Genuine enthusiasm for Grove's mission and sustainability values, not just the tech stack.",
    ],
  },
  {
    heading: "How We Work Together",
    paragraphs: [
      "This is a high trust environment. You'll get real scope and real decisions early, and nobody is going to look over your shoulder while you do the work. Trust runs both directions: we'll be straight with you about the business, the tradeoffs, and the parts of the codebase we aren't proud of, and we expect that same candor back.",
      "We value psychological safety first and foremost. It's the precondition for everything else on this list. The teams that solve genuinely hard problems are the ones where people feel safe saying “I don't understand this yet.”",
      "“I haven't worked with that” is a complete answer here. We have deep respect for an engineer who names the edge of their own knowledge instead of bluffing past it. We don't need you to know everything. We need you to be honest about where your expertise begins and ends — and that honesty is worth more to us than a confident guess, in an interview and on the job.",
    ],
  },
  {
    heading: "How We Think About AI",
    paragraphs: [
      "We're serious about this, so we'd rather be direct than let you find out later.",
      "AI tooling is part of how this team works every day, not an experiment on the side. We want someone who genuinely enjoys these tools and keeps getting better with them.",
      "Nobody here has AI figured out, and we're skeptical of anyone who says they do. The tooling changes month to month. We are all working it out together, in the open. We'd rather hire someone actively learning than someone with a methodology to evangelize.",
      "We're looking for someone whose judgment stays their own. You should be able to read what a model produced, disagree with it, and explain why — about architecture, about correctness, about whether the thing should be built at all.",
      "The version of this we don't want: code that ships because a model was confident. If you can't explain why your code looks the way it does, “the model wrote it” isn't an answer.",
      "The version we do want: someone who moves twice as fast with these tools and whose standards didn't move at all.",
      "This is where honesty about the edges of your knowledge matters most. AI makes it effortless to produce work you don't actually understand. Flagging that is a strength here, not an admission.",
      "Our interview process includes a take-home project and a working review session that covers system design, coding, product thinking, and how you use AI. We'd rather see how you actually work than quiz you on algorithms — there's no LeetCode round.",
    ],
  },
  {
    heading: "Even Better if You Have",
    paragraphs: [
      "Experience with Shopify — Liquid, Online Store 2.0 (sections, metaobjects, metafields), the Storefront and Cart APIs, Checkout Extensions. Helpful context, not a requirement; we've onboarded strong engineers to it before.",
      "Experience at a fast-growing ecommerce company with a high SKU count and high-velocity traffic, so scale isn't theoretical to you.",
      "Experience with subscription commerce, and the particular mess of billing, scheduling, and customer expectations that comes with it.",
      "Proficiency with GraphQL; familiarity with Alpine.js is a plus.",
      "Experience with testing tooling — component testing libraries, Vitest or Jest, and Cypress or Playwright.",
      "Strong understanding of Git workflows and CI in a team environment, such as GitHub Actions.",
      "A strong sense of design, accessibility, and user empathy.",
      "Experience with A/B testing and experimentation platforms.",
    ],
  },
  {
    heading: "What's in it for you",
    paragraphs: [
      "This full-time, exempt position is remote for candidates based in the following states: California, Maine, Pennsylvania, Nevada, North Carolina, Texas, Colorado, Washington, Illinois, New York, Missouri, and Massachusetts.",
      "Competitive benefits - medical, vision, dental",
      "Equity - shared success is core to our mission",
      "Flexible Paid Time Off - we care most about results",
      "Free VIP membership and 50% employee discount",
      "Working for a company that believes that a small group of people can change the world for the better by creating products and funding initiatives that help the planet!",
    ],
  },
  {
    heading: "Compensation",
    paragraphs: [
      "The salary range for this role is $180,000-215,000. Our compensation bands are determined based on market-specific cost of living data, meaning that the top of our salary range is reserved for the most experienced candidates in the highest cost of living areas across the country. In addition to the base salary, this role is eligible for an annual incentive target and equity.",
    ],
  },
  {
    heading: "More about Grove",
    paragraphs: [
      "Grove Collaborative Holdings, Inc. (NYSE: GROV) is the one-stop online destination for everyday essentials that create a healthier home and planet. Explore thousands of thoughtfully vetted products for every room and everyone in your home, including household cleaning, personal care, health and wellness, laundry, clean beauty, kitchen, pantry, kids, baby, pet care, and beyond. Everything Grove sells meets a higher standard — from health to sustainability and performance — so you get a great value without compromising your values. As a B Corp and Public Benefit Corporation, Grove goes beyond selling products: every order is carbon neutral, supports plastic waste cleanup initiatives, and lets you see and track the positive impact of your choices. Shopping with purpose starts at Grove.com.",
      "We're building a diverse and inclusive work environment where we learn from each other. We welcome people of diverse backgrounds, experiences, abilities and perspectives. We are an equal opportunity employer. If you require reasonable accommodation in completing this application, interviewing, completing any pre-employment testing, or otherwise participating in the employee selection process, please direct your inquiries to Talent@grove.co.",
    ],
  },
];
