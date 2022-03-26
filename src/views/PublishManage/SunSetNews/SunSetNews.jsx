import React, { useState, useEffect } from 'react'
import { useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom';  
import { getSunsetNews, deleteNews } from '../../../api/news'
import { Table, Button, message, notification } from 'antd';
import './SunSetNews.css'

export default function SunSetNews() {
  let user = useSelector((state)=>state.users).user;
  let navigate = useNavigate();
  let [sunsetNews, setSunsetNews] = useState([]);

  useEffect(()=>{
    getSunsetNewsData();
  },[])

  function getSunsetNewsData(){    
    getSunsetNews(user.username).then((res)=>{
      //console.log(res);
      setSunsetNews(res);
    });
  }

  //button组件
  function toPreview(id){
    return function(){
      navigate(`/index/news-manage/preview/${id}`);
    }
  }

  function toDelete(id){
    return function(){
      deleteNews(id).then(()=>{
        getSunsetNews();
        openNotification('bottomRight');
      }).catch(()=>{
        message.error('删除失败');
      })
    }
  }

  const openNotification = (placement) => {
    //console.log(placement);
    notification.info({
      message: `删除成功`,
      description:
        `您将不会看到此条新闻`,
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
      render: (tags,item)=><Button type="primary" onClick={toDelete(item.id)}>删除</Button>
    }
  ];
  return (
    <div>
      <Table columns={columns} dataSource={sunsetNews} rowKey={item=>item.id} pagination={{pageSize: 5}}/>
    </div>
  )
}
