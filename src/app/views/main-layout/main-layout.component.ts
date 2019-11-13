import {AfterViewInit, ChangeDetectorRef, Component, enableProdMode, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ShowMessageService} from '../../widget/show-message/show-message';
import {MenuService, MenuServiceNs} from '../../core/common-services/menu.service';
import {UserService} from '../../core/common-services/user.service';
import {StorageProvider} from '../../core/common-services/storage';
import {environment, webSocketUrl} from '../../../environments/environment';
import {NoticeChange} from '../../core/common-services/notice.service';
import {NoticeService} from '../../core/biz-services/notice/notice.service';
import {SocketService} from '../../core/common-services/socket.service';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {alertStatusNodes} from '../../../environments/type-search';
import {AlarmListService} from '../../core/biz-services/vehicleMonitor/alarm-list.service';
import {TerminalServiceNs} from '../../core/biz-services/resource/terminal.service';
import {UserManageService, UserManageServiceNs} from '../../core/biz-services/sysManage/user-manage.service';
import {CookieService} from 'ngx-cookie-service';

enableProdMode();

export interface Notice {
  alarmTime: string;
  messageContent: string;
  messageType: number;
  orgId: string | number;
  vehicleId: string | number;
  vehicleLicense: string;
  address: string;
  lat: string | number;
  lang: string | number;
  speed?: string | number;
  alarmId: string | number;
}

@Component({
  selector: 'app-main-layout',
  styleUrls: ['./main-layout.component.scss'],
  templateUrl: './main-layout.component.html'
})

export class MainLayoutComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('noticeTemplate')
  noticeTemplate: TemplateRef<{}>;
  noticeModalRef;
  noticeInfo: Notice;
  hideSideMenu: boolean;
  mainMenu;
  subMenu;
  sideMenu: MenuServiceNs.MenuAuthorizedItemModel;
  selectedItem: string;
  selectedNavIndex: number;
  selectedIndex: number;
  username: string = localStorage.getItem('userName') || '';
  sideLoading: boolean;
  isCollapsed = false; // 菜单折叠
  alertStatusNode = alertStatusNodes;
  noticeNum: number | string = 0;
  public alarmNum: number;
  public timer: any;
  showAlarmModel = false;
  alarmTitle = '';
  alarmDetailInfo = {
    id: null,
    num: '',
    section: '',
    team: '',
    driver: '',
    alertStatus: '',
    posContent: '',
    posNum: [],
    posEncNum: [],
    time: '',
    content: '',
    vehicleType: '',
    vehicleModel: ''
  };

  constructor(private messageService: ShowMessageService, private detectorRef: ChangeDetectorRef,
              private menuService: MenuService, public router: Router,
              public userService: UserService, private storage: StorageProvider,
              private userManageService: UserManageService,
              private noticeService: NoticeService,
              private alarmListService: AlarmListService,
              public noticeChange: NoticeChange,
              public socketService: SocketService,
              private notification: NzNotificationService,
              private modal: NzModalService, private cookieService: CookieService
              // public tabsetService: UfastTabsetRouteService
  ) {
    this.sideLoading = false;
    this.selectedNavIndex = null;
    this.selectedIndex = null;
    this.mainMenu = [
      {
        name: '丝车监控',
        img: '../../../assets/image/jiahua/monitor.png',
        show: this.show(10),
        url: '',
        subMenu: [
          {name: '丝车分布', url: '/main/latheManage/latheDistributed', show: this.show(101)},
          {name: '丝车列表', url: '/main/latheManage/latheList', show: this.show(102)}
        ]
      },
      {
        name: '生产管理',
        img: '../../../assets/image/jiahua/produce.png',
        url: '',
        show: this.show(20),
        subMenu: [
          {
            name: '工艺流程管理',
            show: this.show(201),
            url: '',
            subMenu: [
              {name: '落丝管理', url: '/main/produceManage/hotreelManage', show: this.show(20101)},
              {name: '测丹尼管理', url: '/main/produceManage/danniManage', show: this.show(20102)},
              {name: '摇袜管理', url: '/main/produceManage/socksManage', show: this.show(20103)},
              {name: '判色管理', url: '/main/produceManage/adjustManage', show: this.show(20104)},
              {name: '检验管理', url: '/main/produceManage/checkManage', show: this.show(20105)},
              {name: '包装管理', url: '/main/produceManage/packManage', show: this.show(20106)},
            ]
          },
          {
            name: '报警管理',
            url: '',
            show: this.show(202),
            subMenu: [
              {name: '锭位质量报警', url: '/main/produceManage/ingotAlarm', show: this.show(20201)},
              {name: '线别质量报警', url: '/main/produceManage/wiringAlarm', show: this.show(20202)},
              {name: '驻留报警', url: '/main/produceManage/stayAlarm', show: this.show(20203)},
              {name: '报警处理日志', url: '/main/produceManage/alarmLog', show: this.show(20204)}
            ]
          },
          {
            name: '统计分析',
            url: '',
            show: this.show(203),
            subMenu: [
              {name: '产量统计', url: '/main/produceManage/outputStatistic', show: this.show(20301)},
              {name: '每日质量分析报告', url: '/main/produceManage/dailyQuality', show: this.show(20302)},
              {name: '每月质量分析报告', url: '/main/produceManage/monthQuality', show: this.show(20303)},
              {name: '年度质量分析报告', url: '/main/produceManage/yearQuality', show: this.show(20304)}
            ]
          },
          {
            name: '看板管理',
            url: '',
            show: this.show(204),
            subMenu: [
              {name: '生产看板', url: '/main/produceManage/produceBillboard', show: this.show(20401)},
              {name: '质量看板', url: '/main/produceManage/qualityBillboard', show: this.show(20402)}
            ]
          }
        ]
      },
      {
        name: '系统管理',
        img: '../../../assets/image/jiahua/system.png',
        show: this.show(30),
        url: '',
        subMenu: [
          {name: '线别纺位管理', url: '/main/sysManage/lineSpin', show: this.show(301)},
          {name: '批次规格管理', url: '/main/sysManage/batchManage', show: this.show(301)},
          {name: '账户管理', url: '/main/sysManage/jiahuaUser', show: this.show(302)},
          {name: '权限管理', url: '/main/sysManage/jiahuaAuth', show: this.show(303)},
          {name: '日志管理', url: '/main/sysManage/sysLog', show: this.show(304)}
        ]
      }
    ];

    console.log(this.mainMenu)
    this.subMenu = [
      {name: '丝车分布', url: '/main/latheManage/latheDistributed'},
      {name: '丝车列表', url: '/main/latheManage/latheList'}
    ];
    this.sideMenu = {name: '', url: '', children: [], auths: []};
    this.hideSideMenu = false;
    this.alarmNum = 0;
    this.timer = null;

    // this.menuService.menuNavChange.subscribe((presentMenu: MenuServiceNs.MenuAuthorizedItemModel[]) => {
    //   if (presentMenu.length === 0) {
    //     return;
    //   }
    //   this.sideMenu = presentMenu[0];
    //  // this.hideSideMenu = false;
    //   this.selectedItem = this.sideMenu.url;
    //   this.selectedNavIndex = this.mainMenu.findIndex( data => data.url === this.selectedItem);
    //   this.hideSideMenu = this.sideMenu.children.length === 0;
    // });
    //
    // this.eventbusService.storeAlarmEvent().subscribe( data => {
    //   this.alarmNum = data;
    // });
  }

  public show(code) {
    let rights = JSON.parse(localStorage.getItem('rights') || null);
    let bool = false;
    if (rights === null) {
      this.userService.getLogin({}).subscribe((res) => {
        rights = res.value.jiahuaUserAuthList;
        if (!rights || JSON.stringify(rights) === '{}') {
          bool = true;
        } else {
          rights.forEach(right => {
            console.log(right);
            console.log(right.authId.startsWith(code));
            console.log(code);
            if (right.authId.startsWith(code) && right.status === 1) {
              bool = true;
            }
          });
          console.log(bool);
          return bool;
        }
      });
    }
    if (!rights || JSON.stringify(rights) === '{}') {
      bool = true;
    } else {
      rights.forEach(right => {
        if (right.authId.startsWith(code) && right.status === 1) {
          bool = true;
        }
      });
      return bool;
    }
  }

  // public onSelectedIndex(index: number) {
  //   this.tabsetService.onSelectedIndexChange(index);
  // }

  public navigateUserInfo() {
    this.router.navigateByUrl('/main/personal/personalInfo');
  }

  public navigatePassword() {
    this.router.navigateByUrl('/main/personal/modifyPwd');
  }

  public logOut() {
    console.log(123123);
    this.messageService.showToastMessage('用户退出成功', 'success');
    this.userService.logout().subscribe(() => {
      // this.router.navigateByUrl('/login');
      this.storage.remove('rights');
      window.location.href = environment.otherData.defaultPath;
    }, (error: any) => {
      // this.router.navigateByUrl('/login');
      this.storage.remove('rights');
      window.location.href = environment.otherData.defaultPath;
    });
  }

  ngOnInit() {
    localStorage.setItem('demo', 'demo');
    localStorage.removeItem('demo')
    this.username = localStorage.getItem('userName');
    if (this.cookieService.get('x-user-id') !== undefined) {
      // this.userService.getLogin(this.cookieService.get('x-user-id')).subscribe((resData) => {
      //   console.log(resData);
      //   if (resData.code === 0) {
      //     // this.username = resData.value.name;
      //     // console.log(this.username);
      //   }
      // });
      // this.userService.getLogin(this.cookieService.get('x-user-id')).subscribe((resData: UserServiceNs.UfastHttpAnyResModel) => {
      //   if (resData.code === 0) {
      //     this.username = resData.value.name;
      //     console.log(this.username);
      //     // this.saveInfo(resData.value);
      //     // this.connectSocketServce(resData.value.userId, resData.value.spaceId);
      //     // this.getUserMessage(resData.value.userId);
      //   } else {
      //     this.messageService.showAlertMessage('', resData.message, 'warning');
      //   }
      // }, (error: any) => {
      //   this.messageService.showAlertMessage('', error.message, 'error');
      // });
    }
    // this.noticeChange.messageSource.subscribe(Message => {
    //   this.noticeService.getNoticeNum().subscribe((resData: UserServiceNs.UfastHttpAnyResModel) => {
    //     if (resData.code === 0) {
    //       // this.noticeNum = resData.value > 99 ? '99+' : resData.value;
    //       this.noticeNum = resData.value;
    //     } else {
    //       this.messageService.showAlertMessage('', resData.message, 'warning');
    //     }
    //   }, (error: any) => {
    //     this.messageService.showAlertMessage('', error.message, 'error');
    //   });
    // });
  }

  goRoute(menu) {
    this.router.navigateByUrl(menu.url);
  }

  private saveInfo(info) {
    this.storage.setItem('userId', info.userId);
    this.storage.setItem('orgId', info.spaceId);
    this.storage.setObject('roleIds', info.roleIds);
    this.storage.setObject('roleVOs', info.roleVOs);
    this.storage.setObject('authIds', info.authIds);
  }

  // 获取当前登录用户的真实姓名和手机号码
  getUserMessage(userID) {
    const filter = {
      id: userID
    };
    this.userManageService.getUserMess(filter).subscribe((resData: UserManageServiceNs.UfastHttpAnyResModel) => {
      if (resData.code !== 0) {
        return;
      }
      this.storage.setItem('userName', resData.value.workPersonnelName);
    }, (error: any) => {
    });
  }

  private connectSocketServce(userId: string, orgId: string) {
    const wsUrl = `${webSocketUrl}?userId=${userId}&orgId=${orgId}`;
    // const wsUrl = `${webSocketUrl}/0`;
    this.socketService.createSocket(wsUrl);
    this.socketService.socket.on('message', (data) => {
      this.noticeInfo = data;
      this.noticeChange.changeMessage('change');
      this.showNoticeModel();
    });
  }

  private getMenu() {
    this.messageService.showLoading('');
    this.menuService.getMenuAuthorized()
      .subscribe((menuData: MenuServiceNs.UfastHttpAnyResModel) => {
        this.messageService.closeLoading();
        if (menuData.code !== 0) {
          this.messageService.showAlertMessage(menuData.message, '', 'warning');
          return;
        }
        this.mainMenu = this.initMenuData(menuData.value);
        this.getUrl();
      }, (error) => {
        this.messageService.closeLoading();
      });
  }

  public async getAlarmNumData() {
    this.alarmNum = 0;
  }

  ngAfterViewInit() {
    // this.getMenu();
    this.getAlarmNumData();
    /*     this.timer = setInterval(() => {
          this.getAlarmNumData();
        }, this.timeInternal); */
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  openHandle(id) {
    for (let i = 0; i < this.mainMenu.length; i++) {
      if (this.mainMenu[i].id !== id) {
        this.mainMenu[i].open = false;
      }
    }
  }

  selectMenu(menu) {
    this.subMenu = menu.subMenus;
  }

  initMenuData(data) {
    data.sort((a, b) => {
      return a.id - b.id;
    }).map((item) => {
      item.children.map((i) => {
        return {...i, open: false};
      });
      return {...item, open: false};
    });
    return data;
  }

  // 获取当前地址，设置导航选中状态
  getUrl() {
    const url = location.pathname;
    for (let i = 0; i < this.mainMenu.length; i++) {
      const menu = this.mainMenu[i];
      if (url.indexOf(menu.url) > -1) {
        this.mainMenu[i].open = true;
        for (let j = 0; j < menu.children.length; j++) {
          if (url.indexOf(menu.children[j].url) > -1) {
            this.mainMenu[i].children[j].open = true;
          }
        }
      }
    }
  }

  showNoticeModel() {
    this.notification.config({
      nzPlacement: 'bottomRight',
      nzDuration: 10000,
      nzKey: 'key'
    });
    this.notification.remove();
    this.noticeModalRef = this.notification.template(this.noticeTemplate);
  }

  lookNoticeDetail() {
    if (this.noticeInfo.messageType > 0 && this.noticeInfo.messageType <= this.alertStatusNode.length) {
      this.showAlarm();
    }
    this.notification.remove();
  }

  showAlarm() {
    this.alarmListService.item({id: this.noticeInfo.alarmId})
      .subscribe((resData: TerminalServiceNs.UfastHttpAnyResModel) => {
        if (resData.code !== 0) {
          this.messageService.showAlertMessage('', resData.message, 'warning');
          return;
        }
        this.alarmDetailInfo.section = resData.value.orgName;
        this.alarmDetailInfo.team = resData.value.workGroupName;
        this.alarmDetailInfo.driver = resData.value.workPersonnelName;
        this.alarmDetailInfo.posNum = [resData.value.lat, resData.value.lon];
        this.alarmDetailInfo.posEncNum = [resData.value.latEnc, resData.value.lonEnc];
      }, (error: any) => {
        this.messageService.showAlertMessage('', error.message, 'error');
      });
    this.alarmTitle = '报警信息（' + this.noticeInfo.vehicleLicense + ')';
    this.alarmDetailInfo.id = this.noticeInfo.alarmId;
    this.alarmDetailInfo.num = this.noticeInfo.vehicleLicense;

    this.alarmDetailInfo.alertStatus = this.alertStatusNode[this.noticeInfo.messageType + 1].alarmTypeName + '报警';
    this.alarmDetailInfo.posContent = this.noticeInfo.address;
    this.alarmDetailInfo.time = this.noticeInfo.alarmTime;
    this.alarmDetailInfo.content = this.noticeInfo.messageContent;
    this.showAlarmModel = true;
  }

  cancleAlarm() {
    this.showAlarmModel = false;
  }
}
