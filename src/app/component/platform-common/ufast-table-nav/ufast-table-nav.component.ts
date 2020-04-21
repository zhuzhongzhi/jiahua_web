import { Component, OnInit, Input, Output, TemplateRef, EventEmitter } from '@angular/core';
import {UfastTableNs} from '../ufast-table/ufast-table.component';
@Component({
  selector: 'app-ufast-table-nav',
  templateUrl: './ufast-table-nav.component.html',
  styleUrls: ['./ufast-table-nav.component.scss']
})
export class UfastTableNavComponent implements OnInit {
  /**
   * 搜索输入框提示文字
   * */
  @Input() searchPlaceholder: string;
  /**
   * 左侧模板
   * */
  @Input() leftTemplate: TemplateRef<any>;
  /**
   * 右侧模板
   * */
  @Input() rightTemplate: TemplateRef<any>;
  /**
   * 搜索按钮点击事件
   * */
  @Output() search: EventEmitter<any>;
  /**
   * 高级搜索按钮点击事件
   * */
  @Output() advancedSearch: EventEmitter<any>;
  /**
   * 刷新按钮点击事件
   * */
  @Output() refresh: EventEmitter<any>;
  /**
   * 是否显示高级搜索按钮
   * 默认: true
   * */
  @Input() showAdvancedSearch: boolean;
  /**
   * 是否显示普通搜索
   * 默认：true
   */
  @Input() showSearch: boolean;
  /**
  * 是否显示刷新按钮
   * 默认：true
   * */
  @Input() showRefresh: boolean;
  /**
   * 表格配置参数
   * */
  @Input()
  set tableConfig(value: UfastTableNs.TableConfig) {
    if (!value) {
      this._tableHeader = null;
      return;
    }
    if (!value.auxDataEmitter) {
      value.auxDataEmitter = new EventEmitter<any>();
    }
    this.tableEmitter = value.auxDataEmitter;
    this._tableHeader = value.headers;
    if (this._tableHeader) {
      this._tableHeader.forEach((item: UfastTableNs.TableHeader) => {
        item.show = item.show !== false ? true : false;
      });
    }
  }
  /**
   * 搜索框值双向绑定
   * */
  @Input()
  set searchText(value: string) {
    this._searchText = value;
  }
  get searchText(): string {
    return this._searchText;
  }
  @Output() searchTextChange: EventEmitter<string>;

  _searchText: string;
  _tableHeader: UfastTableNs.TableHeader[];
  showTableConfig: boolean;
  private tableEmitter: EventEmitter<any>;
  constructor() {
    this.showTableConfig = false;
    this._tableHeader = null;
    this.searchPlaceholder = '';
    this._searchText = '';
    this.leftTemplate = null;
    this.rightTemplate = null;
    this.advancedSearch = new EventEmitter<any>();
    this.search = new EventEmitter<any>();
    this.refresh = new EventEmitter<any>();
    this.searchTextChange = new EventEmitter<string>();
    this.showAdvancedSearch = true;
    this.showRefresh = true;
    this.showSearch = true;
  }
  public trackByItem(index: number, item: any) {
    return item;
  }
  public onFullSearch() {
    this.advancedSearch.emit();
  }
  public searchChange(value: string) {
    this.searchTextChange.emit(value);
  }
  public onSearch() {
    this.search.emit();
  }
  public onRefresh() {
    this.refresh.emit();
  }
  public onTableConfig(event: Event) {
    event.stopPropagation();
    this.showTableConfig = !this.showTableConfig;
  }
  public moveUp(index: number) {
    if (index <= 0) {
      return;
    }
    this._tableHeader.splice(index - 1, 0, this._tableHeader.splice(index, 1)[0]);
  }
  public moveDown(index: number) {
    if (index >= this._tableHeader.length - 1) {
      return;
    }
    this._tableHeader.splice(index + 1 , 0, this._tableHeader.splice(index, 1)[0]);
  }
  public onFixedChange(value: boolean, index: number) {
    let fixedI = 0;
    for (const len = this._tableHeader.length; fixedI < len; fixedI++) {
      if (! this._tableHeader[fixedI].fixed) {
        break;
      }
    }
    this._tableHeader[index].fixed = value;
    if (index !== fixedI) {
      if (value) {
        this._tableHeader.splice(fixedI, 0, this._tableHeader.splice(index, 1)[0]);
      } else {
        this._tableHeader.splice(fixedI - 1, 0, this._tableHeader.splice(index, 1)[0]);
      }
    }
    this.tableEmitter.emit();
  }
  ngOnInit() {
  }

}
