# AI Content Planner

The AI content planner is a public acquisition feature and a practical tool for clients. It should generate useful marketing output and then convert that output into MOST workflows.

## Public Behavior

Guests can:

- Generate a small number of plans with limits.
- Generate text plans before registration.
- Be prompted to register when saving, creating an order, generating many images, or requesting managed selection.

Clients can:

- Save plans.
- Generate images.
- Convert plans into orders, story campaigns, or managed selection requests.

## Inputs

Collect:

- Business niche.
- Product/service.
- Target audience.
- City/geography.
- Campaign goal: reach, leads, sales, subscribers, awareness.
- Budget.
- Platforms.
- Tone of voice.
- Offer/promotion.
- Constraints and forbidden claims.

## Outputs

Generate:

- Campaign title.
- Positioning idea.
- Story sequence.
- Script for each story.
- Visual idea for each story.
- CTA variants.
- Blogger brief.
- Image prompts.
- Optional generated images.

## Story Plan Structure

A practical stories campaign should include:

1. Hook.
2. Problem or desire.
3. Product/service introduction.
4. Proof or personal angle.
5. Offer.
6. CTA.

Not every campaign needs six stories, but AI should keep this logic.

## Conversion

When converting a plan:

- Into `orders`: use title, description, category, format `story`, budget, platforms, and requirements.
- Into `story_campaigns`: use goal, budget, city, platforms, preferred blogger count, scenario, and brief.
- Into `managed_selection_requests`: use business description, category, budget, city, goal, generated brief, and deadline.

Store the original `ai_campaign_plans.id` on the created entity if the backend supports source links.

## Image Generation

Images should be generated as story-friendly vertical concepts:

- Prefer 9:16.
- Avoid tiny unreadable text in images.
- Generate visuals, backgrounds, product moodboards, or story frames.
- Let the app overlay final text using UI tools later.

Do not claim images are final ad creatives when client approval, legal review, or brand review is required.
