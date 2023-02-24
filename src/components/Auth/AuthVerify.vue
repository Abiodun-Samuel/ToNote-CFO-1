<template>
  <div class="container">
    <div
      v-if="loading"
      class="d-flex justify-content-center align-items-center"
      style="height: 100vh"
    >
      <PreLoader />
    </div>

    <div class="row d-flex justify-content-center align-items-center">
      <div class="col-lg-10">
        <div class="auth-wrapper auth-basic px-2">
          <div class="auth-inner my-2">
            <div class="card mb-0">
              <div class="card-body">
                <div class="brand-logo">
                  <img src="@/assets/images/logo-dark.png" alt="" height="26" />
                </div>
                <template v-if="hasAccount == false">
                  <h2 class="card-title fw-bolder mb-1">
                    Two Step Verification 💬
                  </h2>
                  <p class="card-text mb-75">
                    Enter the code from the email in the field below.
                  </p>
                  <form class="mt-2" @submit.prevent="verifyAccessWithOtp">
                    <label for="security" class="form-label"
                      >Type your security code</label
                    >

                    <div
                      class="
                        auth-input-wrapper
                        d-flex
                        align-items-center
                        justify-content-between
                      "
                    >
                      <VOtpInput
                        ref="otpInput"
                        input-classes="form-control auth-input height-50 text-center numeral-mask mx-25 mb-1"
                        separator=" "
                        :num-inputs="6"
                        :should-auto-focus="true"
                        :is-input-num="true"
                        @on-change="handleOnChange"
                        @on-complete="handleOnComplete"
                      />
                    </div>

                    <a
                      role="button"
                      class="d-block text-decoration-underline mb-1"
                      @click="clearInput()"
                      >Clear</a
                    >
                    <button
                      @click="verifyAccessWithPassword"
                      type="submit"
                      class="btn btn-primary w-100"
                      tabindex="4"
                      :disabled="disabled"
                    >
                      Verify
                    </button>
                  </form>

                  <p class="text-center mt-2">
                    <span>Didn't get the code?</span>
                    <a href="Javascript:void(0)" @click="resendToken"
                      ><span>&nbsp;Resend</span></a
                    >
                    <span> or</span>
                    <a href="Javascript:void(0)"
                      ><span>&nbsp;Contact Us</span></a
                    >
                  </p>
                </template>
                <template v-else>
                  <h2 class="card-title fw-bolder mb-1">
                    Enter your password 💬
                  </h2>
                  <p class="card-text mb-75">
                    Please, enter your password to view this document.
                  </p>

                  <form class="mt-2" @submit.prevent="verifyAccessWithPassword">
                    <div
                      class="d-flex justify-content-between align-items-center"
                    >
                      <label for="security" class="form-label">Password</label>
                      <label class="form-label">
                        <a :href="forgotPassword">Forgot Password?</a>
                      </label>
                    </div>

                    <div class="form-group">
                      <input
                        type="password"
                        v-model="otpPassword"
                        class="form-control numeral-mask mb-1"
                        id="security"
                        placeholder="Enter password"
                      />
                    </div>
                    <button
                      type="submit"
                      class="btn btn-primary w-100"
                      tabindex="4"
                      :disabled="!otpPassword"
                    >
                      Sign in
                    </button>
                  </form>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import PreLoader from "@/components/Loader/PreLoader.vue";
import store from "@/store";
import VOtpInput from "vue3-otp-input";
import Api from "@/api/Api";
import { ref, onMounted, onBeforeMount } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
// const router = useRouter();
const disabled = ref(true);
const forgotPassword = ref(true);
const otpPassword = ref(null);
const hasAccount = ref(false);
const flag = ref(null);
const documentId = ref(null);
const email = ref(null);
const loading = ref(false);

const verifyAccessWithPassword = () => {
  let formData = {
    email: email.value,
    password: otpPassword.value,
    session_id: documentId.value,
  };
  store.dispatch("auth/verifyUserByPassword", formData);
};

const handleOnComplete = (value) => {
  disabled.value = false;
  otpPassword.value = value;
};

const resendToken = () => {
  let formData = {
    email: email.value,
    session_id: documentId.value,
  };
  store.dispatch("auth/sessionResendVerifyOTP", formData);
};

onBeforeMount(() => {
  loading.value = true;
  email.value = route.query.e;
  flag.value = route.query.f;
  documentId.value = route.query.di;
  Api.get(
    process.env.VUE_APP_API_LIVE + "document-user-check/" + email.value
  ).then((response) => {
    console.log(response.data.data.message);
    hasAccount.value = response.data.data.message;
    loading.value = false;
  });
});

onMounted(() => {});
// computed: {
//     isAuth() {
//       return store.state.auth.profile;
//     },
//   },
//  verifyAccessWithOtp() {
//    let formData = {
//      email: this.$route.query.e,
//      password: this.otpPassword,
//      session_id: this.$route.query.di,
//    };
//    store.dispatch("authStore/ScheduleSessionVerifyAction", formData).then(
//      () => {
//        router.push({
//          path: `/await-notary-session/${this.$route.query.di}`,
//        });
//      },
//      // error
//      () => {}
//    );
//  },
//
//  handleOnChange() {
//    console.log("onchanged");
//  },

//  clearInput() {
//    this.$refs.otpInput.clearInput();
//  },
//  if (store.state.authStore.isAuthenticated) {
//    router.push({
//      path: `/await-notary-session/${this.$route.query.di}`,
//    });
//  }
//  if (!this.$route.query.e && !this.$route.query.di && !this.$route.query.f) {
//    this.$toast.error("Unauthorized");
//  }
// forgotPassword.value =
//     process.env.NODE_ENV != "development"
//       ? process.env.VUE_APP_URL_AUTH_FORGOT_PASSWORD_LIVE
//       : process.env.VUE_APP_URL_AUTH_FORGOT_PASSWORD_LOCAL;
</script>

<style lang="css" scoped>
@import "@/assets/css/home.css";
</style>
