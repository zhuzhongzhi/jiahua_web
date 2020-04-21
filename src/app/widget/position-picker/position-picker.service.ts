import { Injectable, Injector, TemplateRef } from '@angular/core';
import {NzModalRef, NzModalService} from 'ng-zorro-antd';
import {PositionPickerComponent} from './position-picker.component';
import {BaseConfirmModal} from '../base-confirm-modal';
export { PositionLocation } from  './position-picker.component';

/*export interface PositionLocation extends Location { [x: string]: any; };*/

@Injectable()
export class PositionPickerService extends BaseConfirmModal.BaseConfirmModalService {

  constructor(private modalService: NzModalService, private injector: Injector) {
    super(injector);
  }


  protected getContentComponent(): any {
    return PositionPickerComponent;
  }

  public show(params: any = {}) {
    return super.show({nzTitle: '位置选择'}, params);
  }
}
