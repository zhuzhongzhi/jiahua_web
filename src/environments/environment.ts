/*****
 开发环境配置
 开发构建命令(以下命令等效)：
 ng build --target=development --environment=dev
 ng build --dev --e=dev
 ng build --dev
 ng build
 ****/
// export const webServerUrl = 'http://192.168.1.103:19001';
export const webServerUrl = window.location.origin + '/site';
export const webSocketUrl = 'http://192.168.1.103:19001';
// export const webSocketUrl = 'http://10.90.1.226:9098';
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
  production: false,
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
