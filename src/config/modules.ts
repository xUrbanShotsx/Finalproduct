export type Industry = "construction" | "industrial" | "facilities" | "realestate";

export type ModuleKey =
  | "safety"
  | "people"
  | "operations"
  | "risk"
  | "compliance"
  | "governance"
  | "insights"
  | "training"
  | "blueprints"
  | "properties"
  | "policies"
  | "aml-ctf";

export type MobileAccess = "full" | "partial" | "read-only" | "none";

export interface SubModule {
  id: string;
  name: string;
  description: string;
  industries: Industry[] | "shared";
  mobileAccess: MobileAccess;
  offlineCapable: boolean;
}

export interface CoreModule {
  key: ModuleKey;
  name: string;
  icon: string;
  industries?: Industry[];
  subModules: SubModule[];
}

export const SAFETY_SUBMODULES: Partial<Record<Industry, SubModule[]>> = {
  construction: [
    {
      id: "incidents",
      name: "Incidents",
      description: "Report, investigate and close out injuries, near misses and property damage across facilities",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: true,
    },
    {
      id: "actions",
      name: "Actions",
      description: "Safety corrective and preventive actions with owner, priority and due date tracking",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: false,
    },
    {
      id: "toolbox",
      name: "Toolbox",
      description: "Safety briefings, shift communications and attendance sign-offs for facility teams",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: true,
    },
    {
      id: "prestart",
      name: "Prestart",
      description: "Pre-shift safety checks for facility equipment, plant rooms and common areas",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: true,
    },
    {
      id: "swms",
      name: "SWMS",
      description: "Safe Work Method Statements for high-risk construction work with sign-off and revision control",
      industries: ["construction"],
      mobileAccess: "partial",
      offlineCapable: true,
    },
    {
      id: "permits",
      name: "Permits",
      description: "Hot work, confined space, excavation and working at height permits raised before hazardous tasks",
      industries: ["construction"],
      mobileAccess: "full",
      offlineCapable: false,
    },
  ],
  industrial: [
    {
      id: "incidents",
      name: "Incidents",
      description: "Report, investigate and close out injuries, near misses and property damage across facilities",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: true,
    },
    {
      id: "actions",
      name: "Actions",
      description: "Safety corrective and preventive actions with owner, priority and due date tracking",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: false,
    },
    {
      id: "toolbox",
      name: "Toolbox",
      description: "Safety briefings, shift communications and attendance sign-offs for facility teams",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: true,
    },
    {
      id: "prestart",
      name: "Prestart",
      description: "Pre-shift safety checks for facility equipment, plant rooms and common areas",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: true,
    },
    {
      id: "permits-to-work",
      name: "Permits to Work",
      description: "Hot work, confined space, isolation and energy control permits raised before hazardous tasks",
      industries: ["industrial"],
      mobileAccess: "full",
      offlineCapable: false,
    },
    {
      id: "loto",
      name: "LOTO",
      description: "Lockout/tagout procedures applied at the point of work to isolate hazardous energy",
      industries: ["industrial"],
      mobileAccess: "full",
      offlineCapable: true,
    },
  ],
  facilities: [
    {
      id: "incidents",
      name: "Incidents",
      description: "Report, investigate and close out injuries, near misses and property damage across facilities",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: true,
    },
    {
      id: "actions",
      name: "Actions",
      description: "Safety corrective and preventive actions with owner, priority and due date tracking",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: false,
    },
    {
      id: "toolbox",
      name: "Toolbox",
      description: "Safety briefings, shift communications and attendance sign-offs for facility teams",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: true,
    },
    {
      id: "prestart",
      name: "Prestart",
      description: "Pre-shift safety checks for facility equipment, plant rooms and common areas",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: true,
    },
    {
      id: "permits",
      name: "Permits",
      description: "Hot work, confined space and access permits for maintenance and facilities work",
      industries: ["facilities"],
      mobileAccess: "full",
      offlineCapable: false,
    },
    {
      id: "hazardous-materials",
      name: "Hazardous Materials",
      description: "SDS register, chemical storage, handling procedures and spill response for facility chemicals",
      industries: ["facilities"],
      mobileAccess: "partial",
      offlineCapable: false,
    },
  ],
};

export const PEOPLE_SUBMODULES: Partial<Record<Industry, SubModule[]>> = {
  construction: [
    {
      id: "inductions",
      name: "Inductions",
      description: "Site, building and role-specific induction records for staff, contractors and visitors",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: true,
    },
    {
      id: "contractor-management",
      name: "Contractor Management",
      description: "Contractor onboarding, insurance verification and site access approvals",
      industries: "shared",
      mobileAccess: "partial",
      offlineCapable: false,
    },
    {
      id: "health-wellbeing",
      name: "Health & Wellbeing",
      description: "Wellness programs, mental health support and return-to-work coordination",
      industries: "shared",
      mobileAccess: "partial",
      offlineCapable: false,
    },
    {
      id: "return-to-work",
      name: "Return to Work",
      description: "Injury-based RTW plans, suitable duties and rehabilitation milestone tracking",
      industries: "shared",
      mobileAccess: "partial",
      offlineCapable: false,
    },
    {
      id: "training-matrix-register",
      name: "Training Matrix & Register",
      description: "Worker training records and an at-a-glance competency matrix across required courses",
      industries: ["construction"],
      mobileAccess: "full",
      offlineCapable: true,
    },
    {
      id: "fatigue-management",
      name: "Fatigue Management",
      description: "Hours of work monitoring and fatigue risk controls for long-shift and remote construction workers",
      industries: ["construction", "industrial"],
      mobileAccess: "partial",
      offlineCapable: false,
    },
  ],
  industrial: [
    {
      id: "inductions",
      name: "Inductions",
      description: "Site, building and role-specific induction records for staff, contractors and visitors",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: true,
    },
    {
      id: "contractor-management",
      name: "Contractor Management",
      description: "Contractor onboarding, insurance verification and site access approvals",
      industries: "shared",
      mobileAccess: "partial",
      offlineCapable: false,
    },
    {
      id: "health-wellbeing",
      name: "Health & Wellbeing",
      description: "Wellness programs, mental health support and return-to-work coordination",
      industries: "shared",
      mobileAccess: "partial",
      offlineCapable: false,
    },
    {
      id: "health-monitoring",
      name: "Health Monitoring",
      description: "Occupational exposure surveillance for noise, dust, fumes and biological agents",
      industries: ["industrial"],
      mobileAccess: "read-only",
      offlineCapable: false,
    },
    {
      id: "fatigue-management",
      name: "Fatigue Management",
      description: "Shift hour limits, fatigue assessments and roster compliance for plant operators",
      industries: ["construction", "industrial"],
      mobileAccess: "partial",
      offlineCapable: false,
    },
    {
      id: "return-to-work",
      name: "Return to Work",
      description: "Injury-based RTW plans, suitable duties and rehabilitation milestone tracking",
      industries: "shared",
      mobileAccess: "partial",
      offlineCapable: false,
    },
  ],
  facilities: [
    {
      id: "inductions",
      name: "Inductions",
      description: "Site, building and role-specific induction records for staff, contractors and visitors",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: true,
    },
    {
      id: "contractor-management",
      name: "Contractor Management",
      description: "Contractor onboarding, insurance verification and site access approvals",
      industries: "shared",
      mobileAccess: "partial",
      offlineCapable: false,
    },
    {
      id: "health-wellbeing",
      name: "Health & Wellbeing",
      description: "Wellness programs, mental health support and return-to-work coordination",
      industries: "shared",
      mobileAccess: "partial",
      offlineCapable: false,
    },
    {
      id: "warden-register",
      name: "Warden Register",
      description: "Emergency warden assignments, floor coverage and warden currency tracking",
      industries: ["facilities"],
      mobileAccess: "full",
      offlineCapable: false,
    },
    {
      id: "return-to-work",
      name: "Return to Work",
      description: "Injury-based RTW plans, suitable duties and rehabilitation milestone tracking",
      industries: "shared",
      mobileAccess: "partial",
      offlineCapable: false,
    },
    {
      id: "visitor-access",
      name: "Visitor & Access",
      description: "Visitor sign-in, access permissions and occupancy records across buildings",
      industries: ["facilities"],
      mobileAccess: "full",
      offlineCapable: true,
    },
  ],
};

export const OPERATIONS_SUBMODULES: Partial<Record<Industry, SubModule[]>> = {
  construction: [
    {
      id: "safe-work-procedures",
      name: "Safe Work Procedures",
      description: "Documented step-by-step procedures for routine facility tasks and maintenance work",
      industries: "shared",
      mobileAccess: "read-only",
      offlineCapable: false,
    },
    {
      id: "site-access-control",
      name: "Site Access Control",
      description: "Managing who can enter work areas, restricted zones and after-hours access safely",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: false,
    },
    {
      id: "plant-equipment",
      name: "Plant & Equipment",
      description: "Pre-op inspections, daily checks and defect logging for mobile plant and construction equipment",
      industries: ["construction"],
      mobileAccess: "full",
      offlineCapable: true,
    },
    {
      id: "work-zone",
      name: "Work Zone",
      description: "Traffic management plans, exclusion zones and work area separation controls on site",
      industries: ["construction"],
      mobileAccess: "full",
      offlineCapable: false,
    },
  ],
  industrial: [
    {
      id: "safe-work-procedures",
      name: "Safe Work Procedures",
      description: "Documented step-by-step procedures for routine facility tasks and maintenance work",
      industries: "shared",
      mobileAccess: "read-only",
      offlineCapable: false,
    },
    {
      id: "site-access-control",
      name: "Site Access Control",
      description: "Managing who can enter work areas, restricted zones and after-hours access safely",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: false,
    },
    {
      id: "emergency-procedures",
      name: "Emergency Procedures",
      description: "Evacuation plans, emergency response procedures and muster point records for buildings",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: true,
    },
    {
      id: "operational-readiness",
      name: "Operational Readiness",
      description: "Pre-task and pre-production safety readiness checks before commencing high-risk operations",
      industries: ["industrial"],
      mobileAccess: "full",
      offlineCapable: true,
    },
  ],
  facilities: [
    {
      id: "safe-work-procedures",
      name: "Safe Work Procedures",
      description: "Documented step-by-step procedures for routine facility tasks and maintenance work",
      industries: "shared",
      mobileAccess: "read-only",
      offlineCapable: false,
    },
    {
      id: "site-access-control",
      name: "Site Access Control",
      description: "Managing who can enter work areas, restricted zones and after-hours access safely",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: false,
    },
    {
      id: "emergency-procedures",
      name: "Emergency Procedures",
      description: "Evacuation plans, emergency response procedures and muster point records for buildings",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: true,
    },
    {
      id: "isolation-shutdown",
      name: "Isolation & Shutdown",
      description: "Safe isolation procedures for building systems during maintenance and service work",
      industries: ["facilities"],
      mobileAccess: "partial",
      offlineCapable: false,
    },
  ],
};

export const RISK_SUBMODULES: Partial<Record<Industry, SubModule[]>> = {
  construction: [
    {
      id: "hazard-register",
      name: "Hazard Register",
      description: "Identify, log and track ongoing hazards across building areas with control measures",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: true,
    },
    {
      id: "risk-assessments",
      name: "Risk Assessments",
      description: "Formal risk assessments using likelihood and consequence ratings with control hierarchies",
      industries: "shared",
      mobileAccess: "partial",
      offlineCapable: false,
    },
    {
      id: "emergency-response-plans",
      name: "Emergency Response Plans",
      description: "Documented ERPs for fire, medical, bomb threat and building-specific emergency scenarios",
      industries: "shared",
      mobileAccess: "read-only",
      offlineCapable: false,
    },
    {
      id: "critical-risk-controls",
      name: "Critical Risk Controls",
      description: "Track verification of life-critical controls such as fire suppression, exits and fall prevention",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: false,
    },
    {
      id: "hrcw",
      name: "High Risk Work",
      description: "Risk management specific to HRCW activities — heights, excavation, demolition and confined space",
      industries: ["construction"],
      mobileAccess: "partial",
      offlineCapable: false,
    },
    {
      id: "psychosocial-risk",
      name: "Psychosocial Risk",
      description: "Identify and manage psychosocial hazards including workload, isolation and mental health risks on site",
      industries: ["construction"],
      mobileAccess: "none",
      offlineCapable: false,
    },
  ],
  industrial: [
    {
      id: "hazard-register",
      name: "Hazard Register",
      description: "Identify, log and track ongoing hazards across building areas with control measures",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: true,
    },
    {
      id: "risk-assessments",
      name: "Risk Assessments",
      description: "Formal risk assessments using likelihood and consequence ratings with control hierarchies",
      industries: "shared",
      mobileAccess: "partial",
      offlineCapable: false,
    },
    {
      id: "emergency-response-plans",
      name: "Emergency Response Plans",
      description: "Documented ERPs for fire, medical, bomb threat and building-specific emergency scenarios",
      industries: "shared",
      mobileAccess: "read-only",
      offlineCapable: false,
    },
    {
      id: "critical-risk-controls",
      name: "Critical Risk Controls",
      description: "Track verification of life-critical controls such as fire suppression, exits and fall prevention",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: false,
    },
    {
      id: "jsa-jsea",
      name: "JSA / JSEA",
      description: "Job Safety Analysis for non-routine and high-risk tasks with step-by-step hazard controls",
      industries: ["industrial"],
      mobileAccess: "partial",
      offlineCapable: true,
    },
    {
      id: "chemical-process-risk",
      name: "Chemical & Process Risk",
      description: "Risk assessments for hazardous chemical handling, storage, reactions and process failure scenarios",
      industries: ["industrial"],
      mobileAccess: "read-only",
      offlineCapable: false,
    },
  ],
  facilities: [
    {
      id: "hazard-register",
      name: "Hazard Register",
      description: "Identify, log and track ongoing hazards across building areas with control measures",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: true,
    },
    {
      id: "risk-assessments",
      name: "Risk Assessments",
      description: "Formal risk assessments using likelihood and consequence ratings with control hierarchies",
      industries: "shared",
      mobileAccess: "partial",
      offlineCapable: false,
    },
    {
      id: "emergency-response-plans",
      name: "Emergency Response Plans",
      description: "Documented ERPs for fire, medical, bomb threat and building-specific emergency scenarios",
      industries: "shared",
      mobileAccess: "read-only",
      offlineCapable: false,
    },
    {
      id: "critical-risk-controls",
      name: "Critical Risk Controls",
      description: "Track verification of life-critical controls such as fire suppression, exits and fall prevention",
      industries: ["facilities"],
      mobileAccess: "full",
      offlineCapable: false,
    },
    {
      id: "slip-trip-fall",
      name: "Slip, Trip & Fall Risk",
      description: "Identify and control floor, stair, wet area and height-related fall risks across the facility",
      industries: ["facilities"],
      mobileAccess: "partial",
      offlineCapable: false,
    },
    {
      id: "psychosocial-risk",
      name: "Psychosocial Risk",
      description: "Identify and manage psychosocial hazards including workload, harassment and fatigue risks",
      industries: ["facilities"],
      mobileAccess: "none",
      offlineCapable: false,
    },
  ],
};

export const COMPLIANCE_SUBMODULES: Partial<Record<Industry, SubModule[]>> = {
  construction: [
    {
      id: "inspections-audits",
      name: "Inspections & Audits",
      description: "Scheduled compliance checks and audit trails",
      industries: "shared",
      mobileAccess: "partial",
      offlineCapable: false,
    },
    {
      id: "legislative-register",
      name: "Legislative Register",
      description: "Acts, Regs and Codes of Practice applicable to the organisation",
      industries: "shared",
      mobileAccess: "read-only",
      offlineCapable: false,
    },
    {
      id: "ppe-register",
      name: "PPE Register",
      description: "PPE issue, inspection and expiry records",
      industries: "shared",
      mobileAccess: "partial",
      offlineCapable: false,
    },
    {
      id: "regulator-notices",
      name: "Regulator Notices",
      description: "SafeWork improvement and prohibition notice register",
      industries: "shared",
      mobileAccess: "partial",
      offlineCapable: false,
    },
    {
      id: "hrcw-compliance",
      name: "HRCW Compliance",
      description: "Evidence records for high-risk construction work categories",
      industries: ["construction"],
      mobileAccess: "read-only",
      offlineCapable: false,
    },
    {
      id: "swms-register",
      name: "SWMS Register",
      description: "Repository of all SWMS documents with review dates",
      industries: ["construction"],
      mobileAccess: "read-only",
      offlineCapable: false,
    },
  ],
  industrial: [
    {
      id: "inspections-audits",
      name: "Inspections & Audits",
      description: "Scheduled compliance checks and audit trails",
      industries: "shared",
      mobileAccess: "partial",
      offlineCapable: false,
    },
    {
      id: "legislative-register",
      name: "Legislative Register",
      description: "Acts, Regs and Codes of Practice applicable to the organisation",
      industries: "shared",
      mobileAccess: "read-only",
      offlineCapable: false,
    },
    {
      id: "ppe-register",
      name: "PPE Register",
      description: "PPE issue, inspection and expiry records",
      industries: "shared",
      mobileAccess: "partial",
      offlineCapable: false,
    },
    {
      id: "regulator-notices",
      name: "Regulator Notices",
      description: "SafeWork improvement and prohibition notice register",
      industries: "shared",
      mobileAccess: "partial",
      offlineCapable: false,
    },
    {
      id: "hazardous-substances",
      name: "Hazardous Substances Register",
      description: "SDS register and chemical inventory under WHS Regulations",
      industries: ["industrial"],
      mobileAccess: "read-only",
      offlineCapable: false,
    },
    {
      id: "exposure-monitoring",
      name: "Exposure Monitoring",
      description: "Noise, dust and chemical exposure records against WES",
      industries: ["industrial"],
      mobileAccess: "read-only",
      offlineCapable: false,
    },
  ],
  facilities: [
    {
      id: "inspections-audits",
      name: "Inspections & Audits",
      description: "Scheduled compliance checks and audit trails",
      industries: "shared",
      mobileAccess: "partial",
      offlineCapable: false,
    },
    {
      id: "legislative-register",
      name: "Legislative Register",
      description: "Acts, Regs and Codes of Practice applicable to the organisation",
      industries: "shared",
      mobileAccess: "read-only",
      offlineCapable: false,
    },
    {
      id: "ppe-register",
      name: "PPE Register",
      description: "PPE issue, inspection and expiry records",
      industries: "shared",
      mobileAccess: "partial",
      offlineCapable: false,
    },
    {
      id: "regulator-notices",
      name: "Regulator Notices",
      description: "SafeWork improvement and prohibition notice register",
      industries: "shared",
      mobileAccess: "partial",
      offlineCapable: false,
    },
    {
      id: "essential-safety-measures",
      name: "Essential Safety Measures",
      description: "Fire systems and exit lighting annual compliance records",
      industries: ["facilities"],
      mobileAccess: "partial",
      offlineCapable: false,
    },
    {
      id: "statutory-obligations",
      name: "Statutory Obligations",
      description: "Occupancy certificates and statutory reporting obligations",
      industries: ["facilities"],
      mobileAccess: "read-only",
      offlineCapable: false,
    },
  ],
};

export const TRAINING_SUBMODULES: SubModule[] = [
  {
    id: "course-builder",
    name: "Course Builder",
    description: "Build and manage training courses, learning objectives and assessment criteria with AI-generated outlines.",
    industries: "shared",
    mobileAccess: "read-only",
    offlineCapable: false,
  },
  {
    id: "training-register",
    name: "Training Register",
    description: "Record and track completed training for all workers, contractors and visitors with expiry alerting.",
    industries: "shared",
    mobileAccess: "full",
    offlineCapable: false,
  },
  {
    id: "competency-licences",
    name: "Competency & Licences",
    description: "Track high risk work licences, White Cards, first aid certificates and competency currency for your workforce.",
    industries: "shared",
    mobileAccess: "full",
    offlineCapable: false,
  },
  {
    id: "induction-builder",
    name: "Induction Builder",
    description: "Build site and role-specific induction programs with AI-generated module content and digital sign-off.",
    industries: "shared",
    mobileAccess: "full",
    offlineCapable: false,
  },
  {
    id: "training-matrix",
    name: "Training Matrix",
    description: "At-a-glance compliance matrix showing each worker's current, expiring and missing competencies.",
    industries: "shared",
    mobileAccess: "read-only",
    offlineCapable: false,
  },
  {
    id: "certificates-records",
    name: "Certificates & Records",
    description: "Central register of all worker certificates and licences, banded by expiry status with renewal tracking.",
    industries: "shared",
    mobileAccess: "full",
    offlineCapable: false,
  },
];

export const INSIGHTS_SUBMODULES: SubModule[] = [
  {
    id: "whs-dashboard",
    name: "WHS Dashboard",
    description: "Live at-a-glance view of safety performance metrics",
    industries: "shared",
    mobileAccess: "full",
    offlineCapable: false,
  },
  {
    id: "incident-analytics",
    name: "Incident Analytics",
    description: "TRIFR, LTIFR and incident trend analysis",
    industries: "shared",
    mobileAccess: "read-only",
    offlineCapable: false,
  },
  {
    id: "compliance-reporting",
    name: "Compliance Reporting",
    description: "Periodic compliance reports for management and regulators",
    industries: "shared",
    mobileAccess: "read-only",
    offlineCapable: false,
  },
  {
    id: "leading-lagging",
    name: "Leading & Lagging Indicators",
    description: "Proactive vs reactive safety performance measurement",
    industries: "shared",
    mobileAccess: "read-only",
    offlineCapable: false,
  },
  {
    id: "overdue-alerts",
    name: "Overdue & Alerts",
    description: "Centralised overdue view across all modules",
    industries: "shared",
    mobileAccess: "full",
    offlineCapable: false,
  },
  {
    id: "custom-reports",
    name: "Custom Reports",
    description: "Flexible report builder for any stakeholder",
    industries: "shared",
    mobileAccess: "none",
    offlineCapable: false,
  },
];

export const PROPERTIES_SUBMODULES: SubModule[] = [
  {
    id: "listings",
    name: "Listings",
    description: "Active property listings, compliance status, new listing intake with AML/CTF and vendor ID checklist",
    industries: ["realestate"],
    mobileAccess: "full",
    offlineCapable: false,
  },
  {
    id: "appraisals",
    name: "Appraisals",
    description: "Property appraisal records, CMA reports and vendor pricing discussions",
    industries: ["realestate"],
    mobileAccess: "partial",
    offlineCapable: false,
  },
  {
    id: "pipeline",
    name: "Sales Pipeline",
    description: "Prospect tracking from appraisal to listing to settlement",
    industries: ["realestate"],
    mobileAccess: "full",
    offlineCapable: false,
  },
];

export const POLICIES_SUBMODULES: SubModule[] = [
  {
    id: "procedures",
    name: "Policies & Procedures",
    description: "Agency policies, compliance procedures, and professional standards documentation",
    industries: ["realestate"],
    mobileAccess: "read-only",
    offlineCapable: false,
  },
  {
    id: "licensing",
    name: "Licensing & CPD",
    description: "Licence renewals, Continuing Professional Development tracking and regulator submissions",
    industries: ["realestate"],
    mobileAccess: "full",
    offlineCapable: false,
  },
];

export const AML_CTF_SUBMODULES: SubModule[] = [
  {
    id: "cdd",
    name: "Customer Due Diligence",
    description: "Vendor identity verification records, beneficial owner identification, PEP and sanctions screening per transaction",
    industries: ["realestate"],
    mobileAccess: "full",
    offlineCapable: false,
  },
  {
    id: "risk-assessments",
    name: "Risk Assessments",
    description: "Transaction-level AML/CTF risk ratings — low, medium and high risk categorisation with documented rationale",
    industries: ["realestate"],
    mobileAccess: "partial",
    offlineCapable: false,
  },
  {
    id: "smr",
    name: "Suspicious Matter Reports",
    description: "AUSTRAC Suspicious Matter Report register — draft, submit and track SMR obligations with tipping-off controls",
    industries: ["realestate"],
    mobileAccess: "read-only",
    offlineCapable: false,
  },
  {
    id: "transaction-monitoring",
    name: "Transaction Monitoring",
    description: "Ongoing monitoring of property transactions for unusual patterns, structuring or high-risk indicators",
    industries: ["realestate"],
    mobileAccess: "partial",
    offlineCapable: false,
  },
  {
    id: "training",
    name: "AML Training Records",
    description: "Staff AML/CTF training completion records, assessment results and annual refresher tracking",
    industries: ["realestate"],
    mobileAccess: "full",
    offlineCapable: false,
  },
  {
    id: "austrac-reporting",
    name: "AUSTRAC Reporting",
    description: "Annual Compliance Reports, threshold transaction reports and AUSTRAC portal submission history",
    industries: ["realestate"],
    mobileAccess: "read-only",
    offlineCapable: false,
  },
];

export const RE_PEOPLE_SUBMODULES: SubModule[] = [
  {
    id: "clients",
    name: "Clients",
    description: "Vendor and buyer profiles, contact history and communication records",
    industries: ["realestate"],
    mobileAccess: "full",
    offlineCapable: false,
  },
  {
    id: "agents",
    name: "Agents & Staff",
    description: "Agent profiles, licences, commission splits and performance records",
    industries: ["realestate"],
    mobileAccess: "partial",
    offlineCapable: false,
  },
];

export const RE_RISK_SUBMODULES: SubModule[] = [
  {
    id: "risk-register",
    name: "Risk Register",
    description: "Agency risk register — regulatory, financial, reputational and operational risks",
    industries: ["realestate"],
    mobileAccess: "read-only",
    offlineCapable: false,
  },
  {
    id: "complaints",
    name: "Complaints",
    description: "Client complaint register, investigation records and regulator notifications",
    industries: ["realestate"],
    mobileAccess: "partial",
    offlineCapable: false,
  },
];

export const RE_COMPLIANCE_SUBMODULES: SubModule[] = [
  {
    id: "trust-accounting",
    name: "Trust Accounting",
    description: "Trust account register, receipts, disbursements and statutory audit trail",
    industries: ["realestate"],
    mobileAccess: "read-only",
    offlineCapable: false,
  },
  {
    id: "legislative-register",
    name: "Legislative Register",
    description: "Property law, agency legislation and real estate regulations applicable to the agency",
    industries: ["realestate"],
    mobileAccess: "read-only",
    offlineCapable: false,
  },
];

export const CORE_MODULES: Omit<CoreModule, "subModules">[] = [
  { key: "properties", name: "Properties",      icon: "Home",          industries: ["realestate"] },
  { key: "aml-ctf",   name: "AML / CTF",        icon: "ShieldAlert",   industries: ["realestate"] },
  { key: "policies",   name: "Policies",         icon: "FileText",      industries: ["realestate"] },
  { key: "safety",     name: "Safety",           icon: "Shield",        industries: ["construction", "industrial", "facilities"] },
  { key: "people",     name: "People",           icon: "Users" },
  { key: "operations", name: "Operations",       icon: "Settings",      industries: ["construction", "industrial", "facilities"] },
  { key: "risk",       name: "Risk Management",  icon: "AlertTriangle" },
  { key: "compliance", name: "Compliance",       icon: "CheckSquare" },
  { key: "governance", name: "Governance",       icon: "Building2",     industries: ["construction", "industrial", "facilities"] },
  { key: "insights",   name: "Insights",         icon: "BarChart3" },
  { key: "training",   name: "Training",         icon: "GraduationCap" },
  { key: "blueprints", name: "Blueprints",       icon: "Map" },
];

export function getSubModules(module: ModuleKey, industry: Industry): SubModule[] {
  switch (module) {
    case "properties": return industry === "realestate" ? PROPERTIES_SUBMODULES : [];
    case "aml-ctf":   return industry === "realestate" ? AML_CTF_SUBMODULES : [];
    case "policies":   return industry === "realestate" ? POLICIES_SUBMODULES : [];
    case "safety":     return SAFETY_SUBMODULES[industry as "construction" | "industrial" | "facilities"] ?? [];
    case "people":     return industry === "realestate" ? RE_PEOPLE_SUBMODULES : PEOPLE_SUBMODULES[industry as "construction" | "industrial" | "facilities"] ?? [];
    case "operations": return OPERATIONS_SUBMODULES[industry as "construction" | "industrial" | "facilities"] ?? [];
    case "risk":       return industry === "realestate" ? RE_RISK_SUBMODULES : RISK_SUBMODULES[industry as "construction" | "industrial" | "facilities"] ?? [];
    case "compliance": return industry === "realestate" ? RE_COMPLIANCE_SUBMODULES : COMPLIANCE_SUBMODULES[industry as "construction" | "industrial" | "facilities"] ?? [];
    case "insights":   return INSIGHTS_SUBMODULES;
    case "training":   return TRAINING_SUBMODULES;
    default:           return [];
  }
}
