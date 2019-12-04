import { Component, OnInit,ChangeDetectorRef, Input } from '@angular/core';
import {NewTableComponent } from '../new-table/new-table.component';

@Component({
  selector: 'app-socks-table',
  templateUrl: './socks-table.component.html',
  styleUrls: ['../new-table/new-table.component.scss']
})

export class SocksTableComponent extends NewTableComponent implements OnInit {

  @Input() dataList = [];
  constructor(public changeDetectorRef: ChangeDetectorRef) {
    super(changeDetectorRef);
  }

  ngOnInit() {
  }

}

