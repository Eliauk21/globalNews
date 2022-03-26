import React, { useEffect, useState } from 'react'
import { useSelector} from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';   
import {getCategories, addNews, auditDraftNews } from '../../../api/news'
import { PageHeader, Steps, Row, Space, Button, Form, Input, Select, message, notification } from 'antd';
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import './NewsAdd.css'

const { Step } = Steps;
const { Option } = Select;

export default function NewsAdd(props) {
  let user = useSelector((state)=>state.users).user;
  let navigate = useNavigate();
  let params = useParams();
  let [current, setCurrent] = useState(0);
  let [editorState, setEditorState] = useState("");
  let [content, setContent] = useState('');    
  let [formData, setFormData] = useState();
  let [categories, setCategories] = useState([]);
  let [data, setData] = useState({
    "region": user.region,
    "author": user.username,
    "roleId": user.roleId,
    "publishState": 0,
    "star": 0,
    "view": 0
  });
  let [form] = Form.useForm(); 

  useEffect(()=>{
    getCategories().then((res)=>{
      //console.log(res);
      setCategories(res);
    })
    //console.log(user);
    //console.log(props.previewData);
    if(props.previewData){
      form.setFieldsValue({title: props.previewData?.title, category: props.previewData?.category?.value});
      const html = props.previewData.content;
      if(html===undefined)return    //props没有值的时候也会走这里，html未undefined时走接下来的步骤会报错
      const contentBlock = htmlToDraft(html);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        setEditorState(editorState);
      }
    }
  },[props])

  //form组件
  const onFinish = (values) => {
    //console.log(values);
    setFormData(values);    //只是将form数据保存下来，并不是修改form的数据   
    setData(Object.assign(data,{
      title: values.title,
      categoryId: categories.find(v=>v.value===values.category).id
    }))
    setCurrent(current+1);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  //button组件
  function nextTick(){
    if(props.previewData){
      handleBlur();
    }
    if(content){
      //console.log(content);
      setData(Object.assign(data,{
        content:content
      }))
      setCurrent(current+1);
    }else{
      message.error('请输入内容')
    }
  }

  function beforeTick(){
    setCurrent(current-1)
  }

  function submitNews(auditState){
    return function(){
      setData(Object.assign(data,{
        createTime:new Date().getTime(),
        "auditState": auditState
      }))
      if(auditState===0){
        if(props.previewData){
          //console.log(formData);
          //console.log(content);
          auditDraftNews(Number(params.id),{
            title: formData.title,
            categoryId: categories.find(v=>v.value===formData.category).id,
            content
          }).then((res)=>{
            openDraftNotification('bottomRight');
            navigate('/index/news-manage/draft');
          }).catch(()=>{
            message.error('修改失败');
          })
        }else{
          addNews(data).then((res)=>{
            openDraftNotification('bottomRight');
            navigate('/index/news-manage/draft');
          }).catch(()=>{
            message.error('保存草稿箱失败');
          })
        }
      }else{
        if(props.previewData){
          auditDraftNews(Number(params.id),{
            auditState: 1
          }).then((res)=>{
            openAuditNotification('bottomRight');
            navigate('/index/audit-manage/list');
          }).catch(()=>{
            message.error('提交审核失败');
          })
        }else{
          addNews(data).then((res)=>{
            openAuditNotification('bottomRight');
            navigate('/index/audit-manage/list');
          }).catch(()=>{
            message.error('提交审核失败');
          })
        }
          
        
      }
    }
  }

  //Notification组件
  const openDraftNotification = (placement) => {
    console.log(placement);
    notification.info({
      message: `保存草稿箱成功`,
      description:
        `您可以到草稿箱中查看您的新闻`,
      placement,
    });
  };

  const openAuditNotification = (placement) => {
    console.log(placement);
    notification.info({
      message: `提交审核成功`,
      description:
        `您可以到审核列表中查看您的新闻`,
      placement,
    });
  };

  //editor组件
  function handleBlur(){
    setContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
    //为啥第一次触发，没有内容？？？？？？？？？
    console.log(content);
  }

  return (
    <>
      {
        props.previewData
        ?<PageHeader
          className="site-page-header"
          onBack={() => window.history.back()}
          title="修改新闻"
        />
        :<PageHeader
          className="site-page-header"
          title="撰写新闻"
        />
      }
      <Steps current={current}>
        <Step title="基本信息" description="新闻标题，新闻分类" />
        <Step title="新闻内容" subTitle="新闻主题内容" />
        <Step title="新闻提交" description="保存草稿或提交审核" />
      </Steps>
      <div style={{marginTop: '40px'}}>
        {
          current === 0?
          <Form
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
            initialValues={formData}      //表单的初始值
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            form={form}
          >
            <Form.Item
              label="新闻标题"
              name="title"
              rules={[{ required: true, message: '请输入新闻标题!' }]}
            >
              <Input/>
            </Form.Item>
            
            <Form.Item
              label="新闻分类"
              name="category"
              rules={[{ required: true, message: '请选择新闻分类!' }]}
            >
              <Select>
                {
                  categories.map(v=><Option value={v.value} key={v.id}>{v.value}</Option>)
                }
              </Select>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 1, span: 16 }}>
              <Button type="primary" htmlType="submit">
                下一步
              </Button>
            </Form.Item>
          </Form>:
          current === 1?
          <Editor
              editorState={editorState}
              wrapperClassName="demo-wrapper"
              editorClassName="demo-editor"
              onEditorStateChange={editorState=>setEditorState(editorState)}
              onBlur={handleBlur}
            />:''
        }
      </div>
      <div>
        {
          current === 0?'':
          current === 1?
          <Row justify="start">
            <Space>
              <Button type="primary" onClick={nextTick}>下一步</Button>
              <Button onClick={beforeTick}>上一步</Button>
            </Space>
          </Row>:
          <Space>
            <Button onClick={submitNews(0)} style={{marginTop: '10px'}} type='primary'>保存草稿箱</Button>
            <Button onClick={submitNews(1)} style={{marginTop: '10px'}} type='primary' danger>提交审核</Button>
            <Button onClick={beforeTick} style={{marginTop: '10px'}}>上一步</Button>
          </Space>
        }
      </div>
    </>
  )
}
