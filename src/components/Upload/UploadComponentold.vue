<template >
  <div>
    <div class="my-2">
      <p>
        If you have an Affidavit template stored on your device click the upload
        button to upload it.
      </p>
      <label class="form-label">Document Title</label>
      <input
        type="text"
        v-model="schedule_formdata.title"
        placeholder="Enter document title"
        class="form-control request-title"
      />
    </div>

    <!-- v-if="!schedule_formdata.documentFile?.length" -->
    <div class="file-input shadow my-2">
      <input
        type="file"
        name="file-input"
        id="file-input"
        class="file-input__input"
        accept=".pdf, .docx, .doc"
        @change="handleImageUpload"
      />
      <div class="d-flex justify-content-center align-items-center">
        <label class="file-input__label px-5" for="file-input">
          <h5 class="fw-bold">Drag and drop to upload</h5>
          <p>OR</p>
          <p class="btn btn-primary p-1">Select File</p>
          <p class="fw-light small">DOCX, DOC, PDF only</p>
        </label>
      </div>
    </div>

    <hr />

    <div
      class="my-1 d-flex justify-content-between align-items-center"
      v-if="schedule_formdata.documentFile?.length > 0"
    >
      <p class="d-flex align-items-center text:">
        <Icon icon="et:document" />
        <span class="ms-1 fw-bold">{{ schedule_formdata.documentTitle }}</span>
      </p>

      <button @click="deleteImage" class="btn text-danger">
        <Icon icon="icon-park-solid:delete-five" height="19" width="19" />
      </button>
    </div>
  </div>
</template>
  
<script setup>
import { Icon } from "@iconify/vue";
import store from "@/store";
import { computed } from "vue";

// const documentFile = ref(false);
// const documentTitle = ref(null);
// const title = ref(null);

const schedule_formdata = computed(
  () => store.getters["others/schedule_formdata"]
);

const deleteImage = () => {
  // let file = document.querySelector("input[type=file]");
  // file.value = "";
  store.commit("others/UNSET_SCHEDULE_FORMDATA_1");
};

const handleImageUpload = () => {
  const file = document.querySelector("input[type=file]").files[0];
  const reader = new FileReader();
  reader.onloadend = async () => {
    store.commit("others/SET_SCHEDULE_FORMDATA_1", {
      title: !schedule_formdata.value.title?.length
        ? file.name
        : schedule_formdata.value.title,
      documentTitle: file.name,
      documentFile: reader.result,
    });
  };
  reader.readAsDataURL(file);
};
</script>

<style lang="css">
.file-input {
  width: 100%;
  height: 200px;
  border: 1.25px dashed #d2d2d2;
  border-radius: 4px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
.file-input__input {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}

.file-input__label {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  color: var(--bs-gray-100);
}
.file-input__label p {
  margin: 5px;
  padding: 0;
}

.file-input__label .iconify {
  height: 45px;
  width: 45px;
}

#display__snapshot {
  position: relative;
  width: 200px;
  height: auto;
  margin: 0 auto;
}
.delete__btn {
  position: absolute;
  top: -5px;
  right: -5px;
  padding: 2px;
  box-shadow: var(--bs-box-shadow);
  z-index: 10;
}
#vs1__combobox.vs__dropdown-toggle {
  padding: 0.4rem 1rem !important;
}
</style>