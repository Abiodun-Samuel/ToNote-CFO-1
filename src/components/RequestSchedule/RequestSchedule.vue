<template>
  <section class="container">
    <div
      v-if="authloading"
      class="d-flex justify-content-center align-items-center"
      style="height: 100vh"
    >
      <PreLoader />
    </div>
    <div v-else class="content-body">
      <h3>Requesting a Notary</h3>
      <div class="mb-2">
        <li>Please select a date and time for your notary session.</li>
        <li>Choose a convenient time for you and your signers.</li>
        <li>
          We will send you a confirmation email with the meeting link and
          session time.
        </li>
        <li>You can track the status of your requests in “My Requests”.</li>
      </div>

      <hr />

      <section class="invoice-edit-wrapper">
        <div class="row invoice-edit">
          <!-- Request section  -->
          <div class="col-xl-7 col-md-6 col-12">
            <div>
              <div class="card">
                <div class="card-body">
                  <TemplateRequest />
                  <hr />
                  <ScheduleType />
                  <hr />
                  <InviteNotary />
                </div>
              </div>

              <!-- <h5 class="fw-bolder">Request title</h5>
              <div class="card">
                <input
                  type="text"
                  v-model="title"
                  :class="{ error: $v.title.$error }"
                  placeholder="Add Title"
                  class="form-control request-title"
                />
                <template v-if="$v.title.$error">
                  <p
                    v-if="!$v.title.required"
                    class="small text-danger my-0 py-0 px-1"
                  >
                    Title field is required.
                  </p>
                </template>
              </div> -->

              <div class="card">
                <div class="card-body">
                  <h5 class="fw-bolder">Add Comment</h5>
                  <textarea
                    class="form-control"
                    rows="2"
                    id="note"
                    v-model="description"
                    placeholder="Add comment"
                  ></textarea>

                  <!-- :class="{ error: $v.description.$error }" -->
                  <!-- <template v-if="$v.description.$error">
                    <p
                      v-if="!$v.description.required"
                      class="small text-danger my-0 py-0 px-1"
                    >
                      comment field is required.
                    </p>
                  </template> -->
                </div>
              </div>
            </div>
          </div>

          <!-- Add participant section  -->
          <div class="col-xl-5 col-md-6 col-12">
            <div class="invoice-preview-card">
              <div class="card-body invoice-padding invoice-product-details">
                <div data-repeater-list="group-a">
                  <div class="repeater-wrapper">
                    <div
                      class="border-bottom d-flex justify-content-between pb-1"
                    >
                      <div>
                        <h5 class="fw-bolder">Participants</h5>
                      </div>
                      <div>
                        <button
                          type="button"
                          class="btn btn-outline-primary btn-sm"
                          @click="openParticipantsModal = true"
                        >
                          {{ participants.length > 0 ? "Edit" : "+ Add" }}
                        </button>
                      </div>
                    </div>
                    <div class="row mt-2">
                      <div
                        class="
                          col-12
                          d-flex
                          product-details-border
                          position-relative
                          pe-0
                        "
                      >
                        <div
                          class="table-responsive"
                          v-if="participants.length > 0"
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
                                v-for="(participant, index) in participants"
                                :key="participant + index"
                              >
                                <th scope="row">{{ ++index }}</th>
                                <td>
                                  {{
                                    `${participant.first_name} ${participant.last_name}`
                                  }}
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
                        <div v-else>
                          <p class="text-danger">No paricipants added</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-12">
          <button
            @click="proceed"
            :disabled="submitScheduleLoader"
            class="btn btn-primary"
          >
            Submit Request
          </button>
        </div>
      </section>

      <!-- add participants modal  -->
      <BaseModal
        :show="openParticipantsModal"
        :size="'modal-lg'"
        @close="openParticipantsModal = false"
      >
        <template #header>
          <h4 class="modal-title">
            {{
              participants.length > 0 || participants.length ? "Edit" : "Add"
            }}
            Participant(s)
          </h4>
        </template>

        <template #body>
          <EditParticipants
            v-if="participants.length > 0"
            :participants="participants"
            @close="openParticipantsModal = false"
          />
          <AddParticipants v-else @close="openParticipantsModal = false" />
        </template>
      </BaseModal>

      <!-- payment modal  -->
      <BaseModal
        data-aos="zoom-in"
        :show="openPaymentModal"
        :size="'modal-md'"
        @close="openPaymentModal = false"
      >
        <template #header>
          <h4 class="modal-title">Transaction cost</h4>
        </template>

        <template #body>
          <PaymentComponent @close="openPaymentModal = false" />
        </template>
      </BaseModal>
    </div>
  </section>
</template>

<script>
import InviteNotary from "@/components/RequestSchedule/Notary/InviteNotary.vue";
import AddParticipants from "@/components/RequestSchedule/Participants/AddParticipants.vue";
import EditParticipants from "@/components/RequestSchedule/Participants/EditParticipants.vue";
import TemplateRequest from "@/components/RequestSchedule/Template/TemplateRequest.vue";
import ScheduleType from "@/components/RequestSchedule/ScheduleType/ScheduleType.vue";
import PaymentComponent from "@/components/Payment/PaymentComponent.vue";
import PreLoader from "@/components/Loader/PreLoader.vue";
import { eventBus } from "@/utils/event-bus";
// import { required } from "vuelidate/lib/validators";
import { event, type } from "@/utils/constants";
import { platformInitiated } from "@/utils/helper";
import { store } from "@/store/index";
import moment from "moment";
import AOS from "aos";
import "aos/dist/aos.css";
import router from "@/router";
AOS.init();

export default {
  data() {
    return {
      openParticipantsModal: false,
      openPaymentModal: false,
      submitScheduleLoader: false,
      loading: false,
      disabled: true,
      title: "",
      description: "",
      document_template_id: "",
      files: [],
      participants: [
        {
          email: this.$store.state.userStore.profile?.email,
          first_name: this.$store.state.userStore.profile?.first_name,
          id: this.$store.state.userStore.profile?.id,
          last_name: this.$store.state.userStore.profile?.last_name,
          phone: this.$store.state.userStore.profile?.phone,
          role: "Signer",
        },
      ],
      type: "",
      schedule_type: "", //or schedule
      notaryDocument: [], //participants array
      start_time: "",
    };
  },
  computed: {
    authloading() {
      return store.state.userStore.loading;
    },
    userProfile() {
      return store.getters["userStore/profile"];
    },
    isAuth() {
      return store.state.authStore.isAuthenticated;
    },
  },
  components: {
    InviteNotary,
    AddParticipants,
    EditParticipants,
    PreLoader,
    TemplateRequest,
    ScheduleType,
    PaymentComponent,
  },
  // validations: {
  //   description: {
  //     required,
  //   },
  // },
  methods: {
    deleteParticipant(id) {
      this.participants = this.participants.filter((participant) => {
        return participant.id != id;
      });
    },
    ResetFormData() {
      this.title = "";
      this.description = " ";
      this.type = "";
      this.schedule_type = "";
      this.start_time = "";
      this.participants = [];
      this.document_template_id = "";
      this.files = [];
      this.date = "";
    },
    calcEndTime(startTime) {
      if (startTime) {
        let [hours, minutes, seconds] = startTime.split(":");
        minutes = Number(minutes) + 15;
        if (minutes >= 60) {
          hours = Number(hours) + 1;
          minutes = "00";
        }
        let result = `${hours}:${minutes}:${seconds}`;
        return result;
      } else {
        const TimeNow = Math.round(Date.now() / 1000) + 900;
        const result = new Date(TimeNow * 1000).toLocaleTimeString("en-NG");
        return result;
      }
    },
    proceed() {
      // this.$v.$touch();
      if (!this.schedule_type)
        return this.$toast.error("Please select a time slot.");
      // if (!this.description)
      //   return this.$toast.error("Please add a description");
      if (!this.type)
        return this.$toast.error(
          "Please select a template or upload your custom affidavit"
        );
      if (this.type === type.Template && !this.document_template_id)
        return this.$toast.error("Please select a template.");
      if (this.type === type.Upload && this.files.length === 0)
        return this.$toast.error("Please  upload a custom template.");
      if (this.participants.length === 0)
        return this.$toast.error("Please add participants.");
      if (this.schedule_type !== type.Immediate && !this.start_time)
        return this.$toast.error("Please select time.");
      if (this.schedule_type !== type.Immediate && !this.date)
        return this.$toast.error("Please select a date.");

      // if () {
      // if (!this.$v.$invalid) {
      this.submitScheduleLoader = true;
      if (this.type == type.Template) {
        let TemplateFormData = {
          title: this.title,
          description: !this.description ? "description" : this.description,
          type: this.type,
          document_template_id: this.document_template_id,
          immediate: this.schedule_type == type.Immediate ? true : false,
          request_type: this.type,
          delivery_channel: "Email",
          delivery_address: !this.userProfile.address
            ? "Address"
            : this.userProfile.address,
          platform_initiated: platformInitiated(),
          actor_type: !this.userProfile.is_business ? "User" : "Team",
          date:
            this.schedule_type === type.Immediate
              ? moment().format("YYYY-MM-DD")
              : this.date,
          set_reminder_in_minutes: "15",
          start_time:
            this.schedule_type === type.Immediate
              ? moment().format("HH:mm:ss")
              : this.start_time,
          end_time:
            this.schedule_type === type.Immediate
              ? this.calcEndTime()
              : this.calcEndTime(this.start_time),
          participants: this.participants,
        };
        console.log(TemplateFormData);
        store
          .dispatch(
            "scheduleStore/ScheduleVirtualSessionAction",
            TemplateFormData
          )
          .then(
            () => {
              this.ResetFormData();
              this.submitScheduleLoader = false;
              eventBus.$emit(event.ResetFormData);
              // this.$v.$reset();
              // open payment modal
              this.openPaymentModal = true;
            },
            (error) => {
              console.log(error);
            }
          );
      }
      if (this.type == type.Upload) {
        let UploadFormData = {
          title: this.title,
          description: !this.description ? "description" : this.description,
          type: this.type,
          files: this.files,
          immediate: this.schedule_type == type.Immediate ? true : false,
          request_type: this.type,
          delivery_channel: "Email",
          delivery_address: !this.userProfile.address
            ? "Address"
            : this.userProfile.address,
          platform_initiated: platformInitiated(),
          actor_type: !this.userProfile.is_business ? "User" : "Team",
          date:
            this.schedule_type === type.Immediate
              ? moment().format("YYYY-MM-DD")
              : this.date,
          set_reminder_in_minutes: "15",
          start_time:
            this.schedule_type === type.Immediate
              ? moment().format("HH:mm:ss")
              : this.start_time,
          end_time: this.calcEndTime(this.start_time),
          participants: this.participants,
        };
        store
          .dispatch(
            "scheduleStore/ScheduleVirtualSessionAction",
            UploadFormData
          )
          .then(
            () => {
              this.submitScheduleLoader = false;
              this.ResetFormData();
              eventBus.$emit(event.ResetFormData);
              // this.$v.$reset();
              // open payment modal
              this.openPaymentModal = true;
            },
            (error) => {
              console.log(error);
            }
          );
      }
      // }
    },
  },
  created() {
    if (!this.isAuth) {
      if (!this.$route.query.user || this.$route.query.user == null) {
        return router.push({ name: "home" });
      }
      store.commit("authStore/SET_TOKEN", this.$route.query.user);
      store.commit("authStore/SET_TOKEN_TYPE", "Bearer");
      store.dispatch("userStore/getProfile").then(
        () => {
          store.dispatch("teamStore/getTeams");
          store.commit("authStore/SET_AUTH_STATE", true);
        },
        () => {
          // this.$toast.error("Unathorized");
        }
      );
    }

    eventBus.$on(event.documentTemplateDetails, (data) => {
      this.title = data.documentTitle;
      this.document_template_id = data.documentId;
    });
    eventBus.$on(event.documentUploadDetails, (data) => {
      this.title = data.documentTitle;
      data.documentFile
        ? (this.files = [data.documentFile])
        : (this.files = []);
    });
    eventBus.$on(event.documentTemplateType, (data) => {
      this.type = data;
    });
    eventBus.$on(event.scheduleType, (data) => {
      this.schedule_type = data.schedule_type;
      this.date = data.date;
      this.start_time = data.time;
    });
    eventBus.$on(event.participantsList, (data) => {
      this.participants = data;
    });
  },
};
</script>

<style scoped>
.error {
  border: 1.5px solid red;
}
</style>
