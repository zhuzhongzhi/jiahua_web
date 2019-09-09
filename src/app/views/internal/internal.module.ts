import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ViewsCommonModules} from '../views-common-modules';
import {InternalRoutingModule} from './internal-routing.module';

import {DeptManageComponent} from './dept-manage/dept-manage.component';
import {RoleManageComponent} from './role-manage/role-manage.component';
import {UserManageComponent} from './user-manage/user-manage.component';



@NgModule({
  imports: [
    CommonModule,
    ...ViewsCommonModules,
    InternalRoutingModule,
  ],
  declarations: [
    DeptManageComponent,
    RoleManageComponent,
    UserManageComponent,
  ]
})
export class InternalModule {
}
