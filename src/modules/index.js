import { Router } from "express";

import { healthRouter } from "./health/health.routes.js";

/**
 * Module registry. Every module exports one router; mount it here under /api.
 * Steps 2–4 add: auth, users, audit, cms, public, uploads, academics, students, attendance,
 * routine, notices, sms, exams, results, fees, payments, portal.
 */
export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
