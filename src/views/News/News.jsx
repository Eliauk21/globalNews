import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'; 
import { Card, Col, Row,PageHeader , List } from 'antd';
import { getAllPublishNews } from '../../api/news'
import _ from 'lodash';

export default function News() {
    let navigate = useNavigate();
    let [publishData, setPublishData] = useState([]);

    useEffect(()=>{
        getAllPublishNews().then((res)=>{
            //Object.entries    Object.keys     Object.values
            console.log(Object.entries(_.groupBy(res,item=>item.category.title)));
            setPublishData(Object.entries(_.groupBy(res,item=>item.category.title)))
        })
    },[])

    function toDetail(id){
        return function(){
            navigate(`/detail/${id}`);
        }
    }

    return (
        <div>
            <PageHeader
              className="site-page-header"
              title="全球新闻"
              subTitle="查看新闻"
              style={{border: '1px solid rgb(235, 237, 240)'}}
            />
            <Row gutter={[16, 16]}  style={{paddingLeft: '20px',paddingTop: '10px'}}>
                {
                    publishData.map(v=><Col key={v[0]}>     {/* map要有key!!! */}
                        <Card title={v[0]} extra={<a href="#">More</a>} style={{ width: 300 }} hoverable={true}>
                            <List
                              size="small"
                              bordered
                              dataSource={v[1]}
                              pagination={{pageSize:5}}
                              renderItem={item => <List.Item><a onClick={toDetail(item.id)}>{item.title}</a></List.Item>}
                            />
                        </Card>
                    </Col>)
                }
            </Row>
        </div>
    )
}
