import React,{ useState, useEffect} from 'react'
import {getRoles} from '../api/roles'
import { BrowserRouter, Routes,  Route, Navigate } from "react-router-dom";     //重定向

import Login from '../views/Login/Login'
import Home from '../views/Home/Home'
import Index from '../views/Index/Index'
import UserList from '../views/UserManage/UserList' 
import RoleList from '../views/RightManage/RoleList/RoleList'
import RightList from '../views/RightManage/RightList/RightList'
import NewsAdd from '../views/NewsManage/NewsAdd/NewsAdd'
import NewsCategory from '../views/NewsManage/NewsCategory/NewsCategory'
import NewsDraft from '../views/NewsManage/NewsDraft/NewsDraft'
import NewsPreview from '../views/NewsManage/NewsPreview/NewsPreview'
import NewsUpdate from '../views/NewsManage/NewsUpdate/NewsUpdate'
import PublishedNews from '../views/PublishManage/PublishedNews/PublishedNews'
import SunSetNews from '../views/PublishManage/SunSetNews/SunSetNews'
import UnPublishedNews from '../views/PublishManage/UnPublishedNews/UnPublishedNews'
import Audit from '../views/AuditManage/Audit/Audit'
import AuditList from '../views/AuditManage/AuditList/AuditList'
import NoPermision from '../views/NoPermision/NoPermision'
import NotFound from '../views/NotFound/NotFound'
import News from '../views/News/News'
import Detail from '../views/News/Detail'

import { useSelector } from "react-redux";

export default function Router() {
  let user = useSelector((state)=>state.users); 
  let [roleList, setRoleList] = useState([]);   
  let [routeComponent, setRouteComponent] = useState([
    {route:'/index/oa/home',component:<Home />},
    {route:'/index/user-manage/list',component:<UserList />},
    {route:'/index/right-manage/role/list',component:<RoleList />},
    {route:'/index/right-manage/right/list',component:<RightList />},
    {route:'/index/news-manage/add',component:<NewsAdd />},
    {route:'/index/news-manage/update/:id',component:<NewsUpdate />},
    {route:'/index/news-manage/preview/:id',component:<NewsPreview />},
    {route:'/index/news-manage/draft',component:<NewsDraft />},
    {route:'/index/news-manage/category',component:<NewsCategory />},
    {route:'/index/audit-manage/audit',component:<Audit />},
    {route:'/index/audit-manage/list',component:<AuditList />},
    {route:'/index/publish-manage/unpublished',component:<UnPublishedNews />},
    {route:'/index/publish-manage/published',component:<PublishedNews />},
    {route:'/index/publish-manage/sunset',component:<SunSetNews />}
  ])
    
  useEffect(()=>{
    getRoles().then((res)=>{
      /* console.log(res[user.user.roleId-1].rights); */ 
      setRoleList(res[user.user.roleId-1].rights);  //得到应有页面权限
    })
  },[])
  
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Login />} />      
            <Route path='/index' element={     
              user?.accessToken?<Index />:<Login />     /* 在这里做权限拦截，使用state中的token->可以更新页面 */
            }>
              {     
                routeComponent.map((v)=>roleList.includes(v.route)
                ?<Route path={v.route} key={v.route} element={v.component} />
                :roleList.length!==0
                ?<Route path={v.route} key={v.route} element={<Navigate replace to='/noPermision'/> } />
                :'')
              }
              <Route index element={<Navigate replace to='/index/oa/home'/> } />
              {/* <Route path='*' element={<NotFound />} /> */}     {/* roleList没有加载到的时候会执行这里 */}
            </Route>
            <Route path='/news' element={<News />} /> 
            <Route path='/detail/:id' element={<Detail />} /> 
            <Route path='/noPermision' element={<NoPermision /> } />
            <Route path='*' element={<NotFound />} />
        </Routes>
    </BrowserRouter>
  )
}
