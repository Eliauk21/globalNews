import React from 'react'
import { useNavigate } from 'react-router-dom'; 
import { PageHeader } from 'antd';
import './NoPermision.css'

export default function NoPermision() {
  let navigate = useNavigate();
  return (
    <>
      <PageHeader
        onBack={() => { navigate('/') }}  
        title='抱歉您没有权限浏览当前页面'
      ></PageHeader>
      <img src="https://om.meldingcloud.com/webframework/img/401.png" style={{width: '100%'}}/>
    </>
  )
}
