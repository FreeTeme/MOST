---
name: most-platform
description: "Product and implementation blueprint for the MOST platform: a stories-marketing marketplace where clients create campaigns and orders, bloggers respond, MOST can provide managed blogger selection, AI helps generate content plans and images, and clients/bloggers coordinate through chats. Use when planning or implementing MOST frontend, backend, database schema, role access, pages, user flows, MVP scope, or feature behavior across parallel branches."
---

# MOST Platform

Use this skill to keep every MOST branch aligned on the same product model. MOST is not a generic influencer marketplace: it focuses on affordable stories marketing, bundles of several verified bloggers under a client budget, AI-assisted content planning, and managed selection by the MOST team.

## Core Product

Build around this main loop:

1. Client defines business niche, goal, geography, budget, and preferred format.
2. MOST helps turn that into a stories campaign, AI content plan, or managed selection request.
3. Bloggers with matching story inventory respond or are invited.
4. Client accepts one or several bloggers.
5. A deal and chat are created for each accepted collaboration.
6. Blogger delivers story materials or placement proof.
7. Client completes the deal and leaves a review.

Default stack decisions:

- Frontend: Next.js, TypeScript, Ant Design.
- Backend: Supabase or a backend compatible with the schema and RLS model in the references.
- UI approach: use Ant Design components directly; create only thin product wrappers.
- Responsive approach: one app, desktop and mobile layouts adapted per screen.

## Reference Routing

Read only the references needed for the current task:

- For product scope, roles, major flows, MVP phases: `references/product-blueprint.md`.
- For database entities, statuses, and backend rules: `references/backend-model.md`.
- For frontend pages, access rules, Ant Design usage, and responsive behavior: `references/frontend-map.md`.
- For AI content planning and image-generation behavior: `references/ai-content.md`.

## Implementation Rules

Keep these rules stable across branches:

- Treat `client`, `blogger`, and `admin/manager` as separate product roles, even if auth initially stores them in one `users` table.
- Separate normal orders from story campaigns. A story campaign may select multiple bloggers under one budget.
- Separate `applications` from `deals`. An application is an offer; a deal begins only after acceptance.
- Create chats from accepted applications/deals, not from every public order view.
- Keep managed selection as a first-class workflow, not just a contact form.
- Store AI-generated plans as reusable campaign artifacts so they can become orders or managed selection requests.
- Prefer explicit statuses over booleans for orders, applications, deals, chats, and managed requests.
- Use mobile-first interaction density for cards and drawers, but keep desktop efficient with tables, side navigation, and wider filters.

## Frontend Guidance

Use Ant Design for the first implementation:

- Layout: `Layout`, `Menu`, `Tabs`, `Grid`, `Drawer`.
- Forms: `Form`, `Input`, `InputNumber`, `Select`, `DatePicker`, `Radio`, `Checkbox`, `Upload`.
- Content: `Card`, `List`, `Table`, `Descriptions`, `Avatar`, `Tag`, `Badge`, `Rate`, `Statistic`.
- Actions: `Modal`, `Popconfirm`, `Button`, `Dropdown`, `Segmented`, `Steps`.
- States: `Empty`, `Skeleton`, `Spin`, `Result`, `Alert`, `message`, `notification`.

Create product components only when they remove duplication:

- `OrderCard`
- `BloggerCard`
- `ApplicationCard`
- `CampaignBudgetPlanner`
- `ChatThread`
- `ProfileHeader`
- `ResponsiveShell`

These components should be thin compositions of Ant Design, not a custom design system.

## Backend Guidance

Use role-aware access from the start:

- Clients can create and manage their own orders, campaigns, managed selection requests, and incoming applications.
- Bloggers can manage their profile/social accounts and apply to available orders/campaigns.
- Chats are visible only to participants and admins/managers.
- Admins/managers can moderate users, orders, campaigns, managed requests, and disputes.

When a feature modifies collaboration state, update derived counters and statuses transactionally where possible.

## MVP Priority

Implement in this order unless the user explicitly changes priority:

1. Auth, role selection, profiles.
2. Blogger social accounts with stories-specific pricing and metrics.
3. Client order creation and order catalog.
4. Blogger applications and client acceptance/rejection.
5. Deals and basic chats.
6. Stories campaign builder for selecting several bloggers under a budget.
7. Public AI content planner with conversion into an order/campaign.
8. Managed selection request and manager/admin workflow.
9. Reviews, ratings, moderation, notifications, and payments.
