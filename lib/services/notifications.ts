import OneSignal from 'onesignal-node';
import { config } from '../config';

const client = new OneSignal.Client(config.oneSignal.appId);

export class NotificationService {
  static async sendNotification(
    userId: string,
    title: string,
    message: string,
    data?: Record<string, any>
  ): Promise<void> {
    try {
      await client.createNotification({
        include_external_user_ids: [userId],
        headings: { en: title },
        contents: { en: message },
        data: data || {},
      });
    } catch (error) {
      console.error('Error sending notification:', error);
      throw new Error('Failed to send notification');
    }
  }

  static async sendStudyReminder(
    userId: string,
    subject: string,
    time: string
  ): Promise<void> {
    try {
      await this.sendNotification(
        userId,
        'Study Reminder',
        `Time to study ${subject}!`,
        {
          type: 'study_reminder',
          subject,
          time,
        }
      );
    } catch (error) {
      console.error('Error sending study reminder:', error);
      throw new Error('Failed to send study reminder');
    }
  }

  static async sendProgressUpdate(
    userId: string,
    subject: string,
    progress: number
  ): Promise<void> {
    try {
      await this.sendNotification(
        userId,
        'Progress Update',
        `You've completed ${progress}% of ${subject}!`,
        {
          type: 'progress_update',
          subject,
          progress,
        }
      );
    } catch (error) {
      console.error('Error sending progress update:', error);
      throw new Error('Failed to send progress update');
    }
  }

  static async sendAchievementNotification(
    userId: string,
    achievement: string
  ): Promise<void> {
    try {
      await this.sendNotification(
        userId,
        'Achievement Unlocked!',
        `Congratulations! You've earned: ${achievement}`,
        {
          type: 'achievement',
          achievement,
        }
      );
    } catch (error) {
      console.error('Error sending achievement notification:', error);
      throw new Error('Failed to send achievement notification');
    }
  }
} 