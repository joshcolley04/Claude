export type Product = {
  slug: string
  tag: string
  headline: string
  subheadline: string
  description: string
  color: string
  border: string
  iconBg: string
  iconColor: string
  tagColor: string
  glowColor: string
  painPoints: string[]
  whatsIncluded: {
    title: string
    description: string
  }[]
  examples: string[]
  idealFor: string[]
  priceRange: string
  timeToLaunch: string
}

export const products: Product[] = [
  {
    slug: 'ebooks-guides',
    tag: 'Ebooks & Guides',
    headline: 'Your Knowledge, Packaged and Sold',
    subheadline: 'Turn what you already know into a premium digital product, no camera, no tech skills, no faff.',
    description:
      'You\'ve spent years building expertise your audience pays attention to. An ebook or guide turns that knowledge into a tangible, scalable product that sells while you sleep. We handle everything from structure and writing support to design, formatting and delivery, so you get a professional product that reflects your brand.',
    color: 'from-blue-600/15 to-transparent',
    border: 'border-blue-500/20',
    iconBg: 'bg-blue-500/15',
    iconColor: 'text-blue-400',
    tagColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    glowColor: 'rgba(59,130,246,0.15)',
    painPoints: [
      "You've been giving away free value for years with nothing to show for it",
      'Your audience keeps asking the same questions, you need a scalable answer',
      'You want to monetise without being on camera or recording hours of content',
    ],
    whatsIncluded: [
      {
        title: 'Content Strategy & Structure',
        description: 'We map out the complete structure of your ebook, chapters, flow, and key takeaways, based on your audience\'s biggest pain points.',
      },
      {
        title: 'Professional Copywriting',
        description: 'Our team writes the content in your voice, covering every section with depth and clarity that positions you as the go to authority.',
      },
      {
        title: 'Premium Design & Layout',
        description: 'A fully designed, branded PDF that looks and feels high end, not a Google Doc export. Visuals, typography and layout all handled.',
      },
      {
        title: 'Automated Delivery System',
        description: 'Every customer receives their ebook instantly upon purchase. No manual emails, no delays, fully automated from payment to inbox.',
      },
      {
        title: 'Sales Page Copy',
        description: 'A conversion optimised sales page written to turn your audience into buyers, with headline, benefits, social proof sections and CTAs.',
      },
      {
        title: 'Launch Strategy',
        description: 'A proven launch plan with email sequences, social content prompts and timing strategy to maximise your first week revenue.',
      },
    ],
    examples: ['Step by step strategy guides', 'Niche playbooks', 'Industry reports', 'How to PDF guides', 'Beginner blueprints', 'Expert frameworks'],
    idealFor: ['Coaches and consultants', 'Lifestyle and wellness creators', 'Business and finance influencers', 'Creators with 1,000+ engaged followers'],
    priceRange: '£17 to £97',
    timeToLaunch: '1 to 2 weeks',
  },
  {
    slug: 'digital-templates',
    tag: 'Digital Templates',
    headline: "Done For Them Tools They'll Actually Use",
    subheadline: 'Templates sell themselves, because they solve an immediate problem the moment someone downloads them.',
    description:
      'Digital templates are one of the most consistently purchased products online because the value is instant and obvious. Your audience gets a ready to use tool that saves them hours of work. We design, build and deliver templates that are polished, on brand, and priced to convert, whether it\'s Notion, Canva, Excel or something bespoke.',
    color: 'from-indigo-600/15 to-transparent',
    border: 'border-indigo-500/20',
    iconBg: 'bg-indigo-500/15',
    iconColor: 'text-indigo-400',
    tagColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    glowColor: 'rgba(99,102,241,0.15)',
    painPoints: [
      'Your followers want results but don\'t know where to start',
      'You need a product that sells itself with minimal explanation',
      'You want something that works across multiple audience types',
    ],
    whatsIncluded: [
      {
        title: 'Template Design & Build',
        description: 'We build your template from scratch inside the right platform, Notion, Canva, Google Sheets, Excel or Airtable, tailored to your audience\'s workflow.',
      },
      {
        title: 'Brand Integration',
        description: 'Your colours, fonts, logo and voice are woven throughout, so every time someone uses the template, they\'re reminded it came from you.',
      },
      {
        title: 'User Guide & Walkthrough',
        description: 'A short PDF or video walkthrough so customers get maximum value immediately, reducing support queries and increasing satisfaction.',
      },
      {
        title: 'Instant Digital Delivery',
        description: 'Automated fulfilment means your template lands in the customer\'s inbox seconds after payment, no manual work on your end.',
      },
      {
        title: 'Sales & Marketing Assets',
        description: 'We produce the sales page copy, product mockups, and social preview assets you need to start selling straight away.',
      },
      {
        title: 'Bundle Strategy',
        description: 'Advice on how to package templates together to increase average order value and encourage repeat purchases from your existing buyers.',
      },
    ],
    examples: ['Notion dashboards', 'Canva social media packs', 'Excel/Google Sheets trackers', 'Email swipe files', 'Content calendar systems', 'Client onboarding kits'],
    idealFor: ['Productivity and organisation creators', 'Business coaches', 'Social media managers', 'Freelancers and agency owners'],
    priceRange: '£9 to £67',
    timeToLaunch: '1 to 2 weeks',
  },
  {
    slug: 'brand-kits',
    tag: 'Brand Kits',
    headline: 'Help Your Audience Look the Part',
    subheadline: 'Give your followers a complete visual identity, and they\'ll credit you every time they use it.',
    description:
      'Every entrepreneur, small business owner and creator in your audience wants to look polished and professional, but most can\'t afford a designer. Brand kits give them everything they need in one purchase. We design premium, ready to use brand packages that your audience will rave about, share online, and come back to buy again.',
    color: 'from-violet-600/15 to-transparent',
    border: 'border-violet-500/20',
    iconBg: 'bg-violet-500/15',
    iconColor: 'text-violet-400',
    tagColor: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    glowColor: 'rgba(139,92,246,0.15)',
    painPoints: [
      'Your audience struggles to look professional and consistent online',
      'Design costs are pricing your followers out of building their brand',
      'You want a premium product that justifies a higher price point',
    ],
    whatsIncluded: [
      {
        title: 'Logo Suite',
        description: 'A primary logo, secondary variation and icon mark, delivered in every format your audience will ever need (PNG, SVG, PDF).',
      },
      {
        title: 'Colour Palette & Typography Guide',
        description: 'A professionally curated colour system and font pairing guide with usage rules, so every piece of content looks cohesive.',
      },
      {
        title: 'Social Media Templates',
        description: 'Editable Canva templates for posts, stories, highlights and covers, pre-styled with the brand kit so customers can start posting immediately.',
      },
      {
        title: 'Brand Guidelines PDF',
        description: 'A concise brand book covering logo usage, colour codes, font names and do\'s and don\'ts, everything a professional brand needs.',
      },
      {
        title: 'Commercial Licence',
        description: 'Every kit comes with a commercial use licence so your customers can use it across their business without any restrictions.',
      },
      {
        title: 'Mockup & Preview Assets',
        description: 'Professional product mockups for your sales page and social content, showing the kit applied to real world scenarios.',
      },
    ],
    examples: ['Logo suites', 'Social media brand packs', 'Colour palette & font guides', 'Content creator starter kits', 'Business brand bundles', 'Niche specific brand collections'],
    idealFor: ['Design and aesthetic creators', 'Business coaches and mentors', 'Lifestyle influencers', 'Creators whose audience includes entrepreneurs'],
    priceRange: '£37 to £197',
    timeToLaunch: '1 to 2 weeks',
  },
  {
    slug: 'interactive-apps',
    tag: 'Interactive Apps',
    headline: 'Tools That Keep Them Coming Back',
    subheadline: 'Interactive digital tools are the most shared, bookmarked and recommended products online.',
    description:
      'A well-built interactive tool positions you as a serious authority and gives your audience something they can\'t get anywhere else. Calculators, trackers, audit tools and assessment apps drive word of mouth because people share useful things. We build these end-to-end, design, development, hosting and delivery all handled.',
    color: 'from-cyan-600/15 to-transparent',
    border: 'border-cyan-500/20',
    iconBg: 'bg-cyan-500/15',
    iconColor: 'text-cyan-400',
    tagColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    glowColor: 'rgba(6,182,212,0.15)',
    painPoints: [
      'You want a product that feels premium and justifies a higher price',
      'Static PDFs aren\'t cutting it, your audience wants something interactive',
      'You need something shareable that brings new leads to your brand organically',
    ],
    whatsIncluded: [
      {
        title: 'Product Concept & UX Design',
        description: 'We map out the user journey, inputs, outputs and interface, designing something intuitive enough that anyone in your audience can use it immediately.',
      },
      {
        title: 'Full Development & Build',
        description: 'Complete front end development of your interactive tool, responsive, fast, and built to work flawlessly on mobile and desktop.',
      },
      {
        title: 'Branded Interface',
        description: 'Your logo, colours and brand personality built into every screen, so the tool feels like an extension of your brand, not a generic product.',
      },
      {
        title: 'Secure Hosting & Delivery',
        description: 'We host and deliver the tool on a secure, fast platform, with access control so only paying customers can use it.',
      },
      {
        title: 'Results & Output Logic',
        description: 'Custom calculation, scoring or recommendation logic built to provide genuinely useful outputs that make your audience feel seen and understood.',
      },
      {
        title: 'Shareable Results Feature',
        description: 'Built in sharing functionality so users can share their results on social media, driving organic exposure back to your brand and product.',
      },
    ],
    examples: ['Revenue calculators', 'Habit & goal trackers', 'Audit tools', 'Quiz-based assessments', 'Pricing calculators', 'Progress dashboards'],
    idealFor: ['Business, finance and marketing creators', 'Coaches with data driven frameworks', 'Creators with highly engaged, action oriented audiences'],
    priceRange: '£47 to £297',
    timeToLaunch: '1 to 2 weeks',
  },
  {
    slug: 'custom-builds',
    tag: 'Custom Builds',
    headline: "A Product as Unique as Your Brand",
    subheadline: 'Have an idea that doesn\'t fit a template? We build it from scratch, engineered entirely around your audience.',
    description:
      'The most successful creators don\'t copy what already exists, they build something proprietary. If you have a product concept that\'s genuinely different, we have the team to bring it to life. From bespoke membership portals to private content hubs and branded resource libraries, if you can describe it, we can build it.',
    color: 'from-orange-600/15 to-transparent',
    border: 'border-orange-500/20',
    iconBg: 'bg-orange-500/15',
    iconColor: 'text-orange-400',
    tagColor: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    glowColor: 'rgba(249,115,22,0.15)',
    painPoints: [
      'You have a specific product idea but no idea how to build it',
      'Off the shelf products don\'t reflect your brand or your audience\'s needs',
      'You want something proprietary that competitors can\'t easily replicate',
    ],
    whatsIncluded: [
      {
        title: 'Discovery & Strategy Session',
        description: 'A dedicated session to fully map out your vision, what the product does, who it\'s for, and how it creates real value for your audience.',
      },
      {
        title: 'Product Architecture & Roadmap',
        description: 'A clear, documented build plan covering features, user flows, tech stack and timeline, so you know exactly what\'s being built and when.',
      },
      {
        title: 'End-to-End Development',
        description: 'Our team handles every aspect of the build, design, development, testing and optimisation, until the product is ready to launch.',
      },
      {
        title: 'Brand & UI Design',
        description: 'A premium, custom interface designed to feel native to your brand, not a template with your logo slapped on top.',
      },
      {
        title: 'Payment & Access Integration',
        description: 'Seamless payment processing and secure access control so customers buy, receive access, and get inside your product without friction.',
      },
      {
        title: 'Post Launch Support',
        description: 'We don\'t disappear after launch. Ongoing support, bug fixes and iteration are included so your product keeps improving over time.',
      },
    ],
    examples: ['Bespoke membership portals', 'Custom content hubs', 'Private community tools', 'Branded resource libraries', 'Proprietary frameworks', 'Exclusive creator platforms'],
    idealFor: ['Established creators with a clear vision', 'Brands ready to invest in a flagship product', 'Creators building a long term digital business'],
    priceRange: 'Bespoke pricing',
    timeToLaunch: '1 to 2 weeks',
  },
  {
    slug: 'online-courses',
    tag: 'Online Courses',
    headline: 'The Highest Ticket Product in Your Arsenal',
    subheadline: 'Online courses command the highest price points of any digital product, and the results to back it up.',
    description:
      'A professionally built online course transforms your audience\'s lives and your revenue at the same time. We handle curriculum design, production support, platform setup, branding, and automated delivery, so you can focus on delivering genuine value while we engineer everything around it for maximum sales and completion rates.',
    color: 'from-emerald-600/15 to-transparent',
    border: 'border-emerald-500/20',
    iconBg: 'bg-emerald-500/15',
    iconColor: 'text-emerald-400',
    tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    glowColor: 'rgba(16,185,129,0.15)',
    painPoints: [
      'You know you could charge more but don\'t have the infrastructure to deliver it',
      'Building a course feels overwhelming, you don\'t know where to start',
      'You want recurring, predictable revenue from a single product launch',
    ],
    whatsIncluded: [
      {
        title: 'Curriculum Design & Structure',
        description: 'We map out every module, lesson and learning outcome, building a logical progression that gets your students real, measurable results.',
      },
      {
        title: 'Production Support & Direction',
        description: 'Recording guidance, scripts, slides and prompts so your delivery is confident and clear, even if you\'ve never recorded a course before.',
      },
      {
        title: 'Platform Setup & Configuration',
        description: 'We build your course inside the right platform, Kajabi, Teachable, Skool or a custom solution, fully configured and ready for students.',
      },
      {
        title: 'Branded Course Experience',
        description: 'Custom cover art, module graphics, workbooks and branded assets that make your course look and feel like a premium investment.',
      },
      {
        title: 'Student Onboarding Sequence',
        description: 'An automated welcome sequence that gets students engaged, excited and moving through the course from day one, reducing drop off rates.',
      },
      {
        title: 'Launch Campaign Assets',
        description: 'Full launch email sequence, sales page copy, social content plan and countdown strategy, everything you need to have a successful launch week.',
      },
    ],
    examples: ['Video based masterclasses', 'Self paced learning programmes', 'Cohort courses with community', 'Mini courses and workshops', 'Certification programmes', 'Group coaching curricula'],
    idealFor: ['Coaches, educators and mentors', 'Creators with deep niche expertise', 'Influencers with a highly engaged and motivated audience', 'Anyone who has been asked "do you have a course?" more than once'],
    priceRange: '£97 to £997+',
    timeToLaunch: '1 to 2 weeks',
  },
  {
    slug: 'one-to-one-mentorship',
    tag: '1:1 Mentorship',
    headline: 'The Highest Paid Product You Will Ever Sell',
    subheadline: 'Direct access to you is the most valuable thing your audience can buy. We build the system that makes it scalable and premium.',
    description:
      'One to one mentorship commands the highest price points of any digital product because people are not just buying information, they are buying your time, your attention, and your ability to solve their specific problem. We build the entire framework around your mentorship offer so it is structured, premium and positions you as the go to authority in your space.',
    color: 'from-red-600/15 to-transparent',
    border: 'border-red-500/20',
    iconBg: 'bg-red-500/15',
    iconColor: 'text-red-400',
    tagColor: 'text-red-400 bg-red-500/10 border-red-500/20',
    glowColor: 'rgba(239,68,68,0.15)',
    painPoints: [
      'You know your time is valuable but you have no structure around selling it',
      'You want to charge premium prices but lack the framework to justify them',
      'You are ready to work closely with clients but do not know how to position it professionally',
    ],
    whatsIncluded: [
      {
        title: 'Mentorship Offer Design',
        description: 'We define exactly what your one to one mentorship includes, session structure, duration, deliverables and outcomes, so clients know precisely what they are investing in.',
      },
      {
        title: 'Premium Pricing Strategy',
        description: 'We build a pricing architecture that reflects the true value of your time and positions your mentorship at the top end of your market without apology.',
      },
      {
        title: 'Application & Vetting System',
        description: 'A professional application process that filters for the right clients, builds perceived exclusivity, and means you only work with people you can genuinely help.',
      },
      {
        title: 'Onboarding & Client Experience',
        description: 'A fully automated onboarding sequence, welcome pack and client portal so every mentee starts their journey feeling like they have made the best investment of their life.',
      },
      {
        title: 'Sales Page & Positioning Copy',
        description: 'A high converting sales page written to attract serious buyers, not tyre kickers, with positioning that commands premium rates and repels the wrong fit clients.',
      },
      {
        title: 'Ongoing Support Framework',
        description: 'Templates, check in structures and progress tracking tools so your mentorship delivers consistent, measurable results that your clients shout about publicly.',
      },
    ],
    examples: ['Private one to one coaching programmes', 'Done with you strategy sessions', 'Weekly mentorship retainers', 'VIP intensive days', 'Accountability and advisory packages', 'High ticket transformation programmes'],
    idealFor: ['Coaches and consultants ready to go premium', 'Creators with proven expertise and a loyal audience', 'Personal brands who want to charge what they are actually worth', 'Anyone who has been asked for personal help more times than they can count'],
    priceRange: '£500 to £5,000+',
    timeToLaunch: '1 to 2 weeks',
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}
