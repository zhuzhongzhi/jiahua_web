import {Pipe, PipeTransform} from '@angular/core';
import {DatePipe} from '@angular/common';

export const MapSet = {
  enabledStatus: {
    0: '禁用',
    1: '启用'
  },
  onlineStatus: {
    0: '离线',
    1: '在线'
  },
  runStatus: {
    0: '待机',
    1: '运行'
  },
  alarmStatus: {
    0: '正常',
    1: '报警'
  },
  sex: {
    0: '女',
    1: '男'
  },
  commandType: {// 指令类型
    1: '重启',
    2: '读取点值',
    3: '设置点值',
    4: '远程升级',
    5: '远程配置',
    6: '参数获取'
  },
  commandStatus: {// 指令状态
    0: '待发送',
    1: '执行成功',
    2: '执行失败'
  },
  variateCategory: {// 变量分类
    1: '运行状态变量',
    2: '电量模块变量',
    3: '上行设备变量',
    4: '下行控制变量'
  },
  triggerType: {// 触发条件
    1: '数值低于A',
    2: '数值高于B',
    3: '数值介于AB之间',
    4: '数值高于B低于A',
    5: '数值等于A'
  },
  connectionOperator: {// 连接操作符
    and: 'and',
    or: 'or'
  },
  alarmType: {// 报警方式
    2: '邮件',
    3: '短信',
    1: '平台',
    4: '微信'
  },
  handledStatus: {
    0: '未处理',
    1: '已处理'
  },
  refreshTime: {
    10: '10秒',
    15: '15秒',
    20: '20秒'
  },
  statisticalMethod: {
    1: '按日统计',
    2: '按月统计'
  },
  statisticalType: {
    1: '日利用率',
    2: '月利用率'
  },
  ssMessage: {
    0: '失败',
    1: '成功'
  },
  timePeriod: {
    0: '时',
    1: '天',
    2: '月',
  },
  deviceType: { // 终端型号
    0: 'XCMG-FRC-J-JTWL'
  },
  protocolType: { // 协议类型
    0: 'M2M'
  },
  workFunction: { // 员工岗位
    1: '司机',
    2: '点检',
    3: '运输班长',
    4: '质检',
    5: '技术员',
    6: '维修班长',
    7: '维修工',
    8: '管理人员'
  },
  workGroupType: { // 班组类型
    0: '长班',
    1: '倒班'
  },
  maintenanceType: { // 保养类型
    1: '按行驶里程',
    2: '按工作时间',
    3: '按时间周期',
    4: '按指定日期'
  },
  maintenanceState: { // 保养状态
    0: '未保养',
    1: '已保养'
  },
  cmdSendState: {
    0: '未下发',
    1: '指令下发',
    2: '应答成功',
    3: '应答失败'
  },
};

@Pipe({
  name: 'map'
})
export class MapPipe implements PipeTransform {
  private datePipe: DatePipe = new DatePipe('en-US');
  private mapObj = MapSet;

  transform(value: any, arg?: any): any {
    if (arg === undefined) {
      return value;
    }
    let type: string = arg;
    let param = '';

    if (arg.indexOf(':') !== -1) {
      type = arg.substring(0, arg.indexOf(':'));
      param = arg.substring(arg.indexOf(':') + 1, arg.length);
    }

    switch (type) {
      case 'date':
        return this.datePipe.transform(value, param);
      default:
        return (this.mapObj[type] ? this.mapObj[type][value] : '');
    }
  }

  public transformMapToArray(data?: any) {
    if (!data) {
      return [];
    }
    const list = [];
    Object.keys(data).forEach((key: string) => {
      list.push({value: key, label: data[key]});
    });
    return list;
  }

}
