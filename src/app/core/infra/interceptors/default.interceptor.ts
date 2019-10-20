
import {throwError as observableThrowError, Observable, of} from 'rxjs';
import {Injectable, Injector} from '@angular/core';
import {Router} from '@angular/router';
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';


import {catchError, switchMap} from 'rxjs/operators';
import {LoginModalService} from '../../../widget/login-modal/login-modal';
import {NzModalRef} from 'ng-zorro-antd';
import {environment} from '../../../../environments/environment';

@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
  constructor() {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    const status = error.status;
    let errMsg = '';

    if (status === 0) {
      errMsg = '网络出现未知的错误，请检查您的网络。';
    }
    if (status >= 300 && status < 400) {
      errMsg = '请求被服务器重定向，状态码为' + status;
    }
    if (status === 400) {
      errMsg = '客户端出错，可能是发送的数据有误，状态码为' + status;
    }
    // if (status >= 400 && status < 500) {
    //   errMsg = '客户端出错，可能是发送的数据有误，状态码为' + status;
    // }
    if(status > 400 && status < 500) {
      errMsg = error.error.message;
    }
    if (status >= 500) {
      errMsg = '服务器发生错误，状态码为' + status;
    }
    return observableThrowError({
      code: status,
      message: errMsg
    });

  }
}

@Injectable()
export class UfastCodeInterceptor implements HttpInterceptor {

  loginModalCtrl: NzModalRef;
  loginModalService: LoginModalService;

  constructor(private injector: Injector, private http: HttpClient, private router: Router) {
    this.loginModalCtrl = null;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 添加site头 禁用缓存
    const newReq = req.clone({
      headers: req.headers.append('x-from-site', environment.otherData.sysSite)
        .append('Cache-Control', 'no-cache,no-store')
        .append('Pragma', 'no-cache')
        // .append('Authorization', sessionStorage.getItem('x-user-id'))
    });
    return next.handle(newReq)
      .pipe(this.ufastCode2(req));
  }

  /** code：2 拦截器  **/
  private ufastCode2(req: HttpRequest<any>): any {
    return switchMap((event: HttpResponse<any>) => {

      const onCancel = (observer: any) => {
      };

      if (event.type !== HttpEventType.Response || (event.body.code + '') !== '2') {
        return of(event);
      }
      // 重定义observable
      const observable = Observable.create((observer) => {
        observer.next(event);
      });
      window.location.href = '/login'; // 超时跳到登录页
      return observable;
    });

  }
}
