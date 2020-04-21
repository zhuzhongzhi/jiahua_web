import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MenuServiceNs} from '../../core/common-services/menu.service';
import {NavigationEnd, Router} from '@angular/router';
import {UfastTabsetRouteService} from '../../core/infra/ufast-tabset-route.service';

@Component({
  selector: 'app-side-menu',
  styleUrls: ['./side-menu.component.scss'],
  templateUrl: './side-menu.component.html'
})
export class SideMenuComponent {
  @Input() sideMenu: MenuServiceNs.MenuAuthorizedItemModel;
  @Input() width: string;
  @Input() isCollapsed: boolean;
  @Input() isNeedSideNavShow: boolean;
  @Output() isCollapsedChange: EventEmitter<boolean>;
  @Input() loading: boolean;
  @Output() loadingChange: EventEmitter<boolean>;
  selectedItem: string;
  selectedMenu: MenuServiceNs.MenuAuthorizedItemModel;
  isCollapsedList: boolean;
  prevFinished: boolean;
  constructor(public router: Router, public tabsetService: UfastTabsetRouteService) {
    this.loading = false;
    this.loadingChange = new EventEmitter();
    this.prevFinished = true;
    this.isCollapsedChange = new EventEmitter();
    this.isCollapsed = false;
    this.isNeedSideNavShow = false;
    this.isCollapsedList = false;
    this.selectedMenu = {
      auths: <any> [],
      children: <any>[],
      name: '',
      url: ''
    };
    this.sideMenu = {url: '', name: '', children: [], auths: []};
    this.selectedItem = this.router.url;
    this.router.events
      .subscribe((event: NavigationEnd) => {
        if (event instanceof  NavigationEnd) {
          this.selectedItem = event.urlAfterRedirects;
          this.loading = false;
          this.loadingChange.emit(false);
        }
      });
  }
  public toggleCollapsed () {
    this.isCollapsed = !this.isCollapsed;
    this.isCollapsedChange.emit(this.isCollapsed);
  }
  public navigate (menu: MenuServiceNs.MenuAuthorizedItemModel, checked: boolean) {
    if (!menu) {
      return;
    }
    this.selectedMenu = menu;
    if (menu.children && menu.children.length > 0) {
      this.isNeedSideNavShow = true;
      this.selectedMenu = menu;
      return;
    }
    this.isNeedSideNavShow = false;
    const target = menu.url;
    if (target !== this.router.url) {
      this.loading = true;
      this.loadingChange.emit(true);
    }
    if (checked) {
      return;
    }
    this.tabsetService.navigateByUrl(target).then(() => {
      this.selectedItem = menu.url;
    }, () => {});
  }
  // public hideSideNav() {
  //   this.isNeedSideNavShow = false;
  // }
}
