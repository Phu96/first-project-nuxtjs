<template>
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
                <el-button v-if="!rowTableState[scope.$index].edited" @click="handleClick(scope)" type="text" size="small" :disabled = "isEdit">Detail</el-button>
                <el-button v-if="!rowTableState[scope.$index].edited" @click="handleEditClick(scope)" type="text" size="small" :disabled = "isEdit">Edit</el-button>
                <el-button v-if="rowTableState[scope.$index].edited" @click="handleSaveClick(scope)" type="text" size="small">Save</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>
<script>
export default {
    name: 'fileDataTable',
    data() {
        return {
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
        console.log(this.rowTableState)
    },
    watch: {

    },
    computed: {

    },
    methods: {
        handleClick(scope){
            console.log(scope)
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
            console.log(this.path)
            this.isEdit = false
             this.rowTableState[scope.$index].edited = false
            this.$emit('saveFileData', {
                index: scope.$index,
                path: this.path,
                data: [this.order, this.name, this.address, this.date]
            })
        }
    }
}
</script>

