import React from 'react';
import { Input, Button, Modal, Radio, Form, DatePicker } from 'antd';
import './index.less';
import axios from 'axios';
import moment from 'moment';
import Qs from 'qs';

const FormItem = Form.Item;

class PersonalCenter extends React.Component {

    state = {
        userInfo: null,
    };


    componentWillMount() {
        this.getUserInfo()
    }

    getUserInfo = () => {
        const _this = this;
        let config = {
            url: '/getUserInfo',
            method: 'get',
        };
        axios(config).then(response => {
            if (response.status === 200) {
                if (response.data.code === 0) {
                    console.log(typeof (response.data.data))
                    console.log(response.data.data)
                    _this.setState({ 'userInfo': response.data.data })
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

    updateUser = () => {
        const _this = this;
        var formValue = this.props.form.getFieldsValue();
        var params = {
            phone: formValue.phone,
            name: formValue.name,
            gender: formValue.gender,
            birthDate: formValue.birthDate.hours(0).minutes(0).seconds(0).millisecond(0).valueOf()
        }
        
        let config = {
            url: '/updateUser',
            method: 'post',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: Qs.stringify(params),
        };
        axios(config).then(response => {
            if (response.status === 200) {
                if (response.data.code === 0) {
                    console.log(response);
                    Modal.info({ title:"提示", content: "成功" });
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
    }


    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <div>
                <br />
                &emsp;

                <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                    <FormItem label="手机号">
                        {getFieldDecorator('phone', {
                            rules: [{ required: true, message: '' }],
                            initialValue: this.state.userInfo == null ? null : this.state.userInfo.phone,
                        })(
                            <Input style={{ width: 400 }} />
                        )}
                    </FormItem>
                    <FormItem  label="用户身份">
                        {getFieldDecorator('role', {
                            rules: [{ required: true, message: '' }],
                            initialValue: this.state.userInfo == null ? '' : '' + this.state.userInfo.role,
                        })(
                            <Radio.Group buttonStyle="solid" disabled>
                                <Radio.Button value="0">患者</Radio.Button>
                                <Radio.Button value="1">医生</Radio.Button>
                                <Radio.Button value="2">管理员</Radio.Button>
                            </Radio.Group>
                        )}
                    </FormItem>
                    <FormItem  label="用户姓名">
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: '' }],
                            initialValue: this.state.userInfo == null ? null : this.state.userInfo.name,
                        })(
                            <Input style={{ width: 400 }} value={this.state.userInfo == null ? null : this.state.userInfo.name} />
                        )}
                    </FormItem>
                    <FormItem   label="性别">
                        {getFieldDecorator('gender', {
                            rules: [{ required: true, message: '' }],
                            initialValue: this.state.userInfo == null ? '' : this.state.userInfo.gender ? '1' : '0',
                        })(
                            <Radio.Group buttonStyle="solid">
                                <Radio.Button value="0">男</Radio.Button>
                                <Radio.Button value="1">女</Radio.Button>
                            </Radio.Group>
                        )}
                    </FormItem>
                    <FormItem   label="出生日期">
                        {getFieldDecorator('birthDate', {
                            rules: [{ required: true, message: '' }],
                            initialValue: this.state.userInfo == null ? null : moment(this.state.userInfo.birthDate),
                        })(
                            <DatePicker style={{ width: 400 }} value={this.state.userInfo == null ? '' : moment(this.state.userInfo.birthDate)} />

                        )}
                    </FormItem>
                    <Form.Item >
                        &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                            <Button type="primary" htmlType="submit" style={{ textAlign: "center" }} onClick={this.updateUser}>
                            提交
                            </Button>
                    </Form.Item>
                </Form>

            </div>
        );
    }
}

PersonalCenter = Form.create({})(PersonalCenter);
export default PersonalCenter;