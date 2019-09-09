import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpParams } from '@angular/common/http';
import { gatewayKey, environment } from '../../environments/environment';
import { Subject, Observable } from 'rxjs';

export const GatewayKey = gatewayKey;
@Directive({
  selector: '[appDownload]'
})
export class DownloadDirective {
  @Input() downloadUrl: string;
  @Input() reqParam: any;
  @Input() fileName: string;
  @Input() reqMethod: string;
  @Input() updateParmaFn: any; //  更新参数回调函数
  @Input() updateData: any; // 回调函数参数
  constructor(private http: HttpClient) {
    this.reqParam = {};
  }

  @HostListener('click')
  onClick() {
    const _this = this;
    const updateParmaFn: any = new Observable((observer) => {
      if (!this.updateParmaFn) {
        observer.next(true);
      }
      const res = this.updateParmaFn(this.updateData);
      observer.next(res !== false);
      return {
        unsubscribe() { }
      };
    });
    updateParmaFn.subscribe({
      next(downflag) {
        if (downflag) {
          _this.downLoadFile(_this);
        }
      }
    });
  }

  private downLoadFile(_this) {
    const path = environment.baseUrl[GatewayKey.Bs] + _this.downloadUrl;
    this.fileName = _this.fileName || '下载文件';
    let observer: any = null;
    if (_this.reqMethod && _this.reqMethod === 'post') {
      observer = _this.http.post(path, _this.reqParam, { responseType: 'arraybuffer' });
    } else {
      const params = new HttpParams({ fromObject: _this.reqParam || {} });
      observer = _this.http.get(path, { responseType: 'arraybuffer', params: params });
    }
    observer.subscribe((resData) => {
      const blob = new Blob([resData], { type: 'application/ms-excel' });
      const url = window.URL.createObjectURL(blob);
      const fileLink = document.createElement('a');
      fileLink.download = `${_this.fileName}.xls`;
      fileLink.href = url;
      document.body.appendChild(fileLink);
      fileLink.click();
      document.body.removeChild(fileLink);
    }, (error) => {

    });
  }
}
