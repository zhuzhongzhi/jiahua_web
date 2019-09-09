import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlarmSetRoutingModule } from './alarm-set-routing.module';
import { DriveCircuitComponent } from './drive-circuit/drive-circuit.component';
import { FenceManageComponent } from './fence-manage/fence-manage.component';
import { AlarmStrategyComponent } from './alarm-strategy/alarm-strategy.component';
import {ViewsCommonModules} from '../views-common-modules';
import { ParkingSpotComponent } from './parking-spot/parking-spot.component';

@NgModule({
  imports: [
    CommonModule,
    ...ViewsCommonModules,
    AlarmSetRoutingModule
  ],
  declarations: [
    DriveCircuitComponent,
    FenceManageComponent,
    AlarmStrategyComponent,
    ParkingSpotComponent
  ]
})
export class AlarmSetModule { }
