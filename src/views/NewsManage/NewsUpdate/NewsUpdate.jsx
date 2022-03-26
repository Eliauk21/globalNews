import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";   
import {previewNews} from '../../../api/news'
import NewsAdd from '../NewsAdd/NewsAdd'
import './NewsUpdate.css'

export default function NewsUpdate() {
  let params = useParams();
  let [previewData, setPreviewData] = useState({});

  useEffect(()=>{
    previewNews(Number(params.id)).then((res)=>{
     /* console.log(res); */ 
      setPreviewData(res);
    })
  },[])

  return (
    <NewsAdd previewData={previewData}/> 
  )
}
