import AxiosInterceptor from '@/utils/request';

/**
 * 程序启动服务
 */
class Startup {
    /**
     * 程序启动
     */
    public static bootstrap(): any {
        // 初始化axios配置
        const init = AxiosInterceptor.init();
        // 初始化config配置
        // axios与config初始化完成回调
        return Promise.all([]).then(([name]) => {
            return Promise.resolve(true);
        });
    }
}

export default Startup;
