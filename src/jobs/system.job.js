/** Health ping used by `npm run check:queue`. */
export const systemProcessors = {
    /** @param {import("bullmq").Job<{ sentAt: string }>} job */
    "system.ping": async (job) => ({ pong: true, sentAt: job.data.sentAt, processedAt: new Date().toISOString(), pid: process.pid }),
};
