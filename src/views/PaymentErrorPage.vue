<template>
  <div class="container mb-5">
    <div
      class="row d-flex justify-content-center align-items-center"
      style="height: 65vh"
    >
      <div class="col-lg-6">
        <!-- payment modal  -->
        <div class="transaction__failure text-center">
          <Icon
            class="text-danger mb-2"
            height="40"
            icon="icon-park-outline:file-failed-one"
          />
          <h4 class="fw-bolder my-2">Your payment has failed</h4>
          <p class="fw-bold">Click on the button below to retry</p>
          <button @click="openPaymentModal = true" class="btn btn-danger mt-2">
            Retry
          </button>
        </div>
      </div>
    </div>
  </div>

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
import { Icon } from "@iconify/vue";
import { ref } from "vue";
import PaymentComponent from "@/components/Payment/PaymentComponent.vue";
import ModalComp from "@/components/ModalComp.vue";

const openPaymentModal = ref(false);
// import ConfirmationComponent from "@/components/Payment/ConfirmationComponent.vue";
</script>
