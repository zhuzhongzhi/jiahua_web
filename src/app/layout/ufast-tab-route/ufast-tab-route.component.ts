
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ChangeDetectorRef,
  HostBinding,
} from '@angular/core';

import { Router} from '@angular/router';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { NzTabSetComponent} from 'ng-zorro-antd';
import { UfastTabsetRouteService } from '../../core/infra/ufast-tabset-route.service';

@Component({
  selector: 'app-tab-route',
  templateUrl: './ufast-tab-route.component.html',
  preserveWhitespaces: false,
  styles             : [],
})
export class  UfastTabRouteComponent implements OnDestroy, OnInit {

  private _disabled = false;
  position: number | null = null;
  origin: number | null = null;

  @HostBinding('class.ant-tabs-tabpane')hostClassBind: boolean;
  @Input()
  set nzDisabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
  }

  get nzDisabled(): boolean {
    return this._disabled;
  }

  @Output() nzClick = new EventEmitter<void>();
  @Output() nzSelect = new EventEmitter<void>();
  @Output() nzDeselect = new EventEmitter<void>();
  @ViewChild(TemplateRef) content: TemplateRef<void>;

  @Input()tabTitle: string;


  @ViewChild('titleTemplate')nzTitle: TemplateRef<any>;
  isTitleString = false;

  private _closed: boolean;

  @Input()closedHandle: () => boolean;
  @Input() showClosable: boolean;
  private destroyed: boolean;
  url: string;
  constructor(private nzTabSetComponent: NzTabSetComponent, private router: Router,
              public tabsetService: UfastTabsetRouteService,
              private cdRef: ChangeDetectorRef) {
    this.hostClassBind = true;
    this.showClosable = true;
    this.url = this.tabsetService.clearUrlParams(this.router.url);
    this._closed = false;
    this.destroyed = false;
    this.closedHandle = function() {
      return true;
    };
  }

  ngOnInit(): void {
    this.nzTabSetComponent.addTab(<any>this);
    this.tabsetService.selectNewTab(this.url);
    setTimeout(() => {
      this.cdRef.detectChanges();
    }, 0);
  }

  ngOnDestroy(): void {
    this.nzTabSetComponent.removeTab(<any>this);
    if (!this.destroyed) {
      this.destroyed = true;
      this.tabsetService.closeTab(this.url);
    }

  }


  public clickCloseTab(event: Event) {
    event.stopPropagation();
    if (this.closedHandle) {
      this.destroyed = true;
      this.tabsetService.closeTab(this.url);
    }

  }


}
