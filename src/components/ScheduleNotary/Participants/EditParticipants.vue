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
        <table class="table table-light" id="">
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th class="text-center">+/-</th>
          </tr>
          <tr
            class=""
            v-for="(participant, index) in editedParticipants"
            :key="index"
          >
            <td>
              <input
                type="text"
                name="first_name"
                v-model="participant.first_name"
                placeholder="First Name"
                class="form-control form-control-sm first_name border-0"
                required
              />
            </td>
            <td>
              <input
                type="text"
                name="last_name"
                v-model="participant.last_name"
                placeholder="Last Name"
                class="form-control form-control-sm last_name px-1 border-0"
                required
              />
            </td>
            <td>
              <input
                type="email"
                name="email"
                v-model="participant.email"
                placeholder="Email"
                class="form-control form-control-sm email px-1 border-0"
                required
              />
            </td>
            <td>
              <input
                type="tel"
                name="phone"
                v-model="participant.phone"
                placeholder="Phone Number"
                class="form-control form-control-sm phone px-1 border-0"
              />
            </td>
            <td>
              <select
                class="form-select form-select-sm px-1 border-0"
                aria-label="Default select example"
                v-model="participant.role"
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
                @click="removeRow(participant.id)"
              >
                -
              </button>
            </td>
          </tr>
        </table>
      </div>

      <div class="d-flex justify-content-start mt-1">
        <button
          type="submit"
          class="btn btn-sm btn-primary waves-effect waves-float waves-light d-block"
        >
          Done
        </button>
      </div>
    </div>
  </form>

  <!-- <template v-if="row.action != '+'">
    <button
      type="button"
      class="btn btn-sm btn-outline-success px-1"
      :class="['btn-outline-danger', isRemove]"
      @click="removeRow(index)"
    >
      {{ row.action }}
    </button>
  </template>
  <template v-else>
    <button
      type="button"
      class="btn btn-sm btn-outline-success px-1"
      @click="addRow"
    >
      {{ row.action }}
    </button>
  </template> -->
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
      editedParticipants: this.participants,
      rows: [
        {
          id: randomId(10),
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          role: "",
          action: "-",
          entry_point:
            this.$route.query.session == "notary" ? "Notary" : "Affidavit",
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
      this.editedParticipants.unshift({
        email: store.state.auth.profile?.email,
        first_name: store.state.auth.profile?.first_name,
        id: randomId(10),
        last_name: store.state.auth.profile?.last_name,
        phone: store.state.auth.profile?.phone,
        role: "Signer",
        entry_point:
          this.$route.query.session == "notary" ? "Notary" : "Affidavit",
        action: "-",
      });
    },
    addRow() {
      this.editedParticipants.push({
        id: randomId(10),
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        role: "",
        action: "-",
        entry_point:
          this.$route.query.session == "notary" ? "Notary" : "Affidavit",
      });
    },
    removeRow(id) {
      this.$store.commit("others/UNSET_SCHEDULE_FORMDATA_2", id);
      this.editedParticipants = this.editedParticipants.filter(
        (participant) => {
          return id != participant.id;
        }
      );
    },
    onAddParticipant() {
      let formObj = [];
      this.editedParticipants.forEach((obj) => {
        this.$store.commit("others/SET_SCHEDULE_FORMDATA_2", {
          id: obj.id,
          first_name: obj.first_name,
          last_name: obj.last_name,
          email: obj.email,
          phone: obj.phone,
          role: obj.role,
          entry_point:
            this.$route.query.session == "notary" ? "Notary" : "Affidavit",
        });
        formObj.push({
          id: obj.id,
          first_name: obj.first_name,
          last_name: obj.last_name,
          email: obj.email,
          phone: obj.phone,
          role: obj.role,
          entry_point:
            this.$route.query.session == "notary" ? "Notary" : "Affidavit",
        });
      });
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
