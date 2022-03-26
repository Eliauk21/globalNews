import axios from 'axios'
import storage from './storage';

/* 统一instance的基础配置 */
let instance = axios.create({       //instance就相当于axios
    baseURL:'/api',
    timeout:5000
})

/* 请求拦截，将token添加到请求头信息中 */
instance.interceptors.request.use(config=>{             //使用本地存储中的token
    config.headers['Authorization'] = storage.get('users')?.accessToken;
    return config;
},error=>{
    return Promise.reject(error)
})

/* 封装sxios，统一axios传输数据的格式 */
let http = {
    get(url,data){
        return instance.get(url,{
            params: data
        }).then((res)=>{
            return res.data;
        })
    },
    post(url,data){
        return instance.post(url,data).then((res)=>{
            return res.data;
        })
    },
    delete(url,data){
        return instance.delete(url,{
            data
        }).then((res)=>{
            return res.data;
        })
    },
    patch(url,data){
        return instance.patch(url,data).then((res)=>{
            return res.data;
        })
    }
}

export default http;