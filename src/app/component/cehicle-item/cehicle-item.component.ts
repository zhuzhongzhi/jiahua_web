import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-cehicle-item',
  templateUrl: './cehicle-item.component.html',
  styleUrls: ['./cehicle-item.component.scss']
})
export class CehicleItemComponent implements OnInit {

  @Input() info;
  constructor() { }

  ngOnInit() {
  }

}
