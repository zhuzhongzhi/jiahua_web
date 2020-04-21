import { Component, OnInit } from '@angular/core';
import {NzModalRef, NzMessageService, UploadFile} from 'ng-zorro-antd';
import {BaseConfirmModal} from '../base-confirm-modal';
import { environment } from '../../../environments/environment';
import { ShowMessageService } from '../show-message/show-message';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent extends BaseConfirmModal.BasicConfirmModalComponent<any> implements OnInit {
  uploadUrl: string;
  fileServiceUrl: string;
  fileList = [];
  previewImage = '';
  previewVisible = false;
  constructor(private modalRef: NzModalRef,
     private messageService: ShowMessageService,
     private nzMessageService: NzMessageService) {
    super();
    this.uploadUrl = environment.baseUrl.bs + '/SysObjectStorage/upload';
    this.fileServiceUrl = environment.baseUrl.bs + '/SysObjectStorage/read?fileId=';
   }

  ngOnInit() {
  }

  protected getCurrentValue() { // 模态返回值
    let objectStorageId = '';
    if ( this.fileList[0] &&  this.fileList[0].response) {
      objectStorageId = this.fileList[0].response.value;
    }
    return {objectStorageId};
  }

  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  }
  uploadFileChange($event) {
    console.log(this.fileList);
    if ($event.type === 'progress' || $event.type === 'start') {
      return;
    }
    if ($event.file.status === 'removed') {
      this.fileList.length--;
      return;
    }
    if (this.fileList[0].response.code !== 0) {
      this.messageService.showAlertMessage('', '附件上传失败', 'error');
      this.fileList = [];
      return;
    }
  }
  beforeUpload = (file: UploadFile): boolean => {
    if (file.size > environment.otherData.imgUploadSize) {
      this.messageService.showAlertMessage('', '上传的图片过大', 'error');
      return false;
    }
    if ( !/\.(jpg|png|jepg)$/.test(file.name)) {
      this.messageService.showAlertMessage('', '请上传图片', 'error');
      this.fileList = [];
      return false;
    }
  }
}
