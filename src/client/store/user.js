import axios from 'axios'


export const state = () => ({
    listUser: []
})


export const mutations = {
    UPDATE_LIST_USER(state, payload) {
        state.listUser = payload
    }
}


export const actions = {
    async getListUser({commit}, cb) {
            const data = await this.$axios.$get('/api/user/getAll')
            commit('UPDATE_LIST_USER', data.listUser)
            cb(data.listUser)
    },
    createUser({commit}, user) {
        this.$axios.$post('/api/user/create', user).then(reponse => {
            commit('UPDATE_LIST_USER', reponse.listUser)
        })
    },
    editUser({commit}, info) {
        axios.post('/api/user/edit', info).then(reponse => {
            commit('UPDATE_LIST_USER', reponse.data.listUser)
        })
    },
    deleteUser({commit, userId}) {
        axios.post('/api/user/delete').then(reponse => {
            commit('UPDATE_LIST_USER', reponse.data.listUser)
        })
    }
}

export const getters = {
    listUser: state => state.listUser
}