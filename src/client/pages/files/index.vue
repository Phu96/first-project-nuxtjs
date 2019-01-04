<template>
    <el-row>
        <el-row>
            <el-breadcrumb separator="/">
                <el-breadcrumb-item 
                    v-for = "(path, index) in WorkingAt"
                    :key = "index"
                    >
                    <a href="" @click.prevent="changeDir(path)">{{path}}</a>
                </el-breadcrumb-item>
                
            </el-breadcrumb>
        </el-row>
        <el-row>
            <el-col :span="4">
                <el-select v-model="selectedChildDir" placeholder="Select" ref = "option">
                    <el-option 
                        v-for="(childDir, index) in childDirs"
                        :key="index"
                        :label="childDir"
                        :value="childDir">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" round @click="pickSubDir">Change Directory</el-button>
            </el-col>
            
        </el-row>
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
                <el-button type="primary" round @click="AddFile">ADD</el-button>
            </el-col>
        </el-row>
        <el-row v-if ="!success">
            <el-alert
                title="error alert"
                type="error"
                :description="message"
                show-icon>
            </el-alert>
        </el-row>

        <el-row>
            <el-table
                :data="listFiles"
                stripe
                style="width: 100%">
                <el-table-column
                    prop="name"
                    label="File Name"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="birth"
                    label="Created Time"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="mtime"
                    label="Modified Time">
                </el-table-column>
                <el-table-column
                    prop="size"
                    label="size(kb)"
                    width="180">
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
import axios from 'axios'
import { Loading } from 'element-ui'

export default {
    data() {
        return {
            textarea: '',
            input: '',
            listFiles: [],
            childDirs: [],
            selectedChildDir: '',
            WorkingAt: ['files'],
            pathChildDir: '',
            success: true,
            message: '',
        }
    },
  computed: {

  },
  created() {
    this.getList(this.selectedChildDir)
  },
  computed: {
      
  },
  watch: {
      
  },
  methods: {
        getList(childDir) {
            axios.post('/api/file/get', {childDir: childDir}).then(reponse => {
                this.listFiles = reponse.data.listFiles
                this.childDirs = reponse.data.childDirs
                this.success = reponse.data.success
                this.message = reponse.data.message
            })
        },
        AddFile(){
            if(!this.input) {
                this.success = false,
                this.message = "file name should not be empty"
                return
            }
            const dir = this.pathChildDir
            this.loadingEffect()
            axios.post('/api/file/create', {fileName: this.input, fileContent: this.textarea, dir: dir}).then(reponse => {
                this.success = reponse.data.success
                this.message = reponse.data.message
                this.loading = false
                this.getList(dir)
                this.loadingEffect().close()
            })
            this.input = ''
            this.textarea = ''
        },
        deleteFile(index) {
            this.loadingEffect()
            const fileName = this.listFiles[index].name
            const dir = this.pathChildDir
            axios.post('/api/file/delete', {fileName: fileName, dir: dir}).then(reponse => {
                this.success = reponse.data.success
                this.message = reponse.data.message
                this.getList(dir)
                this.loadingEffect().close()
            })
        },
        changeDir(dir) {
            const index = this.WorkingAt.findIndex(item => {
                return dir === item
            })
            this.WorkingAt.splice(index + 1, this.WorkingAt.length)
            this.generatePathChildDir()
            this.getList(this.pathChildDir)
        },
        pickSubDir(){
            this.WorkingAt.push(this.selectedChildDir)
            this.generatePathChildDir()
            this.getList(this.pathChildDir)
            this.$refs.option.value =''
        },
        loadingEffect() {
            const loading = this.loading
            const options = {
                lock: loading,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            }
            let loadingInstance = Loading.service(options);
            return loadingInstance
        },
        generatePathChildDir() {
           this.pathChildDir = this.WorkingAt.join('/');
      }
  }
}
</script>


