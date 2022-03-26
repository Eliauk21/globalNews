import React, { useState, useEffect } from 'react'
import { Table, Space,Button, Popconfirm, message, Modal, Tree  } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {getRoles, deleteRoles, patchRoles} from '../../../api/roles'
import {getRights } from '../../../api/rights'
import './RoleList.css'

export default function RoleList() {
  let [data, setData] = useState([]);
  let [treeData, setTreeData] = useState([]); 
  let [checkData, setCheckData] = useState([]); 
  let [id, setId] = useState(0); 
  const [isModalVisible, setIsModalVisible] = useState(false);

  
  useEffect(()=>{
    getRolesData();
    getRights().then((res)=>{   //获取树形结构数据（rights）
      setTreeData(res);
    })
  },[])

  function getRolesData(){     //获取Table的数据（roles）
    getRoles().then((res)=>{
      setData(res);
    });
  }

  //model组件
  const showModal = (item, checkData) => {
    return function(){
      setIsModalVisible(true);
      setCheckData(item.rights);    
      setId(item.id);     
    }
  };

  const handleOk = () => {
    setIsModalVisible(false);
    patchRoles(id, {rights: checkData}).then((res)=>{
      message.success('修改成功');
      getRolesData()      //修改成功，重新获取roles数据
    }).catch(()=>{
      message.error('修改失败');
    })
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  //Popconfirm组件
  function confirm(item) {
    return function(){
      deleteRoles(item).then(()=>{
        message.success('删除成功');
        getRolesData();
      }).catch(()=>{
        message.error('删除失败');
      })
    }
  }

  //Tree组件
  const onCheck = (checkedKey) => {
    setCheckData(checkedKey);   //修改当前页面的显示
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
    },
    {
      title: '操作',
      key: 'tags',
      dataIndex: 'tags',
      render: (tags,item)=><Space>
        <Popconfirm
          title="确定删除此角色?"
          onConfirm={confirm(item)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger shape="circle" icon={<DeleteOutlined />}></Button>
        </Popconfirm>
        <>
          <Button shape="circle" icon={<EditOutlined />} onClick={showModal(item)}></Button>
          <Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            <Tree
              checkable
              onCheck={onCheck}
              checkedKeys={checkData}
              treeData={treeData}
            />    
            {/* 默认defaultCheckedKeys是非受控组件，checkedKeys是受控组件 */}
            {/* 由于Modal后弹出，checkedKeys={item.rights}不会遍历所有，得到的是最后一个 */}
          </Modal>
        </>
      </Space>
    }
  ];
  return (
    <Table columns={columns} dataSource={data} pagination={{defaultPageSize: 5}} rowKey={item=>item.id}/>
  )
}
