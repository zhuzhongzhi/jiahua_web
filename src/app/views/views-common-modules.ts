import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {CommonComponentModule} from '../component/common-component.module';
import {DirectivesModule} from '../directives/directives.module';
import {LayoutModule} from '../layout/layout.module';
import {NgxEchartsModule} from 'ngx-echarts';
import { CKEditorModule } from 'ng2-ckeditor';
export const ViewsCommonModules = [
  FormsModule,
  ReactiveFormsModule,
  NgZorroAntdModule,
  CommonComponentModule,
  DirectivesModule,
  LayoutModule,
  NgxEchartsModule,
  CKEditorModule
];
