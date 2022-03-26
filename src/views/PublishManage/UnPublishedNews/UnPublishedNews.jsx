import React, { useState, useEffect } from 'react'
import { useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom';  
import { getUnPublishNews, publishNews } from '../../../api/news'
import { Table, Button, message, notification } from 'antd';
import './UnPublishedNews.css'

export default function UnPublishedNews() {
  let user = useSelector((state)=>state.users).user;
  let navigate = useNavigate();
  let [unPublishNewsData, setUnPublishNewsData] = useState([]);

  useEffect(()=>{
    getUnPublishNewsData();
  },[])

  function getUnPublishNewsData(){    
    getUnPublishNews(user.username).then((res)=>{
      //console.log(res);
      setUnPublishNewsData(res);
    });
  }

  //button组件
  function toPreview(id){
    return function(){
      navigate(`/index/news-manage/preview/${id}`);
    }
  }

  function toPublish(id){
    return function(){
      let publishTime = new Date().getTime()
      publishNews(id, publishTime).then(()=>{
        getUnPublishNewsData();
        openNotification('bottomRight');
      }).catch(()=>{
        message.error('发布失败');
      })
    }
  }

  const openNotification = (placement) => {
    //console.log(placement);
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
      title: '操作',
      key: 'tags',
      dataIndex: 'tags',
      render: (tags,item)=><Button type="primary" onClick={toPublish(item.id)}>发布</Button>
    }
  ];
  return (
    <div>
      <Table columns={columns} dataSource={unPublishNewsData} rowKey={item=>item.id} pagination={{pageSize: 5}}/>
    </div>
  )
}
