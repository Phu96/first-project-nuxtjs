<template>
    <el-row>
        <!-- <el-row :gutter="10">
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
        </el-row> -->
        <el-row>
            <el-col :span = "8">
                <el-tree 
                    :data="dirTree" 
                    :props="defaultProps"
                    highlight-current
                    :expand-on-click-node="false">
                    >
                    
                >
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <div>
                        <span v-if = "data.type === 'folder'">
                            <font-awesome-icon icon="folder"/>
                        </span>
                        <span v-if="data.type === 'file'" >
                            <font-awesome-icon icon="file-alt"/>
                        </span>
                        <span>{{ node.label }}</span>
                    </div>
                    <span class="group-button-folder" v-if = "data.type === 'folder' ">
                        <el-button type="text" @click="() => openDialogCreateDir(data)"  ><font-awesome-icon icon="folder-plus"/></el-button>
                        <el-button type="text" @click="() => openDialogCreateFile(data)"  ><font-awesome-icon icon="plus"/></el-button>
                    </span>
                </span>   
                </el-tree>
            </el-col>
            <el-dialog
                title="Create Folder"
                :visible.sync="openDialog"
                width="30%"
                >
                <el-alert v-if="!success"
                    :title="message"
                    type="error">
                </el-alert>
                <el-input placeholder="Folder Name" v-model="input"></el-input>
                <el-input v-if="isCreateFileClicked"
                    type="textarea"
                    :rows="2"
                    placeholder="Content"
                    v-model="textarea">
                </el-input>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="openDialog = false">Cancel</el-button>
                    <el-button v-if="isCreateFolderClicked" type="primary" @click="createDir">CreateDir</el-button>
                    <el-button v-if="isCreateFileClicked" type="primary" @click="createFile">CreateFile</el-button> 
                </span>
            </el-dialog>
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
            openDialog: false,
            dirTree: [],
            selectedChildDir: '',
            pathDirWhenClicked: '',
            success: true,
            message: '',
            isCreateFolderClicked: false,
            isCreateFileClicked: false,
            defaultProps: {
                children: 'children',
                label: 'name'
            }
        }
    },
    created() {
        this.getDirTree()
    },
    methods: {
        getDirTree() {
            axios.get('/api/file/getDirTree').then(reponse => {
                this.dirTree = reponse.data.dirTree
                this.success = reponse.data.success
                this.message = reponse.data.message
            })
        },

        createFile(){
            if(!this.input) {
                this.success = false,
                this.message = "file name should not be empty"
                this.checkError(this.success, this.message)
                return
            }
            const dir = this.pathDirWhenClicked
            const fileName = this.input
            const fileContent = this.textarea
            this.loadingEffect()
            axios.post('/api/file/create', {fileName, fileContent, dir}).then(reponse => {
                console.log('aaa')
                this.loadingEffect().close()
                this.success = reponse.data.success
                this.message = reponse.data.message
                if(this.success) {
                    this.openDialog = false
                    this.getDirTree()
                }
                
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
                this.checkError(this.success, this.message)
                this.getDirTree()
                this.loadingEffect().close()
            })
        },

        openDialogCreateDir(data) {
            this.openDialog = true
            this.isCreateFolderClicked = true
            this.isCreateFileClicked = false
            this.pathDirWhenClicked = data.path
        },

        openDialogCreateFile(data) {
            this.openDialog = true
            this.isCreateFileClicked = true
            this.isCreateFolderClicked = false
            this.pathDirWhenClicked = data.path
        },
        createDir(){
            const path = this.pathDirWhenClicked
            const name = this.input
            axios.post('/api/file/createDir', {name, path})
            .then(reponse => {
                this.loadingEffect().close()
                this.success = reponse.data.success
                this.message = reponse.data.message
                if(this.success) {
                    this.openDialog = false
                    this.getDirTree()
                }
            })
            this.input = ''
        },
        deleteDir(index) {
            this.loadingEffect()
            const dirName = this.childDirs[index].name
            const dir = this.pathChildDir
            axios.post('/api/file/deleteDir', {dirName: dirName, dir: dir}).then(reponse => {
                this.success = reponse.data.success
                this.message = reponse.data.message
                this.checkError(this.success, this.message)
                this.getDirTree()
                this.loadingEffect().close()
            })
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
        checkError(succ, mess) {
            if(!succ) return this.$message.error(mess);
        },
    }
}
</script>
<style>
    .el-row {
        margin-bottom: 20px
    }
    .custom-tree-node {
        font-size: 36px;
        flex: 1;
        display: flex;
        justify-content: space-between;
    }
    .el-tree-node__content{
        height: 50px;
    }

    .el-button+.el-button {
        margin: 0;
    }
</style>
