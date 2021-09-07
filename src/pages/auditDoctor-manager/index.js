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
  };


  componentWillMount() {
    this.getAuditDoctorInfos()
  }

  // 刷新页面
  updatePage = () => {
    this.getAuditDoctorInfos()
  }

  // 获取该医生的病人的总览信息
  getAuditDoctorInfos = () => {
    const _this = this;
    let config = {
      url: '/user/getUserList/2',
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

  auditDoctor = (record, audit) => {
    const _this = this;
    let config = {
      url: `/user/auditAccount/${record.id}/${audit}`,
      method: 'get',
    };
    axios(config).then(response => {
      if (response.status === 200) {
        if (response.data.success) {
          Modal.info({ title: "提示", content: '审核完成' });
          _this.updatePage();
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

  render() {
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
            <Popconfirm
              title="是否通过?"
              onConfirm={() => this.auditDoctor(record, 1)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="danger" icon="plus">审核通过</Button>
            </Popconfirm>
            &emsp;
            <Popconfirm
              title="是否不通过?"
              onConfirm={() => this.auditDoctor(record, 0)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="danger" icon="plus">审核不通过</Button>
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
      </div>
    );
  }
}
DoctorManager = Form.create({})(DoctorManager);
export default DoctorManager;