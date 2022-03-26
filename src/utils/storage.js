/* 封装localStorage的方法 */
let storage = {
    set(key,data){
        if(typeof data === 'object'){
            localStorage.setItem(key,JSON.stringify(data))
        }else{
            localStorage.setItem(key,data)
        }
    },
    get(key){
        let value = localStorage.getItem(key);
        let re = /^(\{|\[)/;
        if(re.test(value)){
            return JSON.parse(value)
        }else{
            return value
        }
    },
    remove(key){
        localStorage.removeItem(key);
    }
}

export default storage;