/**
 * School-specific bootstrap data (Greendale). For the next school, replace this file and /content;
 * no code changes. Everything here is create-if-missing: edits made in the admin panel are never overwritten.
 */

export const SESSION = { name: "2026", startDate: "2026-01-01", endDate: "2026-12-31" };

/** Sections created for every class. */
export const SECTIONS = ["A"];

// TODO(school): confirm subject lists per stage.
export const SUBJECTS = {
    EARLY: ["English", "Bangla", "Mathematics", "Rhymes & Drawing", "Arabic"],
    PRIMARY: ["English 1st Paper", "English 2nd Paper", "Bangla", "Mathematics", "Science", "Bangladesh & Global Studies", "Religion", "Arabic"],
};

/** Bangladesh primary GPA scale. Lookup: highest minPercent <= percent. */
export const GRADE_SCALE = [
    { minPercent: 80, maxPercent: 100, grade: "A+", point: 5.0 },
    { minPercent: 70, maxPercent: 79, grade: "A", point: 4.0 },
    { minPercent: 60, maxPercent: 69, grade: "A-", point: 3.5 },
    { minPercent: 50, maxPercent: 59, grade: "B", point: 3.0 },
    { minPercent: 40, maxPercent: 49, grade: "C", point: 2.0 },
    { minPercent: 33, maxPercent: 39, grade: "D", point: 1.0 },
    { minPercent: 0, maxPercent: 32, grade: "F", point: 0.0 },
];

export const FEE_HEADS = [
    { code: "admission", name: "Admission Fee", type: "ONE_TIME", order: 1 },
    { code: "session", name: "Session Fee", type: "ONE_TIME", order: 2 },
    { code: "tuition", name: "Monthly Tuition", type: "MONTHLY", order: 3 },
    { code: "exam", name: "Exam Fee", type: "ONE_TIME", order: 4 },
];

// TODO(school): confirm period timings.
export const PERIODS = [
    { number: 1, startTime: "08:00", endTime: "08:40" },
    { number: 2, startTime: "08:40", endTime: "09:20" },
    { number: 3, startTime: "09:20", endTime: "10:00" },
    { number: 4, startTime: "10:20", endTime: "11:00" },
    { number: 5, startTime: "11:00", endTime: "11:40" },
    { number: 6, startTime: "11:40", endTime: "12:20" },
];

export const SMS_TEMPLATES = [
    { code: "absent", name: "Absent alert", type: "ABSENT", body: "Dear guardian, {student_name} (Roll {roll}, {class}) was absent today, {date}. - Greendale School" },
    { code: "fee_due", name: "Fee due reminder", type: "FEE_DUE", body: "Dear guardian, {student_name}'s fees of Tk {due_amount} are due. Please pay by {due_date}. - Greendale School" },
    { code: "result", name: "Result published", type: "RESULT", body: "{student_name}'s {exam} result is published. GPA {gpa}. Login: portal. - Greendale School" },
    { code: "holiday_bn", name: "Holiday notice (Bangla)", type: "CUSTOM", body: "প্রিয় অভিভাবক, আগামীকাল স্কুল বন্ধ থাকবে। - গ্রিনডেল স্কুল" },
];

/** Setting rows (key → value json). */
export const SETTINGS = {
    "school.profile": {
        name: "Greendale English Version School",
        shortName: "Greendale",
        eiin: "484897",
        established: 2024,
        contact: {
            phone: "+880 1720-836744",
            whatsapp: "+880 1720-836744",
            email: "",
            addressLines: ["Commerce Coaching Home, 27 C/A, 1st Colony", "Mirpur, Dhaka 1216, Bangladesh"],
            addressShort: "27 C/A, 1st Colony, Mirpur, Dhaka 1216",
            geo: { lat: 23.787649764369, lng: 90.345936566591 },
            officeHours: "",
        },
        social: {
            facebook: "https://www.facebook.com/greendaleenglishversionschool",
            youtube: "https://www.youtube.com/@greendaleenglishversionschool",
        },
    },
    "modules.enabled": ["cms", "students", "results", "attendance", "routine", "cards", "fees", "sms", "portal"],
    "ids.studentUidPrefix": "GEVS-",
    "fees.receiptPrefix": "GEVS",
    "attendance.weeklyOff": ["FRI", "SAT"],
    "attendance.smsCutoff": "10:30",
    /** Position tie break after total: "roll" or "name" */
    "results.tieBreak": "roll",
    /** Skip admit cards for students with dues above this (taka). null = off */
    "cards.admitDueLimit": null,
};
