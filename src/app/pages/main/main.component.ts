import { PushNotificationService } from './../../../shared/services/notification.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [],
})
export class MainComponent {
  public isPause = signal(true);
  public isBreaking = signal(true);
  public timeElapse = signal(0); //second

  private sessionInterval!: NodeJS.Timeout;

  constructor() {
    if (Notification.permission == 'default') {
      this.askForNotification();
    }
    this.newSession();
  }

  public get getMinutes() {
    return String((this.timeElapse() / 60).toFixed(0)).padStart(2, '0');
  }

  public get getSecond() {
    const second = this.timeElapse() % 60;
    return String(second).padStart(2, '0');
  }

  public newSession() {
    this.isPause.set(true);
    this.isBreaking.set(false);
    this.timeElapse.set(0);
    this.clearTimeELapseInterval();
  }

  public newBreakTime() {
    this.isPause.set(true);
    this.isBreaking.set(true);
    this.clearTimeELapseInterval();
    this.timeElapse.update((val) => Math.ceil(val / 5));
  }

  public startSession() {
    this.isPause.set(false);
    this.sessionInterval = setInterval(() => {
      this.timeElapse.update((val) => ++val);
    }, 1000);
  }

  public askForNotification() {
    Swal.fire({
      title: 'Allow notification ?',
      showCancelButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        Notification.requestPermission();
      }
    });
  }

  public startBreaking() {
    this.isPause.set(false);
    this.sessionInterval = setInterval(() => {
      if (this.timeElapse() <= 0) {
        this.newSession();
        // this.pushNotificationService.sendNotification('Break time ended', {
        //   body: 'Your break time has finish, time for focusing',
        // });
        const notification = new Notification('Times up !', {
          body: 'Breaktime over, time to focus',
        });

        return;
      }
      this.timeElapse.update((val) => --val);
    }, 1000);
  }

  confirmStarting() {
    Swal.fire({
      title: this.isBreaking() ? 'Skip to Focusing ?' : 'Skip to Breaking ?',
      toast: true,
      showCancelButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        this.isBreaking() ? this.newSession() : this.newBreakTime();
      }
    });
  }

  private clearTimeELapseInterval() {
    clearInterval(this.sessionInterval);
  }
}
