import {Injectable, Injector} from '@angular/core';
import {DatePipe} from '@angular/common';


export namespace UfastUtilServiceNs {
  export class UfastUtilServiceClass {
    private localStorge: any;
    private datePipe: DatePipe;

    constructor(injector: Injector) {
      this.localStorge = window.localStorage;
      this.datePipe = new DatePipe('en-US');
    }

    /**
     * @formatDate:格式化日期
     * @value:需要格式化的时间戳或日期
     * @type:格式化的类型（同angular内置日期管道）
     * **/
    public formatDate(value: any, type: string = 'yyyy-MM-dd') {
      return this.datePipe.transform(value, type);
    }

    /**
     * 格式化时间 yyyy-MM-dd HH:mm:ss
     */
    public formatTime(date: Date) {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      return year + '-' + this.formatTen(month) + '-' + this.formatTen(day) + ' '
        + this.formatTen(hours) + ':' + this.formatTen(minutes) + ':' + this.formatTen(seconds);
    }

    formatTen(num) {
      return num > 9 ? (num + '') : ('0' + num);
    }

    // 除法
    public div(arg1, arg2): number {
      let t1 = 0, t2 = 0, r1, r2;
      try {
        t1 = arg1.toString().split('.')[1].length;
      } catch (e) {
      }
      try {
        t2 = arg2.toString().split('.')[1].length;
      } catch (e) {
      }

      r1 = Number((arg1 + '').replace('.', ''));
      r2 = Number((arg2 + '').replace('.', ''));
      return this.mul((r1 / r2), Math.pow(10, t2 - t1));

    }

    // 乘法
    public mul(arg1, arg2): number {
      let m = 0;
      const s1 = arg1.toString(), s2 = arg2.toString();
      try {
        m += s1.split('.')[1].length;
      } catch (e) {
      }
      try {
        m += s2.split('.')[1].length;
      } catch (e) {
      }
      return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m);
    }

    // 加法
    public add(arg1, arg2): number {
      let r1, r2, m;
      try {
        r1 = arg1.toString().split('.')[1].length;
      } catch (e) {
        r1 = 0;
      }
      try {
        r2 = arg2.toString().split('.')[1].length;
      } catch (e) {
        r2 = 0;
      }
      m = Math.pow(10, Math.max(r1, r2));
      return (this.mul(arg1, m) + this.mul(arg2, m)) / m;
    }

    // 减法
    public sub(arg1, arg2): number {
      let r1, r2, m, n;
      try {
        r1 = arg1.toString().split('.')[1].length;
      } catch (e) {
        r1 = 0;
      }
      try {
        r2 = arg2.toString().split('.')[1].length;
      } catch (e) {
        r2 = 0;
      }
      m = Math.pow(10, Math.max(r1, r2));
      n = (r1 >= r2) ? r1 : r2;
      return parseFloat(((this.mul(arg1, m) - this.mul(arg2, m)) / m).toFixed(n));
    }

    /**
     * @getStartDate:获取开始日期（某一天的00：00：00）
     * @dateValue:标准格式的日期字符串或时间戳
     * @返回值：日期对象
     * **/
    public getStartDate(dateValue: string | number): Date {
      const date = new Date(dateValue.toString());
      const millSec = date.getTime() - date.getHours() * 3600 * 1000 -
        date.getMinutes() * 60 * 1000 - date.getSeconds() * 1000 - date.getMilliseconds();
      return new Date(millSec);
    }

    /**
     * @getEndDate:获取开始日期（某一天的最后1毫秒）
     * @dateValue:标准格式的日期字符串或时间戳
     * @返回值：日期对象
     * **/
    public getEndDate(dateValue: string | number): Date {
      const time = this.getStartDate(dateValue).getTime() + 24 * 3600 * 1000 - 1;
      return new Date(time);
    }

    /**
     * localStorge接口封装
     * **/

    /**
     * 存储数据
     * @key:键
     * @data:任意类型的值
     * **/
    public setLocalData(key: string, data: any): void {
      this.localStorge.setItem(key, JSON.stringify(data));
    }

    /**
     * 获取数据
     * @key：键
     * @返回值：获取的数据
     * **/
    public getLocalData(key: string) {
      return JSON.parse(this.localStorge.getItem(key));
    }

    /**
     * 删除指定key对应的数据
     * **/
    public removeLocalData(key: string) {
      this.localStorge.removeItem(key);
    }

    /**
     * 清空本地存储
     * **/
    public clearLocalData(): void {
      this.localStorge.clear();
    }

    /**
     * 转换秒到时分秒
     *
     */
    public convertSecond(value): string {
      let theTime = 0;
      if (value !== undefined && value != null) {
        theTime = parseInt(value, 10);
      }
      // 如果时间为负数，返回值为空字符串
      if (value < 0) {
        return '';
      }
      let middle = 0;
      let hour = 0;

      if (theTime > 60) {
        middle = Math.floor(theTime / 60);
        theTime = theTime % 60;
        if (middle > 60) {
          hour = Math.floor(middle / 60);
          middle = middle % 60;
        }
      }
      let result = '' + theTime + '秒';
      if (middle > 0) {
        result = '' + middle + '分' + result;
      }
      if (hour > 0) {
        result = '' + hour + '小时' + result;
      }
      return result;
    }

    /**
     *  格式化日期
     * @param date
     */
    formatToDate(date): string {
      if (!date) {
        return null;
      }
      if (typeof date === 'string') {
        date = new Date(date);
      }
      let month = date.getMonth() + 1;
      month = month < 10 ? '0' + month : month;
      let day = date.getDate();
      day = day < 10 ? '0' + day : day;
      return date.getFullYear() + '-' + month + '-' + day;
    }

  }

}


@Injectable()
export class UfastUtilService extends UfastUtilServiceNs.UfastUtilServiceClass {

  constructor(injector: Injector) {
    super(injector);
  }

}
