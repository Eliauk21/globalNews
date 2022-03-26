import http from '../utils/http'

//登录注册
function login(data){
    return http.post('/login',data);
}

function register(data){
    return http.post('/register',data);
}

//用户增删改查
function getUsers(){
    return http.get('/users?_expand=role');
}

function addUsers(data){
    return http.post('/users',data);
}

function deleteUsers(id){
    return http.delete(`/users/${id}`);
}

function changeUsersState(id,state){
    return http.patch(`/users/${id}`,{
        roleState: state
    });
}

function patchUsers(id,data){
    return http.patch(`/users/${id}`, data);
}

export {        //export和export default区别：
    login,
    register,
    getUsers,
    deleteUsers,
    changeUsersState,
    addUsers
}

