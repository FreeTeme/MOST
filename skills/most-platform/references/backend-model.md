# Backend Model

Use these entities as the canonical domain model. Names can be adapted to local conventions, but relationships and statuses should stay recognizable.

## Entities

### users

- `id`
- `role`: `guest | blogger | client | admin | manager`
- `name`
- `avatar_url`
- `email`
- `phone`
- `telegram_id`
- `status`: `active | blocked | deleted`
- `created_at`
- `updated_at`

### blogger_profiles

- `id`
- `user_id`
- `display_name`
- `about`
- `city`
- `country`
- `categories`
- `audience_age`
- `audience_gender`
- `audience_geo`
- `rating`
- `reviews_count`
- `completed_deals_count`
- `verified_by_platform`
- `created_at`
- `updated_at`

### client_profiles

- `id`
- `user_id`
- `company_name`
- `company_category`
- `company_description`
- `website`
- `contact_person`
- `city`
- `rating`
- `reviews_count`
- `created_at`
- `updated_at`

### social_accounts

- `id`
- `blogger_id`
- `platform`
- `url`
- `username`
- `followers_count`
- `avg_story_views`
- `engagement_rate`
- `story_price`
- `story_package_price`
- `ready_for_story_ads`
- `ad_formats`
- `niche`
- `status`: `draft | active | hidden | rejected`
- `created_at`
- `updated_at`

### orders

- `id`
- `client_id`
- `title`
- `description`
- `category`
- `platforms`
- `format`: `story | reel | post | video | integration | other`
- `budget_type`: `money | barter | negotiable`
- `budget_amount`
- `currency`
- `deadline`
- `requirements`
- `status`: `draft | published | in_progress | completed | cancelled | archived`
- `applications_count`
- `created_at`
- `updated_at`

### applications

- `id`
- `order_id`
- `campaign_id`
- `blogger_id`
- `message`
- `price`
- `currency`
- `deadline`
- `status`: `pending | accepted | rejected | cancelled | withdrawn`
- `created_at`
- `updated_at`

Rules:

- Either `order_id` or `campaign_id` should be present.
- A blogger should not have duplicate active applications for the same order/campaign.
- Accepting an application should create a deal and chat.

### deals

- `id`
- `order_id`
- `campaign_id`
- `application_id`
- `client_id`
- `blogger_id`
- `status`: `active | submitted | revision_requested | completed | disputed | cancelled`
- `started_at`
- `completed_at`
- `created_at`
- `updated_at`

### story_campaigns

- `id`
- `client_id`
- `title`
- `description`
- `category`
- `city`
- `goal`: `reach | leads | sales | subscribers | awareness`
- `budget`
- `currency`
- `preferred_bloggers_count`
- `platforms`
- `status`: `draft | published | selection | in_progress | completed | cancelled`
- `created_at`
- `updated_at`

### campaign_blogger_selections

- `id`
- `campaign_id`
- `blogger_id`
- `source`: `auto | manager | client`
- `price`
- `expected_reach`
- `status`: `suggested | invited | applied | selected | rejected | removed`
- `created_at`
- `updated_at`

### managed_selection_requests

- `id`
- `client_id`
- `business_name`
- `category`
- `budget`
- `currency`
- `city`
- `goal`
- `description`
- `deadline`
- `status`: `new | in_review | bloggers_selected | approved | launched | completed | cancelled`
- `manager_id`
- `manager_comment`
- `created_at`
- `updated_at`

### ai_campaign_plans

- `id`
- `user_id`
- `title`
- `business_niche`
- `goal`
- `budget`
- `currency`
- `platforms`
- `story_count`
- `ideas`
- `scenario`
- `cta`
- `visual_prompts`
- `generated_images`
- `source_payload`
- `created_at`
- `updated_at`

### chats

- `id`
- `deal_id`
- `order_id`
- `campaign_id`
- `client_id`
- `blogger_id`
- `status`: `active | archived`
- `created_at`
- `updated_at`

### chat_messages

- `id`
- `chat_id`
- `sender_id`
- `message`
- `attachments`
- `read_at`
- `created_at`

### reviews

- `id`
- `deal_id`
- `author_id`
- `target_id`
- `rating`
- `comment`
- `created_at`

## Access Rules

- Guests can read public marketing pages and use limited AI planner endpoints.
- Bloggers can read published orders/campaigns and their own applications/deals/chats.
- Clients can manage their own orders/campaigns/requests and read applications for their own orders/campaigns.
- Chat access is limited to chat participants and admins/managers.
- Admins/managers can read and manage all operational entities.

## Derived State

Keep these derived values synchronized:

- `orders.applications_count`
- profile `rating` and `reviews_count`
- `completed_deals_count`
- campaign selected blogger counts and estimated total reach

## Backend Priorities

1. Auth and role-aware user profile creation.
2. CRUD for profiles, social accounts, orders.
3. Applications with duplicate prevention.
4. Accept/reject application transaction that creates deal and chat.
5. Chat messages with participant authorization.
6. Stories campaign and campaign selections.
7. Managed selection request lifecycle.
8. AI plan persistence and conversion into campaign/order.
