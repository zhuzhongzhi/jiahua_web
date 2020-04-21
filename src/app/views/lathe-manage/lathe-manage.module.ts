import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ViewsCommonModules} from '../views-common-modules';
import {LatheManageRoutingModule} from './lathe-manage-routing.module';
import {LatheDistributedComponent} from './lathe-distributed/lathe-distributed.component';
import { LatheListComponent } from './lathe-list/lathe-list.component';


@NgModule({
  imports: [
    CommonModule,
    ...ViewsCommonModules,
    LatheManageRoutingModule
  ],
  declarations: [
    LatheDistributedComponent,
    LatheListComponent]
})
export class LatheManageModule {
}
