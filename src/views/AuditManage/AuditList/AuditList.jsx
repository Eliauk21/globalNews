import React, { useState, useEffect } from 'react'
import { useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom';  
import { getAuditNews, auditNews, publishNews} from '../../../api/news'
import { Table, Button, message, notification } from 'antd';
import { LoadingOutlined, CloseCircleTwoTone, CheckCircleTwoTone } from '@ant-design/icons';
import './AuditList.css'

export default function AuditList() {
  let user = useSelector((state)=>state.users).user;
  let navigate = useNavigate();
  let [auditData, setAuditData] = useState([]);

  useEffect(()=>{
    getAuditNewsData();
  },[])

  function getAuditNewsData(){    
    getAuditNews(user.username).then((res)=>{
      console.log(res);
      setAuditData(res);
    });
  }

  //button组件
  function toPreview(id){
    return function(){
      navigate(`/index/news-manage/preview/${id}`);
    }
  }

  function toCancel(id){
    return function(){
      auditNews(id).then(()=>{
        openttoDraftNotification('bottomRight');
        getAuditNewsData();
      }).catch(()=>{
        message.error('撤销失败');
      })
    }
  }

  function toPublish(id){
    return function(){
      let publishTime = new Date().getTime()
      publishNews(id, publishTime).then(()=>{
        openPublishNotification('bottomRight');
        getAuditNewsData();
      }).catch(()=>{
        message.error('发布失败');
      })
    }
  }

  function toAudit(id){
    return function(){
      navigate(`/index/news-manage/update/${id}`);
    }
  }

  ////Notification组件
  const openttoDraftNotification = (placement) => {
    console.log(placement);
    notification.info({
      message: `撤销成功`,
      description:
        `您可以到草稿箱中查看您的新闻`,
      placement,
    });
  };

  const openPublishNotification = (placement) => {
    console.log(placement);
    notification.info({
      message: `发布成功`,
      description:
        `您可以到发布列表中查看您的新闻`,
      placement,
    });
  };

  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      key: 'title',
      render:(title,item)=><a onClick={toPreview(item.id)}>{title}</a>
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      key: 'category',
      render:(category)=><span>{category?.value}</span>
    },
    {
      title: '审核状态',
      dataIndex: 'auditState',
      key: 'auditState',
      render:(auditState)=>auditState===1?<LoadingOutlined style={{fontSize: '24px'}}/>:
        auditState===2?<CheckCircleTwoTone twoToneColor="#52c41a" style={{fontSize: '24px'}}/>:<CloseCircleTwoTone twoToneColor="#eb2f96" style={{fontSize: '24px'}}/>
    },
    {
      title: '操作',
      key: 'tags',
      dataIndex: 'tags',
      render: (tags,item)=>item.auditState===1?<Button type="primary" onClick={toCancel(item.id)}>撤销</Button>:
        item.auditState===2?<Button type="primary" onClick={toPublish(item.id)}>发布</Button>:
        <Button type="primary" onClick={toAudit(item.id)}>修改</Button>
    }
  ];
  return (
    <div>
      <Table columns={columns} dataSource={auditData} pagination={{pageSize: 5}} rowKey={item=>item.id}/>
    </div>
  )
}
