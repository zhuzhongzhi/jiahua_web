import { Injectable } from '@angular/core';
import { Subject} from 'rxjs/internal/Subject';
import {Observable} from 'rxjs/internal/Observable';

@Injectable()
export class EventbusService {
  private alarmevent: Subject<any> = new Subject<any>();

  constructor() { }

  public dispatchAlarmEvent(eventData: any): void {
    this.alarmevent.next(eventData);
  }
  public storeAlarmEvent(): Observable<any> {
    return this.alarmevent.asObservable();
  }

}
