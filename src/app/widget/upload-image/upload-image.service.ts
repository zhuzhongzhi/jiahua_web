import { Injectable,  Injector } from '@angular/core';
import {NzModalRef, NzModalService} from 'ng-zorro-antd';
import {BaseConfirmModal} from '../base-confirm-modal';
import {UploadImageComponent} from './upload-image.component';

@Injectable({
  providedIn: 'root'
})
export class UploadImageService extends BaseConfirmModal.BaseConfirmModalService {

  constructor(private modalService: NzModalService, private injector: Injector) {
    super(injector);
   }

   protected getContentComponent(): any {
    return UploadImageComponent;
  }

  public show(params: any = {}) {
    return super.show({nzTitle: '上传图片选择'}, params);
  }
}
