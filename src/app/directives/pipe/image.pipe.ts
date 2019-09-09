import { Pipe, PipeTransform } from '@angular/core';
import {environment} from '../../../environments/environment';


@Pipe({
  name: 'imageUrl'
})
export class ImagePipe implements PipeTransform {
  private fileServiceUrl = environment.baseUrl.bs + '/SysObjectStorage/read?fileId=';
  private defaultImg = './assets/image/img-default.png';
  transform(value: string | any, args?: any): any {
    if (!value) {
      return this.defaultImg;
    }
    if ((value.indexOf('http://') !== -1) || (value.indexOf('https://') !== -1)) {
      return value;
    }
    return this.fileServiceUrl + value;
  }

}
