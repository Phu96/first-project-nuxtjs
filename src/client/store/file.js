import axios from 'axios'

export const state = () => ({
    objFile: {}
})

export const mutations = {
    UPDATE_FILELIST(state, payload) {
        state.listFiles = payload
    }
}


export const actions = {
    getListFile({commit}) {
        axios.get('/api/file').then(reponse => {
            commit('UPDATE_FILELIST', reponse.data)
        })
    },
    addFile({commit}, fileObj) {
        axios.post('/api/file/create', fileObj).then(reponse => {
            commit('UPDATE_FILELIST', reponse.data)
        })
    },
    deleteFile({commit}, index) {
        axios.post('/api/file/delete', index).then(reponse => {
            commit('UPDATE_FILELIST', reponse.data)
        })
    }
}


export const getters = {
    listFile: state => state.objFile,
    totalFile: state => state.objFile.list.length
}