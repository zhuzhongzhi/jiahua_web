import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {ViewsRoutingModule} from './views-routing.module';
import {CoreModule} from '../core/core.module';
import {LayoutModule} from '../layout/layout.module';
import {CommonComponentModule} from '../component/common-component.module';

import {MainLayoutComponent} from './main-layout/main-layout.component';
import {LoginComponent} from './entrance/login-page/login.component';
import {DefaultComponent} from './default/default.component';
import {RegisterComponent} from './entrance/register/register.component';
import {NgxEchartsModule} from 'ngx-echarts';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ViewsRoutingModule,
    NgZorroAntdModule,
    CoreModule,
    LayoutModule,
    FormsModule,
    CommonComponentModule,
    NgxEchartsModule
  ],
  declarations: [
    MainLayoutComponent,
    LoginComponent,
    DefaultComponent,
    RegisterComponent,
  ],

  exports: [ViewsRoutingModule]
})
export class ViewsModule {
}
