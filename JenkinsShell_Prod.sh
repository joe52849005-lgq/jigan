echo "==================begin====================="
npm install
npm run build:prod


export CURRENT_TIME_STAMP_tsm_pc=`date +%s`
docker build -f Dockerfile_Prod -t tsm_pc:$CURRENT_TIME_STAMP_tsm_pc . 
docker login -u jenkins -p WYbWNFGc22frxQq yq.runjian.com:13088

docker tag tsm_pc:$CURRENT_TIME_STAMP_tsm_pc yq.runjian.com:13088/tsm/tsm_pc
docker push yq.runjian.com:13088/tsm/tsm_pc

#删除本地镜像
docker image rm tsm_pc:$CURRENT_TIME_STAMP_tsm_pc
echo "==================end====================="
