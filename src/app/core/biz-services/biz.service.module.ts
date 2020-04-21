import {SupplierInfoNs, SupplierInfoService} from './menu/supplier-info.service';
import {WorkBoardService, WorkBoardServiceNs} from './work-board/work-board.service';
import {CompanyService, CompanyServiceNs} from './company/company.service';
import {LocationService, LocationServiceNs, LocationUtilService, VehicleScreenService} from './location/location-service.service';
import {TerminalService, TerminalServiceNs} from './resource/terminal.service';
import {TeamManageService} from './resource/team-manage.service';
import {CehicleListService, CehicleListServiceNs} from './vehicleMonitor/cehicle-list.service';
import {WorkforceService, WorkforceServiceNs} from './dispatchManage/workforce.service';
import {PeoManageService} from './resource/peo-manage.service';
import {ModelManageService} from './resource/model-manage.service';
import {VehicleManageService} from './resource/vehicle-manage.service';
import {TeamTallyService, TeamTallyServiceNs} from './dispatchManage/team-tally.service';
import {AlarmListService, AlarmListServiceNs} from './vehicleMonitor/alarm-list.service';
import {TypeManageService} from './resource/type-manage.service';
import {RefuelCardService, RefuelCardServiceNs} from './brownfields/refuel-card.service';
import {MaintenanceRecordService, MaintenanceRecordServiceNs} from './maintenance/maintenance-record.service';
import {VindicateRecordService, VindicateRecordServiceNs} from './vindicate/vindicate-record.service';
import {VindicateInspectService, VindicateInspectServiceNs} from './vindicate/vindicate-inspect.service';
import {DatabaseService, DatabaseServiceNs} from './vindicate/database.service';
import {TimeScheduleService, TimeScheduleServiceNs} from './vindicate/time-schedule.service';
import {UserManageService} from './sysManage/user-manage.service';
import {RoleManageService} from './sysManage/role-manage.service';
import {AreaManageService} from './sysManage/area-manage.service';
import {StrategyManageService} from './maintenance/strategy-manage.service';
import {DriveCircuitService, DriveCircuitServiceNs} from './alarmSet/drive-circuit.service';
import {MaintenanceNoticeService} from './maintenance/maintenance-notice.service';
import {FenceManangeService, FenceManangeServiceNs} from './alarmSet/fence-manage.service';
import {RefuelRecordService} from './brownfields/refuel-record.service';
import {ParkingSpotService, ParkingSpotServiceNs} from './alarmSet/parking-spot.service';
import {NoticeService, NoticeServiceNs} from './notice/notice.service';
import {LatheManageService, LatheManageServiceNs} from './latheManage/lathe-manage.service';
import {ProduceManageService, ProduceManageServiceNs} from './produceManage/produce-manage.service';
import {SpareQueryService, SpareQueryServiceNs} from './vindicate/spare-query.service';
import {StatisticsService} from './statisticsReport/statistics.service';
import {AlarmStrategyService, AlarmStrategyServiceNs} from './alarmSet/alarm-strategy.service';
import {DapingService, DapingServiceNs} from './daping/daping.service';
import {LineSpinService, LineSpinServiceNs} from './lineSpinService/LineSpinService';
import {SysLogService, SysLogServiceNs} from './sysManage/SysLogService';
import {IngotAlarmService, IngotAlarmServiceNs} from './produceManage/IngotAlarmService';

export {
  SupplierInfoNs,
  CompanyServiceNs,
  WorkBoardServiceNs,
  LocationServiceNs,
  CehicleListServiceNs,
  WorkforceServiceNs,
  TerminalServiceNs,
  TeamTallyServiceNs,
  RefuelCardServiceNs,
  MaintenanceRecordServiceNs,
  VindicateRecordServiceNs,
  VindicateInspectServiceNs,
  AlarmListServiceNs,
  DatabaseServiceNs,
  TimeScheduleServiceNs,
  DriveCircuitServiceNs,
  FenceManangeServiceNs,
  ParkingSpotServiceNs,
  NoticeServiceNs,
  SpareQueryServiceNs,
  AlarmStrategyServiceNs,
  DapingServiceNs,
  LatheManageServiceNs,
  ProduceManageServiceNs,
  LineSpinServiceNs,
  SysLogServiceNs,
  IngotAlarmServiceNs
};

/*export const BizSErviceNameSpaces = [
  SupplierInfoNs
];*/

export const BizServiceProvideres = [
  SupplierInfoService,
  CompanyService,
  WorkBoardService,
  LocationService,
  TypeManageService,
  TerminalService,
  TeamManageService,
  PeoManageService,
  ModelManageService,
  VehicleManageService,
  UserManageService,
  RoleManageService,
  AreaManageService,
  StrategyManageService,
  MaintenanceNoticeService,
  VehicleScreenService,
  LocationUtilService,
  TerminalService,
  CehicleListService,
  WorkforceService,
  TeamTallyService,
  RefuelCardService,
  RefuelRecordService,
  MaintenanceRecordService,
  VindicateRecordService,
  VindicateInspectService,
  AlarmListService,
  DatabaseService,
  TimeScheduleService,
  DriveCircuitService,
  FenceManangeService,
  ParkingSpotService,
  NoticeService,
  SpareQueryService,
  StatisticsService,
  AlarmStrategyService,
  DapingService,
  LatheManageService,
  ProduceManageService,
  LineSpinService,
  SysLogService,
  IngotAlarmService
];
