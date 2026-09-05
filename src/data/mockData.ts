import {
  CPSE,
  CommonMaterial,
  MatchCandidate,
  ReviewItem,
  QualityIssue,
  ProcurementOpportunity,
  AuditEvent,
  StandardizationRule,
  DomainDictionaryItem,
  AIModelVersion,
  NotificationItem
} from '../types';

export const INITIAL_CPSES: CPSE[] = [
  {
    id: 'cpse-1',
    code: 'IOCL',
    name: 'Indian Oil Corporation Limited',
    shortName: 'IndianOil',
    sector: 'Oil & Gas',
    recordsUploaded: 64210,
    recordsNormalized: 58920,
    recordsMatched: 51340,
    reviewBacklog: 412,
    qualityScore: 92.4,
    completenessRate: 88.0,
    status: 'Active',
    nodalOfficer: 'Rajesh Sharma, Chief Materials Manager',
    email: 'r.sharma@iocl.co.in',
    lastUpload: '2026-08-28 14:32 IST',
    logoColor: '#f97316',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    facilityLocation: 'Panipat Mega Refinery & Petrochemical Complex, Haryana'
  },
  {
    id: 'cpse-2',
    code: 'ONGC',
    name: 'Oil and Natural Gas Corporation',
    shortName: 'ONGC',
    sector: 'Oil & Gas',
    recordsUploaded: 58400,
    recordsNormalized: 55100,
    recordsMatched: 49800,
    reviewBacklog: 285,
    qualityScore: 95.1,
    completenessRate: 94.0,
    status: 'Active',
    nodalOfficer: 'Dr. Vivek Menon, GM Master Data',
    email: 'menon_v@ongc.co.in',
    lastUpload: '2026-08-29 09:15 IST',
    logoColor: '#dc2626',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=800&q=80',
    facilityLocation: 'Mumbai High Offshore Deepwater Platform, Arabian Sea'
  },
  {
    id: 'cpse-3',
    code: 'BPCL',
    name: 'Bharat Petroleum Corporation Limited',
    shortName: 'Bharat Petroleum',
    sector: 'Oil & Gas',
    recordsUploaded: 38900,
    recordsNormalized: 34120,
    recordsMatched: 29800,
    reviewBacklog: 310,
    qualityScore: 89.6,
    completenessRate: 85.2,
    status: 'Active',
    nodalOfficer: 'Sunita Nair, DGM Procurement',
    email: 'sunita_nair@bharatpetroleum.in',
    lastUpload: '2026-08-27 18:00 IST',
    logoColor: '#2563eb',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    facilityLocation: 'Kochi Clean Fuels & Petrochemicals Refinery, Kerala'
  },
  {
    id: 'cpse-4',
    code: 'NTPC',
    name: 'NTPC Limited',
    shortName: 'NTPC',
    sector: 'Power',
    recordsUploaded: 42150,
    recordsNormalized: 36800,
    recordsMatched: 31200,
    reviewBacklog: 540,
    qualityScore: 84.8,
    completenessRate: 76.0,
    status: 'Active',
    nodalOfficer: 'Amitabh Sen, AGM Inventory',
    email: 'asen@ntpc.co.in',
    lastUpload: '2026-08-29 11:20 IST',
    logoColor: '#059669',
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
    facilityLocation: 'Vindhyachal Super Thermal Power Station, Madhya Pradesh'
  },
  {
    id: 'cpse-5',
    code: 'SAIL',
    name: 'Steel Authority of India Limited',
    shortName: 'SAIL',
    sector: 'Steel',
    recordsUploaded: 31400,
    recordsNormalized: 24500,
    recordsMatched: 19800,
    reviewBacklog: 820,
    qualityScore: 78.5,
    completenessRate: 62.4,
    status: 'Review Required',
    nodalOfficer: 'Pramod Mohanty, DGM Stores',
    email: 'p.mohanty@sail.in',
    lastUpload: '2026-08-25 16:45 IST',
    logoColor: '#0284c7',
    imageUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
    facilityLocation: 'Bhilai Integrated Steel Plant & Blast Furnaces, Chhattisgarh'
  },
  {
    id: 'cpse-6',
    code: 'GAIL',
    name: 'GAIL (India) Limited',
    shortName: 'GAIL',
    sector: 'Oil & Gas',
    recordsUploaded: 22100,
    recordsNormalized: 20400,
    recordsMatched: 18100,
    reviewBacklog: 140,
    qualityScore: 93.8,
    completenessRate: 91.5,
    status: 'Active',
    nodalOfficer: 'Kavita Iyer, Chief Manager (ERP)',
    email: 'k_iyer@gail.co.in',
    lastUpload: '2026-08-28 11:00 IST',
    logoColor: '#7c3aed',
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    facilityLocation: 'HVJ Natural Gas Trunkline & Compressor Hub, Hazira-Vijaipur'
  },
  {
    id: 'cpse-7',
    code: 'BHEL',
    name: 'Bharat Heavy Electricals Limited',
    shortName: 'BHEL',
    sector: 'Heavy Engineering',
    recordsUploaded: 28300,
    recordsNormalized: 24900,
    recordsMatched: 21400,
    reviewBacklog: 390,
    qualityScore: 87.2,
    completenessRate: 83.1,
    status: 'Active',
    nodalOfficer: 'Anand Kulkarni, Head Material Management',
    email: 'a_kulkarni@bhel.in',
    lastUpload: '2026-08-26 15:30 IST',
    logoColor: '#ea580c',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    facilityLocation: 'Heavy Power Equipment Plant & Turbine Facility, Haridwar'
  },
  {
    id: 'cpse-8',
    code: 'CIL',
    name: 'Coal India Limited',
    shortName: 'Coal India',
    sector: 'Mining',
    recordsUploaded: 35800,
    recordsNormalized: 29400,
    recordsMatched: 23600,
    reviewBacklog: 610,
    qualityScore: 81.3,
    completenessRate: 74.5,
    status: 'Active',
    nodalOfficer: 'Biswajit Roy, GM Supply Chain',
    email: 'broy@coalindia.in',
    lastUpload: '2026-08-24 10:10 IST',
    logoColor: '#475569',
    imageUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80',
    facilityLocation: 'Northern Coalfields Open Cast Heavy Dragline Mines, Singrauli'
  },
  {
    id: 'cpse-9',
    code: 'CPCL',
    name: 'Chennai Petroleum Corporation Limited',
    shortName: 'CPCL',
    sector: 'Petrochemicals',
    recordsUploaded: 14500,
    recordsNormalized: 13200,
    recordsMatched: 11900,
    reviewBacklog: 85,
    qualityScore: 94.2,
    completenessRate: 92.0,
    status: 'Active',
    nodalOfficer: 'S. Ramanathan, DGM Materials',
    email: 'sramanathan@cpcl.co.in',
    lastUpload: '2026-08-29 08:30 IST',
    logoColor: '#0891b2',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    facilityLocation: 'Manali Refining Complex & Lube Base Oil Plant, Tamil Nadu'
  },
  {
    id: 'cpse-10',
    code: 'HPCL',
    name: 'Hindustan Petroleum Corporation Limited',
    shortName: 'HPCL',
    sector: 'Oil & Gas',
    recordsUploaded: 32800,
    recordsNormalized: 29100,
    recordsMatched: 25800,
    reviewBacklog: 260,
    qualityScore: 90.7,
    completenessRate: 86.8,
    status: 'Active',
    nodalOfficer: 'Manoj Verma, AGM Central Procurement',
    email: 'mverma@hpcl.in',
    lastUpload: '2026-08-28 17:15 IST',
    logoColor: '#be185d',
    imageUrl: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&w=800&q=80',
    facilityLocation: 'Visakh Refinery Modernization & Hydrocracker Unit, Andhra Pradesh'
  }
];

export const INITIAL_COMMON_MATERIALS: CommonMaterial[] = [
  {
    id: 'BMG-FST-000001284',
    bmgCode: 'BMG-FST-000001284',
    standardName: 'Stainless Steel Hex Bolt',
    category: 'Fasteners',
    specifications: {
      material: 'Stainless Steel',
      grade: 'SS304',
      diameter: '10 mm (M10)',
      length: '50 mm',
      uom: 'Nos',
      standard: 'ISO 4014 / DIN 931',
      coating: 'Passivated',
      temperatureRange: '-196°C to +400°C'
    },
    mappings: [
      {
        cpseCode: 'ONGC',
        cpseName: 'Oil and Natural Gas Corporation',
        localMaterialCode: 'MAT-10291',
        localDescription: 'SS BOLT M10 X 50 SS304 FULL THREAD',
        localUOM: 'NOS',
        localCategory: 'HARDWARE',
        mappedAt: '2026-08-15',
        mappedBy: 'Dr. Vivek Menon',
        annualDemand: 18500,
        unitPrice: 42.50,
        currency: 'INR',
        leadTimeDays: 14
      },
      {
        cpseCode: 'IOCL',
        cpseName: 'Indian Oil Corporation Limited',
        localMaterialCode: 'BOLT-7821',
        localDescription: 'HEX BOLT STAINLESS STEEL 10MM X 50MM 304',
        localUOM: 'EA',
        localCategory: 'FASTENERS',
        mappedAt: '2026-08-16',
        mappedBy: 'Rajesh Sharma',
        annualDemand: 34000,
        unitPrice: 46.00,
        currency: 'INR',
        leadTimeDays: 21
      },
      {
        cpseCode: 'BPCL',
        cpseName: 'Bharat Petroleum Corporation Limited',
        localMaterialCode: '009871-FST',
        localDescription: 'SS304 HEXAGONAL HEAD BOLT M10X50',
        localUOM: 'PCS',
        localCategory: 'STORES-MECH',
        mappedAt: '2026-08-18',
        mappedBy: 'Sunita Nair',
        annualDemand: 14200,
        unitPrice: 48.20,
        currency: 'INR',
        leadTimeDays: 18
      },
      {
        cpseCode: 'CPCL',
        cpseName: 'Chennai Petroleum Corporation Limited',
        localMaterialCode: 'CPCL-7821',
        localDescription: 'BOLT HEX SS 304 M10X50MM ISO4014',
        localUOM: 'NOS',
        localCategory: 'FASTENERS',
        mappedAt: '2026-08-20',
        mappedBy: 'S. Ramanathan',
        annualDemand: 8900,
        unitPrice: 44.00,
        currency: 'INR',
        leadTimeDays: 12
      }
    ],
    status: 'Approved',
    version: 'v2.1',
    lastUpdated: '2026-08-20 16:40 IST',
    approvedBy: 'National Master Data Committee (Officer S. Verma)',
    approvedAt: '2026-08-20',
    totalAnnualDemand: 75600,
    avgUnitPrice: 45.18,
    potentialSavingsPercent: 16.4,
    activeSuppliersCount: 7,
    authorizedInventory: 24500,
    description: 'Precision cold-forged stainless steel hexagonal bolt complying with ISO 4014, utilized for structural flanging and casing across petrochemical and refinery process units.'
  },
  {
    id: 'BMG-VLV-000045922',
    bmgCode: 'BMG-VLV-000045922',
    standardName: 'Gate Valve, Flanged Class 150',
    category: 'Industrial Valves',
    specifications: {
      material: 'Carbon Steel',
      grade: 'ASTM A216 Gr. WCB',
      diameter: '4 Inch (DN100)',
      pressureRating: 'Class 150 (ASME B16.34)',
      uom: 'Nos',
      standard: 'API 600 / ISO 10434',
      endConnection: 'Flanged RF (ASME B16.5)',
      temperatureRange: '-29°C to +425°C'
    },
    mappings: [
      {
        cpseCode: 'IOCL',
        cpseName: 'Indian Oil Corporation Limited',
        localMaterialCode: 'VLV-GT-04-150',
        localDescription: 'VALVE GATE 4INCH 150# FLGD WCB OS&Y API600',
        localUOM: 'NOS',
        localCategory: 'VALVES',
        mappedAt: '2026-08-10',
        mappedBy: 'Rajesh Sharma',
        annualDemand: 5200,
        unitPrice: 18500,
        currency: 'INR',
        leadTimeDays: 45
      },
      {
        cpseCode: 'ONGC',
        cpseName: 'Oil and Natural Gas Corporation',
        localMaterialCode: 'VLV-CS-WCB-4',
        localDescription: '4" GATE VALVE CL 150 CARBON STEEL FLG WCB',
        localUOM: 'NOS',
        localCategory: 'PIPING',
        mappedAt: '2026-08-11',
        mappedBy: 'Dr. Vivek Menon',
        annualDemand: 4800,
        unitPrice: 19200,
        currency: 'INR',
        leadTimeDays: 60
      },
      {
        cpseCode: 'BPCL',
        cpseName: 'Bharat Petroleum Corporation Limited',
        localMaterialCode: 'GV-150-4IN-WCB',
        localDescription: 'GATE VALVE 100MM CLASS 150 FLANGED ASTM A216 WCB',
        localUOM: 'EA',
        localCategory: 'VALVES',
        mappedAt: '2026-08-14',
        mappedBy: 'Sunita Nair',
        annualDemand: 3400,
        unitPrice: 20100,
        currency: 'INR',
        leadTimeDays: 40
      },
      {
        cpseCode: 'GAIL',
        cpseName: 'GAIL (India) Limited',
        localMaterialCode: 'GAIL-VLV-401',
        localDescription: 'VALVE GATE FLGD 4" 150# CS BODY WCB TRIM 8',
        localUOM: 'NOS',
        localCategory: 'PIPELINE',
        mappedAt: '2026-08-19',
        mappedBy: 'Kavita Iyer',
        annualDemand: 2850,
        unitPrice: 18900,
        currency: 'INR',
        leadTimeDays: 50
      },
      {
        cpseCode: 'CPCL',
        cpseName: 'Chennai Petroleum Corporation Limited',
        localMaterialCode: 'CPCL-GV-04-150',
        localDescription: 'GATE VALVE CS WCB CL150 4 INCH FLANGED',
        localUOM: 'NOS',
        localCategory: 'VALVES',
        mappedAt: '2026-08-22',
        mappedBy: 'S. Ramanathan',
        annualDemand: 2200,
        unitPrice: 19400,
        currency: 'INR',
        leadTimeDays: 35
      }
    ],
    status: 'Approved',
    version: 'v1.4',
    lastUpdated: '2026-08-22 10:15 IST',
    approvedBy: 'National Material Master Board',
    approvedAt: '2026-08-22',
    totalAnnualDemand: 18450,
    avgUnitPrice: 19220,
    potentialSavingsPercent: 19.8,
    activeSuppliersCount: 11,
    authorizedInventory: 4120,
    description: 'Cast carbon steel bolted bonnet, rising stem outside screw & yoke (OS&Y) wedge gate valve designed in accordance with API 600 standard for general hydrocarbon refinery fluid service.'
  },
  {
    id: 'BMG-PIP-000088103',
    bmgCode: 'BMG-PIP-000088103',
    standardName: 'Seamless Carbon Steel Pipe',
    category: 'Pipes',
    specifications: {
      material: 'Carbon Steel',
      grade: 'ASTM A106 Grade B',
      diameter: '6 Inch (DN150)',
      length: 'Schedule 40 (7.11mm WT)',
      pressureRating: 'ASME B36.10M',
      uom: 'Meters',
      standard: 'ASTM A106 / ASME SA106',
      endConnection: 'Beveled Ends (BE)',
      temperatureRange: '-29°C to +427°C'
    },
    mappings: [
      {
        cpseCode: 'ONGC',
        cpseName: 'Oil and Natural Gas Corporation',
        localMaterialCode: 'PIPE-SMLS-6-SCH40',
        localDescription: 'PIPE SEAMLESS CS 6 INCH SCH 40 ASTM A106 GR.B BE',
        localUOM: 'MTR',
        localCategory: 'PIPES',
        mappedAt: '2026-08-12',
        mappedBy: 'Dr. Vivek Menon',
        annualDemand: 45000,
        unitPrice: 3850,
        currency: 'INR',
        leadTimeDays: 30
      },
      {
        cpseCode: 'IOCL',
        cpseName: 'Indian Oil Corporation Limited',
        localMaterialCode: 'PIP-CS-150-40',
        localDescription: 'CARBON STEEL SEAMLESS TUBING / PIPE 6" SCH40 A106B',
        localUOM: 'M',
        localCategory: 'TUBULARS',
        mappedAt: '2026-08-15',
        mappedBy: 'Rajesh Sharma',
        annualDemand: 68000,
        unitPrice: 3920,
        currency: 'INR',
        leadTimeDays: 45
      },
      {
        cpseCode: 'GAIL',
        cpseName: 'GAIL (India) Limited',
        localMaterialCode: 'GAIL-P-106B-6',
        localDescription: 'SMLS PIPE 6 INCH NOMINAL SCH 40 A106-B BEVELED',
        localUOM: 'MTR',
        localCategory: 'LINEPIPE',
        mappedAt: '2026-08-18',
        mappedBy: 'Kavita Iyer',
        annualDemand: 29000,
        unitPrice: 3780,
        currency: 'INR',
        leadTimeDays: 40
      }
    ],
    status: 'Approved',
    version: 'v2.0',
    lastUpdated: '2026-08-25 14:10 IST',
    approvedBy: 'National Master Data Authority',
    approvedAt: '2026-08-25',
    totalAnnualDemand: 142000,
    avgUnitPrice: 3850,
    potentialSavingsPercent: 14.2,
    activeSuppliersCount: 9,
    authorizedInventory: 32000,
    description: 'Hot finished or cold drawn seamless carbon steel pipe for high-temperature service in process refineries and natural gas pipelines.'
  },
  {
    id: 'BMG-PMP-000031908',
    bmgCode: 'BMG-PMP-000031908',
    standardName: 'Centrifugal End Suction Process Pump',
    category: 'Pumps',
    specifications: {
      material: 'Duplex Stainless Steel (CD4MCu) / CF8M',
      grade: 'API 610 Type OH2',
      diameter: 'Discharge 80mm × Suction 100mm',
      pressureRating: '20 Bar MAWP',
      uom: 'Set',
      standard: 'API 610 12th Edition / ISO 13709',
      temperatureRange: '-40°C to +260°C'
    },
    mappings: [
      {
        cpseCode: 'IOCL',
        cpseName: 'Indian Oil Corporation Limited',
        localMaterialCode: 'PMP-CEN-05',
        localDescription: 'CENTRIFUGAL PROCESS PUMP 5HP API610 OH2 SS316',
        localUOM: 'SET',
        localCategory: 'ROTATING-EQ',
        mappedAt: '2026-08-05',
        mappedBy: 'Rajesh Sharma',
        annualDemand: 85,
        unitPrice: 650000,
        currency: 'INR',
        leadTimeDays: 120
      },
      {
        cpseCode: 'BPCL',
        cpseName: 'Bharat Petroleum Corporation Limited',
        localMaterialCode: 'PUMP-WTR-5HP-CENTRIF',
        localDescription: 'PUMP PROCESS CENTRIFUGAL END SUCTION OH2 80X100',
        localUOM: 'NOS',
        localCategory: 'PUMPS',
        mappedAt: '2026-08-08',
        mappedBy: 'Sunita Nair',
        annualDemand: 62,
        unitPrice: 680000,
        currency: 'INR',
        leadTimeDays: 130
      }
    ],
    status: 'Approved',
    version: 'v1.1',
    lastUpdated: '2026-08-21 11:25 IST',
    approvedBy: 'National Rotating Equipment Group',
    approvedAt: '2026-08-21',
    totalAnnualDemand: 147,
    avgUnitPrice: 665000,
    potentialSavingsPercent: 12.8,
    activeSuppliersCount: 5,
    authorizedInventory: 18,
    description: 'Heavy duty horizontal single-stage radial split overhung centerline supported end suction centrifugal pump built to API 610 (OH2) standard.'
  },
  {
    id: 'BMG-GSK-000019204',
    bmgCode: 'BMG-GSK-000019204',
    standardName: 'Spiral Wound Gasket with Inner & Outer Ring',
    category: 'Gaskets',
    specifications: {
      material: 'SS316L Winding with Flexible Graphite Filler',
      grade: 'Outer Ring: Carbon Steel, Inner Ring: SS316L',
      diameter: '4 Inch (DN100)',
      pressureRating: 'Class 300 (ASME B16.20)',
      uom: 'Nos',
      standard: 'ASME B16.20 for ASME B16.5 Flanges',
      temperatureRange: '-240°C to +550°C'
    },
    mappings: [
      {
        cpseCode: 'ONGC',
        cpseName: 'Oil and Natural Gas Corporation',
        localMaterialCode: 'GSK-SPW-4-300',
        localDescription: 'SPIRAL WOUND GASKET 4" 300# SS316L/GRAPHITE CS ORING',
        localUOM: 'NOS',
        localCategory: 'SEALS',
        mappedAt: '2026-08-14',
        mappedBy: 'Dr. Vivek Menon',
        annualDemand: 12400,
        unitPrice: 420,
        currency: 'INR',
        leadTimeDays: 10
      },
      {
        cpseCode: 'IOCL',
        cpseName: 'Indian Oil Corporation Limited',
        localMaterialCode: 'GSK-4IN-300-SWG',
        localDescription: 'GASKET SW 4 INCH 300 LB SS316L GRAPHITE FILLER',
        localUOM: 'EA',
        localCategory: 'GASKETS',
        mappedAt: '2026-08-16',
        mappedBy: 'Rajesh Sharma',
        annualDemand: 18900,
        unitPrice: 455,
        currency: 'INR',
        leadTimeDays: 14
      },
      {
        cpseCode: 'CPCL',
        cpseName: 'Chennai Petroleum Corporation Limited',
        localMaterialCode: 'CPCL-GSK-300-4',
        localDescription: 'SPIRAL WOUND GASKET DN100 CL300 SS316/FG ASME B16.20',
        localUOM: 'NOS',
        localCategory: 'GASKETS',
        mappedAt: '2026-08-18',
        mappedBy: 'S. Ramanathan',
        annualDemand: 7400,
        unitPrice: 430,
        currency: 'INR',
        leadTimeDays: 12
      }
    ],
    status: 'Approved',
    version: 'v2.0',
    lastUpdated: '2026-08-26 17:00 IST',
    approvedBy: 'National Static Master Council',
    approvedAt: '2026-08-26',
    totalAnnualDemand: 38700,
    avgUnitPrice: 435,
    potentialSavingsPercent: 17.5,
    activeSuppliersCount: 8,
    authorizedInventory: 9800,
    description: 'Engineered spiral wound gasket featuring V-shaped stainless steel metallic strip and soft non-metallic graphite filler with solid carbon steel centering ring.'
  },
  {
    id: 'BMG-BRG-000072110',
    bmgCode: 'BMG-BRG-000072110',
    standardName: 'Deep Groove Ball Bearing 6309 2RS C3',
    category: 'Bearings',
    specifications: {
      material: 'High Carbon Chromium Bearing Steel',
      grade: '100Cr6 / SAE 52100',
      diameter: 'Bore: 45 mm, OD: 100 mm, Width: 25 mm',
      pressureRating: 'Dynamic Load 55.3 kN / Static 31.5 kN',
      uom: 'Nos',
      standard: 'ISO 15 / DIN 625',
      endConnection: 'Rubber Contact Seals (2RS), Internal Clearance C3',
      temperatureRange: '-30°C to +120°C'
    },
    mappings: [
      {
        cpseCode: 'NTPC',
        cpseName: 'NTPC Limited',
        localMaterialCode: 'BRG-6309-2RS-C3',
        localDescription: 'BALL BEARING DEEP GROOVE 6309 2RS C3 DUAL SEAL',
        localUOM: 'NOS',
        localCategory: 'BEARINGS',
        mappedAt: '2026-08-09',
        mappedBy: 'Amitabh Sen',
        annualDemand: 4200,
        unitPrice: 1450,
        currency: 'INR',
        leadTimeDays: 20
      },
      {
        cpseCode: 'BHEL',
        cpseName: 'Bharat Heavy Electricals Limited',
        localMaterialCode: 'BRG-DG-45X100X25',
        localDescription: 'DEEP GROOVE BALL BEARING 6309-2RSH/C3 45X100X25',
        localUOM: 'NOS',
        localCategory: 'BEARINGS',
        mappedAt: '2026-08-11',
        mappedBy: 'Anand Kulkarni',
        annualDemand: 6800,
        unitPrice: 1520,
        currency: 'INR',
        leadTimeDays: 25
      }
    ],
    status: 'Approved',
    version: 'v1.3',
    lastUpdated: '2026-08-24 12:00 IST',
    approvedBy: 'National Machinery Master Authority',
    approvedAt: '2026-08-24',
    totalAnnualDemand: 11000,
    avgUnitPrice: 1485,
    potentialSavingsPercent: 15.0,
    activeSuppliersCount: 6,
    authorizedInventory: 2600,
    description: 'Precision single row deep groove ball bearing with synthetic rubber contact seals on both sides and greater radial internal clearance (C3).'
  },
  {
    id: 'BMG-ELC-000099415',
    bmgCode: 'BMG-ELC-000099415',
    standardName: 'Armoured Copper Power Cable 3.5C × 185 sq.mm',
    category: 'Electrical Cables',
    specifications: {
      material: 'Electrolytic Copper Conductor (XLPE Insulated)',
      grade: '1.1 kV Grade IS 7098 Part 1',
      diameter: '3.5 Core × 185 sq.mm (Stranded Compacted)',
      pressureRating: 'Voltage Rating 1100 Volts',
      uom: 'Meters',
      standard: 'IS 7098 (Part 1) / IEC 60502-1',
      endConnection: 'Extruded PVC Inner/Outer Sheath with Galvanized Steel Flat Strip Armour',
      temperatureRange: '-15°C to +90°C'
    },
    mappings: [
      {
        cpseCode: 'NTPC',
        cpseName: 'NTPC Limited',
        localMaterialCode: 'CBL-CU-3.5C-185',
        localDescription: 'CABLE POWER 1.1KV XLPE CU ARMOURED 3.5C X 185SQMM',
        localUOM: 'MTR',
        localCategory: 'ELECTRICAL',
        mappedAt: '2026-08-10',
        mappedBy: 'Amitabh Sen',
        annualDemand: 35000,
        unitPrice: 2450,
        currency: 'INR',
        leadTimeDays: 45
      },
      {
        cpseCode: 'SAIL',
        cpseName: 'Steel Authority of India Limited',
        localMaterialCode: 'SAIL-EL-185-3.5',
        localDescription: 'LT XLPE ARMOURED COPPER CABLE 3.5 CORE 185 SQ MM IS7098',
        localUOM: 'M',
        localCategory: 'CABLES',
        mappedAt: '2026-08-15',
        mappedBy: 'Pramod Mohanty',
        annualDemand: 28000,
        unitPrice: 2580,
        currency: 'INR',
        leadTimeDays: 60
      }
    ],
    status: 'Approved',
    version: 'v1.2',
    lastUpdated: '2026-08-25 15:30 IST',
    approvedBy: 'National Electrical Committee',
    approvedAt: '2026-08-25',
    totalAnnualDemand: 63000,
    avgUnitPrice: 2515,
    potentialSavingsPercent: 13.5,
    activeSuppliersCount: 7,
    authorizedInventory: 14000,
    description: 'Cross-linked polyethylene insulated heavy-duty underground power cable with galvanized steel armour for industrial distribution.'
  }
];

export const INITIAL_CANDIDATES: MatchCandidate[] = [
  // SHOWCASE 1: 96.2% SAFE MATCH
  {
    id: 'CAND-8492',
    pairNumber: 8492,
    recordA: {
      cpseCode: 'ONGC',
      cpseName: 'Oil and Natural Gas Corporation',
      localCode: 'MAT-00125',
      rawDescription: 'SS BOLT M10 X 50 SS304',
      normalizedName: 'Stainless Steel Hex Bolt M10 × 50 mm SS304',
      specifications: {
        material: 'Stainless Steel',
        grade: 'SS304',
        diameter: '10 mm (M10)',
        length: '50 mm',
        uom: 'Nos',
        standard: 'ISO 4014'
      },
      uom: 'NOS'
    },
    recordB: {
      cpseCode: 'IOCL',
      cpseName: 'Indian Oil Corporation Limited',
      localCode: 'BLT-SS-458',
      rawDescription: 'STAINLESS STEEL HEX BOLT 10MM X 50 SS304',
      normalizedName: 'Stainless Steel Hex Bolt 10 mm × 50 mm SS304',
      specifications: {
        material: 'Stainless Steel',
        grade: 'SS304',
        diameter: '10 mm (M10)',
        length: '50 mm',
        uom: 'Nos',
        standard: 'ISO 4014'
      },
      uom: 'EA'
    },
    scores: {
      semanticSimilarity: 96.2,
      materialMatch: 100.0,
      gradeMatch: 100.0,
      dimensionMatch: 100.0,
      specificationMatch: 100.0,
      categoryUomMatch: 100.0,
      overallConfidence: 96.2
    },
    riskLevel: 'Low Risk',
    aiRecommendation: 'STANDARDIZE',
    aiExplanation: 'Both records describe a stainless steel hex bolt with identical grade (SS304) and critical dimensions (Diameter: 10mm, Length: 50mm) conforming to ISO 4014 standard.',
    status: 'Pending',
    category: 'Fasteners',
    modelVersion: 'BMG-FastText-Transformer-v2.4',
    createdTimestamp: '2026-08-29 08:30 IST',
    targetBmgId: 'BMG-FST-000001284'
  },

  // SHOWCASE 2: 94.8% UNSAFE FALSE POSITIVE MATCH (CRITICAL DIMENSION MISMATCH)
  {
    id: 'CAND-8499',
    pairNumber: 8499,
    recordA: {
      cpseCode: 'ONGC',
      cpseName: 'Oil and Natural Gas Corporation',
      localCode: 'MAT-00125',
      rawDescription: 'SS BOLT M10 X 50 SS304',
      normalizedName: 'Stainless Steel Hex Bolt M10 × 50 mm SS304',
      specifications: {
        material: 'Stainless Steel',
        grade: 'SS304',
        diameter: '10 mm (M10)',
        length: '50 mm',
        uom: 'Nos',
        standard: 'ISO 4014'
      },
      uom: 'NOS'
    },
    recordB: {
      cpseCode: 'BPCL',
      cpseName: 'Bharat Petroleum Corporation Limited',
      localCode: 'BLT-SS-460',
      rawDescription: 'SS BOLT M10 X 60 SS304',
      normalizedName: 'Stainless Steel Hex Bolt M10 × 60 mm SS304',
      specifications: {
        material: 'Stainless Steel',
        grade: 'SS304',
        diameter: '10 mm (M10)',
        length: '60 mm',
        uom: 'Nos',
        standard: 'ISO 4014'
      },
      uom: 'NOS'
    },
    scores: {
      semanticSimilarity: 94.8,
      materialMatch: 100.0,
      gradeMatch: 100.0,
      dimensionMatch: 0.0, // MISMATCH
      specificationMatch: 45.0,
      categoryUomMatch: 100.0,
      overallConfidence: 48.5
    },
    riskLevel: 'Critical Mismatch',
    aiRecommendation: 'DO NOT AUTO-MERGE',
    aiExplanation: 'Semantic similarity is high (94.8%) due to matching vocabulary, but Length parameter differs: 50 mm ≠ 60 mm. Thread engagement length mismatch prevents auto-merge.',
    criticalMismatchReason: 'CRITICAL SPECIFICATION MISMATCH: Length (50 mm vs 60 mm). Fasteners cannot safely interchange in pressurized pipeline flanging.',
    status: 'Pending',
    category: 'Fasteners',
    modelVersion: 'BMG-FastText-Transformer-v2.4',
    createdTimestamp: '2026-08-29 09:12 IST'
  },

  // CANDIDATE 3
  {
    id: 'CAND-8493',
    pairNumber: 8493,
    recordA: {
      cpseCode: 'IOCL',
      cpseName: 'Indian Oil Corporation Limited',
      localCode: 'PMP-CEN-05',
      rawDescription: 'CENTRIFUGAL PROCESS PUMP 5HP API610 OH2 SS316',
      normalizedName: 'Centrifugal Process Pump 5HP API610 OH2 CF8M',
      specifications: {
        material: 'Stainless Steel CF8M',
        grade: 'API 610 Type OH2',
        diameter: '80mm x 100mm',
        pressureRating: '20 Bar',
        uom: 'Set'
      },
      uom: 'SET'
    },
    recordB: {
      cpseCode: 'BPCL',
      cpseName: 'Bharat Petroleum Corporation Limited',
      localCode: 'PUMP-WTR-5HP-CENTRIF',
      rawDescription: 'PUMP PROCESS CENTRIFUGAL END SUCTION OH2 80X100',
      normalizedName: 'Process Centrifugal End Suction Pump OH2 80x100',
      specifications: {
        material: 'Stainless Steel CF8M',
        grade: 'API 610 OH2',
        diameter: '80mm x 100mm',
        pressureRating: '20 Bar',
        uom: 'Nos'
      },
      uom: 'NOS'
    },
    scores: {
      semanticSimilarity: 92.1,
      materialMatch: 95.0,
      gradeMatch: 100.0,
      dimensionMatch: 98.0,
      specificationMatch: 96.0,
      categoryUomMatch: 90.0,
      overallConfidence: 92.1
    },
    riskLevel: 'Low Risk',
    aiRecommendation: 'STANDARDIZE',
    aiExplanation: 'Both describe identical API 610 OH2 overhung process pumps with 80x100 nozzle sizing.',
    status: 'Pending',
    category: 'Pumps',
    modelVersion: 'BMG-FastText-Transformer-v2.4',
    createdTimestamp: '2026-08-29 07:45 IST',
    targetBmgId: 'BMG-PMP-000031908'
  },

  // CANDIDATE 4
  {
    id: 'CAND-8494',
    pairNumber: 8494,
    recordA: {
      cpseCode: 'ONGC',
      cpseName: 'Oil and Natural Gas Corporation',
      localCode: 'VLV-GT-2-150-CS',
      rawDescription: 'VALVE GATE 2IN FLNG 150# WCB API600',
      normalizedName: 'Gate Valve Flanged 2 Inch Class 150 ASTM A216 WCB',
      specifications: {
        material: 'Carbon Steel',
        grade: 'WCB',
        diameter: '2 Inch (DN50)',
        pressureRating: 'Class 150',
        uom: 'Nos'
      },
      uom: 'NOS'
    },
    recordB: {
      cpseCode: 'GAIL',
      cpseName: 'GAIL (India) Limited',
      localCode: 'GV-50-150-FLG',
      rawDescription: 'GATE VALVE 50MM CL150 FLANGED CS BODY WCB',
      normalizedName: 'Gate Valve 50 mm Class 150 Flanged CS WCB',
      specifications: {
        material: 'Carbon Steel',
        grade: 'WCB',
        diameter: '50 mm (2 Inch)',
        pressureRating: 'Class 150',
        uom: 'Nos'
      },
      uom: 'NOS'
    },
    scores: {
      semanticSimilarity: 88.5,
      materialMatch: 100.0,
      gradeMatch: 100.0,
      dimensionMatch: 100.0,
      specificationMatch: 95.0,
      categoryUomMatch: 100.0,
      overallConfidence: 88.5
    },
    riskLevel: 'Low Risk',
    aiRecommendation: 'STANDARDIZE',
    aiExplanation: 'Standard 2" (50mm) Class 150 flanged WCB gate valves mapped across ONGC and GAIL pipelines.',
    status: 'Pending',
    category: 'Industrial Valves',
    modelVersion: 'BMG-FastText-Transformer-v2.4',
    createdTimestamp: '2026-08-29 06:20 IST'
  },

  // CANDIDATE 5 (MEDIUM CONFIDENCE)
  {
    id: 'CAND-8495',
    pairNumber: 8495,
    recordA: {
      cpseCode: 'SAIL',
      cpseName: 'Steel Authority of India Limited',
      localCode: 'PIPE SMLS CS 4IN SCH40',
      rawDescription: 'PIPE SMLS CS 4IN SCH40 ASTM A106',
      normalizedName: 'Seamless Carbon Steel Pipe 4 Inch Schedule 40 ASTM A106',
      specifications: {
        material: 'Carbon Steel',
        grade: 'ASTM A106 Gr B',
        diameter: '4 Inch',
        length: 'Sch 40',
        uom: 'Mtr'
      },
      uom: 'MTR'
    },
    recordB: {
      cpseCode: 'NTPC',
      cpseName: 'NTPC Limited',
      localCode: 'CARBON ST TUBE 4"',
      rawDescription: 'CARBON STEEL TUBE 100MM SCH40',
      normalizedName: 'Carbon Steel Tube 100 mm Schedule 40',
      specifications: {
        material: 'Carbon Steel',
        grade: 'Unspecified',
        diameter: '100 mm',
        length: 'Sch 40',
        uom: 'M'
      },
      uom: 'M'
    },
    scores: {
      semanticSimilarity: 81.0,
      materialMatch: 90.0,
      gradeMatch: 50.0, // missing explicit grade in Record B
      dimensionMatch: 100.0,
      specificationMatch: 72.0,
      categoryUomMatch: 95.0,
      overallConfidence: 81.0
    },
    riskLevel: 'Medium Risk',
    aiRecommendation: 'NEEDS HUMAN REVIEW',
    aiExplanation: 'Record B lists item as "TUBE" with missing explicit ASTM grade, while Record A specifies ASTM A106 Grade B Pipe.',
    status: 'Pending',
    category: 'Pipes',
    modelVersion: 'BMG-FastText-Transformer-v2.4',
    createdTimestamp: '2026-08-29 05:10 IST'
  }
];

export const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'REV-001',
    candidateId: 'CAND-8492',
    bmgProposedId: 'BMG-FST-000001284',
    candidate: INITIAL_CANDIDATES[0],
    priority: 'High',
    status: 'Pending',
    assignedRole: 'Material Master Officer',
    differenceAnalysis: [
      'Record A uses metric code syntax "M10 X 50"',
      'Record B expands "10MM X 50"',
      'Both denote identical physical thread profile (M10 × 1.5mm pitch, 50mm length)',
      '100% metallurgical match (SS304 Austenitic Stainless Steel)'
    ],
    submittedAt: '2026-08-29 08:30 IST'
  },
  {
    id: 'REV-002',
    candidateId: 'CAND-8499',
    candidate: INITIAL_CANDIDATES[1],
    priority: 'Critical',
    status: 'High Priority',
    assignedRole: 'Chief Mechanical Engineer',
    differenceAnalysis: [
      'CRITICAL: Nominal Length differs (50 mm vs 60 mm)',
      'High semantic text similarity (94.8%) is misleading',
      'Engineering safety rules mandate separate inventory stock codes'
    ],
    submittedAt: '2026-08-29 09:15 IST'
  },
  {
    id: 'REV-003',
    candidateId: 'CAND-8493',
    bmgProposedId: 'BMG-PMP-000031908',
    candidate: INITIAL_CANDIDATES[2],
    priority: 'High',
    status: 'Pending',
    assignedRole: 'Material Master Officer',
    differenceAnalysis: [
      'Both align with API 610 OH2 specification',
      'Nozzle configuration matches (80mm x 100mm)',
      'UOM difference resolved: SET vs NOS'
    ],
    submittedAt: '2026-08-29 07:50 IST'
  },
  {
    id: 'REV-004',
    candidateId: 'CAND-8495',
    candidate: INITIAL_CANDIDATES[4],
    priority: 'Medium',
    status: 'Needs More Data',
    assignedRole: 'CPSE Master Auditor',
    differenceAnalysis: [
      'NTPC record lacks explicit ASTM grade specification',
      'Requires NTPC Nodal Officer verification of MTC (Mill Test Certificate)'
    ],
    submittedAt: '2026-08-29 05:20 IST'
  }
];

export const INITIAL_QUALITY_ISSUES: QualityIssue[] = [
  {
    id: 'ISS-001',
    issueType: 'Missing Grade',
    cpseCode: 'SAIL',
    cpseName: 'Steel Authority of India Limited',
    affectedRecordsCount: 1240,
    severity: 'High',
    status: 'Open',
    field: 'material_grade',
    sampleRecord: 'HEX BOLT M12X60 CARBON STEEL (No Grade Specified)',
    suggestedFix: 'Extract implied Grade 8.8 / 10.9 based on high-tensile structural standard or request CPSE catalog enrichment.',
    lastDetected: '2026-08-29 08:00 IST'
  },
  {
    id: 'ISS-002',
    issueType: 'Invalid UOM',
    cpseCode: 'NTPC',
    cpseName: 'NTPC Limited',
    affectedRecordsCount: 450,
    severity: 'Medium',
    status: 'In Progress',
    field: 'uom',
    sampleRecord: 'GASKET TEFLON 2INCH [UOM: PKT]',
    suggestedFix: 'Convert non-standard packet (PKT) units into discrete item count (NOS/EA) via packaging breakdown multiplier.',
    lastDetected: '2026-08-29 09:30 IST'
  },
  {
    id: 'ISS-003',
    issueType: 'Missing Dimensions',
    cpseCode: 'CIL',
    cpseName: 'Coal India Limited',
    affectedRecordsCount: 890,
    severity: 'High',
    status: 'Open',
    field: 'dimensions',
    sampleRecord: 'CONVEYOR BELT NYLON HEAT RESISTANT',
    suggestedFix: 'Flag record for width (mm), ply rating, and cover thickness before generating harmonization candidate.',
    lastDetected: '2026-08-28 17:40 IST'
  },
  {
    id: 'ISS-004',
    issueType: 'Duplicate Material Code',
    cpseCode: 'BPCL',
    cpseName: 'Bharat Petroleum Corporation Limited',
    affectedRecordsCount: 89,
    severity: 'Low',
    status: 'Resolved',
    field: 'local_material_code',
    sampleRecord: 'MAT-10291 mapped twice under disparate ERP sub-plants',
    suggestedFix: 'Merged internal plant duplicate codes into unified BPCL master item code.',
    lastDetected: '2026-08-27 14:15 IST'
  },
  {
    id: 'ISS-005',
    issueType: 'Non-Standard Abbreviation',
    cpseCode: 'ONGC',
    cpseName: 'Oil and Natural Gas Corporation',
    affectedRecordsCount: 620,
    severity: 'Medium',
    status: 'Open',
    field: 'description',
    sampleRecord: 'STNLS STL VLV GT 4" CL150',
    suggestedFix: 'Automated expansion via Bharat Domain Dictionary: STNLS STL -> Stainless Steel, VLV GT -> Gate Valve.',
    lastDetected: '2026-08-29 10:00 IST'
  }
];

export const INITIAL_PROCUREMENT_OPPORTUNITIES: ProcurementOpportunity[] = [
  {
    id: 'OPP-1042',
    opportunityNumber: 1042,
    title: 'National Rate Contract: Class 150 Flanged Gate Valves',
    category: 'Industrial Valves',
    bmgMaterialId: 'BMG-VLV-000045922',
    bmgMaterialName: 'Gate Valve, Flanged Class 150 (4 Inch DN100 WCB)',
    participatingCPSEs: ['IOCL', 'ONGC', 'BPCL', 'GAIL', 'CPCL', 'HPCL'],
    totalAggregatedDemandUnits: 18450,
    uom: 'Nos',
    estimatedBaselineSpendINR: 354609000, // ~35.46 Cr
    projectedSavingsINR: 70212000, // ~7.02 Cr
    projectedSavingsPercent: 19.8,
    consolidationPotential: 'HIGH',
    activeSuppliersCount: 11,
    contractCycle: 'Q3-Q4 Annual Framework',
    status: 'Active',
    highlights: [
      '6 major CPSEs currently purchasing via 14 separate regional purchase orders.',
      'Unit price variance across CPSEs ranges from ₹18,500 (IOCL bulk) to ₹20,100 (BPCL spot).',
      'Consolidating into a unified single national rate contract guarantees Tier-3 volume rebate of 19.8%.'
    ],
    leadCPSE: 'IOCL'
  },
  {
    id: 'OPP-1043',
    opportunityNumber: 1043,
    title: 'Aggregated Fasteners Sourcing: SS304 M10x50 Hex Bolts',
    category: 'Fasteners',
    bmgMaterialId: 'BMG-FST-000001284',
    bmgMaterialName: 'Stainless Steel Hex Bolt (M10 × 50 mm SS304)',
    participatingCPSEs: ['ONGC', 'IOCL', 'BPCL', 'CPCL'],
    totalAggregatedDemandUnits: 75600,
    uom: 'Nos',
    estimatedBaselineSpendINR: 3415608,
    projectedSavingsINR: 560159,
    projectedSavingsPercent: 16.4,
    consolidationPotential: 'HIGH',
    activeSuppliersCount: 7,
    contractCycle: 'Immediate Joint Tender',
    status: 'Active',
    highlights: [
      'Aggregated volume exceeds minimum manufacturer batch run of 50,000 units.',
      'Direct mill sourcing bypasses Tier-2 hardware distributor markups.',
      'Lead time reduction from 21 days to 10 days with pooled regional buffer stocks.'
    ],
    leadCPSE: 'ONGC'
  },
  {
    id: 'OPP-1044',
    opportunityNumber: 1044,
    title: 'Power & Steel Sector Combined: Heavy-Duty Armoured Copper Cables',
    category: 'Electrical Cables',
    bmgMaterialId: 'BMG-ELC-000099415',
    bmgMaterialName: 'Armoured Copper Power Cable 3.5C × 185 sq.mm',
    participatingCPSEs: ['NTPC', 'SAIL', 'BHEL', 'CIL'],
    totalAggregatedDemandUnits: 63000,
    uom: 'Meters',
    estimatedBaselineSpendINR: 158445000,
    projectedSavingsINR: 21390000,
    projectedSavingsPercent: 13.5,
    consolidationPotential: 'VERY HIGH',
    activeSuppliersCount: 7,
    contractCycle: 'Biannual Rate Contract',
    status: 'In Evaluation',
    highlights: [
      'NTPC & SAIL collective demand allows raw copper price hedging on MCX.',
      'Standardized test certifications eliminate duplicate third-party witness inspection fees.'
    ],
    leadCPSE: 'NTPC'
  },
  {
    id: 'OPP-1045',
    opportunityNumber: 1045,
    title: 'Refinery Hydrocarbon Linepipe Framework: 6" Seamless CS Pipes',
    category: 'Pipes',
    bmgMaterialId: 'BMG-PIP-000088103',
    bmgMaterialName: 'Seamless Carbon Steel Pipe (6 Inch Schedule 40 ASTM A106)',
    participatingCPSEs: ['IOCL', 'ONGC', 'GAIL', 'BPCL'],
    totalAggregatedDemandUnits: 142000,
    uom: 'Meters',
    estimatedBaselineSpendINR: 546700000,
    projectedSavingsINR: 77631400,
    projectedSavingsPercent: 14.2,
    consolidationPotential: 'HIGH',
    activeSuppliersCount: 9,
    contractCycle: 'Q3-Q4 Annual Framework',
    status: 'Tender Drafted',
    highlights: [
      'Bulk mill rolling reservation with domestic pipe mills under Make In India (PPO-MII).',
      'Centralized quality inspection via Directorate General of Quality Assurance.'
    ],
    leadCPSE: 'GAIL'
  }
];

export const INITIAL_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: 'AUD-9012',
    timestamp: '2026-08-29 11:42:10 IST',
    user: 'Dr. Vivek Menon',
    userRole: 'National Master Data Committee',
    cpse: 'ONGC / IOCL',
    action: 'Material mapping approved',
    materialId: 'BMG-FST-000001284',
    previousValue: 'Draft Candidate Pair #8492',
    newValue: 'Approved BMG Identity Mapping',
    reason: 'Verified 100% metallurgical & dimension equivalence (SS304, M10x50mm)',
    modelVersion: 'BMG-FastText-Transformer-v2.4',
    verificationHash: 'sha256:8f9a2b7c4d1e3f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a'
  },
  {
    id: 'AUD-9011',
    timestamp: '2026-08-29 10:15:04 IST',
    user: 'AI Governance Engine',
    userRole: 'Automated Spec Guard',
    cpse: 'ONGC / BPCL',
    action: 'Candidate routed to human review',
    materialId: 'CAND-8499',
    previousValue: 'Automated Matching Queue',
    newValue: 'Critical Mismatch Flagged (Length 50mm ≠ 60mm)',
    reason: 'False-positive prevention: Length dimension mismatch prevents safe interchangeability.',
    modelVersion: 'BMG-FastText-Transformer-v2.4',
    verificationHash: 'sha256:1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b'
  },
  {
    id: 'AUD-9010',
    timestamp: '2026-08-29 09:30:22 IST',
    user: 'Rajesh Sharma',
    userRole: 'CPSE Administrator (IOCL)',
    cpse: 'IOCL',
    action: 'Dataset uploaded',
    materialId: 'BATCH-IOCL-2026-08',
    previousValue: 'None',
    newValue: '12,450 records ingested for validation',
    reason: 'Monthly refinery master data sync',
    modelVersion: 'N/A',
    verificationHash: 'sha256:7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d'
  },
  {
    id: 'AUD-9009',
    timestamp: '2026-08-28 16:20:45 IST',
    user: 'National Admin',
    userRole: 'National Administrator',
    cpse: 'All CPSEs',
    action: 'Standardization rule updated',
    materialId: 'RULE-FST-04',
    previousValue: 'Rule v1.3 (Regex strictly metric)',
    newValue: 'Rule v1.4 (Added ISO 4014 / DIN 931 cross-reference)',
    reason: 'Enhanced fastener normalization dictionary',
    modelVersion: 'BMG-FastText-Transformer-v2.4',
    verificationHash: 'sha256:3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d'
  },
  {
    id: 'AUD-9008',
    timestamp: '2026-08-28 11:05:12 IST',
    user: 'System Orchestrator',
    userRole: 'Model Release Manager',
    cpse: 'Platform Infrastructure',
    action: 'Model version deployed',
    materialId: 'MOD-V2.4.1',
    previousValue: 'v2.3.9 (Precision 98.4%)',
    newValue: 'v2.4.1 (Precision 99.2%, False Merge Rate 0.04%)',
    reason: 'Trained on 4.5 lakh verified CPSE master records',
    modelVersion: 'BMG-FastText-Transformer-v2.4.1',
    verificationHash: 'sha256:9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f'
  }
];

export const INITIAL_RULES: StandardizationRule[] = [
  {
    id: 'RULE-001',
    ruleCode: 'RULE-FASTENER-NORM',
    description: 'Expands fastener abbreviations (SS, HEX, BLT, NUT, SCR) and standardizes metric thread syntax (M[0-9]+ × [0-9]+ mm).',
    targetCategory: 'Fasteners',
    version: 'v2.4',
    status: 'Active',
    lastUpdated: '2026-08-20',
    author: 'Bureau of Indian Standards / BMG Committee',
    regexPattern: '(SS|HEX|BLT|SCR|M\\d+)',
    autoAction: 'Normalize'
  },
  {
    id: 'RULE-002',
    ruleCode: 'RULE-VALVE-PRESSURE',
    description: 'Requires explicit ASME / API pressure class rating (e.g. 150#, 300#, 600#) before allowing automated candidate generation.',
    targetCategory: 'Industrial Valves',
    version: 'v2.1',
    status: 'Active',
    lastUpdated: '2026-08-15',
    author: 'Chief Piping Engineer Council',
    autoAction: 'Flag Incomplete'
  },
  {
    id: 'RULE-003',
    ruleCode: 'RULE-PIPE-SCHEDULE',
    description: 'Converts legacy imperial wall thickness into ASME B36.10M Schedule standards (SCH 10, 20, 40, 80, 160, XXS).',
    targetCategory: 'Pipes',
    version: 'v1.8',
    status: 'Active',
    lastUpdated: '2026-08-10',
    author: 'Directorate of Industrial Safety',
    autoAction: 'Normalize'
  },
  {
    id: 'RULE-004',
    ruleCode: 'RULE-UOM-METRIC',
    description: 'Rejects non-SI unit representations (e.g. BDL, PKT, LOT) and prompts conversion to standard discrete units (NOS, SET, MTR).',
    targetCategory: 'All Categories',
    version: 'v3.0',
    status: 'Active',
    lastUpdated: '2026-08-01',
    author: 'Master Data Governance Directorate',
    autoAction: 'Flag Incomplete'
  }
];

export const INITIAL_DICTIONARY: DomainDictionaryItem[] = [
  { id: 'dict-1', abbreviation: 'SS', expandedTerm: 'Stainless Steel', category: 'Materials', usageCount: 48290, status: 'Approved' },
  { id: 'dict-2', abbreviation: 'CS', expandedTerm: 'Carbon Steel', category: 'Materials', usageCount: 61400, status: 'Approved' },
  { id: 'dict-3', abbreviation: 'HEX', expandedTerm: 'Hexagonal', category: 'Fasteners', usageCount: 39120, status: 'Approved' },
  { id: 'dict-4', abbreviation: 'BLT', expandedTerm: 'Bolt', category: 'Fasteners', usageCount: 32400, status: 'Approved' },
  { id: 'dict-5', abbreviation: 'SMLS', expandedTerm: 'Seamless', category: 'Piping', usageCount: 28900, status: 'Approved' },
  { id: 'dict-6', abbreviation: 'FLG / FLGD', expandedTerm: 'Flanged', category: 'Valves & Piping', usageCount: 41200, status: 'Approved' },
  { id: 'dict-7', abbreviation: 'WCB', expandedTerm: 'ASTM A216 Cast Carbon Steel Gr. WCB', category: 'Materials', usageCount: 19800, status: 'Approved' },
  { id: 'dict-8', abbreviation: 'BRG', expandedTerm: 'Bearing', category: 'Mechanical', usageCount: 15400, status: 'Approved' },
  { id: 'dict-9', abbreviation: 'OS&Y', expandedTerm: 'Outside Screw and Yoke', category: 'Valves', usageCount: 14200, status: 'Approved' },
  { id: 'dict-10', abbreviation: 'SWG', expandedTerm: 'Spiral Wound Gasket', category: 'Gaskets', usageCount: 21800, status: 'Approved' },
  { id: 'dict-11', abbreviation: 'PMP', expandedTerm: 'Pump', category: 'Rotating Equipment', usageCount: 12900, status: 'Approved' },
  { id: 'dict-12', abbreviation: 'XLPE', expandedTerm: 'Cross-Linked Polyethylene', category: 'Electrical', usageCount: 18400, status: 'Approved' }
];

export const INITIAL_AI_MODELS: AIModelVersion[] = [
  {
    modelName: 'BMG-FastText-Transformer',
    version: 'v2.4.1 (Current Production)',
    precision: 99.2,
    recall: 98.6,
    f1Score: 98.9,
    falseMergeRate: 0.04,
    deploymentStatus: 'Production Active',
    trainedOnRecords: 450000,
    lastDeployed: '2026-08-28 11:00 IST'
  },
  {
    modelName: 'BMG-FastText-Transformer',
    version: 'v2.4.0',
    precision: 98.7,
    recall: 98.1,
    f1Score: 98.4,
    falseMergeRate: 0.09,
    deploymentStatus: 'Staging',
    trainedOnRecords: 380000,
    lastDeployed: '2026-07-15 14:30 IST'
  },
  {
    modelName: 'BMG-Engineering-BERT-DualEncoder',
    version: 'v3.0.0-RC1 (Candidate)',
    precision: 99.6,
    recall: 99.1,
    f1Score: 99.35,
    falseMergeRate: 0.015,
    deploymentStatus: 'Candidate',
    trainedOnRecords: 620000,
    lastDeployed: '2026-08-27 18:00 IST'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'High Confidence AI Match Ready',
    message: 'Pair #8492 (SS BOLT M10x50 ONGC vs IOCL) has 96.2% AI match score and passed all specification checks.',
    type: 'success',
    timestamp: '10 mins ago',
    read: false,
    actionTab: 'ai-match',
    actionPayload: 'CAND-8492'
  },
  {
    id: 'notif-2',
    title: 'Critical Specification Mismatch Detected',
    message: 'Pair #8499 has 94.8% semantic score but Length differs (50mm vs 60mm). Auto-merge blocked and routed to review.',
    type: 'warning',
    timestamp: '25 mins ago',
    read: false,
    actionTab: 'review-queue',
    actionPayload: 'REV-002'
  },
  {
    id: 'notif-3',
    title: 'New Procurement Opportunity Detected',
    message: 'Opportunity #1042: 6 CPSEs require 18,450 units of Class 150 Gate Valves. Projected savings: ₹7.02 Crore.',
    type: 'info',
    timestamp: '1 hour ago',
    read: false,
    actionTab: 'procurement',
    actionPayload: 'OPP-1042'
  },
  {
    id: 'notif-4',
    title: 'NTPC Master Dataset Uploaded',
    message: 'NTPC uploaded 12,450 records. 92% validation pass rate, 450 records have invalid UOM.',
    type: 'info',
    timestamp: '3 hours ago',
    read: true,
    actionTab: 'upload'
  },
  {
    id: 'notif-5',
    title: 'AI Model v2.4.1 Deployed to Production',
    message: 'False merge rate reduced to 0.04% across 4.5 lakh verified CPSE master items.',
    type: 'info',
    timestamp: '1 day ago',
    read: true,
    actionTab: 'admin'
  }
];
