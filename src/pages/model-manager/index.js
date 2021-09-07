import React from 'react';
import { Table, Input, Button, Modal, Radio, Form } from 'antd';
import './index.less';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

// const { Search } = Input;
// const { Option } = Select;

class PersonalCenter extends React.Component {

  state = {
    userInfo: {},
    userInfos: [],
    userInfosShow: [],
    modalTitle: '管理员添加',
    modalVisible: false,
  };


  componentWillMount() {
    this.getUserInfos()
  }

  // 刷新页面
  updatePage = () => {
    this.getUserInfos()
  }

  // 获取个人信息
  getUserInfos = () => {
    const _this = this;
    let config = {
      url: '/user/getUserList/3',
      method: 'get',
    };
    axios(config).then(response => {
      if (response.status === 200) {
        if (response.data.success) {
          let content = response.data.data.content;
          _this.setState({ 'userInfos': content, 'userInfosShow': content })
        } else {
          _this.setState({ 'errorMsg': response.data.msg });
        }
      } else {
        Modal.info({ title: "提示", content: "登录出错" });
      }
    }).catch(error => {
      return error;
    });
  }

  // 管理员新增
  showAddManager = () => {
    this.setState({
      modalTitle: '管理员添加',
      modalVisible: true
    });
  }

  // 用户编辑
  editDetails = (text, record) => {
    const _this = this;
    let config = {
      url: `/user/getUserDetail/${record.id}`,
      method: 'get',
    };
    axios(config).then(response => {
      if (response.status === 200) {
        if (response.data.success) {
          let content = response.data.data;
          _this.setState({
            modalTitle: '用户编辑',
            modalVisible: true,
            userInfo: content
          });
        } else {
          _this.setState({ 'errorMsg': response.data.msg });
        }
      } else {
        Modal.info({ title: "提示", content: "登录出错" });
      }
    }).catch(error => {
      return error;
    });

  }

  // 保存
  saveUserInfo = () => {
    const { userInfo } = this.state;
    const _this = this;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (userInfo.id) {
          let config = {
            url: `/user/updateUser`,
            method: 'put',
            // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            // data: Qs.stringify(params),
            data: {
              id: userInfo.id,
              ...values
            },
          };
          axios(config).then(response => {
            if (response.status === 200) {
              if (response.data.success) {
                Modal.info({ title: "提示", content: "编辑成功" });
                _this.setState({
                  modalVisible: false,
                  userInfo: {}
                });
                _this.updatePage();
              } else {
                Modal.info({ title: "提示", content: response.data.msg });
                _this.setState({ 'errorMsg': response.data.msg });
              }
            } else {
              Modal.info({ title: "提示", content: "登录出错" });
            }
          }).catch(error => {
            return error;
          });
        } else {
          let config = {
            url: `/user/addUser/1`,
            method: 'post',
            // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            // data: Qs.stringify(params),
            data: values,
          };
          axios(config).then(response => {
            if (response.status === 200) {
              if (response.data.success) {
                Modal.info({ title: "提示", content: "添加成功" });
                _this.setState({
                  modalVisible: false,
                  userInfo: {}
                });
                _this.updatePage();
              } else {
                Modal.info({ title: "提示", content: response.data.msg });
                _this.setState({ 'errorMsg': response.data.msg });
              }
            } else {
              Modal.info({ title: "提示", content: "登录出错" });
            }
          }).catch(error => {
            return error;
          });
        }
      }
    });

  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { userInfo } = this.state;
    const roleId = +sessionStorage.getItem('roleId');
    let columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '姓名',
        dataIndex: 'nickname',
        key: 'nickname',
      },
      {
        title: '性别',
        dataIndex: 'gender',
        key: 'gender',
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: '身份证号码',
        dataIndex: 'account',
        key: 'account',
      },
      {
        title: '手机',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: (value) => {
          return moment(value).format('YYYY-MM-DD')
        }
      },
      {
        title: "操作",
        key: "action",
        render: (text, record) => (
          <span>
            <Button type="primary" icon="edit" onClick={() => this.editDetails(text, record)}>编辑</Button>
          </span>
        )
      },
    ];
    if (roleId !== 3) {
      columns.splice(2, 0, {
        title: '工号',
        dataIndex: 'employeeId',
        key: 'employeeId',
      });
    }

    return (
      <div>
        <div className="modelContainer01">
          <div className="title">肺部传染病识别模型</div>
          <table border="1" borderColor="#ccc">
            <thead>
              <tr>
                <th>日期</th>
                <th>模型名</th>
                <th>准确率</th>
                <th>灵敏度</th>
                <th>AUC</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2020-11-21</td>
                <td>FL-CNN-RC</td>
                <td>0.936</td>
                <td>0.932</td>
                <td>0.934</td>
                <td width={130}>
                  <div className="status active">
                    <div className="icon"></div>
                    <div className="text">当前模型</div>
                  </div>
                </td>
                <td>
                  <Button disabled className="useBtn" type="primary">使用</Button>
                  <Button type="primary">详情</Button>
                  <Button className="delBtn" type="danger">删除</Button>
                </td>
              </tr>
              <tr>
                <td>2020-10-12</td>
                <td>CNN-Res-RC</td>
                <td>0.928</td>
                <td>0.924</td>
                <td>0.925</td>
                <td>
                  <div className="status">
                    <div className="icon"></div>
                    <div className="text">未使用</div>
                  </div>
                </td>
                <td>
                  <Button className="useBtn" type="primary">使用</Button>
                  <Button type="primary">详情</Button>
                  <Button className="delBtn" type="danger">删除</Button>
                </td>
              </tr>
              <tr>
                <td>2020-10-09</td>
                <td>CNN-Res</td>
                <td>0.907</td>
                <td>0.901</td>
                <td>0.908</td>
                <td>
                  <div className="status">
                    <div className="icon"></div>
                    <div className="text">未使用</div>
                  </div>
                </td>
                <td>
                  <Button className="useBtn" type="primary">使用</Button>
                  <Button type="primary">详情</Button>
                  <Button className="delBtn" type="danger">删除</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="modelContainer02">
          <div className="title">肺结核检测模型</div>
          <table border="1" borderColor="#ccc">
            <thead>
              <tr>
                <th>日期</th>
                <th>模型名</th>
                <th>准确率</th>
                <th>召回率</th>
                <th>mAP</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2021-02-22</td>
                <td>RA-Model-AM</td>
                <td>0.929</td>
                <td>0.907</td>
                <td>0.893</td>
                <td width={130}>
                  <div className="status active">
                    <div className="icon"></div>
                    <div className="text">当前模型</div>
                  </div>
                </td>
                <td>
                  <Button disabled className="useBtn" type="primary">使用</Button>
                  <Button type="primary">详情</Button>
                  <Button className="delBtn" type="danger">删除</Button>
                </td>
              </tr>
              <tr>
                <td>2021-02-01</td>
                <td>RA-Model</td>
                <td>0.904</td>
                <td>0.878</td>
                <td>0.863</td>
                <td>
                  <div className="status">
                    <div className="icon"></div>
                    <div className="text">未使用</div>
                  </div>
                </td>
                <td>
                  <Button className="useBtn" type="primary">使用</Button>
                  <Button type="primary">详情</Button>
                  <Button className="delBtn" type="danger">删除</Button>
                </td>
              </tr>
              <tr>
                <td>2021-01-11</td>
                <td>Model-Origin</td>
                <td>0.895</td>
                <td>0.871</td>
                <td>0.852</td>
                <td>
                  <div className="status">
                    <div className="icon"></div>
                    <div className="text">未使用</div>
                  </div>
                </td>
                <td>
                  <Button className="useBtn" type="primary">使用</Button>
                  <Button type="primary">详情</Button>
                  <Button className="delBtn" type="danger">删除</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
PersonalCenter = Form.create({})(PersonalCenter);
export default PersonalCenter;