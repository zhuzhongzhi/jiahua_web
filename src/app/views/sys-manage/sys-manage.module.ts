import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SysManageRoutingModule } from './sys-manage-routing.module';
import { OrgManageComponent } from './org-manage/org-manage.component';
import { UserManageComponent } from './user-manage/user-manage.component';
import { RoleManageComponent } from './role-manage/role-manage.component';
import { SysLogComponent } from './sys-log/sys-log.component';
import { OperateStatisticsComponent } from './operate-statistics/operate-statistics.component';
import {ViewsCommonModules} from '../views-common-modules';
import {AddCompanyComponent} from './org-manage/add-company/add-company.component';

@NgModule({
  imports: [
    CommonModule,
    ...ViewsCommonModules,
    SysManageRoutingModule
  ],
  declarations: [
    OrgManageComponent,
    UserManageComponent,
    RoleManageComponent,
    SysLogComponent,
    OperateStatisticsComponent,
    AddCompanyComponent
  ]
})
export class SysManageModule { }
