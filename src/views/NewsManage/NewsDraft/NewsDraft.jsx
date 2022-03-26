import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';  
import { useSelector} from 'react-redux'
import { getNews, deleteNews, uploadNews} from '../../../api/news'
import { Table, Space,Button, Popconfirm, message, notification } from 'antd';
import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import './NewsDraft.css'

export default function NewsDraft() {
  let user = useSelector((state)=>state.users).user;
  let navigate = useNavigate();
  let [data, setData] = useState([]);

  useEffect(()=>{
    getNewsData();
  },[])

  function getNewsData(){    
    getNews(user.username).then((res)=>{
      /* console.log(res); */
      setData(res);
    });
  }

  //Popconfirm组件
  function confirm(item) {
    return function(){
      console.log(item);
      deleteNews(item.id).then(()=>{
        message.success('删除成功');
        getNewsData();
      }).catch(()=>{
        message.error('删除失败');
      })
    }
  }

  //button组件
  function toPreview(id){
    return function(){
      navigate(`/index/news-manage/preview/${id}`);
    }
  }

  function toUpdate(id){
    return function(){
      navigate(`/index/news-manage/update/${id}`);
    }
  }

  function toUploade(id){
    return function(){
      uploadNews(id).then(()=>{
        openUploadNotification('bottomRight');
        getNewsData();
      })
    }
  }

  ////Notification组件
  const openUploadNotification = (placement) => {
    console.log(placement);
    notification.info({
      message: `上传成功`,
      description:
        `您可以到审核列表中查看您的新闻`,
      placement,
    });
  };

  //table组件
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
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
        <Popconfirm
          title="确定删除此条新闻?"
          onConfirm={confirm(item)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger shape="circle" icon={<DeleteOutlined />}></Button>
        </Popconfirm>
        <Button shape="circle" icon={<EditOutlined />} onClick={toUpdate(item.id)}></Button>
        <Button shape="circle" icon={<UploadOutlined />} type="primary" onClick={toUploade(item.id)}></Button>
      </Space>
    }
  ];

  return (
    <div>
      <Table columns={columns} dataSource={data} rowKey={item=>item.id} pagination={{pageSize: 5}}/>
    </div>
  )
}
