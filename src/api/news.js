import http from '../utils/http'

function getCategories(){
    return http.get('/categories');
}

function editCategories(id,data){
    return http.patch(`/categories/${id}`,data);
}

function deleteCategories(id){
    return http.delete(`/categories/${id}`);
}

function addNews(data){
    return http.post('/news',data);
}

function getAllPublishNews(){       //所有发布的新闻
    return http.get(`/news?publishState=2&_expand=category`);
}

function getAllViewNews(){       //所有发布的新闻，浏览数量排序
    return http.get(`/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=5`);
}

function getAllStarNews(){       //所有发布的新闻，点赞数量排序
    return http.get(`/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=5`);
}

function getNews(username){       //草稿箱中的新闻
    return http.get(`/news?auditState=${0}&author=${username}&_expand=category`);
}

function previewNews(id){          //预览的新闻
    return http.get(`/news/${id}?_expand=category&_expand=role`);
}

function getAuditNews(username){        //审核列表中的新闻
    return http.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`);
}

function getAuditingNews(){        //审核中需要的新闻
    return http.get(`/news?auditState=${1}&_expand=category`);
}

function getPublishNews(username){          //已发布新闻
    return http.get(`/news/?publishState=2&author=${username}&_expand=category`);
}

function getUnPublishNews(username){          //待发布新闻
    return http.get(`/news/?publishState=1&author=${username}&_expand=category`);
}

function getSunsetNews(username){          //已下线发布新闻
    return http.get(`/news/?publishState=3&author=${username}&_expand=category`);
}

function auditDraftNews(newsId,data){        //编辑草稿箱中的新闻
    return http.patch(`/news/${newsId}`,data);
}


function auditNews(newsId){             //撤回新闻
    return http.patch(`/news/${newsId}`,{
        auditState: 0
    });
}

function uploadNews(newsId){             //上传新闻（仅限新闻直接上传）
    return http.patch(`/news/${newsId}`,{
        auditState: 1
    });
}

function successNews(newsId){             //审核通过
    return http.patch(`/news/${newsId}`,{
        auditState: 2,
        publishState: 1
    });
}

function failNews(newsId){             //审核失败
    return http.patch(`/news/${newsId}`,{
        auditState: 3,
        publishState: 0
    });
}

function publishNews(newsId, publishTime){             //发布新闻
    return http.patch(`/news/${newsId}`,{
        publishState: 2,
        publishTime: publishTime
    });
}

function sunsetNews(newsId){             //下线新闻
    return http.patch(`/news/${newsId}`,{
        publishState: 3
    });
}


function deleteNews(id){
    return http.delete(`/news/${id}`);
}


export {       
    getCategories,
    addNews,
    deleteNews,
    getNews,
    previewNews,
    getAuditNews,
    getAuditingNews,
    auditDraftNews,
    auditNews,
    publishNews,
    uploadNews,
    successNews,
    failNews,
    editCategories,
    deleteCategories,
    getPublishNews,
    getUnPublishNews,
    getSunsetNews,
    sunsetNews,
    getAllViewNews,
    getAllStarNews,
    getAllPublishNews
}