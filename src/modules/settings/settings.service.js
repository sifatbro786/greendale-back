import { prisma } from "#core/prisma.js";

/**
 * School settings (Setting table, key → JSON). Read often (cutoff, weekly off, id prefix), written
 * rarely, so values are cached per process for 30 s. The settings admin UI arrives with Step 5.
 */
const TTL_MS = 30_000;
/** @type {Map<string, { at: number, value: unknown }>} */
const cache = new Map();

/** @template T @param {string} key @param {T} fallback @returns {Promise<T>} */
export async function getSetting(key, fallback) {
    const hit = cache.get(key);
    if (hit && Date.now() - hit.at < TTL_MS) return /** @type {T} */ (hit.value ?? fallback);
    const row = await prisma.setting.findUnique({ where: { key } });
    const value = row?.value ?? null;
    cache.set(key, { at: Date.now(), value });
    return /** @type {T} */ (value ?? fallback);
}

export const weeklyOff = () => getSetting("attendance.weeklyOff", ["FRI", "SAT"]);
export const smsCutoff = () => getSetting("attendance.smsCutoff", "10:30");
export const studentUidPrefix = () => getSetting("ids.studentUidPrefix", "STU-");
export async function schoolName() {
    const p = await getSetting("school.profile", {});
    return p?.shortName || p?.name || "School";
}
