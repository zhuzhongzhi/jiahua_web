import { Directive, TemplateRef, ViewContainerRef, Input } from '@angular/core';
import {ScepterService, ScepterServiceNs} from '../core/common-services/scepter.service';
import {ShowMessageService} from '../widget/show-message/show-message';
import {StorageProvider} from '../core/common-services/storage';
@Directive({
  selector: '[appAuthBtu]'
})
export class AuthBtuDirective {
  @Input('appAuthBtu')
  set appAuthBtu(authId: string|number) {
    if (authId === 0) {
      this.show(true);
      return;
    }
    this.show(false);
    const rights = this.storage.getObject('rights');
    if (!rights || JSON.stringify(rights) === '{}') {
      this.saveRights(authId);
    } else {
      this.show(!!rights[authId]);
    }
  }
  constructor(private scepterService: ScepterService, private templateRef: TemplateRef<any>,
              private storage: StorageProvider,
              private messageService: ShowMessageService, private viewContainerRef: ViewContainerRef) {
  }
  private show(value: boolean) {
    if (value) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainerRef.clear();
    }
  }
  private saveRights(authId) {
    this.scepterService.getAuthCodes().subscribe((data: ScepterServiceNs.ScepterResModelT<ScepterServiceNs.AuthCodeObj>) => {
      if (data.code !== 0) {
        this.messageService.showAlertMessage('', data.message, 'error');
        return;
      }
      this.show(!!data.value[authId + '']);
      this.storage.setObject('rights', data.value);
    }, (error) => {
      this.messageService.showAlertMessage('', error.message, 'error');
    });
  }
}
