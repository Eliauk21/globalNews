import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'; 
import { useSelector} from 'react-redux'
import { Card, Col, Row, List, Avatar, Space, Drawer  } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import * as echarts from 'echarts';
import _ from 'lodash';
import { getAllViewNews, getAllStarNews, getAllPublishNews } from '../../api/news'
import './Home.css'

export default function Home() {
  let navigate = useNavigate();
  let user = useSelector((state)=>state.users).user;
  let barRef = useRef();
  let pieRef = useRef();
  let [viewData, setViewData] = useState([]);
  let [starData, setStarData] = useState([]);
  let [myPublishData, setMyPublishData] = useState([]);
  let [pieChart, setPieChart] = useState(null);
  const [visible, setVisible] = useState(false);
  const { Meta } = Card;
  

  useEffect(()=>{
    //console.log(user);
    getAllViewNews().then((res)=>{
      //console.log(res);
      setViewData(res);
    })
    getAllStarNews().then((res)=>{
      setStarData(res);
    })
    getAllPublishNews().then((res)=>{
      //console.log(res);
      //console.log(_.groupBy(res,item=>item.category.title));
      renderBar(_.groupBy(res,item=>item.category.title));
      let data = res.filter(v=>v.author===user.username)
      setMyPublishData(data);
    })
    return ()=>{
      window.onresize = null;
    }
  },[])

  //echart库
  function renderBar(obj){
    var myChart = echarts.init(barRef.current);
    myChart.setOption({
      title: {
        text: '新闻分类图示'
      },
      tooltip: {},
      xAxis: {
        data: Object.keys(obj),
        axisLabel:{
          rotate:"45"
        }
      },
      yAxis: {
        minInterval: 1
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          data: Object.values(obj).map(v=>v.length)
        }
      ]
    });

    window.onresize = ()=>{
      //console.log(123);
      myChart.resize();
    }
  }

  function renderPie(obj){

    var groupObj = _.groupBy(obj,item=>item.category.title)
    //console.log(groupObj);
    let list = [];
    for(var i in groupObj){
      list.push({
        value:groupObj[i].length,
        name:i
      })
    }
    //console.log(list);
    var myChart
    if(!pieChart){
      myChart = echarts.init(pieRef.current);
      setPieChart(myChart);
    }else{
      myChart = pieChart;
    }
    var option;

    option = {
      title: {
        text: '当前用户新闻分类图示',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '发布数量',
          type: 'pie',
          radius: '50%',
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    option && myChart.setOption(option);
  }

  //a标签跳转
  function toPreview(id){
    return function(){
      navigate(`/index/news-manage/preview/${id}`);
    }
  }

  //drawer
  const showDrawer = () => {
    //变成同步渲染页面
    setTimeout(()=>{
      setVisible(true);
      renderPie(myPublishData);
    },0)
  };

  return (
    <div className="site-card-wrapper">
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览" bordered={true}>
            <List
              size="small"
              bordered
              dataSource={viewData}
              renderItem={item => <List.Item><a onClick={toPreview(item.id)}>{item.title}</a></List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户点赞最多" bordered={true}>
            <List
              size="small"
              bordered
              dataSource={starData}
              renderItem={item => <List.Item><a onClick={toPreview(item.id)}>{item.title}</a></List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            style={{ width: 300 }}
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined key="setting" onClick={showDrawer}/>,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title={user.username}
              description={<Space>
                <span>{user.regin}</span>
                <span>{user.roleId===1?'全球管理员':user.roleId===2?'区域管理员':'区域编辑'}</span>
              </Space>}
            />
          </Card>
        </Col>
      </Row>
      <Drawer title="个人新闻分类" width='500px' placement="right" onClose={()=>{setVisible(false)}} visible={visible}>
        <div id="main" ref={pieRef} style={{ width:'100%', height:'400px', marginTop: '30px'}}></div>
      </Drawer>
      <div id="main" ref={barRef} style={{ width:'100%', height:'400px', marginTop: '30px'}}></div>
    </div>
  )
}
