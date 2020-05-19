<template>
  <v-container>
    <v-row >
      <v-col cols="3">
        Services ({{totalServiceCount}})
      </v-col>
      <v-spacer/>
      <v-col cols="3">
         <v-text-field
            label="Search"
            clearable
            type="text"
            append-icon="mdi-search-web"
            v-model="searchParam"
          >
          </v-text-field>
      </v-col>
      <v-col cols="1">
         <v-icon @click="addService" color="blue">mdi-plus</v-icon>
      </v-col>
    </v-row>
    <v-simple-table >
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">Office Code</th>
          <th class="text-left">Description</th>
          <th class="text-left">Billing Code</th>
          <th class="text-left">Base Chrage</th>
          <th class="text-left">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in serviceList" :key="item.id">
          <td>{{ item.officeCode }}</td>
          <td>{{ item.description }}</td>
          <td>{{ item.billingCode }}</td>
          <td>$ {{ item.baseCharge }}</td>
          <td>
            <v-icon @click="editService(item)" class="mr-2">mdi-pencil</v-icon>
            <v-icon @click="deleteService(item)" >mdi-delete</v-icon>
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
  <div class="text-center">
    <v-pagination
      v-model="page"
      :circle="true"
      :disabled="false"
      :length="totalLength"
      next-icon="mdi-chevron-right"
      prev-icon="mdi-chevron-left"
      :page="page"
      :total-visible="5"
    ></v-pagination>
  </div>
  </v-container>
</template>

<script>
import { mapGetters, mapMutations, mapActions  } from 'vuex'
  export default {
    name: 'HelloWorld',
    data: () => ({
      page: 1,
      totalLength: 0,
      searchParam: null,
      serviceList: []
    }),
    computed: {
      ...mapGetters([
        'totalServiceCount',
        'numberPerPage',
        'localServiceData'
      ])
    },
    watch: {
      totalServiceCount () {
        this.getList();
      },
      searchParam () {
        this.page = 1;
        this.getList();
      },
      page () {
        this.getList();
      }
    },
    created () {      
      this.getList();
    },
    methods: {
      ...mapMutations([
        'deleteServiceFromList'
      ]),
      ...mapActions([
        'getServiceList'
      ]),
      getList () {
        // simulating api call
        this.getServiceList({currentPage: this.page, params: this.searchParam}).then(result => {
           this.serviceList = this.localServiceData.list;
          this.totalLength = Math.ceil((this.searchParam ? this.localServiceData.total : this.totalServiceCount) /this.numberPerPage);
        }).catch(error => {
          console.log(error)
        });       
      },
      addService () {
        this.$emit('showService');
      },
      editService (item) {
        this.$emit('showService', item);
      },
      deleteService (item) {
        this.deleteServiceFromList(item.officeCode);
        this.getList();
      }
    }
  }
</script>
