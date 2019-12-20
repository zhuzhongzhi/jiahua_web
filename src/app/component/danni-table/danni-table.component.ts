
import { Component, OnInit,ChangeDetectorRef, Input } from '@angular/core';
import { NzDropdownService } from 'ng-zorro-antd';
import {NewTableComponent } from '../new-table/new-table.component';

@Component({
  selector: 'app-danni-table',
  templateUrl: './danni-table.component.html',
  styleUrls: ['../new-table/new-table.component.scss']
})

export class DanniTableComponent extends NewTableComponent implements OnInit {

  @Input() dataList = [];
  constructor(public changeDetectorRef: ChangeDetectorRef, public dropdownService:NzDropdownService) {
    super(changeDetectorRef,dropdownService);
  }

  ngOnInit() {
  }

}
