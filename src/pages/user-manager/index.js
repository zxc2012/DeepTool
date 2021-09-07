import React from 'react';
import { Table, Input, Button, Radio, Tag } from 'antd';
// import TableHeader from '../../components/table-header';
import './index.less';

// const { Column } = Table;
const { Search } = Input;

class Record extends React.Component {

    render() {
        const data = [
            {
                id: '1',
                name: '张宇',
                gender: '男',
                birthdate: '1978-05-03',
                phone: '13156337854',

            },
            {
                id: '2',
                name: '杨沐',
                gender: '男',
                birthdate: '1987-03-04',
                phone: '13358764246',
            },
            {
                id: '3',
                name: '白艾玲',
                gender: '女',
                birthdate: '1990-08-07',
                phone: '13865387997',
            },
            {
                id: '4',
                name: '陈子超',
                gender: '男',
                birthdate: '1998-04-23',
                phone: '13725467859',
            },
            {
                id: '5',
                name: '梅露',
                gender: '女',
                birthdate: '1993-08-01',
                phone: '157866578845',
            },
            {
                id: '6',
                name: '张倩倩',
                gender: '女',
                birthdate: '1994-10-10',
                phone: '15357664885',
            },
            {
                id: '7',
                name: '张文威',
                gender: '男',
                birthdate: '1989-03-28',
                phone: '15678429533',
            },
            {
                id: '8',
                name: '姚凯',
                gender: '男',
                birthdate: '1984-04-16',
                phone: '18845638865',
            },
            {
                id: '9',
                name: 'Bob',
                gender: 'man',
                birthdate: '2020-01-01',
                phone: '15715798845',
            },
            {
                id: '10',
                name: 'Bob',
                gender: 'man',
                birthdate: '2020-01-01',
                phone: '15715798845',
            },
        ];

        const columns = [
            {
                title: '序号',
                dataIndex: 'id',
                key: 'id',
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
                dataIndex: 'birthdate',
                key: 'birthdate',
            },
            {
                title: '手机号码',
                dataIndex: 'phone',
                key: 'phone',
            },
            {
                title: '人员类型',
                dataIndex: 'type',
                key: 'type',
                render: type => (
                    <div>
                        <Radio.Group buttonStyle="solid">
                            <Radio.Button value="horizontal" >管理员</Radio.Button>
                            <Radio.Button value="vertical" >医生</Radio.Button>
                            <Radio.Button value="vertical2" >普通用户</Radio.Button>
                        </Radio.Group>
                    </div>
                )
            },

            {
                title: "操作",
                key: "action",
                render: (text, record) => (
                    <span>
                        <Button icon="edit" onClick={() => this.markCT()}>查看详情</Button>
                        <Button type="danger" icon="plus" onClick={() => console.log()}>删除用户</Button>
                    </span>
                )
            },
        ];

        const columns2 = [
            {
              title: 'Name',
              dataIndex: 'name',
              key: 'name',
              render: text => <a>{text}</a>,
            },
            {
              title: 'Age',
              dataIndex: 'age',
              key: 'age',
            },
            {
              title: 'Address',
              dataIndex: 'address',
              key: 'address',
            },
            {
              title: 'Tags',
              key: 'tags',
              dataIndex: 'tags',
              render: tags => (
                <>
                  {tags.map(tag => {
                    let color = tag.length > 5 ? 'geekblue' : 'green';
                    if (tag === 'loser') {
                      color = 'volcano';
                    }
                    return (
                      <Tag color={color} key={tag}>
                        {tag.toUpperCase()}
                      </Tag>
                    );
                  })}
                </>
              ),
            },
            {
              title: 'Action',
              key: 'action',
              render: (text, record) => (
 
                <a>Delete</a>
              ),
            },
          ];
          
          const data2 = [
            {
              key: '1',
              name: 'John Brown',
              age: 32,
              address: 'New York No. 1 Lake Park',
              tags: ['nice', 'developer'],
            },
            {
              key: '2',
              name: 'Jim Green',
              age: 42,
              address: 'London No. 1 Lake Park',
              tags: ['loser'],
            },
            {
              key: '3',
              name: 'Joe Black',
              age: 32,
              address: 'Sidney No. 1 Lake Park',
              tags: ['cool', 'teacher'],
            },
          ];


        return (
            <div>
                <br />
                &emsp;
                <Search
                    placeholder="搜索用户"
                    enterButton="Search"
                    size="large"
                    style={{ width: 300 }}
                    onSearch={value => console.log(value)}
                />
                &emsp;&emsp;&emsp;
                <Button type="danger" icon="plus" size="large" onClick={() => console.log()}>添加管理员账号</Button>
                <br /><br />
                <Table columns={columns} dataSource={data} bordered />
                <Table columns={columns2} dataSource={data2} bordered />
            </div>
        );
    }
}

export default Record;