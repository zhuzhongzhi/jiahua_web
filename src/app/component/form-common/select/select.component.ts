import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-select',
  template: `
    <nz-form-item>
      <nz-form-label>{{label}}</nz-form-label>
      <nz-select [(ngModel)]="model" (change)="changeEvent">
        <nz-option *ngFor="let opt of options" [nzLabel]="opt.key" [nzValue]="opt.value"></nz-option>
      </nz-select>
    </nz-form-item>
  `
})
export class SelectComponent implements OnInit {
  @Input() classNames: string = 'col-sm-3';
  @Input() options: Array<any> = [];
  @Input() disabled: boolean = false;
  @Input() label: string = '选择';
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() modelChange = new EventEmitter();
  private modelValue: string;

  @Input()
  set model(val) {
    this.modelValue = val;
    this.modelChange.emit(this.modelValue);
  }

  get model() {
    return this.modelValue;
  }

  public changeEvent() {
    this.change.emit();
  }

  ngOnInit(): void {
  }
}
