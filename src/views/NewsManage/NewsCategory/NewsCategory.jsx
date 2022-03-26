import React, { useContext, useState, useEffect, useRef } from 'react';
import { getCategories, editCategories, deleteCategories } from '../../../api/news'
import { Table, Input, Button, message, Form, Popconfirm } from 'antd';
import { DeleteTwoTone } from '@ant-design/icons';
import './NewsCategory.css'

export default function NewsCategory() {
  let [categoryData, setCategoryData] = useState([]);

  useEffect(()=>{
    getCategoryData();
  },[])

  function getCategoryData(){    
    getCategories().then((res)=>{
      //console.log(res);
      setCategoryData(res);
    });
  }

  //Popconfirm组件
  function confirm(id) {
    return function(){
      //console.log(id);
      deleteCategories(id).then(()=>{
        getCategoryData();
        message.success('删除成功');
      }).catch(()=>{
        message.error('删除失败');
      })
    }
  }


  //table组件

  function handleSave(record){
    console.log(record);
    categoryData.forEach(v=>{
      if(v.id===record.id){
        if(!(v.title===record.title&&v.value===record.value)){
          editCategories(record.id,{
            title:record.title,
            value:record.value
          }).then(()=>{
            getCategoryData()
            message.success('更改成功');
          }).catch(()=>{
            message.error('更改失败');
          })
        }
      }
    })
  };

  const EditableContext = React.createContext(null);

  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };
  
  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);
  
    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };
  
    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({ ...record, ...values });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };
  
    let childNode = children;
  
    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
  
    return <td {...restProps}>{childNode}</td>;
  };


  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '栏目名称',
      dataIndex: 'title',
      key: 'title',
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: 'title',
        title: '栏目名称',
        handleSave: handleSave,
      })
    },
    {
      title: '操作',
      key: 'tags',
      dataIndex: 'tags',
      render: (tags,item)=>
        <Popconfirm
          title="确定删除此分类?"
          onConfirm={confirm(item.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button shape="circle" icon={<DeleteTwoTone twoToneColor="red" />} danger></Button>
        </Popconfirm>
      
    }
  ];
  return (
    <div>
      <Table
          components={{
            body: {
              row: EditableRow,
              cell: EditableCell,
            },
          }}
          pagination={{pageSize: 5}}
          rowKey={item=>item.id}
          rowClassName={() => 'editable-row'}
          dataSource={categoryData}
          columns={columns}
        />
    </div>
  )
}
