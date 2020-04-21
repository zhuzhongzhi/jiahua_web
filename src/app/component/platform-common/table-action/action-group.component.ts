import {
  Component,
  OnInit,
  ViewChild,
  ContentChildren,
  Input,
  AfterContentInit,
  QueryList,
  TemplateRef
} from '@angular/core';
import { ActionComponent } from './action/action.component';
@Component({
  selector: 'app-action-group',
  templateUrl: './action-group.component.html',
  styleUrls: ['./action-group.component.scss']
})
export class ActionGroupComponent implements OnInit, AfterContentInit {
  /**
   * 显示按钮的个数，超过的部分会被隐藏到...
   * */
  @Input()
  set showActionNum(value: number) {
    this._showActionNum = value;
  }
  @ContentChildren(ActionComponent) actionList: QueryList<ActionComponent>;

  _showActionNum: number;
  showActionList: ActionComponent[];
  hideActionList: ActionComponent[];
  actionObservable: any;
  constructor() {
    this._showActionNum = 3;
    this.showActionList = [];
    this.hideActionList = [];
  }
  public trackById(index: number, item: any) {
    return item;
  }
  ngAfterContentInit() {
    if (this.actionObservable) {
      this.actionObservable.unsubscribe();
    }
    this.actionList.changes.subscribe((valueList: QueryList<ActionComponent>) => {
      this.showActionList = valueList.toArray().slice(0, this._showActionNum);
      this.hideActionList = valueList.toArray().slice(this._showActionNum);
    });
    this.showActionList = this.actionList.toArray().slice(0, this._showActionNum);
    this.hideActionList = this.actionList.toArray().slice(this._showActionNum);
  }
  ngOnInit() {
  }

}
