<template>
  <div class="row">
    <div class="form-group col-6 mb-1">
      <label class="form-label">Name:</label>
      <input
        type="text"
        class="input form-control"
        placeholder="Name"
        v-model="name"
      />
    </div>
    <div class="form-group col-6 mb-1">
      <label class="form-label">Address:</label>
      <input
        type="text"
        class="input form-control"
        placeholder="Your place, State"
        v-model="address"
      />
    </div>
    <div class="form-group col-6 mb-1">
      <label class="form-label">Email:</label>
      <input
        type="email"
        class="input form-control"
        placeholder="Email"
        v-model="email"
      />
    </div>
    <div class="form-group col-6 mb-1">
      <label class="form-label">Phone Number:</label>
      <input
        type="tel"
        class="input form-control"
        placeholder="Phone"
        v-model="phone"
      />
    </div>

    <hr />

    <div class="position-relative">
      <div style="padding-bottom: 1px" ref="capture">
        <div class="bordered-0 my-1">
          <div class="mx-auto bordered">
            <div style="border-bottom: 2px solid #000000" class="p-1">
              <h4 class="text-center text-dark fw-bolder m-0 p-0 m-auto">
                COMMISSIONER FOR OATHS
              </h4>
            </div>
            <div class="p-1" style="border-bottom: 2px solid #000000">
              <h4 class="text-center text-dark fw-bolder m-0 p-0 m-auto">
                <span class="mx-1 my-0 py-0"> &#9733;</span>{{ name }}
                <span class="mx-1 my-0 py-0"> &#9733;</span>
              </h4>
            </div>
            <div class="p-1 text-center">
              <h5 class="text-center text-dark small m-0 p-0">
                {{ phone }}
              </h5>
              <h5 class="text-center text-dark small m-0 p-0">
                {{ email }}
              </h5>
              <h5 class="text-center text-dark small m-0 p-0">
                {{ address }}
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <button
    type="button"
    class="btn btn-sm btn-primary d-block ms-auto mt-2"
    :disabled="loading"
    @click="captureStamp"
  >
    <span v-show="loading" class="spinner-border spinner-border-sm"></span>
    <span>Save</span>
  </button>
</template>

<script setup>
import domToImage from "dom-to-image";
import { ref, defineEmits, onMounted } from "vue";

import { useGetters, useActions } from "vuex-composition-helpers/dist";

const { token, companies } = useGetters({
  token: "auth/token",
  companies: "company/companies",
});

const { savePrint, getCompanies } = useActions({
  savePrint: "print/savePrint",
  getCompanies: "company/getCompanies",
});

const loading = ref(false);
const capture = ref("");
const name = ref(companies.value.company_name);
const address = ref(companies.value.address);
const email = ref(companies.value.email);
const phone = ref(companies.value.phone);
const data = ref("");

const emit = defineEmits(["close"]);
const captureStamp = () => {
  loading.value = true;
  const scale = 2;

  domToImage
    .toPng(capture.value, {
      quality: 1,
      height: capture.value.offsetHeight * scale,
      style: {
        transform: `scale(${scale}) translate(${
          capture.value.offsetWidth / 2 / scale
        }px, ${capture.value.offsetHeight / 2 / scale}px)`,
      },
      width: capture.value.offsetWidth * scale,
    })
    .then((dataUrl) => {
      data.value = { file: dataUrl, type: "NotaryStamp", category: "Upload" };
      savePrint(data.value);

      loading.value = false;
      emit("close", true);
    })
    .catch((error) => {
      console.error("oops, something went wrong!", error);
    });
};

onMounted(() => {
  getCompanies(token.value);
});
</script>

<style scoped>
.bordered-0 {
  border: 4px solid #000;
  padding: 3px;
}
.bordered {
  display: grid;
  align-items: center;
  border: 2px solid #000;
  /* border-radius: 2px; */
  min-height: 130px;
}

.preview {
  position: absolute;
  top: 150px;
  right: 30px;
  width: 200px;
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  place-items: center;
  gap: 20px;
}

@media screen and (max-width: 991.5px) {
  .custom-fs-sm {
    font-size: 1rem;
  }
}
</style>
