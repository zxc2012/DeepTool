import React from 'react';
import { Form, Input, Button, Icon, Checkbox, Radio, Select, Modal } from 'antd';
import axios from 'axios';
import { UserOutlined, IdcardOutlined } from '@ant-design/icons'
// import Footer from '../../components/footer';
import './index.less';
import '../../style/lib/animate.css';

const { Option } = Select;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const tailLayout = {
  wrapperCol: { offset: 6, span: 18 },
};

export default class Register extends React.Component {

    state = {

    };

    registerSuccess = () => {
        const { history } = this.props;
        history.push('/app/dashboard');
    }


    registerReq = (params) => {
        const { history } = this.props;
        console.log(params);
        console.log("--------");
        let _this = this;
        let config = {
            url: `/user/addUser/${params.role}`,
            method: 'post',
            // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            // data: Qs.stringify(params),
            data: params,
        };
        axios(config).then(response => {
            if (response.status === 200) {
                console.log(response.data);
                if (response.data.success) {
                    history.push('/login');
                    Modal.info({ title:"提示", content: "注册成功" });
                } else {
                    // Modal.info({ title:"提示", content: response.data.msg });
                    _this.setState({'errorMsg': response.data.msg});
                }
            } else {
                Modal.info({ title:"提示", content: "登录出错" });
            }
        }).catch(error => {
            console.log("----333----");
            return error;
            
        });

        console.log("----2222----");
    };

    render() {
        return (
            <div className="register-page">
                <div className="register-header">
                    <div className="logo">
                        <img src="/images/logo.svg" alt="肺部传染病辅助诊断系统" />
                        肺部传染病辅助诊断系统
                    </div>
                </div>
                <div className="register-content-wrap">
                    <div className="register-content">
                        <div className="word">肺部传染病 <br />辅助诊断系统</div>
                        <div className="register-box animated flipInY">
                            <div className="title">用户注册</div>
                            <RegisterForm ref="login" registerSubmit={this.registerReq} />
                        </div>
                    </div>
                </div>
                {/* <Footer /> */}
            </div>
        )
    }
}

class RegisterForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startTimer: false,
            count: 60,
            isShowEmployeeId: false,
        }
    }

    handleSubmit = (e) => {

        e && e.preventDefault();
        const _this = this;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {

                // var formValue = _this.props.form.getFieldsValue();
                // console.log(values)
                _this.props.registerSubmit(values);
            }
        });
    };



    handleVCode = () => {
        const _this = this;
        var phone = this.props.form.getFieldsValue().phone;
        axios.get('/sendVCode', { phone: phone }).then((res) => {
            console.log(res);
            const timer = setInterval(() => {
                _this.setState({ count: this.state.count - 1, startTimer: true }, () => {
                    if (_this.state.count === 0) {
                        clearInterval(timer);
                        _this.setState({
                            startTimer: false,
                            count: 60
                        })
                    }
                });
            }, 1000);

        })

    }

    handleRoleChange = (e) => {
      let value = e.target.value;
      this.setState({
        isShowEmployeeId: value === '2'
      });
    }

    render() {
        const { isShowEmployeeId } = this.state;
        const { getFieldDecorator } = this.props.form;
        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '86',
        })(
            <Select style={{ width: 70 }}>
                <Option value="86">+86</Option>
            </Select>,
        );
        return (
            <Form {...layout} autoComplete="off" className="register-form" onSubmit={this.handleSubmit} style={{ maxWidth: '500px' }}>
                <Form.Item label="用户身份">
                    {getFieldDecorator('role', {
                        // rules: [{ required: true, message: '请选择用户类型!' }],
                        initialValue: '3',
                    })(
                        <Radio.Group buttonStyle="solid" onChange={this.handleRoleChange}>
                            <Radio.Button value="3">患者</Radio.Button>
                            <Radio.Button value="2">医生</Radio.Button>
                            {/* <Radio.Button value="1" disabled>管理员</Radio.Button> */}
                        </Radio.Group>
                    )}
                </Form.Item>
                <Form.Item label="姓名">
                    {getFieldDecorator('nickname', {
                        rules: [{ required: true, message: '请输入您的姓名!' }],
                    })(<Input prefix={<UserOutlined />}  style={{ width: '100%' }} placeholder="请输入您的姓名" />)}
                </Form.Item>
                <Form.Item label="性别">
                    {getFieldDecorator('gender', {
                      initialValue: '男'
                    })(
                      <Radio.Group buttonStyle="solid">
                        <Radio.Button value="男">男</Radio.Button>
                        <Radio.Button value="女">女</Radio.Button>
                      </Radio.Group>
                    )}
                </Form.Item>
                <Form.Item label="年龄">
                    {getFieldDecorator('age', {
                        rules: [{ required: true, message: '请输入您的年龄!' }],
                    })(<Input prefix={<UserOutlined />}  style={{ width: '100%' }} placeholder="请输入您的年龄" />)}
                </Form.Item>
                <Form.Item label="手机号码">
                    {getFieldDecorator('phone', {
                        rules: [{ required: true, message: '请输入手机号码!' }],
                    })(<Input addonBefore={prefixSelector} style={{ width: '100%' }} placeholder="请输入手机号码" />)}
                </Form.Item>
                <Form.Item label="身份证号">
                    {getFieldDecorator('account', {
                        rules: [{ required: true, message: '请输入身份证号!' }],
                    })(<Input prefix={<IdcardOutlined />} style={{ width: '100%' }} placeholder="请输入身份证号" />)}
                </Form.Item>
                { isShowEmployeeId &&
                  <Form.Item label="工号">
                      {getFieldDecorator('employeeId', {
                          rules: [{ required: true, message: '请输入工号!' }],
                      })(<Input prefix={<IdcardOutlined />} style={{ width: '100%' }} placeholder="请输入工号" />)}
                  </Form.Item>
                }
                <Form.Item label="邮箱">
                    {getFieldDecorator('email', {
                    })(<Input prefix={<Icon type="mail" style={{ fontSize: 13 }} />} autoComplete="new-password" style={{ width: '100%' }} placeholder="请输入邮箱" />)}
                </Form.Item>
                <Form.Item label="密码">
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请输入密码!' }],
                    })(
                        <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} autoComplete="new-password" type="password" placeholder="请设置密码" />
                    )}
                </Form.Item>
                {/* <Form.Item>
                    <Row gutter={8}>
                        <Col span={15}>
                            {getFieldDecorator('vcode', {
                                rules: [{ required: true, message: '请输入验证码!' }],
                            })(<Input prefix={<Icon type="check-circle" style={{ fontSize: 13 }} />} />)}
                        </Col>
                        <Col span={9}>
                            {
                                this.state.startTimer ?
                                    <Button style={{ width: '100%' }} disabled >{this.state.count + "s"}</Button>
                                    :
                                    <Button style={{ width: '100%' }} onClick={this.handleVCode}>获取验证码</Button>
                            }
                        </Col>
                    </Row>
                </Form.Item> */}
                <Form.Item {...tailLayout}>
                    {getFieldDecorator('agreement', {
                        valuePropName: 'checked',
                    })(
                        <Checkbox style={{ fontSize: 12 }}>
                            接受<a href="#">《205用户协议》</a>及<a href="#">《205隐私权保护声明》</a>
                        </Checkbox>,
                    )}
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit" className="login-form-button" style={{ width: '100%' }}>
                        注册
                    </Button>
                    <p style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span >已有账号 直接<a href="/#/login">登录</a>!</span>
                    </p>
                </Form.Item>
            </Form>
        );

    }
}
RegisterForm = Form.create({})(RegisterForm);
