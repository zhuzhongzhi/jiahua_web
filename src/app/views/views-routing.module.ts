import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainLayoutComponent} from './main-layout/main-layout.component';
import {LoginComponent} from './entrance/login-page/login.component';
import {DefaultComponent} from './default/default.component';


const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent, data: {cache: false}},
  {
    path: 'main', component: MainLayoutComponent, children: [
      {path: '', redirectTo: 'latheManage', pathMatch: 'full'},
      {path: 'sysManage', loadChildren: './sys-manage/sys-manage.module#SysManageModule'},
      {path: 'latheManage', loadChildren: './lathe-manage/lathe-manage.module#LatheManageModule'},
      {path: 'produceManage', loadChildren: './produce-manage/produce-manage.module#ProduceManageModule'},
    ]
  },
  {path: '**', component: DefaultComponent},
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],

  exports: [RouterModule]
})
export class ViewsRoutingModule {
}
