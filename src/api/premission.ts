const permission: any = [{
    path: "/",
    meta: {
        icon: "el-icon-s-data",
        title: "统计",
        group: true,
        hidden: false
    },
    children: [{
        path: "/statistics-screen",
        meta: {
            icon: "",
            title: "大屏",
            hidden: false,
            target: '_blank'
        }
    }]
}]

export default permission