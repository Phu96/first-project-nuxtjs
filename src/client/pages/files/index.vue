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
        <el-row class="functional_file_system">
            <el-col :span = "8">
                <div class="button_file_system">
                    <span><h3>Manage Server File System</h3></span>
                    <span>
                        <el-button type="text" @click="() => openDialogCreateDir()" :disabled= "typeFile !== 'folder'"  ><font-awesome-icon icon="folder-plus"/></el-button>
                        <el-button type="text" @click="() => openDialogCreateFile()" :disabled= "typeFile !== 'folder'"  ><font-awesome-icon icon="plus"/></el-button>
                        <el-button type="text" @click="() => openDialogDeleteF()" :disabled= "typeFile !== 'file'"  ><font-awesome-icon icon="trash-alt"/></el-button>
                    </span>
                </div>
            </el-col>

        </el-row>
        <el-row>
            <el-col :span = "8">
                <el-tree 
                    :data="dirTree" 
                    :props="defaultProps"
                    highlight-current
                    @node-click="handleNodeClick"
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
                </span>
                </el-tree>
            </el-col>
            <el-dialog
                :title="isCreateFolderClicked? 'Create Folder' : 'Create File'"
                :visible.sync="openDialogFolder"
                width="30%"
                >
                <el-alert v-if="!success"
                    :title="message"
                    type="error">
                </el-alert>
                <el-input :placeholder="isCreateFolderClicked? 'Folder Name' : 'File Name'" v-model="input"></el-input>
                <el-input v-if="isCreateFileClicked"
                    type="textarea"
                    :rows="2"
                    placeholder="Content"
                    v-model="textarea">
                </el-input>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="openDialogFolder = false">Cancel</el-button>
                    <el-button v-if="isCreateFolderClicked" type="primary" @click="createDir">Confirm</el-button>
                    <el-button v-if="isCreateFileClicked" type="primary" @click="createFile">Confirm</el-button> 
                </span>
            </el-dialog>
            <el-dialog
                title="Delete File"
                :visible.sync="openDialogDeleteFile"
                width="30%"
                >
                <el-alert v-if="!success"
                    :title="message"
                    type="error">
                </el-alert>
                <span>Are you sure you want to delete this file?</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="openDialogDeleteFile = false">Cancel</el-button>
                    <el-button type="primary" @click="deleteFile">Delete</el-button> 
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
            openDialogFolder: false,
            openDialogDeleteFile: false,
            dirTree: [],
            pathDirWhenClicked: '',
            typeFile: '',
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
            this.$axios.$get('/api/file/getDirTree').then(reponse => {
                this.dirTree = reponse.dirTree
                this.success = reponse.success
                this.message = reponse.message
            })
        },

        createFile(){
            if(!this.input) {
                this.success = false,
                this.message = "file name should not be empty"
                return
            }
            const dir = this.pathDirWhenClicked
            const fileName = this.input
            const fileContent = this.textarea
            this.$axios.$post('/api/file/create', {fileName, fileContent, dir}).then(reponse => {
                this.success = reponse.success
                this.message = reponse.message
                if(this.success) {
                    this.openDialogFolder = false
                    this.typeFile = ''
                    this.informSuccess(this.message)
                    this.getDirTree()
                }
            })
            this.input = ''
            this.textarea = ''
        },
        deleteFile() {
            const path = this.pathDirWhenClicked
            this.$axios.$post('/api/file/delete', {path}).then(reponse => {
                this.success = reponse.success
                this.message = reponse.message
                if(this.success) {
                    this.openDialogDeleteFile = false
                    this.informSuccess(this.message)
                    this.typeFile = ''
                    this.getDirTree()
                }
            })
        },

        openDialogCreateDir() {
            this.openDialogFolder = true
            this.isCreateFolderClicked = true
            this.isCreateFileClicked = false
        },

        openDialogCreateFile() {
            this.openDialogFolder = true
            this.isCreateFileClicked = true
            this.isCreateFolderClicked = false
        },
        openDialogDeleteF() {
            this.openDialogDeleteFile = true
        },
        createDir(){
            const path = this.pathDirWhenClicked
            const name = this.input
            this.$axios.$post('/api/file/createDir', {name, path})
            .then(reponse => {
                this.success = reponse.success
                this.message = reponse.message
                if(this.success) {
                    this.openDialogFolder = false
                    this.typeFile = ''
                    this.informSuccess(this.message)
                    this.getDirTree()
                }
            })
            this.input = ''
        },
        deleteDir(index) {
            const dirName = this.childDirs[index].name
            const dir = this.pathChildDir
            this.$axios.$post('/api/file/deleteDir', {dirName: dirName, dir: dir}).then(reponse => {
                this.success = reponse.success
                this.message = reponse.message
                this.checkError(this.success, this.message)
                this.getDirTree()
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
        informSuccess(mess) {
            this.$message({
                message: mess,
                type: 'success'
        });
        },
        handleNodeClick(data) {
            this.pathDirWhenClicked = data.path
            this.typeFile = data.type
            this.isFolderOpen = true
        }
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
    .functional_file_system{
        margin: 0
    }

    .button_file_system {
        background-color:#E6CB47;
        display:flex;
        justify-content: space-between;
        align-items: center
    }
</style>
