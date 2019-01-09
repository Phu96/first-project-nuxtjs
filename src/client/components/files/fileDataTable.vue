<template>
    
    <el-row>
        <create-row
            @createRow = "createRow"
        >
        </create-row>
        <el-table
            :data="fileData"
            style="width: 100%">
            <el-table-column
                prop="order"
                label="STT"
                width="180">
                <template slot-scope="scope">
                    <span v-if="!rowTableState[scope.$index].edited">{{scope.row.order}}</span>
                    <el-input v-if="rowTableState[scope.$index].edited"  v-model="order"></el-input>
                </template>
            </el-table-column>
            <el-table-column
                label="Name"
                width="180">
                <template slot-scope="scope">
                    <span v-if="!rowTableState[scope.$index].edited">{{scope.row.name}}</span>
                    <el-input v-if="rowTableState[scope.$index].edited"  v-model="name"></el-input>
                </template>
            </el-table-column>
            <el-table-column
                prop="address"
                label="Address">
                <template slot-scope="scope">
                    <span v-if="!rowTableState[scope.$index].edited">{{scope.row.address}}</span>
                    <el-input v-if="rowTableState[scope.$index].edited"  v-model="address"></el-input>
                </template>
            </el-table-column>
            <el-table-column
                prop="date"
                label="Date">
                <template slot-scope="scope">
                    <span v-if="!rowTableState[scope.$index].edited">{{scope.row.date}}</span>
                    <el-input v-if="rowTableState[scope.$index].edited" v-model="date" ></el-input>
                </template>
            </el-table-column>
            <el-table-column
                fixed="right"
                label="Operations"
                width="120">
                <template slot-scope="scope">
                    <el-button v-if="!rowTableState[scope.$index].edited" @click="handleDeleteClick(scope)" type="text" size="small" :disabled = "isEdit">Delete</el-button>
                    <el-button v-if="!rowTableState[scope.$index].edited" @click="handleEditClick(scope)" type="text" size="small" :disabled = "isEdit">Edit</el-button>
                    <el-button v-if="rowTableState[scope.$index].edited" @click="handleSaveClick(scope)" type="text" size="small">Save</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
            title="Tips"
            :visible.sync="dialogVisible"
            width="30%"
            >
            <span>Are you sure you want to delete this row?</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="handleDeleteRow">Confirm</el-button>
            </span>
        </el-dialog>
    </el-row>
</template>
<script>
import createRowFileDataTable from '@/components/files/createRowFileDataTable'
export default {
    name: 'fileDataTable',
    components: {
        'create-row': createRowFileDataTable
    },
    data() {
        return {
            indexRowDelete: '',
            dialogVisible: false,
            isEdit: false,
            rowTableState: [],
            order: '',
            name: '',
            address: '',
            date: ''
        }
    },
    props: {
        fileData: {
            type: Array,
            default: function(){
                return []
            }
        },
        path: {
            type: String,
            default: function() {
                return ''
            }
        }
    },
    created(){
        this.rowTableState = this.fileData.map(index => {
            return {edited: false}
        })
    },
    watch: {
        fileData: {
            handler(newVal, oldVal){
                this.rowTableState = newVal.map(index => {
                    return {edited: false}
                })
            }
        }
    },
    computed: {

    },
    methods: {
        handleDeleteClick(scope){
            this.dialogVisible = true
            this.indexRowDelete = scope.$index
        },
        handleEditClick(scope) {
            this.rowTableState[scope.$index].edited = true
            this.isEdit = true
            this.order = scope.row.order
            this.name = scope.row.name
            this.address = scope.row.address
            this.date = scope.row.date
        },
        handleSaveClick(scope) {
            this.isEdit = false
            this.rowTableState[scope.$index].edited = false
            this.$emit('saveFileData', {
                index: scope.$index,
                path: this.path,
                data: [this.order, this.name, this.address, this.date]
            })
        },
        handleDeleteRow(scope){
            this.$emit('deleteRowFileData', {
                index: this.indexRowDelete,
                path: this.path
            })
            this.dialogVisible = false
        },
        createRow(data){
            this.$emit('createRowFileData', {
                path: this.path,
                data: data
            })
        }
    }
}
</script>

