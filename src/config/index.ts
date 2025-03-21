export default {
    get(key:any): any {
        return process.env[`VUE_APP_${key}`];
    }
}