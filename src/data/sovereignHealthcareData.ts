/**
 * SOVEREIGN HEALTHCARE NETWORK DATA SPECIFICATION
 * Decoupled Web + API Architecture: Next.js + FastAPI
 * Jurisdiction: TSL Zero-Trust Medical Escrow & Verifiable Physician Credentials
 */

export interface MedicalProvider {
  id: string;
  npiNumber: string;
  sovereignLicenseId: string;
  fullName: string;
  title: string;
  specialty: string;
  primaryFacility: string;
  credentialStatus: 'VERIFIED_ACTIVE' | 'PENDING_ATTESTATION' | 'PROVISIONAL';
  tslBondEsc: number;
  patientsActive: number;
  consultationFeeEsc: number;
  contactEmail: string;
  meshNodeId: string;
}

export interface MedicalFacility {
  id: string;
  name: string;
  facilityType: 'HOSPITAL' | 'AMBULATORY_SURGERY' | 'EXPEDITION_TRAUMA_CLINIC' | 'BIO_RESEARCH';
  location: string;
  totalBeds: number;
  availableBeds: number;
  icuCapacityPct: number;
  operatingRooms: number;
  activeSurgeons: number;
  complianceRating: 'HIPAA_TSL_LEVEL_4' | 'HIPAA_TSL_LEVEL_3';
  emergencyStatus: 'ACCEPTING_CRITICAL' | 'NORMAL_OPERATIONS' | 'DIVERTING';
}

export interface PatientAppointment {
  id: string;
  patientHash: string;
  providerName: string;
  facilityName: string;
  appointmentTime: string;
  type: 'TELEHEALTH' | 'SURGICAL_CONSULT' | 'IN_PERSON_EXAM' | 'SOVEREIGN_WELLNESS';
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  feeEsc: number;
}

export const INITIAL_HEALTHCARE_PROVIDERS: MedicalProvider[] = [
  {
    id: 'PROV-001',
    npiNumber: '1982736410',
    sovereignLicenseId: 'TSL-MED-SOV-0081',
    fullName: 'Dr. Elena Rostova, MD, FACS',
    title: 'Chief of Trauma & Expedition Medicine',
    specialty: 'Trauma Surgery & Maritime Hyperbarics',
    primaryFacility: 'Monaco Sovereign Medical Center',
    credentialStatus: 'VERIFIED_ACTIVE',
    tslBondEsc: 100000,
    patientsActive: 42,
    consultationFeeEsc: 250,
    contactEmail: 'e.rostova@sovereign-healthcare.net',
    meshNodeId: 'MESH-HEALTH-01A',
  },
  {
    id: 'PROV-002',
    npiNumber: '1472901832',
    sovereignLicenseId: 'TSL-MED-SOV-0104',
    fullName: 'Dr. Marcus Thorne, MD, PhD',
    title: 'Director of Aerospace & Autonomous Telemedicine',
    specialty: 'Aviation Medicine & Critical Care AI',
    primaryFacility: 'Monaco Sovereign Medical Center',
    credentialStatus: 'VERIFIED_ACTIVE',
    tslBondEsc: 150000,
    patientsActive: 38,
    consultationFeeEsc: 350,
    contactEmail: 'm.thorne@sovereign-healthcare.net',
    meshNodeId: 'MESH-HEALTH-02B',
  },
  {
    id: 'PROV-003',
    npiNumber: '1839201485',
    sovereignLicenseId: 'TSL-MED-SOV-0129',
    fullName: 'Dr. Sarah Al-Mansoor, DO',
    title: 'Attending Cardiovascular Specialist',
    specialty: 'Interventional Cardiology',
    primaryFacility: 'Singapore Bio-Research Hospital',
    credentialStatus: 'VERIFIED_ACTIVE',
    tslBondEsc: 75000,
    patientsActive: 54,
    consultationFeeEsc: 300,
    contactEmail: 's.almansoor@sovereign-healthcare.net',
    meshNodeId: 'MESH-HEALTH-03C',
  },
];

export const INITIAL_HEALTHCARE_FACILITIES: MedicalFacility[] = [
  {
    id: 'FAC-001',
    name: 'Monaco Sovereign Medical Center',
    facilityType: 'HOSPITAL',
    location: 'Monaco Maritime Quay',
    totalBeds: 180,
    availableBeds: 42,
    icuCapacityPct: 68,
    operatingRooms: 8,
    activeSurgeons: 16,
    complianceRating: 'HIPAA_TSL_LEVEL_4',
    emergencyStatus: 'NORMAL_OPERATIONS',
  },
  {
    id: 'FAC-003',
    name: 'Reykjavik Arctic Trauma Clinic',
    facilityType: 'EXPEDITION_TRAUMA_CLINIC',
    location: 'Reykjavik North Atlantic Airbase',
    totalBeds: 40,
    availableBeds: 18,
    icuCapacityPct: 30,
    operatingRooms: 4,
    activeSurgeons: 6,
    complianceRating: 'HIPAA_TSL_LEVEL_4',
    emergencyStatus: 'ACCEPTING_CRITICAL',
  },
  {
    id: 'FAC-004',
    name: 'Singapore Bio-Research Hospital',
    facilityType: 'BIO_RESEARCH',
    location: 'Biopolis Singapore Straits',
    totalBeds: 240,
    availableBeds: 65,
    icuCapacityPct: 54,
    operatingRooms: 14,
    activeSurgeons: 28,
    complianceRating: 'HIPAA_TSL_LEVEL_4',
    emergencyStatus: 'NORMAL_OPERATIONS',
  },
];

export const INITIAL_APPOINTMENTS: PatientAppointment[] = [
  {
    id: 'APT-001',
    patientHash: '0x9b4f...31c2',
    providerName: 'Dr. Elena Rostova, MD',
    facilityName: 'Monaco Sovereign Medical Center',
    appointmentTime: '2026-10-02T09:00:00Z',
    type: 'SOVEREIGN_WELLNESS',
    status: 'SCHEDULED',
    feeEsc: 250,
  },
  {
    id: 'APT-002',
    patientHash: '0x7e11...d408',
    providerName: 'Dr. Marcus Thorne, MD',
    facilityName: 'Reykjavik Arctic Trauma Clinic',
    appointmentTime: '2026-10-02T10:30:00Z',
    type: 'TELEHEALTH',
    status: 'IN_PROGRESS',
    feeEsc: 350,
  },
];
