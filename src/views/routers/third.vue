<template>
	<div>
	  <el-button @click="getMockData">默认按钮</el-button>
	  <el-button type="primary">按钮</el-button>
	  <el-button type="success">成功按钮</el-button>
	  <el-button type="info">信息按钮</el-button>
	  <el-button type="warning">警告按钮</el-button>
	  <el-button type="danger">危险按钮</el-button>
	</div>
</template>

<script>
import axios from 'axios';


export default {
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    getMockData () {
      let params = {a:1,b:'get'};
      let config = {
        // api请求的baseURL, 用于DataSourceGateWay
        baseURL: '/api/v1',
        url: '/mock/get',
        // to methods of that instance.
        method: 'get',
        // params仅用于get请求， 会拼接在url后面
        params: params
      };
      axios.request(config)
      .then(result => {
          let data = result.data;
        console.log(data);
      }, err => {
        console.log(err);
      });
    }
  }
}

</script>
<style>
</style>