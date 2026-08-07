interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  requireInteraction?: boolean;
}

class NotificationService {
  private permission: NotificationPermission | null = null;
  private audioContext: AudioContext | null = null;

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

  private getAudioContext() {
    if (typeof window === 'undefined') {
      return null;
    }

    const AudioContextConstructor = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextConstructor) {
      return null;
    }

    if (!this.audioContext) {
      this.audioContext = new AudioContextConstructor();
    }

    return this.audioContext;
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

  async primeAlarmSound(): Promise<boolean> {
    const audioContext = this.getAudioContext();
    if (!audioContext) {
      return false;
    }

    try {
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      return true;
    } catch (error) {
      console.error('Error preparing alarm sound:', error);
      return false;
    }
  }

  async playAlarmSound(): Promise<boolean> {
    const audioContext = this.getAudioContext();
    if (!audioContext) {
      return false;
    }

    try {
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      const gainNode = audioContext.createGain();
      gainNode.gain.value = 0.0001;
      gainNode.connect(audioContext.destination);

      const notes = [
        { frequency: 880, start: 0, duration: 0.18 },
        { frequency: 1046, start: 0.22, duration: 0.18 },
        { frequency: 1318, start: 0.44, duration: 0.24 },
      ];

      notes.forEach(({ frequency, start, duration }) => {
        const oscillator = audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        oscillator.connect(gainNode);

        const now = audioContext.currentTime;
        gainNode.gain.setValueAtTime(0.0001, now + start);
        gainNode.gain.exponentialRampToValueAtTime(0.12, now + start + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + start + duration);

        oscillator.start(now + start);
        oscillator.stop(now + start + duration + 0.02);
      });

      window.setTimeout(() => {
        gainNode.disconnect();
      }, 1000);

      return true;
    } catch (error) {
      console.error('Error playing alarm sound:', error);
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
