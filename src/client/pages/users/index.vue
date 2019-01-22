<template>
    <el-row>
        <el-row>
            <el-col :span = "16">
                <el-row :gutter = "20">
                    <el-col :span = "6"><el-input placeholder="Input name" v-model="inputName"></el-input></el-col>
                    <el-col :span = "6"><el-input placeholder="Input address" v-model="inputAddress"></el-input></el-col>
                    <el-col :span = "6"><el-input placeholder="Input date" v-model="inputDate"></el-input></el-col>
                    <el-col :span = "6"><el-button type="primary" icon="el-icon-plus" @click="handleCreateUser">Create</el-button></el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row>
            <el-table
                :data="listUser"
                style="width: 100%">
                <el-table-column
                    label="STT"
                    width="180">
                    <template slot-scope="scope">
                        <span v-if="!rowTableState[scope.$index].edited">{{scope.row.ordering}}</span>
                        <el-input v-if="rowTableState[scope.$index].edited"  v-model="ordering"></el-input>
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
        </el-row>
    </el-row>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapState } from 'vuex'
export default {
    data() {
        return {
            inputName: '',
            inputAddress: '',
            inputDate: '',
            ordering: '',
            name: '',
            address: '',
            date: '',
            isEdit: false,
            rowTableState: []
        }
    },
    computed: {
        ...mapGetters({
            listUser: 'user/listUser'
        })
    },
    watch: {
        listUser: {
            handler(oldVal, newVal) {
                console.log(oldVal, newVal)
            }
        }
    },
    created() {
        this.$store.dispatch('user/getListUser', function(listUser){
            this.rowTableState = listUser.map(index => ({edited: false}))
        }.bind(this))
    },
    methods: {
        handleCreateUser() {
            this.$store.dispatch('user/createUser', {
                name: this.inputName,
                address: this.inputAddress,
                date: this.inputDate
            })
            this.inputName = ''
            this.inputAddress = ''
            this.inputDate = ''
        },
        handleEditClick(scope) {
            this.rowTableState[scope.$index].edited = true
            this.isEdit = true
            this.ordering = scope.row.ordering
            this.name = scope.row.name
            this.address = scope.row.address
            this.date = scope.row.date
        },
        handleSaveClick(scope) {
        }
    }
}
</script>

