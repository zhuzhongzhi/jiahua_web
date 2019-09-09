import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LatheDistributedComponent} from './lathe-distributed/lathe-distributed.component';
import {LatheListComponent} from './lathe-list/lathe-list.component';

const routes: Routes = [
  {path: '', redirectTo: 'latheDistributed', pathMatch: 'full'},
  {path: 'latheDistributed', component: LatheDistributedComponent},
  {path: 'latheList', component: LatheListComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LatheManageRoutingModule {
}
