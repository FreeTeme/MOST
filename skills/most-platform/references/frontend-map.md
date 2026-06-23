# Frontend Map

Use Next.js, TypeScript, and Ant Design. Do not build a custom component library in the MVP. Compose Ant Design components into thin product components.

## Layouts

### Desktop

- Use `Layout.Sider` for main navigation.
- Use `Layout.Header` for account actions and current context.
- Use tables where comparison matters: applications, deals, admin lists.
- Keep filters visible on wide screens.

### Mobile

- Use compact header plus bottom navigation or drawer navigation.
- Use cards and lists instead of wide tables.
- Put filters in `Drawer`.
- Use `Modal` or `Drawer` for short actions.
- Keep creation forms split into sections/steps.

## Page Access

| Page | Guest | Blogger | Client | Admin/Manager |
| --- | --- | --- | --- | --- |
| `/` | yes | yes | yes | yes |
| `/auth` | yes | no | no | no |
| `/role-select` | yes | yes | yes | yes |
| `/ai-content` | limited | yes | yes | yes |
| `/stories-marketing` | yes | yes | yes | yes |
| `/dashboard` | no | yes | yes | yes |
| `/profile/me` | no | yes | yes | yes |
| `/bloggers` | limited | yes | yes | yes |
| `/bloggers/[id]` | limited | yes | yes | yes |
| `/orders` | limited | yes | yes | yes |
| `/orders/new` | no | no | yes | yes |
| `/orders/my` | no | no | yes | yes |
| `/orders/[id]` | limited | yes | yes | yes |
| `/orders/[id]/applications` | no | no | owner | yes |
| `/applications/my` | no | yes | no | yes |
| `/campaigns/stories/new` | no | no | yes | yes |
| `/campaigns/stories/[id]` | no | participant | owner | yes |
| `/managed-selection` | yes | no | yes | yes |
| `/managed-selection/my` | no | no | yes | yes |
| `/deals` | no | yes | yes | yes |
| `/chats` | no | yes | yes | yes |
| `/admin` | no | no | no | yes |

## Pages

### Public

- `/`: Start page or role-aware redirect.
- `/ai-content`: AI content planner for story campaigns and visual ideas.
- `/stories-marketing`: Explains and starts budget-based stories marketing.
- `/managed-selection`: Request MOST-managed blogger selection.
- `/auth`: Login/register.
- `/role-select`: Choose blogger/client role.

### Blogger

- `/dashboard`: Summary of applications, active deals, and recommended orders.
- `/profile/me`: Blogger profile editor.
- `/socials`: Social account list.
- `/socials/new`: Add social account.
- `/orders`: Available orders/campaign opportunities.
- `/orders/[id]`: Order detail and application form.
- `/applications/my`: Own applications.
- `/deals`: Active and completed deals.
- `/chats`: Deal conversations.

### Client

- `/dashboard`: Orders, campaigns, incoming applications, managed requests.
- `/profile/me`: Client/company profile editor.
- `/orders/my`: Own orders.
- `/orders/new`: Create ordinary order.
- `/orders/[id]/applications`: Incoming applications.
- `/campaigns/stories/new`: Budget-based stories campaign builder.
- `/campaigns/stories/[id]`: Campaign detail and selected bloggers.
- `/bloggers`: Blogger catalog.
- `/bloggers/[id]`: Blogger profile.
- `/managed-selection/my`: Managed request status.
- `/deals`: Active and completed deals.
- `/chats`: Deal conversations.

### Admin/Manager

- `/admin`: Overview.
- `/admin/users`: User moderation.
- `/admin/orders`: Order moderation.
- `/admin/campaigns`: Campaign moderation.
- `/admin/managed-selection`: Managed selection queue.
- `/admin/bloggers`: Verification and blogger curation.
- `/admin/reviews`: Review moderation.
- `/admin/reports`: Complaints/disputes.

## Ant Design Component Choices

- Navigation: `Layout`, `Menu`, `Tabs`, `Breadcrumb`, `Drawer`.
- Forms: `Form`, `Input`, `InputNumber`, `Select`, `DatePicker`, `Radio`, `Checkbox`, `Upload`.
- Data: `Card`, `List`, `Table`, `Descriptions`, `Statistic`.
- Identity/status: `Avatar`, `Tag`, `Badge`, `Rate`.
- Decisions: `Modal`, `Popconfirm`, `Button`, `Dropdown`, `Segmented`, `Steps`.
- Feedback: `Empty`, `Skeleton`, `Spin`, `Result`, `Alert`, `message`, `notification`.

## Product Components

Allowed thin wrappers:

- `ResponsiveShell`
- `OrderCard`
- `BloggerCard`
- `ApplicationCard`
- `CampaignBudgetPlanner`
- `ManagedSelectionForm`
- `AiPlanResult`
- `ChatThread`
- `ProfileHeader`

Avoid building custom primitives like `Button`, `Input`, `Card`, or `Modal` unless there is a strong project-specific reason.

## Screen-Level Functionality

### AI Content

- Inputs: niche, offer, audience, city, goal, tone, budget, platforms.
- Outputs: campaign idea, story sequence, scripts, CTA, visual prompts, generated images.
- Main actions: save plan, create order, create stories campaign, request managed selection.

### Stories Campaign Builder

- Inputs: budget, category, city, goal, platforms, blogger count, constraints.
- Show estimated mix: bloggers, expected reach, story prices, remaining budget.
- Allow manual selection later.

### Chat

- List chats by active deal/campaign.
- Show system events inline with user messages.
- Allow text and attachments when backend supports storage.
- Keep chat hidden until application acceptance/deal creation.
