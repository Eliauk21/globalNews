import React,{useEffect, useState} from 'react'
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { Layout, Menu, Breadcrumb, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import {useDispatch, useSelector} from 'react-redux'
import storage from '../../utils/storage';
import {getRights} from '../../api/rights'
import {getRoles} from '../../api/roles'

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

export default function Index() {
  let user = useSelector((state)=>state.users).user;
  let dispatch = useDispatch();
  let navigate = useNavigate();
  let [menuList, setMenuList] = useState([]); 
  let [roleList, setRoleList] = useState([]); 

  useEffect(()=>{         
    getRights().then((res)=>{
      /* console.log(res); */    
      setMenuList(res);         //得到所有页面权限
    });
    getRoles().then((res)=>{
      /* console.log(res[user.roleId-1].rights); */      
      setRoleList(res[user.roleId-1].rights);         //得到应有页面权限
    });
  },[]);

  let {pathname} = useLocation();
  let re = /\//g;
  let arr = [];
  let ret;
  while(ret = re.exec(pathname)){
    arr.push([ret[0],ret.index])
  }
  let parentpathname = pathname!=='/index'&&pathname.substring(0,arr[2][1]);
  let parentBread = menuList?.find((v)=>v.key===parentpathname);
  let Bread = parentBread?.children?.find((v)=>v.key===pathname);
  let [parentTitle, title] = [parentBread?.title, Bread?.title];
  let toLogout = ()=>{
    storage.remove('users');
    dispatch({
      type:'USERS_UPDATE',
      payload:''
    })
    navigate('/');
  }
  const menu = (
    <Menu>
      <Menu.Item key='1'>
        修改密码
      </Menu.Item>
      <Menu.Item onClick={toLogout} key='2'>
        退出登录
      </Menu.Item>
    </Menu>
  );
  return (
    <Layout style={{ minHeight: '100vh' }}>
        <Sider>
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            { 
              menuList?.map((v)=>{
                return (v.pagepermission===1&&roleList.includes(v.key))&&<SubMenu key={v.key} icon={v.icon} title={v.title}>
                    {v.children.map((v)=>{
                      return (v.pagepermission===1&&roleList.includes(v.key))&&<Menu.Item key={v.key} icon={v.icon}><Link to={v.key}>{v.title}</Link></Menu.Item>
                    })}
                  </SubMenu>        
                })
            }
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ paddingLeft: '15px', color: '#fff', fontSize: '23px', display:'flex', justifyContent: 'space-between'}}>
            <div className='header'>全球新闻发布系统</div>
            <div style={{fontSize: '18px'}}>欢迎{user.roleId===1?'全球管理员':user.roleId===2?'区域管理员':'区域编辑'}:
              <Dropdown overlay={menu}>
                <span>{user.username}<DownOutlined /></span>
              </Dropdown>
            </div>
          </Header>
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>{parentTitle}</Breadcrumb.Item>
              <Breadcrumb.Item>{title}</Breadcrumb.Item>
            </Breadcrumb>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
  )
}
