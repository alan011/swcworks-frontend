<template>
  <div>
    <el-tabs v-model="defaultYear" type="card">
      <el-tab-pane :label="`${c.CurrentYear}年`" :name="c.CurrentYear">
        <div style="display:inline-block;width:60%;vertical-align: top;">
          <div class="top-add">
            <el-button @click="handleAdd" type="primary" plain small>添加</el-button>
          </div>
          <div class="top-container">
            <el-tag type="success">表13：志愿者培训情况统计表</el-tag>
          </div>
        </div>
        <div style="display:inline-block;text-align:left;width:35%">
          <el-card class="box-card">
            <div style="color: red;font-size: 16px;font-weight: 700">填写说明</div>
            <div>1.只统计2019年数据，数据要真实有据；</div>
            <div>2.省级层面举办培训班请提供培训班清晰照片一张；</div>
            <div>3.他组织包括基层群众性自治组织、公益活动举办单位和公共服务机构；</div>
            <div style="color:red; font-weight: 200"><i style="font-size: 14px;color:#f3f345" class="el-icon-warning"></i>各培训总人数统计作为单独一项数据填写，且只能填写一次，培训人数如实填写。</div>
          </el-card>
        </div>
        <el-dialog
          title="添加数据"
          :visible.sync="dialogVisible"
        >
          <el-form :model="formData" ref="formData">
            <el-form-item v-show="false">
              <el-input auto-complete="off" v-model="formData.id"></el-input>
            </el-form-item>
            <el-switch
              style="display: block;margin-bottom: 10px"
              v-model="switch_btn"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="2019年省级层面举办培训班情况"
              inactive-text="培训总人数统计">
            </el-switch>
            <template v-if="switch_btn">
              <el-form-item
                label="举办单位:"
                :rules="[
                  { required: true, message: '不能为空'}
                ]"
                prop="jbdw">
                <el-input auto-complete="off" v-model="formData.jbdw"></el-input>
              </el-form-item>
              <el-form-item
                label="培训班名称:"
                :rules="[
                  { required: true, message: '不能为空'}
                ]"
                prop="pxbmc">
                <el-input auto-complete="off" v-model="formData.pxbmc"></el-input>
              </el-form-item>
              <el-form-item
                label="培训内容:"
                :rules="[
                  { required: true, message: '不能为空'}
                ]"
                prop="content">
                <el-input auto-complete="off" type="textarea" :maxlength="1000" placeholder="最多不超过1000字" v-model="formData.content"></el-input>
              </el-form-item>
              <el-form-item
                label="培训人数:"
                prop="peixunNum"
                :rules="[
                  { required: true, message: '数量不能为空'},
                  { type: 'number', message: '必须为数字值'}
                ]">
                <el-input auto-complete="off" v-model.number="formData.peixunNum"></el-input>
              </el-form-item>
              <el-form-item label="上传照片:">
                <el-upload
                  action="/file_upload"
                  :data="{'menu': 'table13'}"
                  :on-remove="handleRemove"
                  accept=".jpg"
                  :on-success="uploadSuccess"
                  :limit="1"
                  :on-exceed="handleExceed"
                  :file-list="formData.fileList">
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传jpg照片</div>
                </el-upload>
              </el-form-item>
            </template>
            <template v-else>
              <el-form-item
                label="2019年全省范围内志愿者培训总人数:"
                prop="totalNum"
                :rules="[
                  { required: true, message: '数量不能为空'},
                  { type: 'number', message: '必须为数字值'}
                ]">
                <el-input auto-complete="off" v-model.number="formData.totalNum"></el-input>
              </el-form-item>
              <el-form-item
              label="其中，党政机关组织培训的志愿者总人数:"
              prop="jiguanTotalNum"
              :rules="[
                { required: true, message: '数量不能为空'},
                { type: 'number', message: '必须为数字值'}
              ]">
              <el-input auto-complete="off" v-model.number="formData.jiguanTotalNum"></el-input>
            </el-form-item>
            <el-form-item
              label="志愿服务组织培训的志愿者总人数:"
              prop="fuwuzuzhiToalNum"
              :rules="[
                { required: true, message: '数量不能为空'},
                { type: 'number', message: '必须为数字值'}
              ]">
              <el-input auto-complete="off" v-model.number="formData.fuwuzuzhiToalNum"></el-input>
            </el-form-item>
            <el-form-item
              label="其他组织培训的志愿者总人数:"
              prop="otherTotalNum"
              :rules="[
                { required: true, message: '数量不能为空'},
                { type: 'number', message: '必须为数字值'}
              ]">
              <el-input auto-complete="off" v-model.number="formData.otherTotalNum"></el-input>
            </el-form-item>
            </template>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="confirmAdd" v-if="action=='add'">确 定</el-button>
            <el-button type="primary" @click="confirmEdit" v-if="action=='edit'">确 定</el-button>
          </div>
        </el-dialog>
        <el-table
        :data="tableData"
        border
        show-summary
        style="width: 95%;margin-left:20px">
          <el-table-column
            width="50"
            label="序号">
            <template slot-scope="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column
            prop="province"
            sortable
            label="省（区、市）">
          </el-table-column>
          <el-table-column
            prop="jbdw"
            sortable
            label="举办单位">
          </el-table-column>
          <el-table-column
            prop="pxbmc"
            sortable
            label="培训班名称">
          </el-table-column>
          <el-table-column
            sortable
            label="培训内容">
            <template slot-scope="scope">
              {{utils.subString(scope.row.content, 50, true)}}
            </template>
          </el-table-column>
          <el-table-column
            prop="peixunNum"
            sortable
            label="培训人数">
          </el-table-column>
          <el-table-column
            prop="totalNum"
            sortable
            label="2019年全省范围内志愿者培训总人数">
          </el-table-column>
          <el-table-column
            prop="jiguanTotalNum"
            sortable
            label="党政机关组织培训的志愿者总人数">
          </el-table-column>
          <el-table-column
            prop="fuwuzuzhiToalNum"
            sortable
            label="志愿服务组织培训的志愿者总人数">
          </el-table-column>
          <el-table-column
            prop="otherTotalNum"
            sortable
            label="其他组织培训的志愿者总人数">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <easy-pagination :data="fileLists">
          <template scope="props">
            <el-card class="box-card" style="width: 80%; text-align: left; margin:20px 0 0 20px; font-size: 16px">
              <div slot="header" class="clearfix">
                当前用户已上传的照片列表：
              </div>
                <ol>
                  <li v-for="file in props.data">
                    {{file}}
                  </li>
                </ol>
            </el-card>
          </template>
        </easy-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import axios from 'axios';
import provinces from '../../config/provinces'
import utils from '../../utils'
import c from '$config/current'
import qs from 'qs'


export default {
  data () {
    return {
      tableData: [],
      c,
      fileLists: [],
      formData: {
        id: null,
        province: "",
        jbdw: "",
        pxbmc: "",
        content: "",
        peixunNum: null,
        totalNum: null,
        jiguanTotalNum: null,
        fuwuzuzhiToalNum: null,
        otherTotalNum: null
      },
      utils: utils,
      dialogVisible: false,
      action: 'add',
      defaultYear: '2019',
      provinces: provinces.provinces,
      switch_btn: true
    }
  },
  mounted () {
    this.getData();
  },
  methods: {
    handleExceed(file, fileList) {
      this.$message.warning('一次只能上传一张照片!');
      console.log(file, fileList);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    uploadSuccess(file, fileList) {
      console.log(file, fileList)
    },
    getData () {
      let params = {};
      let config = {
        // api请求的baseURL, 用于DataSourceGateWay
        baseURL: '/api/v1',
        url: '/zyzpeixun/get',
        // to methods of that instance.
        method: 'get',
        // params仅用于get请求， 会拼接在url后面
        params: params
      };
      axios.request(config)
      .then(result => {
          let data = result.data;
        console.log(data);
        this.tableData = data.data;
        if(data.fileList) {
          // debugger
          this.fileLists = data.fileList;
        }
      }, err => {
        this.$alert(err.message);
      });
    },
    resetForm () {
      this.formData = {
        id: null,
        province: "",
        jbdw: "",
        pxbmc: "",
        content: "",
        peixunNum: null,
        totalNum: null,
        jiguanTotalNum: null,
        fuwuzuzhiToalNum: null,
        otherTotalNum: null
      }
    },
    handleEdit (index, rowData) {
      console.log(index, rowData, this.formData)
      this.resetForm();
      this.action = 'edit';
      Object.keys(rowData).forEach(item => {
        this.formData[item] = rowData[item];
      })
      this.dialogVisible = true;
    },
    handleDelete (index, rowData) {
      console.log(index, rowData)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let config = {
          baseURL: '/api/v1',
          paramSerializerJQLikeEnabled: true,
          url: '/zyzpeixun/delete',
          method: 'post',
          data: qs.stringify({id: rowData.id})
        };
        axios.request(config)
        .then(result => {
          let data = result.data;
          if (Object.keys(data) == 0) {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.tableData.splice(index, 1);
          } else {
            this.$message({
              message: '删除失败',
              type: 'error'
            });
          }
        }, err => {
          this.$alert(err.message);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    handleAdd () {
      this.resetForm();
      this.action = 'add';
      this.dialogVisible = true;
    },
    confirmAdd () {
      let data = this.formData;
      let config = {
        // api请求的baseURL, 用于DataSourceGateWay
        baseURL: '/api/v1',
        url: '/zyzpeixun/add',
        // to methods of that instance.
        method: 'post',
        // data仅用于post请求， 放在http请求体中
        data: qs.stringify(data)
      };
       this.$refs.formData.validate((valid) => {
        if (valid) {
          axios.request(config)
          .then(result => {
          let data = result.data;
            console.log(data);
            if (data.id) {
              this.$message({
                message: '添加成功',
                type: 'success'
              });
              this.formData.id = data.id;
              this.formData.province = data.province;
              this.tableData.unshift(this.formData);
              this.dialogVisible = false;
            } else {
              this.$message({
                message: '添加失败',
                type: 'error'
              });
            } 
          }, err => {
            this.$alert(err.message);
          });
        }
      })
    },
    confirmEdit () {
      let data = this.formData;
      let config = {
        baseURL: '/api/v1',
        paramSerializerJQLikeEnabled: true,
        url: '/zyzpeixun/update',
        method: 'post',
        data: qs.stringify(data)
      };
      axios.request(config)
      .then(result => {
          let data = result.data;
        if (Object.keys(data) == 0) {
          this.$message({
            message: '修改成功',
            type: 'success'
          });
          this.tableData.forEach((item, index) => {
            if (this.formData.id == item.id) {
              this.tableData.splice(index, 1, this.formData);
            }
          })
          console.log(this.tableData);
          this.dialogVisible = false;
        } else {
          this.$message({
            message: '修改失败',
            type: 'error'
          });
        }
      }, err => {
        this.$alert(err.message);
      });
    }
  }
}

</script>
<style lang="less">
  .dialog-footer {
    text-align:center;
  }
</style>