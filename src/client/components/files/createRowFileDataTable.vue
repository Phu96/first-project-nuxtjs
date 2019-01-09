<template>
     <el-row :gutter = "20">
        <el-col :span = "6"><el-input placeholder="Input name" v-model="inputName"></el-input></el-col>
        <el-col :span = "6"><el-input placeholder="Input address" v-model="inputAddress"></el-input></el-col>
        <el-col :span = "6"><el-input placeholder="Input date" v-model="inputDate"></el-input></el-col>
        <el-col :span = "6"><el-button type="primary" icon="el-icon-plus" @click="handleCreateRow">Create</el-button></el-col>
    </el-row>
</template>
<script>
export default {
    data(){
        return {
            inputName: '',
            inputDate: '',
            inputAddress: ''
        }
    },
    methods: {
        handleCreateRow(){
            this.$emit('createRow', [
                this.inputName,
                this.inputAddress,
                this.inputDate
            ])
            this.inputName = ''
            this.inputAddress = ''
            this.inputDate = ''
        }
    }
}
</script>
