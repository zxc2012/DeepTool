import React from 'react';
import { Layout } from 'antd';
import { connect } from 'react-redux';
import Header from '../components/header';
// import Footer from '../components/footer';
import NavLeft from '../components/nav-left';
import { Redirect } from 'react-router-dom';


const { Content } = Layout;

class Admin extends React.Component {
    
    constructor(props) {
      super(props);
      this.state = {
        role: -1
      };
    }
    componentWillMount() {
      let role = sessionStorage.getItem('roleId');
      if (role) {
        this.setState({
          role: +role
        });
      }
    }
    render() {
        const { role } = this.state;
        if (!(role === 1 || role === 2 || role === 3)) {
            return ( <Redirect to="/login" /> );
        }

        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Header />
                <Layout>
                  <NavLeft role={role} />
                  <Content style={{ margin: '0 16px' }}>
                      {/* <Breadcrumb style={{ margin: '16px 0' }}>
                          <Breadcrumb.Item>User</Breadcrumb.Item>
                          <Breadcrumb.Item>Bill</Breadcrumb.Item>
                      </Breadcrumb> */}
                      
                      {/* <div style={{ padding: 24, background: '#fff', minHeight: '80vh' }}> */}
                      {this.props.children}
                      {/* </div> */}
                  </Content>
                    {/* <Footer isLogined={true}/> */}
                </Layout>
            </Layout>
        );
        
    }
}

const mapStateToProps = state => ({
    role: state.role,
})

export default connect(mapStateToProps)(Admin);