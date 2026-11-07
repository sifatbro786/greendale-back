import { UnrecoverableError } from "bullmq";

import { env } from "#config/env.js";

export const systemProcessors = {
    /** Health ping used by `npm run check:queue`. @param {import("bullmq").Job<{ sentAt: string }>} job */
    "system.ping": async (job) => ({ pong: true, sentAt: job.data.sentAt, processedAt: new Date().toISOString(), pid: process.pid }),

    /**
     * POST <WEB_INTERNAL_URL>/internal/revalidate { tags } with the shared secret (greendale-front app/internal/revalidate).
     * @param {import("bullmq").Job<{ tags: string[] }>} job
     */
    "web.revalidate": async (job) => {
        if (!env.REVALIDATE_SECRET) throw new UnrecoverableError("REVALIDATE_SECRET is not set");
        const res = await fetch(`${env.WEB_INTERNAL_URL}/internal/revalidate`, {
            method: "POST",
            headers: { "content-type": "application/json", "x-revalidate-secret": env.REVALIDATE_SECRET },
            body: JSON.stringify({ tags: job.data.tags }),
            signal: AbortSignal.timeout(5_000),
        });
        if (res.status === 401) throw new UnrecoverableError("Next rejected the revalidate secret (check both .env files)");
        if (!res.ok) throw new Error(`revalidate failed: HTTP ${res.status}`);
        return { tags: job.data.tags };
    },
};
