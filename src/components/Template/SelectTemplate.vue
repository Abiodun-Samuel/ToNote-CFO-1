<template>
  <div>
    <div
      v-if="loading"
      class="d-flex justify-content-center align-items-center"
    >
      <PreLoader />
    </div>
    <div v-else class="my-2">
      <p>
        A list of Affidavit templates have been curated for your selection.
        Select an Affidavit Template of your choice.
      </p>
      <label class="form-label" for="template">Select a template</label>
      <div class="d-flex justify-content-center align-items-stretch gap-1">
        <VueMultiselect
          :options="templates"
          placeholder="Select a template"
          v-model="selectedTemplate"
          label="title"
          track-by="title"
          :taggable="true"
          @update:model-value="sendValue"
          :model-value="selectedTemplate"
        />
        <button
          @click="openPreviewModal = true"
          :disabled="!source"
          class="
            btn btn-primary
            d-flex
            align-items-center
            justify-content-center
          "
        >
          Preview
          <Icon icon="akar-icons:enlarge" class="ms-1" />
        </button>
      </div>
    </div>

    <!-- template preview modal  -->
    <ModalComp
      :show="openPreviewModal"
      :size="'modal-md'"
      @close="openPreviewModal = false"
    >
      <template #header>
        <h4 class="modal-title">{{ selectedTemplate.title }}</h4>
      </template>

      <template #body>
        <!-- <RenderPage :file="source" /> -->
        <PreviewTemplate :source="source" @close="openPreviewModal = false" />
      </template>
    </ModalComp>
  </div>
</template>

<script setup>
import ModalComp from "@/components/ModalComp.vue";
import PreviewTemplate from "@/components/Template/PreviewTemplate.vue";
import VueMultiselect from "vue-multiselect";
import store from "@/store";
import PreLoader from "@/components/Loader/PreLoader.vue";
import { Icon } from "@iconify/vue";
import { ref, computed, onMounted } from "vue";

const source = ref(null);
const openPreviewModal = ref(false);
const selectedTemplate = ref({
  title: "",
  id: "",
  file: "",
});

const sendValue = () => {
  source.value = selectedTemplate.value.file;
  store.commit("others/SET_SCHEDULE_TEMPLATE", {
    documentTitle: selectedTemplate.value.title,
    documentId: selectedTemplate.value.id,
  });
};

const templates = computed(() => store.getters["template/templates"]);
const loading = computed(() => store.state.template.loading);

onMounted(() => {
  store.dispatch("template/getAllTemplates");
});
</script>

<style lang="css" scoped>
@import url("@/assets/css/multiselect.css");

.vue-pdf-embed {
  width: 100% !important;
  height: 100% !important;
}
.btn {
  padding: 0.5rem;
}
</style>
