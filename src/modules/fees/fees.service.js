import { Prisma } from "@prisma/client";

import { prisma } from "#core/prisma.js";

/**
 * Fees module (full version in Step 4). For now only the read other modules need: what each student
 * still owes. Due per invoice = amount − discount − allocations of payments that were not reversed
 * (never below 0). Integer taka.
 */

/** @param {string[]} studentIds @returns {Promise<Map<string, number>>} studentId → due */
export async function duesForStudents(studentIds) {
    if (!studentIds.length) return new Map();
    const rows = await prisma.$queryRaw`
        WITH paid AS (
            SELECT a."invoiceId", SUM(a.amount)::int AS amount
            FROM "Allocation" a
            JOIN "Payment" p ON p.id = a."paymentId"
            LEFT JOIN "PaymentReversal" r ON r."paymentId" = p.id
            WHERE r.id IS NULL
            GROUP BY a."invoiceId"
        )
        SELECT e."studentId" AS "studentId",
               SUM(GREATEST(i.amount - i.discount - COALESCE(paid.amount, 0), 0))::int AS due
        FROM "Invoice" i
        JOIN "Enrollment" e ON e.id = i."enrollmentId"
        LEFT JOIN paid ON paid."invoiceId" = i.id
        WHERE e."studentId" IN (${Prisma.join(studentIds.map((id) => Prisma.sql`${id}::uuid`))})
        GROUP BY e."studentId"`;
    return new Map(rows.map((r) => [r.studentId, Number(r.due) || 0]));
}

/** Student ids with any due (for "Guardians with dues" SMS). */
export async function studentsWithDues() {
    const rows = await prisma.$queryRaw`
        WITH paid AS (
            SELECT a."invoiceId", SUM(a.amount)::int AS amount
            FROM "Allocation" a JOIN "Payment" p ON p.id = a."paymentId"
            LEFT JOIN "PaymentReversal" r ON r."paymentId" = p.id
            WHERE r.id IS NULL GROUP BY a."invoiceId"
        )
        SELECT e."studentId" AS "studentId", SUM(GREATEST(i.amount - i.discount - COALESCE(paid.amount, 0), 0))::int AS due
        FROM "Invoice" i JOIN "Enrollment" e ON e.id = i."enrollmentId"
        JOIN "Student" s ON s.id = e."studentId" AND s.status = 'ACTIVE'
        LEFT JOIN paid ON paid."invoiceId" = i.id
        GROUP BY e."studentId" HAVING SUM(GREATEST(i.amount - i.discount - COALESCE(paid.amount, 0), 0)) > 0`;
    return new Map(rows.map((r) => [r.studentId, Number(r.due)]));
}
