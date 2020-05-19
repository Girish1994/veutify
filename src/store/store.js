import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        serviceList: [
            {
                "id": 1576996323453,
                "officeCode": "A-1",
                "billingCode": "Billing-1",
                "description": "test 1",
                "uomType": "D",
                "baseCharge": "1.0",
                "claimType": "P",
                "serviceType": "G",
                "modifiersList": [
                    {
                        "code": "AE-AE",
                        "position": 1,
                        "color": "#3f51b5"
                    }
                ]
              },
              {
                "id": 1576996323454,
                "officeCode": "A-2",
                "billingCode": "Billing-2",
                "description": "test 2",
                "uomType": "D",
                "baseCharge": "2.0",
                "claimType": "P",
                "serviceType": "G",
                "modifiersList": [
                    {
                        "code": "AE-AE",
                        "position": 2,
                        "color": "#3f51b5"
                    }
                ]
              },
              {
                "id": 1576996323455,
                "officeCode": "A-3",
                "billingCode": "Billing-3",
                "description": "test 3",
                "uomType": "D",
                "baseCharge": "3.0",
                "claimType": "P",
                "serviceType": "G",
                "modifiersList": [
                    {
                        "code": "AE-AE",
                        "position": 3,
                        "color": "#3f51b5"
                    }
                ]
              },
              {
                "id": 1576996323456,
                "officeCode": "A-4",
                "billingCode": "Billing-4",
                "description": "test 4",
                "uomType": "D",
                "baseCharge": "4.0",
                "claimType": "P",
                "serviceType": "G",
                "modifiersList": [
                    {
                        "code": "AE-AE",
                        "position": 4,
                        "color": "#3f51b5"
                    }
                ]
              },
              {
                "id": 1576996323457,
                "officeCode": "A-5",
                "billingCode": "Billing-5",
                "description": "test 5",
                "uomType": "D",
                "baseCharge": "5.0",
                "claimType": "P",
                "serviceType": "G",
                "modifiersList": [
                    {
                        "code": "AE-AE",
                        "position": 1,
                        "color": "#3f51b5"
                    }
                ]
              }
        ],
        numberPerPage: 3,
        modifiersList:[ 'AE-AE', 'BE-BE', 'CE-CE', 'DE-DE'],
        localServiceData: {
            list: [],
            total: 0
        }
    },
    mutations: {
        deleteServiceFromList (state, id) {
            let index = state.serviceList.findIndex(service => service.officeCode == id);
            if (index > -1) {
                state.serviceList.splice(index, 1);
            }
        },
        updateLocalServiceData (state, data) {
            state.localServiceData = data
        }
    },
    getters: {
        numberPerPage: state => state.numberPerPage,
        totalServiceCount: state => state.serviceList.length,
        modifiersList: state => state.modifiersList,
        localServiceData: state => state.localServiceData
    },
    actions:{
        getServiceList ({ commit, state }, payload) {
            // we can use axios to call api
            return new Promise( (resolve,reject) => {
                // pagination
                let currentPage = payload ? payload.currentPage : 1;
                let params = payload ? payload.params : null;
                var begin = ((currentPage - 1) * state.numberPerPage);
                var end = begin + state.numberPerPage;

                if (params) {
                    // search
                    let filtered = state.serviceList.filter(function (item) {
                        return item.officeCode.toLowerCase().indexOf(params.toLowerCase()) >= 0
                        || item.description.toLowerCase().indexOf(params.toLowerCase()) >= 0 
                        || item.billingCode.toLowerCase().indexOf(params.toLowerCase()) >= 0;
                    });
                    commit('updateLocalServiceData', {
                        total: filtered.length,
                        list: filtered.slice(begin, end)
                    });
                    resolve(true);
                } else {
                commit('updateLocalServiceData', {
                    total: state.serviceList.length,
                    list: state.serviceList.slice(begin, end)
                });
                resolve(true);
            }
                
            });
        },
        addService ({ commit, state }, payload) {
            // we can use axios to call api
            return new Promise( (resolve,reject) => {
                
                payload.id = Date.now()
                state.serviceList.push(payload)
                resolve({
                    message: 'service Added',
                    error: false
                });
            });
        },
        editService ({ commit, state }, payload) {
            // we can use axios to call api
            return new Promise( (resolve,reject) => {
                
                let index = state.serviceList.findIndex(service => service.id == payload.id);
                if(index > -1) {
                    state.serviceList[index] = payload.data;
                    resolve({
                        message: 'service Updated',
                        error: false
                    });
                } else {
                    resolve({
                        message: 'service not found',
                        error: true
                    });
                }
                
            });
        }
    }
})