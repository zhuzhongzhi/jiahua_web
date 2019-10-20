import { Directive, TemplateRef, ViewContainerRef, Input } from '@angular/core';
import {ScepterService, ScepterServiceNs} from '../core/common-services/scepter.service';
import {ShowMessageService} from '../widget/show-message/show-message';
import {StorageProvider} from '../core/common-services/storage';
import {UserService} from '../core/common-services/user.service';
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
    let rights = this.storage.getObject('rights');
    if (rights === null) {
      this.userService.getLogin({}).subscribe((res) => {
        rights = res.value.jiahuaUserAuthList;
        if (!rights || JSON.stringify(rights) === '{}') {
          this.show(true);
        } else {
          rights.forEach(right => {
            if (right.authId === authId && right.status === 1) {
              this.show(true);
            }
          });
          this.show(false);
        }
      });
    }
    if (!rights || JSON.stringify(rights) === '{}') {
      this.show(true);
    } else {
      let isShow = false;
      console.log('start compare right');
      rights.forEach(right => {
        if (right.authId == authId && right.status === 1) {
          // this.show(true);
          isShow = true;
          return;
        }
      });
      this.show(isShow);
    }
    // if (!rights || JSON.stringify(rights) === '{}') {
    //   this.saveRights(authId);
    // } else {
    //   this.show(!!rights[authId]);
    // }
  }
  constructor(private scepterService: ScepterService, private templateRef: TemplateRef<any>,
              private storage: StorageProvider,
              private userService: UserService,
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
