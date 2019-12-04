import { Component, OnInit,ChangeDetectorRef, Input } from '@angular/core';
import {NewTableComponent } from '../new-table/new-table.component';

@Component({
  selector: 'app-adjust-table',
  templateUrl: './adjust-table.component.html',
  styleUrls: ['../new-table/new-table.component.scss']
})

export class AdjustTableComponent extends NewTableComponent implements OnInit {

  @Input() dataList = [];
  constructor(public changeDetectorRef: ChangeDetectorRef) {
    super(changeDetectorRef);
  }

  ngOnInit() {
  }

}
