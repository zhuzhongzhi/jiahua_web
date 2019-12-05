import {AfterViewInit, ChangeDetectorRef, Component, enableProdMode, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ShowMessageService} from '../../widget/show-message/show-message';
import {MenuService, MenuServiceNs} from '../../core/common-services/menu.service';
import {UserService} from '../../core/common-services/user.service';
import {StorageProvider} from '../../core/common-services/storage';

enableProdMode();

@Component({
  selector: 'app-main-layout',
  styleUrls: ['./main-layout.component.scss'],
  templateUrl: './main-layout.component.html'
})

export class MainLayoutComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('noticeTemplate')
  noticeTemplate: TemplateRef<{}>;
  hideSideMenu: boolean;
  mainMenu;
  subMenu;
  sideMenu: MenuServiceNs.MenuAuthorizedItemModel;
  selectedNavIndex: number;
  selectedIndex: number;
  username: string = localStorage.getItem('userName') || '';
  sideLoading: boolean;
  isCollapsed = false; // 菜单折叠
  public alarmNum: number;
  public timer: any;

  constructor(private messageService: ShowMessageService, private detectorRef: ChangeDetectorRef,
              private menuService: MenuService, public router: Router,
              public userService: UserService, private storage: StorageProvider,
  ) {
    let rights = JSON.parse(localStorage.getItem('rights') || null);
    if (rights === null) {
      this.router.navigateByUrl('/login');
    }

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
          {name: '丝车列表', url: '/main/latheManage/latheList', show: this.show(102)},
          {name: '丝车分布', url: '/main/latheManage/latheDistributed', show: this.show(101)}
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
              {name: '历史管理', url: '/main/produceManage/historyManage', show: this.show(20107)},
            ]
          },
          {
            name: '报警管理',
            url: '',
            show: this.show(202),
            subMenu: [
              {name: '纺位质量报警', url: '/main/produceManage/ingotAlarm', show: this.show(20201)},
              {name: '批次质量报警', url: '/main/produceManage/wiringAlarm', show: this.show(20202)},
              {name: '驻留报警', url: '/main/produceManage/stayAlarm', show: this.show(20203)},
              {name: '报警统计', url: '/main/produceManage/statisticAlarm', show: this.show(20205)},
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
          {name: '批次规格管理', url: '/main/sysManage/batchManage', show: this.show(305)},
          {name: '账户管理', url: '/main/sysManage/jiahuaUser', show: this.show(302)},
          {name: '权限管理', url: '/main/sysManage/jiahuaAuth', show: this.show(303)},
          {name: '日志管理', url: '/main/sysManage/sysLog', show: this.show(304)}
        ]
      }
    ];

    this.subMenu = [
      {name: '丝车分布', url: '/main/latheManage/latheDistributed'},
      {name: '丝车列表', url: '/main/latheManage/latheList'}
    ];
    this.sideMenu = {name: '', url: '', children: [], auths: []};
    this.hideSideMenu = false;
    this.alarmNum = 0;
    this.timer = null;
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

  public logOut() {
    this.messageService.showToastMessage('用户退出成功', 'success');
    this.userService.logout().subscribe(() => {
      this.router.navigateByUrl('/login');
      this.storage.remove('rights');
    }, (error: any) => {
      this.router.navigateByUrl('/login');
      this.storage.remove('rights');
    });
  }

  ngOnInit() {
    localStorage.setItem('demo', 'demo');
    localStorage.removeItem('demo')
    this.username = localStorage.getItem('userName');
  }

  goRoute(menu) {
    if (this.router.url !== menu.url) {
      this.messageService.showLoading('');
    }
    this.router.navigateByUrl(menu.url);
  }


  public async getAlarmNumData() {
    this.alarmNum = 0;
  }

  ngAfterViewInit() {
    this.getAlarmNumData();
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

}
