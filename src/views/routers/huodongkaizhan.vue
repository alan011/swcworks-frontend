<template>
  <div>
    <el-tabs v-model="defaultYear" type="card">
      <el-tab-pane :label="`${c.CurrentYear}年`" :name="c.CurrentYear">
        <div style="display:inline-block;width:60%;vertical-align: top;">
          <div class="top-add">
            <el-button @click="handleAdd" type="primary" plain small>添加</el-button>
          </div>
          <div class="top-container">
            <el-tag type="success">表14：志愿服务活动开展情况统计表</el-tag>
          </div>
        </div>
        <div style="display:inline-block;text-align:left;width:35%">
          <el-card class="box-card">
            <div style="color: red;font-size: 16px;font-weight: 700">填写说明</div>
            <div>1.志愿服务总时数在全省范围内进行历年累计统计，不限于省级重点志愿服务活动；</div>
            <div>2.志愿服务总时数中能区分2019年服务时间的，请单独注明2019年度志愿服务时数；</div>
            <div>3.省级重点志愿服务活动项目包括但不限于：试点示范、工程计划、品牌项目等，请同时提供照片。</div>
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
            <el-form-item
              label="志愿服务总时数:"
              prop="totalHours"
              :rules="[
                { required: true, message: '数量不能为空'},
                { type: 'number', message: '必须为数字值'}
              ]">
              <el-input auto-complete="off" v-model.number="formData.totalHours"></el-input>小时
            </el-form-item>
            <el-form-item
              label="年志愿服务时数:"
              prop="oneYearHours"
              :rules="[
                { required: true, message: '数量不能为空'},
                { type: 'number', message: '必须为数字值'}
              ]">
              <el-input auto-complete="off" v-model.number="formData.oneYearHours"></el-input>小时
            </el-form-item>
            <el-form-item
              label="名称及简介:"
              :rules="[
                { required: true, message: '名称及简介不能为空'}
              ]"
              prop="activities">
              <el-input 
                auto-complete="off" 
                v-model="formData.activities"
                :maxlength="1000"
                type="textarea"
                :rows="4"
                placeholder="请输入省级重点志愿服务活动名称及简介，多个活动通过分号分割并换行，最多不超过1000字"></el-input>
            </el-form-item>
            <el-form-item label="上传照片:">
              <el-upload
                action="/file_upload"
                :data="{'menu': 'table14'}"
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
            prop="totalHours"
            sortable
            label="志愿服务总时数（小时）">
          </el-table-column>
          <el-table-column
            prop="oneYearHours"
            sortable
            :label="`其中：${defaultYear}年志愿服务时数（小时）`">
          </el-table-column>
          <el-table-column
            sortable
            label="省级重点志愿服务活动名称及简介">
            <template slot-scope="scope" v-if="scope.row.activities">
              {{utils.subString(scope.row.activities, 50, true)}}
            </template>
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
        province: null,
        totalHours: null,
        oneYearHours: null, 
        activities: null
      },
      utils: utils,
      dialogVisible: false,
      action: 'add',
      defaultYear: '2019',
      provinces: provinces.provinces
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
        url: '/huodongkaizhan/get',
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
        province: null,
        totalHours: null,
        oneYearHours: null, 
        activities: null
      }
    },
    handleEdit (index, rowData) {
      console.log(index, rowData, this.formData)
      this.resetForm();
      this.action = 'edit';
      Object.keys(this.formData).forEach(item => {
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
          url: '/huodongkaizhan/delete',
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
        url: '/huodongkaizhan/add',
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
        url: '/huodongkaizhan/update',
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