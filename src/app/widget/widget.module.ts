/**
 * 此模块内的组件仅供此模块内的服务调用，全局注册此模块的内的服务。
 * **/

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgZorroAntdModule, NZ_MESSAGE_CONFIG} from 'ng-zorro-antd';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';

import {LoginModalComponent, LoginModalService} from './login-modal/login-modal';
import { PositionPickerComponent } from './position-picker/position-picker.component';
import {ShowMessageService} from './show-message/show-message';
import {PositionPickerService} from './position-picker/position-picker.service';
import {ParamModalComponent, ParamModalService} from './param-modal/param-modal.component';
import { UploadImageComponent } from './upload-image/upload-image.component';
import { UploadImageService } from './upload-image/upload-image.service';
import {NoticeModelComponent} from './notice-model/notice-model.component';

@NgModule({
  imports: [
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  declarations: [
    LoginModalComponent,
    PositionPickerComponent,
    ParamModalComponent,
    UploadImageComponent,
    NoticeModelComponent
  ],
  providers: [
    LoginModalService,
    ShowMessageService,
    {provide: NZ_MESSAGE_CONFIG, useValue: {nzDuration: 2000}},
    PositionPickerService,
    ParamModalService,
    UploadImageService
  ],
  entryComponents: [
    LoginModalComponent,
    PositionPickerComponent,
    ParamModalComponent,
    UploadImageComponent
  ]
})
export class WidgetModule {
}
