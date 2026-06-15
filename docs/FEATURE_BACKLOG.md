# RenoVision AI — Feature Backlog

**Purpose:** Idea vault for every future RenoVision feature, integration, and revenue concept.

This document captures possibilities only. It does not assign priority, effort, or delivery dates. For phased product direction, see [RENOVISION_MASTER_ROADMAP.md](./RENOVISION_MASTER_ROADMAP.md).

---

## Homeowner Features

- AI room redesign from photo upload
- Multiple interior design styles (modern, luxury, coastal, japandi, farmhouse, minimalist)
- Before / after comparison slider
- Save designs to personal gallery
- Organize designs into projects and rooms
- Project folders for multi-room renovations
- Vision boards (mood boards, inspiration pins)
- Share designs via link or social export
- Download high-resolution after images
- Design variations from a saved concept
- Room type tagging (kitchen, living room, bedroom, bathroom, basement)
- Renovation checklists per room type
- Budget planning and budget ranges per project
- Material preference notes on a design
- Timeline / phase planning for a renovation
- Compare multiple AI variants side by side
- Favorite or star designs
- Design notes and recommendations panel
- Email or push notifications when a render completes
- Render history and re-run with different styles
- Sample room templates for users without a photo
- Photo tips and upload quality guidance
- Premium-only advanced styles
- Premium unlimited AI renders
- Ad-free experience on premium
- Contractor discovery from a saved design
- Request quotes from contractors
- Supplier product suggestions on a design
- Public profile or portfolio of shared visions
- Invite family members to comment on a design
- Print-ready export for presentations
- Client presentation mode for designers helping homeowners

---

## Contractor Features

- Contractor account and business profile
- Portfolio showcase (before / after, completed jobs)
- Service area and geography settings
- Trade specialties (kitchen, bath, flooring, full remodel)
- Lead inbox for homeowner quote requests
- Lead notifications (email, SMS, in-app)
- View homeowner upload, AI vision, budget, and style context
- Accept or decline leads
- AI-assisted estimate drafts from a homeowner vision
- Proposal generation (PDF or branded document)
- Quote builder with line items
- Subscription plans for contractors
- Featured contractor placement in search
- Verified contractor badges
- License and insurance document upload
- Reviews and ratings from homeowners
- Messaging with homeowners
- Schedule site visits from the platform
- CRM-style pipeline (new lead → quoted → won → lost)
- Team member accounts under a contractor org
- Templates for common renovation scopes
- Integration with existing estimating tools
- Win/loss analytics on leads
- Promoted listings in local markets

---

## Supplier Features

- Supplier account and business profile
- Product catalog upload and management
- SKU, price, and availability fields
- Sponsored product listings
- Featured materials on design results
- Category browsing (cabinets, countertops, tile, lighting, appliances)
- Local inventory and store locator
- Affiliate or referral links to purchase
- Subscription plans for suppliers
- Promotion placement on homeowner dashboards
- Material ads alongside free-tier experiences
- Brand pages and lookbooks
- Connect products to AI-suggested materials
- Seasonal campaigns and featured collections
- Analytics on clicks and conversions
- Regional pricing and distribution rules
- Partner API for real-time stock

---

## AI Features

- Structure-preserving room redesign (image-to-image / Kontext)
- Style-specific prompt templates
- Strong vs aggressive renovation prompt modes
- Room-type-aware prompts (kitchen, bath, etc.)
- Construction-phase kitchen handling (replace finishes, remove workers/tools from output)
- Negative prompts to avoid outdoor / bridge / fantasy scenes
- Multiple provider support (Fal, Replicate, OpenAI, Stability)
- Render job queue with progress phases
- Webhook-based async completion
- AI material recommendations from a finished design
- AI material takeoffs from room dimensions
- AI labor estimate suggestions by trade
- AI project cost range generation
- AI proposal copy for contractors
- AI checklist generation for a room type
- Prompt A/B testing harness
- Seed and reproducibility controls
- Batch generation of style variants
- Upscaling or enhancement pass on outputs
- Object-level edits (change countertop only, change cabinets only)
- Virtual staging for empty rooms
- Lighting and time-of-day adjustments
- Style transfer from reference images
- Natural language edit instructions (“make cabinets white oak”)

---

## Revenue Ideas

- Homeowner premium subscriptions
- Contractor monthly subscriptions
- Supplier monthly subscriptions
- Pay-per-render credits for free tier
- Lead generation fees per contractor introduction
- Featured contractor placement fees
- Sponsored supplier listings
- Affiliate commissions on material links
- Transaction fees on in-platform payments
- Financing referral partnerships
- Premium AI services (estimation, proposals, takeoffs)
- White-label licensing for brokerages or showrooms
- API access for partners
- Enterprise plans for design firms
- Annual billing discounts
- Family or household plans

---

## Mobile App Ideas

- Native iOS and Android apps
- Camera-first room upload
- Push notifications for render completion
- Mobile gallery and project browsing
- Share designs to Instagram, Pinterest, Messages
- AR preview of materials in room (future)
- On-site photo capture for contractors
- Offline viewing of saved designs
- Mobile quote request flow for homeowners
- Contractor lead alerts on mobile
- Apple Sign In / Google Sign In on mobile
- Deep links into a specific design or project

---

## Future Integrations

- Stripe billing and subscriptions
- Supabase auth and cloud database sync
- Supabase Storage or S3 for design images
- Google OAuth and Apple Sign In
- Email provider (transactional: render ready, quote received)
- SMS provider for contractor lead alerts
- CRM integrations (HubSpot, Salesforce)
- Accounting integrations (QuickBooks)
- Calendar integrations (Google Calendar, Outlook)
- Payment processing (Stripe Connect for contractor payments)
- Financing partners (affiliate APIs)
- Permit data APIs by municipality
- MLS or real estate listing integrations
- Pinterest / Houzz inspiration import
- Shopify or supplier e-commerce feeds
- Zapier or Make automation webhooks
- Analytics (PostHog, Mixpanel, GA4)
- Error monitoring (Sentry)
- CDN for image delivery
- Redis or KV for server-side upload cache across instances

---

## Nice-to-Have Features

- Dark mode (already in app — extend consistency)
- Keyboard shortcuts in dashboard
- Drag-and-drop project organization
- Bulk export of all designs in a project
- Design versioning with rollback
- Comments thread on a design
- @mentions in project collaboration
- Activity feed on a project
- Custom style creation from user description
- Seasonal or holiday style packs
- Referral program for homeowners
- Onboarding tour for first-time users
- In-app changelog
- Feedback widget on render results
- “Report bad output” for model improvement
- Localization / multiple languages
- Accessibility audit and WCAG improvements
- SEO landing pages per room type
- Blog or inspiration content hub
- Case studies from real renovations
- Demo mode without sign-up
- Keyboard-accessible before/after slider
- GIF or short video export of before/after transition
- Wallpaper or lock screen export sizes
- Custom watermarks for contractor portfolios
- Brand kit for contractors (logo on proposals)
- Duplicate design to new project
- Archive projects instead of delete
- Trash / restore for deleted designs
- Admin dashboard for support staff
- Feature flags for gradual rollouts
- User impersonation for support (secure, audited)
