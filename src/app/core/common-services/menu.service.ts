import {Injectable, Injector} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {HttpUtilNs, HttpUtilService} from '../infra/http/http-util.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {map, filter as filter} from 'rxjs/operators';

export namespace MenuServiceNs {
  export interface UfastHttpAnyResModel extends HttpUtilNs.UfastHttpResT<any> {
  }

  export interface MenuAuthorizedItemModel {
    auths: { authDesc: string; authId: number; authName: string; parentId: number; }[];
    channel?: number;
    children: MenuAuthorizedItemModel[];
    code?: string;
    icon?: string;
    id?: number;
    leaf?: number;
    name: string;
    parentId?: number;
    seq?: number;
    showFlag?: number;
    state?: string;
    url: string;
    sourceUrl?: string;
  }
  export class MenuServiceClass {

    menuList: MenuAuthorizedItemModel[];
    menuNavChange: BehaviorSubject<MenuAuthorizedItemModel[]>;
    presentMenu: MenuAuthorizedItemModel[];
    private routerEvent: BehaviorSubject<any>;
    private http: HttpUtilService;
    private router: Router;
    private routerEventSub: any;
    constructor(injector: Injector) {
      this.http = injector.get(HttpUtilService);
      this.router = injector.get(Router);
      this.menuList = [];
      this.menuNavChange = new BehaviorSubject(this.menuList);
      this.routerEvent = new BehaviorSubject<any>(null);
      this.routerEventSub = null;
      this.router.events.pipe(filter(event => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          this.routerEvent.next(event);     // 存储事件，防止菜单未获取无法匹配路由的情况
        });
    }
    public menuNavObservabel(): BehaviorSubject<MenuAuthorizedItemModel[]> {
      return this.menuNavChange;
    }
    private checkMenu(url: string, menu: MenuAuthorizedItemModel[]) {

      for (let index = 0, len = menu.length; index < len; index++) {
        if (url.startsWith(menu[index].sourceUrl + '/')) {
          this.presentMenu.push(menu[index]);
          this.checkMenu(url, menu[index].children);
          break;
        }

      }
    }
    private subscribeRouterEvent() {
      this.routerEventSub = this.routerEvent.pipe(filter(event => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          this.presentMenu = [];
          const tempUrl = event.urlAfterRedirects.endsWith('/') ? event.urlAfterRedirects : event.urlAfterRedirects + '/';
          this.checkMenu(tempUrl, this.menuList);
          if (this.presentMenu.length > 0) {
            this.menuNavChange.next(this.presentMenu);
          }
        });
    }
    public getMenuAuthorized(): Observable<HttpUtilNs.UfastHttpResT<MenuAuthorizedItemModel[]>> {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Ius;
      return this.http.Get('/menu/authorized', null, config)
        .pipe(map((menuData: UfastHttpAnyResModel) => {
          if (menuData.code === 0) {
            this.menuList = menuData.value;
          }
          if (!this.routerEventSub) {
            this.subscribeRouterEvent();
          }
          return menuData;
        }));
    }
    // public getMenuAuthorized(): Observable<HttpUtilNs.UfastHttpResT<MenuAuthorizedItemModel[]>> {
    //
    //   return this.http.get('ius', '/menu/authorized')
    //     .pipe(map((menuData: UfastHttpAnyResModel) => {
    //       if (menuData.code === 0) {
    //         this.modifyMenu(menuData.value);
    //         this.menuList = menuData.value;
    //       }
    //       return menuData;
    //     }));
    // }
    //

    public getListMenuBySite(site: string): Observable<HttpUtilNs.UfastHttpResT<MenuAuthorizedItemModel[]>> {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Ius;
      return this.http.Get('/menu/listMenuBySite', {site: site}, config);
    }
  }

}
@Injectable()
export class MenuService extends MenuServiceNs.MenuServiceClass {
  constructor(injector: Injector) {
    super(injector);
  }
}
