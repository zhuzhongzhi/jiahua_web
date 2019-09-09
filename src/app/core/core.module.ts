import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {NgZorroAntdModule} from 'ng-zorro-antd';

import {HttpUtilService} from './infra/http/http-util.service';

import {DefaultInterceptor, UfastCodeInterceptor} from './infra/interceptors/default.interceptor';
import {UfastValidatorsService} from './infra/validators/validators.service';
import {UfastValidatorsRuleService} from './infra/validators/validatorsRule.service';

import {UserService} from './common-services/user.service';
import {MenuService} from './common-services/menu.service';
import {ScepterService} from './common-services/scepter.service';
import {DeptService} from './common-services/dept.service';
import {DictionaryService} from '../core/common-services/dictionary.service';
import {EventbusService} from './common-services/eventbus.service';
import {SocketService} from './common-services/socket.service';

import {RouteReuseStrategy} from '@angular/router';
import {UfastReuseStrategy, UfastTabsetRouteService} from './infra/ufast-tabset-route.service';

import { UfastUtilService } from './infra/ufast-util.service';

import {BizServiceProvideres} from './biz-services/biz.service.module';
import { from } from 'rxjs';
import {StorageProvider} from './common-services/storage';
import {SearchInfoService} from './common-services/searchInfo.service';
import {NoticeChange} from './common-services/notice.service';

/**
 * 定义拦截器顺序，
 * 参考：https://angular.cn/guide/http#interceptor-order
 **/
const httpInterceptorProvider = [
  {provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true},
  {provide: HTTP_INTERCEPTORS, useClass: UfastCodeInterceptor, multi: true}
];


@NgModule({
  imports: [
    HttpClientModule,
    NgZorroAntdModule
  ],
  providers: [
    // {provide: RouteReuseStrategy, useClass: UfastReuseStrategy},
    ...BizServiceProvideres,
    HttpUtilService,
    httpInterceptorProvider,
    UserService,
    MenuService,
    ScepterService,
    DeptService,
    UfastValidatorsService,
    UfastValidatorsRuleService,
    // UfastTabsetRouteService,
    UfastUtilService,
    DictionaryService,
    EventbusService,
    SocketService,
    StorageProvider,
    SearchInfoService,
    NoticeChange
  ]
})
export class CoreModule {
}
