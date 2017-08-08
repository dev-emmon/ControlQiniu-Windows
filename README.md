# 七牛云监控 - Windows

## 环境搭建
### 安装 nodejs
双击文件夹下 “node-v4.8.0-x86.msi” 文件安装

### 安装 ffmpeg
1. 复制文件夹下 “ffmpeg” 到 C:\Program Files 路径下
2. 右键“我的电脑”->属性->高级系统设置->环境变量->path(系统变量)
3. win7:    ;C:\Program Files\ffmpeg\bin
4. win10:   新建->C:\Program Files\ffmpeg\bin
**_注：_ 根据系统选择 3/4 步骤**

### 安装 nodejs 依赖
```bash
# --registry https://registry.npm.taobao.org install express
npm config set registry https://registry.npm.taobao.org
npm install request 
npm install node-cmd
```

## 设置
### 基本信息设置
```js
// 打开 constor_index.js
var devices = [
    'USB2.0 PC CAMERA'              // 设备列表 (设备名)
]
var form = {
    name: '测试实验室2号',            // 名称
    uuid: 'windows_00000001',         // 唯一 id
    type: '2'                         // 1 - 盒子，2 - 监控
};
```

### 进程保护
```bash
npm i pm2 -g
npm i pm2-windows-service -g
pm2-service-install -n Pm2Service
# （安装后在windows服务中多了一个 pm2_service 的服务）
# PM2_HOME : c:\Users\<username>\.pm2
# 卸载 pm2-service-uninstall
# 设置环境变量：PM2_SERVICE_SCRIPTS = PM2的配置文件
# windows服务中重新启动myservice服务
```

### 开机启动
1. 打开 C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Startup
2. 将文件夹下的 start.bat 复制到 步骤 1 中打开的文件夹
3. 打开 start.bat 文件，修改 contor_index.js 所在的路径
4. 将文件夹下的 contor_index.js 复制到桌面