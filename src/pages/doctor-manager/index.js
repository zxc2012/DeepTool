import React from 'react';
import { Table, Input, Button, Modal, Form, Popconfirm } from 'antd';
import './index.less';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { Search } = Input;
// const { Option } = Select;

class DoctorManager extends React.Component {

  state = {
    doctorInfos: [],
    doctorInfosShow: [],
    detailDoctor: null,
    doctorInfo: {},
    doctorTitle: '医生编辑',
    doctorShow: false,
  };


  componentWillMount() {
    this.getDoctorInfos()
  }

  // 刷新页面
  updatePage = () => {
    this.getDoctorInfos()
  }

  // 获取该医生的病人的总览信息
  getDoctorInfos = () => {
    const _this = this;
    let config = {
      url: '/user/getUserList/1',
      method: 'get',
    };
    axios(config).then(response => {
      if (response.status === 200) {
        if (response.data.success) {
          let content = response.data.data.content;
          _this.setState({ 'doctorInfos': content, 'doctorInfosShow': content })
        } else {
          Modal.info({ title: "提示", content: response.data.msg });
        }
      } else {
        Modal.info({ title: "提示", content: "登录出错" });
      }
    }).catch(error => {
      return error;
    });
  }

  // 按照病人姓名筛选病人列表
  getDoctorInfosByName = value => {
    if (value === "") {
      this.setState({ 'doctorInfosShow': this.state.doctorInfos })
      return
    }

    var doctorInfosShow = []
    this.state.doctorInfos.map((item, key) => {
      if (item.name === value) {
        doctorInfosShow.push(item)
      }
      return item;
    })
    this.setState({ 'doctorInfosShow': doctorInfosShow })
  }

  // 查看详情
  viewDetails = (text, record) => {
    this.setState({
      'detailDoctor': record,
      'detailsIsVisible': true,
    })
  }

  editDetails = (text, record) => {
    var url = `/user/getUserDetail/${record.id}`
    const _this = this;
    let config = {
      url: url,
      method: 'get',
    };
    axios(config).then(response => {
      if (response.status === 200) {
        if (response.data.success) {
          let data = response.data.data;
          _this.setState({
            doctorTitle: '医生编辑',
            doctorInfo: data,
            doctorShow: true
          })
        } else {
          Modal.info({ title: "提示", content: response.data.msg });
          _this.setState({ 'errorMsg': response.data.msg });
        }
      } else {
        Modal.info({ title: "提示", content: "获取CT影像信息出错" });
      }
    }).catch(error => {
      return error;
    });

  }
  saveDoctor = () => {
    // var formValue = this.props.form.getFieldsValue();
    const { doctorInfo } = this.state;
    const _this = this;

    this.props.form.validateFields((err, values) => {
      if (!err) {
        let config = {
          url: '/user/updateUser',
          method: 'put',
          data: {
            id: doctorInfo.id,
            phone: values.phone,
            email: values.email,
          }
        };
        axios(config).then(response => {
          if (response.status === 200) {
            if (response.data.success) {
              Modal.info({ title: "提示", content: "编辑成功" });
              _this.setState({
                doctorShow: false
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
    })
  }

  delDoctor = (record) => {
    const _this = this;
    let config = {
      url: `/user/delete/${record.id}`,
      method: 'delete',
    };
    axios(config).then(response => {
      if (response.status === 200) {
        if (response.data.success) {
          _this.updatePage();
          Modal.info({ title: "提示", content: "成功" });
        } else {
          _this.setState({ 'errorMsg': response.data.msg });
          Modal.info({ title: "提示", content: response.data.msg });
        }
      } else {
        Modal.info({ title: "提示", content: "登录出错" });
      }
    }).catch(error => {
      return error;
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { doctorInfo } = this.state;

    const columns = [
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
        title: '工号',
        dataIndex: 'employeeId',
        key: 'employeeId',
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
            &emsp;
            <Popconfirm
              title="是否删除?"
              onConfirm={() => this.delDoctor(record)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="danger" icon="plus">删除</Button>
            </Popconfirm>
          </span>
        )
      },
    ];


    return (
      <div>
        <br />
        <Search
          placeholder="医生工号"
          enterButton="搜索"
          size="large"
          style={{ width: 300 }}
          // onSearch={this.getPatientInfosByName}
        />
        {/* <Select
          showSearch
          size="large"
          style={{ width: 200 }}
          optionFilterProp="children"
          placeholder="病人姓名"
          onChange={(value) => this.addPatientOnChange(value)}
        >
          {this.state.patientNamesExpectDoctor == null ? null : this.state.patientNamesExpectDoctor.map((item, key) => <Option key={key} value={item.id}>{item.nickname}-{item.account}</Option>)}
        </Select> */}
        &emsp;&emsp;&emsp;        
        <Button type="primary" size="large" onClick={this.updatePage}>刷新</Button>
        <br /><br />
        <Table columns={columns} dataSource={this.state.doctorInfosShow} rowKey={record => record.id} bordered />

        <Modal
          title={this.state.doctorTitle}
          visible={this.state.doctorShow}
          width={700}
          okText="确定"
          cancelText="取消"
          onCancel={() => {
            this.setState({
              doctorShow: false,
            })
          }}
          onOk={this.saveDoctor}
        >

          <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
            <Form.Item label="医生姓名" name="nickname">
              {getFieldDecorator('nickname', {
                  rules: [{ required: true, message: '请输医生姓名' }],
                  initialValue: doctorInfo.nickname === null ? null : doctorInfo.nickname
              })(
                  <Input disabled style={{ width: 400 }} placeholder="请输医生姓名" />
              )}
            </Form.Item>
            <Form.Item label="医生工号" name="employeeId">
              {getFieldDecorator('employeeId', {
                  rules: [{ required: true, message: '请输医生工号' }],
                  initialValue: doctorInfo.employeeId === null ? null : doctorInfo.employeeId
              })(
                  <Input disabled style={{ width: 400 }} placeholder="请输医生工号" />
              )}
            </Form.Item>
            <Form.Item label="身份证号码" name="account">
              {getFieldDecorator('account', {
                  rules: [{ required: true, message: '请输身份证号码' }],
                  initialValue: doctorInfo.account === null ? null : doctorInfo.account
              })(
                  <Input disabled style={{ width: 400 }} placeholder="请输身份证号码" />
              )}
            </Form.Item>
            <Form.Item label="手机号码" name="phone">
              {getFieldDecorator('phone', {
                  rules: [{ required: true, message: '请输手机号码' }],
                  initialValue: doctorInfo.phone === null ? null : doctorInfo.phone
              })(
                  <Input style={{ width: 400 }} placeholder="请输手机号码" />
              )}
            </Form.Item>
            <Form.Item label="邮箱" name="email">
              {getFieldDecorator('email', {
                  rules: [{ required: true, message: '请输邮箱' }],
                  initialValue: doctorInfo.email === null ? null : doctorInfo.email
              })(
                  <Input style={{ width: 400 }} placeholder="请输邮箱" />
              )}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}
DoctorManager = Form.create({})(DoctorManager);
export default DoctorManager;