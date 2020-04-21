import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-action-button',
  template: `
    <button type="button" class="ant-btn ant-btn-primary" *ngIf="showSearchButton">搜索</button>
    <button type="button" class="ant-btn ant-btn-danger" *ngIf="showResetButton">重置</button>
    <button type="button" class="ant-btn" *ngIf="showRefreshButton"><i class="iconfont icon-kanban"></i></button>
    <button type="button" class="ant-btn ant-btn-primary" *ngIf="showPlusButton">新增</button>
  `
})

export class ActionButtonComponent implements OnInit {
  @Input('showSearchButton') showSearchButton: boolean = false;
  @Input('showResetButton') showResetButton: boolean = false;
  @Input('showRefreshButton') showRefreshButton: boolean = false;
  @Input('showPlusButton') showPlusButton: boolean = false;
  @Output() blur = new EventEmitter();

  constructor() {
  }

  modelValue: string;
  @Output() modelChange = new EventEmitter();

  @Input()
  get model() {
    return this.modelValue;
  }

  set model(val) {
    this.modelValue = val;
    this.modelChange.emit(this.modelValue);
  }

  ngOnInit() {
  }

  blurEvent(): void {
    this.blur.emit();
  }

}
