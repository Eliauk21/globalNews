import React, { useEffect, useState } from 'react'
import { Table, Tag, Space,Button, Popconfirm, message, Popover, Switch  } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {getRights, deleteRights, patchRights} from '../../../api/rights'
import './RightList.css'

export default function RightList() {
  let [data, setData] = useState([]);

  useEffect(()=>{
    getData();
  },[])

  function getData(){
    getRights().then((res)=>{
      //console.log(res);
      setData(res);
    });
  }
  function confirm(item) {
    return function(){
      deleteRights(item).then(()=>{
        message.success('删除成功');
        getData();
      }).catch(()=>{
        message.error('删除失败');
      })
    }
  }
  function onChange(item){
    return function(){
      patchRights(item).then((res)=>{
        message.success('编辑成功');
        getData();
      }).catch(()=>{
        message.error('编辑失败');
      });
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '权限名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      key: 'key',
      render:(key)=><Tag color="blue">{key}</Tag>
    },
    {
      title: '操作',
      key: 'tags',
      dataIndex: 'tags',
      render: (tags,item)=><Space>
        <Popconfirm
          title="确定删除此权限?"
          onConfirm={confirm(item)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger shape="circle" icon={<DeleteOutlined />}></Button>
        </Popconfirm>
        <Popover content={<Switch defaultChecked={item.pagepermission} onChange={onChange(item)} />} title="页面配置项" trigger="click" >
          <Button shape="circle" icon={<EditOutlined />} disabled={item.pagepermission===undefined}></Button>
        </Popover>
      </Space>
    }
  ];
  
  return (
    <Table columns={columns} dataSource={data} pagination={{defaultPageSize: 3}}/>
  )
}
