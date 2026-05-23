// ─── src/data/subscriptions.js ────────────────────────────────────────────────
// Seed data for default profile and initial subscription cards.

import { Music2, Tv2, Pen, Bot } from 'lucide-react'

export const DEFAULT_PROFILE = {
  university: 'Sunway University',
  allowance: 1000,
  mealCost: 10.0,
}

/**
 * @typedef {object} Subscription
 * @property {string} id
 * @property {string} name
 * @property {string} plan
 * @property {number} cost
 * @property {string} description
 * @property {string} url
 */

export const INITIAL_SUBSCRIPTIONS = [
  {
    id: 'spotify',
    name: 'Spotify',
    plan: 'Student Plan',
    cost: 9.5,
    description: 'Ad-free music streaming',
    url: 'https://www.spotify.com/account/subscription/',
    icon: Music2,
    color: '#1DB954',
    accentClass: 'text-emerald-400',
    borderClass: 'border-emerald-500/20',
    glowClass: 'shadow-emerald-500/10',
    trialDeadlineDays: 30,
    swap: {
      name: 'YouTube Music',
      tagline: '100% free with ads, or bundled with YouTube Premium',
      url: 'https://music.youtube.com',
      badge: 'FREE',
    },
    retentionScript: `Hi, I'm a university student in Malaysia on a very tight RM1,000/month budget. I've loved Spotify Student, but RM9.50/month is becoming a real strain when combined with my other necessities. I noticed competitors like YouTube Music and Apple Music offer free or cheaper student tiers. Before I cancel, is there any student loyalty discount, extended trial, or a lower-tier plan you could offer me? I'd genuinely prefer to stay, but I need this to be financially viable for my studies.`,
  },
  {
    id: 'netflix',
    name: 'Netflix',
    plan: 'Mobile Plan',
    cost: 18.9,
    description: 'Mobile-only video streaming',
    url: 'https://www.netflix.com/cancelplan',
    icon: Tv2,
    color: '#E50914',
    accentClass: 'text-rose-400',
    borderClass: 'border-rose-500/20',
    glowClass: 'shadow-rose-500/10',
    trialDeadlineDays: 30,
    swap: {
      name: 'Tubi / Pluto TV',
      tagline: 'Completely free, ad-supported streaming with solid libraries',
      url: 'https://tubitv.com',
      badge: 'FREE',
    },
    retentionScript: `Hello Netflix support, I'm a Malaysian university student with a monthly allowance of only RM1,000. The Mobile Plan at RM18.90/month is nearly 2% of my entire income. I'm considering cancelling because I simply can't sustain this cost. I've seen Netflix offer promotional pauses and discounted rates in other markets. Is there a student discount, a payment holiday, or a lower-cost plan available in Malaysia? I'd like to stay subscribed if there's any flexibility.`,
  },
  {
    id: 'canva',
    name: 'Canva',
    plan: 'Pro',
    cost: 40.0,
    description: 'Design tools & templates',
    url: 'https://www.canva.com/settings/billing',
    icon: Pen,
    color: '#7D2AE8',
    accentClass: 'text-violet-400',
    borderClass: 'border-violet-500/20',
    glowClass: 'shadow-violet-500/10',
    trialDeadlineDays: 14,
    swap: {
      name: 'Figma Starter',
      tagline: 'Free forever for 3 projects — professional-grade UI & graphic design',
      url: 'https://www.figma.com',
      badge: 'FREE',
    },
    retentionScript: `Hi Canva team, I'm a design student in Malaysia relying on Canva Pro for my coursework. At RM40/month, it's consuming 4% of my entire monthly allowance of RM1,000. I know Canva offers a free Education plan for verified students and educators. I'd love to verify my student status and access the Education tier, or if that's not possible, receive a significant student discount before I switch to Figma's free plan for my design projects.`,
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    plan: 'Plus',
    cost: 93.0,
    description: 'GPT-4o AI assistant access',
    url: 'https://chat.openai.com/#settings/Subscription',
    icon: Bot,
    color: '#10a37f',
    accentClass: 'text-teal-400',
    borderClass: 'border-teal-500/20',
    glowClass: 'shadow-teal-500/10',
    trialDeadlineDays: 7,
    swap: {
      name: 'Claude.ai (Free)',
      tagline: "Anthropic's Claude — free tier with strong reasoning & long context",
      url: 'https://claude.ai',
      badge: 'FREE',
    },
    retentionScript: `Hi OpenAI, I'm a Malaysian university student using ChatGPT Plus for research and assignments. At RM93/month — nearly 10% of my entire RM1,000 monthly allowance — this subscription is genuinely unsustainable for me. I'm aware that many AI companies are introducing student or educational pricing tiers. Before I downgrade to the free plan and explore alternatives like Claude or Gemini, I wanted to ask: is there a student discount, a reduced tier, or an academic program I could qualify for? I'd love to stay on Plus if it were financially accessible.`,
  },
]

/**
 * Full Malaysia plan lists for offline / fallback lookup (Find Plans).
 * Gemini is always tried first when an API key is set.
 */
export const MALAYSIA_PLAN_CATALOG = [
  {
    keywords: ['spotify'],
    serviceName: 'Spotify',
    category: 'Music',
    defaultCancelUrl: 'https://www.spotify.com/account/subscription/',
    plans: [
      { name: 'Premium Student', monthlyRM: 9.5 },
      { name: 'Premium Individual', monthlyRM: 19.9 },
      { name: 'Premium Duo', monthlyRM: 26.9 },
      { name: 'Premium Family', monthlyRM: 31.9 },
    ],
  },
  {
    keywords: ['netflix'],
    serviceName: 'Netflix',
    category: 'Streaming',
    defaultCancelUrl: 'https://www.netflix.com/cancelplan',
    plans: [
      { name: 'Mobile', monthlyRM: 18.9 },
      { name: 'Basic', monthlyRM: 28.9 },
      { name: 'Standard', monthlyRM: 42.9 },
      { name: 'Premium', monthlyRM: 54.9 },
    ],
  },
  {
    keywords: ['youtube', 'youtube premium'],
    serviceName: 'YouTube Premium',
    category: 'Streaming',
    defaultCancelUrl: 'https://www.youtube.com/paid_memberships',
    plans: [
      { name: 'Individual', monthlyRM: 23.9 },
      { name: 'Family', monthlyRM: 36.9 },
      { name: 'Student', monthlyRM: 14.9 },
    ],
  },
  {
    keywords: ['disney', 'disney plus', 'disney+'],
    serviceName: 'Disney+',
    category: 'Streaming',
    defaultCancelUrl: 'https://www.disneyplus.com/account/subscription',
    plans: [
      { name: 'Monthly', monthlyRM: 36.9 },
      { name: 'Annual (÷12)', monthlyRM: 29.9 },
    ],
  },
  {
    keywords: ['amazon prime', 'prime video'],
    serviceName: 'Amazon Prime Video',
    category: 'Streaming',
    defaultCancelUrl: 'https://www.amazon.com/gp/video/settings',
    plans: [{ name: 'Prime Monthly', monthlyRM: 24.9 }],
  },
  {
    keywords: ['apple tv'],
    serviceName: 'Apple TV+',
    category: 'Streaming',
    defaultCancelUrl: 'https://tv.apple.com/account/settings',
    plans: [{ name: 'Monthly', monthlyRM: 24.9 }],
  },
  {
    keywords: ['viu'],
    serviceName: 'Viu',
    category: 'Streaming',
    defaultCancelUrl: 'https://www.viu.com/ott/my/en-us/account',
    plans: [
      { name: 'Premium', monthlyRM: 14.9 },
      { name: 'Premium+', monthlyRM: 19.9 },
    ],
  },
  {
    keywords: ['iqiyi'],
    serviceName: 'iQIYI',
    category: 'Streaming',
    defaultCancelUrl: 'https://www.iq.com/account',
    plans: [
      { name: 'VIP Standard', monthlyRM: 12.9 },
      { name: 'VIP Premium', monthlyRM: 18.9 },
    ],
  },
  {
    keywords: ['apple music'],
    serviceName: 'Apple Music',
    category: 'Music',
    defaultCancelUrl: 'https://music.apple.com/account',
    plans: [
      { name: 'Individual', monthlyRM: 19.9 },
      { name: 'Family', monthlyRM: 29.9 },
      { name: 'Student', monthlyRM: 9.9 },
    ],
  },
  {
    keywords: ['deezer'],
    serviceName: 'Deezer',
    category: 'Music',
    defaultCancelUrl: 'https://www.deezer.com/account/subscription',
    plans: [
      { name: 'Premium', monthlyRM: 16.9 },
      { name: 'Family', monthlyRM: 25.9 },
    ],
  },
  {
    keywords: ['canva'],
    serviceName: 'Canva',
    category: 'Design',
    defaultCancelUrl: 'https://www.canva.com/settings/billing',
    plans: [
      { name: 'Pro (Monthly)', monthlyRM: 40.0 },
      { name: 'Pro (Yearly ÷ 12)', monthlyRM: 33.0 },
      { name: 'Teams (per seat)', monthlyRM: 50.0 },
    ],
  },
  {
    keywords: ['adobe', 'creative cloud'],
    serviceName: 'Adobe Creative Cloud',
    category: 'Design',
    defaultCancelUrl: 'https://account.adobe.com/plans',
    plans: [
      { name: 'Photography (1TB)', monthlyRM: 52.99 },
      { name: 'Single App', monthlyRM: 85.0 },
      { name: 'All Apps', monthlyRM: 238.0 },
      { name: 'All Apps Student', monthlyRM: 84.0 },
    ],
  },
  {
    keywords: ['figma'],
    serviceName: 'Figma',
    category: 'Design',
    defaultCancelUrl: 'https://www.figma.com/settings/billing',
    plans: [
      { name: 'Professional', monthlyRM: 60.0 },
      { name: 'Organization', monthlyRM: 135.0 },
    ],
  },
  {
    keywords: ['chatgpt', 'openai'],
    serviceName: 'ChatGPT',
    category: 'AI',
    defaultCancelUrl: 'https://chat.openai.com/#settings/Subscription',
    plans: [
      { name: 'Plus', monthlyRM: 93.0 },
      { name: 'Team (per seat)', monthlyRM: 110.0 },
    ],
  },
  {
    keywords: ['claude', 'anthropic'],
    serviceName: 'Claude',
    category: 'AI',
    defaultCancelUrl: 'https://claude.ai/settings/billing',
    plans: [{ name: 'Pro', monthlyRM: 88.0 }],
  },
  {
    keywords: ['gemini', 'google one ai'],
    serviceName: 'Gemini Advanced',
    category: 'AI',
    defaultCancelUrl: 'https://one.google.com/settings',
    plans: [{ name: 'Google One AI Premium (2TB)', monthlyRM: 97.99 }],
  },
  {
    keywords: ['microsoft 365', 'office 365'],
    serviceName: 'Microsoft 365',
    category: 'Productivity',
    defaultCancelUrl: 'https://account.microsoft.com/services',
    plans: [
      { name: 'Personal', monthlyRM: 39.0 },
      { name: 'Family', monthlyRM: 52.0 },
    ],
  },
  {
    keywords: ['notion'],
    serviceName: 'Notion',
    category: 'Productivity',
    defaultCancelUrl: 'https://www.notion.so/billing',
    plans: [
      { name: 'Plus', monthlyRM: 40.0 },
      { name: 'Business', monthlyRM: 60.0 },
    ],
  },
  {
    keywords: ['grammarly'],
    serviceName: 'Grammarly',
    category: 'Productivity',
    defaultCancelUrl: 'https://account.grammarly.com/subscription',
    plans: [{ name: 'Premium', monthlyRM: 55.0 }],
  },
  {
    keywords: ['dropbox'],
    serviceName: 'Dropbox',
    category: 'Cloud',
    defaultCancelUrl: 'https://www.dropbox.com/account/plan',
    plans: [
      { name: 'Plus', monthlyRM: 45.0 },
      { name: 'Professional', monthlyRM: 110.0 },
    ],
  },
  {
    keywords: ['google one'],
    serviceName: 'Google One',
    category: 'Cloud',
    defaultCancelUrl: 'https://one.google.com/settings',
    plans: [
      { name: '100GB', monthlyRM: 8.9 },
      { name: '200GB', monthlyRM: 12.9 },
      { name: '2TB', monthlyRM: 39.9 },
    ],
  },
  {
    keywords: ['icloud'],
    serviceName: 'iCloud+',
    category: 'Cloud',
    defaultCancelUrl: 'https://www.icloud.com/settings/',
    plans: [
      { name: '50GB', monthlyRM: 3.9 },
      { name: '200GB', monthlyRM: 11.9 },
      { name: '2TB', monthlyRM: 39.9 },
    ],
  },
  {
    keywords: ['playstation', 'ps plus'],
    serviceName: 'PlayStation Plus',
    category: 'Gaming',
    defaultCancelUrl: 'https://www.playstation.com/acct/subscriptions',
    plans: [
      { name: 'Essential', monthlyRM: 29.0 },
      { name: 'Extra', monthlyRM: 49.0 },
      { name: 'Premium', monthlyRM: 59.0 },
    ],
  },
  {
    keywords: ['xbox', 'game pass'],
    serviceName: 'Xbox Game Pass',
    category: 'Gaming',
    defaultCancelUrl: 'https://account.microsoft.com/services',
    plans: [
      { name: 'Core', monthlyRM: 29.0 },
      { name: 'Ultimate', monthlyRM: 59.0 },
    ],
  },
  {
    keywords: ['nintendo online'],
    serviceName: 'Nintendo Switch Online',
    category: 'Gaming',
    defaultCancelUrl: 'https://accounts.nintendo.com/',
    plans: [
      { name: 'Individual', monthlyRM: 4.2 },
      { name: 'Family', monthlyRM: 8.3 },
    ],
  },
  {
    keywords: ['apple arcade'],
    serviceName: 'Apple Arcade',
    category: 'Gaming',
    defaultCancelUrl: 'https://apps.apple.com/account/subscriptions',
    plans: [{ name: 'Monthly', monthlyRM: 19.9 }],
  },
  {
    keywords: ['nordvpn'],
    serviceName: 'NordVPN',
    category: 'Security',
    defaultCancelUrl: 'https://my.nordaccount.com/dashboard/nordvpn/',
    plans: [{ name: 'Complete (12-mo avg)', monthlyRM: 15.0 }],
  },
  {
    keywords: ['surfshark'],
    serviceName: 'Surfshark',
    category: 'Security',
    defaultCancelUrl: 'https://my.surfshark.com/subscription',
    plans: [{ name: 'One (12-mo avg)', monthlyRM: 12.0 }],
  },
  {
    keywords: ['linkedin'],
    serviceName: 'LinkedIn Premium',
    category: 'Career',
    defaultCancelUrl: 'https://www.linkedin.com/premium/manage/',
    plans: [
      { name: 'Career', monthlyRM: 129.0 },
      { name: 'Business', monthlyRM: 199.0 },
    ],
  },
  {
    keywords: ['duolingo'],
    serviceName: 'Duolingo',
    category: 'Education',
    defaultCancelUrl: 'https://www.duolingo.com/settings/super',
    plans: [
      { name: 'Super', monthlyRM: 39.9 },
      { name: 'Family', monthlyRM: 59.9 },
    ],
  },
  {
    keywords: ['coursera'],
    serviceName: 'Coursera Plus',
    category: 'Education',
    defaultCancelUrl: 'https://www.coursera.org/account-settings',
    plans: [{ name: 'Plus Monthly', monthlyRM: 175.0 }],
  },
]

/** Styling defaults for user-added subscriptions */
export const CUSTOM_SUBSCRIPTION_STYLE = {
  icon: null,
  color: '#94a3b8',
  accentClass: 'text-slate-400',
  borderClass: 'border-zinc-500/25',
  glowClass: 'shadow-zinc-500/10',
  trialDeadlineDays: 30,
}

export const DEFAULT_SWAP = {
  name: 'Free alternatives',
  tagline: 'Search for a free tier, student plan, or open-source substitute',
  url: 'https://www.google.com/search?q=free+alternative',
  badge: 'TIP',
}

export const DEFAULT_RETENTION_SCRIPT = (sub, profile) =>
  `Hi, I'm a university student at ${profile.university} with a monthly allowance of RM${profile.allowance}. I'm writing to cancel my ${sub.name} ${sub.plan} subscription (RM${sub.cost.toFixed(2)}/month). This cost represents ${((sub.cost / profile.allowance) * 100).toFixed(1)}% of my entire budget and is no longer sustainable. Before I proceed with cancellation, I'd like to ask if you offer any student discount, payment pause, or lower-tier plan. I'd prefer to stay if there's a financially viable option. Thank you for your understanding.`
