import {Component, Input, OnInit, ChangeDetectorRef} from '@angular/core';
import { NzDropdownService } from 'ng-zorro-antd';
import {NewTableComponent } from '../new-table/new-table.component';

@Component({
  selector: 'app-socks-table',
  templateUrl: './socks-table.component.html',
  styleUrls: ['../new-table/new-table.component.scss']
})

export class SocksTableComponent extends NewTableComponent implements OnInit {

  @Input() dataList = [];
  constructor(public changeDetectorRef: ChangeDetectorRef, public dropdownService:NzDropdownService) {
    super(changeDetectorRef,dropdownService);
  }

  ngOnInit() {
  }

}

