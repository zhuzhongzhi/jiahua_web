import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { ShowMessageService } from '../../../widget/show-message/show-message';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CompanyService, CompanyServiceNs } from '../../../core/biz-services/company/company.service';
import { AreaManageService } from '../../../core/biz-services/sysManage/area-manage.service';
import {ActionCode} from '../../../../environments/actionCode';

@Component({
  selector: 'app-org-manage',
  templateUrl: './org-manage.component.html',
  styleUrls: ['./org-manage.component.scss']
})
export class OrgManageComponent implements OnInit {
  // 页面名称
  pageName = '机构';
  ActionCode = ActionCode;
  // 查询条件
  filters: any;
  // table控件配置
  tableConfig: any;
  // 弹窗表单
  validateForm: FormGroup;

  // 表格类
  isAllChecked = false;
  // table绑定数据
  listOfAllData = [];
  // table已勾选的复选框id
  checkedId: { [key: string]: boolean } = {};

  // 弹框类
  detailModal = {
    show: false,
    loading: false,
    title: '',
    showContinue: false,
    showSaveBtn: false
  };
  // 是否连续添加
  isContinue = false;
  // 是否新增
  isAdd = false;
  // 是否只读
  isReadonly = false;
  // 是否顶层机构
  isBaseOrg = false;
  // 默认展开节点key列表
  defaultExpendKeys = [];
  // 排序字段
  sortVal = 'org_code asc';

  // 机构列表Tree结构数据
  orgs = [];
  // 省市区下拉列表
  provinceList = [];
  cityList = [];
  countyList = [];
  selOrgData: any ;
  constructor(
    private fb: FormBuilder,
    private modal: NzModalService,
    private messageService: ShowMessageService,
    private companyService: CompanyService,
    private areaManageService: AreaManageService
  ) {
    this.filters = {
      orgName: null
    };
    this.tableConfig = {
      showCheckBox: true,
      allChecked: false,
      pageSize: 20,
      pageNum: 1,
      total: 0,
      loading: false
    };
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      orgId: [null],                                                           // id
      orgName: [null, [Validators.required, Validators.maxLength(50)]],        // 机构名称
      orgCode: [null, [Validators.required, Validators.maxLength(20)]],        // 机构编号
      pId: [null, [Validators.required]],                                      // 所属机构id
      provinceId: [null],                                                      // 省id
      cityId: [null],                                                          // 市id
      countyId: [null],                                                        // 区id
      areaName: [null],                                                        // 省市区名称
      address: [null, [Validators.maxLength(64)]],                             // 详细地址
      principal: [null, [Validators.maxLength(255)]],                          // 联系人
      tel: [null, [Validators.maxLength(64)]],                                 // 联系电话
      remark: [null, [Validators.maxLength(255)]],                             // 备注
    });
    this.searchData();
    this.initList();
  }

  /**
   * 初始化数据
   */
  initList() {
    // 机构Tree结构列表查询
    const filter = {
      filters: {}
    };
    this.companyService.getCompanyTreeList(filter).subscribe((resData: CompanyServiceNs.UfastHttpAnyResModel) => {
      if (resData.code !== 0) {
        return;
      }
      this.orgs = resData.value;
      this.defaultExpendKeys = ['1'];
    }, (error: any) => {
    });
  }

  /**
   * 列表查询
   * @param reset 是否重置(重置需要更改pageNum)
   */
  searchData(reset: boolean = false) {
    if (reset) {
      this.tableConfig.pageNum = 1;
    }
    const filter = {
      pageNum: this.tableConfig.pageNum,
      pageSize: this.tableConfig.pageSize,
      sort: this.sortVal,
      filters: this.filters
    };
    this.tableConfig.loading = true;
    this.companyService.getCompanyList(filter).subscribe((resData: CompanyServiceNs.UfastHttpAnyResModel) => {
      if (resData.code !== 0) {
        this.tableConfig.loading = false;
        this.messageService.showAlertMessage('', resData.message, 'warning');
        return;
      }
      this.checkedId = {};
      this.listOfAllData = resData.value.list;
      this.tableConfig.total = resData.value.total;
      this.tableConfig.loading = false;
    }, (error: any) => {
      this.tableConfig.loading = false;
      this.messageService.showAlertMessage('', error.message, 'error');
    });
  }

  // 排序
  sort(sort: {key: string; value: string}): void {
    const sortName = sort.key;
    const sortValue = sort.value;
    let param = '';
    if (sortName && sortValue) {
      param = `${sortName} ${sortValue.replace('end', '')}`;
    }
    if (param === '') {
      param = 'org_code asc';
    }
    this.sortVal = param;
    this.checkedId = {};
    this.isAllChecked = false;
    this.searchData(true);
  }

  /**
   * 重置
   */
  resetSearchInfo() {
    this.filters = {
      orgName: null
    };
    this.tableConfig.pageNum = 1;
    this.checkedId = {};
    this.isAllChecked = false;
    this.searchData();
  }
  // 表格页码、页数改变时
  pageChange(reset: boolean = false): void {
    if (reset) {
      this.tableConfig.pageNum = 1;
    }
    this.checkedId = {};
    this.isAllChecked = false;
    this.searchData();
  }

  checkAll(value: boolean): void {
    this.listOfAllData.forEach(item => {
      if (item.pId !== '-1') {
        this.checkedId[item.orgId] = value;
      }
    });
  }

  refreshStatus(): void {
    this.isAllChecked = this.listOfAllData.filter(item => item.pId !== '-1').every(item => this.checkedId[item.orgId]);
  }

  /**
   * 查询地区列表
   * @param type 地区类型
   * @param value 上级地区编码
   */
  getAreaList(type: string, value: string) {
    if (value === null) {
      return;
    }
    const filter = {
      pcode: value
    };
    this.areaManageService.getAreaList(filter).subscribe((resData: CompanyServiceNs.UfastHttpAnyResModel) => {
      if (resData.code !== 0) {
        this.messageService.showAlertMessage('', resData.message, 'warning');
        return;
      }
      if (type === 'province') {
        this.provinceList = resData.value;
      } else if (type === 'city') {
        this.cityList = resData.value;
      } else if (type === 'county') {
        this.countyList = resData.value;
      }
    }, (error: any) => {
      this.messageService.showAlertMessage('', error.message, 'error');
    });
  }

  /**
   * 省列表change事件
   */
  provinceChange(value) {
    this.getAreaList('city', value);
    this.validateForm.controls['cityId'].reset();
    this.validateForm.controls['countyId'].reset();
  }

  /**
   * 市列表change事件
   */
  cityChange(value) {
    this.getAreaList('county', value);
    this.validateForm.controls['countyId'].reset();
  }

  /**
   * 新增
   */
  addInfo(): void {
    this.isAdd = true;
    this.isBaseOrg = false;
    if (this.provinceList.length === 0) {
      this.getAreaList('province', '0');
    }
    this.isReadonly = false;
    this.isContinue = false;
    this.detailModal.title = `新增${this.pageName}信息`;
    this.detailModal.showContinue = true;
    this.detailModal.showSaveBtn = true;
    this.showDetailModal({});
  }

  /**
   * 编辑
   */
  editInfo(data?: any): void {
    this.isAdd = false;
    this.isBaseOrg = data.pId === '-1';  // 是否顶层机构
    if (this.provinceList.length === 0) {
      this.getAreaList('province', '0');
    }
    this.isReadonly = false;
    this.detailModal.title = `编辑${this.pageName}信息`;
    this.isContinue = false;
    this.detailModal.showContinue = false;
    this.detailModal.showSaveBtn = true;
    this.showDetailModal(data);
  }

  /**
   * 查看详情
   */
  viewInfo(data?: any): void {
    this.isAdd = false;
    this.isBaseOrg = data.pId === '-1';  // 是否顶层机构
    if (this.provinceList.length === 0) {
      this.getAreaList('province', '0');
    }
    this.isReadonly = true;
    this.detailModal.title = `查看${this.pageName}信息`;
    this.isContinue = false;
    this.detailModal.showContinue = false;
    this.detailModal.showSaveBtn = false;
    this.showDetailModal(data);
  }

  /**
   * 显示弹窗
   */
  showDetailModal(data: any): void {
    const controls = this.validateForm.controls;
    for (const key in controls) {
      if (controls.hasOwnProperty(key)) {
        controls[key].markAsPristine();
        controls[key].updateValueAndValidity();
      }
    }
    if (this.isAdd) {
      this.validateForm.reset();
      this.detailModal.show = true;
      return;
    }
    this.selOrgData = data;
    this.validateForm.controls['orgId'].setValue(data.orgId);
    this.validateForm.controls['orgName'].setValue(data.orgName);
    this.validateForm.controls['orgCode'].setValue(data.orgCode);
    this.validateForm.controls['pId'].setValue(data.pId);
    this.validateForm.controls['provinceId'].setValue(data.provinceId);
    this.validateForm.controls['cityId'].setValue(data.cityId);
    this.validateForm.controls['countyId'].setValue(data.countyId);
    this.validateForm.controls['areaName'].setValue(data.areaName);
    this.validateForm.controls['address'].setValue(data.address);
    this.validateForm.controls['principal'].setValue(data.principal);
    this.validateForm.controls['tel'].setValue(data.tel);
    this.validateForm.controls['remark'].setValue(data.remark);
    this.detailModal.show = true;
  }

  /**
   * 保存弹框
   */
  handleDetailSave() {
    const controls = this.validateForm.controls;
    for (const key in controls) {
      if (controls.hasOwnProperty(key)) {
        controls[key].markAsDirty();
        controls[key].updateValueAndValidity();
      }
    }
    if (this.validateForm.invalid) {
      return;
    }
    this.detailModal.loading = true;
    let areaName = '';
    if (this.validateForm.controls['provinceId'].value != null) {
      const province = this.provinceList.filter(item => item.code === this.validateForm.controls['provinceId'].value);
      if (province.length > 0) {
        areaName += province[0].name;
      }
    }
    if (this.validateForm.controls['cityId'].value != null) {
      const city = this.cityList.filter(item => item.code === this.validateForm.controls['cityId'].value);
      if (city.length > 0) {
        areaName += city[0].name;
      }
    }
    if (this.validateForm.controls['countyId'].value != null) {
      const county = this.countyList.filter(item => item.code === this.validateForm.controls['countyId'].value);
      if (county.length > 0) {
        areaName += county[0].name;
      }
    }
    this.validateForm.controls['areaName'].setValue(areaName);
    if (this.validateForm.controls['pId'].value == null) {
      this.validateForm.controls['pId'].setValue('-1');
    }
    let observer: any = null;
    if (this.isAdd) {
      observer = this.companyService.submitCompanyInfo(this.validateForm.value);
    } else {
      observer = this.companyService.updateCompanyInfo(this.validateForm.value);
    }
    observer.subscribe((resData: CompanyServiceNs.UfastHttpAnyResModel) => {
      if (resData.code !== 0) {
        this.detailModal.loading = false;
        this.messageService.showAlertMessage('', resData.message, 'warning');
        return;
      }
      // 连续添加
      if (this.isContinue) {
        this.validateForm.reset();
      } else {
        this.detailModal.show = false;
        this.searchData();
      }
      this.detailModal.loading = false;
      this.messageService.showToastMessage('操作成功', 'success');
    }, (error: any) => {
      this.detailModal.loading = false;
      this.messageService.showAlertMessage('', error.message, 'error');
    });
  }

  /**
   * 取消弹框
   */
  handleDetailCancel() {
    this.detailModal.show = false;
  }

  // 删除弹框
  delModal() {
    const hasChecked = this.listOfAllData.some(item => this.checkedId[item.orgId]);
    if (!hasChecked) {
      this.messageService.showToastMessage('您还没有选择要删除的信息', 'warning');
      return;
    }
    this.modal.confirm({
      nzTitle: `您确定要删除选中的${this.pageName}信息吗？`,
      nzOnOk: () => {
        const ids = [];
        for (const key in this.checkedId) {
          if (this.checkedId[key]) {
            ids.push(key);
          }
        }
        this.tableConfig.loading = true;
        this.companyService.deleteMultiCompany(ids).subscribe((resData: CompanyServiceNs.UfastHttpAnyResModel) => {
          if (resData.code !== 0) {
            this.tableConfig.loading = false;
            this.messageService.showAlertMessage('', resData.message, 'warning');
            return;
          }
          this.messageService.showToastMessage('操作成功', 'success');
          this.tableConfig.loading = false;
          this.checkedId = {};
          this.isAllChecked = false;
          this.searchData();
        }, (error: any) => {
          this.tableConfig.loading = false;
          this.messageService.showAlertMessage('', error.message, 'error');
        });
      }
    });
  }

  getFormControl(name: string) {
    return this.validateForm.controls[name];
  }

}
