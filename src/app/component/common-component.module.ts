import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DirectivesModule} from '../directives/directives.module';
import {OverlayModule} from '@angular/cdk/overlay';

import {UfastTableComponent} from './platform-common/ufast-table/ufast-table.component';
import {UfastTableNavComponent} from './platform-common/ufast-table-nav/ufast-table-nav.component';
import {UfastSelectComponent} from './platform-common/ufast-select/ufast-select.component';
import {ActionGroupComponent} from './platform-common/table-action/action-group.component';
import {ActionComponent} from './platform-common/table-action/action/action.component';
import {AreaSelectorComponent} from './platform-common/area-selector/area-selector.component';
import {RightSideBoxComponent} from './platform-common/right-side-box/right-side-box.component';
import {RightSideTableBoxComponent} from './platform-common/right-side-table-box/right-side-table-box.component';
import {InputTextComponent} from './form-common/input-text/input-text.component';
import {ActionButtonComponent} from './form-common/action-button/action-button.component';
import {SelectComponent} from './form-common/select/select.component';
import { AutoRefreshComponent } from './biz-common/auto-refresh/auto-refresh.component';
import { CehicleItemComponent } from './cehicle-item/cehicle-item.component';
import { CehicleModelComponent } from './cehicle-model/cehicle-model.component';
import {NgxEchartsModule} from 'ngx-echarts';
import { CehicleDetailModelComponent } from './cehicle-detail-model/cehicle-detail-model.component';
import { StepsComponent } from './steps/steps.component';
import { CehicleScreenItemComponent } from './cehicle-screen-item/cehicle-screen-item.component';
import {OrgVehTreeComponent} from './org-veh-tree/org-veh-tree.component';
import { MapDrawingModelComponent } from './map-drawing-model/map-drawing-model.component';
import { MapGoogleLocsComponent } from './map-google-locs/map-google-locs.component';
import { MapGaodeLocsComponent } from './map-gaode-locs/map-gaode-locs.component';
import { MapGoogleShowComponent } from './map-google-show/map-google-show.component';
import { MapGaodeShowComponent } from './map-gaode-show/map-gaode-show.component';
import { MapGaodeDrawDrivingComponent } from './map-gaode-draw-driving/map-gaode-draw-driving.component';
import { MapGaodeLocPlayComponent } from './map-gaode-loc-play/map-gaode-loc-play.component';
import { MapGoogleLocPlayComponent } from './map-google-loc-play/map-google-loc-play.component';
import { MapGoogleDrawingModelComponent } from './map-google-drawing-model/map-google-drawing-model.component';
import { MapGoogleDrawDrivingComponent } from './map-google-draw-driving/map-google-draw-driving.component';
import { LookImgComponent } from './look-img/look-img.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    FormsModule,
    DirectivesModule,
    OverlayModule,
    NgxEchartsModule
  ],
  declarations: [
    UfastTableComponent,
    UfastTableNavComponent,
    UfastSelectComponent,
    ActionGroupComponent,
    ActionComponent,
    AreaSelectorComponent,
    RightSideBoxComponent,
    RightSideTableBoxComponent,
    InputTextComponent,
    ActionButtonComponent,
    SelectComponent,
    AutoRefreshComponent,
    CehicleItemComponent,
    CehicleModelComponent,
    CehicleDetailModelComponent,
    StepsComponent,
    CehicleScreenItemComponent,
    OrgVehTreeComponent,
    MapDrawingModelComponent,
    MapGoogleLocsComponent,
    MapGaodeLocsComponent,
    MapGoogleShowComponent,
    MapGaodeShowComponent,
    MapGaodeDrawDrivingComponent,
    MapGaodeLocPlayComponent,
    MapGoogleLocPlayComponent,
    MapGoogleDrawingModelComponent,
    MapGoogleDrawDrivingComponent,
    LookImgComponent,
  ],
  entryComponents: [
    CehicleDetailModelComponent,
    LookImgComponent,
  ],
  exports: [
    UfastTableComponent,
    UfastTableNavComponent,
    UfastSelectComponent,
    ActionGroupComponent,
    ActionComponent,
    AreaSelectorComponent,
    RightSideBoxComponent,
    RightSideTableBoxComponent,
    InputTextComponent,
    ActionButtonComponent,
    SelectComponent,
    AutoRefreshComponent,
    CehicleItemComponent,
    CehicleModelComponent,
    CehicleDetailModelComponent,
    StepsComponent,
    CehicleScreenItemComponent,
    OrgVehTreeComponent,
    MapDrawingModelComponent,
    MapGoogleLocsComponent,
    MapGaodeLocsComponent,
    MapGoogleShowComponent,
    MapGaodeShowComponent,
    MapGaodeDrawDrivingComponent,
    MapGaodeLocPlayComponent,
    MapGoogleLocPlayComponent,
    MapGoogleDrawingModelComponent,
    MapGoogleDrawDrivingComponent,
    LookImgComponent,
  ],
})
export class CommonComponentModule { }
