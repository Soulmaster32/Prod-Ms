/**
 * Quality Group | MS Section - S.O.P & QA Procedure Management Module
 * File: js/sopmanual.js
 * Description: Standalone CRUD, Document Hub, History Auditor, Attachment Handler, and Data Import Analyzer.
 */

(function () {
    'use strict';

    // Storage Keys
    const STORAGE_KEY = 'QAGroup_SOP_Manuals_v1';
    const HISTORY_KEY = 'QAGroup_SOP_History_v1';

    // Separated Default Data Information (Hydrometallurgical & MS Product Operations)
    const DEFAULT_SOP_DATA = [
        {
            id: 'sop-fn-104',
            code: 'SOP-FN-104',
            title: 'Discharge Slurry pH & Flocculant Dosing Protocol',
            category: 'S.O.P Manual',
            area: 'FNTRL Area',
            revision: 'Rev 4.2',
            status: 'Active',
            effectiveDate: '2026-01-15',
            author: 'Engr. Marcus Vance (Lead QA Chemist)',
            department: 'Hydrometallurgy Quality Group',
            summary: 'Standard operating procedure for regulating discharge slurry pH within the 8.2 - 8.6 tolerance window and automating milk-of-lime flocculant dosing to prevent tailings overflow.',
            steps: [
                { step: 1, title: 'Pre-Operational Telemetry Check', detail: 'Verify Sub DCS field node #FN-01 is synced with the Master DCS Control Room. Ensure pH electrode calibration status is green.' },
                { step: 2, title: 'Slurry Sampling & Titration', detail: 'Draw a 500mL slurry sample from discharge valve #302 every 2 hours. Measure ambient pH using the calibrated benchtop electrode.' },
                { step: 3, title: 'Flocculant Stroke Adjustment', detail: 'If pH drops below 8.2, increase milk-of-lime dosing stroke by 5% increments via local Sub DCS override until nominal equilibrium is restored.' },
                { step: 4, title: 'Residue Loss Verification', detail: 'Perform atomic absorption spectrometry (AAS) assay to ensure residual Nickel/Cobalt loss in tailings remains below < 0.05 g/L.' }
            ],
            hazards: 'Corrosive alkaline slurry and severe slip hazard around overflow launder. Mandatory PPE: Acid-resistant nitrile gloves, full face shield, chemical apron, and steel-toe rubber boots.',
            attachments: [
                { name: 'FNTRL_Titration_Log_Sheet_v4.xlsx', size: '48 KB', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', dataUrl: 'data:text/plain;base64,U2ltdWxhdGVkIFhMU1ggRGF0YSBmb3IgRk5UUkwgVGl0cmF0aW9u' },
                { name: 'Slurry_Valve_302_Schematic.pdf', size: '1.4 MB', type: 'application/pdf', dataUrl: 'data:text/plain;base64,U2ltdWxhdGVkIFBERiBTY2hlbWF0aWM=' }
            ],
            createdAt: '2025-11-10T08:00:00Z',
            updatedAt: '2026-06-20T14:30:00Z'
        },
        {
            id: 'sop-ms-101',
            code: 'SOP-MS-101',
            title: 'Zinc Extraction Titration & Solvent Separation',
            category: 'S.O.P Manual',
            area: 'MS-Dezinc Area',
            revision: 'Rev 4.0',
            status: 'Active',
            effectiveDate: '2026-02-01',
            author: 'Dr. Elena Rostova (Senior Solvent Extraction QA)',
            department: 'MS Section Production Dept',
            summary: 'Defines analytical titration routines to monitor selective zinc removal efficiency (> 99.4%) from mixed nickel-cobalt sulfide solution without degrading organic phase extractants.',
            steps: [
                { step: 1, title: 'Organic Phase Sampling', detail: 'Extract 250mL of organic extractant from Stage 1 Mixer-Settler weir. Visually inspect for third-phase emulsion or organic crud formation.' },
                { step: 2, title: 'Phase Separation Timing Assay', detail: 'In a 500mL graduated cylinder, mix organic and aqueous phases at 1:1 ratio for 60 seconds. Record exact phase separation disengagement time (Nominal limit: 60 - 90 sec).' },
                { step: 3, title: 'Zinc Stripping Titration', detail: 'Titrate stripped aqueous phase using 0.1M EDTA standardized solution with Eriochrome Black T indicator to determine residual zinc concentration.' }
            ],
            hazards: 'Volatile organic solvents and flammable vapors. Work strictly under active fume extraction hoods. Keep ignition sources away. Mandatory PPE: Organic vapor respirator, anti-static footwear.',
            attachments: [
                { name: 'Dezinc_Solvent_Ratio_Chart.pdf', size: '850 KB', type: 'application/pdf', dataUrl: 'data:text/plain;base64,U2ltdWxhdGVkIFBERiBSYXRpbyBDaGFydA==' }
            ],
            createdAt: '2025-12-05T10:15:00Z',
            updatedAt: '2026-06-15T09:20:00Z'
        },
        {
            id: 'sop-h2s-204',
            code: 'SOP-H2S-204',
            title: 'Toxic Gas Scrubber & Caustic Neutralization QA',
            category: 'S.O.P Manual',
            area: 'H2S Area',
            revision: 'Rev 2.0',
            status: 'Active',
            effectiveDate: '2025-10-12',
            author: 'Engr. Kenji Sato (Plant Safety & DCS Lead)',
            department: 'Gas Generation & Safety Group',
            summary: 'Safety critical protocol for monitoring Hydrogen Sulfide (H2S) gas purity (> 99.6% Vol) and calibrating emergency caustic neutralization scrubber loops to prevent atmospheric release.',
            steps: [
                { step: 1, title: 'Ambient Gas Sensor Verification', detail: 'Execute daily bump test on fixed H2S gas detectors around plant perimeter using 15 ppm H2S calibration gas cylinder.' },
                { step: 2, title: 'Scrubber Caustic pH Audit', detail: 'Check continuous pH telemetry of scrubber recirculation tank. Ensure caustic soda (NaOH) concentration maintains solution pH strictly between 10.5 - 11.0 pH.' },
                { step: 3, title: 'Emergency ESD Loop Interlock Test', detail: 'Simulate high-pressure trip signal at Sub DCS Station #H2S-02 to verify automatic quick-acting isolation valve closure within < 3 seconds.' }
            ],
            hazards: 'EXTREME DANGER: Hydrogen Sulfide is highly toxic and flammable at low concentrations. Immediate asphyxiation hazard. Mandatory PPE: Supplied-air breathing apparatus (SCBA), personal H2S monitor.',
            attachments: [
                { name: 'H2S_Emergency_Evacuation_Map.pdf', size: '2.1 MB', type: 'application/pdf', dataUrl: 'data:text/plain;base64,U2ltdWxhdGVkIEgyUyBFdmFjdWF0aW9uIE1hcA==' }
            ],
            createdAt: '2025-10-01T11:00:00Z',
            updatedAt: '2026-05-30T16:45:00Z'
        },
        {
            id: 'sop-fn-309',
            code: 'SOP-FN-309',
            title: 'Effluent Slurry pH Interlock & Valve Actuation Test',
            category: 'S.O.P Manual',
            area: 'FNTRL Area',
            revision: 'Rev 3.1',
            status: 'Under Review',
            effectiveDate: '2026-07-01',
            author: 'Engr. Marcus Vance (Lead QA Chemist)',
            department: 'Hydrometallurgy Quality Group',
            summary: 'Bi-monthly verification procedure testing automated valve actuation loops that divert out-of-spec effluent slurry back to neutralization tanks when pH exceeds emergency thresholds.',
            steps: [
                { step: 1, title: 'DCS Loop Isolation', detail: 'Coordinate with Master DCS Control Room to place Effluent Line #4 in manual test mode.' },
                { step: 2, title: 'Simulated pH Spike Calibration', detail: 'Inject pH 9.5 buffer solution into inline optical sensor assembly.' },
                { step: 3, title: 'Actuation Response Timing', detail: 'Measure time elapsed between DCS alarm trigger and pneumatic diverter valve full stroke rotation. Maximum allowable latency is 4.5 seconds.' }
            ],
            hazards: 'Pneumatic mechanical pinch points and pressurized slurry discharge. Lockout/Tagout (LOTO) required before servicing actuator assemblies.',
            attachments: [],
            createdAt: '2026-06-01T14:00:00Z',
            updatedAt: '2026-07-02T10:10:00Z'
        },
        {
            id: 'sop-ls-402',
            code: 'SOP-LS-402',
            title: 'Limestone Slurry Mesh Particle Titration Assay',
            category: 'S.O.P Manual',
            area: 'Limestone Area',
            revision: 'Rev 1.8',
            status: 'Active',
            effectiveDate: '2026-03-20',
            author: 'Mariano Santos (QA Laboratory Technician)',
            department: 'Reagent Preparation QA',
            summary: 'Laboratory method for determining particle size distribution of milled limestone reagent to guarantee minimum reactivity (95% passing < 325 mesh) for heavy metal precipitation.',
            steps: [
                { step: 1, title: 'Slurry Density Determination', detail: 'Use calibrated Marcy scale to measure limestone slurry density. Target density is 1.35 g/cm³.' },
                { step: 2, title: 'Wet Sieving Analysis', detail: 'Wash 100g of dried slurry solids through standard 325 mesh (44 micron) stainless steel test sieve using low-pressure deionized water spray.' },
                { step: 3, title: 'Gravimetric Calculation', detail: 'Dry retained oversize fraction in laboratory oven at 105°C for 60 minutes. Weigh residue and compute percentage passing.' }
            ],
            hazards: 'Airborne limestone dust during sample drying. Respiratory irritation. Mandatory PPE: N95 dust mask, safety goggles, thermal gloves when handling drying oven.',
            attachments: [
                { name: 'Limestone_Particle_Mesh_Standard.pdf', size: '512 KB', type: 'application/pdf', dataUrl: 'data:text/plain;base64,U2ltdWxhdGVkIFBERiBNZXNoIFN0YW5kYXJk' }
            ],
            createdAt: '2026-01-10T09:30:00Z',
            updatedAt: '2026-06-18T13:15:00Z'
        },
        {
            id: 'qa-proc-001',
            code: 'QA-PROC-001',
            title: 'Zero-Defect Slurry Sampling & Chain of Custody',
            category: 'QA Procedure',
            area: 'DCS Control',
            revision: 'Rev 5.0',
            status: 'Active',
            effectiveDate: '2026-01-01',
            author: 'Engr. Marcus Vance (Lead QA Chemist)',
            department: 'Quality Assurance Directorate',
            summary: 'Mandatory plant-wide quality assurance procedure dictating sterile sampling techniques, tamper-evident barcoding, and digital logging of all metallurgical samples transferred to Quality Lab HQ.',
            steps: [
                { step: 1, title: 'Sample Container Preparation', detail: 'Use pre-cleaned, acid-washed 1000mL polyethylene bottles. Affix waterproof QR code tracking label before entering processing zones.' },
                { step: 2, title: 'Line Purging Protocol', detail: 'Purge sample port valve for 15 seconds into chemical drain before collecting official assay sample to eliminate stagnant pipe buildup.' },
                { step: 3, title: 'Digital LIMS Logging', detail: 'Scan QR code using mobile field tablet immediately upon collection. Record temperature, operator ID, and Sub DCS timestamp.' }
            ],
            hazards: 'General plant chemical exposure. Follow area-specific safety requirements based on sampling zone.',
            attachments: [
                { name: 'Chain_Of_Custody_Form_Template.docx', size: '120 KB', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', dataUrl: 'data:text/plain;base64,U2ltdWxhdGVkIERPQ1ggQ2hhaW4gb2YgQ3VzdG9keQ==' }
            ],
            createdAt: '2025-08-15T08:00:00Z',
            updatedAt: '2026-06-25T11:00:00Z'
        },
        {
            id: 'qa-proc-002',
            code: 'QA-PROC-002',
            title: 'Analytical Instrument Calibration & Drift Audit',
            category: 'QA Procedure',
            area: 'DCS Control',
            revision: 'Rev 2.3',
            status: 'Active',
            effectiveDate: '2026-04-10',
            author: 'Dr. Elena Rostova (Senior Solvent Extraction QA)',
            department: 'Quality Assurance Directorate',
            summary: 'Establishes weekly calibration schedules and acceptable drift tolerances for all benchtop atomic absorption spectrometers, pH meters, and automated titrators in Quality Lab HQ.',
            steps: [
                { step: 1, title: 'Multi-Point Calibration', detail: 'Calibrate benchtop pH electrodes using NIST-traceable standard buffers at pH 4.01, 7.00, and 10.01 daily prior to shift start.' },
                { step: 2, title: 'Drift Tolerance Audit', detail: 'If instrument measurement drifts by > ±0.05 pH units during mid-shift verification, flag sensor for immediate chemical cleaning and re-titration.' }
            ],
            hazards: 'Handling chemical calibration buffers and mild acidic cleaning solutions. Safety goggles required.',
            attachments: [],
            createdAt: '2026-02-14T15:00:00Z',
            updatedAt: '2026-06-28T09:45:00Z'
        },
        {
            id: 'qa-proc-003',
            code: 'QA-PROC-003',
            title: 'Near Miss Investigation & Corrective CAPA Workflow',
            category: 'QA Procedure',
            area: 'DCS Control',
            revision: 'Rev 3.0',
            status: 'Active',
            effectiveDate: '2026-05-01',
            author: 'Engr. Kenji Sato (Plant Safety & DCS Lead)',
            department: 'Quality Assurance Directorate',
            summary: 'Standardized quality procedure for investigating field Near Misses, identifying root-cause mechanical or DCS telemetry failures, and enforcing Corrective & Preventive Action (CAPA) closures within 7 days.',
            steps: [
                { step: 1, title: 'Immediate Hazard Containment', detail: 'Upon logging a Near Miss in the QA Portal, shift supervisor must isolate affected valve or pump loop within 2 hours.' },
                { step: 2, title: '5-Why Root Cause Analysis', detail: 'Convene engineering team to execute 5-Why root cause investigation. Document telemetry logs from Sub DCS archive.' },
                { step: 3, title: 'CAPA Implementation & Sign-off', detail: 'Assign corrective action to maintenance team. Lead QA Chemist must physically inspect resolution before marking portal incident as 100% CAPA Closed.' }
            ],
            hazards: 'Administrative and field inspection procedure. Always wear hardhat, safety glasses, and high-visibility vest during site investigations.',
            attachments: [
                { name: 'CAPA_Root_Cause_Worksheet.pdf', size: '640 KB', type: 'application/pdf', dataUrl: 'data:text/plain;base64,U2ltdWxhdGVkIFBERiBDQVBBIFdvcmtzaGVldA==' }
            ],
            createdAt: '2026-04-01T10:00:00Z',
            updatedAt: '2026-07-01T14:20:00Z'
        }
    ];

    // Default History Logs
    const DEFAULT_HISTORY_DATA = [
        { id: 'hist-001', sopId: 'sop-fn-104', sopCode: 'SOP-FN-104', timestamp: '2026-06-20 14:30 PM', user: 'Engr. Marcus Vance', action: 'REVISION_UPDATE', details: 'Updated slurry pH upper tolerance limit from 8.5 to 8.6 following DCS loop recalibration.' },
        { id: 'hist-002', sopId: 'sop-ms-101', sopCode: 'SOP-MS-101', timestamp: '2026-06-15 09:20 AM', user: 'Dr. Elena Rostova', action: 'AUDIT_REVIEW', details: 'Routine annual audit completed. Marked as zero-defect compliant; retained active status.' },
        { id: 'hist-003', sopId: 'sop-fn-309', sopCode: 'SOP-FN-309', timestamp: '2026-07-02 10:10 AM', user: 'Engr. Marcus Vance', action: 'STATUS_CHANGE', details: 'Changed status from Active to Under Review for scheduled bi-monthly interlock testing.' },
        { id: 'hist-004', sopId: 'qa-proc-001', sopCode: 'QA-PROC-001', timestamp: '2026-06-25 11:00 AM', user: 'Mariano Santos', action: 'ATTACHMENT_ADDED', details: 'Uploaded new Chain_Of_Custody_Form_Template.docx (Rev 5.0).' },
        { id: 'hist-005', sopId: 'qa-proc-003', sopCode: 'QA-PROC-003', timestamp: '2026-07-01 14:20 PM', user: 'Engr. Kenji Sato', action: 'CREATED', details: 'Initial release of standardized CAPA workflow procedure.' }
    ];

    // Application State
    let sopList = [];
    let historyList = [];
    let currentCategoryFilter = 'ALL';
    let currentAreaFilter = 'ALL';
    let currentSearchQuery = '';
    let currentEditingId = null;
    let tempAttachments = [];
    let analyzedImportData = null;

    // Initialize Module
    function init() {
        loadData();
        injectUI();
        bindEvents();
        bindSidebarInterception();
        render();
        console.log('✅ SOPManual & QA Procedure Module successfully initialized.');
    }

    // Load Data from LocalStorage or Seed Default
    function loadData() {
        try {
            const storedSops = localStorage.getItem(STORAGE_KEY);
            const storedHist = localStorage.getItem(HISTORY_KEY);
            sopList = storedSops ? JSON.parse(storedSops) : DEFAULT_SOP_DATA;
            historyList = storedHist ? JSON.parse(storedHist) : DEFAULT_HISTORY_DATA;
        } catch (e) {
            console.error('Error loading SOP data from LocalStorage, resetting to default:', e);
            sopList = DEFAULT_SOP_DATA;
            historyList = DEFAULT_HISTORY_DATA;
            saveData();
        }
    }

    // Save Data to LocalStorage
    function saveData() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sopList));
            localStorage.setItem(HISTORY_KEY, JSON.stringify(historyList));
        } catch (e) {
            console.error('Error saving SOP data to LocalStorage:', e);
        }
    }

    // Add Entry to Audit History
    function addHistoryLog(sopId, sopCode, action, details) {
        const log = {
            id: 'hist-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
            sopId: sopId,
            sopCode: sopCode,
            timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            user: 'Engr. Marcus Vance (Logged-in QA Admin)',
            action: action,
            details: details
        };
        historyList.unshift(log);
        saveData();
    }

    // Intercept Sidebar Menu Clicks
    function bindSidebarInterception() {
        const sidebarLinks = document.querySelectorAll('#sidebarMenu a[href="#sop-section"]');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const text = this.innerText.trim();
                if (text.includes('S.O.P')) {
                    switchTab('S.O.P Manual');
                } else if (text.includes('Procedure')) {
                    switchTab('QA Procedure');
                } else {
                    switchTab('ALL');
                }
                const section = document.getElementById('sop-section');
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                }
                if (typeof window.closeSidebarOnMobile === 'function') {
                    window.closeSidebarOnMobile();
                }
            });
        });
    }

    // Inject Main Interactive UI into #sop-section
    function injectUI() {
        const container = document.getElementById('sop-section');
        if (!container) return;

        container.className = "py-16 px-4 sm:px-8 bg-dark-900 border-b border-slate-800/80 relative transition-all";
        container.innerHTML = `
            <div class="max-w-7xl mx-auto">
                <!-- Section Header & Quick Stats -->
                <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10" data-aos="fade-up">
                    <div>
                        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-sky-500/10 text-sky-400 font-bold text-xs mb-3 border border-sky-500/20 shadow-inner">
                            <i class="fas fa-book-reader"></i> Standardization & Quality Compliance Hub
                        </div>
                        <h3 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                            S.O.P Manuals & QA Procedure Directory
                        </h3>
                        <p class="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
                            Central repository for analytical extraction methods, chemical titration protocols, and automated DCS interlock checklists. All revisions enforce strict zero-defect standards.
                        </p>
                    </div>

                    <!-- Action Buttons Bar -->
                    <div class="flex flex-wrap items-center gap-3">
                        <button onclick="SOPManual.openCreateModal()" class="px-4 py-2.5 bg-gradient-to-r from-royalblue-600 to-sky-500 hover:from-royalblue-500 hover:to-sky-400 text-white font-bold text-xs sm:text-sm rounded-xl shadow-[0_0_15px_rgba(14,165,233,0.3)] transition-all flex items-center gap-2">
                            <i class="fas fa-plus-circle"></i> Create New S.O.P
                        </button>
                        <button onclick="SOPManual.openImportModal()" class="px-4 py-2.5 bg-dark-500 hover:bg-dark-400 border border-cyan-500/30 text-cyan-300 hover:text-white font-semibold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-2 shadow">
                            <i class="fas fa-file-import text-cyan-400"></i> Upload & Analyze Data
                        </button>
                        <button onclick="SOPManual.exportLibrary('json')" class="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 hover:text-white font-semibold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-2">
                            <i class="fas fa-download text-emerald-400"></i> Export Backup
                        </button>
                    </div>
                </div>

                <!-- Interactive KPI Metrics Bar -->
                <div id="sop-kpi-bar" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" data-aos="fade-up"></div>

                <!-- Navigation Tabs & Search/Filter Toolbar -->
                <div class="bg-dark-500 p-4 rounded-2xl border border-slate-800 mb-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4" data-aos="fade-up">
                    <!-- Category Tabs -->
                    <div class="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                        <button onclick="SOPManual.switchTab('ALL')" id="tab-sop-ALL" class="sop-tab-btn active px-4 py-2 rounded-xl text-xs font-bold bg-royalblue-600 text-white transition-all whitespace-nowrap">
                            <i class="fas fa-folder-open mr-1.5"></i> All Documents
                        </button>
                        <button onclick="SOPManual.switchTab('S.O.P Manual')" id="tab-sop-SOP" class="sop-tab-btn px-4 py-2 rounded-xl text-xs font-bold bg-dark-700 text-slate-300 hover:bg-dark-400 hover:text-white transition-all whitespace-nowrap border border-slate-700">
                            <i class="fas fa-file-signature text-sky-400 mr-1.5"></i> S.O.P Manuals
                        </button>
                        <button onclick="SOPManual.switchTab('QA Procedure')" id="tab-sop-PROC" class="sop-tab-btn px-4 py-2 rounded-xl text-xs font-bold bg-dark-700 text-slate-300 hover:bg-dark-400 hover:text-white transition-all whitespace-nowrap border border-slate-700">
                            <i class="fas fa-clipboard-check text-cyan-400 mr-1.5"></i> QA Procedures
                        </button>
                        <button onclick="SOPManual.switchTab('REVIEW')" id="tab-sop-REV" class="sop-tab-btn px-4 py-2 rounded-xl text-xs font-bold bg-dark-700 text-slate-300 hover:bg-dark-400 hover:text-white transition-all whitespace-nowrap border border-slate-700">
                            <i class="fas fa-exclamation-circle text-amber-400 mr-1.5"></i> Under Review
                        </button>
                        <button onclick="SOPManual.switchTab('HISTORY')" id="tab-sop-HIST" class="sop-tab-btn px-4 py-2 rounded-xl text-xs font-bold bg-dark-700 text-slate-300 hover:bg-dark-400 hover:text-white transition-all whitespace-nowrap border border-slate-700">
                            <i class="fas fa-history text-rose-400 mr-1.5"></i> Audit History
                        </button>
                    </div>

                    <!-- Search and Area Dropdown -->
                    <div class="flex items-center gap-3 w-full md:w-auto">
                        <div class="relative flex-1 md:w-64">
                            <i class="fas fa-search absolute left-3.5 top-3 text-slate-400 text-xs"></i>
                            <input type="text" id="sop-search-input" placeholder="Search code, title, hazard..." oninput="SOPManual.handleSearch(this.value)" class="w-full bg-dark-700 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 outline-none focus:border-sky-400 transition-all">
                        </div>
                        <select id="sop-area-filter" onchange="SOPManual.handleAreaFilter(this.value)" class="bg-dark-700 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-sky-400 transition-all font-semibold cursor-pointer">
                            <option value="ALL">All Plant Areas</option>
                            <option value="FNTRL Area">FNTRL Area</option>
                            <option value="MS-Dezinc Area">MS-Dezinc Area</option>
                            <option value="H2S Area">H2S Area</option>
                            <option value="Limestone Area">Limestone Area</option>
                            <option value="DCS Control">DCS Control Room</option>
                        </select>
                    </div>
                </div>

                <!-- Main Content Grid / Table / History View -->
                <div id="sop-content-area" class="min-h-[400px]"></div>
            </div>

            <!-- MODALS INJECTED INTO DOM -->
            <div id="sopFormModal" class="fixed inset-0 bg-dark-900/85 z-[100] hidden items-center justify-center p-4 backdrop-blur-md overflow-y-auto">
                <div class="bg-dark-500 w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden my-8 transform scale-95 transition-all duration-300">
                    <div class="bg-gradient-to-r from-royalblue-600/20 to-sky-500/10 p-5 border-b border-slate-800 flex justify-between items-center">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-royalblue-600 flex items-center justify-center text-white shadow">
                                <i id="sop-form-icon" class="fas fa-file-alt text-base"></i>
                            </div>
                            <div>
                                <h3 id="sop-form-title" class="text-base sm:text-lg font-bold text-white">Create S.O.P Manual</h3>
                                <span class="text-[11px] text-sky-400 font-semibold block">Quality Group Document Standard</span>
                            </div>
                        </div>
                        <button type="button" onclick="SOPManual.closeModal('sopFormModal')" class="text-slate-400 hover:text-white p-1.5 rounded-lg">
                            <i class="fas fa-times text-lg"></i>
                        </button>
                    </div>
                    <form onsubmit="SOPManual.handleFormSubmit(event)" class="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
                        <input type="hidden" id="form-sop-id">
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Document Code / ID *</label>
                                <input type="text" id="form-sop-code" required placeholder="e.g. SOP-FN-105" class="w-full bg-dark-700 border border-slate-700 rounded-xl p-2.5 text-xs text-white uppercase outline-none focus:border-sky-400 font-bold">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Category *</label>
                                <select id="form-sop-category" required class="w-full bg-dark-700 border border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none focus:border-sky-400 font-semibold">
                                    <option value="S.O.P Manual">S.O.P Manual</option>
                                    <option value="QA Procedure">QA Procedure</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Plant Area *</label>
                                <select id="form-sop-area" required class="w-full bg-dark-700 border border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none focus:border-sky-400 font-semibold">
                                    <option value="FNTRL Area">FNTRL Area</option>
                                    <option value="MS-Dezinc Area">MS-Dezinc Area</option>
                                    <option value="H2S Area">H2S Area</option>
                                    <option value="Limestone Area">Limestone Area</option>
                                    <option value="DCS Control">DCS Control Room</option>
                                </select>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div class="sm:col-span-2">
                                <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Document Title / Protocol Name *</label>
                                <input type="text" id="form-sop-title-input" required placeholder="e.g. Flocculant Dosing & Slurry Titration Assay" class="w-full bg-dark-700 border border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none focus:border-sky-400 font-bold">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Revision & Status</label>
                                <div class="flex gap-2">
                                    <input type="text" id="form-sop-rev" required placeholder="Rev 1.0" class="w-1/2 bg-dark-700 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-bold outline-none focus:border-sky-400">
                                    <select id="form-sop-status" class="w-1/2 bg-dark-700 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-bold outline-none focus:border-sky-400">
                                        <option value="Active">Active</option>
                                        <option value="Under Review">Under Review</option>
                                        <option value="Archived">Archived</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Author / QA Lead</label>
                                <input type="text" id="form-sop-author" required value="Engr. Marcus Vance (Lead QA Chemist)" class="w-full bg-dark-700 border border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none focus:border-sky-400">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Effective Date</label>
                                <input type="date" id="form-sop-date" required class="w-full bg-dark-700 border border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none focus:border-sky-400 font-semibold">
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Executive Summary / Scope *</label>
                            <textarea id="form-sop-summary" rows="2" required placeholder="Briefly explain the purpose and tolerance boundaries of this procedure..." class="w-full bg-dark-700 border border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none focus:border-sky-400 leading-relaxed"></textarea>
                        </div>

                        <!-- Step-by-Step Instructions Dynamic Builder -->
                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <label class="text-xs font-bold text-sky-400 uppercase tracking-wider"><i class="fas fa-list-ol mr-1"></i> Step-by-Step Instructions</label>
                                <button type="button" onclick="SOPManual.addStepInput()" class="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 transition-all">
                                    + Add Procedure Step
                                </button>
                            </div>
                            <div id="form-steps-container" class="space-y-3 max-h-52 overflow-y-auto p-3 bg-dark-700/50 rounded-xl border border-slate-800"></div>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-rose-400 uppercase mb-1"><i class="fas fa-exclamation-triangle mr-1"></i> Safety & Chemical Hazards Warning</label>
                            <textarea id="form-sop-hazards" rows="2" placeholder="List mandatory PPE, chemical risks, or LOTO requirements..." class="w-full bg-dark-700 border border-rose-500/40 rounded-xl p-2.5 text-xs text-rose-200 outline-none focus:border-rose-400 leading-relaxed"></textarea>
                        </div>

                        <!-- Attachment Uploader -->
                        <div>
                            <label class="block text-xs font-bold text-slate-300 uppercase mb-1"><i class="fas fa-paperclip mr-1"></i> Attach Documents / Spreadsheets</label>
                            <div class="border-2 border-dashed border-slate-700 hover:border-sky-500/50 rounded-xl p-4 text-center transition-all bg-dark-700/30">
                                <input type="file" id="form-sop-file-input" multiple onchange="SOPManual.handleFileUpload(this)" class="hidden">
                                <label for="form-sop-file-input" class="cursor-pointer text-xs text-slate-400 block font-medium">
                                    <i class="fas fa-cloud-upload-alt text-2xl text-sky-400 mb-1 block"></i>
                                    Click to browse or drop files here (PDF, XLSX, DOCX up to 5MB)
                                </label>
                                <div id="form-attachments-preview" class="mt-3 flex flex-wrap gap-2 justify-center"></div>
                            </div>
                        </div>

                        <div class="pt-3 border-t border-slate-800 flex justify-end gap-3">
                            <button type="button" onclick="SOPManual.closeModal('sopFormModal')" class="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all">Cancel</button>
                            <button type="submit" class="px-6 py-2.5 bg-gradient-to-r from-royalblue-600 to-sky-500 hover:from-royalblue-500 text-white rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(14,165,233,0.3)] transition-all">Save S.O.P Manual</button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- MODAL: VIEW DETAILS & PRINTABLE REPORT -->
            <div id="sopDetailsModal" class="fixed inset-0 bg-dark-900/85 z-[100] hidden items-center justify-center p-4 backdrop-blur-md overflow-y-auto">
                <div class="bg-dark-500 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden my-8 transform scale-95 transition-all duration-300" id="sop-details-content"></div>
            </div>

            <!-- MODAL: DATA UPLOAD & ANALYZER ENGINE -->
            <div id="sopImportModal" class="fixed inset-0 bg-dark-900/85 z-[100] hidden items-center justify-center p-4 backdrop-blur-md overflow-y-auto">
                <div class="bg-dark-500 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden transform scale-95 transition-all duration-300">
                    <div class="bg-gradient-to-r from-cyan-600/20 to-sky-500/10 p-5 border-b border-slate-800 flex justify-between items-center">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center text-white shadow">
                                <i class="fas fa-file-import text-base"></i>
                            </div>
                            <div>
                                <h3 class="text-base sm:text-lg font-bold text-white">Data Upload & Analyzer Hub</h3>
                                <span class="text-[11px] text-cyan-400 font-semibold block">Intelligent Schema Inspection & Merge</span>
                            </div>
                        </div>
                        <button type="button" onclick="SOPManual.closeModal('sopImportModal')" class="text-slate-400 hover:text-white p-1.5 rounded-lg">
                            <i class="fas fa-times text-lg"></i>
                        </button>
                    </div>
                    <div class="p-6 space-y-6">
                        <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            Upload a JSON or CSV file containing S.O.P manuals. Our analyzer will automatically inspect the schema, count duplicates, identify missing required fields, and calculate plant area distribution before merging.
                        </p>

                        <!-- Dropzone -->
                        <div class="border-2 border-dashed border-cyan-500/40 hover:border-cyan-400 rounded-2xl p-8 text-center bg-dark-700/40 transition-all">
                            <input type="file" id="import-file-input" accept=".json,.csv" onchange="SOPManual.analyzeImportFile(this)" class="hidden">
                            <label for="import-file-input" class="cursor-pointer block">
                                <div class="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-3 text-cyan-400 shadow">
                                    <i class="fas fa-cloud-upload-alt text-2xl"></i>
                                </div>
                                <span class="text-sm font-bold text-white block">Click to Select JSON or CSV File</span>
                                <span class="text-xs text-slate-400 block mt-1">Supports exported SOP backups or standardized laboratory datasets</span>
                            </label>
                        </div>

                        <!-- Live Analysis Report Container -->
                        <div id="import-analysis-report" class="hidden space-y-4 pt-2 border-t border-slate-800"></div>

                        <div class="flex justify-end gap-3 pt-4 border-t border-slate-800">
                            <button type="button" onclick="SOPManual.closeModal('sopImportModal')" class="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold">Cancel</button>
                            <button type="button" id="btn-confirm-import" disabled onclick="SOPManual.confirmImportMerge()" class="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all">
                                Confirm & Merge Import
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Bind UI Events
    function bindEvents() {
        // Set default effective date in modal to today
        const dateInput = document.getElementById('form-sop-date');
        if (dateInput) {
            dateInput.value = new Date().toISOString().split('T')[0];
        }
    }

    // Switch Category Tabs
    function switchTab(category) {
        currentCategoryFilter = category;
        const buttons = document.querySelectorAll('.sop-tab-btn');
        buttons.forEach(btn => {
            btn.className = "sop-tab-btn px-4 py-2 rounded-xl text-xs font-bold bg-dark-700 text-slate-300 hover:bg-dark-400 hover:text-white transition-all whitespace-nowrap border border-slate-700";
        });

        let activeId = 'tab-sop-ALL';
        if (category === 'S.O.P Manual') activeId = 'tab-sop-SOP';
        if (category === 'QA Procedure') activeId = 'tab-sop-PROC';
        if (category === 'REVIEW') activeId = 'tab-sop-REV';
        if (category === 'HISTORY') activeId = 'tab-sop-HIST';

        const activeBtn = document.getElementById(activeId);
        if (activeBtn) {
            activeBtn.className = "sop-tab-btn active px-4 py-2 rounded-xl text-xs font-bold bg-royalblue-600 text-white transition-all whitespace-nowrap shadow-[0_0_15px_rgba(37,99,235,0.4)]";
        }
        render();
    }

    // Handle Search Input
    function handleSearch(query) {
        currentSearchQuery = query.toLowerCase().trim();
        render();
    }

    // Handle Area Dropdown Filter
    function handleAreaFilter(area) {
        currentAreaFilter = area;
        render();
    }

    // Master Render Method
    function render() {
        renderKPIs();

        const container = document.getElementById('sop-content-area');
        if (!container) return;

        // If Audit History tab is selected, render timeline view
        if (currentCategoryFilter === 'HISTORY') {
            renderHistoryView(container);
            return;
        }

        // Filter data based on active tab, search query, and area filter
        let filtered = sopList.filter(sop => {
            if (currentCategoryFilter === 'S.O.P Manual' && sop.category !== 'S.O.P Manual') return false;
            if (currentCategoryFilter === 'QA Procedure' && sop.category !== 'QA Procedure') return false;
            if (currentCategoryFilter === 'REVIEW' && sop.status !== 'Under Review') return false;
            if (currentAreaFilter !== 'ALL' && sop.area !== currentAreaFilter) return false;

            if (currentSearchQuery) {
                const searchStr = `${sop.code} ${sop.title} ${sop.summary} ${sop.author} ${sop.area}`.toLowerCase();
                if (!searchStr.includes(currentSearchQuery)) return false;
            }
            return true;
        });

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="text-center py-20 bg-dark-500/50 rounded-2xl border border-slate-800">
                    <div class="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto mb-4 text-slate-500 text-2xl">
                        <i class="fas fa-folder-open"></i>
                    </div>
                    <h4 class="text-base font-bold text-white mb-1">No Documents Match Your Criteria</h4>
                    <p class="text-xs text-slate-400 max-w-md mx-auto mb-6">We couldn't find any S.O.P manuals or procedures matching the selected filters. Try clearing your search or creating a new document.</p>
                    <button onclick="SOPManual.switchTab('ALL'); document.getElementById('sop-search-input').value=''; SOPManual.handleSearch('');" class="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold text-xs rounded-xl transition-all border border-slate-700">
                        Reset All Filters
                    </button>
                </div>
            `;
            return;
        }

        // Render Grid Cards
        let html = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">`;
        filtered.forEach(sop => {
            const isReview = sop.status === 'Under Review';
            const statusColor = isReview 
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
            const catColor = sop.category === 'S.O.P Manual' ? 'text-sky-400 bg-sky-500/10' : 'text-cyan-400 bg-cyan-500/10';

            html += `
                <div class="bg-dark-500 rounded-2xl p-6 border border-slate-800 hover:border-sky-500/50 transition-all duration-300 flex flex-col justify-between shadow-lg group">
                    <div>
                        <!-- Header Badges -->
                        <div class="flex items-center justify-between gap-2 mb-4">
                            <span class="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${catColor} border border-slate-700/60">
                                ${sop.category}
                            </span>
                            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusColor} flex items-center gap-1">
                                <i class="fas ${isReview ? 'fa-clock' : 'fa-check-circle'} text-[10px]"></i> ${sop.status}
                            </span>
                        </div>

                        <!-- Code and Title -->
                        <div class="mb-3">
                            <span class="text-xs font-black text-sky-400 uppercase tracking-wider block">${sop.code} &bull; ${sop.revision}</span>
                            <h4 class="text-lg font-extrabold text-white mt-1 group-hover:text-sky-300 transition-colors line-clamp-2 leading-snug">
                                ${sop.title}
                            </h4>
                        </div>

                        <!-- Summary -->
                        <p class="text-xs text-slate-300 font-normal leading-relaxed mb-5 line-clamp-3">
                            ${sop.summary}
                        </p>
                    </div>

                    <div>
                        <!-- Metadata Info Bar -->
                        <div class="grid grid-cols-2 gap-2 p-3 bg-dark-700/60 rounded-xl border border-slate-800 text-[11px] font-medium text-slate-300 mb-5">
                            <div class="flex items-center gap-1.5 truncate">
                                <i class="fas fa-map-marker-alt text-sky-400"></i> <span>${sop.area}</span>
                            </div>
                            <div class="flex items-center gap-1.5 justify-end">
                                <i class="fas fa-list-ol text-emerald-400"></i> <span>${sop.steps ? sop.steps.length : 0} Steps</span>
                            </div>
                            <div class="flex items-center gap-1.5 col-span-2 text-slate-400 truncate pt-1 border-t border-slate-800/80 mt-1">
                                <i class="fas fa-user-check text-cyan-400"></i> <span class="truncate">${sop.author.split('(')[0]}</span>
                            </div>
                        </div>

                        <!-- Action Toolbar -->
                        <div class="flex items-center justify-between pt-2 border-t border-slate-800/80 gap-2">
                            <button onclick="SOPManual.viewDetails('${sop.id}')" class="flex-1 py-2.5 bg-royalblue-600/20 hover:bg-royalblue-600 border border-royalblue-500/30 hover:border-royalblue-500 text-sky-300 hover:text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow">
                                <i class="fas fa-eye text-xs"></i> View Protocol
                            </button>
                            <div class="flex items-center gap-1">
                                <button onclick="SOPManual.openEditModal('${sop.id}')" title="Edit S.O.P" class="w-9 h-9 bg-dark-700 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl flex items-center justify-center transition-all border border-slate-700">
                                    <i class="fas fa-edit text-xs"></i>
                                </button>
                                <button onclick="SOPManual.deleteSop('${sop.id}')" title="Delete S.O.P" class="w-9 h-9 bg-dark-700 hover:bg-rose-600/30 text-rose-400 hover:text-rose-200 rounded-xl flex items-center justify-center transition-all border border-slate-700 hover:border-rose-500/40">
                                    <i class="fas fa-trash-alt text-xs"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        html += `</div>`;
        container.innerHTML = html;
    }

    // Render Top KPI Stats Bar
    function renderKPIs() {
        const kpiContainer = document.getElementById('sop-kpi-bar');
        if (!kpiContainer) return;

        const total = sopList.length;
        const active = sopList.filter(s => s.status === 'Active').length;
        const review = sopList.filter(s => s.status === 'Under Review').length;
        const procedures = sopList.filter(s => s.category === 'QA Procedure').length;

        kpiContainer.innerHTML = `
            <div class="bg-dark-500 p-4 rounded-2xl border border-slate-800 flex items-center gap-3.5 shadow-lg">
                <div class="w-12 h-12 rounded-xl bg-royalblue-600/20 border border-royalblue-500/30 flex items-center justify-center text-sky-400 text-xl font-black">
                    <i class="fas fa-book font-bold"></i>
                </div>
                <div>
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Library</span>
                    <span class="text-xl sm:text-2xl font-black text-white">${total} Documents</span>
                </div>
            </div>

            <div class="bg-dark-500 p-4 rounded-2xl border border-slate-800 flex items-center gap-3.5 shadow-lg">
                <div class="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xl font-black">
                    <i class="fas fa-check-double font-bold"></i>
                </div>
                <div>
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Compliance</span>
                    <span class="text-xl sm:text-2xl font-black text-emerald-400">${active} Nominal</span>
                </div>
            </div>

            <div class="bg-dark-500 p-4 rounded-2xl border border-slate-800 flex items-center gap-3.5 shadow-lg">
                <div class="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xl font-black">
                    <i class="fas fa-sync-alt fa-spin font-bold"></i>
                </div>
                <div>
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Under Review</span>
                    <span class="text-xl sm:text-2xl font-black text-amber-400">${review} Pending</span>
                </div>
            </div>

            <div class="bg-dark-500 p-4 rounded-2xl border border-slate-800 flex items-center gap-3.5 shadow-lg">
                <div class="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xl font-black">
                    <i class="fas fa-clipboard-check font-bold"></i>
                </div>
                <div>
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">QA Procedures</span>
                    <span class="text-xl sm:text-2xl font-black text-white">${procedures} Protocols</span>
                </div>
            </div>
        `;
    }

    // Render Audit History Timeline View
    function renderHistoryView(container) {
        if (historyList.length === 0) {
            container.innerHTML = `<div class="text-center py-16 text-slate-500 font-semibold">No history logs recorded yet.</div>`;
            return;
        }

        let html = `
            <div class="bg-dark-500 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl max-w-4xl mx-auto">
                <div class="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                    <div>
                        <h4 class="text-lg font-extrabold text-white"><i class="fas fa-history text-rose-400 mr-2"></i> Quality Audit & Revision History Logs</h4>
                        <span class="text-xs text-slate-400">Complete immutable audit trail of document updates, reviews, and attachment additions.</span>
                    </div>
                    <span class="px-3 py-1 rounded bg-dark-700 text-slate-300 text-xs font-bold border border-slate-700">${historyList.length} Entries Recorded</span>
                </div>
                <div class="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800">
        `;

        historyList.forEach(log => {
            let badgeClass = 'bg-sky-500/10 text-sky-400 border-sky-500/30';
            let icon = 'fa-info-circle';
            if (log.action === 'REVISION_UPDATE') { badgeClass = 'bg-amber-500/10 text-amber-400 border-amber-500/30'; icon = 'fa-code-branch'; }
            if (log.action === 'CREATED') { badgeClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'; icon = 'fa-plus-circle'; }
            if (log.action === 'DELETED') { badgeClass = 'bg-rose-500/10 text-rose-400 border-rose-500/30'; icon = 'fa-trash'; }

            html += `
                <div class="relative pl-8 flex items-start gap-4">
                    <div class="absolute left-1.5 top-1.5 w-5 h-5 rounded-full bg-dark-700 border-2 border-sky-400 flex items-center justify-center text-[10px] text-white shadow">
                        <div class="w-1.5 h-1.5 rounded-full bg-sky-400"></div>
                    </div>
                    <div class="flex-1 bg-dark-700/80 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-all">
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                            <div class="flex items-center gap-2">
                                <span class="font-extrabold text-white text-xs sm:text-sm">${log.sopCode}</span>
                                <span class="px-2 py-0.5 rounded text-[10px] font-bold border ${badgeClass} flex items-center gap-1">
                                    <i class="fas ${icon} text-[9px]"></i> ${log.action}
                                </span>
                            </div>
                            <span class="text-[11px] text-slate-400 font-medium">${log.timestamp}</span>
                        </div>
                        <p class="text-xs text-slate-300 font-normal leading-relaxed">${log.details}</p>
                        <span class="text-[10px] text-slate-400 block mt-2 pt-1.5 border-t border-slate-800/80 font-medium"><i class="fas fa-user-shield text-sky-400 mr-1"></i> Logged by: ${log.user}</span>
                    </div>
                </div>
            `;
        });

        html += `</div></div>`;
        container.innerHTML = html;
    }

    // Dynamic Step Adder for Modal Form
    function addStepInput(titleVal = '', detailVal = '') {
        const container = document.getElementById('form-steps-container');
        if (!container) return;

        const stepCount = container.children.length + 1;
        const stepId = 'step-row-' + Date.now() + Math.random().toString(36).substr(2, 4);

        const div = document.createElement('div');
        div.id = stepId;
        div.className = "p-3 bg-dark-900/80 rounded-xl border border-slate-800 space-y-2 relative group";
        div.innerHTML = `
            <div class="flex items-center justify-between">
                <span class="text-[11px] font-bold text-sky-400 uppercase tracking-wider step-num-label">Step ${stepCount} Protocol</span>
                <button type="button" onclick="document.getElementById('${stepId}').remove(); SOPManual.reindexSteps();" class="text-rose-400 hover:text-rose-300 text-xs p-1">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
            <input type="text" placeholder="Step Title (e.g., Slurry Titration Assay)" value="${titleVal}" class="step-title-input w-full bg-dark-700 border border-slate-700 rounded-lg p-2 text-xs text-white font-bold outline-none focus:border-sky-400">
            <textarea rows="2" placeholder="Detailed instructions, reagent quantities, and tolerance limits..." class="step-detail-input w-full bg-dark-700 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none focus:border-sky-400">${detailVal}</textarea>
        `;
        container.appendChild(div);
    }

    // Reindex Step numbers after deletion
    function reindexSteps() {
        const labels = document.querySelectorAll('#form-steps-container .step-num-label');
        labels.forEach((lbl, idx) => {
            lbl.innerText = `Step ${idx + 1} Protocol`;
        });
    }

    // Handle File Upload converting to Base64 simulation
    function handleFileUpload(input) {
        if (!input.files || input.files.length === 0) return;
        
        Array.from(input.files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function (e) {
                const fileObj = {
                    name: file.name,
                    size: (file.size / 1024).toFixed(0) + ' KB',
                    type: file.type || 'application/octet-stream',
                    dataUrl: e.target.result
                };
                tempAttachments.push(fileObj);
                renderAttachmentsPreview();
            };
            reader.readAsDataURL(file);
        });
    }

    // Render Preview of attached files in modal form
    function renderAttachmentsPreview() {
        const preview = document.getElementById('form-attachments-preview');
        if (!preview) return;

        if (tempAttachments.length === 0) {
            preview.innerHTML = '';
            return;
        }

        let html = '';
        tempAttachments.forEach((file, idx) => {
            html += `
                <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-900 border border-sky-500/30 text-xs text-sky-300">
                    <i class="fas fa-file-alt text-sky-400"></i>
                    <span class="max-w-[150px] truncate font-semibold">${file.name}</span>
                    <span class="text-[10px] text-slate-400">(${file.size})</span>
                    <button type="button" onclick="SOPManual.removeAttachment(${idx})" class="text-rose-400 hover:text-rose-200 ml-1">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        });
        preview.innerHTML = html;
    }

    // Remove attachment from temporary list
    function removeAttachment(index) {
        tempAttachments.splice(index, 1);
        renderAttachmentsPreview();
    }

    // Open Create Modal
    function openCreateModal() {
        currentEditingId = null;
        tempAttachments = [];
        document.getElementById('form-sop-id').value = '';
        document.getElementById('form-sop-code').value = '';
        document.getElementById('form-sop-title-input').value = '';
        document.getElementById('form-sop-category').value = 'S.O.P Manual';
        document.getElementById('form-sop-area').value = 'FNTRL Area';
        document.getElementById('form-sop-rev').value = 'Rev 1.0';
        document.getElementById('form-sop-status').value = 'Active';
        document.getElementById('form-sop-summary').value = '';
        document.getElementById('form-sop-hazards').value = '';
        document.getElementById('form-steps-container').innerHTML = '';
        document.getElementById('form-attachments-preview').innerHTML = '';
        
        // Add 2 default empty steps
        addStepInput();
        addStepInput();

        document.getElementById('sop-form-title').innerText = 'Create New Protocol';
        document.getElementById('sop-form-icon').className = 'fas fa-plus-circle text-base';
        
        openModal('sopFormModal');
    }

    // Open Edit Modal
    function openEditModal(id) {
        const sop = sopList.find(s => s.id === id);
        if (!sop) return;

        currentEditingId = sop.id;
        tempAttachments = sop.attachments ? [...sop.attachments] : [];

        document.getElementById('form-sop-id').value = sop.id;
        document.getElementById('form-sop-code').value = sop.code;
        document.getElementById('form-sop-title-input').value = sop.title;
        document.getElementById('form-sop-category').value = sop.category || 'S.O.P Manual';
        document.getElementById('form-sop-area').value = sop.area;
        document.getElementById('form-sop-rev').value = sop.revision;
        document.getElementById('form-sop-status').value = sop.status;
        document.getElementById('form-sop-author').value = sop.author || 'Engr. Marcus Vance';
        document.getElementById('form-sop-date').value = sop.effectiveDate || new Date().toISOString().split('T')[0];
        document.getElementById('form-sop-summary').value = sop.summary;
        document.getElementById('form-sop-hazards').value = sop.hazards || '';

        // Populate Steps
        const stepsContainer = document.getElementById('form-steps-container');
        stepsContainer.innerHTML = '';
        if (sop.steps && sop.steps.length > 0) {
            sop.steps.forEach(s => addStepInput(s.title, s.detail));
        } else {
            addStepInput();
        }

        renderAttachmentsPreview();
        document.getElementById('sop-form-title').innerText = 'Edit Protocol & Revisions';
        document.getElementById('sop-form-icon').className = 'fas fa-edit text-base';

        openModal('sopFormModal');
    }

    // Handle Form Submit (Add/Edit)
    function handleFormSubmit(e) {
        e.preventDefault();

        const code = document.getElementById('form-sop-code').value.trim().toUpperCase();
        const title = document.getElementById('form-sop-title-input').value.trim();
        const category = document.getElementById('form-sop-category').value;
        const area = document.getElementById('form-sop-area').value;
        const revision = document.getElementById('form-sop-rev').value.trim();
        const status = document.getElementById('form-sop-status').value;
        const author = document.getElementById('form-sop-author').value.trim();
        const effectiveDate = document.getElementById('form-sop-date').value;
        const summary = document.getElementById('form-sop-summary').value.trim();
        const hazards = document.getElementById('form-sop-hazards').value.trim();

        // Gather Steps
        const stepRows = document.querySelectorAll('#form-steps-container > div');
        const steps = [];
        stepRows.forEach((row, idx) => {
            const tInput = row.querySelector('.step-title-input');
            const dInput = row.querySelector('.step-detail-input');
            if (tInput && dInput && (tInput.value.trim() || dInput.value.trim())) {
                steps.push({
                    step: idx + 1,
                    title: tInput.value.trim() || `Step ${idx + 1}`,
                    detail: dInput.value.trim() || 'No additional instruction details provided.'
                });
            }
        });

        if (currentEditingId) {
            // Update Existing
            const index = sopList.findIndex(s => s.id === currentEditingId);
            if (index !== -1) {
                const oldRev = sopList[index].revision;
                sopList[index] = {
                    ...sopList[index],
                    code, title, category, area, revision, status, author, effectiveDate, summary, hazards, steps,
                    attachments: [...tempAttachments],
                    updatedAt: new Date().toISOString()
                };
                addHistoryLog(currentEditingId, code, 'REVISION_UPDATE', `Updated document parameters. Revision set to ${revision} (from ${oldRev}). Status: ${status}.`);
            }
        } else {
            // Create New
            const newId = 'sop-' + Date.now().toString(36);
            const newSop = {
                id: newId,
                code, title, category, area, revision, status, author, effectiveDate, summary, hazards, steps,
                attachments: [...tempAttachments],
                department: 'Hydrometallurgy Quality Group',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            sopList.unshift(newSop);
            addHistoryLog(newId, code, 'CREATED', `Created new ${category} (${code}) for ${area}. Initial Revision: ${revision}.`);
        }

        saveData();
        closeModal('sopFormModal');
        render();
        alert(`✅ Protocol (${code}) has been successfully saved to the Quality Portal!`);
    }

    // Delete SOP
    function deleteSop(id) {
        const sop = sopList.find(s => s.id === id);
        if (!sop) return;

        if (confirm(`⚠️ ARE YOU SURE?\n\nYou are about to permanently delete "${sop.code}: ${sop.title}". This action will remove the protocol from active field stations.`)) {
            addHistoryLog(sop.id, sop.code, 'DELETED', `Deleted protocol ${sop.code} from the Quality Management Hub.`);
            sopList = sopList.filter(s => s.id !== id);
            saveData();
            render();
        }
    }

    // View Rich Printable Details Modal
    function viewDetails(id) {
        const sop = sopList.find(s => s.id === id);
        if (!sop) return;

        const content = document.getElementById('sop-details-content');
        if (!content) return;

        const isReview = sop.status === 'Under Review';
        const statusBadge = isReview 
            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';

        let html = `
            <!-- Modal Header -->
            <div class="bg-gradient-to-r from-dark-400 to-dark-500 p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div class="flex items-center gap-2 mb-2">
                        <span class="px-2.5 py-1 rounded bg-sky-500/10 text-sky-400 font-extrabold text-xs border border-sky-500/20 uppercase">${sop.category}</span>
                        <span class="px-2.5 py-1 rounded text-xs font-bold border ${statusBadge}">${sop.status} &bull; ${sop.revision}</span>
                    </div>
                    <h2 class="text-xl sm:text-2xl font-black text-white leading-tight">${sop.code}: ${sop.title}</h2>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="SOPManual.downloadDocument('${sop.id}', 'html')" class="px-3.5 py-2 bg-royalblue-600 hover:bg-royalblue-500 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5">
                        <i class="fas fa-print"></i> Print Protocol
                    </button>
                    <button onclick="SOPManual.closeModal('sopDetailsModal')" class="text-slate-400 hover:text-white p-2 rounded-lg bg-dark-700">
                        <i class="fas fa-times text-base"></i>
                    </button>
                </div>
            </div>

            <!-- Modal Body -->
            <div class="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
                <!-- Metadata Box -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-dark-700/60 rounded-2xl border border-slate-800 text-xs">
                    <div>
                        <span class="text-[10px] text-slate-400 uppercase font-bold block">Assigned Area</span>
                        <span class="font-extrabold text-sky-400">${sop.area}</span>
                    </div>
                    <div>
                        <span class="text-[10px] text-slate-400 uppercase font-bold block">Effective Date</span>
                        <span class="font-extrabold text-white">${sop.effectiveDate || '2026-01-01'}</span>
                    </div>
                    <div>
                        <span class="text-[10px] text-slate-400 uppercase font-bold block">Department</span>
                        <span class="font-extrabold text-white">${sop.department || 'Hydrometallurgy QA'}</span>
                    </div>
                    <div>
                        <span class="text-[10px] text-slate-400 uppercase font-bold block">Author / Approver</span>
                        <span class="font-extrabold text-emerald-400 truncate block">${sop.author}</span>
                    </div>
                </div>

                <!-- Scope Summary -->
                <div>
                    <h4 class="text-xs font-bold text-sky-400 uppercase tracking-wider mb-2"><i class="fas fa-info-circle mr-1"></i> Executive Scope & Purpose</h4>
                    <div class="p-4 bg-dark-700/40 rounded-xl border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                        ${sop.summary}
                    </div>
                </div>

                <!-- Safety Hazards Warning Box -->
                ${sop.hazards ? `
                <div class="p-4 bg-gradient-to-br from-rose-950/40 to-dark-700 rounded-xl border border-rose-500/40 text-xs">
                    <span class="font-extrabold text-rose-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                        <i class="fas fa-exclamation-triangle text-rose-500"></i> Safety Critical & PPE Warning
                    </span>
                    <p class="text-rose-200 leading-relaxed font-medium">${sop.hazards}</p>
                </div>
                ` : ''}

                <!-- Interactive Step-by-Step Checklist -->
                <div>
                    <h4 class="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3"><i class="fas fa-tasks mr-1.5"></i> Standard Operating Procedure Checklist</h4>
                    <div class="space-y-3">
                        ${sop.steps && sop.steps.length > 0 ? sop.steps.map((st, idx) => `
                            <div class="p-4 bg-dark-700 rounded-xl border border-slate-800 flex items-start gap-3 hover:border-slate-600 transition-all">
                                <input type="checkbox" id="step-check-${idx}" class="mt-1 w-4 h-4 rounded border-slate-600 text-sky-500 focus:ring-0 cursor-pointer accent-sky-500">
                                <label for="step-check-${idx}" class="flex-1 cursor-pointer">
                                    <span class="text-xs font-black text-sky-400 block mb-0.5">Step ${st.step || idx + 1}: ${st.title}</span>
                                    <span class="text-xs text-slate-300 font-normal leading-relaxed">${st.detail}</span>
                                </label>
                            </div>
                        `).join('') : '<p class="text-xs text-slate-400">No step-by-step instructions recorded for this document.</p>'}
                    </div>
                </div>

                <!-- Attachments Section -->
                <div>
                    <h4 class="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3"><i class="fas fa-paperclip mr-1.5"></i> Attached Laboratory Reference Files</h4>
                    <div class="flex flex-wrap gap-3">
                        ${sop.attachments && sop.attachments.length > 0 ? sop.attachments.map(att => `
                            <a href="${att.dataUrl || '#'}" download="${att.name}" class="p-3 bg-dark-700 hover:bg-slate-700 rounded-xl border border-slate-800 flex items-center gap-3 transition-all group text-xs text-white">
                                <div class="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                                    <i class="fas fa-file-download"></i>
                                </div>
                                <div>
                                    <span class="font-bold block max-w-[200px] truncate group-hover:text-sky-300">${att.name}</span>
                                    <span class="text-[10px] text-slate-400">${att.size || 'Attachment'} &bull; Click to Download</span>
                                </div>
                            </a>
                        `).join('') : '<span class="text-xs text-slate-500 italic">No supplementary spreadsheets or diagrams attached.</span>'}
                    </div>
                </div>

                <!-- Footer Sign-off Block -->
                <div class="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
                    <div>
                        <span>Last Revision Verified: <strong class="text-slate-200">${new Date(sop.updatedAt || Date.now()).toLocaleDateString()}</strong></span>
                    </div>
                    <div class="flex items-center gap-3">
                        <button onclick="SOPManual.closeModal('sopDetailsModal'); SOPManual.openEditModal('${sop.id}');" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold rounded-xl transition-all border border-slate-700">
                            <i class="fas fa-edit mr-1"></i> Edit Protocol
                        </button>
                        <button onclick="SOPManual.downloadDocument('${sop.id}', 'json')" class="px-4 py-2 bg-dark-700 hover:bg-dark-400 text-slate-300 font-bold rounded-xl transition-all border border-slate-700">
                            <i class="fas fa-file-code mr-1"></i> Export JSON
                        </button>
                    </div>
                </div>
            </div>
        `;

        content.innerHTML = html;
        openModal('sopDetailsModal');
    }

    // Download Single Document in HTML/Printable or JSON format
    function downloadDocument(id, format) {
        const sop = sopList.find(s => s.id === id);
        if (!sop) return;

        if (format === 'json') {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sop, null, 2));
            const dlAnchor = document.createElement('a');
            dlAnchor.setAttribute("href", dataStr);
            dlAnchor.setAttribute("download", `${sop.code}_Protocol_Backup.json`);
            document.body.appendChild(dlAnchor);
            dlAnchor.click();
            dlAnchor.remove();
            return;
        }

        // Printable HTML format
        const printHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${sop.code} - ${sop.title}</title>
                <style>
                    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1e293b; line-height: 1.6; padding: 40px; max-w: 800px; margin: 0 auto; }
                    .header { border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
                    .code { font-size: 28px; font-weight: 900; color: #1e3a8a; margin: 0; }
                    .meta { background: #f1f5f9; padding: 15px; border-radius: 8px; margin-bottom: 25px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 13px; }
                    .section-title { font-size: 16px; font-weight: bold; color: #2563eb; text-transform: uppercase; margin-top: 30px; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; }
                    .step { background: #ffffff; border: 1px solid #e2e8f0; padding: 15px; border-radius: 6px; margin-top: 15px; }
                    .step-num { font-weight: bold; color: #0284c7; font-size: 14px; }
                    .hazards { background: #fff1f2; border-left: 4px solid #e11d48; padding: 15px; color: #881337; font-size: 13px; margin-top: 20px; }
                    .footer { margin-top: 50px; pt-20; border-top: 1px solid #cbd5e1; font-size: 11px; color: #64748b; text-align: center; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div>
                        <span style="font-size: 12px; font-weight: bold; color: #0284c7; text-transform: uppercase;">Quality Group &bull; ${sop.category}</span>
                        <h1 class="code">${sop.code}: ${sop.title}</h1>
                    </div>
                    <div style="text-align: right; font-weight: bold; font-size: 14px; color: #475569;">
                        ${sop.revision}<br/><span style="font-size: 12px; color: #10b981;">Status: ${sop.status}</span>
                    </div>
                </div>

                <div class="meta">
                    <div><strong>Plant Area:</strong> ${sop.area}</div>
                    <div><strong>Effective Date:</strong> ${sop.effectiveDate || 'N/A'}</div>
                    <div><strong>Author / Approver:</strong> ${sop.author}</div>
                    <div><strong>Department:</strong> ${sop.department || 'Hydrometallurgy QA'}</div>
                </div>

                <div class="section-title">1. Executive Scope & Summary</div>
                <p style="font-size: 14px;">${sop.summary}</p>

                ${sop.hazards ? `
                <div class="hazards">
                    <strong>⚠️ SAFETY CRITICAL & HAZARD WARNING:</strong><br/>
                    ${sop.hazards}
                </div>
                ` : ''}

                <div class="section-title">2. Step-by-Step Procedure Checklist</div>
                ${sop.steps && sop.steps.length > 0 ? sop.steps.map(st => `
                    <div class="step">
                        <div class="step-num">Step ${st.step}: ${st.title}</div>
                        <div style="font-size: 13px; margin-top: 5px;">${st.detail}</div>
                    </div>
                `).join('') : '<p>No steps listed.</p>'}

                <div class="footer">
                    Quality Group &bull; MS Section Quality Portal &bull; Generated on ${new Date().toLocaleString()}<br/>
                    Confidential Hydrometallurgical Operational Standard. Zero-Defect Enforcement.
                </div>
                <script>window.print();</script>
            </body>
            </html>
        `;

        const printWin = window.open('', '_blank');
        printWin.document.open();
        printWin.document.write(printHtml);
        printWin.document.close();
    }

    // Export Entire Library as JSON or CSV Backup
    function exportLibrary(format = 'json') {
        if (sopList.length === 0) {
            alert('No S.O.P manuals available to export.');
            return;
        }

        if (format === 'json') {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sopList, null, 2));
            const dlAnchor = document.createElement('a');
            dlAnchor.setAttribute("href", dataStr);
            dlAnchor.setAttribute("download", `QAGroup_SOP_Library_Backup_${new Date().toISOString().split('T')[0]}.json`);
            document.body.appendChild(dlAnchor);
            dlAnchor.click();
            dlAnchor.remove();
            alert('✅ S.O.P Library successfully exported as JSON backup.');
            return;
        }
    }

    // Open Import Modal
    function openImportModal() {
        document.getElementById('import-file-input').value = '';
        document.getElementById('import-analysis-report').innerHTML = '';
        document.getElementById('import-analysis-report').classList.add('hidden');
        document.getElementById('btn-confirm-import').disabled = true;
        analyzedImportData = null;
        openModal('sopImportModal');
    }

    // Analyze Uploaded JSON/CSV File (Schema Inspection & Duplicates Check)
    function analyzeImportFile(input) {
        if (!input.files || input.files.length === 0) return;
        const file = input.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            try {
                let parsed = [];
                if (file.name.endsWith('.json')) {
                    parsed = JSON.parse(e.target.result);
                    if (!Array.isArray(parsed)) parsed = [parsed];
                } else if (file.name.endsWith('.csv')) {
                    parsed = parseCSV(e.target.result);
                } else {
                    alert('Unsupported file format. Please select a .json or .csv file.');
                    return;
                }

                // Analyze Parsed Data Array
                let validCount = 0;
                let duplicateCount = 0;
                let areaCounts = { 'FNTRL Area': 0, 'MS-Dezinc Area': 0, 'H2S Area': 0, 'Limestone Area': 0, 'DCS Control': 0, 'Other': 0 };

                const validRecords = [];
                parsed.forEach(item => {
                    if (item.code && item.title) {
                        validCount++;
                        // Check duplicate
                        const isDup = sopList.some(s => s.code.toUpperCase() === item.code.toUpperCase());
                        if (isDup) duplicateCount++;

                        const areaKey = areaCounts[item.area] !== undefined ? item.area : 'Other';
                        areaCounts[areaKey]++;

                        validRecords.push({
                            id: item.id || ('sop-imp-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4)),
                            code: item.code.toUpperCase(),
                            title: item.title,
                            category: item.category || 'S.O.P Manual',
                            area: item.area || 'FNTRL Area',
                            revision: item.revision || 'Rev 1.0',
                            status: item.status || 'Active',
                            effectiveDate: item.effectiveDate || new Date().toISOString().split('T')[0],
                            author: item.author || 'Imported Data Archive',
                            department: item.department || 'Quality Assurance Group',
                            summary: item.summary || 'Imported laboratory standard operating procedure.',
                            steps: item.steps || [{ step: 1, title: 'Standard Operational Review', detail: 'Execute protocol as per QA specification.' }],
                            hazards: item.hazards || '',
                            attachments: item.attachments || [],
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        });
                    }
                });

                analyzedImportData = validRecords;

                // Render Analysis Report Card inside Modal
                const reportEl = document.getElementById('import-analysis-report');
                reportEl.classList.remove('hidden');
                reportEl.innerHTML = `
                    <div class="bg-dark-700/80 p-4 rounded-xl border border-cyan-500/40 space-y-4">
                        <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                            <span class="text-xs font-bold text-cyan-400 uppercase tracking-wider"><i class="fas fa-microchip mr-1"></i> Schema Analysis Results</span>
                            <span class="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">100% Readable</span>
                        </div>

                        <div class="grid grid-cols-3 gap-2 text-center text-xs">
                            <div class="bg-dark-900 p-2.5 rounded-lg border border-slate-800">
                                <span class="text-[10px] text-slate-400 block">Total Found</span>
                                <span class="text-base font-black text-white">${parsed.length}</span>
                            </div>
                            <div class="bg-dark-900 p-2.5 rounded-lg border border-slate-800">
                                <span class="text-[10px] text-slate-400 block">Valid Schema</span>
                                <span class="text-base font-black text-emerald-400">${validCount}</span>
                            </div>
                            <div class="bg-dark-900 p-2.5 rounded-lg border border-slate-800">
                                <span class="text-[10px] text-slate-400 block">Duplicates</span>
                                <span class="text-base font-black ${duplicateCount > 0 ? 'text-amber-400' : 'text-sky-400'}">${duplicateCount}</span>
                            </div>
                        </div>

                        <div>
                            <span class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Plant Area Distribution</span>
                            <div class="space-y-1 text-xs">
                                ${Object.entries(areaCounts).filter(([k, v]) => v > 0).map(([k, v]) => `
                                    <div class="flex items-center justify-between bg-dark-900 px-3 py-1 rounded text-[11px] text-slate-300 font-medium">
                                        <span>${k}</span>
                                        <span class="font-bold text-sky-400">${v} Docs</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <p class="text-[11px] text-slate-400 italic">
                            * Confirming import will merge ${validCount} valid protocols into your existing LocalStorage database without overwriting current active telemetry loops.
                        </p>
                    </div>
                `;

                document.getElementById('btn-confirm-import').disabled = (validCount === 0);

            } catch (err) {
                alert('Error analyzing file schema: ' + err.message);
                console.error(err);
            }
        };
        reader.readAsText(file);
    }

    // Confirm & Merge Imported Data into LocalStorage
    function confirmImportMerge() {
        if (!analyzedImportData || analyzedImportData.length === 0) return;

        let addedCount = 0;
        let updatedCount = 0;

        analyzedImportData.forEach(newDoc => {
            const index = sopList.findIndex(s => s.code.toUpperCase() === newDoc.code.toUpperCase());
            if (index !== -1) {
                // Update existing duplicate
                sopList[index] = { ...sopList[index], ...newDoc, updatedAt: new Date().toISOString() };
                updatedCount++;
            } else {
                // Add new
                sopList.unshift(newDoc);
                addedCount++;
            }
        });

        addHistoryLog('imp-' + Date.now(), 'BATCH_IMPORT', 'CREATED', `Imported data archive: Added ${addedCount} new protocols and merged ${updatedCount} existing revisions.`);
        saveData();
        closeModal('sopImportModal');
        render();
        alert(`🎉 Data Import Successful!\n\nAdded: ${addedCount} New Documents\nUpdated/Merged: ${updatedCount} Duplicates`);
    }

    // Simple CSV Parser utility
    function parseCSV(text) {
        const lines = text.split('\n').map(l => l.trim()).filter(l => l);
        if (lines.length < 2) return [];
        const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
        const result = [];
        for (let i = 1; i < lines.length; i++) {
            const vals = lines[i].split(',').map(v => v.replace(/"/g, '').trim());
            const obj = {};
            headers.forEach((h, idx) => { obj[h] = vals[idx] || ''; });
            result.push(obj);
        }
        return result;
    }

    // Modal Helper Handlers
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        const content = modal.children[0];
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        setTimeout(() => {
            if (content) {
                content.classList.remove('scale-95');
                content.classList.add('scale-100');
            }
        }, 10);
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        const content = modal.children[0];
        if (content) {
            content.classList.remove('scale-100');
            content.classList.add('scale-95');
        }
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }, 200);
    }

    // Public API Exposed to Window
    window.SOPManual = {
        init,
        open: function (type) {
            const section = document.getElementById('sop-section');
            if (section) section.scrollIntoView({ behavior: 'smooth' });
            if (type === 'procedure') switchTab('QA Procedure');
            else if (type === 'sop') switchTab('S.O.P Manual');
            else switchTab('ALL');
        },
        switchTab,
        handleSearch,
        handleAreaFilter,
        openCreateModal,
        openEditModal,
        openImportModal,
        viewDetails,
        deleteSop,
        handleFormSubmit,
        addStepInput,
        reindexSteps,
        handleFileUpload,
        removeAttachment,
        downloadDocument,
        exportLibrary,
        analyzeImportFile,
        confirmImportMerge,
        closeModal
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();