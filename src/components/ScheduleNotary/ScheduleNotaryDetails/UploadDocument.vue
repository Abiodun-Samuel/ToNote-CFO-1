<template>
  <div class="mt-1">
    <template v-if="!notarySession">
      <h5 class="fw-bolder">Is your document ready?</h5>
      <p class="fw-light my-1">
        Before your session is set up, please confirm if you have your document
        ready or if you need a template from commissioner for oaths.
      </p>

      <!-- select template type button  -->
      <div class="d-flex gap-3 align-items-center my-2">
        <button
          @click="switchTemplateType('Template')"
          :class="
            templateType === 'Template'
              ? 'btn btn-outline-primary'
              : 'btn not__active'
          "
          type="button"
          aria-selected="true"
        >
          <Icon
            v-if="templateType === 'Template'"
            icon="eva:checkmark-circle-2-fill"
            width="19"
            height="19"
          />
          Select a template
        </button>

        <button
          @click="switchTemplateType('Upload')"
          :class="
            templateType === 'Upload'
              ? 'btn btn-outline-primary'
              : 'btn not__active'
          "
          type="button"
          aria-selected="true"
        >
          <Icon
            v-if="templateType === 'Upload'"
            icon="eva:checkmark-circle-2-fill"
            width="19"
            height="19"
          />
          Upload Document
        </button>

        <button
          @click="switchTemplateType('Custom')"
          :class="
            templateType === 'Custom'
              ? 'btn btn-outline-primary'
              : 'btn not__active'
          "
          type="button"
          aria-selected="true"
        >
          <Icon
            v-if="templateType === 'Custom'"
            icon="eva:checkmark-circle-2-fill"
            width="19"
            height="19"
          />
          Custom Affidavit
        </button>
      </div>

      <hr />

      <div>
        <SelectTemplate v-if="templateType === 'Template'" />
        <transition enter-active-class="slideInDown">
          <UploadComponent v-if="templateType === 'Upload'" />
        </transition>
        <transition enter-active-class="slideInDown">
          <CustomTemplate v-if="templateType === 'Custom'" />
        </transition>
      </div>
    </template>

    <template v-else>
      <UploadComponent />
      <hr />
    </template>

    <div class="text-end mt-2">
      <button
        :disabled="
          !schedule_formdata.documentFile?.length &&
          !schedule_formdata?.documentId &&
          !schedule_formdata?.description
        "
        class="btn btn-primary"
        @click="proceed"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import store from "@/store";
import SelectTemplate from "@/components/Template/SelectTemplate.vue";
import UploadComponent from "@/components/Upload/UploadComponent.vue";
import CustomTemplate from "@/components/Template/CustomTemplate.vue";
import { ref, defineEmits, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
const emit = defineEmits(["current"]);

const route = useRoute();
const templateType = ref("");
const step = ref(0);
const notarySession = ref("");

const schedule_formdata = computed(
  () => store.getters["others/schedule_formdata"]
);

const switchTemplateType = (data) => {
  templateType.value = data;
  store.commit("others/SET_TEMPLATE_TYPE", templateType.value);
};
const proceed = () => {
  emit("current", step.value + 1);
};

onMounted(() => {
  notarySession.value = route.query.session == "notary" ? true : false;
});
</script>

<style lang="css">
.not__active {
  border: none;
  outline: none;
  background: rgb(243, 243, 243);
}
</style>
