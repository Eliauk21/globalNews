import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";   
import { previewNews } from '../../../api/news'
import { Descriptions , PageHeader } from 'antd';
import moment from 'moment';
import './NewsPreview.css'

export default function NewsPreview() {
  let params = useParams();
  let [previewData, setPreviewData] = useState({});

  useEffect(()=>{
    previewNews(Number(params.id)).then((res)=>{    //params传的是字符串
      console.log(res);
      setPreviewData(res);
    })
  },[])

  return (
  <div className="site-page-header-ghost-wrapper">
    <PageHeader
      onBack={() => window.history.back()}
      title={previewData.title}
      subTitle={previewData.category?.value}
    >
      <Descriptions size="small" column={3}>
        <Descriptions.Item label="创建者">{previewData.author}</Descriptions.Item>
        <Descriptions.Item label="创建时间">{ moment(previewData.createTime).format('YYYY-MM-DD')}</Descriptions.Item>
        <Descriptions.Item label="发布时间">{previewData.publishTime?moment(previewData.publishTime).format('YYYY-MM-DD'):'-'}</Descriptions.Item>
        <Descriptions.Item label="区域">{previewData.region}</Descriptions.Item>
        <Descriptions.Item label="审核状态">{
          previewData.auditState===0?<span style={{color: 'red'}}>未审核</span>:
          previewData.auditState===1?<span style={{color: 'orange'}}>审核中</span>:
          previewData.auditState===2?<span style={{color: 'green'}}>审核通过</span>:<span>审核未通过</span>
        }</Descriptions.Item>
        <Descriptions.Item label="发布状态">{
          previewData.publishState===0?<span style={{color: 'red'}}>未发布</span>:
          previewData.publishState===1?<span style={{color: 'orange'}}>待发布</span>:
          previewData.publishState===2?<span style={{color: 'green'}}>已发布</span>:<span>已下线</span>
        }</Descriptions.Item>
        <Descriptions.Item label="访问数量" style={{color: 'green'}}>{previewData.view}</Descriptions.Item>
        <Descriptions.Item label="点赞数量" style={{color: 'green'}}>{previewData.star}</Descriptions.Item>
        <Descriptions.Item label="评论数量" style={{color: 'green'}}>{previewData.view}</Descriptions.Item>
      </Descriptions>
    </PageHeader>
    <div  
      dangerouslySetInnerHTML={{__html:previewData.content}}      /* 解析html代码 */ 
      style={{border: '3px solid #ccc', padding: '5px', marginTop: '10px'}}
    ></div>
  </div>
  )
}
