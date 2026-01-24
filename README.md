
# TaskFlow Pro 🚀

A high-performance, real-world task management application featuring AI-powered sub-steps, performance analytics, and Discord webhook notifications.

## Features
- ✅ **Secure Account Management**: Local-first persistence.
- 🤖 **Gemini AI Integration**: Get actionable sub-steps for tasks and smart task recommendations.
- 🔔 **Discord Notifications**: Automated reminders for deadlines (1 week, 2 days, 1 day, 24h) and completion congratulations.
- 📊 **Advanced Statistics**: Visual productivity trends with interactive charts.
- 🌓 **Dark Mode**: Support for system preference and manual theme switching.

## Getting Started

### Prerequisites
- A modern web browser.
- A Google Gemini API Key (set in environment as `API_KEY`).

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Setting up Discord Webhooks
1. Open Discord and go to your Server Settings.
2. Navigate to **Integrations** > **Webhooks**.
3. Click **New Webhook**.
4. Name your bot (e.g., "TaskFlow Bot") and choose the channel where notifications should appear.
5. Click **Copy Webhook URL**.
6. Open TaskFlow Pro, go to **Settings**, and paste the URL into the **Discord Webhook Integration** field.

## AI Task Recommendations
On the Dashboard, use the "AI Recommender" button to generate 3 new productive tasks based on your current workload.

## License
Distributed under the MIT License. See `LICENSE` for more information.
