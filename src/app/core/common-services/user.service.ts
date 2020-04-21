import {Injectable, Injector} from '@angular/core';
import {HttpUtilNs, HttpUtilService} from '../infra/http/http-util.service';
import {Observable} from 'rxjs';
import {map, retry} from 'rxjs/operators';
import {HttpHeaders} from '@angular/common/http';


export namespace UserServiceNs {
  import UfastHttpRes = HttpUtilNs.UfastHttpRes;

  export interface HttpError extends HttpUtilNs.UfastHttpRes {
  }

  export interface UfastHttpResT<T> extends HttpUtilNs.UfastHttpResT<T> {
  }

  export interface AuthAnyResModel extends HttpUtilNs.UfastHttpRes {
    value: any;
  }

  export interface UfastHttpAnyResModel extends HttpUtilNs.UfastHttpRes {
    value: any;
  }

  export interface AuthInfoResModel extends HttpUtilNs.UfastHttpRes {
    value: {
      authId: string;
      verifyCode?: string;
      verifyImgUrl: string;
    };
  }

  export interface AuthLoginReqModel {
    loginName: string;
    password: string;
  }

  export interface JiahuaLoginReqModel {
    userName: string;
    password: string;
  }

  export interface AuthUpdateInfoReqModel {
    email?: string;
    mobile?: string;
    areaCode: string;
    loginName: string;
    name: string;
    password: string;
    telephone: string;
  }

  export interface AuthLoginInfoValueModel {
    loginName: string;
    password: string;
    deptName: string;      // 所属部门
    email: string;
    name: string;
    roleNames: string;     // 角色
    mobile: string;        // 手机号
    telephone: string;     // 电话
    userId: string;
    rolesVOs: any[];
    status: number;
    type: number;

    [otherKey: string]: any;
  }

  export interface AuthLoginInfoResModel extends UfastHttpRes {
    value: AuthLoginInfoValueModel;
  }

  export interface UserInfoModel {
    locked: number;      // 0：启用，1：锁定
    loginName: string;
    name: string;
    roleIds: string[];
    email?: string;
    mobile?: string;
    telephone?: string;
    nickname?: string;   // 昵称
    sex: number;         // 0:女，1：男
    deptId: string;
    areaCode?: string;
    spaceId?: string;
    deptName?: string;
    lastLoginTime?: number;
    roleNames?: string;
    roleVOs?: any[];
    type?: number;
    status?: number;
    userId?: string;
    spaceName?: string;
  }

  export interface DepartmentModel {
    code: string;
    id: string;
    leaf: number;
    name: string;
    parentId: string;
    seq: number;
    spaceId: string;
  }

  export class UserServiceClass {
    private http: HttpUtilService;
    public userInfo: any;

    constructor(private injector: Injector) {
      this.http = injector.get(HttpUtilService);
      this.userInfo = {
        username: null
      };
    }

    // iot jiahua 用户接口
    /**
     *  新增权限信息
     *  JiahuaAuth {
          authId (string): 权限id ,
          authName (string): 权限名 ,
          desc (string, optional): 描述 ,
          jaId (integer): id
        }
     */
    public authAdd(data): Observable<AuthAnyResModel> {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/jiahua/user/authAdd', data, config);
    }

    /**
     *  修改权限信息
     *  JiahuaAuth {
          authId (string): 权限id ,
          authName (string): 权限名 ,
          desc (string, optional): 描述 ,
          jaId (integer): id
        }
     */
    public authModify(data): Observable<AuthAnyResModel> {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/jiahua/user/authModify', data, config);
    }

    /**
     * 查询用户账户信息
     {
        "filters": {
          "authId": "string",
          "authName": "string",
          "desc": "string",
          "jaId": 0
        },
        "pageNum": 0,
        "pageSize": 0,
        "sort": "string"
      }
     * @param data
     */
    public authPage(data): Observable<AuthAnyResModel> {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/jiahua/user/authModify', data, config);
    }

    /**
     * 清除系统操作日志信息
     * @param data
     */
    public clearOperateLog(data): Observable<AuthAnyResModel> {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/jiahua/user/clearOperateLog', data, config);
    }

    /**
     * 删除系统操作日志信息
     * @param data
     */
    public delOperateLog(data): Observable<AuthAnyResModel> {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/jiahua/user/delOperateLog', data, config);
    }

    /**
     * 获取登录信息
     * @param data
     */
    public getLogin(data): Observable<AuthAnyResModel> {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      config.headers =
        new HttpHeaders({'Authorization': sessionStorage.getItem('x-user-id')});
      return this.http.Post('/jiahua/user/getLogin', data, config);
    }

    /**
     * 查询系统操作日志信息
     * @param data
     */
    public operateLog(data): Observable<AuthAnyResModel> {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/jiahua/user/operateLog', data, config);
    }


    public getAuthInfo(): Observable<AuthInfoResModel> {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Ius;
      return this.http.Get<AuthInfoResModel>('/auth/authInfo', null, config)
        .pipe(retry(2), map((data: AuthInfoResModel) => {
          data.value.verifyImgUrl = this.http.getFullUrl('ius', '/auth/kaptcha') + `?authid=${data.value.authId}`;
          return data;
        }));
    }

    public login(loginData: JiahuaLoginReqModel): Observable<AuthAnyResModel> {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post<AuthAnyResModel>('/jiahua/user/login', loginData, config);
    }

    public postLogin(loginData: AuthLoginReqModel): Observable<AuthAnyResModel> {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Ius;
      return this.http.Post<AuthAnyResModel>('/jiahua/user/login', loginData, config)
        .pipe(map((resData: AuthAnyResModel) => {
          // if (resData.code === 0) {
          //   this.userInfo.username = loginData.loginName;
          // }
          return resData;
        }));
    }

    public logout(): Observable<AuthAnyResModel> {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Auth;
      return this.http.Post('/auth/logout', null, config)
        .pipe(map((resData: AuthAnyResModel) => {
          if (resData.code === 0) {
            this.userInfo.username = '';
          }
          return resData;
        }));
    }

    public modifyPassword(oldPassword: string, newPassword: string): Observable<UfastHttpAnyResModel> {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Ius;
      return this.http.Post<AuthAnyResModel>('/auth/password', {
        newPassword: newPassword,
        oldPassword: oldPassword
      }, config);
    }

    // public getLogin(userid: string): Observable<UfastHttpAnyResModel> {
    //   const config: HttpUtilNs.UfastHttpConfig = {};
    //   config.gateway = HttpUtilNs.GatewayKey.Auth;
    //   return this.http.Get<AuthLoginInfoResModel>('/profile/getLogin', {'x-user-id': userid}, config).pipe(map((data: UfastHttpResT<UserInfoModel>) => {
    //     this.userInfo.username = data.value.loginName;
    //     return data;
    //   }));
    // }

    public updatePersonInfo(data: AuthUpdateInfoReqModel): Observable<UfastHttpAnyResModel> {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Ius;
      return this.http.Post<AuthAnyResModel>('/profile/update', data, config);
    }

    public addUser(userInfo: UserInfoModel): Observable<UfastHttpAnyResModel> {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Ius;
      return this.http.Post('/profile', userInfo, config);
    }

    public updateUserInfo(userInfo: UserInfoModel): Observable<UfastHttpAnyResModel> {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Ius;
      return this.http.Post('/profile/updateUserInfo', userInfo, config);
    }

    public resetPassword(userIdList: string[]): Observable<UfastHttpAnyResModel> {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Ius;
      return this.http.Post('/account/resetPassword', userIdList, config);
    }

    public removeUsers(userIdList: string[]): Observable<UfastHttpAnyResModel> {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Ius;
      return this.http.Post('/profile/remove', userIdList, config);
    }

    public getUserDetail(userId: string): Observable<UfastHttpResT<UserInfoModel>> {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Ius;
      return this.http.Get('/profile/detail', {userId: userId}, config);
    }

    public getUserList(filter: { filters: any, pageNum: number, pageSize: number }): Observable<UfastHttpAnyResModel> {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Ius;
      return this.http.Post('/profile/list', filter, config);
    }

    public lockUsers(lock: number, userIds: string[]): Observable<UfastHttpAnyResModel> {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Ius;
      const body = {
        lock: lock,
        userIds: userIds
      };
      return this.http.Post('/profile/updateLock', body, config);
    }

    public getDepartment(id: string): Observable<HttpUtilNs.UfastHttpResT<DepartmentModel[]>> {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Ius;
      return this.http.Get('/department/list', {id: id}, config);
    }
  }
}

@Injectable()
export class UserService extends UserServiceNs.UserServiceClass {
  constructor(injector: Injector) {
    super(injector);
  }
}
