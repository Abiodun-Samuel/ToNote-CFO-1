<template>
  <div class="container-fluid">
    <div class="row d-flex justify-content-center">
      <div class="card col-lg-9">
        <div class="card-body">
          <h4>Session ended successfully</h4>
          <p>Download your session resources below</p>
          <div>
            <!-- <template v-if="isActive">
              <div>
                <span class="h5"> Download: </span>
                <a @click="download" href="#" id="download" class=""
                  ><Icon icon="material-symbols:slow-motion-video" />
                  {{ videoFilename }}</a
                >
              </div>cert-bg.png
            </template> -->
          </div>
        </div>
      </div>

      <div class="col-lg-9 col-sm-12">
        <div class="mb-1">
          <!-- <button class="btn btn-outline-secondary float-end">Share</button> -->

          <button
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
            @click="
              emailModal = true;
              exportHTMLToPDF('done');
            "
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
        <div class="card">
          <div class="card-body">
            <div id="mainWrapper" class="mx-auto" :style="{ width: '815px' }">
              <RenderPage
                v-for="doc in sortedFile"
                :key="doc.id"
                :file="doc.file_url"
                @click="$emit('docId', doc.id)"
                @pageId="getPageId"
                @documentHeight="getHeight"
              >
                <template #document-tools>
                  <template v-if="theTools?.length != 0 && documentHeight">
                    <div
                      v-for="tool in activeTaskFilter(theTools, doc.id)"
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
        </div>

        <section class="card digi_cert">
          <div class="sec-1">
            <div class="p-2">
              <div class="text-center">
                <h1 class="fw-bolder">Digital Transaction Certificate</h1>
                <p>Document Ref: {{ userDocument.id }}</p>
              </div>

              <div class="my-1">
                <h5 class="fw-bolder">
                  Notarised Document Name: {{ documentTitle }}
                </h5>
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
                  v-for="(participant, index) in userDocument.participants"
                  :key="index"
                >
                  <td>
                    <div class="row">
                      <div class="col-6 pb-1">
                        {{
                          participant.user.first_name +
                          " " +
                          participant.user.last_name
                        }}
                      </div>
                      <div class="col-6 pb-1">
                        {{
                          participant.ownerDocument
                            ? "Document Owner"
                            : participant.role
                        }}
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-6 pb-1">Email</div>
                      <div class="col-6 pb-1">{{ participant.user.email }}</div>
                    </div>
                    <div class="row">
                      <div class="col-6 pb-1">ID Number.</div>
                      <div class="col-6 pb-1">1234567889</div>
                    </div>
                    <div class="row">
                      <div class="col-6 pb-1">Device IP.</div>
                      <div class="col-6 pb-1">127.0.0.1</div>
                    </div>
                  </td>
                  <td>Signature</td>
                </tr>
              </table>
            </div>
          </div>

          <div class="sec-2">
            <div class="card-header">
              <h4 class="card-title">Audit Trail</h4>
            </div>
            <div class="card-body">
              <template v-if="audit_trails_loader">
                <div class="text-center">
                  <PreLoader />
                </div>
              </template>
              <template v-else>
                <ul class="timeline" v-if="audit">
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
                        <h6 class="text-dark text-capitalize">
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
        </section>
      </div>
    </div>
  </div>
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
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import jsPDF from "jspdf";
import html2pdf from "html2pdf.js";
// eslint-disable-next-line no-unused-vars
import { useGetters, useActions } from "vuex-composition-helpers/dist";
import RenderPage from "@/components/Document/Edit/Main/RenderPage";
import ToolAnnotationDisabled from "@/components/Document/Edit/Tools/ToolAnnotationDisabled.vue";
import moment from "moment";
import PreLoader from "@/components/Loader/PreLoader.vue";
import { Icon } from "@iconify/vue";
import MailToParticipant from "@/components/Document/Edit/MailToParticipant.vue";
import ModalComp from "@/components/ModalComp.vue";

const emailModal = ref(false);
const dateTime = () => {
  return moment().format("Do MMM YYYY");
};

const {
  userDocument,
  workingTools,
  documentAuditTrail,
  audit_trails_loader,
  is_notary,
} = useGetters({
  userDocument: "document/userDocument",
  workingTools: "document/workingTools",
  documentAuditTrail: "document/audit_trails",
  audit_trails_loader: "document/audit_trails_loader",
  is_notary: "auth/is_notary",
});

const { getDocumentAuditTrails } = useActions({
  getDocumentAuditTrails: "document/getDocumentAuditTrails",
});

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

const theTools = ref([]);
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
  let audit;
  if (documentAuditTrail.value.length > 0) {
    audit = documentAuditTrail.value.filter((str) => {
      const longName = str.log_name.split(" ", 2);
      for (let i = 0; i < longName.length; i++) {
        longName[i] =
          longName[i].charAt(0).toUpperCase() + longName[i].slice(1);
        const participantName = longName.join(" ");

        const auditObj = {
          full_name: participantName,
          signed_date: createdAt(str.created_at),
          added_text: str.log_name,
        };
        return audited.value.push(auditObj);
      }
    });
  }
  return audit;
});

const exportHTMLToPDF = async (params) => {
  if (params != "done") {
    isDownload.value = true;
  }

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
      compressPDF: true,
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
    if (pages.length === doneDataUrl.value.length)
      //  isDoneEdit();
      return;
  }

  const pdf = doc.save(opt.filename);
  if (pdf) isDownload.value = false;
  return pdf;
};

const createdAt = (dateParams) => {
  return moment(dateParams).format("MMM. Do, YYYY [at] h:mm:ss a");
};
onMounted(() => {
  let downloadLink = document.getElementById("download");
  uri.value = route.currentRoute.value.query;
  video_url === undefined ? "" : (downloadLink.href = uri.value?.record_file);
  getDocumentAuditTrails(userDocument.value.id);

  setTimeout(function () {
    theTools.value = workingTools.value;
  }, 1000);

  userDocument.value.documentUploads.filter((item) => {
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
      sortedFile.value = files.value;
    }
  });
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
  background-size: 100%;
  /* background-color: #f7f8f9; */
}

.sec-2 {
  height: 60vh;
  overflow-y: auto;
}

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
