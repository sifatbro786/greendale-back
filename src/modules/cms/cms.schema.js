import { z } from "zod";

import { STORED_PATH } from "#core/storage.js";

/** An image the client got back from POST /api/uploads (or a seeded /images/... path). */
export const imageInput = z.object({
    path: z.string().regex(STORED_PATH, "Upload the photo again."),
    alt: z.string().trim().max(200).default(""),
    width: z.number().int().positive().max(20000).nullish(),
    height: z.number().int().positive().max(20000).nullish(),
});

const html = z.string().max(100_000, "The text is too long.");
const slug = z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use small letters, numbers and dashes only.")
    .max(100);
const ymd = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use a date.");

export const uuidParams = z.object({ id: z.uuid("Not found") });
export const imageParams = z.object({ id: z.uuid("Not found"), imageId: z.uuid("Not found") });

export const updatePageSchema = z
    .object({
        title: z.string().trim().min(2, "Write a title.").max(150).optional(),
        summary: z.string().trim().min(10, "Write one or two lines (at least 10 characters).").max(300).optional(),
        bodyHtml: html.optional(),
        cover: imageInput.nullable().optional(),
        isPublished: z.boolean().optional(),
    })
    .refine((v) => Object.keys(v).length > 0, { message: "Nothing to update." });

const newsFields = {
    title: z.string().trim().min(3, "Write a title.").max(150),
    slug: slug.optional(),
    excerpt: z.string().trim().max(300).optional(),
    bodyHtml: html,
    cover: imageInput,
    /** null = draft; a future time = scheduled */
    publishedAt: z.iso.datetime({ offset: true, message: "Pick a date and time." }).nullable(),
    albumId: z.uuid().nullable().optional(),
};
export const createNewsSchema = z.object(newsFields);
export const updateNewsSchema = z
    .object(Object.fromEntries(Object.entries(newsFields).map(([k, s]) => [k, s.optional()])))
    .refine((v) => Object.keys(v).length > 0, { message: "Nothing to update." });

const albumFields = {
    title: z.string().trim().min(2, "Write a title.").max(150),
    slug: slug.optional(),
    description: z.string().trim().max(500).nullable().optional(),
    date: ymd.nullable().optional(),
    isPublished: z.boolean().optional(),
};
export const createAlbumSchema = z.object(albumFields);
export const updateAlbumSchema = z
    .object({ ...albumFields, title: albumFields.title.optional(), coverImageId: z.uuid().nullable().optional() })
    .refine((v) => Object.keys(v).length > 0, { message: "Nothing to update." });

export const addImagesSchema = z.object({
    images: z
        .array(imageInput.extend({ thumbPath: z.string().regex(STORED_PATH).nullish() }))
        .min(1)
        .max(50, "Up to 50 photos at a time."),
});
export const updateImageSchema = z.object({ alt: z.string().trim().max(200) });
export const reorderSchema = z.object({ ids: z.array(z.uuid()).min(1).max(1000) });

export const messageSchema = z
    .object({ read: z.boolean().optional(), replied: z.boolean().optional() })
    .refine((v) => Object.keys(v).length > 0, { message: "Nothing to update." });
