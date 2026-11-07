import { Router } from "express";

import { academicsRouter } from "./academics/academics.routes.js";
import { auditRouter } from "./audit/audit.routes.js";
import { authRouter } from "./auth/auth.routes.js";
import { cmsRouter } from "./cms/cms.routes.js";
import { contactRouter } from "./contact/contact.routes.js";
import { healthRouter } from "./health/health.routes.js";
import { publicRouter } from "./public/public.routes.js";
import { rolesRouter } from "./roles/roles.routes.js";
import { staffRouter } from "./staff/staff.routes.js";
import { uploadsRouter } from "./uploads/uploads.routes.js";
import { usersRouter } from "./users/users.routes.js";

/**
 * Module registry. Every module exports one router; mount it here under /api.
 * Steps 2–4 add: auth, users, audit, cms, public, uploads, academics, students, attendance,
 * routine, notices, sms, exams, results, fees, payments, portal.
 */
export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/contact", contactRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/roles", rolesRouter);
apiRouter.use("/audit", auditRouter);
apiRouter.use("/public", publicRouter);
apiRouter.use("/cms", cmsRouter);
apiRouter.use("/uploads", uploadsRouter);
apiRouter.use("/academics", academicsRouter);
apiRouter.use("/staff", staffRouter);
