import React from 'react';
import { Table, Input, Button, Modal } from 'antd';
import './index.less';
import axios from 'axios';

const { Search } = Input;

class CTAnalysis extends React.Component {

    state = {
        ctInfos: null,
        ctInfosShow: null,
        analysisIsVisible: false,
        correctIsVisible: false,
    };

    componentWillMount() {
        this.getCTInfos()
    }

    // 获取CT分析列表的总览信息
    getCTInfos = () => {
        const _this = this;
        let config = {
            url: '/getCTInfos',
            method: 'get',
        };
        axios(config).then(response => {
            if (response.status === 200) {
                if (response.data.code === 0) {
                    console.log(typeof (response.data.data))
                    console.log(response.data.data)
                    _this.setState({ 'ctInfos': response.data.data, 'ctInfosShow': response.data.data })
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

    // CT分析
    ctAnalysis = () => {
        Modal.info({ title:"提示", content: "未与后端连接，敬请期待" })
    }

    // 结果修正
    correctResult = () => {
        Modal.info({ title:"提示", content: "开发中，敬请期待" })
    }

    render() {

        const columns = [
            {
                title: 'CT序号',
                dataIndex: 'id',
                key: 'id',
            },
            {
                title: '检查日期',
                dataIndex: 'examinationDate',
                key: 'examinationDate',
            },
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '性别',
                dataIndex: 'gender',
                key: 'gender',
            },
            {
                title: '出生日期',
                dataIndex: 'birthDate',
                key: 'birthDate',
            },
            {
                title: "操作",
                key: "action",
                render: (text, record) => (
                    <span>
                        <Button icon="edit" onClick={() => this.ctAnalysis()}>智能分析</Button>
            &emsp;&emsp;&emsp;
                        <Button type="danger" icon="plus" onClick={() => this.correctResult()}>修正结果</Button>
                    </span>
                )
            },
        ];


        return (
            <div>
                <br />
                &emsp;
                <Search
                    placeholder="病人姓名"
                    enterButton="Search"
                    size="large"
                    style={{ width: 300 }}
                    onSearch={value => this.getCTInfosByName(value)}
                />
                &emsp;&emsp;&emsp;
                
                <br /><br />
                <Table columns={columns} dataSource={this.state.ctInfos} bordered />

            </div>
        );
    }
}

export default CTAnalysis;