<template>
  <div>
    <el-tabs v-model="defaultYear" type="card">
      <el-tab-pane :label="`${c.CurrentYear}年`" :name="c.CurrentYear">
        <div style="display:inline-block;width:70%;vertical-align:top;">
          <div class="top-add">
            <el-button @click="handleAdd" type="primary" plain small>添加</el-button>
          </div>
          <div class="top-container">
            <el-tag type="success">表2：民政事业单位社会工作岗位开发设置情况统计表</el-tag>
          </div>
        </div>
        <div style="display:inline-block;text-align:left;width:25%">
          <el-card class="box-card">
            <div style="color: red;font-size: 16px;font-weight: 700">填写说明</div>
            <div>1.社会工作岗位及职责的定义参照《关于加强社会工作专业岗位开发与人才激励保障的意见》（民发〔2017〕186号）；</div>
            <div>2.分类统计所辖范围内各类民政事业单位中设置社会工作科（室）、岗位等情况。</div>
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
            <el-form-item label="类别:" >
              <el-select placeholder="请选择类别" v-model="formData.jigou_type">
                <el-option v-for="type in types" :key="type" :label="type" :value="type"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="formData.jigou_type=='其他（请注明）'"
              label="其他（请注明）:"
              prop="qitajigou_comment"
              :rules="[
                { required: true, message: '其他机构注明不能为空'}
              ]">
              <el-input auto-complete="off" v-model="formData.qitajigou_comment"></el-input>
            </el-form-item>
            <el-form-item
              label="机构总数量（个）:"
              prop="zongshu"
              :rules="[
                { required: true, message: '数量不能为空'},
                { type: 'number', message: '必须为数字值'}
              ]">
              <el-input auto-complete="off" v-model.number="formData.zongshu"></el-input>
            </el-form-item>
            <el-form-item
              label="设置社工科（室）的机构数量（个）:"  
              prop="szsgks"           
              :rules="[
                { required: true, message: '数量不能为空'},
                { type: 'number', message: '必须为数字值'}
              ]">
              <el-input auto-complete="off" v-model.number="formData.szsgks"></el-input>
            </el-form-item>
            <el-form-item
              label="未设置社工科（室）但设有社工岗位的机构数量（个）:"      
              prop="wszsgks"        
              :rules="[
                { required: true, message: '数量不能为空'},
                { type: 'number', message: '必须为数字值'}
              ]">
              <el-input auto-complete="off" v-model.number="formData.wszsgks"></el-input>
            </el-form-item>
            <el-form-item
              label="社工岗位数量（个））:"      
              prop="sggw"        
              :rules="[
                { required: true, message: '数量不能为空'},
                { type: 'number', message: '必须为数字值'}
              ]">
              <el-input auto-complete="off" v-model.number="formData.sggw"></el-input>
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
            sortable
            label="类别"
            prop="jigou_type">
          </el-table-column>
          <el-table-column
            prop="qitajigou_comment"
            label="其他机构备注">
          </el-table-column>
          <el-table-column
            prop="zongshu"
            sortable
            label="机构总数量（个）">
          </el-table-column>
          <el-table-column
            prop="szsgks"
            sortable
            label="设置社工科（室）的机构数量（个）">
          </el-table-column>
          <el-table-column
            prop="wszsgks"
            sortable
            label="未设置社工科（室）但设有社工岗位的机构数量（个）">
          </el-table-column>
          <el-table-column
            prop="sggw"
            sortable
            label="社工岗位数量（个）">
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
        jigou_type: null,
        qitajigou_comment: null,
        zongshu: null,
        szsgks: null,
        wszsgks: null,
        sggw: null
      },
      utils: utils,
      types: ['养老机构','精神疾病服务机构', '儿童福利机构', '救助管理机构', '殡葬服务机构', '婚姻家庭服务机构', '其他（请注明）'],
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
        url: '/minzhenggangweikaifa/get',
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
        jigou_type: null,
        qitajigou_comment: null,
        zongshu: null,
        szsgks: null,
        wszsgks: null,
        sggw: null
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
          url: '/minzhenggangweikaifa/delete',
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
        url: '/minzhenggangweikaifa/add',
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
        url: '/minzhenggangweikaifa/update',
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