<template>
    <el-row>
        
        <el-row :gutter="20">
            <el-col :span="8">
                <el-input placeholder="input file name you want to add..." v-model="input"></el-input>
            </el-col>
            <el-col :span="8">
                <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="type content you want to save..."
                    v-model="textarea">
                </el-input>
            </el-col>
            <el-col :span="8">
                <el-button type="primary" round @click="handleAddFile">ADD</el-button>
            </el-col>
        </el-row>

        <el-row>
            <el-table
                :data="listFile"
                stripe
                style="width: 100%">
                <el-table-column
                prop="date"
                label="Created Time"
                width="180">
                </el-table-column>
                <el-table-column
                prop="fileName"
                label="File Name"
                width="180">
                </el-table-column>
                <el-table-column
                prop="id"
                label="ID">
                <el-button type="primary" round @click="handleAddFile">ADD</el-button>
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="Operations"
                    width="120">
                    <template slot-scope="scope">
                        <el-button
                        @click.native.prevent="deleteFile(scope.$index)"
                        type="text"
                        size="small">
                        Remove
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
       
    </el-row>
</template>
<script>
import {mapGetters, mapActions} from 'vuex'
import uuid4 from 'uuid4'

export default {
  data() {
    return {
        textarea: '',
        input: '',
        list: []
    }
  }, 
  computed: {
      listFile() {
          return this.$store.getters['file/listFile']
      }
  },
  created() {
      this.$store.dispatch('file/getListFile')
  },
  methods: {
      handleAddFile(){
          let infoObj = {
              id: uuid4(),
              date: new Date().toLocaleString(),
              fileName: this.input,
              contentFile: this.textarea
          }
          this.$store.dispatch('file/addFile', infoObj);
          this.input = ''
          this.textarea = ''
      },
      deleteFile(index) {
          let payload = {
              index: index
          }
          this.$store.dispatch('file/deleteFile', payload);
      }
  }
}
</script>


