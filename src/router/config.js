export default {
  patientMenu: [
    { key: '/app/dashboard/index', title: '首页', icon: 'desktop' },
    {
      key: '/app/ct-manager',
      title: '智能分析',
      icon: 'scan',
      subs: [
        { key: '/app/ct1-manager/index', title: '肺部传染病识别', icon: 'scan' },
        { key: '/app/ct-manager/index', title: '肺结核检测', icon: 'scan' },
      ]
    },
    {
      key: '/app/model-manager',
      title: '模型管理',
      icon: 'scan',
      subs: [
        { key: '/app/model-manager/index', title: '可用模型列表', icon: 'scan' },
        { key: '/app/replay-manager/index', title: '模型重训练', icon: 'scan' },
      ]
    },
    { key: '/app/log-manager/index', title: '日志管理', icon: 'file-text', },
    { key: '/app/personal-center/index', title: '个人中心', icon: 'user', },
  ],
  doctorMenu: [
    { key: '/app/dashboard/index', title: '首页', icon: 'desktop' },
    {
      key: '/app/ct-manager',
      title: '智能分析',
      icon: 'scan',
      subs: [
        { key: '/app/ct1-manager/index', title: '肺部传染病识别', icon: 'scan' },
        { key: '/app/ct-manager/index', title: '肺结核检测', icon: 'scan' },
      ]
    },
    {
      key: '/app/model-manager',
      title: '模型管理',
      icon: 'scan',
      subs: [
        { key: '/app/model-manager/index', title: '可用模型列表', icon: 'scan' },
        { key: '/app/replay-manager/index', title: '模型重训练', icon: 'scan' },
      ]
    },
    {
      key: '/app/user-manager',
      title: '用户管理',
      icon: 'user',
      subs: [
        { key: '/app/patient-manager/index', title: '病人管理', icon: 'user' },
      ]
    },
    { key: '/app/log-manager/index', title: '日志管理', icon: 'file-text', },
    { key: '/app/personal-center/index', title: '个人中心', icon: 'user', },
  ],
  adminMenu: [
    { key: '/app/dashboard/index', title: '首页', icon: 'desktop' },
    {
      key: '/app/ct-manager',
      title: '智能分析',
      icon: 'scan',
      subs: [
        { key: '/app/ct1-manager/index', title: '肺部传染病识别', icon: 'scan' },
        { key: '/app/ct-manager/index', title: '肺结核检测', icon: 'scan' },
      ]
    },
    {
      key: '/app/model-manager',
      title: '模型管理',
      icon: 'scan',
      subs: [
        { key: '/app/model-manager/index', title: '可用模型列表', icon: 'scan' },
        { key: '/app/replay-manager/index', title: '模型重训练', icon: 'scan' },
      ]
    },
    {
      key: '/app/user-manager',
      title: '用户管理',
      icon: 'user',
      subs: [
        { key: '/app/patient-manager/index', title: '病人管理', icon: 'user' },
        { key: '/app/doctor-manager/index', title: '医生管理', icon: 'fork' },
        { key: '/app/auditDoctor-manager/index', title: '待审核医生', icon: 'fork' },
      ]
    },
    { key: '/app/log-manager/index', title: '日志管理', icon: 'file-text', },
    { key: '/app/personal-center/index', title: '个人中心', icon: 'user', },
  ],
};
