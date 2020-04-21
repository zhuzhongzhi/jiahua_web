import { Injectable } from '@angular/core';
import {EventbusService} from './eventbus.service';
import io from 'socket.io-client';
import {NzNotificationService} from 'ng-zorro-antd';

type OpenFn = (config: any) => Socket;
enum MESSAGE_TYPE {
  Alarm_Msg = 1
}

interface Socket {
  id: string;
  connected: boolean;
  disconnected: boolean;
  open(): Socket;
  connect(): Socket;
  send(...args: any[]): Socket;
}

@Injectable()
export class SocketService {
  public socket: any;
  constructor(private eventbusService: EventbusService) {

  }

  public createSocket(wsUrl: string) {
    this.socket = io(wsUrl);
    this.socket.on('connect', () => {
      // console.log(this.socket.connected); // true
    });
    // this.socket.emit('1');
    this.socket.on('message', (data) => {
        // this.onMessage(data);
    });

    this.socket.on('disconnect', (reason: string) => {
      if (reason === 'io server disconnect') {
        // the disconnection was initiated by the server, you need to reconnect manually
        this.socket.connect();
      }
      // else the socket will automatically try to reconnect
    });
    return this.socket;

  }

  public onMessage(data) {
    switch (data.messageType) {
      case MESSAGE_TYPE.Alarm_Msg:
      this.eventbusService.dispatchAlarmEvent(data.message ? Number(data.message) : 0);
      break;
      default:
      break;
    }
  }
}
