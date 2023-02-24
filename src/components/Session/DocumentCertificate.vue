<template>
  <div class="container-fluid">
    <div class="row mx-auto" :style="{ width: '815px' }">
      <div class="card col-lg-9" :style="{ width: '815px' }">
        <div class="card-body">
          <template v-if="!is_notary">
            <h4>Session ended successfully</h4>
            <p>Download your session resources below</p>
          </template>

          <h4 v-if="is_notary">
            Kindly submit your session recordings and documents to
            <span class="text-primary">submissions@supremecourt.gov.ng</span>.
            Click share to proceed.
          </h4>

          <div class="my-1 text-center">
            <a
              v-if="!is_notary"
              class="btn btn-primary"
              :href="redirectToUserDashboard + '/redirecting?qt=' + token"
            >
              Dashboard</a
            >
            <a
              v-if="is_notary"
              class="btn btn-primary"
              :href="redirectToNotaryDashboard + '/redirecting?qt=' + token"
            >
              Dashboard</a
            >
          </div>
          <div>
            <!-- <template v-if="isActive">
              <div>
                <span class="h5"> Download: </span>
                <a @click="download" href="#" id="download" class=""
                  ><Icon icon="material-symbols:slow-motion-video" />
                  {{ videoFilename }}</a
                >
              </div>
            </template> -->
          </div>
        </div>
      </div>

      <div class="col-lg-9 col-sm-12" :style="{ width: '815px' }">
        <div class="mb-1">
          <!-- <button class="btn btn-outline-secondary float-end">Share</button> -->
          <button
            v-if="!is_notary"
            class="btn btn-outline-primary me-1 mb-1 waves-effect"
            @click="exportHTMLToPDF"
            :disabled="isDownload"
          >
            <template v-if="isDownload">
              <span class="spinner-border spinner-border-sm"></span>
              Downloading
            </template>
            <template v-else>
              <Icon icon="uil:file-download-alt" />
              Download Document
            </template>
          </button>
          <button
            v-if="!is_notary"
            class="btn btn-outline-primary me-1 mb-1 waves-effect"
            @click="emailModal = true"
          >
            Share
          </button>
          <button
            v-if="is_notary"
            class="btn btn-outline-primary me-1 mb-1 waves-effect"
            @click="notaryShareModal = true"
          >
            Share
          </button>
          <template v-if="isActive">
            <a
              @click="download"
              href="#"
              id="download"
              class="btn btn-outline-primary text-decoration-none mb-1"
            >
              <Icon icon="material-symbols:slow-motion-video" /> Download
              Recording
            </a>
          </template>
          <!-- <a class="dropdown-item" href="#">Share via email</a> -->
        </div>

        <p>Title: {{ documentTitle }}</p>
        <div class="card mb-0 bg-light">
          <div id="mainWrapper" class="mx-auto" :style="{ width: '815px' }">
            <RenderPage
              v-for="doc in sortedFile"
              :key="doc.id"
              comp="completed"
              :file="doc.file_url"
              @click="$emit('docId', doc.id)"
              @pageId="getPageId"
              @documentHeight="getHeight"
            >
              <template #document-tools>
                <template v-if="computedTools?.length != 0 && documentHeight">
                  <div
                    v-for="tool in activeTaskFilter(computedTools, doc.id)"
                    :key="tool.id"
                    class="parent"
                    :style="{ height: documentHeight + 'px' }"
                  >
                    <ToolAnnotationDisabled
                      @remove="remove"
                      :tool="tool"
                      comp="certificate"
                      :owner="{
                        isOwner: userDocument.is_the_owner_of_document,
                      }"
                    />
                  </div>
                </template>
              </template>
            </RenderPage>
          </div>
        </div>

        <section class="card" :style="{ width: '815px' }">
          <div
            class="sec-1 digi_cert downloader mb-1"
            style="min-height: 1000px"
          >
            <div class="p-2">
              <div class="text-center">
                <h1 class="fw-bolder p-2">Digital Transaction Certificate</h1>
                <p>Document Ref: {{ userDocument.id }}</p>
              </div>

              <div>
                <h5 class="fw-bolder">Document Name: {{ documentTitle }}</h5>
                <p class="fw-bolder">
                  Document Completed On:
                  {{
                    moment(userDocument.updated_at).format(
                      "dddd, MMMM Do YYYY, h:mm:ss a"
                    )
                  }}
                </p>
              </div>

              <table class="table table-bordered border-dark">
                <tr
                  v-for="(part, index) in sessionDetails.schedule.participants"
                  :key="index"
                >
                  <td>
                    <div class="row">
                      <div class="col-6 pb-1">
                        {{ part.first_name + " " + part.last_name }}
                      </div>
                      <div class="col-6 pb-1">
                        {{
                          part.who_added_id == part.user_id
                            ? "Document Owner"
                            : part.role
                        }}
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-6 pb-1">Email</div>
                      <div class="col-6 pb-1">{{ part.email }}</div>
                    </div>
                    <!-- <div class="row">
                      <div class="col-6 pb-1">ID Number.</div>
                      <div class="col-6 pb-1">1234567889</div>
                    </div> -->
                    <div class="row">
                      <div class="col-6 pb-1">Device IP.</div>
                      <div class="col-6 pb-1">{{ ipiFy }}</div>
                    </div>
                  </td>
                  <td>Signature</td>
                </tr>
              </table>
            </div>
          </div>

          <div class="sec-2 downloader bg-white" style="min-height: 1000px">
            <div class="card-header">
              <h4 class="card-title mb-0">Audit Trail</h4>
            </div>
            <div class="card-body">
              <template v-if="!userDocument">
                <div class="text-center">
                  <span class="spinner-border spinner-border-sm"></span>
                  Loading...
                </div>
              </template>
              <template v-else>
                <ul class="timeline" v-if="audit" style="font-size: 12px">
                  <!-- <li class="timeline-item" v-for="(item, index) in audited.slice(0, 12)" :key="index"> -->
                  <li
                    class="timeline-item"
                    v-for="(item, index) in audited"
                    :key="index"
                  >
                    <template v-if="userDocument.status == 'New'">
                      <span
                        class="
                          timeline-point
                          timeline-point-secondary
                          timeline-point-indicator
                        "
                      ></span>
                    </template>
                    <template v-else-if="userDocument.status == 'Sent'">
                      <span
                        class="
                          timeline-point
                          timeline-point-primary
                          timeline-point-indicator
                        "
                      ></span>
                    </template>
                    <template v-else>
                      <span
                        class="
                          timeline-point
                          timeline-point-success
                          timeline-point-indicator
                        "
                      ></span>
                    </template>
                    <div class="timeline-event">
                      <div class="mb-sm-0 mb-1">
                        <h6
                          class="text-dark text-capitalize"
                          style="font-size: 12px"
                        >
                          {{ item.full_name }}
                        </h6>
                        <small class="timeline-event-time text-dark">
                          {{ item.signed_date }}</small
                        >
                      </div>
                      <p>{{ item.added_text }}t</p>
                    </div>
                  </li>
                </ul>
              </template>

              <div class="d-flex justify-content-end mt-4">
                <img
                  src="@/assets/logo-dark.png"
                  height="15"
                  alt="ToNote Brand"
                />
              </div>
            </div>
          </div>

          <!-- <div class="divider" style="margin: 0.4rem 0;"></div> -->
        </section>
      </div>
    </div>
  </div>

  <!-- <ModalComp
    :show="saveContinue"
    :footer="false"
    :size="'modal-sm'"
    :closeBtn="false"
  >
    <template #header>
      <h4 class="modal-title text-danger mb-0">
        <Icon icon="eva:alert-triangle-outline" style="margin-bottom: 3px" />
        Alert
      </h4>
    </template>

    <template #body>
      <button
        class="btn btn-sm btn-primary d-block mx-auto my-2"
        @click="confirmSave"
        :disabled="isDownload"
      >
        <span
          v-show="isDownload"
          class="spinner-border spinner-border-sm"
        ></span>
        Save and continue
      </button>
    </template>
  </ModalComp> -->

  <ModalComp :show="emailModal" :footer="false" @close="emailModal = false">
    <template #header>
      <h5 class="modal-title">Share document</h5>
    </template>

    <template #body>
      <p class="text-center">The following people will recieve this document</p>
      <MailToParticipant
        :files="doneDataUrl"
        @close="emailModal = false"
        :isLoading="loading"
      />
    </template>
  </ModalComp>

  <!-- notary sends document  -->
  <ModalComp
    :show="notaryShareModal"
    :footer="false"
    @close="notaryShareModal = false"
  >
    <template #header>
      <h5 class="modal-title">Send document</h5>
    </template>

    <template #body>
      <MailToNotary :files="doneDataUrl" @close="notaryShareModal = false" />
    </template>
  </ModalComp>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import jsPDF from "jspdf";
import html2pdf from "html2pdf.js";

import { useGetters, useActions } from "vuex-composition-helpers/dist";
import RenderPage from "@/components/Document/Edit/Main/RenderPage";
import ToolAnnotationDisabled from "@/components/Document/Edit/Tools/ToolAnnotationDisabled.vue";
import ModalComp from "@/components/ModalComp.vue";
import MailToParticipant from "@/components/Document/Edit/MailToParticipant.vue";
import MailToNotary from "@/components/Document/Edit/MailToNotary.vue";
import moment from "moment";

const dateTime = () => {
  return moment().format("Do MMM YYYY");
};

const {
  userDocument,
  // doneDocument,
  workingTools,
  documentAuditTrail,
  virtual_session_details,
  // eslint-disable-next-line no-unused-vars
  session_complete,
  is_notary,
  token,
} = useGetters({
  userDocument: "document/userDocument",
  // doneDocument: "document/doneDocument",
  workingTools: "document/workingTools",
  documentAuditTrail: "document/audit_trails",
  virtual_session_details: "schedule/virtual_session_details",
  session_complete: "document/session_complete",
  is_notary: "auth/is_notary",
  token: "auth/token",
});

const {
  getDocumentAuditTrails,
  doneEditing,
  clearCompleteSession,
  getUserDocument,
} = useActions({
  getDocumentAuditTrails: "document/getDocumentAuditTrails",
  doneEditing: "document/doneEditing",
  clearCompleteSession: "document/clearCompleteSession",
  getUserDocument: "document/getUserDocument",
});

const redirectToUserDashboard = ref("");
const redirectToNotaryDashboard = ref("");
const emailModal = ref(false);
const notaryShareModal = ref(false);
const route = useRouter();
const uri = ref("");
const date = dateTime();
const documentTitle = userDocument.value.title;
const videoFilename =
  "Recorded video for " + userDocument.value.title + "_" + date;
const download = () => {
  let downloadLink = document.getElementById("download");
  downloadLink.download = `${videoFilename || "recording"}.webm`;
};

let isActive = ref(false);

let video_url = route.currentRoute.value.query.record_file;
video_url === undefined ? (isActive = false) : (isActive = true);

const computedTools = computed(() => {
  return workingTools.value;
});

const sessionDetails = computed(() => {
  return virtual_session_details.value;
});

const activeTaskFilter = (tools, docUpId) => {
  let activeTasks = tools.filter((tool) => {
    return tool.document_upload_id === docUpId;
  });
  return activeTasks;
};

const isDownload = ref(false);
const doneDataUrl = ref([]);
const files = ref([]);
const sortedFile = ref("");

const documentHeight = ref(0);
const getHeight = (event) => (documentHeight.value = event);

const audited = ref([]);
const audit = computed(() => {
  if (documentAuditTrail.value.length > 0) {
    documentAuditTrail.value.map((str) => {
      const longName = str.log_name.split(" ", 2);
      const auditObj = {
        full_name: longName[0] + " " + longName[1],
        signed_date: createdAt(str.created_at),
        added_text: str.log_name,
      };
      audited.value.push(auditObj);
    });
  }
  return audit;
});

const exportHTMLToPDF = async (params) => {
  if (!params) isDownload.value = true;
  const pages = document.getElementsByClassName("downloader");

  const opt = {
    margin: [0, 0, -2, 0],
    filename: userDocument.value.title + ".pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { dpi: 192, letterRendering: true },
    jsPDF: {
      unit: "in",
      format: "letter",
      orientation: "portrait",
      compressPDF: false,
    },
  };

  const doc = new jsPDF(opt.jsPDF);
  const pageSize = jsPDF.getPageSize(opt.jsPDF);

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];

    if (params != "done") {
      const pageImage = await html2pdf().set(opt).from(page).outputImg();
      if (i != 0) doc.addPage();
      doc.addImage(
        pageImage.src,
        "jpeg",
        opt.margin[0],
        opt.margin[0],
        pageSize.width,
        pageSize.height
      );
    } else {
      await html2pdf()
        .set(opt)
        .from(page)
        .outputPdf()
        .then(function (pdf) {
          doneDataUrl.value.push("data:application/pdf;base64," + btoa(pdf));
        });
    }
  }

  if (params == "done") {
    if (pages.length === doneDataUrl.value.length) isDoneEdit();
    return;
  }

  const pdf = doc.save(opt.filename);
  if (pdf) isDownload.value = false;
  return pdf;
};

const isDoneEdit = () => {
  let dataObj = {
    document_id: userDocument.value.id,
    files: doneDataUrl.value,
  };
  doneEditing(dataObj);
};

// const confirmSave = () => {
//   exportHTMLToPDF("done");
// };

const createdAt = (dateParams) => {
  return moment(dateParams).format("MMM. Do, YYYY [at] h:mm:ss a");
};

const ipiFy = ref("");
// const saveContinue = ref(false);
onMounted(() => {
  getUserDocument(userDocument.value.id).then((value) => {
    if (value) {
      if (userDocument.value.is_the_owner_of_document)
        setTimeout(() => exportHTMLToPDF("done"), 8000);
    }
  });
  // console.log(userDocument.value.documentUploads);
  redirectToUserDashboard.value = process.env.VUE_APP_URL_AUTH_LIVE;
  redirectToNotaryDashboard.value = process.env.VUE_APP_URL_NOTARY_LIVE;

  let downloadLink = document.getElementById("download");
  uri.value = route.currentRoute.value.query;
  video_url === undefined ? "" : (downloadLink.href = uri.value?.record_file);
  getDocumentAuditTrails(userDocument.value.id);

  userDocument.value.documentUploads.filter((item) => {
    console.log(item);
    if (item.status == "Processing") {
      // if (item.status == 'Processing' && item.number_ordering != null) { //? NOTE: This is the real condition
      files.value.push({
        id: item.id,
        file_url: item.file_url,
        number: item.number_ordering,
      });
    }
    if (item.number_ordering != null) {
      sortedFile.value = files.value.sort((a, b) =>
        a.number > b.number ? 1 : -1
      );
    } else {
      console.log(files.value);
      sortedFile.value = files.value;
    }
  });

  fetch("https://api.ipify.org?format=json")
    .then((response) => response.json())
    .then((response) => {
      ipiFy.value = response.ip;
    });
});

onUnmounted(() => {
  clearCompleteSession();
});
</script>

<style scoped>
.parent {
  width: 815px;
  position: absolute;
  user-select: none;
}

.digi_cert {
  background-image: url("../../assets/images/cert-bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  /* background-position: center;
  background-color: #f7f8f9; */
}

/* .sec-2 {
  height: 60vh;
  overflow-y: auto;
} */

#download:hover {
  text-decoration: underline;
}

*::-webkit-scrollbar {
  width: 12px;
}

*::-webkit-scrollbar-track {
  background: #eee;
}

*::-webkit-scrollbar-thumb {
  background-color: #999;
  border-radius: 20px;
  border: 3px solid #eee;
}
</style>
