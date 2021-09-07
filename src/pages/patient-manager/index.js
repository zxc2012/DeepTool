import React from 'react';
import { Table, Input, Button, Modal, Select, Radio, Form, Popconfirm, Tabs } from 'antd';
import './index.less';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

// const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

class PatientManager extends React.Component {

  state = {
    patientTitle: '添加病人',
    patientShow: false,
    patientType: 'add',
    patientInfo: {},
    patientInfos: null,
    searchInfo: {
      account: null,
      employeeId: null
    },
    patientInfosShow: null,
    addPatientShow: false,
    patientNamesExpectDoctor: null,
    detailsIsVisible: false,
    detailPatient: null,
    editPatient: null,
    editPatientVisible: false,
    patientIdForAdd: -1,
    followVisible: false,
  };


  componentWillMount() {
    this.getPatientInfos()
    this.getPatientNamesExceptDoctor()
  }

  // 刷新页面
  updatePage = () => {
    this.getPatientInfos()
    this.getPatientNamesExceptDoctor()
  }

  // 获取该医生的病人的总览信息
  getPatientInfos = () => {
    const _this = this;
    let config = {
      url: '/patient/getList',
      method: 'get',
    };
    axios(config).then(response => {
      if (response.status === 200) {
        if (response.data.success) {
          let content = response.data.data.content;
          _this.setState({ 'patientInfos': content, 'patientInfosShow': content })
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

  // 按照病人姓名筛选病人列表
  getPatientInfosByName = value => {
    if (value === "") {
      this.setState({ 'patientInfosShow': this.state.patientInfos })
      return
    }

    var patientInfosShow = []
    this.state.patientInfos.map((item, key) => {
      if (item.name === value) {
        patientInfosShow.push(item)
      }
      return item;
    })
    this.setState({ 'patientInfosShow': patientInfosShow })
  }

  // 获取不属于该医生的病人列表
  getPatientNamesExceptDoctor = () => {
    const _this = this;
    let config = {
      url: '/cde/getUser',
      method: 'get',
    };
    axios(config).then(response => {
      if (response.status === 200) {
        if (response.data.success) {
          _this.setState({ 'patientNamesExpectDoctor': response.data.data })
        } else {
          // Modal.info({ title:"提示", content: response.data.msg });
          _this.setState({ 'errorMsg': response.data.msg });
        }
      } else {
        Modal.info({ title: "提示", content: "登录出错" });
      }
    }).catch(error => {
      return error;
    });
  }

  // 查看详情
  viewDetails = (text, record) => {
    this.setState({
      'detailPatient': record,
      'detailsIsVisible': true,
    })
  }

  editDetails = (text, record) => {
    var url = `/patient/getPatientDetail/${record.id}`
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
            patientTitle: '病人编辑',
            patientType: 'edit',
            patientInfo: data,
            patientShow: true
          })
        } else {
          _this.setState({ 'errorMsg': response.data.msg });
        }
      } else {
        Modal.info({ title: "提示", content: "获取CT影像信息出错" });
      }
    }).catch(error => {
      return error;
    });

  }

  // 解除关联
  unbind = (record) => {
    const _this = this;
    let config = {
      url: `/patient/deletePatient/${record.id}`,
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

  // 显示添加病人界面
  showAddPatient = () => {
    this.setState({
      patientTitle: '添加病人',
      patientType: 'add',
      patientInfo: {},
      patientShow: true
    })
  }
  // 添加病人
  addPatient = () => {
    // var formValue = this.props.form.getFieldsValue();
    const _this = this;
    const { patientType, patientInfo } = this.state;

    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (patientType === 'add') {
          let config = {
            url: '/patient/addPatient',
            method: 'post',
            data: {
              ...values
            }
          };
          axios(config).then(response => {
            if (response.status === 200) {
              if (response.data.success) {
                Modal.info({ title: "提示", content: "添加成功" });
                _this.setState({
                  patientShow: false
                });
                _this.getPatientInfos();
              } else {
                Modal.info({ title: "提示", content: response.data.msg });
              }
            } else {
              Modal.info({ title: "提示", content: "登录出错" });
            }
          }).catch(error => {
            return error;
          });
        } else {
          let config = {
            url: '/patient/updatePatient',
            method: 'put',
            data: {
              id: patientInfo.id,
              ...values
            }
          };
          axios(config).then(response => {
            if (response.status === 200) {
              if (response.data.success) {
                Modal.info({ title: "提示", content: "编辑成功" });
                _this.setState({
                  patientShow: false
                });
                _this.getPatientInfos();
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
    })
  }

  // 监听添加病人的Select
  addPatientOnChange = (value) => {
    this.setState({ 'patientIdForAdd': value })
  }

  follow = (text, record) => {
    this.setState({
      followVisible: true,
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { patientInfo, patientType } = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '姓名',
        dataIndex: 'nicekName',
        key: 'nicekName',
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
        title: '病情简述',
        dataIndex: 'description',
        key: 'description',
        width: 250
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
        title: '状态',
        key: 'judge',
        render: (text, record) => (
          <div className="status">
            <div className="icon"></div>
            <div className="label">待复诊</div>
          </div>
        )
      },
      {
        title: "操作",
        key: "action",
        align: "center",
        render: (text, record) => (
          <span className="btnCtrls">
            <Button type="primary" icon="edit" onClick={() => this.follow(text, record)}>复诊</Button>
            <Button type="primary" icon="edit" onClick={() => this.editDetails(text, record)}>编辑</Button>
            <Button type="primary" icon="edit" onClick={() => this.viewDetails(text, record)}>查看详情</Button>
            <Popconfirm
              title="是否解除关联?"
              onConfirm={() => this.unbind(record)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="danger" icon="plus">解除关联</Button>
            </Popconfirm>
          </span>
        )
      },
    ];


    return (
      <div>
        <br />
        <Input
          placeholder="病人身份证号码"
          // enterButton="搜索"
          size="large"
          value={this.state.searchInfo.account}
          style={{ width: 300 }}
          // onSearch={this.getPatientInfosByName}
        />
        <Input
          placeholder="诊断医生工号"
          // enterButton="搜索"
          size="large"
          style={{ width: 300 }}
          value={this.state.searchInfo.employeeId}
          // onSearch={this.getPatientInfosByName}
        />
        <Button type="primary" size="large" >搜索</Button>
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
        <Button type="primary" size="large" onClick={this.showAddPatient}>添加病人</Button>
        &emsp;&emsp;&emsp;        
        <Button type="primary" size="large" onClick={this.updatePage}>刷新</Button>
        <br /><br />
        <Tabs className="tabBar" type="card" activeKey="2">
          <TabPane tab="待处理" key="1"></TabPane>
          <TabPane tab="待复诊" key="2">
            <Table columns={columns} dataSource={this.state.patientInfosShow} rowKey={record => record.id} bordered />
          </TabPane>
          <TabPane tab="已完成" key="3"></TabPane>
          <TabPane tab="所有记录" key="4"></TabPane>
        </Tabs>
        

        <Modal
          title="复诊"
          visible={this.state.followVisible}
          width={1200}
          okText="确定"
          cancelText="取消"
          onCancel={() => {
            this.setState({
              followVisible: false,
            })
          }}
          onOk={() => {
            this.setState({
              followVisible: false,
            })
          }}
        >
          <div className="followContainer">
            <table className="patientTable" border="1" borderColor="#000">
              <thead>
                <tr>
                  <th>时间</th>
                  <th>姓名</th>
                  <th>性别</th>
                  <th>年龄</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2020-04-02</td>
                  <td>杨超群</td>
                  <td>男</td>
                  <td>47</td>
                </tr>
              </tbody>
            </table>
            <table className="illnessTable">
              <tbody>
                <tr>
                  <th>病情简述:</th>
                  <td>经常午后低热、乏力、食欲减退。</td>
                </tr>
                <tr>
                  <th>病情详述:</th>
                  <td>平时经常抽烟，最近一段时间伴有寒战、周身不适、精神不振、疲乏无力及全身衰落，而且经常咳嗽，咳少量痰，气短。</td>
                </tr>
                <tr>
                  <th>诊断意见:</th>
                  <td>根据肺部CT影像表现和</td>
                </tr>
              </tbody>
            </table>
            <div className="followRecord">
              <div className="title">复诊记录</div>
              <div className="container">
                <div className="record">
                  <div className="tip">复诊时间:</div>
                  <div className="text">2020-04-02 14:10:09</div>
                </div>
                <div className="record">
                  <div className="tip">复诊记录:</div>
                  <div className="text">12312312312</div>
                </div>
                <div className="recordOther">
                  <div className="tip">复诊意见</div>
                  <div className="text">
                    <textarea>12312312312</textarea>
                  </div>
                </div>
              </div>
            </div>
            <div className="followBtnCtrl">
              <p>
              <Button type="primary">添加复诊记录</Button>
              </p>
              <Button type="danger">结束诊疗</Button>
            </div>
          </div>
        </Modal>
        <Modal
          title={this.state.patientTitle}
          visible={this.state.patientShow}
          width={700}
          okText="确定"
          cancelText="取消"
          onCancel={() => {
            this.setState({
              patientShow: false,
            })
          }}
          onOk={this.addPatient}
        >

          <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
            <Form.Item label="病人" name="patientNum">
              {
                getFieldDecorator('patientNum', {
                  rules: [{required: true, message: '请选择病人'}],
                  initialValue: patientInfo.patientNum === null ? null : patientInfo.patientNum
                })(
                  <Select
                    showSearch
                    style={{ width: 200 }}
                    optionFilterProp="children"
                    placeholder="请选择病人"
                    disabled={patientType === 'edit'}
                  >
                    {this.state.patientNamesExpectDoctor == null ? null : this.state.patientNamesExpectDoctor.map((item, key) => <Option key={key} value={item.id}>{item.nickname}-{item.account}</Option>)}
                  </Select>
                )
              }
            </Form.Item>
            <Form.Item label="病情描述" name="description">
              {getFieldDecorator('description', {
                  rules: [{ required: true, message: '请输病情描述' }],
                  initialValue: patientInfo.description === null ? null : patientInfo.description
              })(
                  <Input style={{ width: 400 }} placeholder="请输病情描述" />
              )}
            </Form.Item>
            <Form.Item label="病情判断" name="judge">
              {getFieldDecorator('judge', {
                  rules: [{ required: true, message: '请输病情判断' }],
                  initialValue: patientInfo.judge === null ? '是' : patientInfo.judge
              })(
                  <Radio.Group>
                    <Radio value="是">是</Radio>
                    <Radio value="否">否</Radio>
                  </Radio.Group>
              )}
            </Form.Item>
            {
              patientType === 'edit' && 
              <Form.Item label="手机号码" name="phone">
                {getFieldDecorator('phone', {
                    rules: [{ required: true, message: '请输手机号码' }],
                    initialValue: patientInfo.phone === null ? null : patientInfo.phone
                })(
                    <Input style={{ width: 400 }} placeholder="请输手机号码" />
                )}
              </Form.Item>
            }
            {
              patientType === 'edit' && 
              <Form.Item label="邮箱" name="email">
                {getFieldDecorator('email', {
                    rules: [{ required: true, message: '请输邮箱' }],
                    initialValue: patientInfo.email === null ? null : patientInfo.email
                })(
                    <Input style={{ width: 400 }} placeholder="请输邮箱" />
                )}
              </Form.Item>
            }
          </Form>
        </Modal>
        <Modal
          title="查看详情"
          visible={this.state.detailsIsVisible}
          width={700}
          onCancel={() => {
            this.setState({
              detailsIsVisible: false,
            })
          }}
        >
          <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
            <Form.Item label="姓名" name="patientName">
              <Input style={{ width: 400 }} value={this.state.detailPatient == null ? null : this.state.detailPatient.nicekName} disabled />
            </Form.Item>
            <Form.Item label="性别" name="patientGender">
              <Input style={{ width: 400 }} value={this.state.detailPatient == null ? null : this.state.detailPatient.gender ? '女' : '男'} disabled />
            </Form.Item>
            <Form.Item label="手机" name="patientPhone">
              <Input style={{ width: 400 }} value={this.state.detailPatient == null ? null : this.state.detailPatient.phone} disabled />
            </Form.Item>
            <Form.Item label="出生日期" name="patientBirthDate">
              <Input style={{ width: 400 }} value={this.state.detailPatient == null ? null : this.state.detailPatient.birthDate} disabled />
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="病人编辑"
          visible={this.state.editPatientVisible}
          width={700}
          onCancel={() => {
            this.setState({
              editPatientVisible: false,
            })
          }}
        >
          <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
            <Form.Item label="姓名" name="patientName">
              <Input style={{ width: 400 }} value={this.state.detailPatient == null ? null : this.state.detailPatient.nicekName} disabled />
            </Form.Item>
            <Form.Item label="性别" name="patientGender">
              <Input style={{ width: 400 }} value={this.state.detailPatient == null ? null : this.state.detailPatient.gender ? '女' : '男'} disabled />
            </Form.Item>
            <Form.Item label="手机" name="patientPhone">
              <Input style={{ width: 400 }} value={this.state.detailPatient == null ? null : this.state.detailPatient.phone} disabled />
            </Form.Item>
            <Form.Item label="出生日期" name="patientBirthDate">
              <Input style={{ width: 400 }} value={this.state.detailPatient == null ? null : this.state.detailPatient.birthDate} disabled />
            </Form.Item>
          </Form>
        </Modal>

      </div>
    );
  }
}
PatientManager = Form.create({})(PatientManager);
export default PatientManager;