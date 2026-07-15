// MoVi compensation plan + site content. Single source of truth for the numbers shown
// across the site; the on-chain contract must mirror these when built.

export const PLAN = {
  registrationUsdt: 30,
  registrationPhp: 1800,
  subscriptionUsdt: 30,
  subscriptionDays: 30,
  conversion: 60, // 1 USDT : 60 PHP
  directReferralUsdt: 10, // earned per direct Level-1 subscription
  unilevelUsdt: 1, // per active sponsor
  unilevelLevels: 10, // levels 1–10 (can reach deeper via auto-compress)
  unilevelTotalUsdt: 10, // forced total distributed per subscription (1 USDT × 10 active)
  teamPowerUsdt: 15, // per completed group of 3 directs
  teamPowerPer: 3,
  leadershipUsdt: 1, // Leader tag — paid across the whole network
  withdrawFeePct: 10,
  withdrawCooldownHrs: 24,
  dailyPayoutCooldownDays: 7,
}

export const phpFromUsdt = (usdt) => usdt * PLAN.conversion

// Rewards summarised for the plan cards.
export const REWARDS = [
  {
    key: 'direct',
    title: 'Direct Referral',
    icon: 'UserPlus',
    amount: `${PLAN.directReferralUsdt} USDT`,
    tagline: 'Per direct Level-1 subscription',
    body: `Earn ${PLAN.directReferralUsdt} USDT instantly for every direct you personally sponsor when they subscribe. Paid as a daily cash rebate.`,
    accent: 'purple',
  },
  {
    key: 'unilevel',
    title: 'Unilevel Bonus',
    icon: 'Layers',
    amount: `1 USDT × 10`,
    tagline: 'Levels 1–10, auto-compress',
    body: `Every subscription distributes ${PLAN.unilevelTotalUsdt} USDT up the tree — 1 USDT to each active sponsor, levels 1 to 10. Auto-Compress skips inactive accounts and rolls the share to the next active level (so it can reach level 11+), always paying out the full ${PLAN.unilevelTotalUsdt} USDT.`,
    accent: 'green',
  },
  {
    key: 'teampower',
    title: 'Team Power Bonus',
    icon: 'Users',
    amount: `${PLAN.teamPowerUsdt} USDT`,
    tagline: 'For every 3 directs',
    body: `For every ${PLAN.teamPowerPer} directs you sponsor, earn ${PLAN.teamPowerUsdt} USDT. The counter meters every subscription in groups of ${PLAN.teamPowerPer} — invite 4 and 1 carries over toward your next reward.`,
    accent: 'purple',
  },
  {
    key: 'leadership',
    title: 'Leadership Bonus',
    icon: 'Crown',
    amount: `${PLAN.leadershipUsdt} USDT`,
    tagline: 'Leader tag · whole network',
    body: `Tagged Leaders earn ${PLAN.leadershipUsdt} USDT across their entire network. On registration a member inherits the sponsor's Origin Wallet address.`,
    accent: 'green',
  },
]

export const FAQ = [
  {
    q: 'What is MoVi Community?',
    a: "MoVi is a community-powered movie platform where members watch, refer, and earn together on BNB Smart Chain. Let's Mov'It Together.",
  },
  {
    q: 'How much is registration?',
    a: `Registration is ${PLAN.registrationUsdt} USDT (₱${phpFromUsdt(PLAN.registrationUsdt).toLocaleString()} at 1 USDT : ${PLAN.conversion} PHP). It activates your account and places you in the network.`,
  },
  {
    q: 'How does the subscription work?',
    a: `Membership is ${PLAN.subscriptionUsdt} USDT every ${PLAN.subscriptionDays} days. An active subscription is what earns you Unilevel and Team Power bonuses and keeps you eligible in the tree.`,
  },
  {
    q: 'How do I earn?',
    a: `Four ways: Direct Referral (${PLAN.directReferralUsdt} USDT per direct), Unilevel (1 USDT per active sponsor up to 10 levels, auto-compressed), Team Power (${PLAN.teamPowerUsdt} USDT per 3 directs), and Leadership (${PLAN.leadershipUsdt} USDT across your network for tagged Leaders).`,
  },
  {
    q: 'How do withdrawals work?',
    a: `Withdrawals have a ${PLAN.withdrawCooldownHrs}-hour cooldown and a ${PLAN.withdrawFeePct}% processing fee. Bonuses are collected first, then withdrawn to your wallet.`,
  },
  {
    q: 'Is it on-chain?',
    a: 'Yes — connect a BSC-compatible wallet (MetaMask, WalletConnect, Coinbase Wallet). Registration, subscriptions, and payouts settle on BNB Smart Chain.',
  },
]

// Sample gallery (placeholder posters rendered as gradient tiles — no external assets).
export const MOVIES = [
  { title: 'Neon Horizon', genre: 'Sci-Fi', tag: 'Featured' },
  { title: 'The Last Signal', genre: 'Thriller', tag: 'New' },
  { title: 'Violet Skies', genre: 'Drama', tag: 'Trending' },
  { title: 'Green Room', genre: 'Mystery', tag: 'New' },
  { title: 'Midnight Circuit', genre: 'Action', tag: 'Featured' },
  { title: 'Echoes', genre: 'Documentary', tag: 'Community' },
  { title: 'Pulse', genre: 'Sci-Fi', tag: 'Trending' },
  { title: 'Afterglow', genre: 'Romance', tag: 'New' },
]
