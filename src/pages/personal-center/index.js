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
        <br />
        { roleId === 1 && <Button type="primary" size="large" onClick={this.showAddManager}>添加管理员</Button>}
        {/* &emsp;&emsp;&emsp;        
        <Button type="primary" size="large" onClick={this.updatePage}>刷新</Button> */}
        <br /><br />
        <Table columns={columns} dataSource={this.state.userInfosShow} rowKey={record => record.id} bordered />

        <Modal
          title={this.state.modalTitle}
          visible={this.state.modalVisible}
          width={700}
          okText="确定"
          cancelText="取消"
          onCancel={() => {
            this.setState({
              modalVisible: false,
              userInfo: {}
            })
          }}
          onOk={this.saveUserInfo}
        >
          <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
            <Form.Item label="姓名">
              {getFieldDecorator('nickname', {
                rules: [{ required: true, message: '请输入姓名!' }],
                initialValue: userInfo.nickname || null
              })(<Input disabled={userInfo.id !== null} style={{ width: '100%' }} placeholder="请输入姓名" />)}
            </Form.Item>
            <Form.Item label="性别">
              {getFieldDecorator('gender', {
                initialValue: userInfo.gender || '男'
              })(
                <Radio.Group disabled={userInfo.id !== null} buttonStyle="solid">
                  <Radio.Button value="男">男</Radio.Button>
                  <Radio.Button value="女">女</Radio.Button>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item label="年龄">
              {getFieldDecorator('age', {
                rules: [{ required: true, message: '请输入年龄!' }],
                initialValue: userInfo.age === null ? null : userInfo.age
              })(<Input style={{ width: '100%' }} placeholder="请输入年龄" />)}
            </Form.Item>
            <Form.Item label="手机号码">
              {getFieldDecorator('phone', {
                rules: [{ required: true, message: '请输入手机号码!' }],
                initialValue: userInfo.phone || null
              })(<Input style={{ width: '100%' }} placeholder="请输入手机号码" />)}
            </Form.Item>
            <Form.Item label="身份证号">
              {getFieldDecorator('account', {
                rules: [{ required: true, message: '请输入身份证号!' }],
                initialValue: userInfo.account || null
              })(<Input disabled={userInfo.id !== null} style={{ width: '100%' }} placeholder="请输入身份证号" />)}
            </Form.Item>
            {roleId !== 3 &&
              <Form.Item label="工号">
                {getFieldDecorator('employeeId', {
                  rules: [{ required: true, message: '请输入工号!' }],
                  initialValue: userInfo.employeeId || null
                })(<Input disabled={userInfo.id !== null} style={{ width: '100%' }} placeholder="请输入工号" />)}
              </Form.Item>
            }
            <Form.Item label="邮箱">
              {getFieldDecorator('email', {
                initialValue: userInfo.email || null
              })(<Input style={{ width: '100%' }} placeholder="请输入邮箱" />)}
            </Form.Item>
            <Form.Item label="密码">
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码!' }],
                initialValue: userInfo.password || null
              })(
                <Input autoComplete="new-password" type="password" placeholder="请设置密码" />
              )}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}
PersonalCenter = Form.create({})(PersonalCenter);
export default PersonalCenter;