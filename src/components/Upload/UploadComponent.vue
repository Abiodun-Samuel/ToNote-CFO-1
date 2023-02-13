<template>
  <div class="mt-2 px-2">
    <div class="my-2">
      <label>Document Title</label>
      <input
        type="text"
        v-model="schedule_formdata.title"
        placeholder="Enter document title"
        class="form-control request-title"
      />
    </div>
    <!-- <div class="file-input border-0 shadow mb-4"> -->
    <div class="mb-4">
      <div class="shadow w-100 mb-1">
        <template v-if="!initialUpload">
          <DropZone @drop.prevent="drop" @change="selectedFile($event, true)">
            <template #format>
              <p class="fw-light">PDF only</p>
            </template>
            <template #input>
              <input
                type="file"
                id="dropzoneFile"
                multiple
                class="dropzoneFile"
                accept=".pdf"
              />
            </template>
          </DropZone>
        </template>
        <template v-else>
          <label for="choose" class="btn btn-primary m-2">
            <input
              type="file"
              id="choose"
              @change="selectedFile($event, true)"
              multiple
              accept=".pdf"
            />
            Upload more
          </label>
        </template>
      </div>
      <p class="fw-bolder text-dark">Up to 20 files, Max 2 MB each.</p>

      <!-- <input type="file" name="file-input" id="file-input" class="file-input__input" accept=".pdf" multiple
        @change="handleImageUpload" />
      <div class="d-flex justify-content-center align-items-center">
        <label class="file-input__label px-5" for="file-input">
          <h5 class="fw-bold">Drag and drop to upload</h5>
          <p>OR</p>
          <p class="btn btn-primary p-1">Select File</p>
          <p class="fw-light small">PDF only</p>
        </label>
      </div> -->
    </div>

    <template
      v-if="
        previewFile.length == 0 && schedule_formdata.documentFile?.length > 0
      "
    >
      <div
        class="card mb-1 mb-0 shadow-none border"
        v-for="(temp, index) in schedule_formdata.temDocData"
        :key="index"
      >
        <div class="p-2">
          <div class="row align-items-center">
            <div class="col-auto">
              <Icon icon="et:document" />
            </div>
            <div class="col ps-0">
              <a
                href="javascript:void(0)"
                class="text-muted fw-bold"
                data-dz-name
              ></a>
              <p class="mb-0" data-dz-size>
                {{ temp.name }} | Size:
                <span
                  :class="[
                    temp.size > 2097152 ? 'text-danger' : 'text-success',
                  ]"
                >
                  {{ temp.size }}
                </span>
              </p>
            </div>
            <div class="col-auto">
              <a
                role="button"
                class="btn btn-sm btn-outline-danger ds-remove filed"
                data-id="#document_id"
                data-name="fileName"
                @click="removeItem(index)"
              >
                <Icon :icon="'icon-park-solid:delete-five'" />
              </a>
            </div>
          </div>
        </div>
      </div>
      You already have {{ schedule_formdata.documentFile?.length }} document(s)
      uploaded, kindly click on
      <a
        role="button"
        class="text-primary fw-bold text-underline"
        @click="deleteImage"
        >clear</a
      >
      to remove uploaded files or click on next to continue
    </template>
    <template v-else>
      <div
        class="card mb-1 mb-0 shadow-none border"
        v-for="(temp, index) in schedule_formdata.temDocData"
        :key="index"
      >
        <div class="p-2">
          <div class="row align-items-center">
            <div class="col-auto">
              <Icon icon="et:document" />
            </div>
            <div class="col ps-0">
              <a
                href="javascript:void(0)"
                class="text-muted fw-bold"
                data-dz-name
              ></a>
              <p class="mb-0" data-dz-size>
                {{ temp.name }} | Size:
                <span
                  :class="[
                    temp.size > 2097152 ? 'text-danger' : 'text-success',
                  ]"
                >
                  {{ temp.size }}
                </span>
              </p>
            </div>
            <div class="col-auto">
              <a
                role="button"
                class="btn btn-sm btn-outline-danger ds-remove filed"
                data-id="#document_id"
                data-name="fileName"
                @click="removeItem(index)"
              >
                <Icon :icon="'icon-park-solid:delete-five'" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- <div class="my-1 d-flex justify-content-between" v-if="schedule_formdata.documentFile?.length > 0">
      <p class="d-flex align-items-center">
        <Icon icon="et:document" />
        {{ schedule_formdata.documentTitle }}
      </p>
      <button @click="deleteImage" class="btn btn-sm btn-outline-danger py-0 px-1">
        <Icon :icon="'icon-park-solid:delete-five'" />
      </button>
    </div> -->
    <!-- <hr />
    <div class="text-end mt-2">
      <button
        :disabled="!schedule_formdata.documentFile?.length"
        class="btn btn-primary"
        @click="proceed"
      >
        Next
      </button>
    </div> -->
  </div>
</template>
<script>
import { Icon } from "@iconify/vue";
import DropZone from "@/components/DropZone.vue";
// import { toRaw } from "vue";
import store from "@/store";
export default {
  components: { Icon, DropZone },
  data() {
    return {
      temData: [],
      dataFile: [],
      previewFile: [],
      initialUpload: false,
      isSelected: false,
      dropzoneFile: "",
      documentFile: false,
      documentTitle: null,
      title: null,
      step: 0,
    };
  },
  computed: {
    schedule_formdata() {
      return store.getters["others/schedule_formdata"];
    },
  },
  methods: {
    deleteImage() {
      let file = document.querySelector("input[type=file]");
      file.value = null;
      store.commit("others/UNSET_SCHEDULE_FORMDATA_1");
    },
    removeItem(index) {
      this.previewFile.splice(index, 1);
      this.dataFile.splice(index, 1);
      store.commit("others/DELETE_SCHEDULE_FORMDATA_1", index);
      if (this.previewFile.length == 0) {
        this.title = "";
        this.initialUpload = this.isSelected = false;
      }
    },
    preparedFile(files) {
      let docTitle = files[0].name.split(".").slice(0, -1).join(".");
      function formatBytes(bytes, decimals = 2) {
        if (!+bytes) return "0 Bytes";
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${
          sizes[i]
        }`;
      }

      for (let i = 0; i < files.length; i++) {
        let reader = new FileReader();
        const params = files[i];
        const fileSize = formatBytes(params.size);
        const fileName = params.name.split(".").slice(0, -1).join(".");
        reader.onloadend = () => {
          this.dataFile.push(reader.result);
          this.previewFile.push({ file: params, size: fileSize });
          this.temData.push({ name: fileName, size: fileSize });
          console.log(reader.result);
          console.log(params.file);
          store.commit("others/SET_SCHEDULE_FORMDATA_1", {
            title: !this.schedule_formdata.title?.length
              ? docTitle
              : this.schedule_formdata.title,
            documentTitle: docTitle,
            documentFile: reader.result,
            temDocData: { name: fileName, size: fileSize },
          });
        };
        reader.readAsDataURL(params);
      }
      // console.log("Uploaded files:", docTitle);
    },
    drop(e) {
      this.initialUpload = true;
      let dropFiles = (this.dropzoneFile = e.dataTransfer.files);
      this.title = this.dropzoneFile[0].name.split(".").slice(0, -1).join(".");
      this.preparedFile(dropFiles);
      this.isSelected = true;
    },
    selectedFile(e, init) {
      this.initialUpload = init;
      let dropFiles = (this.dropzoneFile = e.target.files);
      this.title = this.dropzoneFile[0].name.split(".").slice(0, -1).join(".");
      this.preparedFile(dropFiles);
      this.isSelected = true;
    },
    handleImageUpload() {
      const file = document.querySelector("input[type=file]").files[0];
      const reader = new FileReader();
      reader.onloadend = async () => {
        store.commit("others/SET_SCHEDULE_FORMDATA_1", {
          title: !this.schedule_formdata.title?.length
            ? file.name
            : this.schedule_formdata.title,
          documentTitle: file.name,
          documentFile: reader.result,
        });
        // console.log({
        //   title: !this.schedule_formdata.title?.length
        //     ? file.name
        //     : this.schedule_formdata.title,
        //   documentTitle: file.name,
        //   documentFile: reader.result,
        // });
      };
      reader.readAsDataURL(file);
    },
    proceed() {
      this.$emit("current", this.step + 1);
    },
  },
};
</script>

<style scoped>
.file-input {
  width: 100%;
  height: 250px;
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

.iconify {
  height: 25px;
  width: 25px;
}

#vs1__combobox.vs__dropdown-toggle {
  padding: 0.4rem 1rem !important;
}
</style>