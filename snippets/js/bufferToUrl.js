/* -----------------------------------------------------------------------------
  将后台文件读取接口返回的二进制Buffer信息在页面组装成相应的媒体数据网页预览:
  特别是针对后台没有声明返回数据的类型时，需要蛇者responseType = 'blob',
  读取到二进制数据后将其转换为Blob二进制对象，然后使用文件接口FilerReader可以
  将根据数据的mimetype将数据各自转化为可以页面预览的HTML元素，当然也可以在转化为
  二进制数据后直接在浏览器新标签页中打开(或是framework)，利用浏览器来解析数据。
----------------------------------------------------------------------------- */

/**
 * [获取媒体预览二进制数据]
 * @param url {String} [请求路由字符串]
 * @param data {String} [要发送的数据对象]
 * @param callback {Function} [接收请求数据的函数]
 */
getPreview = (url, data, callback) => {
  const options = {
    method: 'POST',
    // 这个地方要根据环境配置
    url: '/api/proxy.php',
    accept: data.mimetype === 'pdf' ? 'application/pdf' : '',
    responseType: data.mimetype === 'pdf' ? 'blob' : 'blob',
    baseURL: REQUEST_BASE_URL,
    headers: {
        'Cache-Control': 'max-age=0',
        'X-Requested-With': 'XMLHttpRequest',
    },
    data: {
        url: url,
        method: "POST",
        module: "ODMS",
        data: data,
        host: ""
    },
  };

  axios(options)
  .then(
      (response) => callback(response.data)
  ).catch(function (error) {
    console.log(error);
  });
}


getPreview('/store/object/read', params, (data) => {
      const blobData = new Blob([data], blobType);
      // 支持直接新开窗口浏览器预览
      window.open(URL.createObjectURL(blobData),'_blank');

      // 读取成base64字符串 使用模态预览
      // var reader = new FileReader();
      // reader.readAsDataURL(blobData);
      // reader.onload = (e) => {
      //   this.setState({
      //     dataUrl: e.target.result,
      //     mimetype
      //   });
      // }
    });
