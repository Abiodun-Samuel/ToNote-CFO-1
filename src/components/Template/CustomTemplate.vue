<template>
  <div>
    <div class="my-2">
      <p>
        If you can’t find the affidavit you are looking for on our list of
        templates, click on “Custom template” and describe exactly what you
        need.
      </p>
      <label class="form-label" for="document_type">Title*</label>
      <input
        type="text"
        class="form-control"
        id="document_type"
        placeholder="Title"
        v-model="title"
        @blur="send"
      />
    </div>

    <div class="my-2">
      <label for="document_description" class="form-label"
        >Affidavit description *</label
      >
      <textarea
        v-model="description"
        class="form-control"
        id="description"
        rows="3"
        @blur="send"
      ></textarea>
    </div>
  </div>
</template>

<script setup>
import store from "@/store";
import { ref } from "vue";

const title = ref("");
const description = ref("");

const send = () => {
  store.commit("others/SET_SCHEDULE_CUSTOM", {
    title: title.value,
    description: description.value,
  });
};
</script>
