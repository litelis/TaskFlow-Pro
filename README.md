# TaskFlow Pro 🚀

A high-performance, real-world task management application featuring AI-powered sub-steps, performance analytics, and Discord webhook notifications.

## Features
- ✅ **Secure Account Management**: Local-first persistence.
- 🤖 **NVIDIA AI Integration**: Get actionable sub-steps for tasks and smart task recommendations using Qwen 3.5 model (FREE).
- 🔔 **Discord Notifications**: Automated reminders for deadlines (1 week, 2 days, 1 day, 24h) and completion congratulations.
- 📊 **Advanced Statistics**: Visual productivity trends with interactive charts.
- 🌓 **Dark Mode**: Support for system preference and manual theme switching.

## Getting Started

### Prerequisites
- A modern web browser.
- **NVIDIA API Key** (see below for FREE setup).

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with your NVIDIA API Key (see below).
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🚀 How to Get Your FREE NVIDIA API Key

**TOTALMENTE GRÁTIS** - No credit card required! 🇪🇸

Follow these steps:

1. **Go to NVIDIA Build**: Visit [https://build.nvidia.com/](https://build.nvidia.com/)
2. **Sign In / Iniciar sesión**: 
   - Click "Sign In" in the top right corner
   - You can sign in with **Google**, **GitHub**, or other providers
   - ⚠️ **IMPORTANT**: Make sure you have your NVIDIA session started/iniciada
3. **Select a Model**: Choose any model (we recommend **Qwen/Qwen3.5-32B** or similar)
4. **Get API Key / Obtener API Key**: 
   - Look for the **"Code"** button/code tab
   - Click **"Generate API Key"** or **"Get API Key"**
   - Copy your API key
5. **¡Eso es todo!** You now have free access to NVIDIA's AI models

### Where to put your API Key

You have TWO options:

#### Option 1: Environment File (Recommended)
Create a `.env` file in the root directory:

```env
VITE_NVIDIA_API_KEY=nvapi-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### Option 2: In the App Settings
1. Open TaskFlow Pro in your browser
2. Go to **Settings**
3. Enter your API key in the **NVIDIA API Key** field
4. Click **Save & Enable AI**

Your key will be stored locally in your browser - no data is sent to external servers!

---

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

