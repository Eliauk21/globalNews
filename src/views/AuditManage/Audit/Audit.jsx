import React, { useState, useEffect } from 'react'
import { useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom';  
import { getAuditingNews, successNews, failNews} from '../../../api/news'
import { Table, Button, Space, notification, message } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import './Audit.css'

export default function Audit() {
  let user = useSelector((state)=>state.users).user;
  let navigate = useNavigate();
  let [auditingData, setAuditingData] = useState([]);

  useEffect(()=>{
    getAuditingNewsData();
  },[])

  function getAuditingNewsData(){    
    getAuditingNews().then((res)=>{
      //console.log(res);
      //console.log(user);
      if(user.roleId===1){
        setAuditingData(res);
      }else{          //不是全球管理员，只显示地区下的news
        setAuditingData(res.filter(v=>v.region === user.region));
      }
    });
  }

  //button组件
  function toPreview(id){
    return function(){
      navigate(`/index/news-manage/preview/${id}`);
    }
  }

  function auditNewsSubmit(auditState,id){
    return function(){
      console.log(id);
      if(auditState===2){
        successNews(id).then(()=>{
          openSuccessNotification('bottomRight');
          getAuditingNewsData()
        }).catch(()=>{
          message.error('审核失败');
        })
      }else{
        failNews(id).then(()=>{
          openFailAuditNotification('bottomRight');
          getAuditingNewsData()
        }).catch(()=>{
          message.error('审核失败');
        })
      }
    }
  }

  //Notification组件
  const openSuccessNotification = placement => {
    console.log(placement);
    notification.info({
      message: `审核通过`,
      description:
        '您可以到审核列表中查看您审核过的新闻',
      placement,
    });
  };

  const openFailAuditNotification = (placement) => {
    console.log(placement);
    notification.info({
      message: `审核未通过`,
      description:
        `您可以到审核列表中查看您审核过的新闻`,
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
      render:(category)=><span>{category.value}</span>
    },
    {
      title: '操作',
      key: 'tags',
      dataIndex: 'tags',
      render: (tags,item)=><Space>
        <Button shape="circle" icon={<CheckOutlined />} onClick={auditNewsSubmit(2,item.id)}></Button>
        <Button shape="circle" icon={<CloseOutlined />} danger onClick={auditNewsSubmit(3,item.id)}></Button>
      </Space>
    }
  ];
  return (
    <div>
      <Table columns={columns} dataSource={auditingData} pagination={{pageSize: 5}} rowKey={item=>item.id}/>
    </div>
  )
}
