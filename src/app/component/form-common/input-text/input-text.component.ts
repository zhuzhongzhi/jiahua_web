import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-input-text',
  template: `
    <nz-form-item>
      <nz-form-label>{{label}}</nz-form-label>
      <nz-form-control>
        <input nz-input
               [(ngModel)]="model"
               [placeholder]="placeholder"
               [type]="type"
               [disabled]="disabled">
      </nz-form-control>
    </nz-form-item>
  `
})

export class InputTextComponent implements OnInit {
  @Input('label') label: string = '';
  @Input('type') type: string = 'text';
  @Input('classNames') classNames: string = '';
  @Input('disabled') disabled: boolean = false;
  @Input('placeholder') placeholder: string = '';
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
