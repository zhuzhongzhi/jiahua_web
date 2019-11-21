import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ViewsCommonModules} from '../views-common-modules';
import {ProduceManageRoutingModule} from './produce-manage-routing.module';
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
import { HistoryManageComponent } from './history-manage/history-manage.component';
import { StatisticAlarmComponent } from './statistic-alarm/statistic-alarm.component';


@NgModule({
  imports: [
    CommonModule,
    ...ViewsCommonModules,
    ProduceManageRoutingModule
  ],
  declarations: [
    HotreelManageComponent,
    DanniManageComponent,
    ShakesockManageComponent,
    AdjustcolorManageComponent,
    CheckManageComponent,
    PackManageComponent,
    AlarmManageComponent,
    IngotalarmManageComponent,
    LinealarmManageComponent,
    StayalarmManageComponent,
    OutputStatisticComponent,
    DaliyqualityStatisticComponent,
    MonthqualityStatisticComponent,
    YearqualityStatisticComponent,
    ProduceBillboardComponent,
    QualityBillboardComponent,
    HistoryManageComponent,
    StatisticAlarmComponent
  ]
})
export class ProduceManageModule {
}
