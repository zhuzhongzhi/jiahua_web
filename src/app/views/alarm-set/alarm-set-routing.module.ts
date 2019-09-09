import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DriveCircuitComponent} from './drive-circuit/drive-circuit.component';
import {FenceManageComponent} from './fence-manage/fence-manage.component';
import {AlarmStrategyComponent} from './alarm-strategy/alarm-strategy.component';
import {ParkingSpotComponent} from './parking-spot/parking-spot.component';

const routes: Routes = [
  {path: '', redirectTo: 'driveCircuit', pathMatch: 'full'},
  {path: 'driveCircuit', component: DriveCircuitComponent},
  {path: 'fenceManage', component: FenceManageComponent},
  {path: 'alarmStrategy', component: AlarmStrategyComponent},
  {path: 'parkingSpot', component: ParkingSpotComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlarmSetRoutingModule { }
