export type Industry = "construction" | "industrial" | "facilities";

export type ModuleKey =
  | "safety"
  | "people"
  | "operations"
  | "risk"
  | "compliance"
  | "governance"
  | "insights"
  | "training"
  | "blueprints";

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
  subModules: SubModule[];
}

export const SAFETY_SUBMODULES: Record<Industry, SubModule[]> = {
  construction: [
    {
      id: "incidents",
      name: "Incidents",
      description: "Report, investigate and close out incidents",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: true,
    },
    {
      id: "swms",
      name: "SWMS",
      description: "Safe Work Method Statements for high-risk construction work",
      industries: ["construction"],
      mobileAccess: "partial",
      offlineCapable: true,
    },
    {
      id: "permits",
      name: "Permits",
      description: "Work permits for excavation, heights and confined spaces",
      industries: ["construction"],
      mobileAccess: "full",
      offlineCapable: false,
    },
    {
      id: "prestart",
      name: "Prestart",
      description: "Daily prestart safety checklists",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: true,
    },
    {
      id: "toolbox",
      name: "Toolbox",
      description: "Toolbox talks and briefing records",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: true,
    },
    {
      id: "actions",
      name: "Actions",
      description: "Corrective and preventive actions",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: false,
    },
  ],
  industrial: [
    {
      id: "incidents",
      name: "Incidents",
      description: "Report, investigate and close out incidents",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: true,
    },
    {
      id: "permits-to-work",
      name: "Permits to Work",
      description: "Hot work, isolation, confined space and energy control permits",
      industries: ["industrial"],
      mobileAccess: "full",
      offlineCapable: false,
    },
    {
      id: "loto",
      name: "LOTO",
      description: "Lockout/Tagout procedures for energy control",
      industries: ["industrial"],
      mobileAccess: "full",
      offlineCapable: true,
    },
    {
      id: "prestart",
      name: "Prestart",
      description: "Shift prestart safety checklists",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: true,
    },
    {
      id: "toolbox",
      name: "Toolbox",
      description: "Toolbox talks and briefing records",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: true,
    },
    {
      id: "actions",
      name: "Actions",
      description: "Corrective and preventive actions",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: false,
    },
  ],
  facilities: [
    {
      id: "incidents",
      name: "Incidents",
      description: "Report, investigate and close out incidents",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: true,
    },
    {
      id: "hazardous-materials",
      name: "Hazardous Materials",
      description: "SDS register and chemical handling compliance",
      industries: ["facilities"],
      mobileAccess: "partial",
      offlineCapable: false,
    },
    {
      id: "prestart",
      name: "Prestart",
      description: "Daily prestart safety checklists",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: true,
    },
    {
      id: "toolbox",
      name: "Toolbox",
      description: "Toolbox talks and briefing records",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: true,
    },
    {
      id: "actions",
      name: "Actions",
      description: "Corrective and preventive actions",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: false,
    },
    {
      id: "ppe-register",
      name: "PPE Register",
      description: "Issue, inspect and track PPE expiry",
      industries: ["facilities"],
      mobileAccess: "partial",
      offlineCapable: false,
    },
  ],
};

export const PEOPLE_SUBMODULES: Record<Industry, SubModule[]> = {
  construction: [
    {
      id: "inductions",
      name: "Inductions",
      description: "Site induction records and access clearance",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: true,
    },
    {
      id: "white-card",
      name: "White Card Register",
      description: "Construction Induction Card verification and records",
      industries: ["construction"],
      mobileAccess: "full",
      offlineCapable: true,
    },
    {
      id: "contractor-management",
      name: "Contractor Management",
      description: "Contractor prequalification, licences and insurance",
      industries: "shared",
      mobileAccess: "partial",
      offlineCapable: false,
    },
    {
      id: "health-wellbeing",
      name: "Health & Wellbeing",
      description: "Worker wellness checks and support programs",
      industries: "shared",
      mobileAccess: "partial",
      offlineCapable: false,
    },
    {
      id: "return-to-work",
      name: "Return to Work",
      description: "RTW plans and milestone tracking",
      industries: "shared",
      mobileAccess: "partial",
      offlineCapable: false,
    },
    {
      id: "fatigue-management",
      name: "Fatigue Management",
      description: "Hours logging and fatigue risk for shift workers",
      industries: ["construction", "industrial"],
      mobileAccess: "partial",
      offlineCapable: false,
    },
  ],
  industrial: [
    {
      id: "inductions",
      name: "Inductions",
      description: "Site induction records and access clearance",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: true,
    },
    {
      id: "health-monitoring",
      name: "Health Monitoring",
      description: "Occupational exposure surveillance for noise, dust and fumes",
      industries: ["industrial"],
      mobileAccess: "read-only",
      offlineCapable: false,
    },
    {
      id: "contractor-management",
      name: "Contractor Management",
      description: "Contractor prequalification, licences and insurance",
      industries: "shared",
      mobileAccess: "partial",
      offlineCapable: false,
    },
    {
      id: "health-wellbeing",
      name: "Health & Wellbeing",
      description: "Worker wellness checks and support programs",
      industries: "shared",
      mobileAccess: "partial",
      offlineCapable: false,
    },
    {
      id: "return-to-work",
      name: "Return to Work",
      description: "RTW plans and milestone tracking",
      industries: "shared",
      mobileAccess: "partial",
      offlineCapable: false,
    },
    {
      id: "fatigue-management",
      name: "Fatigue Management",
      description: "Hours logging and fatigue risk for shift workers",
      industries: ["construction", "industrial"],
      mobileAccess: "partial",
      offlineCapable: false,
    },
  ],
  facilities: [
    {
      id: "inductions",
      name: "Inductions",
      description: "Site induction records and access clearance",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: true,
    },
    {
      id: "warden-register",
      name: "Warden Register",
      description: "Building warden assignments and currency tracking",
      industries: ["facilities"],
      mobileAccess: "full",
      offlineCapable: false,
    },
    {
      id: "visitor-access",
      name: "Visitor & Access Management",
      description: "Visitor sign-in and site access control",
      industries: ["facilities"],
      mobileAccess: "full",
      offlineCapable: true,
    },
    {
      id: "contractor-management",
      name: "Contractor Management",
      description: "Contractor prequalification, licences and insurance",
      industries: "shared",
      mobileAccess: "partial",
      offlineCapable: false,
    },
    {
      id: "health-wellbeing",
      name: "Health & Wellbeing",
      description: "Worker wellness checks and support programs",
      industries: "shared",
      mobileAccess: "partial",
      offlineCapable: false,
    },
    {
      id: "return-to-work",
      name: "Return to Work",
      description: "RTW plans and milestone tracking",
      industries: "shared",
      mobileAccess: "partial",
      offlineCapable: false,
    },
  ],
};

export const OPERATIONS_SUBMODULES: Record<Industry, SubModule[]> = {
  construction: [
    {
      id: "safe-work-procedures",
      name: "Safe Work Procedures",
      description: "Documented procedures for performing work safely",
      industries: "shared",
      mobileAccess: "read-only",
      offlineCapable: false,
    },
    {
      id: "site-access-control",
      name: "Site Access Control",
      description: "Control who enters what areas on site",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: false,
    },
    {
      id: "work-planning",
      name: "Work Planning",
      description: "Coordinate tasks with safety controls before work starts",
      industries: "shared",
      mobileAccess: "read-only",
      offlineCapable: false,
    },
    {
      id: "defect-reporting",
      name: "Defect Reporting",
      description: "Identify and ground unsafe equipment",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: true,
    },
    {
      id: "emergency-procedures",
      name: "Emergency Procedures",
      description: "Live site emergency response procedures",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: true,
    },
    {
      id: "plant-equipment",
      name: "Plant & Equipment",
      description: "Pre-op inspections and defect logging for mobile plant",
      industries: ["construction"],
      mobileAccess: "full",
      offlineCapable: true,
    },
  ],
  industrial: [
    {
      id: "safe-work-procedures",
      name: "Safe Work Procedures",
      description: "Documented procedures for performing work safely",
      industries: "shared",
      mobileAccess: "read-only",
      offlineCapable: false,
    },
    {
      id: "site-access-control",
      name: "Site Access Control",
      description: "Control who enters what areas on site",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: false,
    },
    {
      id: "work-planning",
      name: "Work Planning",
      description: "Coordinate tasks with safety controls before work starts",
      industries: "shared",
      mobileAccess: "read-only",
      offlineCapable: false,
    },
    {
      id: "defect-reporting",
      name: "Defect Reporting",
      description: "Identify and ground unsafe equipment",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: true,
    },
    {
      id: "emergency-procedures",
      name: "Emergency Procedures",
      description: "Live site emergency response procedures",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: true,
    },
    {
      id: "operational-readiness",
      name: "Operational Readiness",
      description: "Pre-production and pre-task safety readiness checks",
      industries: ["industrial"],
      mobileAccess: "full",
      offlineCapable: true,
    },
  ],
  facilities: [
    {
      id: "safe-work-procedures",
      name: "Safe Work Procedures",
      description: "Documented procedures for performing work safely",
      industries: "shared",
      mobileAccess: "read-only",
      offlineCapable: false,
    },
    {
      id: "site-access-control",
      name: "Site Access Control",
      description: "Control who enters what areas on site",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: false,
    },
    {
      id: "work-planning",
      name: "Work Planning",
      description: "Coordinate tasks with safety controls before work starts",
      industries: "shared",
      mobileAccess: "read-only",
      offlineCapable: false,
    },
    {
      id: "defect-reporting",
      name: "Defect Reporting",
      description: "Identify and ground unsafe equipment",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: true,
    },
    {
      id: "emergency-procedures",
      name: "Emergency Procedures",
      description: "Live site emergency response procedures",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: true,
    },
    {
      id: "isolation-shutdown",
      name: "Isolation & Shutdown",
      description: "Safe isolation of building systems during maintenance",
      industries: ["facilities"],
      mobileAccess: "partial",
      offlineCapable: false,
    },
  ],
};

export const RISK_SUBMODULES: Record<Industry, SubModule[]> = {
  construction: [
    {
      id: "hazard-register",
      name: "Hazard Register",
      description: "Identify, record and control workplace hazards",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: true,
    },
    {
      id: "risk-assessments",
      name: "Risk Assessments",
      description: "Formal likelihood/consequence assessments with hierarchy of controls",
      industries: "shared",
      mobileAccess: "partial",
      offlineCapable: false,
    },
    {
      id: "emergency-response-plans",
      name: "Emergency Response Plans",
      description: "Planning and documentation of emergency responses",
      industries: "shared",
      mobileAccess: "read-only",
      offlineCapable: false,
    },
    {
      id: "critical-risk-controls",
      name: "Critical Risk Controls",
      description: "Verify life-critical controls are actively in place",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: false,
    },
    {
      id: "hrcw",
      name: "High Risk Construction Work",
      description: "Manage the 19 HRCW categories under WHS Regulations",
      industries: ["construction"],
      mobileAccess: "partial",
      offlineCapable: false,
    },
    {
      id: "psychosocial-risk",
      name: "Psychosocial Risk",
      description: "Mental health and psychosocial hazard assessments",
      industries: ["construction"],
      mobileAccess: "none",
      offlineCapable: false,
    },
  ],
  industrial: [
    {
      id: "hazard-register",
      name: "Hazard Register",
      description: "Identify, record and control workplace hazards",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: true,
    },
    {
      id: "risk-assessments",
      name: "Risk Assessments",
      description: "Formal likelihood/consequence assessments with hierarchy of controls",
      industries: "shared",
      mobileAccess: "partial",
      offlineCapable: false,
    },
    {
      id: "emergency-response-plans",
      name: "Emergency Response Plans",
      description: "Planning and documentation of emergency responses",
      industries: "shared",
      mobileAccess: "read-only",
      offlineCapable: false,
    },
    {
      id: "critical-risk-controls",
      name: "Critical Risk Controls",
      description: "Verify life-critical controls are actively in place",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: false,
    },
    {
      id: "jsa-jsea",
      name: "JSA / JSEA",
      description: "Job Safety Analysis for non-routine high-risk tasks",
      industries: ["industrial"],
      mobileAccess: "partial",
      offlineCapable: true,
    },
    {
      id: "chemical-process-risk",
      name: "Chemical & Process Risk",
      description: "Risk assessments for hazardous substances and processes",
      industries: ["industrial"],
      mobileAccess: "read-only",
      offlineCapable: false,
    },
  ],
  facilities: [
    {
      id: "hazard-register",
      name: "Hazard Register",
      description: "Identify, record and control workplace hazards",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: true,
    },
    {
      id: "risk-assessments",
      name: "Risk Assessments",
      description: "Formal likelihood/consequence assessments with hierarchy of controls",
      industries: "shared",
      mobileAccess: "partial",
      offlineCapable: false,
    },
    {
      id: "emergency-response-plans",
      name: "Emergency Response Plans",
      description: "Planning and documentation of emergency responses",
      industries: "shared",
      mobileAccess: "read-only",
      offlineCapable: false,
    },
    {
      id: "critical-risk-controls",
      name: "Critical Risk Controls",
      description: "Verify life-critical controls are actively in place",
      industries: "shared",
      mobileAccess: "full",
      offlineCapable: false,
    },
    {
      id: "slip-trip-fall",
      name: "Slip, Trip & Fall Risk",
      description: "Identify and control the dominant risk category in facilities",
      industries: ["facilities"],
      mobileAccess: "partial",
      offlineCapable: false,
    },
    {
      id: "psychosocial-risk",
      name: "Psychosocial Risk",
      description: "Mental health and psychosocial hazard assessments",
      industries: ["facilities"],
      mobileAccess: "none",
      offlineCapable: false,
    },
  ],
};

export const COMPLIANCE_SUBMODULES: Record<Industry, SubModule[]> = {
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

export const CORE_MODULES: Omit<CoreModule, "subModules">[] = [
  { key: "safety", name: "Safety", icon: "Shield" },
  { key: "people", name: "People", icon: "Users" },
  { key: "operations", name: "Operations", icon: "Settings" },
  { key: "risk", name: "Risk Management", icon: "AlertTriangle" },
  { key: "compliance", name: "Compliance", icon: "CheckSquare" },
  { key: "governance", name: "Governance", icon: "Building2" },
  { key: "insights", name: "Insights", icon: "BarChart3" },
  { key: "training", name: "Training", icon: "GraduationCap" },
  { key: "blueprints", name: "Blueprints", icon: "Map" },
];

export function getSubModules(module: ModuleKey, industry: Industry): SubModule[] {
  switch (module) {
    case "safety":
      return SAFETY_SUBMODULES[industry];
    case "people":
      return PEOPLE_SUBMODULES[industry];
    case "operations":
      return OPERATIONS_SUBMODULES[industry];
    case "risk":
      return RISK_SUBMODULES[industry];
    case "compliance":
      return COMPLIANCE_SUBMODULES[industry];
    case "insights":
      return INSIGHTS_SUBMODULES;
    default:
      return [];
  }
}
