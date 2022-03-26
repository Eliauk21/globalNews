import http from '../utils/http'

function getRoles(roleId){
    if(roleId){
        return http.get(`/roles/${roleId}`);
    }else{
        return http.get('/roles');
    }
}

function deleteRoles(item){
    return http.delete(`/roles/${item.id}`);
}

function patchRoles(id, data){
    return http.patch(`/roles/${id}`,data); 
}

export {   
    getRoles,    
    deleteRoles,
    patchRoles,
}

