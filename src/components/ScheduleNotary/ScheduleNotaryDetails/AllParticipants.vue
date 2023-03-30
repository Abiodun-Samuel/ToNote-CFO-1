<template>
  <div class="mt-2">
    <div
      class="my-2 d-flex justify-content-center align-items-center flex-column"
    >
      <img
        data-aos="zoom-up"
        v-if="!schedule_formdata.participants.length"
        src="../../../assets/images/participants.png"
        alt="participants"
        class="img-fluid"
        width="250"
      />
      <button
        class="btn btn-sm btn-outline-primary my-1 rounded"
        @click="openParticipantsModal = true"
      >
        <Icon icon="fluent:add-12-filled" height="20" width="20" />
        <span class="mx-1">Add Participants</span>
      </button>
    </div>

    <div v-if="schedule_formdata.participants.length > 0">
      <h5 class="fw-bolder">Participants</h5>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <div
          class="table-responsive"
          v-if="schedule_formdata.participants.length > 0"
        >
          <table class="table">
            <thead>
              <tr>
                <th scope="col">S/N</th>
                <th scope="col">Fullname</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(participant, index) in schedule_formdata.participants"
                :key="participant + index"
              >
                <th scope="row">{{ ++index }}</th>
                <td>
                  {{ `${participant.first_name} ${participant.last_name}` }}
                </td>
                <td>{{ participant.email }}</td>
                <td>{{ participant.role }}</td>
                <td>
                  <button
                    @click="deleteParticipant(participant.id)"
                    class="btn btn-sm btn-outline-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <hr />

    <div class="d-flex justify-content-end align-items-center mt-2">
      <button class="mx-1 previous__btn" @click="back">
        <Icon icon="eva:arrow-back-outline" />
      </button>
      <button
        :disabled="!schedule_formdata.participants.length"
        class="btn btn-primary"
        @click="proceed"
      >
        Next
      </button>
    </div>
  </div>

  <ModalComp
    :show="openParticipantsModal"
    :size="'modal-lg'"
    @close="openParticipantsModal = false"
  >
    <template #header>
      <h4 class="modal-title">
        {{
          schedule_formdata.participants.length > 0 ||
          schedule_formdata.participants.length
            ? "Edit"
            : "Add"
        }}
        Participant(s)
      </h4>
    </template>

    <template #body>
      <EditParticipants
        v-if="schedule_formdata.participants.length > 0"
        :participants="schedule_formdata.participants"
        @close="openParticipantsModal = false"
      />
      <AddParticipants v-else @close="openParticipantsModal = false" />
    </template>
  </ModalComp>
</template>

<script>
import ModalComp from "@/components/ModalComp.vue";
import { Icon } from "@iconify/vue";
import AddParticipants from "@/components/ScheduleNotary/Participants/AddParticipants.vue";
import EditParticipants from "@/components/ScheduleNotary/Participants/EditParticipants.vue";
import { randomId } from "@/utils/helper";
import store from "@/store";

export default {
  components: { Icon, AddParticipants, EditParticipants, ModalComp },
  data() {
    return {
      openParticipantsModal: false,
      step: 1,
    };
  },
  computed: {
    schedule_formdata() {
      return store.getters["others/schedule_formdata"];
    },
    // participants() {
    //   return this.$store.state.documentStore.participants;
    //   // return this.$store.getters["documentStore/participants"];
    // },
  },
  methods: {
    deleteParticipant(id) {
      store.commit("others/UNSET_SCHEDULE_FORMDATA_2", id);
      // this.participants = this.participants.filter((participant) => {
      //   return participant.id != id;
      // });
    },
    proceed() {
      this.$emit("current", this.step + 1);
    },
    back() {
      this.$emit("current", this.step - 1);
    },
  },
  mounted() {
    store.commit("others/SET_SCHEDULE_FORMDATA_2", {
      email: store.state.auth.profile?.email,
      first_name: store.state.auth.profile?.first_name,
      id: randomId(10),
      last_name: store.state.auth.profile?.last_name,
      phone: store.state.auth.profile?.phone,
      role: "Signer",
      entry_point: "Notary",
    });
  },
};
</script>

<style lang="css">
.previous__btn {
  border-radius: 50%;
  border: 1.5px solid grey;
  height: 36px;
  width: 36px;
  color: grey;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>