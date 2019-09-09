import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {MapPipe, MapSet} from '../../../directives/pipe/map.pipe';

@Component({
  selector: 'app-auto-refresh',
  templateUrl: './auto-refresh.component.html',
  styleUrls: ['./auto-refresh.component.scss']
})
export class AutoRefreshComponent implements OnInit, OnDestroy {
  @Output() refreshDataFn: EventEmitter<any>;
  public refreshParams: { // 刷新配置
    isAutoRefresh: boolean; // 自动刷新
    refreshTime: string; // 刷新时间间隔
    timeList: any[];
  };
  private timer: any;

  constructor() {
    this.refreshDataFn = new EventEmitter();
    this.refreshParams = {
      isAutoRefresh: false, // 自动刷新
      refreshTime: '15', // 刷新时间间隔
      timeList: []
    };
    this.timer = null;
  }

  public refreshAuto($event) {
    if ($event) {
      this.MockDynamicData();
      return;
    }
    clearInterval(this.timer);
  }

  public updateRefreshTime() {
    clearInterval(this.timer);
    this.refreshAuto(this.refreshParams.isAutoRefresh);
  }

  private MockDynamicData() {
    const timeInternal = Number(this.refreshParams.refreshTime) * 1000;
    this.timer = setInterval(() => {
      this.refreshDataFn.emit();
    }, timeInternal);
  }

  ngOnInit() {
    this.refreshParams.timeList = [...(new MapPipe()).transformMapToArray(MapSet.refreshTime)];
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

}
