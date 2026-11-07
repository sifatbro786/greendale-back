import { Router } from "express";

import { auditCtx } from "#core/audit.js";
import { ok } from "#core/http.js";
import { requirePermission } from "#core/rbac.js";
import { validate } from "#core/validate.js";

import * as s from "./cms.schema.js";
import * as cms from "./cms.service.js";

/** /api/cms/* — website content management (permission website.manage). */
export const cmsRouter = Router();
cmsRouter.use(requirePermission("website.manage"));

const id = validate({ params: s.uuidParams });

cmsRouter.get("/overview", async (_req, res) => ok(res, await cms.overview()));

cmsRouter.get("/pages/:id", id, async (req, res) => ok(res, await cms.getPage(req.valid.params.id)));
cmsRouter.patch("/pages/:id", validate({ params: s.uuidParams, body: s.updatePageSchema }), async (req, res) => ok(res, await cms.updatePage(req.valid.params.id, req.valid.body, auditCtx(req))));

cmsRouter.get("/news/:id", id, async (req, res) => ok(res, await cms.getNews(req.valid.params.id)));
cmsRouter.post("/news", validate({ body: s.createNewsSchema }), async (req, res) => ok(res, await cms.createNews(req.valid.body, auditCtx(req)), { status: 201 }));
cmsRouter.patch("/news/:id", validate({ params: s.uuidParams, body: s.updateNewsSchema }), async (req, res) => ok(res, await cms.updateNews(req.valid.params.id, req.valid.body, auditCtx(req))));
cmsRouter.delete("/news/:id", id, async (req, res) => ok(res, await cms.deleteNews(req.valid.params.id, auditCtx(req))));

cmsRouter.get("/albums/:id", id, async (req, res) => ok(res, await cms.getAlbum(req.valid.params.id)));
cmsRouter.post("/albums", validate({ body: s.createAlbumSchema }), async (req, res) => ok(res, await cms.createAlbum(req.valid.body, auditCtx(req)), { status: 201 }));
cmsRouter.patch("/albums/:id", validate({ params: s.uuidParams, body: s.updateAlbumSchema }), async (req, res) => ok(res, await cms.updateAlbum(req.valid.params.id, req.valid.body, auditCtx(req))));
cmsRouter.delete("/albums/:id", id, async (req, res) => ok(res, await cms.deleteAlbum(req.valid.params.id, auditCtx(req))));
cmsRouter.post("/albums/:id/images", validate({ params: s.uuidParams, body: s.addImagesSchema }), async (req, res) => ok(res, await cms.addImages(req.valid.params.id, req.valid.body.images, auditCtx(req)), { status: 201 }));
cmsRouter.put("/albums/:id/images/order", validate({ params: s.uuidParams, body: s.reorderSchema }), async (req, res) => ok(res, await cms.reorderImages(req.valid.params.id, req.valid.body.ids)));
cmsRouter.patch("/albums/:id/images/:imageId", validate({ params: s.imageParams, body: s.updateImageSchema }), async (req, res) => ok(res, await cms.updateImage(req.valid.params.id, req.valid.params.imageId, req.valid.body)));
cmsRouter.delete("/albums/:id/images/:imageId", validate({ params: s.imageParams }), async (req, res) => ok(res, await cms.deleteImage(req.valid.params.id, req.valid.params.imageId, auditCtx(req))));

cmsRouter.patch("/messages/:id", validate({ params: s.uuidParams, body: s.messageSchema }), async (req, res) => ok(res, await cms.markMessage(req.valid.params.id, req.valid.body, auditCtx(req))));
