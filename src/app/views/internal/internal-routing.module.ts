import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {RoleManageComponent} from './role-manage/role-manage.component';
import {UserManageComponent} from './user-manage/user-manage.component';
import {DeptManageComponent} from './dept-manage/dept-manage.component';

const routes: Routes = [
  {path: '', redirectTo: 'role', pathMatch: 'full'},
  {path: 'role', component: RoleManageComponent},
  {path: 'user', component: UserManageComponent},
  {path: 'dept', component: DeptManageComponent},
];


@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class InternalRoutingModule {
}
