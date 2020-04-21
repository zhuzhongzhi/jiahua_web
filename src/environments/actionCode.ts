export const ActionCode = {
  /******************系统管理***********************/
  /**机构管理**/
  deptManageAdd: 1201,           // 新增部门
  deptManageEdit: 1202,          // 编辑部门
  deptManageDel: 1203,           // 删除部门
  deptManageSearch: 1204,           // 查询部门
  deptManageDetail: 1205,           // 机构详情

  /**用户管理**/
  userManageAdd: 1301,           // 新增用户
  userManageEdit: 1302,          // 编辑用户
  userManageDel: 1303,           // 删除用户
  userManageSearch: 1304,          // 查询用户
  userManageExport: 1305,          // 导出用户
  userManageDetail: 1306,          // 用户详情
  userManangePwdReset: 1307,         // 重置密码

  /**角色权限管理**/
  roleManageAdd: 1101,           // 新增角色
  roleManageDel: 1102,           // 删除角色
  roleManageBatchDel: 1103,           // 批量删除角色
  roleManageEdit: 1104,          // 编辑角色
  roleManageSetAuth: 1105,       // 设置菜单
  roleManageSetAuthAndLimit: 1106,       // 设置菜单与权限
  roleManageDetail: 1107,       // 角色详情

  /**系统日志**/
  sysLogExport: 1402,           // 系统日志导出
  sysLogSearch: 1401,           // 系统日志查询

  /**位置分布**/
  posSearch: 5801,           // 位置分布查询

  /**车辆列表**/
  vihicleSearch: 1501,           // 车辆列表查询
  vihicleExport: 1502,           // 车辆列表导出
  vihicleDetail: 1503,           // 车辆列表详情

  /**多屏监控**/
  screensSearch: 1603,           // 多屏监控查询
  screensAdd: 1601,           // 多屏监控新增
  screensdel: 1602,           // 多屏监控删除

  /**报警列表**/
  AlartSearch: 1701,           // 报警列表查询
  AlartExport: 1702,           // 报警列表导出
  Alartdetail: 1703,           // 报警列表详情

  /**车队点检**/
  teamTallySearch: 1804,           // 车队点检查询
  teamTallyAdd: 1801,           // 车队点检新增
  teamTallyEdit: 1802,           // 车队点检编辑
  teamTallyDel: 1803,           // 车队点检删除
  teamTallyDetail: 1805,           // 车队点检详情
  teamTallyExport: 1806,           // 车队点检导出
  teamTallyWithdraw: 1807,           // 车队点检撤回
  teamTallyLookImg: 1808,           // 车队点检查看图片
  teamTallyRepair: 1809,           // 车队点检报修

  /**排班管理**/
  workforceManageSearch: 1904,           // 排班管理查询
  workforceManageAdd: 1901,           // 排班管理新增
  workforceManageEdit: 1902,           // 排班管理编辑
  workforceManageDel: 1903,           // 排班管理删除
  workforceManageDetail: 1905,           // 排班管理详情
  workforceManageExport: 1906,           // 排班管理导出
  workforceManageWorkload: 1907,           // 排班管理报工作量

  /**倒运任务**/
  workloadSearch: 2101,           // 倒运任务查询
  workloadDetail: 2102,           // 倒运任务详情
  workloadExport: 2103,           // 倒运任务导出

  /**加油记录**/
  refuelRecordSearch: 2201,           // 加油记录查询
  refuelRecordDetail: 2202,           // 加油记录详情
  refuelRecordExport: 2203,           // 加油记录导出

  /**加油卡管理**/
  refuelCardManageSearch: 3504,         // 加油卡管理查询
  refuelCardManageEdit: 3502,           // 加油卡管理编辑
  refuelCardManageDel: 3503,           // 加油卡管理删除
  refuelCardManageExport: 3505,         // 加油卡管理导出
  refuelCardManageAdd: 3501,           // 加油卡管理新增
  refuelCardManageDetail: 3506,         // 加油卡管理详情

  /**保养提醒**/
  maintenanceNoticeSearch: 3601,           // 保养提醒查询
  maintenanceNoticeDetail: 3603,           // 保养提醒详情
  maintenanceNoticeExport: 3602,           // 保养提醒导出

  /**保养记录**/
  maintenanceRecordSearch: 3704,           // 保养记录查询
  maintenanceRecordAdd: 3701,           // 保养记录新增
  maintenanceRecordEdit: 3702,           // 保养记录编辑
  maintenanceRecordDel: 3703,           // 保养记录删除
  maintenanceRecordExport: 3705,           // 保养记录导出
  maintenanceRecordDetail: 3706,           // 保养记录详情
  maintenanceRecordFeedback: 3707,           // 保养记录反馈
  maintenanceRecordNotFeedback: 3708,           // 保养记录未反馈

  /**保养反馈**/
  maintenanceFeedbackSearch: 3804,           // 保养反馈查询
  maintenanceFeedbackAdd: 3801,           // 保养反馈新增
  maintenanceFeedbackEdit: 3802,           // 保养反馈编辑
  maintenanceFeedbackDel: 3803,           // 保养反馈删除
  maintenanceFeedbackExport: 3805,           // 保养反馈导出
  maintenanceFeedbackDetail: 3806,           // 保养反馈详情

  /**保养策略**/
  maintenanceStrategySearch: 3904,           // 保养策略查询
  maintenanceStrategyAdd: 3901,           // 保养策略新增
  maintenanceStrategyEdit: 3902,           // 保养策略编辑
  maintenanceStrategyDel: 3903,           // 保养策略删除
  maintenanceStrategyExport: 3905,           // 保养策略导出
  maintenanceStrategyDetail: 3906,           // 保养策略详情

  /**维修记录**/
  vindicateRecordVindicate: 4101,           // 维修记录维修
  vindicateRecordEdit: 4102,           // 维修记录编辑
  vindicateRecordDel: 4103,           // 维修记录删除
  vindicateRecordSearch: 4104,           // 维修记录查询
  vindicateRecordExport: 4105,           // 维修记录导出
  vindicateRecordDetail: 4106,           // 维修记录详情
  vindicateRecordWaitMat: 4107,           // 维修记录待料
  vindicateRecordSendOrder: 4108,           // 维修记录指派
  vindicateRecordQC: 4109,           // 维修记录质检
  vindicateRecordArrive: 4110,           // 维修记录到料
  vindicateRecordWithdraw: 4111,           // 维修记录撤回
  vindicateRecordFeedback: 4112,           // 维修记录反馈
  vindicateRecordReply: 4113,           // 维修记录反馈回复
  vindicateRecordSubmit: 4114,           // 维修记录提报计划
  vindicateRecordAccept: 4115,           // 维修记录接收计划

  /**工时定额表**/
  timeScheduleSearch: 4204,           // 工时定额表查询
  timeScheduleAdd: 4201,           // 工时定额表新增
  timeScheduleEdit: 4202,           // 工时定额表编辑
  timeScheduleDel: 4203,           // 工时定额表删除
  timeScheduleExport: 4205,           // 工时定额表导出
  timeScheduleDetail: 4206,           // 工时定额表详情

  /**维修资料库**/
  vindicateDatabaseSearch: 4304,           // 维修资料库查询
  vindicateDatabaseAdd: 4301,           // 维修资料库新增
  vindicateDatabaseEdit: 4302,           // 维修资料库编辑
  vindicateDatabaseDel: 4303,           // 维修资料库删除
  vindicateDatabaseExport: 4305,           // 维修资料库导出
  vindicateDatabaseDetail: 4306,           // 维修资料库详情

  /**故障类型**/
  vindicateInspectSearch: 4404,           // 故障类型查询
  vindicateInspectAdd: 4401,           // 故障类型新增
  vindicateInspectEdit: 4402,           // 故障类型编辑
  vindicateInspectDel: 4403,           // 故障类型库删除
  vindicateInspectExport: 4405,           // 故障类型导出
  vindicateInspectDetail: 4406,           // 故障类型详情

  /**备件查询**/
  spareQuerySearch: 4501,           // 备件查询查询
  spareQueryDetail: 4502,           // 备件查询详情
  spareQueryExport: 4503,           // 备件查询导出
  spareQueryAdd: 4504,           // 备件查询新增
  spareQueryEdit: 4505,           // 备件查询编辑
  spareQueryDel: 4506,           // 备件查询删除

  /**行车路线**/
  driveCircuitSearch: 4604,           // 行车路线查询
  driveCircuitAdd: 4601,           // 行车路线新增
  driveCircuitEdit: 4602,           // 行车路线编辑
  driveCircuitDel: 4603,           // 行车路线删除
  driveCircuitDetail: 4605,           // 行车路线详情

  /**电子围栏**/
  fenceSearch: 4704,           // 电子围栏查询
  fenceAdd: 4701,           // 电子围栏新增
  fenceEdit: 4702,           // 电子围栏编辑
  fenceDel: 4703,           // 电子围栏删除
  fenceDetail: 4705,           // 电子围栏详情

  /**报警策略**/
  alarmStrategySearch: 4804,           // 报警策略查询
  alarmStrategyAdd: 4801,           // 报警策略新增
  alarmStrategyEdit: 4802,           // 报警策略编辑
  alarmStrategyDel: 4803,           // 报警策略删除
  alarmStrategyDetail: 4805,           // 报警策略详情

  /**车辆型号**/
  modelManageSearch: 4904,           // 车辆型号查询
  modelManageAdd: 4901,           // 车辆型号新增
  modelManageEdit: 4902,           // 车辆型号编辑
  modelManageDel: 4903,           // 车辆型号删除
  modelManageExport: 4905,           // 车辆型号导出
  modelManageDetail: 4906,           // 车辆型号详情

  /**车辆管理**/
  vehicleManageSearch: 5104,           // 车辆管理查询
  vehicleManageAdd: 5101,           // 车辆管理新增
  vehicleManageEdit: 5102,           // 车辆管理编辑
  vehicleManageDel: 5103,           // 车辆管理删除
  vehicleManageExport: 5105,           // 车辆管理导出
  vehicleManageDetail: 5106,           // 车辆管理详情

  /**终端管理**/
  teminalManageSearch: 5204,           // 终端管理查询
  teminalManageAdd: 5201,           // 终端管理新增
  teminalManageEdit: 5202,           // 终端管理编辑
  teminalManageDel: 5203,           // 终端管理删除
  teminalManageExport: 5205,           // 终端管理导出
  teminalManageDetail: 5206,           // 终端管理详情

  /**班组管理**/
  teamManageSearch: 5304,           // 班组管理查询
  teamManageAdd: 5301,           // 班组管理新增
  teamManageEdit: 5302,           // 班组管理编辑
  teamManageDel: 5303,           // 班组管理删除
  teamManageExport: 5305,           // 班组管理导出
  teamManageDetail: 5306,           // 班组管理详情

  /**人员管理**/
  peoManageSearch: 5404,           // 人员管理查询
  peoManageAdd: 5401,           // 人员管理新增
  peoManageEdit: 5402,           // 人员管理编辑
  peoManageDel: 5403,           // 人员管理删除
  peoManageExport: 5405,           // 人员管理导出
  peoManageDetail: 5406,           // 人员管理详情

  /**车辆运行情况统计**/
  operateStatistSearch: 5504,           // 人员管理查询
  operateStatistAdd: 5501,           // 人员管理新增
  operateStatistEdit: 5502,           // 人员管理编辑
  operateStatistDel: 5503,           // 人员管理删除

  /**停车点**/
  parkingSpotAdd: 5601,           // 停车点新增
  parkingSpotEdit: 5602,           // 停车点编辑
  parkingSpotDel: 5603,           // 停车点删除
  parkingSpotSearch: 5604,           // 停车点查询
  parkingSpotDetail: 5605,           // 停车点详情

  /**车辆类型**/
  typeManageAdd: 5601,           // 车辆类型新增
  typeManageEdit: 5602,           // 车辆类型编辑
  typeManageDel: 5603,           // 车辆类型删除
};

