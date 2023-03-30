<template>
  <section class="container">
    <div class="d-flex justify-content-center">
      <section class="col-lg-9">
        <div class="">
          <h4 class="fw-bolder">
            Requesting a Commissioner for Oaths
            <!-- {{ notarySession ? " a Notary" : "an Affidavit" }} -->
          </h4>
          <div class="mb-2">
            <li>
              Please select a date and time for your
              <!-- {{ notarySession ? "notary" : "" }} -->
              session.
            </li>
            <li v-if="notarySession">
              Choose a convenient time for you and your signers.
            </li>
            <li>
              We will send you a confirmation email with the meeting link and
              session time.
            </li>
            <li>You can track the status of your requests in “My Requests”.</li>
          </div>
        </div>

        <div class="">
          <div>
            <div
              class="mx-2 progress__box d-flex justify-content-between align-items-center m-auto"
            >
              <div
                class="progress__bar"
                :style="{ width: progressWidth }"
              ></div>
              <div class="progress__bar2"></div>
              <div
                class="d-flex flex-column align-items-center"
                v-for="(step, index) in steps"
                :key="index"
              >
                <button
                  class="btn progress__btn"
                  :class="
                    step.step <= currentstep
                      ? 'progress__success'
                      : 'progress__default'
                  "
                >
                  <Icon
                    :icon="
                      step.step < currentstep || completed
                        ? 'fa6-solid:check'
                        : step.icon
                    "
                    :height="30"
                    :width="30"
                  />
                </button>
              </div>
            </div>
            <div
              class="progress__description d-flex justify-content-between align-items-center m-auto mt-1"
            >
              <h6
                :class="step.step <= currentstep ? 'text-primary' : ''"
                v-for="(step, index) in steps"
                :key="index"
              >
                {{ step.title }}
              </h6>
            </div>

            <div class="card my-2">
              <div class="card-body">
                <!-- Component changes when currentTab changes -->
                <component
                  @current="proceed"
                  :is="steps[currentstep].component"
                ></component>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<script>
import AllParticipants from "@/components/ScheduleNotary/ScheduleNotaryDetails/AllParticipants.vue";
import UploadDocument from "@/components/ScheduleNotary/ScheduleNotaryDetails/UploadDocument.vue";
import TimeSlot from "@/components/ScheduleNotary/ScheduleNotaryDetails/TimeSlot.vue";
import DeliveryOption from "@/components/ScheduleNotary/ScheduleNotaryDetails/DeliveryOption.vue";
import { Icon } from "@iconify/vue";

export default {
  data() {
    return {
      currentstep: 0,
      completed: false,
      notarySession: false,
      steps: [
        {
          step: 0,
          title: "Upload",
          component: "UploadDocument",
          icon: "carbon:document",
        },
        {
          step: 1,
          title: "Participants",
          component: "AllParticipants",
          icon: "ant-design:user-add-outlined",
        },
        {
          step: 2,
          title: "Time Slots",
          component: "TimeSlot",
          icon: "uiw:date",
        },
        {
          step: 3,
          title: "Delivery",
          component: "DeliveryOption",
          icon: "carbon:delivery-parcel",
        },
      ],
    };
  },
  components: {
    Icon,
    UploadDocument,
    AllParticipants,
    TimeSlot,
    DeliveryOption,
  },
  computed: {
    progressWidth() {
      return this.currentstep * 33.3 + "%";
    },
  },
  methods: {
    proceed(data) {
      if (typeof data == "boolean") {
        this.completed = data;
      } else {
        this.currentstep = data;
        this.completed = false;
      }
    },
  },
  mounted() {
    this.notarySession = this.$route.query.session == "notary" ? true : false;
  },
};
</script>

<style>
.progress__box {
  position: relative;
}
.progress__success {
  background-color: #766458;
}
.progress__default {
  background-color: #cbcbcb;
}

.progress__bar {
  position: absolute;
  height: 6px;
  background-color: #766458;
  z-index: 1;
  top: 50%;
  left: 0px;
  transform: translateY(-50%);
  transition: 0.4s ease;
}
.progress__bar2 {
  content: "";
  position: absolute;
  height: 4px;
  width: 100%;
  background-color: #cbcbcb;
  z-index: 0;
  top: 50%;
  left: 0px;
  transform: translateY(-50%);
  transition: 0.4s ease;
}

.progress__btn {
  height: 30px;
  width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  z-index: 1;
  color: #ffffff;
  padding: 6px;
}
.progress__btn:hover {
  color: #eaeaea;
}
</style>