/*****
 生产环境配置
 生产环境构建命令(以下命令等效)：
 ng build --target=production --environment=prod
 ng build --prod --env=prod
 ng build --prod
 ****/


// 线上内网环境
// export const webServerUrl = `${window.location.protocol}//${window.location.hostname}`;
// export const webSocketUrl = `${window.location.protocol}//${window.location.hostname}:9098`;
export const webServerUrl = window.location.origin + '/site';
export const webSocketUrl = 'http://192.168.1.103:19001';

export const gatewayKey = {
  Ius: 'ius',
  /**
   * 基础服务
   */
  Bs: 'bs',
  Auth: 'auth',
  Iot: 'iot',
  Gen: 'gen'
};

export const environment = {
  production: true,
  baseUrl: {
    ius: `${webServerUrl}/ius`,
    bs: `${webServerUrl}/iot`,
    auth: `${webServerUrl}/fast-auth-server`,
    iot: `${webServerUrl}/iot-server`,
    gen: `${webServerUrl}/fast-gen-service`
  },
  otherData: {
    sysRole: 0,
    sysSite: '1',
    defaultPath: '',
    alarmRefreshTime: 600000, // 10分钟刷新一次
    imgUploadSize: 4194304, // 4*1024*1024
  }
};
