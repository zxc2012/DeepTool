import React from 'react';
import { Table, Input, Button, Modal, Upload, Radio, Form, DatePicker, Select, Popconfirm } from 'antd';
import ReactEcharts from 'echarts-for-react';
import analysisImg from '../../images/analysis.png';
import analysisImg02 from '../../images/analysis02.png';
import './index.less';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { Search } = Input;
const { Option } = Select;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class UploadFormCom extends React.Component {
  render() {
    const { form, patientNames, fileList, handleBeforeUploadCTFile, handlePreview, handleChange } = this.props;
    const { getFieldDecorator } = form;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        <Form.Item label="患者姓名" name="patientName">
          {getFieldDecorator('patientId', {
            rules: [{ required: true, message: '请输患者姓名' }],
          })(
            <Select
              showSearch
              style={{ width: 400 }}
              optionFilterProp="children"
              placeholder="请选择患者"
            >
              {patientNames.map((item, key) => <Option key={key} value={item.id}>{item.nickname}</Option>)}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="CT影像上传" name="uploadCT">
          {getFieldDecorator('file', {
            rules: [{ required: true, message: '请选择CT影像' }],
          })(
            <Upload
              showUploadList={{ handleRemove: true }}
              style={{ width: 400 }}
              // action="/uploadCTFile"
              name="ctFile"
              // data={this.state.uploadParams}
              listType="picture-card"
              fileList={fileList}
              beforeUpload={handleBeforeUploadCTFile}
              onPreview={handlePreview}
              // onRemove={handleRemove}
              onChange={handleChange}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
          )}

        </Form.Item>
      </Form>
    )
  }
}
const UploadForm = Form.create()(UploadFormCom);

class CTManager extends React.Component {

  state = {
    ctInfos: null,
    ctInfosShow: null,
    viewDetailInfo: null,
    viewDetailUrls: null,
    viewDetailUrlIndex: 0,
    uploadIsVisible: false,
    uploadEditVisible: false,
    detailsIsVisible: false,
    markIsVisible: false,
    loading: false,
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
    fileList: [],
    uploadParams: {},
    patientNames: [],
    uploadInfoForm: null,
    ctType: 'detail',
    ctInfo: {},
    analysisVisible: false,
    isVisible: false,
    analysisTable: [0, 0, 0],
    checkedAnalysis: null
  };

  componentWillMount() {
    this.getCTInfos()
  }

  // 获取CT列表的总览信息
  getCTInfos = () => {
    const _this = this;
    let config = {
      url: '/image/getTuberImageList/0',
      method: 'get',
    };
    axios(config).then(response => {
      if (response.status === 200) {
        if (response.data.success) {
          _this.setState({ 'ctInfos': response.data.data.content })
          _this.setState({ 'ctInfosShow': response.data.data.content })
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

  // 刷新CT列表的总览信息
  updateCTInfos = () => {
    this.getCTInfos()
  }

  // 获取该医生的病人列表
  getPatientNames = () => {
    const _this = this;
    let config = {
      url: '/cde/getUserPatient',
      method: 'get',
    };
    axios(config).then(response => {
      if (response.status === 200) {
        if (response.data.success) {
          let content = response.data.data;
          _this.setState({ 'patientNames': content, uploadIsVisible: true });
          // this.setState({ uploadIsVisible: true });
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

  // 按照病人姓名筛选CT列表
  getCTInfosByName = value => {
    if (value === "") {
      this.setState({ 'ctInfosShow': this.state.ctInfos })
      return
    }

    var ctInfosShow = []
    this.state.ctInfos.map((item, key) => {
      if (item.name === value) {
        ctInfosShow.push(item)
      }
      return item;
    })
    this.setState({ 'ctInfosShow': ctInfosShow })
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  // handleRemove = (file, fileList) => {
  //   this.setState({
  //     fileList: []
  //   })
  // }

  handleChange = ({ fileList }) => this.setState({ fileList });

  handleUpload = () => {
    this.getPatientNames();
  }

  // 上传CT文件前获取一些参数
  handleBeforeUploadCTFile = (file) => {
    this.setState({
      fileList: [...this.state.fileList, file]
    });
    return false;
  }

  // 上传CT文件的相关信息
  handleUploadCTInfo = () => {
    this.uploadInfoForm.props.form.validateFields((err, values) => {
      if (!values.file.fileList.length) {
        Modal.info({ title: "提示", content: "请选择CT影像" });
        return;
      }
      if (!err) {
        let uploadCTInfoParams = new FormData();
        uploadCTInfoParams.append('patientNum', values.patientId);
        uploadCTInfoParams.append('ifTuberculosis', 1);
        // uploadCTInfoParams.append('diagnosisRecord', values.diagnosisRecord);
        uploadCTInfoParams.append('file', values.file.file);

        const _this = this;
        let config = {
          url: '/image/upload',
          method: 'post',
          data: uploadCTInfoParams,
        };
        axios(config).then(response => {
          if (response.status === 200) {
            if (response.data.success) {
              _this.setState({
                uploadIsVisible: false,
              });
              _this.updateCTInfos();
              Modal.info({ title: "提示", content: "上传成功" });
            } else {
              Modal.info({ title: "提示", content: response.data.msg });
              // _this.setState({ 'errorMsg': response.data.msg });
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

  // 删除CT记录
  delete = (record) => {
    let url = `/image/deleteImage/${record.id}`;
    let config = {
      url,
      method: 'delete'
    };
    axios(config).then(response => {
      if (response.status === 200) {
        if (response.data.success) {
          Modal.info({ title: "提示", content: '删除成功' });
          this.getCTInfos();
        } else {
          Modal.info({ title: "提示", content: response.data.msg });
        }
      } else {
        Modal.info({ title: "提示", content: "删除CT记录出错" });
      }
    })
  }
  // 编辑CT
  editDetails = (record) => {
    var url = `/image/getTuberImageDetail/${record.id}`
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
            uploadEditVisible: true,
            ctInfo: data
          });
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
  handleEditCTInfo = () => {
    const { ctInfo } = this.state;
    const _this = this;
    // var formValue = this.props.form.getFieldsValue();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let config = {
          url: '/image/updateImage',
          method: 'put',
          data: {
            id: ctInfo.id,
            diagnosisRecord: values.diagnosisRecord
          }
        };
        axios(config).then(response => {
          if (response.status === 200) {
            if (response.data.success) {
              _this.updateCTInfos();
              _this.setState({
                uploadEditVisible: false,
              });
              Modal.info({ title: "提示", content: "编辑成功" });
            } else {
              _this.setState({ 'errorMsg': response.data.msg });
            }
          } else {
            Modal.info({ title: "提示", content: "查看详情出错" });
          }
        }).catch(error => {
          return error;
        });
      }
    })
  }
  // 查看CT详情
  viewDetails = (text, record, type = '') => {
    var url = `/image/url/${record.id}`
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
            'viewDetailUrls': data,
            'viewDetailUrlIndex': 0,
          })

          // }
        } else {
          _this.setState({ 'errorMsg': response.data.msg });
        }
      } else {
        Modal.info({ title: "提示", content: "查看详情出错" });
      }
    }).catch(error => {
      return error;
    });

    if (!type) {
      this.setState({
        detailsIsVisible: true,
        viewDetailInfo: { name: record.nickname, examinationDate: record.examinationDate }
      });
    }
  }

  // 获取智能分析结果
  getAnalysisRun = (record) => {
    var url = `/image/run/${record.id}`
    const _this = this;
    let config = {
      url: url,
      method: 'post',
    };
    axios(config).then(response => {
      if (response.status === 200) {
        if (response.data.success) {
          let data = response.data.data;
          this.setState({
            analysisTable: data
          })
        } else {
          _this.setState({ 'errorMsg': response.data.msg });
        }
      } else {
        Modal.info({ title: "提示", content: "查看只能分析出错" });
      }
    }).catch(error => {
      return error;
    });
  }

  // 修改诊断结果
  updateAnalysisImage = () => {
    const { checkedAnalysis } = this.state;

    const _this = this;
    let config = {
      url: '/image/updateImage',
      method: 'put',
      data: {
        id: checkedAnalysis.id,
        diagnosisRecord: checkedAnalysis.diagnosisRecord
      }
    };
    axios(config).then(response => {
      if (response.status === 200) {
        if (response.data.success) {
          this.setState({
            analysisVisible: false,
            checkedAnalysis: null
          });
          _this.updateCTInfos();
        } else {
          _this.setState({ 'errorMsg': response.data.msg });
        }
      } else {
        Modal.info({ title: "提示", content: "修改诊断结果失败" });
      }
    }).catch(error => {
      return error;
    });    
  }

  // 智能分析
  showAnalysis = (text, record) => {
    const { viewDetailUrls } = this.state;

    this.getAnalysisRun(record);
    if (!viewDetailUrls) {
      this.viewDetails(text, record, 'analysis');
    }
    this.setState({
      checkedAnalysis: record,
      analysisVisible: true
    })
  }
  render() {
    const roleId = +sessionStorage.getItem('roleId');
    const { fileList, ctInfo, previewVisible, previewImage, checkedAnalysis } = this.state;
    const { getFieldDecorator } = this.props.form;
    const columns = [
      {
        title: 'CT序号',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '检查日期',
        dataIndex: 'createTime',
        key: 'createTime',
        render: (value) => {
          return moment(value).format('YYYY-MM-DD')
        }
      },
      {
        title: '上传医生工号',
        dataIndex: 'employeeId',
        key: 'employeeId',
      },
      {
        title: '病人姓名',
        dataIndex: 'nickname',
        key: 'nickname',
      },
      {
        title: '病人身份证号码',
        dataIndex: 'account',
        key: 'account',
        width: 200
      },
      {
        title: '诊断结果',
        dataIndex: 'diagnosisRecord',
        key: 'diagnosisRecord',
        width: 160,
      },
      {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          render: status => {
            switch(status) {
              case 0:
                return <span className="status un"><span className="icon"></span>待分析</span> 
              case 1:
                return <span className="status in"><span className="icon"></span>分析中</span> 
              case 2:
                return <span className="status complete"><span className="icon"></span>分析完成</span> 
            }
          }
      },
      {
        title: "操作",
        key: "action",
        align: "center",
        render: (text, record) => (
          <span className="btnCtrls">
            <Button type="primary" disabled={roleId === 3} icon="edit" onClick={() => this.editDetails(text, record)}>编辑</Button>
            <Button type="primary" icon="edit" onClick={() => this.viewDetails(text, record)}>查看图片详情</Button>
            <Button type="primary" icon="edit" onClick={() => this.showAnalysis(text, record)}>智能分析</Button>
            <Button type="primary" icon="edit" onClick={() => this.props.history.push('/app/patient-manager/index')}>进入诊疗流程</Button>
            <Button type="primary" icon="plus" onClick={() => { this.setState({ isVisible: true }) }}>报告生成</Button>
            <Popconfirm
              title="是否删除该记录?"
              disabled={roleId === 3}
              onConfirm={() => this.delete(record)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="danger" disabled={roleId === 3} icon="delete">删除</Button>
            </Popconfirm>
          </span>
        )
      },
    ];
    const option = {
      title: {
        text: '肺部传染病类别判断',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        bottom: 0,
        left: 'center',
        data: ['肺结核', '新冠病毒肺炎', '普通肺炎']
      },
      series: [
        {
          type: 'pie',
          radius: '60%',
          center: ['50%', '50%'],
          selectedMode: 'single',
          data: [
            { value: 14, name: '肺结核' },
            { value: 76, name: '新冠病毒肺炎' },
            { value: 10, name: '普通肺炎' },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
    return (
      <div>
        <br />&emsp;
        <Search
          placeholder="病人姓名"
          enterButton="查询"
          size="large"
          style={{ width: 300 }}
          onSearch={this.getCTInfosByName}
        />
                &emsp;&emsp;&emsp;
        <Button disabled={roleId === 3} type="danger" icon="plus" size="large" onClick={this.handleUpload}>上传CT影像</Button>
                &emsp;&emsp;&emsp;
        <Button type="primary" size="large" onClick={this.updateCTInfos}>刷新</Button>
        <br /><br />
        <Table columns={columns} dataSource={this.state.ctInfosShow} bordered rowKey={record => record.id} />

        <Modal
          title="CT影像上传"
          visible={this.state.uploadIsVisible}
          width={600}
          cancelText="取消"
          okText="确定"
          onCancel={() => {
            this.setState({
              uploadIsVisible: false,
            })
          }}
          onOk={this.handleUploadCTInfo}
        >
          <UploadForm
            fileList={fileList}
            patientNames={this.state.patientNames}
            handleBeforeUploadCTFile={this.handleBeforeUploadCTFile}
            handlePreview={this.handlePreview}
            // handleRemove={this.handleRemove}
            handleChange={this.handleChange}
            wrappedComponentRef={ref => {
              this.uploadInfoForm = ref
            }}
          >
          </UploadForm>
          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </Modal>
        <Modal
          title="编辑"
          visible={this.state.uploadEditVisible}
          width={600}
          cancelText="取消"
          okText="确定"
          onCancel={() => {
            this.setState({
              uploadEditVisible: false,
            })
          }}
          onOk={this.handleEditCTInfo}
        >
          <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
            <Form.Item label="患者姓名" name="nickname">
              <Input style={{ width: 320 }} value={ctInfo == null ? null : ctInfo.nickname} disabled />
            </Form.Item>
            <Form.Item label="肺部传染病类别" name="diagnosisRecord">
              {getFieldDecorator('diagnosisRecord', {
                rules: [{ required: true, message: '请选择肺部传染病类别' }],
                initialValue: ctInfo.diagnosisRecord == null ? null : ctInfo.diagnosisRecord
              })(
                <Select style={{ width: 320 }} placeholder="肺部传染病类别">
                  <Option value="肺结核">肺结核</Option>
                  <Option value="新冠病毒肺炎">新冠病毒肺炎</Option>
                  <Option value="普通肺炎">普通肺炎</Option>
                </Select>
              )}
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="智能分析结果"
          visible={this.state.analysisVisible}
          width={700}
          onCancel={() => {
            this.setState({
              checkedAnalysis: null,
              analysisVisible: false
            })
          }}
          footer={
            [
              <Button key="back" onClick={() => {
                this.setState({
                  checkedAnalysis: null,
                  analysisVisible: false
                })
              }}>取消</Button>,
            ]
          }
        >
          <div className="analysisPicture">
            <img alt="" width={350} src={this.state.viewDetailUrls == null ? null : this.state.viewDetailUrls[this.state.viewDetailUrlIndex].value} />
          </div>
          <div className="analysisContainer">
            <table border="1" className="analysisTable">
              <thead>
                <tr>
                  <th>肺部传染病类别</th>
                  <th>概率</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>肺结核</td>
                  <td>{this.state.analysisTable[0]}</td>
                </tr>
                <tr>
                  <td>新冠病毒肺炎</td>
                  <td>{this.state.analysisTable[1]}</td>
                </tr>
                <tr>
                  <td>普通肺炎</td>
                  <td>{this.state.analysisTable[2]}</td>
                </tr>
              </tbody>
            </table>
            <div className="analysisPie" id="analysisPie">
              <ReactEcharts
                option={option}
                style={{ height: '250px', width: '100%' }}
                className={'react_for_echarts'}
              />
            </div>
          </div>
          <div className="analysisSelect">
            <Select placeholder="肺部传染病类别" value={checkedAnalysis ? checkedAnalysis.diagnosisRecord : '肺结核'} onChange={(value) => {this.setState({checkedAnalysis: {...checkedAnalysis, 'diagnosisRecord': value}})}}>
              <Option value="肺结核">肺结核</Option>
              <Option value="新冠病毒肺炎">新冠病毒肺炎</Option>
              <Option value="普通肺炎">普通肺炎</Option>
            </Select>
          </div>
          <div className="analysisBtnCtrl">
            {/* <Button type="danger" icon="edit">重新框选病灶区域</Button> */}
            <Popconfirm
              title="是否更正诊断结果?"
              onConfirm={() => this.updateAnalysisImage()}
              okText="确定"
              cancelText="取消"
            >
              <Button type="primary">确认更正诊断结果</Button>
            </Popconfirm>
          </div>
        </Modal>
        <Modal
          title="诊疗报告"
          visible={this.state.isVisible}
          width={800}
          onCancel={() => {
            this.setState({
              isVisible: false,
            })
          }}
          okText="确认"
          cancelText="取消"
          footer={
            [
              <Button key="back" onClick={() => {
                this.setState({
                  isVisible: false
                })
              }}>取消</Button>,
            ]
          }
        >
          <div>
            <h1 align="center">肺部CT影像诊疗报告</h1>
            <h3 align="center">病历id:202001150057</h3>
            <h3 align="center">患者名:杨子枫</h3>
            <h3 align="center">性别:男 &emsp;&emsp; 年龄:27</h3>
          </div>
          <div align="center">
            {/* <img src="fjhlb.jpg" width="30%" /> */}
            <img width={150} src={analysisImg02} />
          </div>
          <div>
            <h3>肺部传染病智能检测结果:</h3>
          </div>
          <div align="center">
            <table border="1" borderColor="#ccc" className="reportTable">
              <thead>
                <tr>
                  <th>肺结核</th>
                  <th>新冠病毒肺炎</th>
                  <th>普通肺炎</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>0.14</td>
                  <td>0.76</td>
                  <td>0.1</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Form className="ctForm" labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
            <Form.Item name="username" label="病情描述">&emsp;抽烟，近两周出现持续咳嗽症状，全身无力且精神不振，出现过咳血症状</Form.Item>
            <Form.Item name="username" label="初诊时间">&emsp;2020-01-14 09:34:26</Form.Item>
            <Form.Item name="username" label="诊疗记录">
              &emsp;根据胸部CT影像表现和算法分析，左下叶后端有空洞，内壁光滑且薄，附近有条索状阴影，病灶周围有大片浸润或由于支气管收压造成
              部分或全肺不张是可叩出浊音，听到呼吸音减低或局限性干湿罗音，初步诊断为继发性肺结核，先进行痰结合杆菌培养，之后再诊断。
            </Form.Item>
            <Form.Item name="username" label="复诊时间">&emsp;2020-01-21 11:14:03</Form.Item>
            <Form.Item name="username" label="复诊记录">
              &emsp;通过对整套肺部CT的智能辅助分析和患者所做的痰结核杆菌培养结果,最终确诊为原发性结核病早期,建议患者必须按照药物治疗方案坚持治满疗程,防止病情进一步恶化。
            </Form.Item>
            <Form.Item name="username" label="复诊时间">&emsp;2020-01-28 10:24:16</Form.Item>
            <Form.Item name="username" label="复诊记录">
              &emsp;患者表现良好,积极配合治疗,药物治疗效果较佳,病情已好转,可以出院,建议改掉抽烟的不良习惯,坚持健康生活,恭喜患者康复。
            </Form.Item>
            <Form.Item style={{'text-align': 'center'}}>
              <Button type="primary" htmlType="submit" style={{ textAlign: "center" }}> 下载诊疗报告</Button>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="查看图片详情"
          visible={this.state.detailsIsVisible}
          width={700}
          cancelText="取消"
          okText="确定"
          onCancel={() => {
            this.setState({
              detailsIsVisible: false,
            })
          }}
        >
          <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
            <Form.Item label="患者姓名" name="patientName">
              <Input style={{ width: 500 }} value={this.state.viewDetailInfo == null ? null : this.state.viewDetailInfo.name} disabled />
            </Form.Item>
            <Form.Item label="检查日期" name="examinationDate">
              <DatePicker style={{ width: 500 }} value={this.state.viewDetailInfo == null ? null : moment(this.state.viewDetailInfo.examinationDate)} disabled />
            </Form.Item>
            <Form.Item label="CT影像" name="ctFiles">
              <img alt="" width={350} src={this.state.viewDetailUrls == null ? null : this.state.viewDetailUrls[this.state.viewDetailUrlIndex].value} />
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="CT标注"
          visible={this.state.markIsVisible}
          width={700}
          onCancel={() => {
            this.setState({
              markIsVisible: false,
            })
          }}
        >
          <div align="center">
            <img alt="" src="fjhbz.jpg" height="260" width="380" />
            <br /><br /><br />
            <h2>肺结核类别：</h2>
            <Radio.Group buttonStyle="solid">
              <Radio.Button value="horizontal">原发性肺结核</Radio.Button>
              <Radio.Button value="vertical" >血型播散型肺结核</Radio.Button>
              <Radio.Button value="vertical2" >继发性肺结核</Radio.Button>
              <Radio.Button value="vertical2" >正常</Radio.Button>
            </Radio.Group>
            <br /><br />
            <Button icon="edit" onClick={() => this.markCT()}>擦除病灶标注</Button>
            &emsp;&emsp;&emsp;
            <Button type="primary" onClick={() => this.markCT()}>确认</Button>
          </div>
        </Modal>
      </div>
    );
  }
}

CTManager = Form.create({})(CTManager);

export default CTManager;