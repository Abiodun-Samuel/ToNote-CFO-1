<template>
  <div class="fw-bolder mt-2 mb-1">
    <h5>Are you sure you wish to cancel this session?</h5>
    <div class="my-2">
      <label class="form-label">Select a reason</label>
      <VueMultiselect
        :options="reasons"
        placeholder="Reason"
        v-model="selectedReason"
        :taggable="true"
        :model-value="selectedReason"
      />
      <!-- @update:model-value="updateValue" -->
    </div>

    <textarea
      v-model="comment"
      class="form-control my-2"
      id=""
      cols="30"
      rows="3"
    ></textarea>

    <div class="mt-2 text-end">
      <button
        :disabled="
          !selectedReason || loading || (selectedReason == 'Others' && !comment)
        "
        @click="cancel__session"
        class="btn btn-primary"
      >
        <span
          v-if="loading"
          class="spinner-border spinner-border-sm me-1"
          role="status"
          aria-hidden="true"
        ></span>
        Cancel Session
      </button>
    </div>
  </div>
</template>

<script setup>
import VueMultiselect from "vue-multiselect";
import { ref, reactive } from "vue";
import { useStore } from "vuex";
import { useGetters } from "vuex-composition-helpers/dist";
import socket from "@/utils/event-bus";
import { events } from "@/utils/constants";

const store = useStore();
const selectedReason = ref("");
const comment = ref("");

const reasons = reactive([
  "Outside jurisdiction of notary",
  "Suspected fraud",
  "Personal Reason",
  "User unwilling to consent to additional costs",
  "User unwilling to consent to compliance questions",
  "Others",
]);

const { virtual_session_details, loading } = useGetters({
  virtual_session_details: "schedule/virtual_session_details",
  loading: "notary/cancel_loading",
});

const cancel__session = () => {
  if (selectedReason.value == "Others" && !comment.value) return;
  store
    .dispatch("notary/CancelNotarySession", {
      id: virtual_session_details.value.id,
      status: "Cancelled",
      cancel_reason: selectedReason.value,
      comment: comment.value,
    })
    .then((value) => {
      socket.emit(
        events.NOTARY_CANCEL_SESSION,
        virtual_session_details.value.id
      );
      if (value) {
        selectedReason.value = "";
        comment.value = "";
        window.location.href = "/document";
      }
    });
};
</script>

<style lang="css">
@import url("@/assets/css/multiselect.css");
</style>