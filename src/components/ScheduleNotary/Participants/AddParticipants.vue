<template>
  <form @submit.prevent="onAddParticipant">
    <div id="addSignerErrorMsg" class="text-center text-danger"></div>
    <div class="modal-body">
      <div class="my-1">
        <button
          @click="addMe"
          type="button"
          class="btn btn-outline-primary btn-sm"
        >
          Add Me
        </button>
        <button
          @click="addRow"
          type="button"
          class="btn btn-outline-primary btn-sm mx-1"
        >
          Add More
        </button>
      </div>
      <div class="table-responsive">
        <table class="table table-light" id="expense-item-table">
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th class="text-center">+/-</th>
          </tr>
          <tr class="mtable" v-for="(row, index) in rows" :key="index">
            <td>
              <input
                type="text"
                name="first_name"
                v-model="row.first_name"
                placeholder="First Name"
                class="form-control form-control-sm first_name px-1 border-0"
                required
              />
            </td>
            <td>
              <input
                type="text"
                name="last_name"
                v-model="row.last_name"
                placeholder="Last Name"
                class="form-control form-control-sm last_name px-1 border-0"
                required
              />
            </td>
            <td>
              <input
                type="email"
                name="email"
                v-model="row.email"
                placeholder="Email"
                class="form-control form-control-sm email px-1 border-0"
                required
              />
            </td>
            <td>
              <input
                type="tel"
                name="phone"
                v-model="row.phone"
                placeholder="Phone Number"
                class="form-control form-control-sm phone px-1 border-0"
              />
            </td>
            <td>
              <select
                class="form-select form-select-sm px-1 border-0"
                aria-label="Default select example"
                v-model="row.role"
                required
              >
                <option value="Signer">Signer</option>
                <option value="Viewer">Viewer</option>
              </select>
            </td>
            <td>
              <button
                type="button"
                class="btn btn-sm btn-outline-success px-1"
                :class="['btn-outline-danger', isRemove]"
                @click="removeRow(index)"
              >
                {{ row.action }}
              </button>
            </td>
          </tr>
        </table>
      </div>

      <button
        type="submit"
        class="btn btn-sm btn-primary waves-effect waves-float waves-light d-block"
      >
        Done
      </button>
    </div>
  </form>
</template>

<script>
import store from "@/store";
import { randomId } from "@/utils/helper";

export default {
  props: {
    participants: {
      type: Array,
    },
  },
  data() {
    return {
      isRemove: false,
      rows: [
        {
          id: randomId(10),
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          role: "",
          action: "-",
          entry_point: "Notary",
        },
      ],
    };
  },
  computed: {
    userProfile() {
      return store.getters["userStore/profile"];
    },
  },
  methods: {
    addMe() {
      this.rows.unshift({
        email: store.state.auth.profile?.email,
        first_name: store.state.auth.profile?.first_name,
        id: randomId(10),
        last_name: store.state.auth.profile?.last_name,
        phone: store.state.auth.profile?.phone,
        role: "Signer",
        entry_point: "Notary",

        // id: randomId(10),
        // first_name: this.userProfile.first_name,
        // last_name: this.userProfile.last_name,
        // email: this.userProfile.email,
        // phone: this.userProfile.phone,
        // role: "Signer",
        action: "-",
      });
    },
    addRow() {
      this.rows.push({
        id: randomId(10),
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        role: "",
        action: "-",
        entry_point: "Notary",
      });
    },
    removeRow(index) {
      this.isRemove = true;
      this.rows.splice(index, 1);
    },
    onAddParticipant() {
      let formObj = [];
      this.rows.forEach((obj) => {
        this.$store.commit("others/SET_SCHEDULE_FORMDATA_2", {
          id: obj.id,
          first_name: obj.first_name,
          last_name: obj.last_name,
          email: obj.email,
          phone: obj.phone,
          role: obj.role,
          entry_point: "Notary",
        });
        formObj.push({
          id: obj.id,
          first_name: obj.first_name,
          last_name: obj.last_name,
          email: obj.email,
          phone: obj.phone,
          role: obj.role,
          entry_point: "Notary",
        });
      });
      // eventBus.$emit(event.participantsList, formObj);
      this.$emit("close", true);
      formObj = [];
      this.rows = [
        {
          id: "",
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          role: "",
          action: "-",
        },
      ];
    },
  },
};
</script>

<style lang='css'>
.table > :not(caption) > * {
  padding: 0.3rem !important;
}
</style>