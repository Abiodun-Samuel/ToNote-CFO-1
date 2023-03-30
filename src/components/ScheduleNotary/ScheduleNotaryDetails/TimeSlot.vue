<template>
  <div>
    <div class="mb-2">
      <h5 class="fw-bolder">Pick a time slot</h5>

      <div class="d-flex align-items-center gap-1 my-2">
        <button
          v-if="schedule_formdata?.TemplateType != 'Custom'"
          @click="switchScheduleType('Immediate')"
          :class="
            schedule_type === 'Immediate'
              ? 'btn btn-outline-primary'
              : 'btn not__active'
          "
          type="button"
          aria-selected="true"
        >
          <Icon
            v-if="schedule_type === 'Immediate'"
            icon="eva:checkmark-circle-2-fill"
            :width="19"
            :height="19"
          />
          Immediate
        </button>
        <button
          @click="switchScheduleType('Schedule')"
          :class="
            schedule_type === 'Schedule'
              ? 'btn btn-outline-primary'
              : 'btn not__active'
          "
          type="button"
          aria-selected="true"
        >
          <Icon
            v-if="schedule_type === 'Schedule'"
            icon="eva:checkmark-circle-2-fill"
            :width="19"
            :height="19"
          />
          Schedule
        </button>
      </div>

      <transition enter-active-class="slideInDown">
        <div v-if="schedule_type === 'Schedule'">
          <div class="row col-lg-12 col-12 my-2">
            <div class="col-4">
              <!-- placeholder="Select Date" -->
              <label for="" class="form-label">Date</label>
              <div class="form-group mb-1">
                <Datepicker
                  @selected="dateSelected"
                  :value="date"
                  format="yyyy-MM-dd"
                  :iconHeight="0"
                  :iconWidth="0"
                  class="w-100"
                  :disabled-dates="{
                    to: new Date(
                      new Date().getFullYear(),
                      new Date().getMonth(),
                      new Date().getDate()
                    ),
                  }"
                />
              </div>
            </div>
            <div class="col-4">
              <label for="time" class="form-label">Time</label>
              <div class="form-group mb-1">
                <select id="time" v-model="time" class="form-control">
                  <option value="Select time" disabled selected>
                    Select time
                  </option>
                  <option
                    v-for="(time, index) in time_slots"
                    :key="time + index"
                    :value="time"
                  >
                    {{ time }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <hr />

    <div class="my-2">
      <h5 class="fw-bolder">Select a Commissioner for Oaths(CFO)</h5>

      <transition enter-active-class="slideInDown">
        <div class="my-2 bg-white rounded shadow">
          <div class="shadow p-1 rounded">
            <!-- filter div -->
            <div class="row d-flex align-items-end">
              <!-- mydate  -->
              <!-- <div class="col-lg-2 col-md-3 col-4 mt-1">
                <label class="form-label">Date</label>
                <Datepicker
                  v-model="date"
                  @selected="dateSelected"
                  calendar-button-icon=""
                  :calendar-button="false"
                  format="yyyy-MM-dd"
                  :iconHeight="0"
                  :iconWidth="0"
                  :disabled-dates="{
                    to: new Date(
                      new Date().getFullYear(),
                      new Date().getMonth(),
                      new Date().getDate()
                    ),
                  }"
                />
              </div> -->

              <!-- time  -->
              <!-- <div class="col-lg-2 col-md-3 col-4 mt-1">
                <label class="form-label">Time</label>
                <select v-model="time" class="form-control">
                  <option
                    v-for="(time, index) in time_slots"
                    :key="time + index"
                    :value="time"
                  >
                    {{ time }}
                  </option>
                </select>
              </div> -->

              <!-- country   -->
              <div class="col-lg-2 col-md-3 col-4 mt-1">
                <label class="form-label">Country</label>
                <select
                  class="form-select"
                  v-model="country_id"
                  aria-label="select country"
                >
                  <option
                    v-for="country in countries"
                    :key="country.id"
                    :value="country.id"
                  >
                    {{ country.name }}
                  </option>
                </select>
              </div>
              <!-- state  -->
              <div class="col-lg-2 col-md-3 col-4 mt-1">
                <label class="form-label">State</label>
                <select
                  class="form-select"
                  v-model="state_id"
                  aria-label="select state"
                >
                  <option
                    v-for="state in states"
                    :key="state.id"
                    :value="state.id"
                  >
                    {{ state.name }}
                  </option>
                </select>
              </div>

              <!-- filter button  -->
              <div class="col-lg-2 col-md-3 col-4 mt-1">
                <button
                  :disabled="!state_id && !country_id"
                  @click="FilterNotary"
                  class="btn btn-primary d-flex"
                  type="button"
                >
                  <span
                    v-if="loading_filter"
                    class="spinner-border spinner-border-sm me-1"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Filter
                </button>
              </div>
            </div>
            <!-- reset filter  -->
            <button @click="ResetFilter" class="btn reset__btn text-danger">
              Reset
            </button>
          </div>

          <hr />

          <div
            v-if="loading_filter || reset_loading"
            class="d-flex justify-content-center align-items-center my-2"
          >
            <PreLoader />
          </div>

          <div v-else class="table-responsive my-2 shadow">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">State</th>
                  <th scope="col">Country</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="notary in notary_list"
                  :key="notary.id"
                  :class="
                    notary.id === selectedNotary &&
                    'text-primary fw-bolder bg-light border-2'
                  "
                >
                  <td class="d-flex align-items-center">
                    <div class="notary-avatar position-relative">
                      <img
                        v-if="notary.avatar"
                        :src="notary.avatar"
                        alt="notary image"
                        height="40"
                        width="40"
                      />
                      <Icon
                        v-else
                        icon="carbon:user-avatar-filled-alt"
                        height="40"
                        width="40"
                      />
                    </div>
                    <label class="ms-1" :for="notary.id">{{
                      notary.first_name + " " + notary.last_name
                    }}</label>
                  </td>
                  <td>
                    <label :for="notary.id">{{
                      notary.state ? notary.state : "---"
                    }}</label>
                  </td>
                  <td>
                    <label :for="notary.id">{{
                      notary.country ? notary.country : "---"
                    }}</label>
                  </td>
                  <td>
                    <div class="d-flex align-items-center">
                      <Icon
                        icon="radix-icons:dot-filled"
                        height="30"
                        width="30"
                        :color="notary.is_online ? 'green' : 'red'"
                      />
                      <label class="small" :for="notary.id">
                        {{ notary.is_online ? "Online" : "Offline" }}
                      </label>
                    </div>
                  </td>
                  <td>
                    <button
                      @click="handleNotaryDetails(notary.id)"
                      type="button"
                      class="btn btn-sm dropdown-toggle hide-arrow py-0 waves-effect waves-float waves-light"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width="14"
                        height="14"
                        stroke="currentColor"
                        stroke-width="2"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feather me-50"
                      >
                        <path
                          d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                        ></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                  </td>
                  <td>
                    <input
                      class="form-check-input mx-1 border-2 shadow"
                      type="radio"
                      name="selectNotary"
                      :id="notary.id"
                      v-model="selectedNotary"
                      :value="notary.id"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </transition>
    </div>

    <hr />
    <div class="d-flex justify-content-end align-items-center mt-2">
      <button class="mx-1 previous__btn" @click="back">
        <Icon icon="eva:arrow-back-outline" />
      </button>
      <button
        :disabled="!schedule_type || !selectedNotary"
        class="btn btn-primary"
        @click="proceed"
      >
        Next
      </button>
    </div>

    <ModalComp
      :show="openNotaryModal"
      :size="'modal-sm'"
      @close="openNotaryModal = false"
    >
      <template #header>
        <h4 class="modal-title"></h4>
      </template>

      <template #body>
        <NotaryDetails @close="openNotaryModal = false" />
      </template>
    </ModalComp>
  </div>
</template>

<script>
import ModalComp from "@/components/ModalComp.vue";
import Datepicker from "vuejs3-datepicker";
import { Icon } from "@iconify/vue";
import store from "@/store";
import moment from "moment";
import PreLoader from "@/components/Loader/PreLoader.vue";
import NotaryDetails from "@/components/Notary/NotaryDetails.vue";

export default {
  data() {
    return {
      openNotaryModal: false,
      step: 2,
      notary: null,
      schedule_type: null,
      date: "",
      time: null,
      selectedNotary: null,
      country_id: null,
      state_id: null,
      // session: this.$route.query.session == "notary" ? "Notary" : "Affidavit",
    };
  },
  components: {
    ModalComp,
    Datepicker,
    Icon,
    NotaryDetails,
    PreLoader,
  },
  computed: {
    schedule_details() {
      return store.getters["schedule/schedule_details"];
    },
    notary_list() {
      let notaries = store.getters["notary/notary_list"];
      return notaries.filter((notary) => notary.is_online == true);
    },
    countries() {
      return store.getters["schedule/country"];
    },
    states() {
      return store.getters["schedule/states"];
    },
    time_slots() {
      const convertTimeToSeconds = (params) => {
        const slittedTimeSlots = params.split(":");
        return (
          +slittedTimeSlots[0] * 3600 +
          +slittedTimeSlots[1] * 60 +
          +slittedTimeSlots[2]
        );
      };

      const convertSecondsToTime = (seconds) => {
        if (seconds < 0) return "-" + convertSecondsToTime(-seconds);
        return new Date(seconds * 1000).toISOString().substr(11, 8);
      };

      const timeSlots = store.getters["schedule/time_slots"];
      const isToday = moment(this.date).isSame(moment(), "day");

      const currentDate = new Date();
      let hr = currentDate.getHours();
      let min = currentDate.getMinutes();
      let sec = currentDate.getSeconds();

      if (hr < 10) hr = "0" + hr;
      if (min < 10) min = "0" + min;
      if (sec < 10) sec = "0" + sec;

      const time = hr + ":" + min + ":" + sec;
      const currentTimeInSeconds = convertTimeToSeconds(time);

      const availableTime = timeSlots.filter((slot) => {
        const slotInSeconds = convertTimeToSeconds(slot);

        if (currentTimeInSeconds <= slotInSeconds) {
          return convertSecondsToTime(slotInSeconds);
        }
      });
      return isToday ? availableTime : timeSlots;
    },
    schedule_formdata() {
      return store.getters["others/schedule_formdata"];
    },
    loading_filter() {
      return store.getters["notary/filter_loading"];
    },
    reset_loading() {
      return store.getters["notary/reset_loading"];
    },
  },
  methods: {
    handleNotaryDetails(notaryId) {
      this.openNotaryModal = true;
      store.dispatch("notary/GetNotaryDetailsAction", notaryId);
    },
    dateSelected(data) {
      this.date = moment(data).format("YYYY-MM-DD");
    },
    FilterNotary() {
      store.dispatch("notary/FilterNotariesAction", {
        country_id: this.country_id,
        state_id: this.state_id,
        date: this.date,
        time: this.time,
      });
    },
    ResetFilter() {
      this.date = null;
      this.time = null;
      this.country_id = null;
      this.state_id = null;
      store.dispatch("notary/GetNotariesAction");
    },
    switchScheduleType(data) {
      this.schedule_type = data;
    },
    proceed() {
      store.commit("others/SET_SCHEDULE_FORMDATA_3", {
        schedule_type: this.schedule_type,
        notary: this.selectedNotary,
        date: this.date,
        time: this.time,
      });
      this.$emit("current", this.step + 1);
    },
    back() {
      this.$emit("current", this.step - 1);
    },
  },
  created() {
    store.dispatch("schedule/TimeSlotsAction");
    store.dispatch("schedule/CountriesAction").then((id) => {
      if (id) {
        store.dispatch("schedule/StatesAction", id);
      }
    });
    store.dispatch("notary/GetNotariesAction");
  },
};
</script>

<style lang="css">
.notary-indicator {
  position: absolute;
  bottom: 0px;
  right: -5px;
}
.not__active {
  background: #f5f5f5;
  border-color: #dddddd;
}
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
.reset__btn {
  padding: 0;
  margin: 5px 0;
}
.mx-input {
  display: block !important;
  padding: 0.571rem 1rem !important;
  font-size: 1rem !important;
  background-clip: padding-box !important;
  border: 1px solid #d8d6de !important;
  appearance: none !important;
  border-radius: 0.357rem !important;
  -webkit-transition: border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out !important;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out !important;
}
.vuejs3-datepicker__value {
  min-width: 100% !important;
  border-radius: 5px;
  padding: 7px 0px !important;
  cursor: pointer;
}
</style>