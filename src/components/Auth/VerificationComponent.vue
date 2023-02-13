<template>
  <div>
    <div class="mb-2">
      <label class="form-label">Identification Type</label>
      <select
        v-model="type"
        class="form-select"
        :class="{ 'is-invalid': type_error }"
      >
        <option disabled selected>Please select a form of Identity</option>
        <option value="nin">NIN</option>
        <option value="drivers_license">Drivers License</option>
        <option value="bvn">BVN</option>
      </select>
      <div v-if="type_error" class="invalid-feedback">
        This Field is required
      </div>
    </div>

    <div class="my-2">
      <label class="form-label">ID Number</label>
      <input
        v-model="value"
        type="number"
        class="form-control"
        :class="{ 'is-invalid': value_error || value_count_error }"
        placeholder="ID Number"
      />

      <div class="invalid-feedback" v-if="value_error">
        This Field is required!
      </div>
      <div class="invalid-feedback" v-if="value_count_error">
        ID Number must be 11 characters!
      </div>
    </div>

    <div class="my-2">
      <button
        :disabled="verify_id_loading || userProfile?.national_verification"
        @click="verify"
        :class="
          userProfile?.national_verification
            ? 'btn btn-success w-100'
            : 'btn btn-primary w-100'
        "
      >
        <span
          v-if="verify_id_loading"
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
        {{ userProfile?.national_verification ? "Verified" : "Verify" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

const value = ref("");
const type = ref("");
const type_error = ref(false);
const value_error = ref(false);
const value_count_error = ref(false);

const verify_id_loading = computed(
  () => store.getters["auth/verify_id_loading"]
);
const userProfile = computed(() => store.getters["auth/profile"]);

const verify = () => {
  !value.value ? (value_error.value = true) : (value_error.value = false);
  value.value.toString().length != 11
    ? (value_count_error.value = true)
    : (value_count_error.value = false);
  !type.value ? (type_error.value = true) : (type_error.value = false);

  if (
    value.value &&
    type.value &&
    value.value.toString().length == 11 &&
    !userProfile?.value.national_verification
  ) {
    store.dispatch("auth/VerifyIDAction", {
      type: type.value,
      value: value.value.toString(),
    });
  }
};
</script>

<style lang="css">
</style>