export default (app) => [
  {
    label: '文件',
    submenu: [
      {
        label: '重启',
        role: 'forceReload'
      },
      {
        label: '退出',
        role: 'quit'
      }
    ]
  }
]