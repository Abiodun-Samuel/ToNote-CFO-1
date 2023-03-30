<template>
  <div class="mt-1">
    <h5 class="fw-bolder">
      How will you like the document to be delivered to you?
    </h5>

    <div class="d-flex gap-3 my-2">
      <!-- <div class="form-check form-check-inline">
        <input
          class="form-check-input"
          type="radio"
          name="inlineRadioOptions"
          id="inlineRadio1"
          v-model="deliveryOption"
          value="Collection"
        />
        <label class="form-check-label" for="inlineRadio1">Collection</label>
      </div> -->
      <div class="form-check form-check-inline">
        <input
          class="form-check-input"
          type="radio"
          name="inlineRadioOptions"
          id="inlineRadio2"
          v-model="deliveryOption"
          value="Email"
        />
        <label class="form-check-label" for="inlineRadio2">Via Email</label>
      </div>
      <div class="form-check form-check-inline">
        <input
          class="form-check-input"
          type="radio"
          name="inlineRadioOptions"
          id="inlineRadio3"
          value="Address"
          v-model="deliveryOption"
        />
        <label class="form-check-label" for="inlineRadio3"
          >To your address</label
        >
      </div>
    </div>
    <hr />

    <div class="my-1">
      <template v-if="deliveryOption == 'Collection'">
        <div
          data-aos="fade-down"
          class="p-1 rounded"
          style="background-color: #e8f1ff"
        >
          <p class="text-primary my-1 fw-bold pb-0">
            <b> Pickup Address:</b> 1625b Saka Jojo Street, Off Idejo Street,
            Victoria Island, Lagos, Nigeria
          </p>
          <p class="text-primary my-1 fw-bold pb-0">
            <b> Contact:</b> +234 814 650 7035
          </p>
        </div>
        <hr />
      </template>
      <template v-if="deliveryOption == 'Email'">
        <div class="form-check mb-1">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="recipient"
            id="flexCheckDefault"
          />
          <label class="form-check-label" for="flexCheckDefault">
            Additional email (optional)
          </label>
        </div>
        <div v-if="recipient" class="mb-2">
          <div class="row">
            <col-lg-6 class="col-md-6">
              <label for="recipient_email" class="form-label"
                >Recipient Name</label
              >
              <input
                type="text"
                class="form-control"
                id="recipient_name"
                placeholder="Recipient name"
                v-model="recipient_name"
              />
            </col-lg-6>
            <col-lg-6 class="col-md-6">
              <label for="recipient_email" class="form-label"
                >Recipient Email</label
              >
              <input
                type="email"
                class="form-control"
                id="recipient_email"
                placeholder="Recipient email"
                v-model="recipient_email"
              />
            </col-lg-6>
          </div>
        </div>
        <div
          data-aos="fade-down"
          class="p-1 rounded"
          style="background-color: #e8f1ff"
        >
          <p class="text-primary my-1 fw-bold pb-0">
            The document will be sent to your email address
            <b> {{ userProfile.email }}</b>
          </p>
        </div>
        <hr />
      </template>
      <template v-if="deliveryOption == 'Address'">
        <div data-aos="fade-down" class="mb-1">
          <div class="row">
            <div class="my-1 col-lg-6 col-md-6">
              <label for="recipient_name" class="form-label">Name</label>
              <input
                type="text"
                v-model="recipient_name"
                class="form-control"
                id="recipient_name"
                placeholder="Enter recipient's name"
              />
            </div>
            <div class="my-1 col-lg-6 col-md-6">
              <label for="phone" class="form-label">Phone Number</label>
              <input
                type="tel"
                v-model="recipient_contact"
                class="form-control"
                id="phone"
                placeholder="Enter recipient's contact"
              />
            </div>
          </div>
          <div class="row">
            <div class="my-1 col-lg-6 col-md-6">
              <label for="address" class="form-label">Address Line 1</label>
              <input
                type="text"
                v-model="address_one"
                class="form-control"
                id="address"
                placeholder="Enter your recipient's address"
              />
            </div>
            <div class="my-1 col-lg-6 col-md-6">
              <label for="address" class="form-label">Address Line 2</label>
              <input
                type="text"
                v-model="address_two"
                class="form-control"
                id="address"
                placeholder="Enter your recipient's address"
              />
            </div>
          </div>
          <div class="row">
            <div class="my-1 col-lg-6 col-md-6">
              <label for="address" class="form-label">State</label>
              <input
                type="text"
                v-model="state"
                class="form-control"
                id="address"
                placeholder="Enter your recipient's state"
              />
            </div>
            <div class="my-1 col-lg-6 col-md-6">
              <label for="address" class="form-label">Country</label>
              <input
                type="text"
                v-model="country"
                class="form-control"
                id="address"
                placeholder="Enter your recipient's country"
              />
            </div>
          </div>
        </div>
        <hr />
      </template>
    </div>

    <div class="d-flex justify-content-end align-items-center mt-2">
      <button class="mx-1 previous__btn" @click="back">
        <Icon icon="eva:arrow-back-outline" />
      </button>
      <button
        :disabled="
          schedule_details_loading ||
          !deliveryOption ||
          (deliveryOption == 'Address' && !address)
        "
        class="btn btn-primary"
        @click="proceed"
      >
        <span
          v-if="schedule_details_loading"
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
        Proceed
      </button>
    </div>
  </div>

  <!-- payment modal  -->
  <ModalComp
    data-aos="zoom-in"
    :show="openPaymentModal"
    :size="'modal-md'"
    @close="openPaymentModal = false"
  >
    <template #header>
      <h4 class="modal-title text-primary fw-bolder"></h4>
    </template>

    <template #body>
      <PaymentComponent @close="openPaymentModal = false" />
    </template>
  </ModalComp>
</template>

<script setup>
// import store from "@/store";
import { ref, defineEmits, onMounted, computed } from "vue";
import { platformInitiated } from "@/utils/helper";
import moment from "moment";
import { type } from "@/utils/constants";
import { useActions, useGetters } from "vuex-composition-helpers/dist";
import { useRoute } from "vue-router";
import { Icon } from "@iconify/vue";
import PaymentComponent from "@/components/Payment/PaymentComponent.vue";
import ModalComp from "@/components/ModalComp.vue";
import { useToast } from "vue-toast-notification";
// import { socket } from "@/utils/constants";

const toast = useToast();

const route = useRoute();
const emit = defineEmits(["current"]);
const deliveryOption = ref("");
const openPaymentModal = ref(false);
// const address = ref("");
const recipient_name = ref("");
const recipient_contact = ref("");
const recipient_email = ref("");
const recipient = ref(false);
const address_one = ref("");
const address_two = ref("");
const state = ref("");
const country = ref("");
// const openPaymentFailedModal = ref(false);
// const transactions_status = ref(false);
const address = computed(() => {
  return `${address_one.value}' '${address_two.value} ', '${state.value} ', '${country.value}`;
});
const step = ref(3);
const notarySession = ref(false);

const { schedule_formdata, userProfile, schedule_details_loading } = useGetters(
  {
    schedule_formdata: "others/schedule_formdata",
    userProfile: "auth/profile",
    schedule_details_loading: "schedule/schedule_details_loading",
  }
);

const { ScheduleVirtualSessionAction } = useActions({
  ScheduleVirtualSessionAction: "schedule/ScheduleVirtualSessionAction",
});

const back = () => {
  emit("current", step.value - 1);
};

const calcEndTime = (startTime) => {
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
};

// const commit = () => {
//   store.commit("others/SET_SCHEDULE_FORMDATA_4", {
//     delivery_option: deliveryOption.value,
//     address: schedule_formdata.value.address,
//   });
// // };
// const check = () => {
//   console.log("called");
//   openPaymentFailedModal.value = true;
// };

const proceed = () => {
  emit("current", true);
  if (
    schedule_formdata.value.TemplateType == "Upload" ||
    notarySession.value === true
  ) {
    let UploadFormData = {
      recipient_name: recipient_name.value,
      recipient_contact: recipient_contact.value,
      recipient_email: recipient_email.value,
      notary_id: schedule_formdata.value.notary,
      title: schedule_formdata.value.title,
      entry_point: notarySession.value === true ? "Notary" : "Affidavit",
      session_type:
        notarySession.value === true ? "notary_session" : "affidavit",
      description: !schedule_formdata.value.description
        ? "description"
        : schedule_formdata.value.description,
      type: type.Upload,
      files: schedule_formdata.value.documentFile,
      immediate:
        schedule_formdata.value.schedule_type == type.Immediate ? true : false,
      request_type: type.Upload,
      delivery_channel: deliveryOption.value,
      delivery_email:
        deliveryOption.value == "Email" ? userProfile.value.email : "",
      delivery_address: !address.value ? "Address" : address.value,
      platform_initiated: platformInitiated(),
      actor_type: !userProfile.value.is_business ? "User" : "Team",
      date:
        schedule_formdata.value.schedule_type === type.Immediate
          ? moment().format("YYYY-MM-DD")
          : schedule_formdata.value.date,
      // schedule_formdata.value.date,
      set_reminder_in_minutes: "15",
      start_time:
        schedule_formdata.value.schedule_type === type.Immediate
          ? moment().format("HH:mm:ss")
          : schedule_formdata.value.time,
      end_time: calcEndTime(schedule_formdata.value.time),
      participants: schedule_formdata.value.participants,
    };
    ScheduleVirtualSessionAction(UploadFormData).then(
      () => {
        openPaymentModal.value = true;
        // store.commit("others/CLEAR_SCHEDULE_FORMDATA");
      },
      (error) => {
        toast.error(error);
      }
    );
  }
  if (schedule_formdata.value.TemplateType == "Template") {
    let TemplateFormData = {
      recipient_name: recipient_name.value,
      recipient_contact: recipient_contact.value,
      recipient_email: recipient_email.value,
      entry_point: notarySession.value === true ? "Notary" : "Affidavit",
      session_type:
        notarySession.value === true ? "notary_session" : "affidavit",
      notary_id: schedule_formdata.value.notary,
      title: schedule_formdata.value.title,
      description: !schedule_formdata.value.description
        ? "description"
        : schedule_formdata.value.description,
      type: type.Template,
      document_template_id: schedule_formdata.value.documentId,
      immediate:
        schedule_formdata.value.schedule_type == type.Immediate ? true : false,
      request_type: type.Template,
      delivery_channel: deliveryOption.value,
      delivery_email:
        deliveryOption.value == "Email" ? userProfile.value.email : "",
      delivery_address: !address.value ? "Address" : address.value,
      platform_initiated: platformInitiated(),
      actor_type: !userProfile.value.is_business ? "User" : "Team",
      date:
        schedule_formdata.value.schedule_type === type.Immediate
          ? moment().format("YYYY-MM-DD")
          : schedule_formdata.value.date,
      set_reminder_in_minutes: "15",
      start_time:
        schedule_formdata.value.schedule_type === type.Immediate
          ? moment().format("HH:mm:ss")
          : schedule_formdata.value.time,
      end_time: calcEndTime(schedule_formdata.value.time),
      participants: schedule_formdata.value.participants,
    };
    ScheduleVirtualSessionAction(TemplateFormData).then(
      () => {
        openPaymentModal.value = true;
        // if (transactions_status.value)
        //   return (openPaymentFailedModal.value = true);
        // store.commit("others/CLEAR_SCHEDULE_FORMDATA");
      },
      (error) => {
        toast.error(error);
      }
    );
  }
  if (schedule_formdata.value.TemplateType == "Custom") {
    let CustomFormData = {
      recipient_name: recipient_name.value,
      recipient_contact: recipient_contact.value,
      recipient_email: recipient_email.value,
      entry_point: notarySession.value === true ? "Notary" : "Affidavit",
      session_type:
        notarySession.value === true ? "notary_session" : "affidavit",
      notary_id: schedule_formdata.value.notary,
      title: schedule_formdata.value.title,
      description: schedule_formdata.value.description,
      type: type.Custom,
      immediate:
        schedule_formdata.value.schedule_type == type.Immediate ? true : false,
      request_type: type.Custom,
      delivery_channel: deliveryOption.value,
      delivery_email:
        deliveryOption.value == "Email" ? userProfile.value.email : "",
      delivery_address: !address.value ? "Address" : address.value,
      platform_initiated: platformInitiated(),
      actor_type: !userProfile.value.is_business ? "User" : "Team",
      date:
        schedule_formdata.value.schedule_type === type.Immediate
          ? moment().format("YYYY-MM-DD")
          : schedule_formdata.value.date,
      set_reminder_in_minutes: "15",
      start_time:
        schedule_formdata.value.schedule_type === type.Immediate
          ? moment().format("HH:mm:ss")
          : schedule_formdata.value.time,
      end_time: calcEndTime(schedule_formdata.value.time),
      participants: schedule_formdata.value.participants,
    };
    ScheduleVirtualSessionAction(CustomFormData).then(
      () => {
        openPaymentModal.value = true;
        // if (transactions_status.value)
        //   return (openPaymentFailedModal.value = true);
        // store.commit("others/CLEAR_SCHEDULE_FORMDATA");
      },
      (error) => {
        toast.error(error);
      }
    );
  }
};

onMounted(() => {
  notarySession.value = route.query.session == "notary" ? true : false;
});
</script>

<style lang="css" scoped>
/* #003bb3 */
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
</style>