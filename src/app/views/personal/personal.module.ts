import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ViewsCommonModules} from '../views-common-modules';

import {PersonalRoutingModule} from './personal-routing.module';
import {PersonalInfoComponent} from './personal-info/personal-info.component';
import {PasswordComponent} from './password/password.component';
import { NoticeComponent } from './notice/notice.component';



@NgModule({
  imports: [
    CommonModule,
    ...ViewsCommonModules,
    PersonalRoutingModule,
  ],
  declarations: [
    PersonalInfoComponent,
    PasswordComponent,
    NoticeComponent,
  ]
})
export class PersonalModule {
}
