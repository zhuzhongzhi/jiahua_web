import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HotreelManageComponent} from './hotreel-manage/hotreel-manage.component';
import { DanniManageComponent } from './danni-manage/danni-manage.component';
import { ShakesockManageComponent } from './shakesock-manage/shakesock-manage.component';
import { AdjustcolorManageComponent } from './adjustcolor-manage/adjustcolor-manage.component';
import { CheckManageComponent } from './check-manage/check-manage.component';
import { PackManageComponent } from './pack-manage/pack-manage.component';
import { AlarmManageComponent } from './alarm-manage/alarm-manage.component';
import { IngotalarmManageComponent } from './ingotalarm-manage/ingotalarm-manage.component';
import { LinealarmManageComponent } from './linealarm-manage/linealarm-manage.component';
import { StayalarmManageComponent } from './stayalarm-manage/stayalarm-manage.component';
import { OutputStatisticComponent } from './output-statistic/output-statistic.component';
import { DaliyqualityStatisticComponent } from './daliyquality-statistic/daliyquality-statistic.component';
import { MonthqualityStatisticComponent } from './monthquality-statistic/monthquality-statistic.component';
import { YearqualityStatisticComponent } from './yearquality-statistic/yearquality-statistic.component';
import { ProduceBillboardComponent } from './produce-billboard/produce-billboard.component';
import { QualityBillboardComponent } from './quality-billboard/quality-billboard.component';

const routes: Routes = [
  {path: '', redirectTo: 'hotreelManage', pathMatch: 'full'},
  {path: 'hotreelManage', component: HotreelManageComponent},
  {path: 'danniManage', component: DanniManageComponent},
  {path: 'socksManage', component: ShakesockManageComponent},
  {path: 'adjustManage', component: AdjustcolorManageComponent},
  {path: 'checkManage', component: CheckManageComponent},
  {path: 'packManage', component: PackManageComponent},
  {path: 'alarmLog', component: AlarmManageComponent},
  {path: 'ingotAlarm', component: IngotalarmManageComponent},
  {path: 'wiringAlarm', component: LinealarmManageComponent},
  {path: 'stayAlarm', component: StayalarmManageComponent},
  {path: 'outputStatistic', component: OutputStatisticComponent},
  {path: 'dailyQuality', component: DaliyqualityStatisticComponent},
  {path: 'monthQuality', component: MonthqualityStatisticComponent},
  {path: 'yearQuality', component: YearqualityStatisticComponent},
  {path: 'produceBillboard', component: ProduceBillboardComponent},
  {path: 'qualityBillboard', component: QualityBillboardComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProduceManageRoutingModule {
}
