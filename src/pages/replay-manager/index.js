import React from 'react';
import { Input, Form, Select, Switch, Button } from 'antd';
import './index.less';

const { TextArea } = Input;

class Record extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="trainContainer">
        <Form labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
          <Form.Item label="模型类别">
            <Select style={{ width: 250 }} value="1">
              <Select.Option value="1">模型1</Select.Option>
              <Select.Option value="2">模型2</Select.Option>
              <Select.Option value="3">模型3</Select.Option>
              <Select.Option value="4">模型4</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="模型名称">
            <Input placeholder="模型名称" value="模型名称"/>
          </Form.Item>
          <Form.Item label="Batch Size">
            <Input placeholder="Batch Size" value="64"/>
          </Form.Item>
          <Form.Item label="Epoch">
            <Input placeholder="Epoch" value="100"/>
          </Form.Item>
          <Form.Item label="学习率">
            <Input placeholder="学习率" value="0.01"/>
          </Form.Item>
          <Form.Item label="优化器">
            <Select style={{ width: 250 }} value="1">
              <Select.Option value="1">优化器1</Select.Option>
              <Select.Option value="2">优化器2</Select.Option>
              <Select.Option value="3">优化器3</Select.Option>
              <Select.Option value="4">优化器4</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="在线学习">
            <Switch defaultChecked />
          </Form.Item>
          <Form.Item label="模型备注">
            <TextArea value="12312312"></TextArea>
          </Form.Item>
          <Form.Item className="btnCtrl">
            <Button type="primary">开始训练</Button>&emsp;&emsp;<Button>取消</Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Record;