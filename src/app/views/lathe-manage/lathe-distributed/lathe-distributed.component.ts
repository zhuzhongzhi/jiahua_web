import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {IngotAlarmService} from '../../../core/biz-services/produceManage/IngotAlarmService';

@Component({
  selector: 'app-lathe-distributed',
  templateUrl: './lathe-distributed.component.html',
  styleUrls: ['./lathe-distributed.component.scss']
})
export class LatheDistributedComponent implements OnInit {

  filters = {
    batchNum: '',
    craftState: '',
    code: ''
  };
  data: any = {};

  safeUrl = 'http://track.ubitraq.com/map/map2d/svg/sim/?anony=super&map=chelianwang_1&isHideBtn=1';

  constructor(private sanitizer: DomSanitizer,
              private ingotAlarmService: IngotAlarmService) {
  }

  ngOnInit() {
    // @ts-ignore
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.safeUrl);

    this.initData();

  }

  public initData() {
    this.ingotAlarmService.wagonSummary(this.filters).subscribe(res => {
      res.value.forEach(item => {
        if (item.craftState === 0) {
          this.data.exit = item.total;
        }
        if (item.craftState === 1) {
          this.data.doff = item.total;
        }
        if (item.craftState === 2) {
          this.data.danni = item.total;
        }
        if (item.craftState === 3) {
          this.data.sock = item.total;
        }
        if (item.craftState === 0) {
          this.data.check = item.total;
        }
        if (item.craftState === 0) {
          this.data.pack = item.total;
        }

      });
    });
  }

  resetCond() {
    this.filters = {
      batchNum: '',
      craftState: '',
      code: ''
    };
    this.initData();
  }
}
