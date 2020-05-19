<template>
  <v-dialog v-model="showDialog" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">{{service.officeCode ? 'Edit' : 'Add'}} Service</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Office Code"
                required
                :error-messages="officeCodeErrors"
                v-model.trim="$v.service.officeCode.$model"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Billing Code"
                required
                :error-messages="billingCodeErrors"
                v-model.trim="$v.service.billingCode.$model"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Description"
                required
                :error-messages="descriptionErrors"
                v-model.trim="$v.service.description.$model"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-row>
                <v-col cols="4">
                  <h3 class="mt-4">UOM Type</h3>
                </v-col>
                <v-col cols="8">
                  <v-radio-group v-model="service.uomType" row>
                    <v-radio label="Days" value="D"></v-radio>
                    <v-radio label="Units" value="U"></v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Base Charge"
                prefix="$"
                v-model.trim="service.baseCharge"
                type="number"
                min="0"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-row>
                <v-col cols="4">
                  <h3 class="mt-4">Claim Type</h3>
                </v-col>
                <v-col cols="8">
                  <v-radio-group v-model="service.claimType" row>
                    <v-radio label="Professional" value="P"></v-radio>
                    <v-radio label="Institutional" value="I"></v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-row>
                <v-col cols="4">
                  <h3 class="mt-4">Service Type</h3>
                </v-col>
                <v-col cols="8">
                  <v-radio-group v-model="service.serviceType" row>
                    <v-radio label="Group" value="G"></v-radio>
                    <v-radio label="Individual" value="I"></v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-card class="mx-auto">
                <v-container>
                  <v-row>
                    <v-col cols="4">
                      <h4>Modifiers</h4>
                    </v-col>
                    <v-spacer/>
                    <v-col cols="1">
                      <v-icon color="blue" @click="toggleModiferPopup">mdi-plus</v-icon>
                    </v-col>
                  </v-row>
                  <v-row>
                    <div v-for="item in service.modifiersList" :key="item.code">
                      <v-chip
                        class="ma-2"
                        close
                        :color="item.color"
                        text-color="white"
                        @click:close="removeModifiers(item)"
                      >
                        <v-avatar left class="white">
                          <span :style="{'color': item.color }">{{item.position}}</span>
                        </v-avatar>
                        {{item.code}}
                      </v-chip>
                    </div>
                  </v-row>
                </v-container>
              </v-card>
            </v-col>
          </v-row>
          <v-dialog v-model="showModifierDialog" persistent max-width="400px">
            <v-card>
              <v-card-title>
                <span class="headline">Add Modifiers</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-combobox v-model="selectedModifer" :items="modifiersList" label="Code"></v-combobox>
                    </v-col>
                    <v-col cols="12">
                      <h4>Position</h4>
                      <v-btn-toggle v-model="modifierPostion" group :color="modifierColor">
                        <v-btn class="mr-2" :value="1" color="#4CAF50">1</v-btn>

                        <v-btn class="mr-2" :value="2" color="#2196f3">2</v-btn>

                        <v-btn class="mr-2" :value="3" color="#ff9800">3</v-btn>

                        <v-btn class="mr-2" :value="4" color="#3f51b5">4</v-btn>
                      </v-btn-toggle>
                    </v-col>
                    <span color="error" v-if="modiferError">{{modiferError}}</span>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn outlined color="blue" text @click="toggleModiferPopup">Close</v-btn>
                <v-btn outlined color="blue" text @click="addModifier">Add</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closePopup">Close</v-btn>
        <v-btn color="blue darken-1" text @click="SaveService">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { required } from "vuelidate/lib/validators";
import { mapGetters, mapMutations, mapActions } from "vuex";
export default {
  name: "Service",
  props:['data'],
  data: () => ({
    showDialog: true,
    showModifierDialog: false,
    service: {
      officeCode: null,
      billingCode: null,
      description: null,
      baseCharge: 0,
      uomType: "D",
      claimType: "P",
      serviceType: "G",
      modifiersList: []
    },
    //
    selectedModifer: null,
    modifierPostion: null,
    modifierColor: null,
    modiferError: null
  }),
  created () {
    if (this.data) {
      this.service = this.data;
    }
  },
  watch: {
    modifierPostion() {
      switch (this.modifierPostion) {
        case 1:
          this.modifierColor = "#4CAF50";
          break;
        case 2:
          this.modifierColor = "#2196f3";
          break;
        case 3:
          this.modifierColor = "#ff9800";
          break;
        case 4:
          this.modifierColor = "#3f51b5";
          break;
      }
    }
  },
  computed: {
    ...mapGetters(["modifiersList"]),
    officeCodeErrors() {
      let errors = [];
      if (!this.$v.service.officeCode.$dirty) return errors;
      !this.$v.service.officeCode.required &&
        errors.push("Office Code is required");
      return errors;
    },
    billingCodeErrors() {
      let errors = [];
      if (!this.$v.service.billingCode.$dirty) return errors;
      !this.$v.service.billingCode.required &&
        errors.push("Billing Code is required");
      return errors;
    },
    descriptionErrors() {
      let errors = [];
      if (!this.$v.service.description.$dirty) return errors;
      !this.$v.service.description.required &&
        errors.push("Description is required");
      return errors;
    }
  },
  validations: {
    service: {
      officeCode: {
        required
      },
      billingCode: {
        required
      },
      description: {
        required
      }
    }
  },
  methods: {
     ...mapActions([
        'addService',
        'editService',
        'getServiceList'
      ]),
    addModifier() {
      if (!this.selectedModifer) {
        this.modiferError = "Code is required.";
        return;
      } else if (!this.modifierPostion) {
        this.modiferError = "Position is required.";
        return;
      } else {
        let index = this.service.modifiersList.findIndex(
          ele => ele.code == this.selectedModifer
        );
        if (index > -1) {
          this.modiferError = "Modifier already exist.";
          return;
        } else
          this.service.modifiersList.push({
            code: this.selectedModifer,
            position: this.modifierPostion,
            color: this.modifierColor
          });
        this.toggleModiferPopup();
      }
    },
    toggleModiferPopup() {
      this.selectedModifer = null;
      this.modifierPostion = null;
      this.modifierColor = null;
      this.modiferError = null;
      this.showModifierDialog = !this.showModifierDialog;
    },
    SaveService() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        if (this.service.id) {
          this.editService({data: this.service, id: this.service.id}).then(result => {
            this.getServiceList()
          this.closePopup();
          }).catch(error => {
            console.log(error)
          });
        } else {
        this.addService(this.service).then(result => {
          this.getServiceList()
          this.closePopup();
        }).catch(error => {
          console.log(error)
        }); 
        }
      }
    },
    removeModifiers(item) {
      let index = this.service.modifiersList.findIndex(mod => mod.code == item.code);
      if (index > -1) {
        this.service.modifiersList.splice(index, 1);
      }
    },
    closePopup() {
      this.$emit("closePopup");
    }
  }
};
</script>
<style lang="sass" scoped>

</style>


