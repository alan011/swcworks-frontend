<template>
  <div>
    <el-tabs v-model="defaultYear" type="card">
      <el-tab-pane :label="`${c.CurrentYear}年`" :name="c.CurrentYear">
        <div style="display:inline-block;width:65%;vertical-align:top;">
          <div class="top-add">
            <el-button @click="handleAdd" type="primary" plain small>添加</el-button>
          </div>
          <div class="top-container">
            <el-tag type="success">表5：社会工作专业人才培训情况统计表</el-tag>
          </div>
        </div>
        <div style="display:inline-block;text-align:left;width:30%">
          <el-card class="box-card">
            <div style="color: red;font-size: 16px;font-weight: 700">填写说明</div>
            <div>1.只统计2019年数据，统计数据要真实有据，具体到个位数;</div>
            <div>2.统计范围不限于民政部门组织的培训;</div>
            <div>3.统计范围包括省级、地市级、县区级组织的培训。</div>
            <div>4.社会工作人才纳入本省（区市）人才培养整体规划情况统计范围包括专门针对社会工作人才培养的激励措施。</div>
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
              label="培训人次:"
              
              prop="num"
              :rules="[
                { required: true, message: '数量不能为空'},
                { type: 'number', message: '必须为数字值'}
              ]">
              <el-input auto-complete="off" v-model.number="formData.num"></el-input>
            </el-form-item>
            <el-form-item
              label="较去年增长量:"
              
              prop="increase"
              :rules="[
                { required: true, message: '数量不能为空'},
                { type: 'number', message: '必须为数字值'}
              ]">
              <el-input auto-complete="off" v-model.number="formData.increase" placeholder="（人次）"></el-input>
            </el-form-item>
            <el-form-item
              label="社会工作人才纳入本省（区市）人才培养整体规划情况:"
              
              prop="zheng_ti_gui_hua"
              :rules="[
                { required: true, message: '不能为空'},
              ]">
              <el-input type="textarea" :rows="4" v-model="formData.zheng_ti_gui_hua" placeholder="限2000字以内" maxlength="2000" show-word-limit></el-input>
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
            prop="num"
            sortable
            label="培训人次">
          </el-table-column>
          <el-table-column
            prop="increase"
            sortable
            label="较去年增长量">
          </el-table-column>
          <el-table-column
            prop="zheng_ti_gui_hua"
            sortable
            label="社会工作人才纳入本省（区市）人才培养整体规划情况">
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
      formData: {
        id: null,
        province: null,
        type: null,
        num: null, 
        increase: null,
        zheng_ti_gui_hua: null
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
    getData () {
      let params = {};
      let config = {
        // api请求的baseURL, 用于DataSourceGateWay
        baseURL: '/api/v1',
        url: '/rencaipeixun/get',
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
      }, err => {
        this.$alert(err.message);
      });
    },
    resetForm () {
      this.formData = {
        id: null,
        province: null,
        type: null,
        num: null, 
        increase: null,
        zheng_ti_gui_hua: null,
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
          url: '/rencaipeixun/delete',
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
        url: '/rencaipeixun/add',
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
        url: '/rencaipeixun/update',
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