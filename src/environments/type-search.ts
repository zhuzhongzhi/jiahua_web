export const inlineStatusNodes = [
  {label: '在线', val: 1},
  {label: '离线', val: 0},
];

export const workStatusNodes = [
  {label: '出勤', val: 1},
  {label: '休息', val: 2},
];

export const vehicleStatusNodes = [
  {label: '工作', val: 2},
  {label: '维修', val: 3},
  {label: '闲置', val: 0},
  // {label: '怠速', val: 1},
];

export const alertStatusNodes = [
  {alarmTypeName: '超速报警', alarmTypeCode: 1},
  {alarmTypeName: '怠速报警', alarmTypeCode: 2},
  {alarmTypeName: '围栏报警', alarmTypeCode: 3},
  {alarmTypeName: '路线报警', alarmTypeCode: 4},
  {alarmTypeName: '终端故障', alarmTypeCode: 11},
];

export const requireNodes = [
  {label: '已报修', val: 1},
  {label: '未报修', val: 0},
];

export const typeNodes = [
  {label: '使用前检查', val: 0},
  {label: '使用中检查', val: 1},
];

export const requireStatusNode = [
  {label: '待维修', val: 0},
  {label: '维修中', val: 1},
  {label: '待料中', val: 2},
  {label: '提报计划', val: 5},
  {label: '接收计划', val: 6},
  {label: '已到料', val: 3},
  {label: '已完成', val: 4}
];
// 维修等级
export const repairLevelNodes = [
  {label: '小修', val: 1},
  {label: '疑难故障维修', val: 2},
  {label: '深度维修、事故车维修', val: 3},
  {label: '保养、其他维修', val: 4},
  {label: '返修', val: 5}
];
// 停车点类型
export const parkingSpotTypeNodes = [
  {label: '停车场', val: 0},
  {label: '维修厂', val: 1}
];
// 报警类型
export const alarmTypeNodes = [
  {label: '超速报警', val: 1},
  {label: '怠速报警', val: 2},
  {label: '围栏报警', val: 3},
  {label: '路线报警', val: 4},
];
// 用户类型
export const userTypeNodes = [
  {label: '普通用户', val: '0'},
  {label: '平台运营', val: '1'},
  {label: '企业管理', val: '2'},
  {label: '维修厂用户', val: '3'}
];
// 指令下发结果
export const cmdSendNodes = [
  {label: '未下发', val: 0},
  {label: '指令下发', val: 1},
  {label: '应答成功', val: 2},
  {label: '应答失败', val: 3}
];
