import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {OrgManageComponent} from './org-manage/org-manage.component';
import {UserManageComponent} from './user-manage/user-manage.component';
import {RoleManageComponent} from './role-manage/role-manage.component';
import {SysLogComponent} from './sys-log/sys-log.component';
import {LineSpinComponent} from './line-spin/line-spin.component';
import {JiahuauserManageComponent} from './jiahuauser-manage/jiahuauser-manage/jiahuauser-manage.component';
import {JiahuaauthManageComponent} from './jiahuaauth-manage/jiahuaauth-manage/jiahuaauth-manage.component';

const routes: Routes = [
  {path: '', redirectTo: 'orgManage', pathMatch: 'full'},
  {path: 'orgManage', component: OrgManageComponent},
  {path: 'userManage', component: UserManageComponent},
  {path: 'roleManage', component: RoleManageComponent},
  {path: 'sysLog', component: SysLogComponent},
  {path: 'lineSpin', component: LineSpinComponent},
  {path: 'jiahuaUser', component: JiahuauserManageComponent},
  {path: 'jiahuaAuth', component: JiahuaauthManageComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SysManageRoutingModule { }
