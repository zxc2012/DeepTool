import React from 'react';
import { Radio } from 'antd';

class RecordTable extends React.Component {
    render() {
        return (
            <div>
                <p>请选择录入健康数据类型</p>
                <Radio.Group defaultValue="a" buttonStyle="solid">
                    <Radio.Button value="a">Hangzhou</Radio.Button>
                    <Radio.Button value="b">Shanghai</Radio.Button>
                    <Radio.Button value="c">Beijing</Radio.Button>
                    <Radio.Button value="d">Chengdu</Radio.Button>
                </Radio.Group>
            </div>
        );
    }
}

export default RecordTable;