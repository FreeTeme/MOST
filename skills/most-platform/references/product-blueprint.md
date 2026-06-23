# Product Blueprint

## Positioning

MOST is a marketplace and service layer for stories marketing. The platform helps small and medium businesses buy affordable story placements from several relevant bloggers instead of spending the whole budget on one expensive reel or integration.

Core promise:

- Launch stories advertising quickly.
- Fit several bloggers into a fixed budget.
- Use verified or platform-selected bloggers.
- Generate campaign ideas, story scripts, and visual concepts with AI.
- Coordinate work through built-in chats.

## Roles

### Guest

Can:

- Open public landing/start pages.
- Use the public AI content planner with limits.
- View public explanation pages for stories marketing and managed selection.
- Start registration or role selection.

Cannot:

- Create orders.
- Apply to orders.
- Start chats.
- View private profiles, deal data, or client applications.

### Blogger

Can:

- Create and edit blogger profile.
- Add social accounts.
- Set story-specific pricing and availability.
- Browse available orders and stories campaigns.
- Apply to orders/campaigns.
- Receive invitations into campaigns.
- Chat with clients after acceptance.
- Submit materials, story links, screenshots, and proof.
- Track applications, active deals, completed deals, reviews, and rating.

Important profile fields:

- Display name, avatar, bio, city, country.
- Categories/niches.
- Platforms.
- Followers, average story views, engagement metrics.
- Story price and package price.
- Ready-for-story-ads flag.
- Audience age, gender, geography.
- Verified-by-platform flag.

### Client

Can:

- Create and edit client/company profile.
- Create ordinary orders.
- Create stories campaigns by budget.
- Generate AI content plans and convert them into orders/campaigns.
- Request managed blogger selection from MOST.
- Browse blogger catalog.
- Review incoming applications.
- Accept/reject applications.
- Chat with accepted bloggers.
- Complete deals and leave reviews.

Important profile fields:

- Company name, category, description.
- Website/social link.
- Contact person.
- City/market.
- Rating and review count.

### Admin/Manager

Can:

- Moderate users, orders, applications, deals, reviews, and reports.
- Mark bloggers as verified.
- Manage categories, platforms, and public lists.
- Handle managed selection requests.
- Build recommended blogger selections for clients.
- View disputes and support conversations when needed.

For MVP, `admin` and `manager` may be one role if simpler.

## Core Workflows

### Ordinary Order

1. Client creates an order.
2. Blogger finds it in the catalog.
3. Blogger sends an application with message, price, and timing.
4. Client accepts or rejects.
5. Accepted application creates a deal and chat.
6. Blogger delivers work.
7. Client completes deal and leaves review.

### Stories Campaign

1. Client enters budget, niche, city/geography, goal, platforms, and preferred blogger count.
2. Platform estimates a blogger mix by story price and expected reach.
3. Client publishes campaign or requests managed help.
4. Bloggers apply or are invited.
5. Client selects several bloggers.
6. Each selected blogger becomes a deal/chat under the campaign.

### Managed Selection

1. Client submits a managed selection request.
2. Manager reviews budget, niche, goals, timing, and constraints.
3. Manager picks verified bloggers.
4. Client reviews the proposed selection.
5. Manager or client launches invitations/deals.

### AI Content Planner

1. Guest or client describes business, audience, offer, budget, and tone.
2. AI generates story campaign plan, scenarios, CTAs, captions, and image prompts.
3. AI optionally generates story images or visual concepts.
4. Client can convert the plan into an order, stories campaign, or managed request.

## MVP Scope

Must include:

- Roles: guest, blogger, client, admin/manager.
- Profiles for blogger and client.
- Social accounts with story prices and metrics.
- Orders and applications.
- Deals after accepted applications.
- Chats tied to deals.
- Stories campaign builder.
- Public AI content planner.
- Managed selection request.

Can wait:

- Payments.
- Escrow.
- Complex analytics.
- Advanced moderation queues.
- Push notifications.
- Full admin CRM.
- Automated AI matching.
