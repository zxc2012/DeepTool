import React from 'react';
import './index.less';

class Footer extends React.Component {
    render() {
        return (
            <div className={this.props.isLogined ? "login-footer" : "logout-footer"}>
               版权所有：bk205（推荐使用谷歌浏览器，可以获得更佳操作页面体验） 技术支持：小岸子
            </div>
        );
    }
}

export default Footer;