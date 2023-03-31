<template>
  <div class="container" style="min-height: 70vh">
    <div class="row d-flex justify-content-center">
      <div class="col-lg-9">
        <h4 class="fw-bolder text-primary">Additional Fee</h4>
        <hr />
        <div class="my-2">
          <p class="fw-bold">
            <b>Additional Seals:</b> {{ userDocument.extra_seals }} Seal(s)
          </p>
          <p class="fw-bold">
            <b>Amount:</b> &#8358;{{ userDocument.extra_seal_total }}
          </p>
        </div>
        <hr />
        <div class="my-2">
          <router-link to="/document" class="btn btn-outline-primary me-2"
            >Pay later</router-link
          >
          <button @click="openPaymentModal = true" class="btn btn-primary">
            Pay Now
          </button>
        </div>
      </div>
    </div>
  </div>

  <ModalComp
    :show="openPaymentModal"
    :size="'modal-md'"
    @close="openPaymentModal = false"
  >
    <template #header>
      <h4 class="modal-title text-danger mb-0"></h4>
      <!-- <h4 class="modal-title text-primary fw-bolder">Cancel Session</h4> -->
    </template>

    <template #body>
      <div data-aos="zoom-in" v-if="!paymentSuccessful">
        <div data-aos="zoom-in" class="d-flex justify-content-end">
          <div class="shadow-lg text-center p-2 price__display">
            <span>Transaction cost</span>
            <p class="h3 text-primary fw-bolder my-0 py-0">
              &#8358; {{ userDocument.extra_seal_total }}
            </p>
            <!-- <span class="small">per document</span> -->
          </div>
        </div>
        <p class="h5 fw-bold my-2">Select payment option</p>

        <div class="payment__options gap-2">
          <label
            v-for="payment_gateway in payment_gateways"
            :key="payment_gateway.id"
            class="payment__option"
            :for="payment_gateway.gateway.name"
          >
            <input
              name="payment_gateway"
              v-model="selectedPayment_gateway"
              :value="payment_gateway.gateway.name"
              type="radio"
              :id="payment_gateway.gateway.name"
            />
            <div class="payment__option-content">
              <img
                loading="lazy"
                :src="payment_gateway.gateway.file"
                :alt="payment_gateway.gateway.name"
              />
              <div class="payment__option-details">
                <span> {{ payment_gateway.gateway.name }}</span>
              </div>
            </div>
          </label>
        </div>

        <div class="modal-footer d-flex justify-content-end mt-3">
          <button
            @click="Payment_flutterwave"
            v-if="selectedPayment_gateway === 'Flutterwave'"
            class="btn btn-primary"
          >
            Pay Now
          </button>
          <!-- <flutterwave-pay-button
          v-if="selectedPayment_gateway === 'Flutterwave'"
          :tx_ref="reference"
          :amount="8000"
          currency="NGN"
          payment_options="card,ussd"
          redirect_url=""
          class="btn btn-primary"
          :meta="{ customer_id: userProfile.id, customer_mac: userProfile.id }"
          :customer="{
            name: userProfile.first_name + ' ' + userProfile.last_name,
            email: userProfile.email,
            phone_number: userProfile.phone,
          }"
          :callback="SuccessfulPaymentCallback"
          :onclose="close"
        >
        </flutterwave-pay-button> -->

          <paystack
            buttonClass="btn btn-primary"
            buttonText="Pay Now"
            :publicKey="paystackkey"
            :email="userProfile.email"
            :amount="amount_paystack"
            :reference="reference"
            :onSuccess="SuccessfulPaymentCallback"
            :onCanel="close"
            v-if="selectedPayment_gateway === 'Paystack'"
            @click="$emit('close')"
          >
          </paystack>
        </div>
      </div>
    </template>
  </ModalComp>
</template>

<script setup>
import { useActions, useGetters } from "vuex-composition-helpers/dist";
import { ref, onMounted } from "vue";
import ModalComp from "@/components/ModalComp.vue";
import { platformInitiated } from "@/utils/helper";

// import ConfirmationComponent from "@/components/Payment/ConfirmationComponent.vue";

const openPaymentModal = ref(false);
const {
  virtual_session_details,
  userDocument,
  schedule_transaction_id,
  profile,
} = useGetters({
  virtual_session_details: "schedule/virtual_session_details",
  userDocument: "document/userDocument",
  schedule_transaction_id: "transactions/schedule_transaction_id",
  profile: "auth/profile",
});
const { postTransactionAction } = useActions({
  postTransactionAction: "transactions/postTransactionAction",
});

onMounted(() => {
  postTransactionAction({
    transactionable_type: "ScheduleSession",
    transactionable_id: virtual_session_details.value.id,
    parent_id: schedule_transaction_id.value,
    platform_initiated: platformInitiated(),
    actor_type: !profile.value.is_business ? "User" : "Team",
  });
});
</script>

<script>
import paystack from "vue3-paystack";
import { useFlutterwave } from "flutterwave-vue3";
import store from "@/store";
import { useToast } from "vue-toast-notification";

const toast = useToast();

export default {
  props: {
    amount: {
      type: Number,
      required: false,
    },
  },
  data() {
    return {
      openpaymentSuccessful: true,
      paymentSuccessful: false,
      selectedPayment_gateway: "",
      paystackkey: process.env.VUE_APP_PAYSTACK_PUBLIC_KEY_STAGING,
    };
  },
  components: { paystack },
  computed: {
    amount_flutterwave() {
      return this.userDocument.extra_seal_total;
    },
    amount_paystack() {
      return Number(this.userDocument.extra_seal_total) * 100;
    },
    schedule_details() {
      return store.getters["schedule/schedule_details"];
    },
    userProfile() {
      return store.getters["auth/profile"];
    },
    payment_gateways() {
      return store.getters["schedule/payment_gateways"];
    },
    reference() {
      return store.getters["transactions/schedule_transaction_id"];
    },
  },

  methods: {
    Payment_flutterwave() {
      useFlutterwave({
        amount: this.amount_flutterwave, //amount
        callback() {
          store.dispatch("schedule/ScheduleTransactionAction", "Flutterwave");
        },
        country: "NG",
        currency: "NGN",
        customer: {
          name: this.userProfile.first_name + " " + this.userProfile.last_name,
          email: this.userProfile.email,
          phone_number: this.userProfile.phone,
        },
        customizations: {
          description: "",
          logo: "",
          title: "",
        },
        meta: {
          user_id: this.userProfile.id,
          token: this.userProfile.id,
        },
        onclose() {
          toast.error("You have cancelled your payment");
        },
        payment_options: "card,ussd",
        public_key: process.env.VUE_APP_FLUTTERWAVE_PUBLIC_KEY_STAGING,
        redirect_url: "http://localhost:8080/session-complete",
        // redirect_url: process.env.VUE_APP_SESSION_COMPLETE_LOCAL,
        tx_ref: this.reference,
      });
      this.$emit("close");
    },
    SuccessfulPaymentCallback() {
      store.dispatch(
        "schedule/ScheduleTransactionAction",
        this.selectedPayment_gateway
      );
      this.$router.push({ path: "/session-complete" });
    },
    close() {
      toast.error("You have cancelled your payment");
    },
  },
  created() {
    store.dispatch("schedule/PaymentGatewaysAction");
  },
};
</script>
<style>
.price__display {
  border-radius: 5px;
  border: 1px solid #003bb3;
}

.payment__options {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
}

.payment__options .payment__option input[type="radio"] {
  position: absolute;
  opacity: 0;
}

.payment__options .payment__option {
  cursor: pointer;
  /* width: 48.5%; */
}

.payment__options .payment__option .payment__option-content {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border: 2px solid #f3f3f3;
  border-radius: 6px;
  -webkit-transition: -webkit-box-shadow 0.4s;
  transition: -webkit-box-shadow 0.4s;
  -o-transition: box-shadow 0.4s;
  transition: box-shadow 0.4s;
  transition: box-shadow 0.4s, -webkit-box-shadow 0.4s;
  position: relative;
}

.payment__options .payment__option .payment__option-content img {
  margin-right: 25px;
  height: 35px;
  width: 35px;
}

.payment__options .payment__option .payment__option-details span {
  display: block;
  font-size: 1rem;
  line-height: 24px;
}
.payment__options .payment__option .payment__option-content:hover {
  -webkit-box-shadow: 0px 3px 5px 0px #e8e8e8;
  box-shadow: 0px 3px 5px 0px #e8e8e8;
}

.payment__options
  .payment__option
  input[type="radio"]:checked
  + .payment__option-content:after {
  content: "";
  position: absolute;
  height: 8px;
  width: 8px;
  background: #003bb3;
  right: 5px;
  top: 5px;
  border-radius: 100%;
  border: 3px solid #fff;
  -webkit-box-shadow: 0px 0px 0px 2px #003bb3;
  box-shadow: 0px 0px 0px 2px #003bb3;
}

.payment__options
  .payment__option
  input[type="radio"]:checked
  + .payment__option-content {
  border: 2px solid #003bb3;
  background: #eaf1fe;
  -webkit-transition: ease-in 0.3s;
  -o-transition: ease-in 0.3s;
  transition: ease-in 0.3s;
}

.confimation__logo {
  height: 120px;
  width: 120px;
}
</style>
