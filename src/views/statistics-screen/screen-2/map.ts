// export function MP() {
//   return new Promise(function(resolve, reject) {
//     window.init = function() {
//       // eslint-disable-next-line no-undef
//       resolve(BMap)
//     }

//     const script = document.createElement('script')
//     script.type = 'text/javascript'
//     script.src = 'http://api.map.baidu.com/api?v=3.0&ak=cvvLcnEHuM6OMGZUGq7TznPH2thfTUF3&callback=init'
//     script.onerror = reject
//     document.head.appendChild(script)

//     // const script = document.createElement('script')
//     // script.type = 'text/javascript'
//     // script.src = 'http://api.map.baidu.com/library/InfoBox/1.2/src/InfoBox_min.js'
//     // script.onerror = reject
//     // document.head.appendChild(script)
//     // console.log('resolve', resolve, 'reject', reject)
//   })
// }
export function map() {
  return new Promise(function(resolve, reject) {
    (window as any).init = function() {
      // eslint-disable-next-line no-undef
      // resolve(BMap)
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      mapBox(resolve, reject);
      mapHeat(resolve, reject);
    };

    const script1 = document.createElement("script");
    script1.type = "text/javascript";
    script1.src =
      "http://api.map.baidu.com/api?v=3.0&ak=cvvLcnEHuM6OMGZUGq7TznPH2thfTUF3&callback=init";
    script1.onerror = reject;
    document.head.appendChild(script1);
  });
}

export function mapBox(resolve: any, reject: any) {
  const script2 = document.createElement("script");
  script2.type = "text/javascript";
  script2.src = "http://api.map.baidu.com/library/InfoBox/1.2/src/InfoBox.js";
  script2.onerror = reject;
  script2.onload = function() {
    // eslint-disable-next-line no-undef
    resolve({ bmap: BMap, bmapLib: BMapLib });
  };
  document.head.appendChild(script2);
}

export function mapHeat(resolve: any, reject: any) {
  const script3 = document.createElement("script");
  script3.type = "text/javascript";
  script3.src = "//api.map.baidu.com/library/Heatmap/2.0/src/Heatmap_min.js";
  script3.onerror = reject;
  script3.onload = function() {
    // eslint-disable-next-line no-undef
    resolve({ bmap: BMap, bmapLib: BMapLib });
  };
  document.head.appendChild(script3);
}
