/**
 * 此模块内不包含服务，不需要注册到根模块。
 * **/
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {FormsModule} from '@angular/forms';
import {DirectivesModule} from '../directives/directives.module';

import {SideMenuComponent} from './side-menu/side-menu.component';
import {NavBreadcrumbComponent} from './nav-breadcrumb/nav-breadcrumb.component';
import {UfastTabRouteComponent} from './ufast-tab-route/ufast-tab-route.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgZorroAntdModule,
    DirectivesModule,
  ],
  declarations: [
    SideMenuComponent,
    NavBreadcrumbComponent,
    UfastTabRouteComponent
  ],
  exports: [
    SideMenuComponent,
    NavBreadcrumbComponent,
    UfastTabRouteComponent,
  ],
  entryComponents: [
  ]
})
export class LayoutModule {
}
export {UfastTableNs} from '../component/platform-common/ufast-table/ufast-table.component';
