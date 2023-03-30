<template>
  <div class="content-right border-0">
    <div
      @click="$emit('open', (openSide = true))"
      class="d-none sidebar-toggle d-block d-lg-none ms-1 my-1"
    >
      <MenuIcon />
    </div>

    <div class="content-body">
      <div
        class="body-content-overlay"
        :class="{ show: dashboard.isOpened }"
        @click="dashboard.setIsOpened(false)"
      ></div>
      <div class="email-app-list">
        <div class="email-user-list">
          <div class="card shadow-none bg-light">
            <div class="card-body shadow-none px-1">
              <p>Title: {{ theDoc.title }}</p>
              <div id="mainWrapper" class="mx-auto" :style="{ width: '815px' }">
                <RenderPage
                  v-for="doc in sortedFile"
                  :key="doc.id"
                  :docId="doc.id"
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
                        <ToolAnnotation
                          @remove="remove"
                          :tool="tool"
                          :owner="{
                            isOwner: theDoc.is_the_owner_of_document,
                            name: theDoc.document_owner,
                          }"
                        />
                      </div>
                    </template>
                  </template>
                </RenderPage>

                <div
                  v-if="auditTrail"
                  class="col-lg-9 col-sm-12"
                  :style="{ width: '815px' }"
                >
                  <p>Title: {{ documentTitle }}</p>
                  <div class="card mb-0 bg-light">
                    <div
                      id="mainWrapper"
                      class="mx-auto"
                      :style="{ width: '815px' }"
                    ></div>
                  </div>

                  <section class="card" :style="{ width: '815px' }">
                    <div
                      class="sec-1 digi_cert downloader mb-1"
                      style="min-height: 1000px"
                    >
                      <div class="p-2">
                        <div class="text-center">
                          <h1 class="fw-bolder p-2">
                            Digital Transaction Certificate
                          </h1>
                          <!-- <p>Document Ref: '{{ userDocument.id }}'</p> -->
                        </div>

                        <div>
                          <h5 class="fw-bolder">
                            <!-- Document Name: {{ documentTitle }} -->
                          </h5>
                          <p class="fw-bolder">
                            Document Completed On:
                            <!-- {{
                              moment(userDocument.updated_at).format(
                                "dddd, MMMM Do YYYY, h:mm:ss a"
                              )
                            }} -->
                          </p>
                        </div>

                        <table class="table table-bordered border-dark">
                          <tr
                            v-for="(part, index) in session_details.schedule
                              .participants"
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
                                      : part.role == "Notary"
                                      ? "Commissioner for Oaths"
                                      : part.role
                                  }}
                                </div>
                              </div>
                              <div class="row">
                                <div class="col-6 pb-1">Email</div>
                                <div class="col-6 pb-1">{{ part.email }}</div>
                              </div>
                              <div class="row">
                                <div class="col-6 pb-1">Device IP.</div>
                                <div class="col-6 pb-1">{{ ipiFy }}</div>
                                <!-- <div class="row">
                      <div class="col-6 pb-1">ID Number.</div>
                      <div class="col-6 pb-1">1234567889</div>
                    </div> -->
                              </div>
                            </td>
                            <td>
                              <div class="col-12 pb-1">Signature</div>
                              <div class="col-12 pb-1">
                                <SignatureFromTools :userId="part.user_id" />
                              </div>
                            </td>
                          </tr>
                        </table>
                      </div>
                    </div>

                    <div
                      class="sec-2 downloader bg-white"
                      style="min-height: 1000px"
                    >
                      <div class="card-header">
                        <h4 class="card-title mb-0">Audit Trail</h4>
                      </div>
                      <div class="card-body">
                        <template v-if="!userDocument">
                          <div class="text-center">
                            <span
                              class="spinner-border spinner-border-sm"
                            ></span>
                            Loading...
                          </div>
                        </template>
                        <template v-else>
                          <ul
                            class="timeline"
                            v-if="audit"
                            style="font-size: 12px"
                          >
                            <!-- <li class="timeline-item" v-for="(item, index) in audited.slice(0, 12)" :key="index"> -->
                            <li
                              class="timeline-item"
                              v-for="(item, index) in audited"
                              :key="index"
                            >
                              <template v-if="userDocument.status == 'New'">
                                <span
                                  class="timeline-point timeline-point-secondary timeline-point-indicator"
                                ></span>
                              </template>
                              <template
                                v-else-if="userDocument.status == 'Sent'"
                              >
                                <span
                                  class="timeline-point timeline-point-primary timeline-point-indicator"
                                ></span>
                              </template>
                              <template v-else>
                                <span
                                  class="timeline-point timeline-point-success timeline-point-indicator"
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
                                <p>{{ item.added_text }}</p>
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
          </div>
        </div>

        <div class="ps__rail-y" style="top: 0px; height: 100px; right: 0px">
          <div
            class="ps__thumb-y"
            tabindex="0"
            style="top: 0px; height: 100px"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { dashboard } from "@/store/dashboard";
import ToolAnnotation from "@/components/Document/Edit/Tools/ToolAnnotation.vue";
import RenderPage from "./RenderPage.vue";
import MenuIcon from "@/icons/MenuIcon.vue";

import { ref, onMounted, watch, defineProps, computed } from "vue";
import { useRouter } from "vue-router";
import { useGetters, useActions } from "vuex-composition-helpers/dist";
import moment from "moment";
import SignatureFromTools from "@/components/Document/Edit/Main/SignatureFromTools.vue";

defineProps(["auditTrail"]);
const router = useRouter();

const createdAt = (dateParams) => {
  return moment(dateParams).format("MMM. Do, YYYY [at] h:mm:ss a");
};
const {
  userDocument,
  workingTools,
  isLoading,
  session_details,
  documentAuditTrail,
} = useGetters({
  workingTools: "document/workingTools",
  userDocument: "document/userDocument",
  isLoading: "document/isLoading",
  session_details: "schedule/virtual_session_details",
  documentAuditTrail: "document/audit_trails",
});

const { getUserDocument, getTools, removeTool } = useActions({
  getUserDocument: "document/getUserDocument",
  getTools: "document/getTools",
  removeTool: "document/removeTool",
});

const openSide = ref(false);
const theDoc = ref("");
const theTools = ref([]);
const documentHeight = ref(0);

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

const activeTaskFilter = (tools, docUpId) => {
  let activeTasks = tools.filter((tool) => {
    return tool.document_upload_id === docUpId;
  });
  return activeTasks;
};

const files = ref([]);
const sortedFile = ref("");
watch(
  () => [userDocument.value, isLoading.value],
  ([newDoc, newTool], [oldDoc, oldTool]) => {
    if (oldDoc != newDoc) {
      theDoc.value = newDoc;
      newDoc.documentUploads.filter((item) => {
        /***************************************************************************************************************
         *? THIS IS STILL WORK-IN-PROGRESS! I AM EXPECTING A RESPONSE FROM SCHNEIDER.
         *? I ASKED HIM TO DO SOMETHING ABOUT THE SIGNED DOCUMENT AND THE EDITABLE DOCUMENT *
         ***************************************************************************************************************/
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
    }

    if (oldTool != newTool) theTools.value = workingTools.value;
  },
  { deep: true }
);

const getHeight = (event) => (documentHeight.value = event);

const remove = (params) => removeTool(params);

const uri = ref("");
onMounted(() => {
  console.log(session_details.value);
  uri.value = router.currentRoute.value.params.document_id;
  getUserDocument(uri.value);
  getTools(uri.value);
});
</script>

<style scoped>
.parent {
  width: 815px;
  position: absolute;
  user-select: none;
}
.digi_cert {
  background-image: url("../../../../assets/images/cert-bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.email-application .content-area-wrapper .email-user-list {
  height: auto;
}

.custom-box {
  width: 28px;
  height: 28px;
}
</style>
