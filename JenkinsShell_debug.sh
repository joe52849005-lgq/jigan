npm install
npm run build:stage
docker build -t  jgrs_pc:debug .
docker stop jgrs_pc && docker rm jgrs_pc
docker run  --restart=always -v /home/workspace/web/gxtt/jgrs_pc/default.conf:/etc/nginx/conf.d/default.conf --name=jgrs_pc -p 25047:80 -d jgrs_pc:debug 