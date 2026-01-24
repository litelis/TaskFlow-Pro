
export const discordService = {
  sendNotification: async (webhookUrl: string, content: string, title: string, color: number = 5814783) => {
    if (!webhookUrl) return;

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: title,
            description: content,
            color: color,
            timestamp: new Date().toISOString()
          }]
        })
      });
      return response.ok;
    } catch (error) {
      console.error('Failed to send Discord notification:', error);
      return false;
    }
  },

  sendTaskReminder: async (webhookUrl: string, taskTitle: string, timeLeft: string) => {
    return discordService.sendNotification(
      webhookUrl,
      `⏰ Reminder: Your task **"${taskTitle}"** is due in ${timeLeft}!`,
      'Upcoming Deadline',
      15844367 // Orange
    );
  },

  sendTaskCompleted: async (webhookUrl: string, taskTitle: string) => {
    return discordService.sendNotification(
      webhookUrl,
      `🎉 Congratulations! You have completed your task: **"${taskTitle}"**. Keep up the great work!`,
      'Task Completed',
      3066993 // Green
    );
  }
};
