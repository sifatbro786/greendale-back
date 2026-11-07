import { z } from "zod";

import { normalizeBdPhone } from "#core/phone.js";

const nullable = (schema) => z.preprocess((v) => (v === "" ? null : v), schema.nullable()).optional();
const ymd = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use a date.");
const phone = (msg) =>
    z
        .string()
        .trim()
        .transform((v, ctx) => {
            const p = normalizeBdPhone(v);
            if (!p) ctx.addIssue({ code: "custom", message: msg });
            return p ?? v;
        });

export const idParams = z.object({ id: z.uuid("Not found") });

export const listQuery = z.object({
    sectionId: z.uuid().optional(),
    q: z.string().trim().max(80).optional(),
    status: z.enum(["ACTIVE", "INACTIVE", "TRANSFERRED", "GRADUATED", "all"]).default("ACTIVE"),
});

const profile = {
    name: z.string().trim().min(2, "Write the student's name.").max(80),
    dob: z.string("Give the date of birth.").regex(/^\d{4}-\d{2}-\d{2}$/, "Give the date of birth."),
    gender: z.enum(["MALE", "FEMALE"], "Choose boy or girl."),
    bloodGroup: nullable(z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])),
    fatherName: nullable(z.string().trim().max(80)),
    motherName: nullable(z.string().trim().max(80)),
    guardianName: nullable(z.string().trim().max(80)),
    guardianPhone: phone("Give the guardian's mobile number (01XXXXXXXXX)."),
    guardianPhone2: nullable(phone("Use a Bangladeshi mobile number.")),
    guardianEmail: nullable(z.email("This email address does not look right.").trim().toLowerCase().max(120)),
    address: nullable(z.string().trim().max(300)),
    admissionDate: nullable(ymd),
};

export const createStudentSchema = z.object({
    ...profile,
    sectionId: z.uuid("Choose a class."),
    /** Empty → next free roll in the section */
    roll: z.number().int().min(1).max(999).nullish(),
});

export const updateStudentSchema = z
    .object({
        ...Object.fromEntries(Object.entries(profile).map(([k, v]) => [k, v.optional()])),
        status: z.enum(["ACTIVE", "INACTIVE", "TRANSFERRED", "GRADUATED"]).optional(),
        /** Current-session placement */
        sectionId: z.uuid().optional(),
        roll: z.number().int().min(1).max(999).optional(),
    })
    .refine((v) => Object.keys(v).length > 0, { message: "Nothing to update." });

export const promoteSchema = z.object({
    fromSectionId: z.uuid(),
    toSessionId: z.uuid("Choose the new session."),
    toSectionId: z.uuid("Choose the new class."),
    studentIds: z.array(z.uuid()).min(1, "Pick at least one student.").max(200),
    /** keep = same roll numbers; name = 1, 2, 3 … by name */
    rollMode: z.enum(["keep", "name"]).default("keep"),
});
