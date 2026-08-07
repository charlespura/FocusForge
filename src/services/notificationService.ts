interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  requireInteraction?: boolean;
}

class NotificationService {
  private permission: NotificationPermission | null = null;

  constructor() {
    this.init();
  }

  private getNotificationAPI() {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return null;
    }

    return window.Notification;
  }

  private init() {
    const NotificationAPI = this.getNotificationAPI();
    if (!NotificationAPI) {
      console.log('This browser does not support notifications');
      return;
    }

    this.permission = NotificationAPI.permission;
  }

  async requestPermission(): Promise<boolean> {
    const NotificationAPI = this.getNotificationAPI();
    if (!NotificationAPI) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (NotificationAPI.permission === 'granted') {
      this.permission = 'granted';
      return true;
    }

    if (NotificationAPI.permission === 'denied') {
      console.log('Notification permission was denied');
      return false;
    }

    try {
      const permission = await NotificationAPI.requestPermission();
      this.permission = permission;
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  sendNotification(payload: NotificationPayload): boolean {
    const NotificationAPI = this.getNotificationAPI();
    if (!NotificationAPI) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (NotificationAPI.permission !== 'granted') {
      console.log('Notification permission not granted');
      return false;
    }

    try {
      const notification = new NotificationAPI(payload.title, {
        body: payload.body,
        icon: payload.icon || '/iconslogo.png',
        tag: payload.tag || 'focusforge-timer',
        requireInteraction: payload.requireInteraction ?? true,
        silent: false,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
        if (window.location.pathname !== '/') {
          window.location.href = '/';
        }
      };

      window.setTimeout(() => {
        notification.close();
      }, 8000);

      return true;
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  }

  sendTimerCompleteNotification(nextMode: 'focus' | 'break', sessionsCompleted: number) {
    if (nextMode === 'focus') {
      return this.sendNotification({
        title: 'Time to focus!',
        body: `Break finished. You have completed ${sessionsCompleted} session${sessionsCompleted > 1 ? 's' : ''}.`,
        requireInteraction: true,
      });
    }

    return this.sendNotification({
      title: 'Focus session complete',
      body: `Great job! You've completed ${sessionsCompleted} focus session${sessionsCompleted > 1 ? 's' : ''}. Time for a break.`,
      requireInteraction: true,
    });
  }

  sendBreakNotification(breakType: 'short' | 'long') {
    const title = breakType === 'short' ? 'Break time!' : 'Long break!';
    const body =
      breakType === 'short'
        ? 'Take a short 5-minute break. Rest your eyes and stretch!'
        : 'Time for a longer 15-minute break. Step away and recharge!';

    return this.sendNotification({
      title,
      body,
      requireInteraction: true,
    });
  }

  sendSessionStartNotification() {
    return this.sendNotification({
      title: 'Focus session started!',
      body: 'Stay focused and make progress!',
      requireInteraction: false,
    });
  }

  sendDailyGoalNotification(progress: number, target: number) {
    if (progress >= target) {
      return this.sendNotification({
        title: 'Daily goal complete!',
        body: `Amazing! You've completed your daily goal of ${target} pomodoros!`,
        requireInteraction: true,
      });
    }

    return this.sendNotification({
      title: 'Daily goal progress',
      body: `${progress} of ${target} pomodoros completed. ${target - progress} more to go!`,
      requireInteraction: false,
    });
  }
}

export const notificationService = new NotificationService();
