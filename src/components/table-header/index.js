import React from 'react';
import { Input } from "antd";
import './index.less';

const { Search } = Input;

class TableHeader extends React.Component {
    render() {
        return (
            <div className="table-header" >
                <p>{this.props.title}</p>
                <Search placeholder="搜索" onSearch={value => console.log(value)} />
            </div>
        );
    }
}

export default TableHeader;