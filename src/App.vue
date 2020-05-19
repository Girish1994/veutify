<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
     <v-toolbar-title class="ml-2">
    Task
  </v-toolbar-title>
    </v-app-bar>

    <v-content>
      <serviceList v-on:showService="toggleServiceDialog" />
      <service :data="serviceData"  v-if="showServiceDialog" v-on:closePopup="toggleServiceDialog()" />
    </v-content>
  </v-app>
</template>

<script>
import serviceList from './components/ServiceList';
import service from './components/service';
export default {
  name: 'App',

  components: {
    serviceList,
    service
  },

  data: () => ({
    showServiceDialog: false,
    serviceData: null,
  }),
  methods: {
    toggleServiceDialog (data) {
      if (data) {
        this.serviceData = data;
      } else {
        this.serviceData = null;
      }
      this.showServiceDialog = !this.showServiceDialog;
    }
  }
};
</script>
