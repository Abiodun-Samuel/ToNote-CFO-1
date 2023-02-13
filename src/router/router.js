import { createRouter, createWebHistory } from "vue-router";
import NProgress from "nprogress";
import store from "@/store";

const UserAuth = () =>
  import(/* webpackChunkName: "auth-login" */ "@/views/UserAuth.vue");

const LandingPage = () =>
  import(/* webpackChunkName: "landing-page" */ "@/views/LandingPage.vue");

const DocumentAuditTrail = () =>
  import(
    /* webpackChunkName: "audit-trail" */ "@/views/documents/DocumentAuditTrail.vue"
  );

// const DocumentUserVerify = () =>
//   import(
//     /* webpackChunkName: "auth-verify" */ "@/components/Auth/UserVerify.vue"
//   );

const DocumentIndex = () =>
  import(/* webpackChunkName: "user" */ "@/views/DocumentIndex.vue");

const DocumentDashboard = () =>
  import(
    /* webpackChunkName: "document" */ "@/views/documents/DocumentDashboard.vue"
  );

const DocumentUpload = () =>
  import(
    /* webpackChunkName: "upload-document" */ "@/views/documents/DocumentUpload.vue"
  );

const DocumentPrepare = () =>
  import(
    /* webpackChunkName: "prepare-document" */ "@/views/documents/DocumentPrepare.vue"
  );

const DocumentEdit = () =>
  import(
    /* webpackChunkName: "edit-document" */ "@/views/documents/DocumentEdit.vue"
  );
const NotarySchedule = () =>
  import(
    /* webpackChunkName: "upload-document" */ "@/views/schedule/ScheduleNotaryView.vue"
  );
const SessionComplete = () =>
  import(
    /* webpackChunkName: "upload-document" */ "@/views/session/SessionComplete.vue"
  );
const NotarySessionPayment = () =>
  import(
    /* webpackChunkName: "upload-document" */ "@/views/session/NotarySessionPayment.vue"
  );
// new waiting page
const SessionPrepPage = () =>
  import(
    /* webpackChunkName: "auth-register" */ "@/views/session/SessionPrepPage.vue"
  );
const Confirmation = () =>
  import(
    /* webpackChunkName: "auth-register" */ "@/views/schedule/ConfirmationView.vue"
  );

const SessionVerify = () =>
  import(
    /* webpackChunkName: "auth-register" */ "@/views/Verify/SessionVerify.vue"
  );

// const NotaryCompleteSession = () =>
//   import(
//     /* webpackChunkName: "auth-register" */ "@/views/session/NotaryCompleteSession.vue"
//   );

const PaymentErrorPage = () =>
  import(
    /* webpackChunkName: "auth-register" */ "@/views/PaymentErrorPage.vue"
  );

const routes = [
  {
    path: "/",
    name: "Login",
    component: UserAuth,
    meta: {
      title: "ToNote",
    },
  },
  {
    path: "/auth/verify",
    name: "verify",
    component: SessionVerify,
    beforeEnter: (to, from, next) => {
      const hasToken = store.getters["auth/token"];
      if (hasToken)
        return next({
          name: "session-prep",
          params: { session_id: to.query.di },
        });
      next();
    },
    meta: {
      title: "Verify | ToNote",
      metaTags: [
        {
          name: "description",
          content: "The verification page of ToNote.",
        },
        {
          property: "og:description",
          content: "The verification page of ToNote.",
        },
      ],
    },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: LandingPage,
    meta: {
      title: "Documents | ToNote",
      requiresAuth: true,
      metaTags: [
        {
          name: "description",
          content: "The document dashboard page of ToNote.",
        },
        {
          property: "og:description",
          content: "The document dashboard page of ToNote.",
        },
      ],
    },
  },
  {
    path: "/notary",
    name: "document-index",
    component: DocumentIndex,
    meta: {
      title: "Documents - ToNote",
    },
    children: [
      {
        path: "",
        name: "document.dashboard",
        component: DocumentDashboard,
        // beforeEnter(to, from, next) {
        //   next({ name: "notary.schedule" });
        // },
        meta: {
          title: "Notary | Schedule - ToNote",
          requiresAuth: true,
        },
      },
      {
        path: "audit/:document_id",
        name: "document.audit",
        component: DocumentAuditTrail,
        meta: {
          title: "Audit Trail | ToNote",
          metaTags: [
            {
              name: "description",
              content: "The audit trail page of ToNote.",
            },
            {
              property: "og:description",
              content: "The audit trail page of ToNote.",
            },
          ],
        },
      },
      // {
      //   path: "verify",
      //   name: "document.verify",
      //   component: DocumentUserVerify,
      //   meta: {
      //     title: "Verification | ToNote",
      //     metaTags: [
      //       {
      //         name: "description",
      //         content: "The verification page of ToNote.",
      //       },
      //       {
      //         property: "og:description",
      //         content: "The verification page of ToNote.",
      //       },
      //     ],
      //   },
      // },
      {
        path: "upload",
        name: "document.upload",
        component: DocumentUpload,
        meta: {
          title: "Upload Document | ToNote",
          metaTags: [
            {
              name: "description",
              content: "The document upload's page of ToNote.",
            },
            {
              property: "og:description",
              content: "The document upload's page of ToNote.",
            },
          ],
        },
      },
      {
        path: "prepare",
        name: "document.prepare",
        component: DocumentPrepare,
        meta: {
          title: "Prepare Document | ToNote",
          requiresAuth: true,
          metaTags: [
            {
              name: "description",
              content: "The document setup page of ToNote.",
            },
            {
              property: "og:description",
              content: "The document setup page of ToNote.",
            },
          ],
        },
      },
      {
        path: "session/:document_id/:session_id",
        name: "document.edit",
        component: DocumentEdit,
        meta: {
          title: "Notary Session | ToNote",
          requiresAuth: true,
          metaTags: [
            {
              name: "description",
              content: "The notary session page of ToNote.",
            },
            {
              property: "og:description",
              content: "The notary session page of ToNote.",
            },
          ],
        },
      },
      // waiting page
      {
        path: "session-prep/:session_id",
        name: "session-prep",
        component: SessionPrepPage,
        props: true,
        beforeEnter: (to, from, next) => {
          const hasToken = store.getters["auth/token"];
          if (!to.query.token && !hasToken) return next({ name: "Login" });
          next();
        },
        meta: {
          // requiresAuth: true,
          title: "Notary Session Prep | ToNote",
          metaTags: [
            {
              name: "description",
              content: "The Preparatory page for notary session.",
            },
            {
              property: "og:description",
              content: "The Preparatory page for notary session.",
            },
          ],
        },
      },
      // schedule notary session
      //
      // if (!hasToken) {
      //   ;
      {
        path: "schedule",
        name: "notary.schedule",
        component: NotarySchedule,
        props: true,
        beforeEnter: (to, from, next) => {
          const hasToken = store.getters["auth/token"];
          if (!to.query.token && !hasToken) return next({ name: "Login" });
          next();
        },
        meta: {
          // requiresAuth: true,
          title: "Notary Session Schedule | ToNote",
          metaTags: [
            {
              name: "description",
              content: "The Schedule Notary Session page of ToNote.",
            },
            {
              property: "og:description",
              content: "The Schedule Notary Session page of ToNote.",
            },
          ],
        },
      },
      // session complete
      {
        path: "/session-complete",
        name: "session-complete",
        component: SessionComplete,
        props: true,
        meta: {
          requiresAuth: true,
          title: "Session Complete | ToNote",
          metaTags: [
            {
              name: "description",
              content: "The Session complete page of ToNote.",
            },
            {
              property: "og:description",
              content: "The Session complete page of ToNote.",
            },
          ],
        },
      },
      // {
      //   path: "/notary-session-complete",
      //   name: "notary-session-complete",
      //   component: NotaryCompleteSession,
      //   props: true,
      //   meta: {
      //     requiresAuth: true,
      //     title: "Session Complete | ToNote",
      //     metaTags: [
      //       {
      //         name: "description",
      //         content: "The Session complete page of ToNote.",
      //       },
      //       {
      //         property: "og:description",
      //         content: "The Session complete page of ToNote.",
      //       },
      //     ],
      //   },
      // },
      {
        path: "/payment-confirmation",
        name: "payment-confirmation",
        component: Confirmation,
        meta: {
          title: "Payment Confirmation - ToNote",
          requiresAuth: true,
          metaTags: [
            {
              name: "description",
              content: "Payment Confirmation Page",
            },
            {
              property: "og:description",
              content: "Payment Confirmation Page",
            },
          ],
        },
      },
      {
        path: "/session-payment",
        name: "session-payment",
        component: NotarySessionPayment,
        meta: {
          title: "Notary Session Payment - ToNote",
          requiresAuth: true,
          metaTags: [
            {
              name: "description",
              content: "Notary Session Payment  Page",
            },
            {
              property: "og:description",
              content: "Notary Session Payment  Page",
            },
          ],
        },
      },
      {
        path: "/payment-error",
        name: "payment-error",
        component: PaymentErrorPage,
        meta: {
          title: "Notary Session Payment - ToNote",
          requiresAuth: true,
          metaTags: [
            {
              name: "description",
              content: "Notary Session Payment  Page",
            },
            {
              property: "og:description",
              content: "Notary Session Payment  Page",
            },
          ],
        },
      },
    ],
  },

  {
    path: "/notification",
    name: "Error",
    component: () => import("@/components/DocNotFound.vue"),
    meta: {
      title: "Error 404 | ToNote",
      metaTags: [
        {
          name: "description",
          content: "The document not found page of ToNote.",
        },
        {
          property: "og:description",
          content: "The document not found page of ToNote.",
        },
      ],
    },
  },

  {
    path: "/:catchAll(.*)",
    component: () => import("@/components/NotFound.vue"),
    meta: {
      title: "Error 404 | ToNote",
      metaTags: [
        {
          name: "description",
          content: "The error 404 page of ToNote.",
        },
        {
          property: "og:description",
          content: "The error 404 page of ToNote.",
        },
      ],
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: "active",
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return {
        savedPosition,
        behavior: "smooth",
      };
    } else {
      return { x: 0, y: 0 };
    }
  },
});

router.beforeEach((to, from, next) => {
  NProgress.start();

  /* ---------------------------------------------//? ROUTE GUARD META -------------------------------------------- */

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const hasToken = store.getters["auth/token"];
    if (!hasToken) {
      next({ name: "Login" });
    } else {
      next();
    }
  } else {
    next();
  }

  /* ---------------------------------------------//? SEO Friendly META -------------------------------------------- */

  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.title);

  // Find the nearest route element with meta tags.
  const nearestWithMeta = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.metaTags);
  const previousNearestWithMeta = from.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.metaTags);

  // If a route with a title was found, set the document (page) title to that value.
  // if (nearestWithTitle) document.title = nearestWithTitle.meta.title;
  if (nearestWithTitle) {
    document.title = nearestWithTitle.meta.title;
  } else {
    document.title = previousNearestWithMeta.meta.title;
  }

  // Remove any stale meta tags from the document using the key attribute we set below.
  Array.from(document.querySelectorAll("[data-vue-router-controlled]")).map(
    (el) => el.parentNode.removeChild(el)
  );

  // Skip rendering meta tags if there are none.
  if (!nearestWithMeta) return next();

  // Turn the meta tag definitions into actual elements in the head.
  nearestWithMeta.meta.metaTags
    .map((tagDef) => {
      const tag = document.createElement("meta");

      Object.keys(tagDef).forEach((key) => {
        tag.setAttribute(key, tagDef[key]);
      });
      // We use this to track which meta tags we create, so we don't interfere with other ones.
      tag.setAttribute("data-vue-router-controlled", "");

      return tag;
    })
    // Add the meta tags to the document head.
    .forEach((tag) => document.head.appendChild(tag));

  next();
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
