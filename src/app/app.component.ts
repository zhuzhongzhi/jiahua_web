import {Component, NgZone, OnInit} from '@angular/core';
import {ShowMessageService} from './widget/show-message/show-message';
import {UploadImageService} from './widget/upload-image/upload-image.service';
import {UserService} from './core/common-services/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>' +
    '<div *ngIf="loading" style="position:fixed;top:0px;left:0px;width:100%;height:100%;z-index:1001;background:rgba(24,144,255,0.1);">' +
    '<div style="position:absolute;top: 50%;left:50%;margin:-16px 0 0 -16px;">' +
    '<nz-spin nzSize="large" [nzTip]="loadingMsg"></nz-spin></div></div>'
})
export class AppComponent implements OnInit {
  loading: boolean;
  loadingMsg: string;

  constructor(private messageService: ShowMessageService,
              private router: Router, private userService: UserService,
              private uploadImageService: UploadImageService, private zone: NgZone) {
    this.loading = true;
    this.loadingMsg = '系统加载中';
    window['showUploadImageModal'] = this.showUploadImageModal.bind(this);
  }

  ngOnInit() {
    this.messageService.loadEvent.subscribe((event) => {
      this.loading = event.loading;
      this.loadingMsg = event.message;
    });
    this.userService.getLogin(
      {userName: sessionStorage.getItem('userName'), password: sessionStorage.getItem('saved')}).subscribe((res) => {
      localStorage.setItem('rights', JSON.stringify(res.value.jiahuaUserAuthList));
    });
  }

  showUploadImageModal(successCB?: any) {
    this.zone.run(() => {
      this.uploadImageService.show().then(res => {
        console.log(res);
        if (successCB) {
          successCB(res);
        }
      });
    });
  }
}
