/* ============================================================
   SEED DATA — the plan itself.
   Edit this file to change the plan. Your checkmarks, notes and
   figures are stored separately in your browser, so editing here
   will not wipe your progress (as long as ids stay the same).
   ============================================================ */

const STUDY_START = "2026-08-17"; // Observation Day 1

const PHASES = [
  { id: "p1", label: "Application",     from: 2026, to: 2027, note: "Certificate application and departure" },
  { id: "p2", label: "Certificate",     from: 2027, to: 2028, note: "Mohawk Graduate Certificate, Digital Health" },
  { id: "p3", label: "Master's",        from: 2028, to: 2030, note: "MHSc / MHI — qualifies for Assistant Lecturer" },
  { id: "p4", label: "Work & research", from: 2030, to: 2032, note: "Income, publications, PhD funding case" },
  { id: "p5", label: "Doctorate",       from: 2032, to: 2036, note: "PhD — unlocks the Lecturer rank" }
];

/* ---------- TRACK 1: CREDENTIALS LADDER ---------- */
const MILESTONES = [
  { id: "m01", phase: "p1", target: "2026-11-30", title: "Submit the Mohawk application", detail: "OCAS International portal, Program 594, January 2027 intake. Hard deadline." },
  { id: "m02", phase: "p1", target: "2026-12-31", title: "Admission decision received", detail: "Follow up with Mohawk admissions if nothing lands within four weeks of submitting." },
  { id: "m03", phase: "p1", target: "2027-01-15", title: "Study permit secured", detail: "Requires the letter of acceptance, proof of funds, and biometrics. Start the day the offer arrives." },
  { id: "m04", phase: "p1", target: "2027-01-31", title: "Arrive in Canada", detail: "Fennell Campus, Hamilton, Ontario." },

  { id: "m05", phase: "p2", target: "2027-05-31", title: "Semester 1 complete, GPA on target", detail: "This is the GPA recovery lever. Grades here matter more than anywhere else in the plan." },
  { id: "m06", phase: "p2", target: "2027-12-31", title: "Semester 2 complete", detail: "Certificate requirements finished." },
  { id: "m07", phase: "p2", target: "2028-01-31", title: "Graduate Certificate awarded", detail: "Digital Health, Mohawk College." },
  { id: "m08", phase: "p2", target: "2028-03-31", title: "Post-graduation work permit in hand", detail: "Apply before the study permit expires." },

  { id: "m09", phase: "p3", target: "2028-02-28", title: "Master's shortlist finalised", detail: "Western MHSc Global Health Systems (primary), U of T MHI (reach), Waterloo MHI, UVic MSc HIS." },
  { id: "m10", phase: "p3", target: "2028-04-30", title: "Master's applications submitted", detail: "Certificate transcript is the centrepiece of these applications." },
  { id: "m11", phase: "p3", target: "2028-08-31", title: "Offer accepted, enrolment confirmed", detail: "" },
  { id: "m12", phase: "p3", target: "2029-06-30", title: "Master's Year 1 complete", detail: "" },
  { id: "m13", phase: "p3", target: "2030-06-30", title: "Master's awarded", detail: "Qualifies for Assistant Lecturer roles in Rwanda. First point at which teaching becomes realistic." },

  { id: "m14", phase: "p4", target: "2030-09-30", title: "Digital health role secured", detail: "Income stability plus material to write from." },
  { id: "m15", phase: "p4", target: "2031-03-31", title: "First manuscript submitted", detail: "Any peer-reviewed venue. Submission is the milestone, not acceptance." },
  { id: "m16", phase: "p4", target: "2031-06-30", title: "First conference presentation", detail: "Regional or continental. Africa Health Agenda, HELINA, or similar." },
  { id: "m17", phase: "p4", target: "2031-09-30", title: "Adjunct or guest teaching engagement", detail: "UGHE or UR. The first real entry into the academy." },
  { id: "m18", phase: "p4", target: "2031-12-31", title: "PhD supervisors contacted", detail: "Three to five, with a one-page research statement each." },
  { id: "m19", phase: "p4", target: "2032-03-31", title: "PhD funding applications submitted", detail: "Funding decides the destination. Apply broadly across Canada, the US, and Africa." },

  { id: "m20", phase: "p5", target: "2032-09-30", title: "PhD enrolment", detail: "" },
  { id: "m21", phase: "p5", target: "2034-06-30", title: "Comprehensive exams passed", detail: "" },
  { id: "m22", phase: "p5", target: "2035-06-30", title: "Fieldwork complete", detail: "Rwanda-based, if the programme allows it." },
  { id: "m23", phase: "p5", target: "2036-06-30", title: "Dissertation defended", detail: "" },
  { id: "m24", phase: "p5", target: "2036-09-30", title: "PhD awarded — Lecturer rank", detail: "Promotion from Assistant Lecturer to Lecturer is automatic on the doctorate under Rwanda's framework." }
];

/* ---------- TRACK 2-5: THE OTHER FOUR TRACKS ---------- */
const TRACKS = [
  { id: "t1", name: "Credentials",           status: "active",  desc: "Degrees and academic rank. Currently the load-bearing track." },
  { id: "t2", name: "Scholarly voice",       status: "active",  desc: "Reading, writing, publishing. Starts as a weekly paragraph, ends as a citation record." },
  { id: "t3", name: "Institutional presence",status: "later",   desc: "Teaching, mentees, university affiliation. Opens once the Master's is in hand." },
  { id: "t4", name: "Visibility",            status: "later",   desc: "Policy engagement, conferences, national and continental recognition." },
  { id: "t5", name: "Flagship contribution", status: "dormant", desc: "UbuzimaCard, or whatever replaces it. Deliberately parked until the e-Ubuzima knowledge gap is closed." }
];

/* ---------- STUDY CURRICULUM ---------- */
const CURRICULUM = [
  {
    id: "mo1", month: "Month 1", window: "Aug – Sep 2026",
    theme: "Digital health and informatics foundations",
    weeks: [
      { id: "w1", label: "Week 1", focus: "WHO strategy, interoperability, HL7, FHIR",
        days: [
          "WHO Global Strategy on Digital Health — executive summary and objective 1",
          "WHO Global Strategy — objectives 2 to 4",
          "Health data interoperability: what it is and why it matters",
          "The HL7 standard: core concepts",
          "FHIR core concepts, then the week 1 synthesis"
        ] },
      { id: "w2", label: "Week 2", focus: "Rwanda's own infrastructure",
        days: [
          "HL7 and FHIR in practice: an EHR case study",
          "Rwanda's e-Ubuzima system: architecture overview",
          "Rwanda Health Information Exchange (RHIE)",
          "Comparative case: Rwanda against a peer African system",
          "Week 2 synthesis: where Rwanda actually stands"
        ] },
      { id: "w3", label: "Week 3", focus: "Global case studies", days: [] },
      { id: "w4", label: "Week 4", focus: "Data and technical foundations", days: [] }
    ]
  },
  { id: "mo2", month: "Month 2", window: "Sep – Oct 2026", theme: "Research methods and academic writing", weeks: [] },
  { id: "mo3", month: "Month 3", window: "Oct – Nov 2026", theme: "Rwanda and Africa digital health policy — and the Mohawk deadline", weeks: [] },
  { id: "mo4", month: "Month 4", window: "Nov – Dec 2026", theme: "Data handling: spreadsheets, SQL, Python for health data", weeks: [] },
  { id: "mo5", month: "Month 5", window: "Dec 2026 – Jan 2027", theme: "Global case studies: Estonia, India, Kenya", weeks: [] },
  { id: "mo6", month: "Month 6", window: "Jan 2027", theme: "Mohawk coursework begins — establish the rhythm inside formal structure", weeks: [] }
];

/* ---------- FINANCIAL PLAN ----------
   Every figure below is a rough placeholder, not a quote.
   Verify each one with the institution or lender before relying on it.
   Amounts are entered in CAD and converted for display.            */

const FIN_COSTS = [
  { id: "c01", phase: "p1", label: "OCAS application fees",              cad: 250,   status: "estimate" },
  { id: "c02", phase: "p1", label: "Study permit and biometrics",         cad: 235,   status: "estimate" },
  { id: "c03", phase: "p1", label: "Flights to Canada",                   cad: 1600,  status: "estimate" },
  { id: "c04", phase: "p1", label: "Initial settlement costs",            cad: 3000,  status: "estimate" },
  { id: "c05", phase: "p2", label: "Mohawk tuition, international",       cad: 18000, status: "verify" },
  { id: "c06", phase: "p2", label: "Living costs, Hamilton, 12 months",   cad: 17000, status: "estimate" },
  { id: "c07", phase: "p2", label: "Proof of funds / GIC",                cad: 20635, status: "verify" },
  { id: "c08", phase: "p3", label: "Master's tuition, year 1",            cad: 35000, status: "verify" },
  { id: "c09", phase: "p3", label: "Master's tuition, year 2",            cad: 35000, status: "verify" },
  { id: "c10", phase: "p3", label: "Living costs during Master's",        cad: 34000, status: "estimate" },
  { id: "c11", phase: "p5", label: "PhD — assume funded, net cost nil",   cad: 0,     status: "assumption" }
];

const FIN_FUNDING = [
  { id: "f01", label: "Mastercard Foundation Scholars Program", target: "Certificate / Master's", odds: "medium", status: "not started" },
  { id: "f02", label: "Ontario Graduate Scholarship",           target: "Master's",               odds: "medium", status: "not started" },
  { id: "f03", label: "Institutional entrance awards",          target: "Certificate / Master's", odds: "medium", status: "not started" },
  { id: "f04", label: "Graduate teaching or research assistantship", target: "Master's / PhD",    odds: "high",   status: "not started" },
  { id: "f05", label: "Fully funded PhD position",              target: "PhD",                    odds: "high",   status: "not started" },
  { id: "f06", label: "Employer or ministry sponsorship",       target: "Any phase",              odds: "low",    status: "not started" }
];

const FIN_INCOME = [
  { id: "i01", phase: "p1", label: "Rinda Ubuzima salary",              note: "Current position, Kigali" },
  { id: "i02", phase: "p2", label: "On-campus / part-time work",        note: "Study permit typically allows limited hours — confirm current rules" },
  { id: "i03", phase: "p3", label: "Assistantship or part-time work",   note: "" },
  { id: "i04", phase: "p4", label: "Full-time digital health role",     note: "The savings engine for the PhD years" },
  { id: "i05", phase: "p5", label: "PhD stipend",                       note: "If funded" }
];
