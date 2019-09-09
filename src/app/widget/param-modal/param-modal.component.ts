import { Component, Injectable, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
export namespace ParamModalNs {
  export interface ParamModal {
    title: string;        // 模态框标题
    okText?: string;      // 确认按钮文本
    cancelText?: string;  // 取消按钮文本
    onCancel?: () => void;         // 点击取消回调
    paramInfo?: ParamInfoModel; // 参数
  }
  export interface ParamInfoModel {
    sort?: number; // 序号
    param?: string; // 参数
    value?: string; // 值
    unit?: string; // 单位
  }
}
@Injectable()
export class ParamModalService {
  private paramData: ParamModalNs.ParamModal;
  private modalSubject: NzModalRef;
  private modalObservable: Observable<ParamModalNs.ParamInfoModel>;
  private modalObserve: Observer<ParamModalNs.ParamInfoModel>;
  constructor(private modalService: NzModalService) {
  }
  public showParamModal(data: ParamModalNs.ParamModal) {
    this.paramData = Object.assign({
      okText: '确定',
      cancelText: '取消',
    }, data);
    this.modalSubject = this.modalService.create({
      nzTitle: data.title,
      nzContent: ParamModalComponent,
      nzFooter: null
    });
    this.modalObservable = Observable.create((observer) => {
      this.modalObserve = observer;
    });

    return this.modalObservable;
  }
  public closeParamModal() {
    if (!this.modalSubject) {
      return;
    }
    this.modalSubject.destroy('onCancel');
    this.modalSubject = null;
  }
  public getParamData(): ParamModalNs.ParamModal {
    return this.paramData;
  }
  public _onOk(resData: ParamModalNs.ParamInfoModel) {
    this.modalSubject.destroy('onOk');
    this.modalObserve.next(resData);
    this.modalObserve.complete();
  }
}
@Component({
  templateUrl: './param-modal.component.html',
  styleUrls: ['./param-modal.component.scss']
})
export class ParamModalComponent implements OnInit {
  public paramData: ParamModalNs.ParamModal;
  public paramForm: FormGroup;

  constructor(private paramService: ParamModalService, private formBuilder: FormBuilder) {
    this.paramData = this.paramService.getParamData();
  }
  // 取消
  public onModalCancel() {
    this.paramService.closeParamModal();
    if (this.paramData.onCancel) {
      this.paramData.onCancel();
    }
  }
  // 确认
  public onModalOk() {
    Object.keys(this.paramForm.controls).forEach((key: string) => {
      this.paramForm.controls[key].markAsDirty();
      this.paramForm.controls[key].updateValueAndValidity();
    });
    if (this.paramForm.invalid) {
      return;
    }
    const param = <ParamModalNs.ParamInfoModel>{};
    param.param = this.paramForm.value.param;
    param.value = this.paramForm.value.value;
    param.unit = this.paramForm.value.unit;
    param.sort = this.paramForm.value.sort;
    this.paramService._onOk(param);
  }

  ngOnInit() {
    this.paramForm = this.formBuilder.group({
      param: [null, [Validators.required]], // 参数
      value: [null, [Validators.required]], // 值
      unit: [null], // 单位
      sort: [null] // 序号
    });
    if (this.paramData.paramInfo) {
      this.paramForm.patchValue({
        param: this.paramData.paramInfo.param,
        value: this.paramData.paramInfo.value,
        unit: this.paramData.paramInfo.unit,
        sort: this.paramData.paramInfo.sort,
      });
      return;
    }
    this.paramForm.reset();
  }

}
