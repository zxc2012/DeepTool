import React from 'react';
import { Layout, Menu, Modal, Icon } from "antd";
import { UserOutlined } from '@ant-design/icons'
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import './index.less';
const { SubMenu } = Menu;

class Header extends React.Component {
  state = {}

  componentWillMount() {
    let role = sessionStorage.getItem('roleId');
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (role) {
      this.setState({
        role: +role
      });
    }
    if (userInfo) {
      this.setState({
        userInfo
      })
    }
  }

  logout = () => {
    let config = {
      url: '/user/logout',
      method: 'post'
    };
    axios(config).then(response => {
      if (response.status === 200) {
        if (response.data.success) {
          localStorage.removeItem('userInfo');
          sessionStorage.removeItem('roleId');
          this.setState({
            role: -1
          });
        } else {
            // Modal.info({ title:"提示", content: response.data.msg });
            Modal.info({ title:"提示", content: response.data.msg });
        }
      } else {
        Modal.info({ title:"提示", content: "登出出错" });
      }
    })
  }
  
  render() {
    const { role, userInfo } = this.state;
    if (!(role === 1 || role === 2 || role === 3)) {
        return ( <Redirect to="/login" /> );
    }

    return (
      <Layout.Header className="header">
        <div className="title">肺部传染病辅助诊疗系统</div>
        <Menu
          theme="dark"
          mode="horizontal"
          
        >
          <Menu.Item><Icon type="user" />{userInfo.nickname}</Menu.Item>
          <Menu.Item key="logout"><Icon type="logout" /><span onClick={this.logout}>退出登录</span></Menu.Item>
        </Menu>
      </Layout.Header>
    );
  }
}

export default Header;