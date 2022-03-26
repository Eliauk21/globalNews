import React, { useEffect, useState } from 'react'
import { getUsers, changeUsersState, deleteUsers, addUsers} from '../../api/users'
import { useSelector} from 'react-redux'
import { Table, Space,Button, Popconfirm, message, Modal, Switch, Form, Input, Select, Divider, Row } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import './UserList.css'

const { Option } = Select;

export default function UserList() {
  let user = useSelector((state)=>state.users).user;
  let [data, setData] = useState([]);
  let [isAddModalVisible, setIsAddModalVisible] = useState(false);
  let [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  let [confirmLoadingAdd, setConfirmLoadingAdd] = React.useState(false);
  let [confirmLoadingUpdate, setConfirmLoadingUpdate] = React.useState(false);
  let [addForm] = Form.useForm();    
  let [updateForm] = Form.useForm();
  let [isDisadled, setIsDisadled] = useState(false);
  let [isUpdateDisadled, setIsUpdateDisadled] = useState(false);
  let [item, setItem] = useState({});       //当前编辑用户

  useEffect(()=>{
    getAllUsers();
  },[])

  function getAllUsers(){
    getUsers().then((res)=>{
      /* console.log(res);
      console.log(user); */
      setData(user.roleId===1?res:[...res.filter(v=>v.id===user.id),...res.filter(v=>v.region===user.region&&v.roleId===3)]);
    })
  }

  //添加用户的model组件
  const showAddModal = () => {
    setIsAddModalVisible(true);
  };

  const handleAddCancel = () => {
    setIsAddModalVisible(false);
    addForm.resetFields();
    setIsDisadled(false);
  };

  //编辑用户的model组件
  const showUpdateModal = (item) => {
    return function(){
      setIsUpdateModalVisible(true);
      setItem(item);
      let rolename = item.role.roleName
      updateForm.setFieldsValue({...item,rolename});  //初始化
    };
  };

  const handleUpdateCancel = () => {
    setIsUpdateModalVisible(false);
    updateForm.resetFields();
    setIsUpdateDisadled(false);
  };

  //Popconfirm组件
  function confirm(item) {
    return function(){
      deleteUsers(item.id).then(()=>{
        message.success('删除成功');
        getAllUsers();
      }).catch(()=>{
        message.error('删除失败');
      })
    }
  }

  //switch组件
  function onChange(item){
    return function(){
      changeUsersState(item.id,!item.roleState).then(()=>{
        getAllUsers();
        message.success('修改状态成功');
      }).catch(()=>{
        message.error('修改状态失败');
      })
    }
  }

  //添加用户的form组件
  function handleAddSelect(value){
    if(value === '全球管理员'){
      setIsDisadled(true);
      addForm.setFieldsValue({region: '全球'});
    }else{
      setIsDisadled(false);
    }
  }

  function onAddFinish(values){
    setConfirmLoadingAdd(true);
    let username = values.email.substr(0,values.email.indexOf('@'));
    let roleId;
    let defaultname;
    if(values.rolename === '全球管理员'){
      defaultname = true;
    }else{
      defaultname = false;
    }
    if(values.rolename === '全球管理员'){
      roleId = 1;
    }else if(values.rolename === '区域管理员'){
      roleId = 2;
    }else{
      roleId = 3;
    }
    delete values.rolename
    let data = {
      ...values,
      username,
      default: defaultname,
      roleState: true,
      roleId
    }
    console.log(values);
    addUsers(data).then(()=>{
      message.success('添加成功');
      getAllUsers();
      addForm.resetFields();
      setIsAddModalVisible(false);
      setConfirmLoadingAdd(false);
      setIsDisadled(false);
    }).catch(()=>{
      message.error('添加失败');
      setIsAddModalVisible(false);
      setConfirmLoadingAdd(false);
      setIsDisadled(false);
    })
  };

  function onAddFinishFailed(errorInfo){
    console.log('Failed:', errorInfo);
  };

  //编辑用户的form组件
  function handleUpdateSelect(value){
    if(value === '全球管理员'){
      setIsUpdateDisadled(true);
      updateForm.setFieldsValue({region: '全球'})
    }else{
      setIsUpdateDisadled(false);       /* 此处有一小bug */
    }
  }

  function onUpdateFinish(values){
    /* setConfirmLoadingUpdate(true); */
    let username = values.email.substr(0,values.email.indexOf('@'));
    let roleId;
    let defaultname;
    if(values.rolename === '全球管理员'){
      defaultname = true;
    }else{
      defaultname = false;
    }
    if(values.rolename === '全球管理员'){
      roleId = 1;
    }else if(values.rolename === '区域管理员'){
      roleId = 2;
    }else{
      roleId = 3;
    }
    delete values.rolename
    let data = {
      ...values,
      username,
      default: defaultname,
      roleState: true,
      roleId
    }
    /* console.log(data);
    console.log(item); */         //先删后添->不管改了什么，密码都要重新设置      //没有修改，不要按确定->会更新
    deleteUsers(item.id).then(()=>{
      addUsers(data).then(()=>{
        message.success('更新成功');
        getAllUsers();
        updateForm.resetFields();
        setIsUpdateModalVisible(false);
        setConfirmLoadingUpdate(false);
        setIsDisadled(false);
      }).catch(()=>{
        message.error('更新失败（添加）');
        setIsUpdateModalVisible(false);
        setConfirmLoadingUpdate(false);
        setIsDisadled(false);
      })
    }).catch(()=>{
      message.error('更新失败（删除）');
    })
  };

  function onUpdateFinishFailed(errorInfo){
    console.log('Failed:', errorInfo);
  };

  //table组件
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters: [
        {
          text: '亚洲',
          value: '亚洲',
        },
        {
          text: '非洲',
          value: '非洲',
        },
        {
          text: '北美洲',
          value: '北美洲',
        },
        {
          text: '南美洲',
          value: '南美洲',
        },
        {
          text: '欧洲',
          value: '欧洲',
        },
        {
          text: '大洋洲',
          value: '大洋洲',
        },
        {
          text: '南极洲',
          value: '南极洲',
        },
      ],
      onFilter: (value, record) => record.region.indexOf(value) === 0
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render:(role)=>{
        return role?.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username'
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render:(roleState,item)=><Switch checked={roleState} onChange={onChange(item)} disabled={item.default} />
    },
    {
      title: '操作',
      dataIndex: 'tags',
      render: (tags,item)=><Space>
        <Popconfirm
          title="确定删除此用户?"
          onConfirm={confirm(item)}
          okText="Yes"
          cancelText="No"
        >                      
          <Button danger shape="circle" icon={<DeleteOutlined />} disabled={item.default}></Button>
        </Popconfirm>           {/* 两个select禁用 */}
        <Button shape="circle" icon={<EditOutlined />} disabled={item.default} onClick={showUpdateModal(item)}></Button>
        <Modal title="用户编辑" visible={isUpdateModalVisible} onCancel={handleUpdateCancel} footer={null}>
          <Form
            name="updateForm"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            onFinish={onUpdateFinish}
            onFinishFailed={onUpdateFinishFailed}
            autoComplete="off"
            form={updateForm}
            initialValues={{}}
          >      
            <Form.Item
              label="邮箱"
              name="email"
              rules={[{ required: true, message: '请输入用户名!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="密码"
              name="password"
              rules={[{ required: true, message: '请输入密码!' }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label="区域"
              name="region"
              rules={[{ required: true, message: '请输入区域!' }]}
            >
              <Select style={{ width: 314 }} disabled={isUpdateDisadled}>  
                <Option disabled={user.roleId!==1} value="亚洲">亚洲</Option>
                <Option disabled={user.roleId!==1} value="非洲">非洲</Option>
                <Option disabled={user.roleId!==1} value="南极洲">南极洲</Option>
                <Option disabled={user.roleId!==1} value="北美洲">北美洲</Option>
                <Option disabled={user.roleId!==1} value="南美洲">南美洲</Option>
                <Option disabled={user.roleId!==1} value="欧洲">欧洲</Option>
                <Option disabled={user.roleId!==1} value="大洋洲">大洋洲</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="角色"
              name="rolename"
              rules={[{ required: true, message: '请输入角色!' }]}
            >
              <Select style={{ width: 314 }} onSelect={handleUpdateSelect}>
                <Option value="全球管理员" disabled={user.roleId!==1}>全球管理员</Option>
                <Option value="区域管理员" disabled={user.roleId!==1}>区域管理员</Option>
                <Option value="区域编辑" disabled={user.roleId!==1}>区域编辑</Option>
              </Select>
            </Form.Item>
            <Divider />
            <Row justify="end">
              <Space>
                <Button onClick={handleUpdateCancel}>
                  取消
                </Button>
                <Button type="primary" htmlType="submit" loading={confirmLoadingUpdate} > 
                  确定
                </Button>
              </Space>
            </Row>
          </Form>
        </Modal>
      </Space>
    }
  ];

  return (
    <>
      <Button type="primary" style={{marginBottom: '10px'}} onClick={showAddModal}>添加用户</Button>
      <Modal title="用户添加" visible={isAddModalVisible} onCancel={handleAddCancel} footer={null}>
        <Form         /*  roleId=2  两个select禁用，设默认值 */
          name="addForm"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          onFinish={onAddFinish}
          onFinishFailed={onAddFinishFailed}
          autoComplete="off"
          form={addForm}
          initialValues={{
            region: ''
          }}
        >
          <Form.Item
            label="邮箱"
            name="email"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="区域"
            name="region"
            rules={[{ required: true, message: '请输入区域!' }]}
          >
            <Select style={{ width: 314 }} disabled={isDisadled}>
              <Option disabled={user.region!=='全球'&&user.region!=='亚洲'} value="亚洲">亚洲</Option>
              <Option disabled={user.region!=='全球'&&user.region!=='非洲'} value="非洲">非洲</Option>
              <Option disabled={user.region!=='全球'&&user.region!=='南极洲'} value="南极洲">南极洲</Option>
              <Option disabled={user.region!=='全球'&&user.region!=='北美洲'} value="北美洲">北美洲</Option>
              <Option disabled={user.region!=='全球'&&user.region!=='南美洲'} value="南美洲">南美洲</Option>
              <Option disabled={user.region!=='全球'&&user.region!=='欧洲'} value="欧洲">欧洲</Option>
              <Option disabled={user.region!=='全球'&&user.region!=='大洋洲'} value="大洋洲">大洋洲</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="角色"
            name="rolename"
            rules={[{ required: true, message: '请输入角色!' }]}
          >
            <Select style={{ width: 314 }} onSelect={handleAddSelect}>
              <Option value="全球管理员" disabled={user.roleId!==1}>全球管理员</Option>
              <Option value="区域管理员" disabled={user.roleId!==1}>区域管理员</Option>
              <Option value="区域编辑">区域编辑</Option>
            </Select>
          </Form.Item>
          <Divider />
          <Row justify="end">
            <Space>
              <Button onClick={handleAddCancel}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={confirmLoadingAdd} > 
                确定
              </Button>
            </Space>
          </Row>
        </Form>
      </Modal>
      <Table columns={columns} dataSource={data} pagination={{defaultPageSize: 5}} rowKey={item=>item.id}/>
    </>
  )
}

