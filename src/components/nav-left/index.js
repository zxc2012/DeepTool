import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import { connect } from 'react-redux';
import menus from '../../router/config';
import './index.less';

const { Sider } = Layout;

const renderMenuItem = (
    item
) => (
        <Menu.Item key={item.key}>
            <NavLink to={(item.route || item.key) + (item.query || '')}>
                {item.icon && <Icon type={item.icon} />}
                <span className="nav-text">{item.title}</span>
            </NavLink>
        </Menu.Item>
    );

const renderSubMenu = item => (
    <Menu.SubMenu
        key={item.key}
        title={
            <span>
                {item.icon && <Icon type={item.icon} />}
                <span className="nav-text">{item.title}</span>
            </span>
        }
    >
        {item.subs.map(item => renderMenuItem(item))}
    </Menu.SubMenu>
);


class NavLeft extends React.Component {
    state = {
        collapsed: false,
        mode: 'inline',
        openKey: '',
        selectedKey: '',
        firstHide: true, // 点击收缩菜单，第一次隐藏展开子菜单，openMenu时恢复
    };

    menuClick = e => {
        this.setState({ selectedKey: e.key });
    };

    onCollapse = collapsed => {
        this.setState({ collapsed });
    };

    openMenu = v => {
        this.setState({
            openKey: v[v.length - 1],
            firstHide: false,
        })
    };

    setOpenKey = () => {
      const {pathname} = this.props.location;
      let path = pathname.split('/');
      
      if(pathname.split('/').length>3){
        path = path[path.length-2];
        let PathObj = {
          'ct-manager': '/app/ct-manager',
          'ct1-manager': '/app/ct-manager',
          'model-manager': '/app/model-manager',
          'replay-manager': '/app/model-manager',
          'patient-manager': '/app/user-manager',
          'doctor-manager': '/app/user-manager',
          'auditDoctor-manager': '/app/user-manager',
        }
        this.setState({openKey: `${PathObj[path]}`})
      }
    };
    componentDidMount(){
      this.setOpenKey();
    }
    render() {
        // const { role } = this.props;
        // console.log(this.props)
        let role = +sessionStorage.getItem('roleId');        
        const { selectedKey, openKey, firstHide, collapsed } = this.state;
        const { pathname } = this.props.location;
        let menu;
        switch (role) {
            case 3: menu = menus.patientMenu; break;
            case 2: menu = menus.doctorMenu; break;
            case 1: menu = menus.adminMenu; break;
            default: menu = null;
        }
        // 调试
        // menu = menus.doctorMenu;

        return (
            <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
                <Menu
                    key='menu'
                    theme="dark"
                    // defaultSelectedKeys={['/app/dashboard/index']}
                    mode="inline"
                    onClick={this.menuClick}
                    selectedKeys={[pathname]}
                    openKeys={[openKey]}
                    onOpenChange={this.openMenu}
                >
                    {menu.map((item, index) => (
                        item.subs ? renderSubMenu(item) : renderMenuItem(item)
                    ))}
                </Menu>
            </Sider>
        );
    }
}

const mapStateToProps = state => ({
    role: state.role,
})

export default connect(mapStateToProps)(withRouter(NavLeft));
