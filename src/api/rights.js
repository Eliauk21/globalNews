import http from '../utils/http'

function getRights(){
    return http.get('/rights?_embed=children');
}

function deleteRights(item){
    if(item.rightId){
        return http.delete(`/children/${item.id}`);
    }else{
        return http.delete(`/rights/${item.id}`);
    }
}

function patchRights(item){
    if(item.rightId){
        return http.patch(`/children/${item.id}`,{
            pagepermission: item.pagepermission===0?1:0
        });
    }else{
        return http.patch(`/rights/${item.id}`,{
            pagepermission: item.pagepermission===0?1:0
        });
    }
    
}

export {   
    getRights,    
    deleteRights,
    patchRights,
}

