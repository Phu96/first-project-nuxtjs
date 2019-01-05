<template>
    <el-row>
        <el-row type = "flex" class="row-bg working-dir" >
            <el-breadcrumb separator="/" class="breadcrumb">
                <el-breadcrumb-item 
                    v-for = "(path, index) in WorkingAt"
                    :key = "index"
                    >
                    <a href="" @click.prevent="changeDir(path)">{{path}}</a>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="4">
                <el-input placeholder="Subdirectory name" v-model="inputDir"></el-input>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" round @click="addSubDir">Create</el-button>
            </el-col>
            <el-col :span="4">
                <el-select v-model="selectedChildDir" placeholder="Select subdirectory" ref = "option">
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
            <el-col :span="4">
                <el-input placeholder="File name" v-model="input"></el-input>
            </el-col>
            <el-col :span="8">
                <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="Content"
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
            <el-col :span = "8">
                <el-tree :data="treeDir" :props="defaultProps" @node-click="handleNodeClick"
                    default-expand-all
                
                >
                </el-tree>
            </el-col>
            
        </el-row>
    </el-row>
</template>
<script>
import {mapGetters, mapActions} from 'vuex'
import axios from 'axios'
import { Loading } from 'element-ui'

export default {
    data() {
        return {
            textarea: '',
            input: '',
            inputDir: '',
            childDirs: [],
            treeDir: [],
            tree: [],
            selectedChildDir: '',
            WorkingAt: ['files'],
            pathChildDir: '',
            success: true,
            message: '',
            defaultProps: {
                children: 'children',
                label: 'name'
            }
        }
    },
    created() {
    this.getList(this.selectedChildDir)
    },
    methods: {
        getList(childDir) {
            axios.post('/api/file/get', {childDir: childDir}).then(reponse => {
                this.childDirs = reponse.data.childDirs
                this.treeDir = reponse.data.treeDir
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
            const fileName = this.listF[index].name
            const dir = this.pathChildDir
            axios.post('/api/file/delete', {fileName: fileName, dir: dir}).then(reponse => {
                this.success = reponse.data.success
                this.message = reponse.data.message
                this.getList(dir)
                this.loadingEffect().close()
            })
        },
        addSubDir(){
            if(!this.inputDir) {
                this.success = false,
                this.message = "Directory name should not be empty"
                return
            }
            const dir = this.pathChildDir
            const name = this.inputDir
            axios.post('/api/file/createDir', {name: name, dir: dir})
            .then(reponse => {
                this.success = reponse.data.success
                this.message = reponse.data.message
                this.getList(dir)
                this.loadingEffect().close()
            })
            this.inputDir = ''
        },
        deleteDir(index) {
            this.loadingEffect()
            const dirName = this.childDirs[index].name
            const dir = this.pathChildDir
            axios.post('/api/file/deleteDir', {dirName: dirName, dir: dir}).then(reponse => {
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
            this.selectedChildDir = ''
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
        },
        handleNodeClick(data) {
            console.log(data);
        }
    }
}
</script>


<style>
    .el-row {
        margin-bottom: 20px
    }
    .working-dir {
        height: 60px;
        font-size: 22px;
        margin: 0;
        align-items: center;
    }
    .working-dir a {
        font-size: 22px;
    }
</style>
