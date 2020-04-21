import { Injector, TemplateRef, Type} from '@angular/core';
import {NzModalRef, NzModalService} from 'ng-zorro-antd';


export namespace BaseConfirmModal {

  export enum ModalBtnStatus {
    Cancel,
    Ok
  }
  export interface ModalData<T> {
    status: number | string;
    value: T;
  }

  export interface ModalOptions {
    nzVisible?: boolean;
    nzWidth?: number | string;
    nzClassName?: string;
    nzStyle?: object;
    nzTitle?: string | TemplateRef<{}>;
    nzClosable?: boolean;
    nzMask?: boolean;
    nzMaskClosable?: boolean;
    nzMaskStyle?: object;
    nzBodyStyle?: object;
    nzOkText?: string;
    nzCancelText?: string;
  }

  export abstract class BasicConfirmModalComponent<T> {
    protected params: any; // service传给component instance的参数
    constructor() {}
    protected abstract getCurrentValue(): any;
  }

  export abstract class BaseConfirmModalService {
    protected modalRef: NzModalRef = null;

    protected bsModalService: NzModalService;

    constructor(private baseInjector: Injector) {
      this.bsModalService = this.baseInjector.get(NzModalService);
    }

    public show<T = any>(modalOptions: ModalOptions = {}, params: object = {}): Promise<any> {
      this.modalRef = this.bsModalService.create(Object.assign({
        nzTitle: '',
        nzContent: this.getContentComponent(),
        nzMaskClosable: false,
        nzFooter: [{
          label: '确认',
          type: 'primary',
          show: true,
          onClick: (this.confirmCallback).bind(this)
        }, {
          label: '取消',
          type: 'default',
          show: true,
          onClick: (this.cancelCallback).bind(this)
        }],
        nzClosable: true,
        nzWidth: 720,
        nzComponentParams: {
          params: params
        }, // 参数中的属性将传入nzContent实例中
      }, modalOptions));
      return new Promise<any>((resolve, reject) => {
        this.modalRef.afterClose.subscribe((result: any) => {
          console.log(result);
          if (!result) {
            reject();
          } else {
            resolve(result.value);
          }
        });
      });
    }

    protected abstract getContentComponent(): any;

    private cancelCallback(contentComponentInstance?: object) {
      return this.modalRef.destroy(null);
    }

    private confirmCallback(contentComponentInstance?: object) {
      console.log(contentComponentInstance);
      return this.modalRef.destroy({status: ModalBtnStatus.Ok, value: (<any>contentComponentInstance).getCurrentValue()});
    }

  }
}
