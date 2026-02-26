// Defines the UI badge state for live data tracking
export type MetricTrend = 'up' | 'down' | 'neutral' | 'stable'

export interface VersionData {
    current: string;
    next: string;
    costCurrent: number;
    costNext: number;
    currency?: string;
    upgradeReason: string;
    upgradeDeadline: string;
}

export interface Metric {
    label: string
    value: string
    trend?: MetricTrend
    trendValue?: string
}

export interface HistoryEntry {
    id: string
    date: string
    action: string
    description: string
    type: 'system' | 'user' | 'alert' | 'metric'
}

export interface CompetitionData {
    pros: string[]
    cons: string[]
    suggestion: string
    suggestionDismissed?: boolean
}

export interface Integration {
    id: string
    name: string
    iconUrl?: string
    description: string
    fullDescription?: string
    importance: string
    financials: string
    costMonthly?: number
    competition: string | CompetitionData
    category?: string
    tags?: string[]
    connectionStatus?: 'connected' | 'disconnected' | 'limited'
    lastUpdated?: string
    versionData?: VersionData
    status: 'active' | 'evaluating' | 'future'
    metrics?: Metric[]
    history?: HistoryEntry[]
};

export const defaultIntegrations: Integration[] = [
    {
        id: "gcp",
        name: "Google Cloud Platform (GCP)",
        description: "The foundational infrastructure and cloud environment for the project.",
        fullDescription: "Google Cloud Platform provides the foundational infrastructure and cloud environment for SAT Connect. It powers the core computing needs, API gateways, scheduled tasks, and scalable backend services. We utilize Cloud Run, Cloud Storage, and Secret Manager.",
        importance: "Critical backbone.",
        financials: "Evaluate sustained use discounts. Stay on current plan.",
        competition: "AWS, Microsoft Azure.",
        status: "active",
        connectionStatus: "disconnected",
        tags: ["Cloud Infrastructure", "Database", "Microservices"],
        iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg",
        metrics: [
            { label: "Uptime", value: "99.99%", trend: "neutral" },
            { label: "Est. Spend (MTD)", value: "$340.00", trend: "up", trendValue: "+5%" },
            { label: "API Requests", value: "1.2M", trend: "up", trendValue: "+12%" }
        ]
    },
    {
        id: "antigravity",
        name: "Antigravity AI Agent",
        description: "Autonomous internal AI agent managing codebase, orchestrating deployments, and building the platform.",
        fullDescription: "Antigravity is the cornerstone of the SAT Connect autonomous development pipeline. Operating directly within the codebase context, it is capable of full-stack generation, Vercel deployments, UI/UX implementation, and Clerk RBAC configurations. Antigravity acts as the perpetual 'Co-Founder' engineer.",
        importance: "Critical - Reduces development costs by 95% and accelerates MVP iterations.",
        financials: "High ROI. Operates on Google Gemini API token costs scaling logarithmically vs human engineer salaries.",
        costMonthly: 50,
        category: "Artificial Intelligence",
        lastUpdated: new Date().toISOString(),
        versionData: {
            current: "1.0-alpha",
            next: "1.1-beta",
            costCurrent: 50,
            costNext: 150,
            upgradeReason: "Increased context window required for Module 7 scaling.",
            upgradeDeadline: "Q3 2026"
        },
        competition: {
            pros: ["Deep codebase contextual awareness", "Iterative multi-step reasoning", "Direct CLI/Terminal execution"],
            cons: ["Requires high compute tokens", "Occasional context degradation on massive files"],
            suggestion: "Transition minor tasks to smaller models to save context window load."
        },
        status: "active",
        metrics: [
            { label: "Lines of Code Gen", value: "45,210", trend: "up", trendValue: "12% /wk" },
            { label: "Agent Uptime", value: "99.9%", trend: "neutral" },
            { label: "Token Consumption", value: "2.4M", trend: "up", trendValue: "Peak Activity" }
        ],
        history: [
            { id: "ag-1", date: new Date(Date.now() - 86400000 * 2).toISOString(), action: "Module 5 Generation", description: "Successfully architected the Integrations V2 dashboard.", type: "system" },
            { id: "ag-2", date: new Date(Date.now() - 86400000 * 5).toISOString(), action: "RBAC Patch", description: "Deployed security patch for Admin sidebar bypass.", type: "system" }
        ]
    },
    {
        id: "notebooklm",
        name: "Google NotebookLM",
        description: "Master blueprint synthesizer and intelligent RAG engine for project memory.",
        fullDescription: "NotebookLM acts as the central brain and 'Single Source of Truth' (SSOT) for the SAT Connect project. It digests massive markdown blueprints, PRDs, and architecture logs, serving as the persistent memory bank queried by Antigravity and human administrators.",
        importance: "Critical - Solves the 'Context Window limit' problem for complex long-term projects.",
        financials: "Currently Free/Included in Google Workspace capabilities.",
        costMonthly: 0,
        category: "Data & Intelligence",
        lastUpdated: new Date().toISOString(),
        versionData: {
            current: "Gemini 1.5 Pro",
            next: "Gemini 2.0 Pro",
            costCurrent: 0,
            costNext: 20,
            upgradeReason: "API Access required for direct App queries.",
            upgradeDeadline: "Q4 2026"
        },
        competition: {
            pros: ["Flawless multi-document synthesis", "Audio Overviews via Studio", "Zero hallucination grounding"],
            cons: ["API integration is currently highly experimental", "Limited automated sync"],
            suggestion: "Automate sync using Browser testing agents or experimental APIs when available."
        },
        status: 'active',
        history: [
            { id: "h8", date: "2026-01-20T00:00:00Z", action: "Master Blueprint Created", description: "Uploaded initial documentation.", type: "user" }
        ],
        metrics: [
            { label: "Sources", value: "6", trend: "up" },
            { label: "Queries/Day", value: "45", trend: "neutral" }
        ]
    },
    {
        id: "7b",
        name: "Hub Estratégico JV",
        description: "Secondary NotebookLM for T.H.R.I.V.E.",
        fullDescription: "Dedicated NotebookLM hub specifically for Joint Ventures, Sales Strategy, and T.H.R.I.V.E. engine alignment. Mirrors key logic from the Master Blueprint.",
        importance: "Vital - Aligns business development with technological capabilities.",
        financials: "Free",
        costMonthly: 0,
        category: "Data & Intelligence",
        lastUpdated: new Date().toISOString(),
        versionData: {
            current: "1.0",
            next: "1.1",
            costCurrent: 0,
            costNext: 0,
            upgradeReason: "Continuous sync with Master Blueprint updates.",
            upgradeDeadline: "Rolling"
        },
        competition: {
            pros: ["Isolated context for sales logic", "No interference with technical codebase questions"],
            cons: ["Requires manual data synchronization from the main Blueprint"],
            suggestion: "Enforce a dual-write sync process when major architectural shifts occur."
        },
        status: 'active',
        history: [
            { id: "h8b", date: new Date().toISOString(), action: "Notebook Configured", description: "Initialized Hub Estratégico.", type: "system" }
        ],
        metrics: [
            { label: "Sources", value: "2", trend: "stable" }
        ]
    },
    {
        id: "veo",
        name: "VEO 3.1",
        description: "Cutting-edge model for generative video and visual content R&D.",
        fullDescription: "VEO 3.1 is utilized for generating high-quality marketing assets, tutorial rollouts, and testing future immersive UI experiences inside SAT Connect.",
        importance: "Core visual AI differential advantage.",
        financials: "Maintain access; monitor quota.",
        competition: "OpenAI Sora.",
        status: "active",
        iconUrl: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-gemini-icon.png"
    },
    {
        id: "gemini",
        name: "Gemini 3.1",
        description: "Advanced multimodal model for reasoning and text processing.",
        fullDescription: "Gemini 3.1 natively handles the day-to-day text parsing, quick reasoning tasks, and integration logic. Used inside the platform for parsing B2B data.",
        importance: "Core AI differential advantage.",
        financials: "Maintain API access.",
        competition: "GPT-4o.",
        status: "active",
        connectionStatus: "disconnected",
        tags: ["LLM", "Text Processing", "Reasoning"],
        iconUrl: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-gemini-icon.png",
        metrics: [
            { label: "Inference Latency", value: "240ms", trend: "down", trendValue: "-10%" },
            { label: "API Calls / day", value: "12,400", trend: "up", trendValue: "+5%" }
        ]
    },
    {
        id: "claude-sonnet",
        name: "Claude Sonnet 4.6 (Thinking)",
        description: "Model utilized for deep-thinking, methodical reasoning.",
        fullDescription: "Anthropic's model is reserved for complex problem-solving where nuanced, step-by-step logic is required over speed. Perfect for large database migrations and security proofs.",
        importance: "Essential for architectural planning.",
        financials: "Upgrade plan if usage limits hit.",
        competition: "OpenAI o1/o3-mini.",
        status: "active",
        metrics: [
            { label: "Complex Queries", value: "45/wk", trend: "neutral" }
        ]
    },
    {
        id: "vercel",
        name: "Vercel",
        description: "Global edge network and CI/CD pipeline for the Next.js frontends.",
        fullDescription: "Vercel powers the B2B Platform and Landing pages, automatically deploying from GitHub. It offers edge caching, serverless function execution, and automatic SSL issuance for our custom domains (satconnect.travel).",
        importance: "Vital - Zero-config Next.js hosting.",
        financials: "$20/mo Pro Tier.",
        costMonthly: 20,
        category: "Infrastructure",
        lastUpdated: new Date().toISOString(),
        versionData: {
            current: "Pro Tier",
            next: "Enterprise",
            costCurrent: 20,
            costNext: 3000,
            upgradeReason: "B2B Marketplace scaling beyond 1TB bandwidth/mo.",
            upgradeDeadline: "Upon reaching 5,000 MAU"
        },
        competition: {
            pros: ["Native Next.js integration", "Instant edge global delivery", "Staging branches preview"],
            cons: ["Expensive bandwidth at scale", "Vendor lock-in on specific Edge API structures"],
            suggestion: "Monitor Serverless execution hours closely. If high volume hits, considering moving backend heavy lifting to GCP."
        },
        status: "active",
        connectionStatus: "connected",
        tags: ["Hosting", "CDN", "Edge Compute", "CI/CD"],
        iconUrl: "https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png",
        metrics: [
            { label: "Visits (7d)", value: "18", trend: "up", trendValue: "USA 50%, MEX 28%" },
            { label: "Bandwidth", value: "9.1 GB", trend: "neutral", trendValue: "Max 100 GB" },
            { label: "Serverless", value: "4.5m", trend: "neutral", trendValue: "Max 4 hrs" }
        ],
        history: [
            { id: "ver-1", date: new Date(Date.now() - 86400000 * 10).toISOString(), action: "Domain Attached", description: "Configured app.satconnect.travel in production.", type: "user" },
            { id: "ver-2", date: new Date(Date.now() - 3600000 * 2).toISOString(), action: "Deployment", description: "Production build deployed successfully.", type: "system" }
        ]
    },
    {
        id: "github",
        name: "GitHub",
        description: "Source code repository and version control system.",
        fullDescription: "Centralized code vault containing the Antigravity system logic, Next.js application, and configuration files.",
        importance: "Necessity.",
        financials: "Free Tier sufficient.",
        costMonthly: 0,
        category: "Infrastructure",
        lastUpdated: new Date().toISOString(),
        versionData: {
            current: "Free Tier",
            next: "Team Tier",
            costCurrent: 0,
            costNext: 44,
            upgradeReason: "Required for GitHub Actions concurrency limits.",
            upgradeDeadline: "Q1 2027"
        },
        competition: {
            pros: ["Industry standard", "Native GitHub Actions", "Flawless Vercel Webhook connection"],
            cons: ["None for current scope"],
            suggestion: "Ensure 2FA policies are enforced for all org access moving to Module 6."
        },
        status: "active",
        connectionStatus: "limited",
        tags: ["Version Control", "CI/CD", "Codebase"],
        iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
        metrics: [
            { label: "Total Commits", value: "53", trend: "up", trendValue: "Public Repo" },
            { label: "Active Branches", value: "2", trend: "neutral" }
        ],
        history: [
            { id: "gh-1", date: new Date(Date.now() - 86400000 * 15).toISOString(), action: "Repo Created", description: "SAT Connect Antigravity V2 repository initialized.", type: "user" }
        ]
    },
    {
        id: "clerk",
        name: "Clerk Auth",
        description: "Drop-in authentication and user management ecosystem.",
        fullDescription: "Clerk handles secure onboarding, JWT session token generation, OAuth (Google/Microsoft), and RBAC (Role Based Access Control) routing for the dashboard.",
        importance: "Critical - Security foundation.",
        financials: "Free up to 10k Monthly Active Users.",
        costMonthly: 0,
        category: "Authentication",
        lastUpdated: new Date().toISOString(),
        versionData: {
            current: "Free Tier",
            next: "Pro Tier",
            costCurrent: 0,
            costNext: 25,
            upgradeReason: "Custom domain CNAME for auth.satconnect.travel required for whitelabeling.",
            upgradeDeadline: "Q2 2026"
        },
        competition: {
            pros: ["Pre-built Next.js <Auth> UI components", "Instant React integrations", "Session management out of the box"],
            cons: ["Requires reliance on external DB for complex user profiles", "Exporting user data can be tedious"],
            suggestion: "Sync Clerk webhook `user.created` to our Prisma DB immediately to hold our own User table mirror."
        },
        status: "active",
        connectionStatus: "connected",
        tags: ["Authentication", "RBAC", "Session Management"],
        iconUrl: "https://images.clerk.dev/static/logo-light-mode-400x400.png",
        metrics: [
            { label: "Active Users", value: "1", trend: "stable" },
            { label: "MAU Usage", value: "1 / 10k", trend: "neutral", trendValue: "0.01%" },
            { label: "Plan Tier", value: "Hobby", trend: "neutral" }
        ],
        history: [
            { id: "clk-1", date: new Date(Date.now() - 86400000 * 5).toISOString(), action: "Role Metadata", description: "Activated `admin` and `super_admin` public metadata structures.", type: "user" }
        ]
    },
    {
        id: "whatsapp",
        name: "WhatsApp",
        description: "WhatsApp Business API for conversational UI and alerting.",
        fullDescription: "Used to build conversational interfaces for suppliers and immediate booking alerts for partners. Crucial for non-laptop mobile engagement.",
        importance: "Core communication pathway.",
        financials: "Optimize conversation costs.",
        competition: "Telegram API, SMS.",
        status: "active",
        iconUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
        metrics: [
            { label: "Messages Sent", value: "15k/mo", trend: "up", trendValue: "+10%" },
            { label: "Open Rate", value: "98%", trend: "neutral" }
        ]
    },
    {
        id: "gmail",
        name: "Gmail API",
        description: "Email communications, system notifications, and correspondence.",
        fullDescription: "Handles transaction receipts, automated PDF itineraries, and B2B engagement. Integrates with the Google Workspace environment natively.",
        importance: "Core communication pathway.",
        financials: "Included in Google Workspace.",
        competition: "SendGrid, Postmark.",
        status: "active",
        iconUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Gmail2020.logo.png",
        metrics: [
            { label: "Emails Sent", value: "45k/mo", trend: "up", trendValue: "+2%" },
            { label: "Bounce Rate", value: "0.4%", trend: "down", trendValue: "-0.1%" }
        ]
    },
    {
        id: "linkedin",
        name: "LinkedIn",
        description: "B2B network building and professional outreach.",
        fullDescription: "Primary channel for B2B supplier recruitment and partner networking. Leverages LinkedIn APIs/Scraping for lead intelligence and audience alignment.",
        importance: "High for marketing.",
        financials: "Evaluate Sales Navigator ROI.",
        competition: "X (Twitter).",
        status: "active",
        iconUrl: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png"
    },
    {
        id: "youtube",
        name: "YouTube",
        description: "Hosting high-quality Knowledgebase tutorials and webinars.",
        fullDescription: "Integrated into Module 3 (Partner Hub) to stream unlisted tutorial content. Eliminates video hosting costs and provides excellent streaming speed globally.",
        importance: "High for Knowledgebase.",
        financials: "Free. No immediate upgrades required.",
        competition: "Vimeo, Wistia.",
        status: "active",
        iconUrl: "https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg",
        metrics: [
            { label: "Views (30d)", value: "12k", trend: "up", trendValue: "+20%" },
            { label: "Avg Watch Time", value: "4m 12s", trend: "up", trendValue: "+12s" }
        ]
    },
    {
        id: "google-calendar",
        name: "Google Calendar",
        description: "Scheduling orchestration inside the SAT Connect platform.",
        fullDescription: "Integrates with internal flows for supplier meetings, tour dispatch schedules, and internal administrative syncing.",
        importance: "Medium-High.",
        financials: "Included in Google Workspace.",
        competition: "Calendly APIs, Cron.",
        status: "active",
        iconUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg"
    },
    {
        id: "vertex-ai",
        name: "Vertex AI",
        description: "Google's enterprise ML platform for proprietary model training.",
        fullDescription: "Slated for future deployment. We will use Vertex to fine-tune custom models on SAT Connect's proprietary supplier data, creating a massive moat.",
        importance: "Strategic Future Phase.",
        financials: "Monitor evaluation costs for initial R&D.",
        competition: "SageMaker (AWS), Azure ML.",
        status: "future",
        iconUrl: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-gemini-icon.png"
    },
    {
        id: "dondominio",
        name: "DonDominio",
        description: "Domain registrar handling root domains and DNS parking.",
        fullDescription: "Manages `satconnect.travel` registration and forwards nameservers/CNAMEs securely to Vercel for production hosting.",
        importance: "High (Infrastructure).",
        financials: "Automatic renewals active. ~$15/yr.",
        competition: "Namecheap, Cloudflare.",
        status: "active"
    },
    {
        id: "stitch-mcp",
        name: "Stitch (MCP Servers)",
        description: "Model Context Protocol integration for Agentic workflows.",
        fullDescription: "Enables Antigravity and NotebookLM to connect seamlessly with internal development environments, reading codebases and executing processes.",
        importance: "High for Agentic workflow.",
        financials: "N/A (Standard toolchain).",
        competition: "Standard REST webhooks.",
        status: "active",
    },
    {
        id: "prisma",
        name: "Prisma (ORM)",
        description: "Next-generation Node.js and TypeScript ORM.",
        fullDescription: "Typesafe database access layer for SAT Connect. Interfaces perfectly with our PostgreSQL database, offering seamless schema migrations and high-performance querying.",
        importance: "High (Database Access).",
        financials: "Open Source.",
        competition: "Drizzle ORM, TypeORM.",
        status: "active",
        iconUrl: "https://camo.githubusercontent.com/9dc0a4d52140bb9f8b4aeb1f71a0fdde185e74d75dabdcf3ce1a5477813a8069/68747470733a2f2f75706c6f61642e77696b696d656469612e6f72672f77696b6970656469612f636f6d6d6f6e732f632f63342f507269736d615f4c6f676f2e737667"
    },
    {
        id: "stripe",
        name: "Stripe",
        description: "Payment processing infrastructure for the internet.",
        fullDescription: "Handles all B2B payment routing, subscription logic (Elite, Pro, Standard), and commission payouts for the B2Bridge OS.",
        importance: "Critical (Financial).",
        financials: "Standard transaction fees. Monitor processing volume.",
        competition: "Braintree, PayPal.",
        status: "active",
        iconUrl: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
        metrics: [
            { label: "MRR", value: "$42k", trend: "up", trendValue: "+$4k" },
            { label: "Disputes", value: "0", trend: "neutral" }
        ]
    }
];
