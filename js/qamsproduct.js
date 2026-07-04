
/**
 * ============================================================================
 * QUALITY GROUP | MS SECTION - PRODUCT QUALITY MODULE (qamsproduct.js)
 * Standalone Interactive Data & Management System
 * ============================================================================
 * Features & Updates:
 * - Replaced "QA Analysis" with "Product Quality" across all data structures & UI.
 * - Integrated Real-time Data from MS Section Bulletin Board (Jan - Jun 2026):
 *   * Monthly Actual vs. Target Tonnage
 *   * Chemical Compliance Rates (Zn, Mg, Cr, PS, H2O)
 *   * YTD Incident Tracking (Near Misses: 4, Internal Claims: 1, External: 0)
 * - Interactive Digital Bulletin Board Widget with click-to-filter & cell analysis.
 * - Isolated Data Store with LocalStorage persistence & rich hydrometallurgical seed data.
 * - Complete CRUD Operations, File Upload Simulation, and Audit Trail Logging.
 * ============================================================================
 */

(function (window, document) {
    'use strict';

    // ========================================================================
    // 1. DATA STORAGE, BULLETIN BOARD MATRIX & STATE MANAGEMENT
    // ========================================================================
    const STORAGE_KEY = 'QAMS_Product_Records_v2';
    const HISTORY_KEY = 'QAMS_Product_History_v2';

    // Exact Data extracted from the attached Product Quality Bulletin Board
    const BulletinBoardData = {
        monthsAll: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
        monthsActive: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'],
        incidents: {
            nearMiss:      [3, 0, 0, 0, 1, 0, '-', '-', '-', '-', '-', '-'],
            nearMissYTD:   4,
            internalClaim: [1, 0, 0, 0, 0, 0, '-', '-', '-', '-', '-', '-'],
            internalYTD:   1,
            externalClaim: [0, 0, 0, 0, 0, 0, '-', '-', '-', '-', '-', '-'],
            externalYTD:   0
        },
        production: {
            actual: ['2011.23', '2278.25', '1458.30', '2701.88', '2844.44', '2718.53'],
            target: ['2765.00', '2488.00', '1572.00', '2673.00', '2765.00', '2673.00']
        },
        compliance: {
            Zn:  ['96.56%', '97.41%', '95.76%', '99.18%', '98.90%', '100.00%'],
            Mg:  ['90.25%', '77.64%', '89.38%', '87.54%', '89.38%', '100.00%'],
            Cr:  ['95.45%', '84.99%', '70.17%', '83.85%', '95.64%', '96.56%'],
            PS:  ['87.03%', '99.52%', '97.61%', '100.00%', '98.07%', '96.21%'],
            H2O: ['86.01%', '96.17%', '87.60%', '92.05%', '92.75%', '100.00%']
        }
    };

    // Default Seed Data representing Quality by MS Product Operations (Aligned with bulletin board)
    const defaultRecords = [
        {
            id: 'QAMS-2026-JUN01',
            category: 'product_quality',
            title: 'June 2026 MS Product Quality & Tonnage Verification',
            area: 'MS-Dezinc Area',
            reporter: 'Engr. M. Santos (Lead QA Lab)',
            date: '2026-06-30',
            status: 'Approved',
            description: 'Monthly production tonnage achieved 2,718.53 MT against target of 2,673.00 MT. Zinc (Zn), Magnesium (Mg), and Moisture (H2O) achieved 100.00% zero-defect compliance.',
            capa: 'No corrective action needed. Excellent solvent extraction and phase separation efficiency.',
            metricName: 'Zn / Mg / H2O Compliance',
            metricValue: '100.00%',
            metricLimit: '> 98.00% Target',
            isCompliant: true,
            attachments: [
                { name: 'June_2026_MS_Product_Certificate.pdf', size: '2.1 MB', type: 'application/pdf' },
                { name: 'June_Daily_Titration_Assays.csv', size: '410 KB', type: 'text/csv' }
            ],
            history: [
                { timestamp: '2026-06-30 16:00', action: 'Record Approved', user: 'Lead QA Chief' },
                { timestamp: '2026-06-30 14:30', action: 'Record Created', user: 'Engr. M. Santos' }
            ]
        },
        {
            id: 'QAMS-2026-MAY01',
            category: 'product_quality',
            title: 'May 2026 MS Production Record Exceeded Target',
            area: 'FNTRL Area',
            reporter: 'Chemist K. Lim (QA Lab)',
            date: '2026-05-31',
            status: 'Approved',
            description: 'Actual Mixed Sulphide production reached 2,844.44 MT (Target: 2,765.00 MT). Zinc purity compliance recorded at 98.90%, PS at 98.07%.',
            capa: 'Continuous optimization of flocculant dosing loops maintained high recovery rate.',
            metricName: 'May Tonnage Output',
            metricValue: '2,844.44 MT',
            metricLimit: '2,765.00 MT Target',
            isCompliant: true,
            attachments: [
                { name: 'May_Production_Quality_Summary.pdf', size: '1.8 MB', type: 'application/pdf' }
            ],
            history: [
                { timestamp: '2026-05-31 17:00', action: 'Record Verified', user: 'QA Compliance Committee' }
            ]
        },
        {
            id: 'QAMS-2026-MAY02',
            category: 'nearmiss',
            title: 'Phase Separation Delay during Solvent Extraction',
            area: 'MS-Dezinc Area',
            reporter: 'J. Reyes (Field Technician)',
            date: '2026-05-18',
            status: 'Resolved',
            description: 'Logged as the single (1) Quality Near Miss for May 2026. Transient organic/aqueous phase separation delay observed exceeding 90 seconds.',
            capa: 'Sub DCS mixer impeller speed calibrated from 120 RPM to 105 RPM. Phase separation time normalized to 72 seconds.',
            metricName: 'Phase Separation Time',
            metricValue: '98 sec (Spike)',
            metricLimit: '60 - 90 sec',
            isCompliant: false,
            attachments: [
                { name: 'DCS_Alarm_Dezinc_May18.json', size: '312 KB', type: 'application/json' }
            ],
            history: [
                { timestamp: '2026-05-18 15:30', action: 'Near Miss CAPA Closed', user: 'Engr. D. Cruz' },
                { timestamp: '2026-05-18 10:15', action: 'Near Miss Logged', user: 'J. Reyes' }
            ]
        },
        {
            id: 'QAMS-2026-APR01',
            category: 'product_quality',
            title: 'April 2026 PS (Particle Size) 100% Compliance Benchmark',
            area: 'Limestone Area',
            reporter: 'Engr. L. Bautista',
            date: '2026-04-30',
            status: 'Approved',
            description: 'April production output: 2,701.88 MT (Target: 2,673.00 MT). Particle Specification (PS) reached a perfect 100.00% compliance rate.',
            capa: 'Standardized screen mesh cleaning protocol SOP-LS-402 proved highly effective.',
            metricName: 'PS Compliance Rate',
            metricValue: '100.00%',
            metricLimit: '> 95.00%',
            isCompliant: true,
            attachments: [],
            history: [
                { timestamp: '2026-04-30 16:20', action: 'Record Approved', user: 'Lead QA Chief' }
            ]
        },
        {
            id: 'QAMS-2026-JAN01',
            category: 'claim',
            title: 'Internal Quality Claim: Jan 2026 Shipment Impurity Review',
            area: 'H2S Area',
            reporter: 'QA Compliance Committee',
            date: '2026-01-22',
            status: 'Closed',
            description: 'Logged as the single (1) Internal Quality Claim YTD. Temporary dip in Magnesium (Mg) removal efficiency to 90.25% caused an internal refinery inquiry.',
            capa: 'Scrubber caustic pH interlock setpoint elevated to 10.8 pH. Subsequent shipments from Feb-June verified zero external claims.',
            metricName: 'Mg Removal Rate',
            metricValue: '90.25%',
            metricLimit: '> 92.00%',
            isCompliant: false,
            attachments: [
                { name: 'Internal_Claim_Investigation_Report.pdf', size: '3.4 MB', type: 'application/pdf' }
            ],
            history: [
                { timestamp: '2026-01-25 14:00', action: 'Internal Claim Resolved & Closed', user: 'Lead QA Chief' }
            ]
        },
        {
            id: 'QAMS-2026-SOP01',
            category: 'document',
            title: 'SOP-MS-101: Mixed Sulphide Product Quality Titration Manual',
            area: 'MS-Dezinc Area',
            reporter: 'QA Documentation Team',
            date: '2026-06-15',
            status: 'Active',
            description: 'Updated standard operating procedure governing product purity assay methods for Zn, Mg, Cr, and Moisture content analysis.',
            capa: 'Revision 4.3 published to include mandatory digital checklist verifications for field chemists.',
            metricName: 'Document Revision',
            metricValue: 'Rev 4.3',
            metricLimit: 'Active Status',
            isCompliant: true,
            attachments: [
                { name: 'SOP_MS_101_Rev4.3_Official.pdf', size: '4.5 MB', type: 'application/pdf' }
            ],
            history: [
                { timestamp: '2026-06-15 09:00', action: 'Document Revision 4.3 Published', user: 'QA Documentation Team' }
            ]
        },
        {
            id: 'QAMS-2026-IMP01',
            category: 'improvement',
            title: 'Automated Flocculant Dosing Optimization in FNTRL Area',
            area: 'FNTRL Area',
            reporter: 'R. Gomez (Lab Chemist)',
            date: '2026-06-25',
            status: 'Open',
            description: 'Proposal to integrate inline optical turbidity sensors with the Sub DCS automated dosing loop to improve tailings recovery and boost Cr compliance.',
            capa: 'Trial installation of optical sensor #TB-204 scheduled for Q3 2026 maintenance shutdown.',
            metricName: 'Tailings Ni Loss',
            metricValue: '0.032 g/L',
            metricLimit: '< 0.050 g/L',
            isCompliant: true,
            attachments: [],
            history: [
                { timestamp: '2026-06-25 11:45', action: 'Improvement Proposal Submitted', user: 'R. Gomez' }
            ]
        }
    ];

    const defaultHistory = [
        { id: 'LOG-1', timestamp: '2026-06-30 16:00', action: 'Approved Record QAMS-2026-JUN01', user: 'Lead QA Chief', details: 'June Product Quality tonnage and 100% compliance verified.' },
        { id: 'LOG-2', timestamp: '2026-06-25 11:45', action: 'Created Improvement QAMS-2026-IMP01', user: 'R. Gomez', details: 'Submitted flocculant dosing optimization proposal.' },
        { id: 'LOG-3', timestamp: '2026-06-15 09:00', action: 'Updated Document QAMS-2026-SOP01', user: 'QA Documentation Team', details: 'Published SOP-MS-101 Revision 4.3.' },
        { id: 'LOG-4', timestamp: '2026-05-18 15:30', action: 'Resolved Near Miss QAMS-2026-MAY02', user: 'Engr. D. Cruz', details: 'Impeller speed calibrated to resolve phase separation delay.' }
    ];

    // State Management Object
    const Store = {
        getRecords: () => {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : defaultRecords;
        },
        saveRecords: (records) => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
        },
        getHistory: () => {
            const stored = localStorage.getItem(HISTORY_KEY);
            return stored ? JSON.parse(stored) : defaultHistory;
        },
        addHistory: (action, details = '', user = 'Current QA User') => {
            const history = Store.getHistory();
            const now = new Date();
            const timestamp = `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0].substring(0, 5)}`;
            history.unshift({
                id: 'LOG-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
                timestamp,
                action,
                user,
                details
            });
            localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
        }
    };

    // ========================================================================
    // 2. MAIN APPLICATION CONTROLLER & UI RENDERER
    // ========================================================================
    const QAMSProduct = {
        activeTab: 'all',
        searchQuery: '',

        // Initialize and inject the UI into index.html
        init: function () {
            this.injectPortalContainer();
            this.render();
            console.log('✅ MS Section - Product Quality Module successfully initialized.');
        },

        // Open specific tab from sidebar links (Backward compatible with 'analysis')
        open: function (category = 'all') {
            // Map legacy 'analysis' links from index.html to 'product_quality'
            if (category === 'analysis') {
                category = 'product_quality';
            }
            this.activeTab = category;
            this.render();
            const portal = document.getElementById('qamsproduct-portal');
            if (portal) {
                portal.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        },

        // Create the container inside index.html if it doesn't exist
        injectPortalContainer: function () {
            if (document.getElementById('qamsproduct-portal')) return;

            const portalSection = document.createElement('section');
            portalSection.id = 'qamsproduct-portal';
            portalSection.className = 'py-16 px-4 sm:px-8 bg-dark-900 border-b border-slate-800/80';

            // Insert right above the calendar section
            const calendarSection = document.getElementById('calendar-section');
            if (calendarSection && calendarSection.parentNode) {
                calendarSection.parentNode.insertBefore(portalSection, calendarSection);
            } else {
                const main = document.querySelector('main');
                if (main) main.appendChild(portalSection);
            }
        },

        // Get filtered records based on current active tab and search query
        getFilteredRecords: function () {
            let records = Store.getRecords();
            if (this.activeTab !== 'all') {
                records = records.filter(r => r.category === this.activeTab);
            }
            if (this.searchQuery.trim() !== '') {
                const q = this.searchQuery.toLowerCase();
                records = records.filter(r =>
                    r.title.toLowerCase().includes(q) ||
                    r.area.toLowerCase().includes(q) ||
                    r.reporter.toLowerCase().includes(q) ||
                    r.description.toLowerCase().includes(q) ||
                    r.id.toLowerCase().includes(q)
                );
            }
            return records;
        },

        // Filter grid by specific month or parameter clicked on the Bulletin Board
        filterFromBoard: function(keyword) {
            this.searchQuery = keyword;
            this.activeTab = 'all';
            this.render();
            const grid = document.getElementById('qams-grid-section');
            if(grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        },

        // Render the main dashboard
        render: function () {
            const container = document.getElementById('qamsproduct-portal');
            if (!container) return;

            const allRecords = Store.getRecords();
            const filtered = this.getFilteredRecords();

            // Calculate KPI Stats
            const stats = {
                total: allRecords.length,
                quality: allRecords.filter(r => r.category === 'product_quality' || r.category === 'analysis').length,
                docs: allRecords.filter(r => r.category === 'document').length,
                nearmiss: allRecords.filter(r => r.category === 'nearmiss').length,
                claims: allRecords.filter(r => r.category === 'claim').length,
                improvement: allRecords.filter(r => r.category === 'improvement').length,
                compliant: allRecords.filter(r => r.isCompliant).length
            };
            const complianceRate = stats.total > 0 ? ((stats.compliant / stats.total) * 100).toFixed(1) : '100.0';

            container.innerHTML = `
                <div class="max-w-7xl mx-auto">
                    <!-- Section Header -->
                    <div class="flex flex-col md:flex-row md:items-end justify-between mb-8" data-aos="fade-up">
                        <div>
                            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/10 text-amber-400 font-bold text-xs mb-3 border border-amber-500/20 shadow-inner">
                                <i class="fas fa-award"></i> MS Section &bull; Product Quality Assurance Hub
                            </div>
                            <h3 class="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">Product Quality & Spec Management</h3>
                            <p class="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                                Centralized telemetry monitoring, monthly production compliance matrices, SOP manuals, and YTD incident investigations for Mixed Sulphide operations.
                            </p>
                        </div>
                        
                        <!-- Top Action Buttons -->
                        <div class="flex flex-wrap items-center gap-2.5 mt-4 md:mt-0">
                            <button onclick="QAMSProduct.openAddModal()" class="px-4 py-2.5 bg-gradient-to-r from-royalblue-600 to-sky-500 hover:from-royalblue-500 hover:to-sky-400 text-white font-bold text-xs sm:text-sm rounded-xl shadow-[0_0_15px_rgba(14,165,233,0.4)] transition-all flex items-center gap-2">
                                <i class="fas fa-plus-circle"></i> Add QA Record
                            </button>
                            <button onclick="QAMSProduct.openUploadModal()" class="px-4 py-2.5 bg-dark-500 hover:bg-dark-400 border border-slate-700 hover:border-emerald-500/50 text-emerald-400 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-2 shadow">
                                <i class="fas fa-cloud-upload-alt"></i> Upload & Analyze
                            </button>
                            <button onclick="QAMSProduct.exportToCSV()" class="px-3.5 py-2.5 bg-dark-500 hover:bg-dark-400 border border-slate-700 text-slate-300 hover:text-white font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5" title="Export CSV">
                                <i class="fas fa-file-csv text-sky-400"></i> Export
                            </button>
                            <button onclick="QAMSProduct.openHistoryModal()" class="px-3.5 py-2.5 bg-dark-500 hover:bg-dark-400 border border-slate-700 text-slate-300 hover:text-white font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5" title="Audit Trail">
                                <i class="fas fa-history text-amber-400"></i> Audit Log
                            </button>
                        </div>
                    </div>

                    <!-- ================================================================= -->
                    <!-- INTERACTIVE DIGITAL BULLETIN BOARD (APPLIED FROM ATTACHED IMAGE) -->
                    <!-- ================================================================= -->
                    <div class="mb-10 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-dark-500 via-dark-700 to-dark-900 border-2 border-amber-500/40 shadow-[0_0_35px_rgba(245,158,11,0.15)] relative overflow-hidden" data-aos="fade-up">
                        <div class="absolute top-0 right-0 w-96 h-96 bg-royalblue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
                        
                        <!-- Bulletin Board Title Header -->
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-700/80 gap-3">
                            <div class="flex items-center gap-3">
                                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-dark-900 font-black text-xl shadow-lg">
                                    <i class="fas fa-chart-bar"></i>
                                </div>
                                <div>
                                    <div class="flex items-center gap-2">
                                        <span class="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">Live Plant Matrix</span>
                                        <span class="text-xs text-slate-400 font-medium">Jan &ndash; Jun 2026 Verified</span>
                                    </div>
                                    <h4 class="text-lg sm:text-2xl font-black text-white tracking-wide uppercase mt-0.5">Mixed Sulphide &bull; Product Quality Board</h4>
                                </div>
                            </div>
                            <div class="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-dark-900/60 px-3.5 py-2 rounded-xl border border-slate-700">
                                <i class="fas fa-info-circle text-sky-400"></i>
                                <span>Click any cell or month to filter portal records below</span>
                            </div>
                        </div>

                        <!-- Bulletin Board Two-Column Grid -->
                        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            
                            <!-- LEFT BOARD: QUALITY INCIDENTS & CLAIMS (Jan - Dec) -->
                            <div class="lg:col-span-5 bg-dark-900/80 rounded-xl p-4 border border-slate-700/80 shadow-inner flex flex-col justify-between">
                                <div>
                                    <div class="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                                        <span class="text-xs font-extrabold text-amber-400 uppercase tracking-wider"><i class="fas fa-thumbtack text-rose-500 mr-1.5"></i> Incident & Claim Matrix</span>
                                        <span class="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">2026 YTD</span>
                                    </div>
                                    
                                    <div class="overflow-x-auto no-scrollbar">
                                        <table class="w-full text-center border-collapse text-[11px]">
                                            <thead>
                                                <tr class="text-slate-400 font-bold border-b border-slate-800">
                                                    <th class="py-2 px-2 text-left text-white font-extrabold">Category</th>
                                                    ${BulletinBoardData.monthsAll.slice(0, 6).map(m => `<th class="py-2 px-1 cursor-pointer hover:text-sky-400 transition-colors" onclick="QAMSProduct.filterFromBoard('${m}')">${m}</th>`).join('')}
                                                    <th class="py-2 px-2 bg-amber-500/10 text-amber-400 font-black border-l border-slate-800">YTD</th>
                                                </tr>
                                            </thead>
                                            <tbody class="divide-y divide-slate-800/60 font-semibold text-slate-300">
                                                <tr class="hover:bg-slate-800/40 transition-colors cursor-pointer" onclick="QAMSProduct.open('nearmiss')">
                                                    <td class="py-2.5 px-2 text-left font-bold text-rose-400 flex items-center gap-1.5">
                                                        <span class="w-2 h-2 rounded-full bg-rose-500"></span> Quality Near Miss
                                                    </td>
                                                    ${BulletinBoardData.incidents.nearMiss.slice(0, 6).map(val => `<td class="py-2.5 px-1 ${val > 0 ? 'text-white font-black bg-rose-500/20 rounded' : 'text-slate-500'}">${val}</td>`).join('')}
                                                    <td class="py-2.5 px-2 bg-amber-500/10 text-amber-400 font-black border-l border-slate-800 text-xs">${BulletinBoardData.incidents.nearMissYTD}</td>
                                                </tr>
                                                <tr class="hover:bg-slate-800/40 transition-colors cursor-pointer" onclick="QAMSProduct.open('claim')">
                                                    <td class="py-2.5 px-2 text-left font-bold text-amber-400 flex items-center gap-1.5">
                                                        <span class="w-2 h-2 rounded-full bg-amber-500"></span> Internal Claim
                                                    </td>
                                                    ${BulletinBoardData.incidents.internalClaim.slice(0, 6).map(val => `<td class="py-2.5 px-1 ${val > 0 ? 'text-white font-black bg-amber-500/20 rounded' : 'text-slate-500'}">${val}</td>`).join('')}
                                                    <td class="py-2.5 px-2 bg-amber-500/10 text-amber-400 font-black border-l border-slate-800 text-xs">${BulletinBoardData.incidents.internalYTD}</td>
                                                </tr>
                                                <tr class="hover:bg-slate-800/40 transition-colors cursor-pointer" onclick="QAMSProduct.open('claim')">
                                                    <td class="py-2.5 px-2 text-left font-bold text-emerald-400 flex items-center gap-1.5">
                                                        <span class="w-2 h-2 rounded-full bg-emerald-500"></span> External Claim
                                                    </td>
                                                    ${BulletinBoardData.incidents.externalClaim.slice(0, 6).map(val => `<td class="py-2.5 px-1 ${val > 0 ? 'text-white font-black bg-rose-500/20 rounded' : 'text-slate-500'}">${val}</td>`).join('')}
                                                    <td class="py-2.5 px-2 bg-amber-500/10 text-emerald-400 font-black border-l border-slate-800 text-xs">${BulletinBoardData.incidents.externalYTD}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                                    <span><i class="fas fa-check-circle text-emerald-400 mr-1"></i> Zero External Customer Claims</span>
                                    <span class="text-sky-400 font-bold cursor-pointer hover:underline" onclick="QAMSProduct.open('nearmiss')">View Incident Logs &rarr;</span>
                                </div>
                            </div>

                            <!-- RIGHT BOARD: PRODUCT QUALITY SPECIFICATIONS & TONNAGE (Jan - Jun) -->
                            <div class="lg:col-span-7 bg-dark-900/80 rounded-xl p-4 border border-slate-700/80 shadow-inner flex flex-col justify-between">
                                <div>
                                    <div class="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                                        <span class="text-xs font-extrabold text-amber-400 uppercase tracking-wider"><i class="fas fa-thumbtack text-sky-500 mr-1.5"></i> Product Quality Compliance Rate & Tonnage</span>
                                        <span class="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">Target: &gt;98%</span>
                                    </div>

                                    <div class="overflow-x-auto no-scrollbar">
                                        <table class="w-full text-center border-collapse text-[11px]">
                                            <thead>
                                                <tr class="text-slate-400 font-bold border-b border-slate-800">
                                                    <th class="py-2 px-2 text-left text-white font-extrabold">Parameter</th>
                                                    ${BulletinBoardData.monthsActive.map(m => `<th class="py-2 px-2 cursor-pointer hover:text-amber-400 transition-colors font-extrabold text-white bg-slate-800/50 rounded-t" onclick="QAMSProduct.filterFromBoard('${m}')">${m}</th>`).join('')}
                                                </tr>
                                            </thead>
                                            <tbody class="divide-y divide-slate-800/60 font-semibold text-slate-200">
                                                <!-- Actual / Target Row -->
                                                <tr class="bg-amber-500/10 text-amber-300 font-bold border-b-2 border-slate-700">
                                                    <td class="py-2 px-2 text-left font-black text-amber-400 whitespace-nowrap">Actual / Target (MT)</td>
                                                    ${BulletinBoardData.production.actual.map((act, idx) => `
                                                        <td class="py-2 px-1 text-[10px] leading-tight cursor-pointer hover:bg-amber-500/20 transition-colors" title="Actual: ${act} MT | Target: ${BulletinBoardData.production.target[idx]} MT" onclick="QAMSProduct.showCellAnalysis('Production Tonnage', '${BulletinBoardData.monthsActive[idx]}', '${act} / ${BulletinBoardData.production.target[idx]} MT')">
                                                            <span class="text-white font-extrabold block">${act}</span>
                                                            <span class="text-slate-400 text-[9px] font-normal">${BulletinBoardData.production.target[idx]}</span>
                                                        </td>
                                                    `).join('')}
                                                </tr>
                                                <!-- Zn Row -->
                                                <tr class="hover:bg-slate-800/40 transition-colors">
                                                    <td class="py-2 px-2 text-left font-extrabold text-rose-400 cursor-pointer hover:underline" onclick="QAMSProduct.filterFromBoard('Zn')">Zn (Zinc)</td>
                                                    ${BulletinBoardData.compliance.Zn.map((val, idx) => `
                                                        <td class="py-2 px-1 cursor-pointer hover:bg-slate-800 transition-colors ${val === '100.00%' ? 'text-emerald-400 font-black' : ''}" onclick="QAMSProduct.showCellAnalysis('Zn Compliance', '${BulletinBoardData.monthsActive[idx]}', '${val}')">${val}</td>
                                                    `).join('')}
                                                </tr>
                                                <!-- Mg Row -->
                                                <tr class="hover:bg-slate-800/40 transition-colors">
                                                    <td class="py-2 px-2 text-left font-extrabold text-amber-400 cursor-pointer hover:underline" onclick="QAMSProduct.filterFromBoard('Mg')">Mg (Magnesium)</td>
                                                    ${BulletinBoardData.compliance.Mg.map((val, idx) => `
                                                        <td class="py-2 px-1 cursor-pointer hover:bg-slate-800 transition-colors ${val === '100.00%' ? 'text-emerald-400 font-black' : parseFloat(val) < 85 ? 'text-rose-400 font-bold' : ''}" onclick="QAMSProduct.showCellAnalysis('Mg Compliance', '${BulletinBoardData.monthsActive[idx]}', '${val}')">${val}</td>
                                                    `).join('')}
                                                </tr>
                                                <!-- Cr Row -->
                                                <tr class="hover:bg-slate-800/40 transition-colors">
                                                    <td class="py-2 px-2 text-left font-extrabold text-cyan-400 cursor-pointer hover:underline" onclick="QAMSProduct.filterFromBoard('Cr')">Cr (Chromium)</td>
                                                    ${BulletinBoardData.compliance.Cr.map((val, idx) => `
                                                        <td class="py-2 px-1 cursor-pointer hover:bg-slate-800 transition-colors ${parseFloat(val) < 80 ? 'text-rose-400 font-bold' : ''}" onclick="QAMSProduct.showCellAnalysis('Cr Compliance', '${BulletinBoardData.monthsActive[idx]}', '${val}')">${val}</td>
                                                    `).join('')}
                                                </tr>
                                                <!-- PS Row -->
                                                <tr class="hover:bg-slate-800/40 transition-colors">
                                                    <td class="py-2 px-2 text-left font-extrabold text-emerald-400 cursor-pointer hover:underline" onclick="QAMSProduct.filterFromBoard('PS')">PS (Particle Spec)</td>
                                                    ${BulletinBoardData.compliance.PS.map((val, idx) => `
                                                        <td class="py-2 px-1 cursor-pointer hover:bg-slate-800 transition-colors ${val === '100.00%' ? 'text-emerald-400 font-black' : ''}" onclick="QAMSProduct.showCellAnalysis('PS Compliance', '${BulletinBoardData.monthsActive[idx]}', '${val}')">${val}</td>
                                                    `).join('')}
                                                </tr>
                                                <!-- H2O Row -->
                                                <tr class="hover:bg-slate-800/40 transition-colors">
                                                    <td class="py-2 px-2 text-left font-extrabold text-sky-400 cursor-pointer hover:underline" onclick="QAMSProduct.filterFromBoard('H2O')">H2O (Moisture)</td>
                                                    ${BulletinBoardData.compliance.H2O.map((val, idx) => `
                                                        <td class="py-2 px-1 cursor-pointer hover:bg-slate-800 transition-colors ${val === '100.00%' ? 'text-emerald-400 font-black' : ''}" onclick="QAMSProduct.showCellAnalysis('H2O Compliance', '${BulletinBoardData.monthsActive[idx]}', '${val}')">${val}</td>
                                                    `).join('')}
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                                    <span><i class="fas fa-chart-line text-amber-400 mr-1"></i> Q2 Production Exceeded Target for Apr, May &amp; Jun</span>
                                    <span class="text-amber-400 font-bold cursor-pointer hover:underline" onclick="QAMSProduct.open('product_quality')">Filter Quality Assays &rarr;</span>
                                </div>
                            </div>

                        </div>
                    </div>

                    <!-- KPI Statistics Cards -->
                    <div id="qams-grid-section" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
                        <div onclick="QAMSProduct.open('all')" class="p-4 rounded-xl bg-dark-500 border ${this.activeTab === 'all' ? 'border-sky-400 ring-1 ring-sky-400' : 'border-slate-800'} cursor-pointer hover:border-slate-600 transition-all">
                            <span class="text-[11px] font-bold text-slate-400 uppercase block">Total Records</span>
                            <div class="flex items-center justify-between mt-1">
                                <span class="text-2xl font-extrabold text-white">${stats.total}</span>
                                <i class="fas fa-folder-open text-sky-400 text-lg"></i>
                            </div>
                        </div>
                        <div onclick="QAMSProduct.open('product_quality')" class="p-4 rounded-xl bg-dark-500 border ${this.activeTab === 'product_quality' ? 'border-sky-400 ring-1 ring-sky-400' : 'border-slate-800'} cursor-pointer hover:border-slate-600 transition-all">
                            <span class="text-[11px] font-bold text-slate-400 uppercase block">Product Quality</span>
                            <div class="flex items-center justify-between mt-1">
                                <span class="text-2xl font-extrabold text-sky-400">${stats.quality}</span>
                                <i class="fas fa-award text-sky-400 text-lg"></i>
                            </div>
                        </div>
                        <div onclick="QAMSProduct.open('document')" class="p-4 rounded-xl bg-dark-500 border ${this.activeTab === 'document' ? 'border-cyan-400 ring-1 ring-cyan-400' : 'border-slate-800'} cursor-pointer hover:border-slate-600 transition-all">
                            <span class="text-[11px] font-bold text-slate-400 uppercase block">Documents & SOP</span>
                            <div class="flex items-center justify-between mt-1">
                                <span class="text-2xl font-extrabold text-cyan-400">${stats.docs}</span>
                                <i class="fas fa-file-invoice text-cyan-400 text-lg"></i>
                            </div>
                        </div>
                        <div onclick="QAMSProduct.open('nearmiss')" class="p-4 rounded-xl bg-dark-500 border ${this.activeTab === 'nearmiss' ? 'border-amber-400 ring-1 ring-amber-400' : 'border-slate-800'} cursor-pointer hover:border-slate-600 transition-all">
                            <span class="text-[11px] font-bold text-slate-400 uppercase block">Quality Near Miss</span>
                            <div class="flex items-center justify-between mt-1">
                                <span class="text-2xl font-extrabold text-amber-400">${stats.nearmiss}</span>
                                <i class="fas fa-exclamation-triangle text-amber-400 text-lg"></i>
                            </div>
                        </div>
                        <div onclick="QAMSProduct.open('claim')" class="p-4 rounded-xl bg-dark-500 border ${this.activeTab === 'claim' ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-800'} cursor-pointer hover:border-slate-600 transition-all">
                            <span class="text-[11px] font-bold text-slate-400 uppercase block">Quality Claims</span>
                            <div class="flex items-center justify-between mt-1">
                                <span class="text-2xl font-extrabold text-rose-400">${stats.claims}</span>
                                <i class="fas fa-clipboard-check text-rose-400 text-lg"></i>
                            </div>
                        </div>
                        <div class="p-4 rounded-xl bg-gradient-to-br from-dark-500 to-dark-700 border border-slate-800">
                            <span class="text-[11px] font-bold text-slate-400 uppercase block">Compliance Rate</span>
                            <div class="flex items-center justify-between mt-1">
                                <span class="text-2xl font-extrabold ${complianceRate >= 98 ? 'text-emerald-400' : 'text-amber-400'}">${complianceRate}%</span>
                                <i class="fas fa-shield-check text-emerald-400 text-lg"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Search and Filter Bar -->
                    <div class="bg-dark-500 p-4 rounded-2xl border border-slate-800 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <!-- Category Tabs -->
                        <div class="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
                            ${this.renderTabButton('all', 'All Categories', 'fa-layer-group')}
                            ${this.renderTabButton('product_quality', 'Product Quality', 'fa-award', 'text-sky-400')}
                            ${this.renderTabButton('document', 'Documents & SOP', 'fa-file-invoice', 'text-cyan-400')}
                            ${this.renderTabButton('nearmiss', 'Near Miss', 'fa-exclamation-triangle', 'text-amber-400')}
                            ${this.renderTabButton('claim', 'Quality Claims', 'fa-clipboard-check', 'text-rose-400')}
                            ${this.renderTabButton('improvement', 'Improvement', 'fa-lightbulb', 'text-emerald-400')}
                        </div>

                        <!-- Real-time Search Box -->
                        <div class="relative w-full md:w-80">
                            <i class="fas fa-search absolute left-3.5 top-3 text-slate-400 text-xs"></i>
                            <input type="text" value="${this.searchQuery}" oninput="QAMSProduct.handleSearch(this.value)" placeholder="Search Product Quality, ID, area..." class="w-full bg-dark-700 border border-slate-700 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-400 outline-none focus:border-sky-500 transition-all">
                            ${this.searchQuery ? `<button onclick="QAMSProduct.handleSearch('')" class="absolute right-3 top-2.5 text-slate-400 hover:text-white"><i class="fas fa-times text-xs"></i></button>` : ''}
                        </div>
                    </div>

                    <!-- Interactive Data Grid / Table -->
                    <div class="bg-dark-500 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                        <div class="overflow-x-auto">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-dark-700/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                        <th class="py-3.5 px-4">Record ID</th>
                                        <th class="py-3.5 px-4">Category</th>
                                        <th class="py-3.5 px-4">Title & Description</th>
                                        <th class="py-3.5 px-4">Plant Area</th>
                                        <th class="py-3.5 px-4">Quality Specification</th>
                                        <th class="py-3.5 px-4">Status</th>
                                        <th class="py-3.5 px-4 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-800/80 text-xs font-medium text-slate-300">
                                    ${filtered.length > 0 ? filtered.map(r => this.renderTableRow(r)).join('') : `
                                        <tr>
                                            <td colspan="7" class="py-12 text-center text-slate-400 font-normal">
                                                <i class="fas fa-folder-open text-3xl text-slate-600 mb-2 block"></i>
                                                No Product Quality records found matching your filter or search criteria.
                                            </td>
                                        </tr>
                                    `}
                                </tbody>
                            </table>
                        </div>
                        <div class="p-3 bg-dark-700/50 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                            <span>Showing <strong class="text-white">${filtered.length}</strong> of <strong class="text-white">${allRecords.length}</strong> records</span>
                            <span class="text-sky-400 font-semibold"><i class="fas fa-check-circle mr-1"></i> Synced to MS Section Product Quality Board</span>
                        </div>
                    </div>
                </div>
            `;
        },

        renderTabButton: function (key, label, icon, color = 'text-white') {
            const isActive = this.activeTab === key || (key === 'product_quality' && this.activeTab === 'analysis');
            return `
                <button onclick="QAMSProduct.open('${key}')" class="px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${isActive ? 'bg-royalblue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.4)]' : 'bg-dark-700 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/80'}">
                    <i class="fas ${icon} ${isActive ? 'text-white' : color}"></i> ${label}
                </button>
            `;
        },

        renderTableRow: function (r) {
            const badgeColors = {
                product_quality: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
                analysis: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
                document: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
                nearmiss: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                claim: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
                improvement: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            };
            const catLabels = { 
                product_quality: 'Product Quality', 
                analysis: 'Product Quality', 
                document: 'Document', 
                nearmiss: 'Near Miss', 
                claim: 'Quality Claim',
                improvement: 'Improvement' 
            };
            const catIcons = { 
                product_quality: 'fa-award', 
                analysis: 'fa-award', 
                document: 'fa-file-invoice', 
                nearmiss: 'fa-exclamation-triangle', 
                claim: 'fa-clipboard-check',
                improvement: 'fa-lightbulb' 
            };

            const statusColors = {
                'Approved': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
                'Active': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
                'Resolved': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
                'Closed': 'bg-slate-700 text-slate-300 border-slate-600',
                'In Progress': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
                'Open': 'bg-sky-500/20 text-sky-300 border-sky-500/30',
                'Archived': 'bg-slate-700 text-slate-400 border-slate-600'
            };

            return `
                <tr class="hover:bg-slate-800/40 transition-colors group">
                    <td class="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                        <span onclick="QAMSProduct.viewDetails('${r.id}')" class="hover:text-sky-400 cursor-pointer underline decoration-slate-600 hover:decoration-sky-400">${r.id}</span>
                        <span class="block text-[10px] text-slate-500 font-normal mt-0.5"><i class="far fa-calendar mr-1"></i>${r.date}</span>
                    </td>
                    <td class="py-3.5 px-4 whitespace-nowrap">
                        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border ${badgeColors[r.category] || 'bg-slate-800 text-slate-300'}">
                            <i class="fas ${catIcons[r.category]}"></i> ${catLabels[r.category] || 'Product Quality'}
                        </span>
                    </td>
                    <td class="py-3.5 px-4 max-w-xs">
                        <div class="font-bold text-white text-sm truncate group-hover:text-sky-300 transition-colors" title="${r.title}">${r.title}</div>
                        <div class="text-[11px] text-slate-400 truncate mt-0.5" title="${r.description}">${r.description}</div>
                        ${r.attachments && r.attachments.length > 0 ? `<span class="inline-flex items-center gap-1 text-[10px] text-sky-400 mt-1"><i class="fas fa-paperclip"></i> ${r.attachments.length} attachment(s)</span>` : ''}
                    </td>
                    <td class="py-3.5 px-4 whitespace-nowrap">
                        <span class="text-slate-200 font-semibold">${r.area}</span>
                        <span class="block text-[10px] text-slate-500 mt-0.5"><i class="fas fa-user-tag mr-1"></i>${r.reporter.split(' ')[0]}...</span>
                    </td>
                    <td class="py-3.5 px-4 whitespace-nowrap">
                        ${r.metricName ? `
                            <div class="flex items-center gap-1.5">
                                <span class="w-2 h-2 rounded-full ${r.isCompliant ? 'bg-emerald-400' : 'bg-rose-500 animate-ping'}"></span>
                                <span class="font-bold text-white">${r.metricValue}</span>
                            </div>
                            <span class="block text-[10px] text-slate-400 mt-0.5">${r.metricName} (${r.metricLimit})</span>
                        ` : '<span class="text-slate-500 text-[11px] italic">N/A</span>'}
                    </td>
                    <td class="py-3.5 px-4 whitespace-nowrap">
                        <span class="px-2.5 py-1 rounded-md text-[10px] font-bold border ${statusColors[r.status] || 'bg-slate-800 text-slate-300'}">
                            ${r.status}
                        </span>
                    </td>
                    <td class="py-3.5 px-4 text-center whitespace-nowrap">
                        <div class="inline-flex items-center gap-1">
                            <button onclick="QAMSProduct.viewDetails('${r.id}')" class="p-1.5 bg-slate-800 hover:bg-sky-600 hover:text-white text-sky-400 rounded-lg transition-all" title="View Details">
                                <i class="fas fa-eye text-xs"></i>
                            </button>
                            <button onclick="QAMSProduct.openEditModal('${r.id}')" class="p-1.5 bg-slate-800 hover:bg-amber-600 hover:text-white text-amber-400 rounded-lg transition-all" title="Edit Record">
                                <i class="fas fa-edit text-xs"></i>
                            </button>
                            <button onclick="QAMSProduct.deleteRecord('${r.id}')" class="p-1.5 bg-slate-800 hover:bg-rose-600 hover:text-white text-rose-400 rounded-lg transition-all" title="Delete Record">
                                <i class="fas fa-trash-alt text-xs"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        },

        handleSearch: function (val) {
            this.searchQuery = val;
            this.render();
        },

        // ====================================================================
        // 3. BULLETIN BOARD CELL ANALYSIS & CRUD CONTROLLERS
        // ====================================================================

        // Triggered when clicking any parameter cell inside the Bulletin Board
        showCellAnalysis: function(param, month, val) {
            const isTonnage = param.includes('Tonnage');
            const is100 = val === '100.00%';
            const isLow = !isTonnage && parseFloat(val) < 85;

            const modalHtml = `
                <div id="qams-modal" class="fixed inset-0 bg-dark-900/85 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn">
                    <div class="bg-dark-500 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden flex flex-col">
                        <!-- Modal Header -->
                        <div class="bg-gradient-to-r from-amber-500/30 to-royalblue-600/20 p-5 border-b border-slate-800 flex justify-between items-center">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-dark-900 font-black shadow">
                                    <i class="fas fa-chart-pie text-base"></i>
                                </div>
                                <div>
                                    <h3 class="text-base sm:text-lg font-bold text-white">${month} 2026 &bull; ${param}</h3>
                                    <span class="text-xs text-amber-400 font-semibold block">Product Quality Bulletin Board Assay</span>
                                </div>
                            </div>
                            <button onclick="QAMSProduct.closeModal()" class="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800/50">
                                <i class="fas fa-times text-base"></i>
                            </button>
                        </div>

                        <!-- Modal Body -->
                        <div class="p-6 space-y-4 font-sans text-xs sm:text-sm">
                            <div class="p-4 rounded-xl border ${is100 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : isLow ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' : 'bg-dark-700 border-slate-800 text-white'} flex items-center justify-between">
                                <div>
                                    <span class="text-[11px] font-bold uppercase block text-slate-400">Recorded Metric Value</span>
                                    <span class="text-2xl font-black">${val}</span>
                                </div>
                                <i class="fas ${is100 ? 'fa-check-circle text-emerald-400' : isLow ? 'fa-exclamation-triangle text-rose-400 animate-pulse' : 'fa-award text-sky-400'} text-3xl"></i>
                            </div>

                            <div class="space-y-2 text-slate-300 bg-dark-700/60 p-4 rounded-xl border border-slate-800">
                                <h4 class="font-bold text-white uppercase tracking-wider text-xs mb-2 border-b border-slate-800 pb-1.5"><i class="fas fa-vial text-sky-400 mr-1.5"></i> Telemetry &amp; Quality Notes</h4>
                                ${isTonnage ? `
                                    <p class="leading-relaxed">In ${month} 2026, the Mixed Sulphide production plant recorded an output of <strong>${val}</strong>. Continued optimization of solvent extraction and neutralization loops maintained stable throughput.</p>
                                ` : is100 ? `
                                    <p class="leading-relaxed">Perfect zero-defect compliance achieved for <strong>${param}</strong> during the month of ${month}. All laboratory titration assays and continuous DCS sensor loops confirmed 100% adherence to Product Quality standards.</p>
                                ` : isLow ? `
                                    <p class="leading-relaxed">Temporary dip in <strong>${param}</strong> efficiency during ${month}. CAPA protocols were initiated by the QA lab team to adjust chemical dosing setpoints and calibrate field sensors.</p>
                                ` : `
                                    <p class="leading-relaxed">Product quality compliance for <strong>${param}</strong> remained within acceptable operational tolerance during ${month} 2026, meeting hydrometallurgical discharge specifications.</p>
                                `}
                            </div>
                        </div>

                        <!-- Modal Footer -->
                        <div class="p-4 bg-dark-700/80 border-t border-slate-800 flex justify-end gap-2">
                            <button onclick="QAMSProduct.closeModal(); QAMSProduct.filterFromBoard('${month}');" class="px-4 py-2 bg-royalblue-600 hover:bg-royalblue-500 text-white font-bold text-xs rounded-xl shadow transition-all">
                                <i class="fas fa-filter mr-1"></i> Filter ${month} Records
                            </button>
                            <button onclick="QAMSProduct.closeModal()" class="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            `;
            this.showModalHtml(modalHtml);
        },

        // VIEW DETAILS MODAL
        viewDetails: function (id) {
            const r = Store.getRecords().find(item => item.id === id);
            if (!r) return;

            const modalHtml = `
                <div id="qams-modal" class="fixed inset-0 bg-dark-900/85 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn">
                    <div class="bg-dark-500 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden flex flex-col max-h-[90vh]">
                        <!-- Modal Header -->
                        <div class="bg-gradient-to-r from-royalblue-600/30 to-sky-500/20 p-5 border-b border-slate-800 flex justify-between items-center">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-royalblue-600 flex items-center justify-center text-white shadow">
                                    <i class="fas fa-award text-base"></i>
                                </div>
                                <div>
                                    <div class="flex items-center gap-2">
                                        <span class="text-xs font-bold text-sky-400 uppercase tracking-wider">${r.id}</span>
                                        <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">${(r.category === 'analysis' ? 'product_quality' : r.category).toUpperCase().replace('_', ' ')}</span>
                                    </div>
                                    <h3 class="text-base sm:text-lg font-bold text-white truncate max-w-md">${r.title}</h3>
                                </div>
                            </div>
                            <button onclick="QAMSProduct.closeModal()" class="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800/50">
                                <i class="fas fa-times text-base"></i>
                            </button>
                        </div>

                        <!-- Modal Body (Scrollable) -->
                        <div class="p-6 space-y-5 overflow-y-auto font-sans text-xs sm:text-sm">
                            <!-- Metadata Grid -->
                            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-dark-700 rounded-xl border border-slate-800">
                                <div><span class="text-[11px] text-slate-400 block uppercase font-bold">Plant Area</span><span class="text-white font-semibold">${r.area}</span></div>
                                <div><span class="text-[11px] text-slate-400 block uppercase font-bold">Reported By</span><span class="text-white font-semibold">${r.reporter}</span></div>
                                <div><span class="text-[11px] text-slate-400 block uppercase font-bold">Log Date</span><span class="text-white font-semibold">${r.date}</span></div>
                                <div><span class="text-[11px] text-slate-400 block uppercase font-bold">Status</span><span class="text-sky-400 font-bold">${r.status}</span></div>
                            </div>

                            <!-- Quality Specification Check -->
                            ${r.metricName ? `
                                <div class="p-4 rounded-xl border ${r.isCompliant ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'} flex items-center justify-between">
                                    <div class="flex items-center gap-3">
                                        <i class="fas ${r.isCompliant ? 'fa-check-circle text-emerald-400' : 'fa-exclamation-triangle text-rose-500 animate-pulse'} text-2xl"></i>
                                        <div>
                                            <span class="text-[11px] font-bold uppercase ${r.isCompliant ? 'text-emerald-300' : 'text-rose-300'} block">Product Quality Specification</span>
                                            <span class="text-sm font-extrabold text-white">${r.metricName}: ${r.metricValue}</span>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <span class="text-[11px] text-slate-400 block">SOP Limit / Target</span>
                                        <span class="text-xs font-bold text-slate-200">${r.metricLimit}</span>
                                    </div>
                                </div>
                            ` : ''}

                            <!-- Description -->
                            <div>
                                <h4 class="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5"><i class="fas fa-align-left mr-1.5 text-sky-400"></i>Event Summary / Description</h4>
                                <p class="text-slate-300 bg-dark-700/60 p-3.5 rounded-xl border border-slate-800/80 leading-relaxed font-normal">${r.description}</p>
                            </div>

                            <!-- CAPA -->
                            <div>
                                <h4 class="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5"><i class="fas fa-shield-alt mr-1.5 text-emerald-400"></i>Corrective & Preventive Action (CAPA)</h4>
                                <p class="text-slate-300 bg-dark-700/60 p-3.5 rounded-xl border border-slate-800/80 leading-relaxed font-normal">${r.capa || 'No CAPA action specified.'}</p>
                            </div>

                            <!-- Attachments Section -->
                            <div>
                                <h4 class="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2"><i class="fas fa-paperclip mr-1.5 text-cyan-400"></i>Attached QA Documents (${r.attachments ? r.attachments.length : 0})</h4>
                                ${r.attachments && r.attachments.length > 0 ? `
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        ${r.attachments.map((att) => `
                                            <div class="p-2.5 bg-dark-700 rounded-xl border border-slate-800 flex items-center justify-between">
                                                <div class="flex items-center gap-2.5 truncate">
                                                    <i class="fas ${att.name.endsWith('.pdf') ? 'fa-file-pdf text-rose-400' : 'fa-file-csv text-emerald-400'} text-base"></i>
                                                    <div class="truncate">
                                                        <span class="text-xs font-semibold text-white block truncate">${att.name}</span>
                                                        <span class="text-[10px] text-slate-400">${att.size}</span>
                                                    </div>
                                                </div>
                                                <button onclick="QAMSProduct.downloadAttachment('${att.name}')" class="p-1.5 bg-slate-800 hover:bg-sky-600 text-sky-400 hover:text-white rounded-lg transition-all text-xs" title="Download">
                                                    <i class="fas fa-download"></i>
                                                </button>
                                            </div>
                                        `).join('')}
                                    </div>
                                ` : '<p class="text-xs text-slate-500 italic">No attachments uploaded for this record.</p>'}
                            </div>

                            <!-- Item History Timeline -->
                            ${r.history && r.history.length > 0 ? `
                                <div>
                                    <h4 class="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2"><i class="fas fa-history mr-1.5 text-amber-400"></i>Record Audit Trail</h4>
                                    <div class="space-y-2 border-l-2 border-slate-700 pl-3 ml-1">
                                        ${r.history.map(h => `
                                            <div class="text-[11px]">
                                                <span class="text-slate-400 font-semibold">${h.timestamp}</span> &bull; 
                                                <strong class="text-slate-200">${h.action}</strong> 
                                                <span class="text-slate-500">by ${h.user}</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}
                        </div>

                        <!-- Modal Footer -->
                        <div class="p-4 bg-dark-700/80 border-t border-slate-800 flex justify-end gap-2">
                            <button onclick="QAMSProduct.openEditModal('${r.id}')" class="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow transition-all">
                                <i class="fas fa-edit mr-1"></i> Edit Record
                            </button>
                            <button onclick="QAMSProduct.closeModal()" class="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            `;
            this.showModalHtml(modalHtml);
        },

        // ADD / EDIT FORM MODAL
        openAddModal: function (category = 'product_quality') {
            if (category === 'analysis') category = 'product_quality';
            this.renderFormModal(null, category);
        },

        openEditModal: function (id) {
            const r = Store.getRecords().find(item => item.id === id);
            if (r) {
                this.renderFormModal(r);
            }
        },

        renderFormModal: function (record = null, defaultCat = 'product_quality') {
            const isEdit = record !== null;
            const r = record || {
                id: 'QAMS-' + new Date().getFullYear() + '-' + Math.floor(100 + Math.random() * 900),
                category: defaultCat,
                title: '',
                area: 'MS-Dezinc Area',
                reporter: 'Engr. M. Santos (Lead QA Lab)',
                date: new Date().toISOString().split('T')[0],
                status: 'Open',
                description: '',
                capa: '',
                metricName: '',
                metricValue: '',
                metricLimit: '',
                isCompliant: true,
                attachments: []
            };

            const modalHtml = `
                <div id="qams-modal" class="fixed inset-0 bg-dark-900/85 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn">
                    <div class="bg-dark-500 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden flex flex-col max-h-[90vh]">
                        <!-- Modal Header -->
                        <div class="bg-gradient-to-r from-royalblue-600/30 to-sky-500/20 p-5 border-b border-slate-800 flex justify-between items-center">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-royalblue-600 flex items-center justify-center text-white shadow">
                                    <i class="fas ${isEdit ? 'fa-edit' : 'fa-plus'} text-base"></i>
                                </div>
                                <div>
                                    <h3 class="text-base sm:text-lg font-bold text-white">${isEdit ? 'Edit QA Record' : 'Create New QA Record'}</h3>
                                    <span class="text-xs text-sky-400 font-semibold block">${r.id} &bull; Product Quality Assurance</span>
                                </div>
                            </div>
                            <button type="button" onclick="QAMSProduct.closeModal()" class="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800/50">
                                <i class="fas fa-times text-base"></i>
                            </button>
                        </div>

                        <!-- Form Body -->
                        <form onsubmit="QAMSProduct.handleSaveRecord(event, ${isEdit})" class="p-6 space-y-4 overflow-y-auto font-sans text-xs">
                            <input type="hidden" id="form-id" value="${r.id}">
                            
                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Category <span class="text-rose-400">*</span></label>
                                    <select id="form-category" required class="w-full bg-dark-700 border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-sky-500">
                                        <option value="product_quality" ${r.category === 'product_quality' || r.category === 'analysis' ? 'selected' : ''}>Product Quality</option>
                                        <option value="document" ${r.category === 'document' ? 'selected' : ''}>Document & SOP</option>
                                        <option value="nearmiss" ${r.category === 'nearmiss' ? 'selected' : ''}>Near Miss / Incident</option>
                                        <option value="claim" ${r.category === 'claim' ? 'selected' : ''}>Quality Claim</option>
                                        <option value="improvement" ${r.category === 'improvement' ? 'selected' : ''}>For Improvement</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Plant Area <span class="text-rose-400">*</span></label>
                                    <select id="form-area" required class="w-full bg-dark-700 border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-sky-500">
                                        <option value="FNTRL Area" ${r.area === 'FNTRL Area' ? 'selected' : ''}>FNTRL Area</option>
                                        <option value="MS-Dezinc Area" ${r.area === 'MS-Dezinc Area' ? 'selected' : ''}>MS-Dezinc Area</option>
                                        <option value="H2S Area" ${r.area === 'H2S Area' ? 'selected' : ''}>H2S Area</option>
                                        <option value="Limestone Area" ${r.area === 'Limestone Area' ? 'selected' : ''}>Limestone Area</option>
                                        <option value="DCS Control" ${r.area === 'DCS Control' ? 'selected' : ''}>DCS Control Room</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Status <span class="text-rose-400">*</span></label>
                                    <select id="form-status" required class="w-full bg-dark-700 border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-sky-500">
                                        <option value="Open" ${r.status === 'Open' ? 'selected' : ''}>Open</option>
                                        <option value="In Progress" ${r.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                                        <option value="Approved" ${r.status === 'Approved' ? 'selected' : ''}>Approved</option>
                                        <option value="Resolved" ${r.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                                        <option value="Closed" ${r.status === 'Closed' ? 'selected' : ''}>Closed</option>
                                        <option value="Active" ${r.status === 'Active' ? 'selected' : ''}>Active</option>
                                    </select>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Title / Subject <span class="text-rose-400">*</span></label>
                                    <input type="text" id="form-title" required value="${r.title}" placeholder="e.g., June Zn Product Quality Assurance" class="w-full bg-dark-700 border border-slate-700 rounded-xl p-2.5 text-white placeholder-slate-500 outline-none focus:border-sky-500">
                                </div>
                                <div>
                                    <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Reported By / Chemist <span class="text-rose-400">*</span></label>
                                    <input type="text" id="form-reporter" required value="${r.reporter}" placeholder="e.g., Engr. M. Santos" class="w-full bg-dark-700 border border-slate-700 rounded-xl p-2.5 text-white placeholder-slate-500 outline-none focus:border-sky-500">
                                </div>
                            </div>

                            <!-- Quality Specification Section -->
                            <div class="p-3.5 bg-dark-700/60 rounded-xl border border-slate-800 space-y-3">
                                <span class="text-[11px] font-bold text-sky-400 uppercase block"><i class="fas fa-vial mr-1"></i> Product Quality Specification (Optional)</span>
                                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                        <label class="block text-[10px] text-slate-400 mb-1">Parameter Name</label>
                                        <input type="text" id="form-metricName" value="${r.metricName || ''}" placeholder="e.g., Zn Purity Rate" class="w-full bg-dark-700 border border-slate-700 rounded-lg p-2 text-white placeholder-slate-500 text-xs outline-none focus:border-sky-500">
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-slate-400 mb-1">Observed Value</label>
                                        <input type="text" id="form-metricValue" value="${r.metricValue || ''}" placeholder="e.g., 100.00%" class="w-full bg-dark-700 border border-slate-700 rounded-lg p-2 text-white placeholder-slate-500 text-xs outline-none focus:border-sky-500">
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-slate-400 mb-1">SOP Tolerance / Target</label>
                                        <input type="text" id="form-metricLimit" value="${r.metricLimit || ''}" placeholder="e.g., > 98.00% Target" class="w-full bg-dark-700 border border-slate-700 rounded-lg p-2 text-white placeholder-slate-500 text-xs outline-none focus:border-sky-500">
                                    </div>
                                </div>
                                <div class="flex items-center gap-2 pt-1">
                                    <input type="checkbox" id="form-isCompliant" ${r.isCompliant ? 'checked' : ''} class="w-4 h-4 rounded accent-sky-500">
                                    <label for="form-isCompliant" class="text-xs text-slate-300 font-semibold">Parameter meets zero-defect compliance standards</label>
                                </div>
                            </div>

                            <div>
                                <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Detailed Description <span class="text-rose-400">*</span></label>
                                <textarea id="form-description" rows="3" required placeholder="Provide full details of the Product Quality assay, document scope, or incident observations..." class="w-full bg-dark-700 border border-slate-700 rounded-xl p-2.5 text-white placeholder-slate-500 outline-none focus:border-sky-500">${r.description}</textarea>
                            </div>

                            <div>
                                <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Corrective & Preventive Action (CAPA)</label>
                                <textarea id="form-capa" rows="2" placeholder="Specify recommended corrective actions, SOP interlocks, or equipment maintenance..." class="w-full bg-dark-700 border border-slate-700 rounded-xl p-2.5 text-white placeholder-slate-500 outline-none focus:border-sky-500">${r.capa}</textarea>
                            </div>

                            <!-- Attachment Input Simulation -->
                            <div>
                                <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Add Attachment (Simulated File Upload)</label>
                                <div class="flex gap-2">
                                    <input type="text" id="form-att-name" placeholder="Filename (e.g., Product_Quality_Certificate.pdf)" class="flex-1 bg-dark-700 border border-slate-700 rounded-xl p-2 text-white placeholder-slate-500 text-xs outline-none">
                                    <button type="button" onclick="QAMSProduct.addSimulatedAttachment()" class="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold rounded-xl border border-slate-700 text-xs">
                                        <i class="fas fa-plus"></i> Attach
                                    </button>
                                </div>
                                <div id="form-att-list" class="mt-2 space-y-1">
                                    ${(r.attachments || []).map((a) => `
                                        <div class="flex items-center justify-between p-1.5 bg-dark-700 rounded text-[11px] text-slate-300" data-att='${JSON.stringify(a)}'>
                                            <span><i class="fas fa-paperclip text-sky-400 mr-1.5"></i>${a.name} (${a.size})</span>
                                            <button type="button" onclick="this.parentElement.remove()" class="text-rose-400 hover:text-white"><i class="fas fa-times"></i></button>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            <!-- Modal Footer -->
                            <div class="pt-4 border-t border-slate-800 flex justify-end gap-2">
                                <button type="button" onclick="QAMSProduct.closeModal()" class="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all">Cancel</button>
                                <button type="submit" class="px-6 py-2.5 bg-gradient-to-r from-royalblue-600 to-sky-500 hover:from-royalblue-500 text-white font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(14,165,233,0.3)] transition-all">
                                    <i class="fas fa-save mr-1"></i> Save QA Record
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
            this.showModalHtml(modalHtml);
        },

        addSimulatedAttachment: function () {
            const nameInput = document.getElementById('form-att-name');
            const name = nameInput.value.trim();
            if (!name) {
                alert('Please enter a simulated filename.');
                return;
            }
            const att = {
                name: name,
                size: (Math.random() * 3 + 0.5).toFixed(1) + ' MB',
                type: name.endsWith('.csv') ? 'text/csv' : 'application/pdf'
            };
            const list = document.getElementById('form-att-list');
            const div = document.createElement('div');
            div.className = "flex items-center justify-between p-1.5 bg-dark-700 rounded text-[11px] text-slate-300";
            div.setAttribute('data-att', JSON.stringify(att));
            div.innerHTML = `
                <span><i class="fas fa-paperclip text-sky-400 mr-1.5"></i>${att.name} (${att.size})</span>
                <button type="button" onclick="this.parentElement.remove()" class="text-rose-400 hover:text-white"><i class="fas fa-times"></i></button>
            `;
            list.appendChild(div);
            nameInput.value = '';
        },

        handleSaveRecord: function (event, isEdit) {
            event.preventDefault();
            const id = document.getElementById('form-id').value;

            // Gather attachments from DOM
            const attElements = document.querySelectorAll('#form-att-list [data-att]');
            const attachments = Array.from(attElements).map(el => JSON.parse(el.getAttribute('data-att')));

            const recordData = {
                id: id,
                category: document.getElementById('form-category').value,
                title: document.getElementById('form-title').value.trim(),
                area: document.getElementById('form-area').value,
                reporter: document.getElementById('form-reporter').value.trim(),
                date: new Date().toISOString().split('T')[0],
                status: document.getElementById('form-status').value,
                description: document.getElementById('form-description').value.trim(),
                capa: document.getElementById('form-capa').value.trim(),
                metricName: document.getElementById('form-metricName').value.trim(),
                metricValue: document.getElementById('form-metricValue').value.trim(),
                metricLimit: document.getElementById('form-metricLimit').value.trim(),
                isCompliant: document.getElementById('form-isCompliant').checked,
                attachments: attachments
            };

            let records = Store.getRecords();
            if (isEdit) {
                const idx = records.findIndex(r => r.id === id);
                if (idx !== -1) {
                    recordData.history = records[idx].history || [];
                    recordData.history.unshift({
                        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
                        action: 'Record Updated via Portal',
                        user: 'Current QA User'
                    });
                    records[idx] = recordData;
                    Store.addHistory(`Updated Record ${id}`, `Title changed to: ${recordData.title}`);
                }
            } else {
                recordData.history = [{
                    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
                    action: 'Record Created via Portal',
                    user: 'Current QA User'
                }];
                records.unshift(recordData);
                Store.addHistory(`Created Record ${id}`, `Category: ${recordData.category.toUpperCase()}`);
            }

            Store.saveRecords(records);
            this.closeModal();
            this.render();
            alert(`✅ Record ${id} has been successfully saved to the MS Section database!`);
        },

        deleteRecord: function (id) {
            if (!confirm(`Are you sure you want to delete QA Record ${id}? This action cannot be undone.`)) return;

            let records = Store.getRecords();
            records = records.filter(r => r.id !== id);
            Store.saveRecords(records);
            Store.addHistory(`Deleted Record ${id}`, 'Removed from system storage.');
            this.render();
            alert(`🗑️ Record ${id} has been removed.`);
        },

        // ====================================================================
        // 4. AUDIT TRAIL & HISTORY LOG MODAL
        // ====================================================================
        openHistoryModal: function () {
            const history = Store.getHistory();
            const modalHtml = `
                <div id="qams-modal" class="fixed inset-0 bg-dark-900/85 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn">
                    <div class="bg-dark-500 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden flex flex-col max-h-[85vh]">
                        <!-- Header -->
                        <div class="bg-gradient-to-r from-amber-500/20 to-rose-500/10 p-5 border-b border-slate-800 flex justify-between items-center">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow">
                                    <i class="fas fa-history text-base"></i>
                                </div>
                                <div>
                                    <h3 class="text-base sm:text-lg font-bold text-white">System Audit Trail & History Log</h3>
                                    <span class="text-xs text-amber-300 font-semibold block">Chronological Activity Tracking</span>
                                </div>
                            </div>
                            <button onclick="QAMSProduct.closeModal()" class="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800/50">
                                <i class="fas fa-times text-base"></i>
                            </button>
                        </div>

                        <!-- Log List -->
                        <div class="p-6 overflow-y-auto space-y-3 font-sans text-xs">
                            ${history.length > 0 ? history.map(h => `
                                <div class="p-3 bg-dark-700 rounded-xl border border-slate-800/80 flex items-start justify-between gap-4">
                                    <div class="flex items-start gap-3">
                                        <i class="fas fa-check-circle text-sky-400 mt-0.5"></i>
                                        <div>
                                            <div class="font-bold text-white">${h.action}</div>
                                            <div class="text-[11px] text-slate-400 mt-0.5">${h.details || 'No further details recorded.'}</div>
                                        </div>
                                    </div>
                                    <div class="text-right whitespace-nowrap">
                                        <span class="text-[10px] text-slate-500 block font-semibold">${h.timestamp}</span>
                                        <span class="text-[10px] text-sky-400 font-bold">${h.user}</span>
                                    </div>
                                </div>
                            `).join('') : '<p class="text-center text-slate-500 py-6">No audit history recorded yet.</p>'}
                        </div>

                        <!-- Footer -->
                        <div class="p-4 bg-dark-700/80 border-t border-slate-800 flex justify-end">
                            <button onclick="QAMSProduct.closeModal()" class="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all">Close Log</button>
                        </div>
                    </div>
                </div>
            `;
            this.showModalHtml(modalHtml);
        },

        // ====================================================================
        // 5. UPLOAD & AUTOMATED DATA ANALYSIS ENGINE
        // ====================================================================
        openUploadModal: function () {
            const modalHtml = `
                <div id="qams-modal" class="fixed inset-0 bg-dark-900/85 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn">
                    <div class="bg-dark-500 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden flex flex-col">
                        <!-- Header -->
                        <div class="bg-gradient-to-r from-emerald-600/20 to-cyan-500/10 p-5 border-b border-slate-800 flex justify-between items-center">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow">
                                    <i class="fas fa-cloud-upload-alt text-base"></i>
                                </div>
                                <div>
                                    <h3 class="text-base sm:text-lg font-bold text-white">Upload & Analyze QA Data</h3>
                                    <span class="text-xs text-emerald-300 font-semibold block">Automated Out-of-Spec Detection Engine</span>
                                </div>
                            </div>
                            <button onclick="QAMSProduct.closeModal()" class="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800/50">
                                <i class="fas fa-times text-base"></i>
                            </button>
                        </div>

                        <!-- Body -->
                        <div class="p-6 space-y-4 font-sans text-xs">
                            <p class="text-slate-300 leading-relaxed">
                                Upload a JSON or CSV file containing MS Section Product Quality telemetry or titration assays. The system will automatically analyze the dataset for out-of-spec parameters and calculate compliance rates.
                            </p>

                            <!-- Drag & Drop Box -->
                            <label class="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-2xl p-8 bg-dark-700/50 cursor-pointer transition-all group">
                                <i class="fas fa-file-import text-4xl text-slate-500 group-hover:text-emerald-400 mb-3 transition-colors"></i>
                                <span class="font-bold text-white text-sm">Click to select file or drag & drop</span>
                                <span class="text-[11px] text-slate-400 mt-1">Supports .JSON or .CSV QA Export files</span>
                                <input type="file" id="upload-file-input" accept=".json,.csv" onchange="QAMSProduct.handleFileUpload(this)" class="hidden">
                            </label>

                            <!-- Quick Sample Seed Test -->
                            <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                                <span class="text-[11px] text-slate-400">Don't have a file ready?</span>
                                <button type="button" onclick="QAMSProduct.runSimulatedAnalysis()" class="px-3.5 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold rounded-xl transition-all flex items-center gap-1.5">
                                    <i class="fas fa-magic"></i> Run Demo AI Analysis
                                </button>
                            </div>
                        </div>

                        <!-- Footer -->
                        <div class="p-4 bg-dark-700/80 border-t border-slate-800 flex justify-end">
                            <button onclick="QAMSProduct.closeModal()" class="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all">Cancel</button>
                        </div>
                    </div>
                </div>
            `;
            this.showModalHtml(modalHtml);
        },

        handleFileUpload: function (input) {
            const file = input.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                let parsedData = [];
                try {
                    if (file.name.endsWith('.json')) {
                        parsedData = JSON.parse(content);
                        if (!Array.isArray(parsedData)) parsedData = [parsedData];
                    } else if (file.name.endsWith('.csv')) {
                        // Simple CSV parser
                        const lines = content.split('\n');
                        const headers = lines[0].split(',').map(h => h.trim());
                        for (let i = 1; i < lines.length; i++) {
                            if (!lines[i].trim()) continue;
                            const vals = lines[i].split(',').map(v => v.trim());
                            let obj = {};
                            headers.forEach((h, idx) => obj[h] = vals[idx] || '');
                            parsedData.push(obj);
                        }
                    }
                    this.analyzeAndDisplayReport(parsedData, file.name);
                } catch (err) {
                    alert('Error parsing uploaded file. Please ensure it is valid JSON or CSV.');
                    console.error(err);
                }
            };
            reader.readAsText(file);
        },

        runSimulatedAnalysis: function () {
            // Simulated dataset representing June Product Quality checks
            const sampleDataset = [
                { title: 'June Zn Product Quality Compliance', area: 'MS-Dezinc Area', metricName: 'Zn Purity Rate', metricValue: '100.00%', metricLimit: '> 98.00%', isCompliant: true },
                { title: 'June Mg Product Quality Compliance', area: 'H2S Area', metricName: 'Mg Removal Rate', metricValue: '100.00%', metricLimit: '> 92.00%', isCompliant: true },
                { title: 'June Cr Product Quality Compliance', area: 'FNTRL Area', metricName: 'Cr Compliance', metricValue: '96.56%', metricLimit: '> 95.00%', isCompliant: true },
                { title: 'June Moisture (H2O) Quality Verification', area: 'Limestone Area', metricName: 'H2O Content', metricValue: '100.00%', metricLimit: '> 95.00%', isCompliant: true }
            ];
            this.analyzeAndDisplayReport(sampleDataset, 'June_Product_Quality_Batch.json');
        },

        analyzeAndDisplayReport: function (dataset, filename) {
            // Automated QA Engine Analysis
            const total = dataset.length;
            const compliantCount = dataset.filter(d => d.isCompliant === true || d.isCompliant === 'true' || (d.metricLimit && !d.metricValue.includes('Spike'))).length;
            const anomalies = dataset.filter(d => d.isCompliant === false || d.isCompliant === 'false');
            const passRate = total > 0 ? ((compliantCount / total) * 100).toFixed(1) : '100.0';

            const reportHtml = `
                <div id="qams-modal" class="fixed inset-0 bg-dark-900/85 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn">
                    <div class="bg-dark-500 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden flex flex-col max-h-[90vh]">
                        <!-- Header -->
                        <div class="bg-gradient-to-r from-emerald-600/30 to-sky-500/20 p-5 border-b border-slate-800 flex justify-between items-center">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow animate-bounce">
                                    <i class="fas fa-brain text-base"></i>
                                </div>
                                <div>
                                    <h3 class="text-base sm:text-lg font-bold text-white">Product Quality AI Report</h3>
                                    <span class="text-xs text-emerald-300 font-semibold block">File: ${filename}</span>
                                </div>
                            </div>
                            <button onclick="QAMSProduct.closeModal()" class="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800/50">
                                <i class="fas fa-times text-base"></i>
                            </button>
                        </div>

                        <!-- Report Body -->
                        <div class="p-6 space-y-5 overflow-y-auto font-sans text-xs sm:text-sm">
                            <!-- Analysis Summary Banner -->
                            <div class="p-4 rounded-xl bg-dark-700 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div class="text-center sm:text-left">
                                    <span class="text-[11px] font-bold text-slate-400 uppercase block">Algorithmic Batch Pass Rate</span>
                                    <span class="text-3xl font-black ${passRate >= 98 ? 'text-emerald-400' : 'text-rose-400'}">${passRate}%</span>
                                    <span class="text-xs text-slate-300 block mt-0.5">${compliantCount} of ${total} parameters compliant</span>
                                </div>
                                <div class="w-full sm:w-48 bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700">
                                    <div class="bg-gradient-to-r ${passRate >= 98 ? 'from-sky-400 to-emerald-400' : 'from-amber-400 to-rose-500'} h-full" style="width: ${passRate}%"></div>
                                </div>
                            </div>

                            <!-- Anomalies Detected Section -->
                            <div>
                                <h4 class="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <i class="fas ${anomalies.length > 0 ? 'fa-exclamation-circle text-rose-400 animate-pulse' : 'fa-check-circle text-emerald-400'}"></i>
                                    Detected Out-of-Spec Anomalies (${anomalies.length})
                                </h4>
                                ${anomalies.length > 0 ? `
                                    <div class="space-y-2">
                                        ${anomalies.map(a => `
                                            <div class="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start justify-between gap-3">
                                                <div>
                                                    <span class="font-bold text-white block">${a.title || 'Unnamed Assay Parameter'} (${a.area || 'Plant Area'})</span>
                                                    <span class="text-xs text-rose-300 mt-1 block">
                                                        <strong>Observed:</strong> ${a.metricValue} &bull; <strong>SOP Limit:</strong> ${a.metricLimit}
                                                    </span>
                                                </div>
                                                <span class="px-2 py-0.5 rounded bg-rose-500 text-white font-bold text-[10px] uppercase whitespace-nowrap">Flagged</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                    <div class="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl mt-3 text-xs text-amber-300">
                                        <i class="fas fa-lightbulb mr-1.5"></i> <strong>AI Recommendation:</strong> Automatically generate CAPA investigation workflows for the flagged items to maintain zero-defect standards.
                                    </div>
                                ` : `
                                    <div class="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center text-emerald-300 font-semibold text-xs">
                                        <i class="fas fa-shield-check text-2xl mb-1 block text-emerald-400"></i>
                                        All analyzed parameters fall strictly within normal MS Section Product Quality tolerance limits!
                                    </div>
                                `}
                            </div>
                        </div>

                        <!-- Footer -->
                        <div class="p-4 bg-dark-700/80 border-t border-slate-800 flex justify-end gap-2">
                            <button onclick="QAMSProduct.importAnalyzedBatch(${JSON.stringify(dataset).replace(/"/g, '&quot;')})" class="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-cyan-500 hover:from-emerald-500 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5">
                                <i class="fas fa-file-import"></i> Import Records into System
                            </button>
                            <button onclick="QAMSProduct.closeModal()" class="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all">Discard</button>
                        </div>
                    </div>
                </div>
            `;
            this.showModalHtml(reportHtml);
        },

        importAnalyzedBatch: function (dataset) {
            let records = Store.getRecords();
            let count = 0;
            dataset.forEach(d => {
                const newRec = {
                    id: 'QAMS-IMP-' + Math.floor(1000 + Math.random() * 9000),
                    category: d.category || (d.isCompliant === false ? 'nearmiss' : 'product_quality'),
                    title: d.title || 'Uploaded Product Quality Parameter',
                    area: d.area || 'FNTRL Area',
                    reporter: d.reporter || 'Batch Upload Analyst',
                    date: new Date().toISOString().split('T')[0],
                    status: d.isCompliant === false ? 'In Progress' : 'Approved',
                    description: d.description || 'Imported via Automated Product Quality AI Analysis Engine.',
                    capa: d.capa || (d.isCompliant === false ? 'Investigation initiated by AI analysis tool.' : 'None required.'),
                    metricName: d.metricName || 'Batch Assay',
                    metricValue: d.metricValue || 'Nominal',
                    metricLimit: d.metricLimit || 'Standard',
                    isCompliant: d.isCompliant !== false && d.isCompliant !== 'false',
                    attachments: [],
                    history: [{ timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16), action: 'Imported via Upload Engine', user: 'System AI' }]
                };
                records.unshift(newRec);
                count++;
            });
            Store.saveRecords(records);
            Store.addHistory(`Imported Batch of ${count} records`, 'Automated Product Quality Data Analysis tool import.');
            this.closeModal();
            this.render();
            alert(`✅ Successfully imported ${count} analyzed records into the Product Quality database!`);
        },

        // ====================================================================
        // 6. UTILITIES: EXPORT, DOWNLOADS & MODAL INJECTION
        // ====================================================================
        exportToCSV: function () {
            const records = Store.getRecords();
            if (records.length === 0) {
                alert('No records available to export.');
                return;
            }
            const headers = ['Record ID', 'Category', 'Title', 'Area', 'Reporter', 'Date', 'Status', 'Specification Name', 'Observed Value', 'SOP Limit', 'Compliant'];
            const rows = records.map(r => [
                r.id, r.category, `"${r.title.replace(/"/g, '""')}"`, r.area, `"${r.reporter}"`, r.date, r.status,
                r.metricName || '', r.metricValue || '', r.metricLimit || '', r.isCompliant ? 'Yes' : 'No'
            ]);

            let csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `MS_Product_Quality_Export_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            Store.addHistory('Exported CSV Data', `Exported ${records.length} records.`);
        },

        downloadAttachment: function (filename) {
            alert(`[SIMULATED DOWNLOAD]\n\nDownloading file: ${filename}\nStatus: Retrieving encrypted document from MS Section Server... Done!`);
            Store.addHistory('Downloaded Attachment', `File: ${filename}`);
        },

        showModalHtml: function (html) {
            this.closeModal(); // Remove existing if any
            const div = document.createElement('div');
            div.innerHTML = html;
            document.body.appendChild(div.firstElementChild);
            document.body.classList.add('overflow-hidden');
        },

        closeModal: function () {
            const modal = document.getElementById('qams-modal');
            if (modal) {
                modal.remove();
                document.body.classList.remove('overflow-hidden');
            }
        }
    };

    // Export to global window scope and self-initialize on DOM load
    window.QAMSProduct = QAMSProduct;
    window.addEventListener('DOMContentLoaded', () => {
        QAMSProduct.init();
    });

})(window, document);