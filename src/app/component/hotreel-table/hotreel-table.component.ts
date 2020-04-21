import { Component, OnInit,ChangeDetectorRef, Input } from '@angular/core';
import { NzDropdownService } from 'ng-zorro-antd';
import {NewTableComponent } from '../new-table/new-table.component';

@Component({
  selector: 'app-hotreel-table',
  templateUrl: './hotreel-table.component.html',
  styleUrls: ['../new-table/new-table.component.scss']
})

export class HotreelTableComponent extends NewTableComponent implements OnInit {

  @Input() dataList = [];
  constructor(public changeDetectorRef: ChangeDetectorRef, public dropdownService:NzDropdownService) {
    super(changeDetectorRef,dropdownService);
  }

  ngOnInit() {
  }

}
