import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";   
import { previewNews, auditDraftNews } from '../../api/news'
import { Descriptions , PageHeader, Space } from 'antd';
import { HeartTwoTone } from '@ant-design/icons';
import moment from 'moment';

export default function Detail() {
    let params = useParams();
    let [previewData, setPreviewData] = useState({});
  
    useEffect(()=>{
      previewNews(Number(params.id)).then((res)=>{    //params传的是字符串
        console.log(res);
        setPreviewData({...res,view: res.view+1});
      })
    },[])

    useEffect(()=>{
      if(previewData !== {}){
        auditDraftNews(Number(params.id),{view: previewData.view})
      }
    },[previewData])

    function addStar(){
      if(previewData !== {}){
        console.log(123);
        auditDraftNews(Number(params.id),{star: previewData.star+1});
        setPreviewData({...previewData,star: previewData.star+1})
      }
    }

    return (
    <div className="site-page-header-ghost-wrapper">
      <PageHeader
        onBack={() => window.history.back()}
        title={previewData.title}
        subTitle={<Space>
          <div>{previewData.category?.value}</div>
          <HeartTwoTone twoToneColor="#eb2f96" onClick={addStar}/>
        </Space>}
      >
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="创建者">{previewData.author}</Descriptions.Item>
          <Descriptions.Item label="发布时间">{previewData.publishTime?moment(previewData.publishTime).format('YYYY-MM-DD'):'-'}</Descriptions.Item>
          <Descriptions.Item label="区域">{previewData.region}</Descriptions.Item>
          <Descriptions.Item label="访问数量" style={{color: 'green'}}>{previewData.view}</Descriptions.Item>
          <Descriptions.Item label="点赞数量" style={{color: 'green'}}>{previewData.star}</Descriptions.Item>
          {/* <Descriptions.Item label="评论数量" style={{color: 'green'}}>{previewData.view}</Descriptions.Item> */}
        </Descriptions>
      </PageHeader>
      <div  
        dangerouslySetInnerHTML={{__html:previewData.content}}      /* 解析html代码 */ 
        style={{border: '3px solid #ccc', padding: '5px', marginTop: '10px'}}
      ></div>
    </div>
    )
}
