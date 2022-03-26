import React, { useState, useEffect } from 'react'
import { useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom';  
import { getPublishNews, sunsetNews } from '../../../api/news'
import { Table, Button, message, notification } from 'antd';
import './PublishedNews.css'

export default function PublishedNews() {
  let user = useSelector((state)=>state.users).user;
  let navigate = useNavigate();
  let [publishData, setPublishData] = useState([]);

  useEffect(()=>{
    getPublishNewsData();
  },[])

  function getPublishNewsData(){    
    getPublishNews(user.username).then((res)=>{
      //console.log(res);
      setPublishData(res);
    });
  }

  //button组件
  function toPreview(id){
    return function(){
      navigate(`/index/news-manage/preview/${id}`);
    }
  }

  function toSunset(id){
    return function(){
      sunsetNews(id).then(()=>{
        getPublishNewsData();
        openNotification('bottomRight');
      }).catch(()=>{
        message.error('下线失败');
      })
    }
  }

  const openNotification = (placement) => {
    //console.log(placement);
    notification.info({
      message: `下线成功`,
      description:
      `您可以到下线列表中查看您的新闻`,
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
      title: '操作',
      key: 'tags',
      dataIndex: 'tags',
      render: (tags,item)=><Button type="primary" onClick={toSunset(item.id)}>下线</Button>
    }
  ];
  return (
    <div>
      <Table columns={columns} dataSource={publishData} rowKey={item=>item.id} pagination={{pageSize: 5}}/>
    </div>
  )
}
