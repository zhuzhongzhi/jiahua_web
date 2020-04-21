import {Component, Injectable, Input, OnInit} from '@angular/core';
import {NzModalRef, NzModalService} from 'ng-zorro-antd';
import {ShowMessageService} from '../show-message/show-message';

@Injectable()
export class NoticeModalService {


  public modalSubject: NzModalRef;

  constructor(private modalService: NzModalService, private msgService: ShowMessageService) {

  }

  public showNoticeModal(content: string = '') {
    // this.modalSubject = this.modalService.create({
    //   nzTitle: '用户登录',
    //   nzContent: LoginModalComponent,
    //   nzMaskClosable: maskCloseable,
    //   nzOkLoading: true,
    //   nzFooter: null,
    //   nzClosable: false
    // });
    // let loading: boolean;
    // this.modalSubject.afterOpen.subscribe(() => {
    //   loading = this.msgService.loadingIsShow();
    //   if (loading) {
    //     this.msgService.closeLoading();
    //   }
    // });
    // this.modalSubject.afterClose.subscribe(() => {
    //   if (loading) {
    //     this.msgService.showLoading();
    //   }
    // });
    // return this.modalSubject;
  }
}

@Component({
  selector: 'app-notice-model',
  templateUrl: './notice-model.component.html',
  styleUrls: ['./notice-model.component.scss']
})
export class NoticeModelComponent implements OnInit {

  @Input() content;
  @Input() type: number | string;
  constructor() { }

  ngOnInit() {
  }

}
