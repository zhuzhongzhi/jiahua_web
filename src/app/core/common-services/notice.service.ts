// 消息提醒——发布订阅
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class NoticeChange {
  public messageSource = new BehaviorSubject<string>('Start');
  constructor() {}
  changeMessage(message: string): void {
    this.messageSource.next(message);
  }
}
