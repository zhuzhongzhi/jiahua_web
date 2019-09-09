/*
 * @Author: KingNa
 * @Date: 2017-09-27 17:57:38
 * @Last Modified by: KingNa
 * @Last Modified time: 2018-09-05 17:57:38
 * @Description:
 *      本地数据存储
 *      1、setLocalData : 存储数据，key:value   返回Promise
 *      2、getlocalData : 根据键值获取          返回Promise，数据类型Json
 *      3、getGenericityData : 根据键值获取     返回Promise， 数据类型T
 *      4、removeData : 根据键值删除数据
 *      5、clear : 清除session
 */

import { Injectable } from '@angular/core';
import {Observable, throwError} from 'rxjs';

@Injectable()
export class StorageProvider {
  public localStorage: any;

  constructor() {
    if (!localStorage) {
      throw new Error('Current browser does not support Local Storage');
    }
    this.localStorage = localStorage;
  }


  setItem(key: string, value: any): void {
    try {
      this.localStorage[key] = value;
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        throwError('超出本地存储限额!');
        // 如果历史信息不重要了，可清空后再设置
        this.handleQuotaExceededError();
        localStorage.setItem(key, value);
      }
    }
  }

  getItem(key: string): string {
    return this.localStorage[key] || false;
  }

  setObject(key: string, value: any): void {
    try {
      this.localStorage[key] = JSON.stringify(value);
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        throwError('超出本地存储限额!');
        // 如果历史信息不重要了，可清空后再设置
        this.handleQuotaExceededError();
        localStorage.setItem(key, value);
      } else {
      }
    }
  }

  getObject(key: string): any {
    return JSON.parse(this.localStorage[key] || 'null');
  }

  remove(key: string): any {
    this.localStorage.removeItem(key);
  }

  removeAll(): any {
    localStorage.clear();
  }

  handleQuotaExceededError() {
    const tokenInfo = this.getObject('token');
    this.removeAll();
    this.setObject('token', tokenInfo);
  }

}
