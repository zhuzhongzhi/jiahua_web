
import { Injectable, EventEmitter } from '@angular/core';
import {RouteReuseStrategy, NavigationEnd, ActivatedRouteSnapshot, DetachedRouteHandle, Router, Route} from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export class UfastReuseStrategy extends RouteReuseStrategy {
  public static _cacheRouters: { [key: string]: CacheRouterModel } = {};
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    if (route.data && route.data[ 'cache' ] === false) {
      return false;
    }
    const config: Route = route.routeConfig;
    return config && !config.loadChildren;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    const path: string = this.getRoutePath(route);

    const cacheRoute: CacheRouterModel = UfastReuseStrategy._cacheRouters[path];
    if (cacheRoute) {
      UfastReuseStrategy._cacheRouters[path].handle = handle;
      UfastReuseStrategy._cacheRouters[path].snapshot = route;
    } else {
      return;
    }



    const config: Route = route.routeConfig;
    if (config) {
      const childRoute: ActivatedRouteSnapshot = route.firstChild;
      const futureRedirectTo = childRoute ? childRoute.url.map(function(urlSegment) {
        return urlSegment.path;
      }).join('/') : '';
      const childRouteConfigs: Route[] = config.children;
      if (childRouteConfigs) {
        let redirectConfigIndex: number;
        const redirectConfig: Route = childRouteConfigs.find(function(childRouteConfig, index) {
          if (childRouteConfig.path === '' && !!childRouteConfig.redirectTo) {
            redirectConfigIndex = index;
            return true;
          }
          return false;
        });
        if (redirectConfig) {
          if (futureRedirectTo !== '') {
            redirectConfig.redirectTo = futureRedirectTo;
          } else {
            childRouteConfigs.splice(redirectConfigIndex, 1);
          }
        } else if (futureRedirectTo !== '') {
          childRouteConfigs.push({
            path: '',
            redirectTo: futureRedirectTo,
            pathMatch: 'full'
          });
        }
      }
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return !!UfastReuseStrategy._cacheRouters[this.getRoutePath(route)];
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    const config: Route = route.routeConfig;
    if (!config || config.loadChildren) {
      return false;
    }
    const cacheRoute = UfastReuseStrategy._cacheRouters[this.getRoutePath(route)];
    return cacheRoute ? cacheRoute.handle : null;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }

  getRoutePath(route: ActivatedRouteSnapshot): string {
    let namedOutletCount = 0;
    return route.pathFromRoot.reduce((path, routeInfo) => {
        const config: Route = routeInfo.routeConfig;
        if (config) {
          if (config.outlet && config.outlet !== 'primary') {
            path += `(${config.outlet}:`;
            namedOutletCount++;
          } else {
            path += '/';
          }
          return path += config.path;
        }
        return path;
      }, '') + (namedOutletCount ? new Array(namedOutletCount + 1).join(')') : '');
  }
}


export interface CacheRouterModel {
  snapshot: ActivatedRouteSnapshot;
  handle: any;
  index: number;
}

@Injectable()
export class UfastTabsetRouteService {

  selectedIndex: number;
  tabNumber: number;
  cacheRouters: { [key: string]: CacheRouterModel };
  cacheRouterNumber: number;
  selectedIndexChange: EventEmitter<number>;
  disabledMenu: boolean;
  constructor( private router: Router) {

    this.cacheRouters = UfastReuseStrategy._cacheRouters;
    this.tabNumber = 0;
    this.cacheRouterNumber = 0;
    this.selectedIndexChange = new EventEmitter<number>();
    this.selectedIndex = 0;

    (<Observable<any>>this.router.events.pipe(filter(event => event instanceof NavigationEnd))).subscribe((event: NavigationEnd) => {
      const url = this.clearUrlParams(event.urlAfterRedirects);
      const cacheRoute: CacheRouterModel = this.cacheRouters[url];
      if (cacheRoute) {
        if (cacheRoute.index !== undefined) {
          this.changeSelectedIndex(cacheRoute.index);
        }
      } else {
        this.cacheRouters[url] = {
          index: undefined,
          snapshot: undefined,
          handle: undefined,
        };
        this.cacheRouterNumber++;
      }

    });

  }
  public clearUrlParams(fullPath: string): string {
    const queryIndex = fullPath.indexOf('?');
    const url = queryIndex === -1 ? fullPath : fullPath.substring(0, queryIndex);
    const semIndex = url.indexOf(';');
    return semIndex === -1 ? url : url.substring(0, semIndex);
  }
  public changeSelectedIndex(index: number): void {
    this.selectedIndex = index;
  }
  public navigateByUrl(url: string): Promise<any> {
    if (this.disabledMenu) {
      return Promise.reject('');
    }
    if (environment.production) {
      this.disabledMenu = true;
    }
    return this.router.navigateByUrl(url);
  }
  public onSelectedIndexChange(index: number): void {
    const nowUrl = this.clearUrlParams(this.router.url);
    this.selectedIndexChange.emit(index);
    for (const key in this.cacheRouters) {
      if ( index === this.cacheRouters[key].index) {
        if (nowUrl === key) {
          this.router.navigateByUrl(this.router.url);
        } else {
          this.router.navigateByUrl(key);
        }
        break;
      }
    }
    this.disabledMenu = false;
  }
  public selectNewTab(url: string): void {
    this.cacheRouters[url] = {
      index: this.tabNumber,
      handle: undefined,
      snapshot: undefined
    };
    this.changeSelectedIndex(this.tabNumber++);

  }

  public getTabIndex(url: string): number {

    return this.cacheRouters[url] ? this.cacheRouters[url].index : -1;
  }
  public closeTab(url: string): void {
    let prevUrl = '';
    let nextUrl = '';
    const nowUrlCache: CacheRouterModel = this.cacheRouters[url];
    for (const item in this.cacheRouters) {
      if (!this.cacheRouters.hasOwnProperty(item)) {
        continue;
      }
      const tempCacheRoute: CacheRouterModel = this.cacheRouters[item];
      if (tempCacheRoute.index > nowUrlCache.index) {
        if (tempCacheRoute.index === nowUrlCache.index + 1) {
          nextUrl = item;
        }
        tempCacheRoute.index--;
      } else if (tempCacheRoute.index + 1 === nowUrlCache.index) {
        prevUrl = item;
      } else {}
    }

    if (this.selectedIndex === nowUrlCache.index) {
      let toUrl = '';
      if (nextUrl.length > 0) {
        toUrl = nextUrl;
        this.changeSelectedIndex(nowUrlCache.index);
      } else if (prevUrl.length > 0) {
        toUrl = prevUrl;
        this.changeSelectedIndex(this.selectedIndex - 1);
      } else {
        return;
      }
      this.router.navigateByUrl(toUrl).then(() => {
        this.destroyCacheUrl(url);
      });
    } else if (this.selectedIndex > this.cacheRouters[url].index) {
      this.changeSelectedIndex(this.selectedIndex - 1);
      this.destroyCacheUrl(url);
    } else {
      this.destroyCacheUrl(url);
    }
  }

  private destroyCacheUrl(url: string): void {
    if (this.cacheRouters[url].handle) {
      this.cacheRouters[url].handle.componentRef.destroy();
    }

    this.cacheRouterNumber--;
    this.tabNumber --;
    delete this.cacheRouters[url];
  }


}
