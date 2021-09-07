import React from 'react';
import { Form, Input, Button, Icon, Checkbox, Radio, Modal } from 'antd';
import axios from 'axios';
// import Qs from 'qs';
// import Footer from '../../components/footer';

import { connect } from 'react-redux';
import { setRole } from '../../actions';

import './index.less';
import '../../style/lib/animate.css';

const FormItem = Form.Item;

class Login extends React.Component {

    state = {};

    loginReq = (params) => {

        // if (params.role !== 1) {
        //     Modal.info({ title:"提示", content: "只支持医生登录，其他身份用户登录功能正在开发中" });
        //     return
        // }

        const _this = this;
        const { history, dispatch } = this.props;

        // 向后端发送登录请求
        let config = {
            url: '/user/login',
            method: 'post',
            // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: params
        };
        axios(config).then(response => {
            if (response.status === 200) {
                if (response.data.success) {
                    localStorage.setItem('userInfo', JSON.stringify(response.data.data))
                    sessionStorage.setItem('roleId', response.data.data.roleType)
                    dispatch(setRole(response.data.data.roleType));
                    history.push('/app/dashboard');
                } else {
                    // Modal.info({ title:"提示", content: response.data.msg });
                    _this.setState({'errorMsg': response.data.msg});
                }
            } else {
                Modal.info({ title:"提示", content: "登录出错" });
            }
        }).catch(error => {
            return error;
        });

        // localStorage.setItem('user', JSON.stringify(params));
        // window.location.href = '/#/';
        // const { history } = this.props;
        // history.push('/app/dashboard');
    };

    render() {
        return (
            <div className="login-page">
                <div className="login-header">
                    <div className="login-logo">
                        <img src="/images/logo.svg" alt="肺部传染病辅助诊断系统" />
                        肺部传染病辅助诊断系统
                    </div>
                </div>
                <div className="login-content-wrap">
                    <div className="login-content">
                        <div className="word">肺部传染病 <br />辅助诊断系统</div>
                        <div className="login-box animated flipInY">
                            <div className="error-msg-wrap">
                                <div
                                    className={this.state.errorMsg ? "show" : ""}>
                                    {this.state.errorMsg}
                                </div>
                            </div>
                            <div className="title">用户登陆</div>
                            <LoginForm ref="login" loginSubmit={this.loginReq} />

                        </div>
                    </div>
                </div>
                {/* <Footer isLogined={false} /> */}
            </div>
        )
    }
}

class LoginForm extends React.Component {
    state = {};

    handleSubmit = (e) => {
        e && e.preventDefault();
        const _this = this;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                var formValue = _this.props.form.getFieldsValue();
                _this.props.loginSubmit({
                    role: parseInt(formValue.role),
                    account: formValue.account,
                    password: formValue.password
                });
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form className="login-form" onSubmit={this.handleSubmit} style={{ maxWidth: '300px' }}>
                <FormItem>
                    {getFieldDecorator('role', {
                        rules: [{ required: true, message: '请选择用户类型!' }],
                        initialValue: '3',
                    })(
                        <Radio.Group buttonStyle="solid">
                            <Radio.Button value="3">患者</Radio.Button>
                            <Radio.Button value="2">医生</Radio.Button>
                            <Radio.Button value="1">管理员</Radio.Button>
                        </Radio.Group>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('account', {
                        rules: [{ required: true, message: '请输入身份证号!' }],
                    })(
                        <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="请输入身份证号" />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请输入密码!' }],
                    })(
                        <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请输入密码" />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: true,
                    })(
                        <Checkbox>记住我</Checkbox>
                    )}
                    {/* <span className="login-form-forgot" href="" style={{ float: 'right' }}>忘记密码</span> */}
                    <Button type="primary" htmlType="submit" className="login-form-button" style={{ width: '100%' }}>
                        登录
                    </Button>
                    <p style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span >
                            或 现在就去<a href="/#/register">注册</a>!
                        </span>
                    </p>
                </FormItem>
            </Form>
        );
    }
}

LoginForm = Form.create({})(LoginForm);

export default connect()(Login);