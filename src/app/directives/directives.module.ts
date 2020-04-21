
import {NgModule} from '@angular/core';
import { MapPipe } from './pipe/map.pipe';
import { HtmlPipe } from './pipe/html.pipe';
import { AuthBtuDirective } from './auth-btu.directive';
import { DisabledDirective } from './disabled.directive';
import { DownloadDirective } from './download.directive';
import { ImagePipe } from './pipe/image.pipe';

@NgModule({
  exports: [
    MapPipe,
    HtmlPipe,
    AuthBtuDirective,
    DisabledDirective,
    DownloadDirective,
    ImagePipe
  ],
  declarations: [
    MapPipe,
    HtmlPipe,
    AuthBtuDirective,
    DisabledDirective,
    DownloadDirective,
    ImagePipe
  ]
})
export class DirectivesModule {
}
