import type { BriesaSnapshot } from "./types";

/**
 * Snapshot of the customer's live Briesa workspace, mirrored from the Hazard
 * Register, Risk Assessments, Incidents, Contractor Management and Training
 * modules. Used to pre-fill the ISO 45001 intake so the customer never re-keys
 * data they've already captured in Briesa.
 */
export const BRIESA_SNAPSHOT: BriesaSnapshot = {
  hazards: [
    { hazard: "Working at heights — scaffold and edges", risk: "Medium", controls: "Perimeter barrier, harness, SWMS-103" },
    { hazard: "Mobile plant & pedestrian interaction", risk: "High", controls: "Exclusion zones, spotters, traffic management plan" },
    { hazard: "Silica dust — concrete cutting", risk: "Medium", controls: "On-tool extraction, RPE, air monitoring" },
    { hazard: "Manual handling — materials", risk: "Low", controls: "Mechanical aids, team lifts, training" },
    { hazard: "Electrical — temporary site supply", risk: "Medium", controls: "RCDs, monthly test & tag, lockout" },
  ],
  riskAssessments: [
    { task: "Crane lift over pedestrian path", riskLevel: "High", control: "Engineering" },
    { task: "Trenching >1.5m", riskLevel: "High", control: "Shoring / benching" },
    { task: "Hot works — welding", riskLevel: "Medium", control: "Permit + fire watch" },
    { task: "Confined space entry — sewer pit", riskLevel: "High", control: "Permit + atmospheric testing" },
  ],
  incidents: [
    { ref: "INC-044", type: "Near Miss", severity: "High", date: "13 Jun 2024" },
    { ref: "INC-043", type: "First Aid Injury", severity: "Low", date: "07 Jun 2024" },
    { ref: "INC-042", type: "Property Damage", severity: "Medium", date: "03 Jun 2024" },
    { ref: "INC-041", type: "Near Miss", severity: "Medium", date: "28 May 2024" },
  ],
  contractors: [
    { name: "Apex Scaffolding Pty Ltd", trade: "Scaffolding", status: "Approved" },
    { name: "Voltvar Electrical", trade: "Electrical", status: "Approved" },
    { name: "CutRight Concrete", trade: "Concrete cutting", status: "Insurance pending" },
  ],
  training: [
    { course: "Working at Heights", completed: 38, total: 42 },
    { course: "White Card", completed: 42, total: 42 },
    { course: "First Aid (HLTAID011)", completed: 9, total: 12 },
    { course: "Confined Space Entry", completed: 6, total: 8 },
  ],
};

export function briesaCounts() {
  return {
    hazards: BRIESA_SNAPSHOT.hazards.length,
    riskAssessments: BRIESA_SNAPSHOT.riskAssessments.length,
    incidents: BRIESA_SNAPSHOT.incidents.length,
    contractors: BRIESA_SNAPSHOT.contractors.length,
    training: BRIESA_SNAPSHOT.training.length,
  };
}
