# RenoVision AI — Master Product Roadmap

## Vision

Create an AI-powered renovation platform that connects homeowners, contractors, and material suppliers.

The platform should allow users to:

- Visualize renovations
- Plan renovations
- Estimate costs
- Find contractors
- Find suppliers
- Purchase materials
- Share renovation visions
- Manage renovation projects

---

## User Types

### Homeowners

#### Free Plan

- Limited AI renders
- Project saving
- Vision boards
- Contractor advertisements
- Supplier advertisements
- Share projects

#### Premium Plan

- Unlimited renders
- No advertisements
- Advanced design styles
- Material recommendations
- Cost estimates
- Contractor access
- Project folders

### Contractors

- Contractor profiles
- Portfolio showcase
- Lead notifications
- Quote requests
- AI-assisted estimating
- Proposal generation
- Subscription plans

### Material Suppliers

- Supplier profiles
- Sponsored listings
- Product catalogs
- Featured products
- Affiliate links
- Subscription plans

---

## Phase 1 — AI Design Foundation

**Status:** Current focus.

Deliver a credible AI visualization product that homeowners can save, share, and return to.

**Scope:**

- AI room redesign
- User accounts
- Project saving
- Sharing
- Subscription system
- Gallery

**Technical foundation (in progress):**

- Room upload pipeline and server-side image cache
- Fal.ai integration with FLUX Kontext Pro for structure-preserving edits
- Local project and design persistence (localStorage / IndexedDB)
- Production diagnostics for render pipeline verification

---

## Phase 2 — Renovation Planning

Move from image generation to actionable renovation planning.

**Scope:**

- Vision boards
- Material recommendations
- Budget planning
- Project folders
- Renovation checklists

**Outcome:** Homeowners organize ideas, constraints, and next steps around each room or project—not just a single after image.

---

## Phase 3 — Contractor Marketplace

Connect homeowners who have a clear vision with contractors who can execute it.

**Scope:**

- Contractor accounts
- Project matching
- Lead notifications
- Request quote workflow
- Contractor subscriptions

**Example workflow:**

1. Homeowner uploads a room photo
2. RenoVision generates an AI design
3. Homeowner selects a budget range
4. Homeowner clicks **Request Quotes**
5. Nearby subscribed contractors receive the project (before photo, AI vision, budget, style, location)

---

## Phase 4 — Supplier Marketplace

Surface materials that match the design and connect users to suppliers who stock them.

**Scope:**

- Product catalogs
- Material recommendations tied to designs
- Sponsored products
- Local supplier search
- Affiliate commissions

**Outcome:** Every design can drive discoverable, purchasable material options—not generic inspiration.

---

## Phase 5 — AI Estimation Engine

Turn visual designs into realistic cost expectations.

**Scope:**

- Material takeoffs from room and finish selections
- Labor estimates by trade and region
- Cost estimation with ranges and confidence
- Project budgets linked to phases and rooms

**Outcome:** Homeowners understand what a vision might cost before committing to quotes or contractors.

---

## Phase 6 — Full Renovation Ecosystem

Become the operating layer for residential renovation projects end to end.

**Scope:**

- Messaging between homeowners, contractors, and suppliers
- Scheduling and milestones
- Payments and invoicing
- Financing options and referrals
- Permit guidance by jurisdiction
- Project management (tasks, documents, change orders)

**Outcome:** Vision, planning, procurement, and execution live in one platform—not scattered across email, spreadsheets, and separate tools.

---

## Revenue Model

### Homeowners

- Premium subscriptions (unlimited renders, no ads, advanced features)

### Contractors

- Monthly subscriptions
- Lead generation fees
- Featured placement in search and matching

### Suppliers

- Advertising and sponsored listings
- Affiliate commissions on material referrals

### Future

- Transaction fees on payments
- Financing referral revenue
- Premium AI services (estimation, proposals, takeoffs)

---

## Long-Term Goal

The product succeeds when the full journey stays inside RenoVision AI:

**Homeowner Vision**
→ **AI Design**
→ **Material Recommendations**
→ **Contractor Matching**
→ **Quote Requests**
→ **Renovation Project**

AI renders are the entry point—not the destination.
