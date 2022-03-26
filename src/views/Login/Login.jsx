import React from 'react'
import { Form, Input, Button, message} from 'antd'; 
import { useNavigate } from 'react-router-dom';     
import { login } from '../../api/users'    
import storage from '../../utils/storage';  
import {useDispatch} from 'react-redux' 
import Particles from "react-tsparticles";
import particlesOptions from "./particles.json";
import './Login.css'


export default function Login() {
  let navigate = useNavigate();
  let dispatch = useDispatch();
  const onFinish = (values) => {
     //json-server-auth只能验证密码
    login(values).then((res)=>{
      /* console.log(res); */
      if(res.user.roleState === false){   //roleState的权限拦截
        navigate('/noPermision');
        return;
      }
      storage.set('users',res);   
      dispatch({
        type:'USERS_UPDATE',
        payload:res     //初始化数据
      })
      message.success('登录成功');
      navigate('/index/oa/home');
    }).catch((res)=>{
      message.error('登陆失败')
    })
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <>
      <Particles options={particlesOptions}/>
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className="Login"
      >
        <Form.Item
          label="邮箱"
          name="email"
          rules={[
            {
              required: true,
              message: '请输出正确的邮箱地址',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[
            {
              required: true,
              message: '请输出正确的密码',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            登录
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}
