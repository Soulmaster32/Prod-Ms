/**
 * Quality Group | MS Section - Quality by MS Product
 * Module: QA Area Management & Telemetry Analyzer (qaarea.js)
 * Current Date: July 3, 2026
 * Description: Interactive hydrometallurgical area specifications, CRUD operations,
 *              SOP manual integration, telemetry attachment logging, and automated CSV/JSON data analyzer.
 */

window.QAArea = (function() {
    'use strict';

    const STORAGE_KEY = 'QAArea_Data_v2';
    const ATTACHMENT_STORAGE_KEY = 'QAArea_Attachments_v1';
    
    // Seed Data: Default Hydrometallurgical & MS Product Processing Areas
    const defaultAreas = [
        {
            id: 'fntrl',
            name: 'Final Neutralization & Tailings Recovery (FNTRL)',
            code: '#FNTRL-01 • Hydrometallurgy',
            category: 'Hydrometallurgy',
            description: 'The FNTRL area is critical for environmental compliance and heavy metal recovery. QA inspectors continuously audit discharge slurry pH, residual nickel/cobalt concentrations in tailings, and flocculant dosing efficiency.',
            status: 'Online',
            complianceRate: 100.0,
            assignedSop: { code: 'SOP-FN-104', title: 'Effluent Slurry pH & Ni Loss Titration', rev: 'Rev 4.2', dept: 'Environmental QA' },
            parameters: [
                { id: 'param-1', label: 'Slurry pH Limit', value: '8.4 pH', target: '8.2 - 8.6 pH', status: 'Optimal', isNumeric: true, min: 8.2, max: 8.6, currentVal: 8.4 },
                { id: 'param-2', label: 'Ni Residue Loss', value: '0.03 g/L', target: '< 0.05 g/L', status: 'Optimal', isNumeric: true, min: 0.0, max: 0.05, currentVal: 0.03 },
                { id: 'param-3', label: 'Flocculant Dosing', value: '12.5 ppm', target: '10.0 - 15.0 ppm', status: 'Optimal', isNumeric: true, min: 10.0, max: 15.0, currentVal: 12.5 }
            ],
            attachments: [
                { id: 'att-fn-1', name: 'FNTRL_Shift_Audit_Checklist_Jul03.pdf', size: '1.4 MB', date: '2026-07-03 08:00', type: 'Checklist', uploader: 'M. Santos' },
                { id: 'att-fn-2', name: 'pH_Sensor_Calibration_Cert_#8821.pdf', size: '840 KB', date: '2026-06-28 14:20', type: 'Certificate', uploader: 'Sub DCS Auto-Log' }
            ],
            history: [
                { id: 'hist-fn-1', timestamp: '2026-07-03 14:15', event: 'Routine Shift Quality Audit', inspector: 'M. Santos (ID: QA-402)', status: 'Passed', details: 'All discharge slurry pH parameters within 8.2 - 8.6 range. Zero environmental deviations recorded.' },
                { id: 'hist-fn-2', timestamp: '2026-06-20 09:30', event: 'Near Miss: Flocculant Pump Surge', inspector: 'R. Garcia (ID: QA-319)', status: 'Resolved', details: 'Flocculant dosing spiked briefly to 18.2 ppm due to Sub DCS pressure loop oscillation. Recalibrated valve actuator.' }
            ]
        },
        {
            id: 'dezinc',
            name: 'Mixed Sulfide Dezincification (MS-Dezinc)',
            code: '#DEZINC-02 • Solvent Extraction',
            category: 'Solvent Extraction',
            description: 'In the MS-Dezinc area, zinc impurities are selectively extracted from nickel-cobalt sulfide solution. QA testing monitors extraction efficiency, organic/aqueous phase separation times, and reagent titration.',
            status: 'Online',
            complianceRate: 99.4,
            assignedSop: { code: 'SOP-MS-101', title: 'Zinc Extraction Titration & Phase Separation', rev: 'Rev 4.2', dept: 'Analytical Lab' },
            parameters: [
                { id: 'param-4', label: 'Zn Removal Efficiency', value: '99.5%', target: '> 99.4%', status: 'Optimal', isNumeric: true, min: 99.4, max: 100.0, currentVal: 99.5 },
                { id: 'param-5', label: 'Phase Separation', value: '72 sec', target: '60 - 90 sec', status: 'Optimal', isNumeric: true, min: 60, max: 90, currentVal: 72 },
                { id: 'param-6', label: 'Organic Loss Ratio', value: '18 ppm', target: '< 25 ppm', status: 'Optimal', isNumeric: true, min: 0, max: 25, currentVal: 18 }
            ],
            attachments: [
                { id: 'att-dz-1', name: 'MS_Dezinc_Titration_Log_Jul02.xlsx', size: '520 KB', date: '2026-07-02 16:45', type: 'Telemetry Dump', uploader: 'J. Reyes' }
            ],
            history: [
                { id: 'hist-dz-1', timestamp: '2026-07-02 17:00', event: 'Solvent Extraction Efficiency Assay', inspector: 'J. Reyes (ID: QA-115)', status: 'Passed', details: 'Zinc removal efficiency verified at 99.5% via AAS laboratory titration. Organic/Aqueous interface sharp.' },
                { id: 'hist-dz-2', timestamp: '2026-06-15 11:10', event: 'Near Miss: Phase Separation Delay', inspector: 'A. Lim (ID: QA-208)', status: 'Resolved', details: 'Phase separation time extended to 98 seconds due to low temperature. Mixer impeller speed and steam heat exchanger adjusted.' }
            ]
        },
        {
            id: 'h2s',
            name: 'Hydrogen Sulfide Gas Scrubber Area (H2S)',
            code: '#H2S-03 • Gas Generation Plant',
            category: 'Gas Processing',
            description: 'The H2S area demands maximum QA safety vigilance. Continuous telemetry checks gas purity for metal sulfide precipitation, while calibrating ambient toxic gas sensors and scrubber neutralization loops.',
            status: 'Online',
            complianceRate: 100.0,
            assignedSop: { code: 'SOP-H2S-204', title: 'Toxic Gas Scrubber QA & Purity Assay', rev: 'Rev 2.0', dept: 'Safety & Gas QA' },
            parameters: [
                { id: 'param-7', label: 'H2S Gas Purity', value: '99.7% Vol', target: '> 99.6% Vol', status: 'Optimal', isNumeric: true, min: 99.6, max: 100.0, currentVal: 99.7 },
                { id: 'param-8', label: 'Scrubber Caustic pH', value: '10.8 pH', target: '10.5 - 11.0 pH', status: 'Optimal', isNumeric: true, min: 10.5, max: 11.0, currentVal: 10.8 },
                { id: 'param-9', label: 'Ambient H2S Sensor', value: '0.00 ppm', target: '< 5.0 ppm (TWA)', status: 'Optimal', isNumeric: true, min: 0.0, max: 5.0, currentVal: 0.0 }
            ],
            attachments: [
                { id: 'att-h2s-1', name: 'Scrubber_Interlock_Test_Report_Q3.pdf', size: '2.1 MB', date: '2026-07-01 09:30', type: 'Safety Audit', uploader: 'Lead Safety Team' }
            ],
            history: [
                { id: 'hist-h2s-1', timestamp: '2026-07-01 10:00', event: 'Quarterly Scrubber Caustic Interlock Test', inspector: 'Lead Safety Team (ID: QA-ESD)', status: 'Passed', details: 'Emergency caustic dosing interlock simulated successfully. Trip response time under 1.2 seconds.' },
                { id: 'hist-h2s-2', timestamp: '2026-06-25 03:40', event: 'Near Miss: Line Pressure Fluctuation', inspector: 'Sub DCS #3 Auto-Log', status: 'Resolved', details: 'Transient pressure surge in scrubber inlet line. Automated bypass valve opened to stabilize system pressure.' }
            ]
        },
        {
            id: 'limestone',
            name: 'Limestone Slurry Preparation Area',
            code: '#LS-04 • Reagent Preparation',
            category: 'Reagent Preparation',
            description: 'Limestone is the primary neutralizing reagent in the MS Section. QA laboratory technicians perform daily mesh particle titration, calcium carbonate reactivity assays, and automated slurry density sensor calibration.',
            status: 'Calibration Scheduled',
            complianceRate: 98.2,
            assignedSop: { code: 'SOP-LS-402', title: 'Slurry Mesh Particle Titration & Density QA', rev: 'Rev 1.8', dept: 'Reagent Lab' },
            parameters: [
                { id: 'param-10', label: 'Slurry Density', value: '1.35 g/cm³', target: '1.33 - 1.37 g/cm³', status: 'Optimal', isNumeric: true, min: 1.33, max: 1.37, currentVal: 1.35 },
                { id: 'param-11', label: 'Particle Titration', value: '96.2% < 325 Mesh', target: '> 95.0% < 325 Mesh', status: 'Optimal', isNumeric: true, min: 95.0, max: 100.0, currentVal: 96.2 },
                { id: 'param-12', label: 'CaCO3 Reactivity', value: '98.5%', target: '> 97.0%', status: 'Optimal', isNumeric: true, min: 97.0, max: 100.0, currentVal: 98.5 }
            ],
            attachments: [
                { id: 'att-ls-1', name: 'Limestone_Mesh_Analysis_Jul01.csv', size: '310 KB', date: '2026-07-01 13:10', type: 'Telemetry Dump', uploader: 'K. Tan' }
            ],
            history: [
                { id: 'hist-ls-1', timestamp: '2026-07-01 14:00', event: 'Daily Mesh Particle Titration Review', inspector: 'K. Tan (ID: QA-304)', status: 'Passed', details: 'Slurry particle grind size verified at 96.2% passing 325 mesh screen. Reactivity rate exceeds minimum benchmark.' },
                { id: 'hist-ls-2', timestamp: '2026-06-28 08:15', event: 'For Improvement: Density Sensor Drift', inspector: 'M. Santos (ID: QA-402)', status: 'Pending CAPA', details: 'Field Coriolis density sensor exhibiting slight baseline drift against manual specific gravity balance. Scheduled for recalibration on July 4.' }
            ]
        }
    ];

    // State Variables
    let areas = [];
    let activeAreaId = 'fntrl';
    let searchQuery = '';
    let filterCategory = 'ALL';

    // Initialize Module & Override Global Handlers
    function init() {
        loadFromStorage();
        injectModals();
        render();
        
        // Override global switchAreaTab so index.html sidebar links work seamlessly
        window.switchAreaTab = function(areaId) {
            switchTab(areaId);
            const section = document.getElementById('area-explorer');
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        };

        console.log('✅ QAArea Module initialized successfully with 100% data separation.');
    }

    // Load and Save to LocalStorage
    function loadFromStorage() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                areas = JSON.parse(stored);
            } else {
                areas = JSON.parse(JSON.stringify(defaultAreas));
                saveToStorage();
            }
        } catch (e) {
            console.error('Error loading QA Area storage, falling back to seed data:', e);
            areas = JSON.parse(JSON.stringify(defaultAreas));
        }
    }

    function saveToStorage() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(areas));
            // Trigger global widget syncs if available
            if (typeof syncSidebarComplianceRate === 'function') {
                syncSidebarComplianceRate();
            }
        } catch (e) {
            console.error('Failed to save QA Area storage:', e);
        }
    }

    // Main Render Function for #area-explorer
    function render() {
        const container = document.getElementById('area-explorer');
        if (!container) return;

        const activeArea = areas.find(a => a.id === activeAreaId) || areas[0];
        if (!activeArea) return;

        // Filter areas for tabs
        const filteredAreas = areas.filter(a => {
            const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  a.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  a.assignedSop.code.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = filterCategory === 'ALL' || a.category === filterCategory;
            return matchesSearch && matchesCategory;
        });

        const categories = ['ALL', ...new Set(areas.map(a => a.category))];

        container.innerHTML = `
            <div class="max-w-7xl mx-auto">
                <!-- Header & Global Action Bar -->
                <div class="flex flex-col lg:flex-row lg:items-end justify-between mb-8 pb-6 border-b border-slate-800 gap-4" data-aos="fade-up">
                    <div>
                        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
                            <i class="fas fa-layer-group"></i> Hydrometallurgical Processing Zones
                        </div>
                        <h3 class="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">Interactive QA Area Management</h3>
                        <p class="mt-2 text-xs sm:text-sm text-slate-400 max-w-2xl">
                            Real-time chemical telemetry, zero-defect compliance tracking, automated SOP manual assignment, and intelligent telemetry CSV/JSON data analyzer.
                        </p>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex flex-wrap items-center gap-2 sm:gap-3">
                        <button onclick="QAArea.openUploadAnalyzerModal()" class="px-3.5 py-2.5 bg-gradient-to-r from-cyan-600 to-sky-500 hover:from-cyan-500 hover:to-sky-400 text-white rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all flex items-center gap-2">
                            <i class="fas fa-file-import"></i>
                            <span>Upload & Analyze Data</span>
                        </button>
                        <button onclick="QAArea.openAddEditAreaModal()" class="px-3.5 py-2.5 bg-royalblue-600 hover:bg-royalblue-500 text-white rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all flex items-center gap-2">
                            <i class="fas fa-plus-circle"></i>
                            <span>Add Custom Area</span>
                        </button>
                        <div class="relative">
                            <button onclick="QAArea.exportData('json')" title="Export Active Area Data" class="px-3 py-2.5 bg-dark-500 hover:bg-dark-400 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5">
                                <i class="fas fa-download text-sky-400"></i>
                                <span class="hidden sm:inline">Export</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Search & Category Filter Toolbar -->
                <div class="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 bg-dark-500/60 p-4 rounded-2xl border border-slate-800/80 backdrop-blur-sm">
                    <div class="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
                        <span class="text-[11px] font-bold text-slate-400 uppercase mr-1 whitespace-nowrap"><i class="fas fa-filter text-sky-400 mr-1"></i> Zone Category:</span>
                        ${categories.map(cat => `
                            <button onclick="QAArea.setFilterCategory('${cat}')" class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${filterCategory === cat ? 'bg-royalblue-600 text-white shadow' : 'bg-dark-700 text-slate-400 hover:text-white border border-slate-800'}">
                                ${cat}
                            </button>
                        `).join('')}
                    </div>

                    <div class="relative w-full md:w-72">
                        <i class="fas fa-search absolute left-3.5 top-3 text-slate-400 text-xs"></i>
                        <input type="text" value="${searchQuery}" oninput="QAArea.handleSearch(this.value)" placeholder="Search areas, SOP code, parameters..." class="w-full bg-dark-700 border border-slate-700 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-400 transition-all">
                        ${searchQuery ? `<button onclick="QAArea.handleSearch('')" class="absolute right-3 top-2.5 text-slate-400 hover:text-white text-xs"><i class="fas fa-times"></i></button>` : ''}
                    </div>
                </div>

                <!-- Area Switcher Tabs -->
                <div class="flex items-center justify-start gap-2.5 overflow-x-auto pb-4 mb-8 no-scrollbar">
                    ${filteredAreas.length > 0 ? filteredAreas.map(a => {
                        const isActive = a.id === activeAreaId;
                        const statusColor = a.status === 'Online' ? 'bg-emerald-400' : 'bg-amber-400';
                        return `
                            <button onclick="QAArea.switchTab('${a.id}')" id="tab-${a.id}" class="tab-btn ${isActive ? 'active bg-royalblue-600 text-white border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.4)]' : 'bg-dark-500 text-slate-300 border-slate-700 hover:bg-dark-400'} px-5 py-3 rounded-xl text-xs sm:text-sm font-bold border whitespace-nowrap transition-all flex items-center gap-2.5 group">
                                <span class="w-2 h-2 rounded-full ${statusColor} ${isActive ? 'animate-ping' : ''}"></span>
                                <span>${a.name.split(' ')[0]} Area</span>
                                <span class="text-[10px] px-1.5 py-0.5 rounded ${isActive ? 'bg-white/20 text-white' : 'bg-dark-700 text-slate-400 group-hover:text-slate-300'}">${a.complianceRate}%</span>
                            </button>
                        `;
                    }).join('') : `
                        <div class="p-4 rounded-xl bg-dark-500 border border-slate-800 text-slate-400 text-xs w-full text-center">
                            No hydrometallurgical areas matching your search criteria. <button onclick="QAArea.handleSearch('')" class="text-sky-400 font-bold hover:underline">Reset search</button>.
                        </div>
                    `}
                </div>

                <!-- Dynamic Area Display Card -->
                <div id="area-card-content" class="bg-gradient-to-br from-dark-500 to-dark-700/90 rounded-2xl p-6 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden transition-all duration-300">
                    ${renderAreaCardContent(activeArea)}
                </div>
            </div>
        `;
    }

    // Helper to render the inner content of the selected area card
    function renderAreaCardContent(area) {
        const statusBadgeColor = area.status === 'Online' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30';

        return `
            <!-- Top Card Header -->
            <div class="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-slate-800/80 gap-4">
                <div class="flex items-start gap-3.5">
                    <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-royalblue-600 to-sky-500 flex items-center justify-center text-white text-xl shadow-lg shrink-0 mt-0.5">
                        <i class="fas fa-microscope"></i>
                    </div>
                    <div>
                        <div class="flex flex-wrap items-center gap-2 mb-1">
                            <span class="px-2.5 py-0.5 rounded-md bg-sky-500/10 text-sky-400 font-bold text-xs border border-sky-400/20">
                                ${area.code}
                            </span>
                            <span class="px-2.5 py-0.5 rounded-md ${statusBadgeColor} font-bold text-xs border flex items-center gap-1.5">
                                <span class="w-1.5 h-1.5 rounded-full ${area.status === 'Online' ? 'bg-emerald-400' : 'bg-amber-400'}"></span>
                                System Status: ${area.status}
                            </span>
                        </div>
                        <h4 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">${area.name}</h4>
                    </div>
                </div>

                <!-- Card Action Toolbar -->
                <div class="flex items-center gap-2 self-start md:self-center shrink-0">
                    <button onclick="QAArea.openAddParameterModal('${area.id}')" title="Add Telemetry Parameter" class="px-3 py-2 bg-dark-700 hover:bg-dark-400 border border-slate-700 text-sky-400 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5">
                        <i class="fas fa-plus"></i> <span class="hidden sm:inline">Add Spec</span>
                    </button>
                    <button onclick="QAArea.openAddEditAreaModal('${area.id}')" title="Edit Area Specifications" class="p-2.5 bg-dark-700 hover:bg-dark-400 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs transition-all">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${area.id !== 'fntrl' && area.id !== 'dezinc' && area.id !== 'h2s' && area.id !== 'limestone' ? `
                        <button onclick="QAArea.deleteArea('${area.id}')" title="Delete Custom Area" class="p-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-xl text-xs transition-all">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    ` : ''}
                </div>
            </div>

            <!-- Main Area Grid Content -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                <!-- Left Column: Description, Parameters & SOP Integration (7 Cols) -->
                <div class="lg:col-span-7 space-y-6">
                    <div>
                        <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Operational Overview</span>
                        <p class="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal bg-dark-900/40 p-4 rounded-xl border border-slate-800/80">${area.description}</p>
                    </div>

                    <!-- Real-Time Telemetry & Specification Thresholds -->
                    <div>
                        <div class="flex items-center justify-between mb-3">
                            <span class="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                <i class="fas fa-broadcast-tower text-sky-400 animate-pulse"></i> Live Telemetry & QC Parameters
                            </span>
                            <span class="text-[11px] font-semibold text-slate-400">Compliance Rate: <strong class="${area.complianceRate >= 99 ? 'text-emerald-400' : 'text-amber-400'}">${area.complianceRate}%</strong></span>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            ${area.parameters.map(p => {
                                const isOptimal = p.status === 'Optimal' || p.status === 'Passed';
                                return `
                                    <div class="bg-dark-900/60 p-3.5 rounded-xl border ${isOptimal ? 'border-slate-800 hover:border-slate-700' : 'border-rose-500/50 bg-rose-500/5'} transition-all relative group">
                                        <div class="flex justify-between items-start mb-1">
                                            <span class="text-[10px] font-bold text-slate-400 uppercase block leading-tight truncate mr-1" title="${p.label}">${p.label}</span>
                                            <button onclick="QAArea.deleteParameter('${area.id}', '${p.id}')" class="text-slate-600 hover:text-rose-400 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity" title="Remove Parameter"><i class="fas fa-times"></i></button>
                                        </div>
                                        <span class="text-base sm:text-lg font-extrabold ${isOptimal ? 'text-white' : 'text-rose-400'} block tracking-tight">${p.value}</span>
                                        <div class="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 text-[10px]">
                                            <span class="text-slate-400">Target: <strong class="text-slate-300">${p.target}</strong></span>
                                            <span class="${isOptimal ? 'text-emerald-400' : 'text-rose-400'} font-bold flex items-center gap-1">
                                                <i class="fas ${isOptimal ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${p.status}
                                            </span>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>

                    <!-- SOP Manual Integration & Action Shortcuts -->
                    <div class="bg-gradient-to-r from-royalblue-900/30 to-dark-900 p-4 rounded-2xl border border-royalblue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div class="flex items-center gap-3.5">
                            <div class="w-10 h-10 rounded-xl bg-royalblue-600/20 border border-royalblue-400/40 flex items-center justify-center text-sky-400 text-lg shrink-0">
                                <i class="fas fa-book"></i>
                            </div>
                            <div>
                                <span class="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">Assigned QA Procedure</span>
                                <h5 class="text-sm font-bold text-white leading-tight">${area.assignedSop.code}: ${area.assignedSop.title} (${area.assignedSop.rev})</h5>
                            </div>
                        </div>
                        <div class="flex items-center gap-2 w-full sm:w-auto">
                            <button onclick="QAArea.openSopProcedure('${area.assignedSop.code}')" class="w-full sm:w-auto px-4 py-2.5 bg-royalblue-600 hover:bg-royalblue-500 text-white rounded-xl text-xs font-bold transition-all shadow flex items-center justify-center gap-1.5 whitespace-nowrap">
                                <span>Read SOP Manual</span>
                                <i class="fas fa-arrow-right text-[10px]"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Attachments & Telemetry File Repository -->
                    <div>
                        <div class="flex items-center justify-between mb-3">
                            <span class="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                <i class="fas fa-paperclip text-sky-400"></i> Area Attachments & Calibration Logs (${area.attachments.length})
                            </span>
                            <button onclick="QAArea.openAddAttachmentModal('${area.id}')" class="text-xs font-bold text-sky-400 hover:underline flex items-center gap-1">
                                <i class="fas fa-plus"></i> Add Attachment
                            </button>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            ${area.attachments.map(att => `
                                <div class="p-3 bg-dark-900/60 rounded-xl border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-all group">
                                    <div class="flex items-center gap-3 overflow-hidden mr-2">
                                        <div class="w-8 h-8 rounded-lg ${att.type === 'Checklist' ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' : att.type === 'Certificate' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'} border flex items-center justify-center shrink-0 text-xs font-bold">
                                            <i class="fas ${att.type === 'Checklist' ? 'fa-clipboard-check' : att.type === 'Certificate' ? 'fa-certificate' : 'fa-file-csv'}"></i>
                                        </div>
                                        <div class="truncate">
                                            <span class="text-xs font-bold text-white block truncate hover:text-sky-400 cursor-pointer" onclick="QAArea.downloadAttachment('${att.name}')">${att.name}</span>
                                            <span class="text-[10px] text-slate-400">${att.size} • ${att.date.split(' ')[0]}</span>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-1.5 shrink-0">
                                        <button onclick="QAArea.downloadAttachment('${att.name}')" class="p-1.5 text-slate-400 hover:text-sky-400 transition-colors text-xs" title="Download File"><i class="fas fa-download"></i></button>
                                        <button onclick="QAArea.deleteAttachment('${area.id}', '${att.id}')" class="p-1.5 text-slate-600 hover:text-rose-400 transition-colors text-xs opacity-0 group-hover:opacity-100" title="Delete File"><i class="fas fa-trash"></i></button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- Right Column: Audit History & Incident Log (5 Cols) -->
                <div class="lg:col-span-5">
                    <div class="bg-dark-900/80 rounded-2xl p-5 border border-slate-800 shadow-inner flex flex-col justify-between h-full min-h-[480px]">
                        <div>
                            <div class="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-800">
                                <div>
                                    <span class="text-xs font-extrabold text-white uppercase tracking-wider block flex items-center gap-2">
                                        <i class="fas fa-history text-cyan-400"></i> Area Audit & Incident History
                                    </span>
                                    <span class="text-[10px] text-slate-400">Real-time CAPA and inspection logs</span>
                                </div>
                                <button onclick="QAArea.openAddHistoryModal('${area.id}')" class="px-2.5 py-1.5 bg-dark-700 hover:bg-dark-500 border border-slate-700 text-cyan-300 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1">
                                    <i class="fas fa-plus"></i> Log Audit
                                </button>
                            </div>

                            <!-- History List -->
                            <div class="space-y-3 overflow-y-auto max-h-[380px] pr-1 no-scrollbar">
                                ${area.history.length > 0 ? area.history.map((h, idx) => {
                                    const isPassed = h.status === 'Passed' || h.status === 'Resolved';
                                    const statusIcon = isPassed ? 'fa-check-circle text-emerald-400' : 'fa-exclamation-triangle text-amber-400';
                                    const badgeBg = isPassed ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20';

                                    return `
                                        <div class="p-3.5 bg-dark-500/80 hover:bg-dark-500 rounded-xl border border-slate-800/80 transition-all text-xs relative group">
                                            <div class="flex justify-between items-start mb-1.5">
                                                <span class="font-bold text-white flex items-center gap-2">
                                                    <i class="fas ${statusIcon}"></i> ${h.event}
                                                </span>
                                                <div class="flex items-center gap-1.5">
                                                    <span class="px-2 py-0.5 rounded text-[9px] font-bold border ${badgeBg}">${h.status}</span>
                                                    <button onclick="QAArea.deleteHistory('${area.id}', '${h.id}')" class="text-slate-600 hover:text-rose-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity ml-1" title="Delete Log"><i class="fas fa-times"></i></button>
                                                </div>
                                            </div>
                                            <p class="text-slate-300 text-[11px] leading-relaxed mb-2 font-normal">${h.details}</p>
                                            <div class="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800">
                                                <span><i class="fas fa-user-shield text-sky-400 mr-1"></i> ${h.inspector}</span>
                                                <span><i class="far fa-clock mr-1"></i> ${h.timestamp}</span>
                                            </div>
                                        </div>
                                    `;
                                }).join('') : `
                                    <div class="text-center py-10 text-slate-500 text-xs">
                                        No recent audit or incident logs recorded for this area.
                                    </div>
                                `}
                            </div>
                        </div>

                        <!-- Footer CTA inside Card -->
                        <div class="pt-4 mt-4 border-t border-slate-800">
                            <button onclick="QAArea.openUploadAnalyzerModal('${area.id}')" class="w-full py-3 bg-dark-700 hover:bg-dark-500 border border-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow">
                                <i class="fas fa-chart-line text-cyan-400"></i>
                                <span>Analyze Area Telemetry Trends</span>
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        `;
    }

    // Tab Switching Logic
    function switchTab(areaId) {
        activeAreaId = areaId;
        
        // Update tab styling inline without full re-render if possible, or just call render()
        const container = document.getElementById('area-card-content');
        if (container) {
            container.style.opacity = '0';
            setTimeout(() => {
                render();
                container.style.opacity = '1';
            }, 150);
        } else {
            render();
        }
    }

    // Search & Filter Handlers
    function handleSearch(query) {
        searchQuery = query;
        render();
    }

    function setFilterCategory(category) {
        filterCategory = category;
        render();
    }

    // SOP Manual Bridge / Viewer
    function openSopProcedure(sopCode) {
        // Check if sopmanual.js or QAMSProduct exists and delegate
        if (window.SOPManual && typeof window.SOPManual.open === 'function') {
            window.SOPManual.open(sopCode);
            return;
        }
        if (window.QAMSProduct && typeof window.QAMSProduct.handleSearch === 'function') {
            window.QAMSProduct.open('document');
            window.QAMSProduct.handleSearch(sopCode);
            return;
        }

        // Native SOP Modal Fallback
        const area = areas.find(a => a.assignedSop.code === sopCode) || areas[0];
        const modalHtml = `
            <div id="sopViewerModal" class="fixed inset-0 bg-dark-900/85 z-[999] flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn">
                <div class="bg-dark-500 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col max-h-[85vh]">
                    <div class="bg-gradient-to-r from-royalblue-600/20 to-sky-500/10 p-5 border-b border-slate-800 flex justify-between items-center">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-royalblue-600 flex items-center justify-center text-white shadow">
                                <i class="fas fa-book text-base"></i>
                            </div>
                            <div>
                                <h3 class="text-base font-bold text-white">${area.assignedSop.code}: ${area.assignedSop.title}</h3>
                                <span class="text-[11px] text-sky-400 font-semibold block">${area.assignedSop.rev} • Department: ${area.assignedSop.dept}</span>
                            </div>
                        </div>
                        <button onclick="document.getElementById('sopViewerModal').remove()" class="text-slate-400 hover:text-white p-1 rounded-lg">
                            <i class="fas fa-times text-lg"></i>
                        </button>
                    </div>
                    <div class="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                        <div class="p-3.5 bg-dark-700/80 rounded-xl border border-slate-800">
                            <strong class="text-sky-400 block mb-1">1.0 Purpose & Scope</strong>
                            This Standard Operating Procedure defines the strict analytical inspection routines, titration intervals, and zero-defect compliance thresholds required for the ${area.name}.
                        </div>
                        <div class="p-3.5 bg-dark-700/80 rounded-xl border border-slate-800">
                            <strong class="text-sky-400 block mb-1">2.0 Safety & PPE Requirements</strong>
                            All QA technicians must wear full acid-resistant PPE, safety goggles, and carry calibrated personal toxic gas monitors when drawing samples from field Sub DCS nodes.
                        </div>
                        <div class="p-3.5 bg-dark-700/80 rounded-xl border border-slate-800">
                            <strong class="text-sky-400 block mb-1">3.0 Analytical Procedure</strong>
                            <ul class="list-disc pl-5 space-y-1 mt-1 text-slate-300">
                                <li>Draw 500mL representative sample from field sample valve #402.</li>
                                <li>Conduct rapid titration using calibrated laboratory pH balance and AAS spectrometry.</li>
                                <li>Verify results against target tolerances: ${area.parameters.map(p => `${p.label} (${p.target})`).join('; ')}.</li>
                                <li>Log all telemetry into the Master DCS database or field Sub DCS station within 15 minutes of sampling.</li>
                            </ul>
                        </div>
                    </div>
                    <div class="p-4 bg-dark-900/60 border-t border-slate-800 flex justify-end gap-3">
                        <button onclick="QAArea.downloadAttachment('${area.assignedSop.code}_Manual.pdf')" class="px-4 py-2 bg-dark-700 hover:bg-dark-400 border border-slate-700 text-sky-400 hover:text-white rounded-xl text-xs font-bold transition-all">
                            <i class="fas fa-download mr-1.5"></i> Download PDF Manual
                        </button>
                        <button onclick="document.getElementById('sopViewerModal').remove()" class="px-5 py-2 bg-royalblue-600 hover:bg-royalblue-500 text-white rounded-xl text-xs font-bold transition-all shadow">
                            Close Viewer
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    // CRUD: Add / Edit Area Modal
    function openAddEditAreaModal(areaId = null) {
        const area = areaId ? areas.find(a => a.id === areaId) : null;
        const isEdit = !!area;

        const modalHtml = `
            <div id="areaCrudModal" class="fixed inset-0 bg-dark-900/85 z-[999] flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn">
                <div class="bg-dark-500 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
                    <div class="bg-gradient-to-r from-royalblue-600/20 to-sky-500/10 p-5 border-b border-slate-800 flex justify-between items-center">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-xl bg-royalblue-600 flex items-center justify-center text-white shadow">
                                <i class="fas ${isEdit ? 'fa-edit' : 'fa-plus-circle'} text-sm"></i>
                            </div>
                            <div>
                                <h3 class="text-base font-bold text-white">${isEdit ? 'Edit Area Specifications' : 'Add Custom QA Area'}</h3>
                                <span class="text-[11px] text-sky-400 font-semibold block">Hydrometallurgical Section</span>
                            </div>
                        </div>
                        <button onclick="document.getElementById('areaCrudModal').remove()" class="text-slate-400 hover:text-white p-1 rounded-lg"><i class="fas fa-times text-base"></i></button>
                    </div>
                    <form onsubmit="QAArea.saveArea(event, '${isEdit ? area.id : ''}')" class="p-6 space-y-4 font-sans">
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Area Name</label>
                                <input type="text" id="area-name" required value="${isEdit ? area.name : ''}" placeholder="e.g., Leaching Autoclave Area" class="w-full bg-dark-700 border border-slate-700 p-2.5 rounded-xl text-white text-xs outline-none focus:border-sky-400">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Zone Code</label>
                                <input type="text" id="area-code" required value="${isEdit ? area.code : '#LEACH-05 • High Pressure'}" placeholder="#CODE-00 • Sector" class="w-full bg-dark-700 border border-slate-700 p-2.5 rounded-xl text-white text-xs outline-none focus:border-sky-400">
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Category</label>
                                <select id="area-cat" required class="w-full bg-dark-700 border border-slate-700 p-2.5 rounded-xl text-white text-xs outline-none focus:border-sky-400">
                                    <option value="Hydrometallurgy" ${isEdit && area.category === 'Hydrometallurgy' ? 'selected' : ''}>Hydrometallurgy</option>
                                    <option value="Solvent Extraction" ${isEdit && area.category === 'Solvent Extraction' ? 'selected' : ''}>Solvent Extraction</option>
                                    <option value="Gas Processing" ${isEdit && area.category === 'Gas Processing' ? 'selected' : ''}>Gas Processing</option>
                                    <option value="Reagent Preparation" ${isEdit && area.category === 'Reagent Preparation' ? 'selected' : ''}>Reagent Preparation</option>
                                    <option value="Electrowinning" ${isEdit && area.category === 'Electrowinning' ? 'selected' : ''}>Electrowinning</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Status</label>
                                <select id="area-status" required class="w-full bg-dark-700 border border-slate-700 p-2.5 rounded-xl text-white text-xs outline-none focus:border-sky-400">
                                    <option value="Online" ${isEdit && area.status === 'Online' ? 'selected' : ''}>Online (Normal)</option>
                                    <option value="Maintenance" ${isEdit && area.status === 'Maintenance' ? 'selected' : ''}>Maintenance</option>
                                    <option value="Calibration Scheduled" ${isEdit && area.status === 'Calibration Scheduled' ? 'selected' : ''}>Calibration Scheduled</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Operational Description</label>
                            <textarea id="area-desc" rows="3" required placeholder="Describe QA inspection routine and critical telemetry..." class="w-full bg-dark-700 border border-slate-700 p-2.5 rounded-xl text-white text-xs outline-none focus:border-sky-400">${isEdit ? area.description : ''}</textarea>
                        </div>
                        <div class="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                            <div>
                                <label class="block text-[11px] font-bold text-sky-400 uppercase mb-1">Assigned SOP Code</label>
                                <input type="text" id="sop-code" required value="${isEdit ? area.assignedSop.code : 'SOP-MS-105'}" class="w-full bg-dark-700 border border-slate-700 p-2 rounded-xl text-white text-xs outline-none focus:border-sky-400">
                            </div>
                            <div>
                                <label class="block text-[11px] font-bold text-sky-400 uppercase mb-1">SOP Title</label>
                                <input type="text" id="sop-title" required value="${isEdit ? area.assignedSop.title : 'High Pressure Acid Leach QA'}" class="w-full bg-dark-700 border border-slate-700 p-2 rounded-xl text-white text-xs outline-none focus:border-sky-400">
                            </div>
                        </div>
                        <div class="pt-3 flex justify-end gap-3">
                            <button type="button" onclick="document.getElementById('areaCrudModal').remove()" class="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all">Cancel</button>
                            <button type="submit" class="px-6 py-2.5 bg-gradient-to-r from-royalblue-600 to-sky-500 hover:from-royalblue-500 text-white rounded-xl text-xs font-bold shadow transition-all">${isEdit ? 'Update Area' : 'Create Area'}</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    function saveArea(event, areaId) {
        event.preventDefault();
        const name = document.getElementById('area-name').value.trim();
        const code = document.getElementById('area-code').value.trim();
        const category = document.getElementById('area-cat').value;
        const status = document.getElementById('area-status').value;
        const desc = document.getElementById('area-desc').value.trim();
        const sopCode = document.getElementById('sop-code').value.trim();
        const sopTitle = document.getElementById('sop-title').value.trim();

        if (areaId) {
            // Update existing
            const index = areas.findIndex(a => a.id === areaId);
            if (index !== -1) {
                areas[index].name = name;
                areas[index].code = code;
                areas[index].category = category;
                areas[index].status = status;
                areas[index].description = desc;
                areas[index].assignedSop.code = sopCode;
                areas[index].assignedSop.title = sopTitle;
            }
            showToast('Area specifications updated successfully!', 'success');
        } else {
            // Create new
            const newId = 'area-' + Date.now().toString(36);
            const newArea = {
                id: newId,
                name: name,
                code: code,
                category: category,
                description: desc,
                status: status,
                complianceRate: 100.0,
                assignedSop: { code: sopCode, title: sopTitle, rev: 'Rev 1.0', dept: 'Quality Engineering' },
                parameters: [
                    { id: 'p-' + Date.now(), label: 'Primary Reagent Titration', value: 'Nominal', target: 'Within Spec', status: 'Optimal', isNumeric: false }
                ],
                attachments: [],
                history: [
                    { id: 'h-' + Date.now(), timestamp: '2026-07-03 16:22', event: 'Custom Zone Created', inspector: 'System Admin', status: 'Passed', details: `New QA area "${name}" added to MS Section portal.` }
                ]
            };
            areas.push(newArea);
            activeAreaId = newId;
            showToast('New hydrometallurgical area added!', 'success');
        }

        saveToStorage();
        document.getElementById('areaCrudModal').remove();
        render();
    }

    function deleteArea(areaId) {
        if (!confirm('Are you sure you want to delete this custom QA Area? All associated telemetry and audit logs will be removed.')) return;
        areas = areas.filter(a => a.id !== areaId);
        if (activeAreaId === areaId) {
            activeAreaId = areas[0] ? areas[0].id : '';
        }
        saveToStorage();
        showToast('Custom QA Area deleted.', 'info');
        render();
    }

    // CRUD: Parameters
    function openAddParameterModal(areaId) {
        const modalHtml = `
            <div id="paramModal" class="fixed inset-0 bg-dark-900/85 z-[999] flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn">
                <div class="bg-dark-500 w-full max-w-md rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
                    <div class="bg-gradient-to-r from-cyan-600/20 to-sky-500/10 p-5 border-b border-slate-800 flex justify-between items-center">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-xl bg-cyan-600 flex items-center justify-center text-white shadow"><i class="fas fa-sliders-h text-sm"></i></div>
                            <div><h3 class="text-base font-bold text-white">Add QC Specification Parameter</h3><span class="text-[11px] text-cyan-400 font-semibold block">Telemetry Threshold</span></div>
                        </div>
                        <button onclick="document.getElementById('paramModal').remove()" class="text-slate-400 hover:text-white p-1 rounded-lg"><i class="fas fa-times text-base"></i></button>
                    </div>
                    <form onsubmit="QAArea.saveParameter(event, '${areaId}')" class="p-6 space-y-4 font-sans">
                        <div>
                            <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Parameter Label</label>
                            <input type="text" id="param-label" required placeholder="e.g., Cobalt Extraction Ratio" class="w-full bg-dark-700 border border-slate-700 p-2.5 rounded-xl text-white text-xs outline-none focus:border-cyan-400">
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Current Value</label>
                                <input type="text" id="param-val" required placeholder="e.g., 98.4%" class="w-full bg-dark-700 border border-slate-700 p-2.5 rounded-xl text-white text-xs outline-none focus:border-cyan-400">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Target Limit</label>
                                <input type="text" id="param-target" required placeholder="e.g., > 98.0%" class="w-full bg-dark-700 border border-slate-700 p-2.5 rounded-xl text-white text-xs outline-none focus:border-cyan-400">
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Status Classification</label>
                            <select id="param-status" class="w-full bg-dark-700 border border-slate-700 p-2.5 rounded-xl text-white text-xs outline-none focus:border-cyan-400">
                                <option value="Optimal">Optimal (Normal Spec)</option>
                                <option value="Passed">Passed (Within Tolerance)</option>
                                <option value="Out of Spec">Out of Spec (Anomaly)</option>
                            </select>
                        </div>
                        <div class="pt-3 flex justify-end gap-3">
                            <button type="button" onclick="document.getElementById('paramModal').remove()" class="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold">Cancel</button>
                            <button type="submit" class="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold shadow">Add Parameter</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    function saveParameter(event, areaId) {
        event.preventDefault();
        const area = areas.find(a => a.id === areaId);
        if (!area) return;

        const label = document.getElementById('param-label').value.trim();
        const val = document.getElementById('param-val').value.trim();
        const target = document.getElementById('param-target').value.trim();
        const status = document.getElementById('param-status').value;

        area.parameters.push({
            id: 'p-' + Date.now(),
            label: label,
            value: val,
            target: target,
            status: status,
            isNumeric: false
        });

        saveToStorage();
        document.getElementById('paramModal').remove();
        showToast('QC Specification Parameter added.', 'success');
        render();
    }

    function deleteParameter(areaId, paramId) {
        const area = areas.find(a => a.id === areaId);
        if (!area) return;
        area.parameters = area.parameters.filter(p => p.id !== paramId);
        saveToStorage();
        showToast('Parameter removed from telemetry monitor.', 'info');
        render();
    }

    // CRUD: Audit & Incident History Logs
    function openAddHistoryModal(areaId) {
        const modalHtml = `
            <div id="histModal" class="fixed inset-0 bg-dark-900/85 z-[999] flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn">
                <div class="bg-dark-500 w-full max-w-md rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
                    <div class="bg-gradient-to-r from-emerald-600/20 to-sky-500/10 p-5 border-b border-slate-800 flex justify-between items-center">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow"><i class="fas fa-clipboard-check text-sm"></i></div>
                            <div><h3 class="text-base font-bold text-white">Log Area Quality Audit</h3><span class="text-[11px] text-emerald-400 font-semibold block">Inspection & CAPA Record</span></div>
                        </div>
                        <button onclick="document.getElementById('histModal').remove()" class="text-slate-400 hover:text-white p-1 rounded-lg"><i class="fas fa-times text-base"></i></button>
                    </div>
                    <form onsubmit="QAArea.saveHistory(event, '${areaId}')" class="p-6 space-y-4 font-sans">
                        <div>
                            <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Event Type / Title</label>
                            <input type="text" id="hist-event" required placeholder="e.g., Shift Slurry Titration Review" class="w-full bg-dark-700 border border-slate-700 p-2.5 rounded-xl text-white text-xs outline-none focus:border-emerald-400">
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Inspector ID</label>
                                <input type="text" id="hist-inspector" required value="M. Santos (QA-402)" class="w-full bg-dark-700 border border-slate-700 p-2.5 rounded-xl text-white text-xs outline-none focus:border-emerald-400">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Audit Status</label>
                                <select id="hist-status" class="w-full bg-dark-700 border border-slate-700 p-2.5 rounded-xl text-white text-xs outline-none focus:border-emerald-400">
                                    <option value="Passed">Passed (Zero-Defect)</option>
                                    <option value="Resolved">Resolved (CAPA Closed)</option>
                                    <option value="Pending CAPA">Pending CAPA (Under Review)</option>
                                    <option value="Near Miss">Near Miss Logged</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Detailed Observations & Actions</label>
                            <textarea id="hist-details" rows="3" required placeholder="Enter analytical titration readings or corrective action performed..." class="w-full bg-dark-700 border border-slate-700 p-2.5 rounded-xl text-white text-xs outline-none focus:border-emerald-400"></textarea>
                        </div>
                        <div class="pt-3 flex justify-end gap-3">
                            <button type="button" onclick="document.getElementById('histModal').remove()" class="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold">Cancel</button>
                            <button type="submit" class="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow">Save Log</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    function saveHistory(event, areaId) {
        event.preventDefault();
        const area = areas.find(a => a.id === areaId);
        if (!area) return;

        const eventTitle = document.getElementById('hist-event').value.trim();
        const inspector = document.getElementById('hist-inspector').value.trim();
        const status = document.getElementById('hist-status').value;
        const details = document.getElementById('hist-details').value.trim();

        // Format current timestamp
        const now = new Date();
        const timeStr = `${now.getFullYear()}-07-03 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        area.history.unshift({
            id: 'h-' + Date.now(),
            timestamp: timeStr,
            event: eventTitle,
            inspector: inspector,
            status: status,
            details: details
        });

        saveToStorage();
        document.getElementById('histModal').remove();
        showToast('Quality audit log recorded into area repository.', 'success');
        render();
    }

    function deleteHistory(areaId, histId) {
        const area = areas.find(a => a.id === areaId);
        if (!area) return;
        area.history = area.history.filter(h => h.id !== histId);
        saveToStorage();
        showToast('Audit log removed.', 'info');
        render();
    }

    // Attachments Management
    function openAddAttachmentModal(areaId) {
        const modalHtml = `
            <div id="attModal" class="fixed inset-0 bg-dark-900/85 z-[999] flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn">
                <div class="bg-dark-500 w-full max-w-md rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
                    <div class="bg-gradient-to-r from-sky-600/20 to-royalblue-500/10 p-5 border-b border-slate-800 flex justify-between items-center">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow"><i class="fas fa-file-upload text-sm"></i></div>
                            <div><h3 class="text-base font-bold text-white">Attach QA Calibration File</h3><span class="text-[11px] text-sky-400 font-semibold block">Repository Upload</span></div>
                        </div>
                        <button onclick="document.getElementById('attModal').remove()" class="text-slate-400 hover:text-white p-1 rounded-lg"><i class="fas fa-times text-base"></i></button>
                    </div>
                    <form onsubmit="QAArea.saveAttachment(event, '${areaId}')" class="p-6 space-y-4 font-sans">
                        <div>
                            <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Document / File Name</label>
                            <input type="text" id="att-name" required placeholder="e.g., Slurry_Titration_Assay_Jul03.pdf" class="w-full bg-dark-700 border border-slate-700 p-2.5 rounded-xl text-white text-xs outline-none focus:border-sky-400">
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Document Category</label>
                                <select id="att-type" class="w-full bg-dark-700 border border-slate-700 p-2.5 rounded-xl text-white text-xs outline-none focus:border-sky-400">
                                    <option value="Checklist">Audit Checklist</option>
                                    <option value="Certificate">Calibration Cert</option>
                                    <option value="Telemetry Dump">Telemetry Dump</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Simulated Size</label>
                                <input type="text" id="att-size" required value="1.2 MB" class="w-full bg-dark-700 border border-slate-700 p-2.5 rounded-xl text-white text-xs outline-none focus:border-sky-400">
                            </div>
                        </div>
                        <div class="pt-3 flex justify-end gap-3">
                            <button type="button" onclick="document.getElementById('attModal').remove()" class="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold">Cancel</button>
                            <button type="submit" class="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow">Attach Document</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    function saveAttachment(event, areaId) {
        event.preventDefault();
        const area = areas.find(a => a.id === areaId);
        if (!area) return;

        const name = document.getElementById('att-name').value.trim();
        const type = document.getElementById('att-type').value;
        const size = document.getElementById('att-size').value.trim();

        const now = new Date();
        const dateStr = `2026-07-03 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        area.attachments.unshift({
            id: 'att-' + Date.now(),
            name: name,
            size: size,
            date: dateStr,
            type: type,
            uploader: 'Current User'
        });

        saveToStorage();
        document.getElementById('attModal').remove();
        showToast('Document attached to area repository.', 'success');
        render();
    }

    function deleteAttachment(areaId, attId) {
        const area = areas.find(a => a.id === areaId);
        if (!area) return;
        area.attachments = area.attachments.filter(a => a.id !== attId);
        saveToStorage();
        showToast('Attachment removed.', 'info');
        render();
    }

    function downloadAttachment(filename) {
        showToast(`Initiating download: ${filename}... (Simulation)`, 'info');
        setTimeout(() => {
            const blob = new Blob([`[SIMULATED FILE CONTENT]\nFile: ${filename}\nGenerated: July 3, 2026\nQuality Group | MS Section Portal`], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 600);
    }

    // Export Data (JSON / CSV)
    function exportData(format = 'json') {
        const activeArea = areas.find(a => a.id === activeAreaId) || areas[0];
        const filename = `QAArea_${activeArea.id}_Export_Jul2026.${format}`;
        
        let content = '';
        let mimeType = 'application/json';

        if (format === 'json') {
            content = JSON.stringify(activeArea, null, 2);
        } else {
            mimeType = 'text/csv';
            // Simple CSV conversion of parameters and history
            content += "Section,Label/Event,Value/Status,Target/Inspector,Details\n";
            activeArea.parameters.forEach(p => {
                content += `"Parameter","${p.label}","${p.value}","${p.target}","Status: ${p.status}"\n`;
            });
            activeArea.history.forEach(h => {
                content += `"Audit History","${h.event}","${h.status}","${h.inspector}","${h.details.replace(/"/g, '""')}"\n`;
            });
        }

        const blob = new Blob([content], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        showToast(`Exported ${activeArea.name} data as ${format.toUpperCase()}.`, 'success');
    }

    // INTELLIGENT DATA UPLOAD & TELEMETRY ANALYZER
    function openUploadAnalyzerModal(targetAreaId = null) {
        const areaIdToUse = targetAreaId || activeAreaId;
        const area = areas.find(a => a.id === areaIdToUse) || areas[0];

        const modalHtml = `
            <div id="uploadAnalyzerModal" class="fixed inset-0 bg-dark-900/85 z-[999] flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn">
                <div class="bg-dark-500 w-full max-w-xl rounded-2xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col max-h-[90vh]">
                    <div class="bg-gradient-to-r from-cyan-600/20 to-royalblue-500/10 p-5 border-b border-slate-800 flex justify-between items-center">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-royalblue-600 flex items-center justify-center text-white shadow"><i class="fas fa-file-import text-base"></i></div>
                            <div><h3 class="text-base font-bold text-white">Upload & Analyze Telemetry Data</h3><span class="text-[11px] text-cyan-400 font-semibold block">Target: ${area.name}</span></div>
                        </div>
                        <button onclick="document.getElementById('uploadAnalyzerModal').remove()" class="text-slate-400 hover:text-white p-1 rounded-lg"><i class="fas fa-times text-lg"></i></button>
                    </div>
                    <div class="p-6 overflow-y-auto space-y-4 font-sans">
                        <div class="border-2 border-dashed border-slate-700 hover:border-cyan-400/60 rounded-2xl p-8 text-center bg-dark-900/40 transition-all cursor-pointer" onclick="document.getElementById('fileInput').click()">
                            <i class="fas fa-cloud-upload-alt text-4xl text-cyan-400 mb-3 block"></i>
                            <span class="text-sm font-bold text-white block mb-1">Click or Drag & Drop CSV / JSON File</span>
                            <span class="text-xs text-slate-400 block">Supports automated DCS telemetry dumps, titration assays, and audit logs.</span>
                            <input type="file" id="fileInput" accept=".csv,.json" class="hidden" onchange="QAArea.handleFileSelect(event, '${area.id}')">
                        </div>

                        <div class="bg-dark-700/60 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
                            <span class="font-bold text-sky-400 block"><i class="fas fa-lightbulb mr-1.5"></i> Automated Analysis Capabilities:</span>
                            <ul class="list-disc pl-5 space-y-1 text-slate-300">
                                <li>Parses chemical telemetry readings and checks against area tolerance limits.</li>
                                <li>Detects out-of-spec spikes (e.g., pH outside 8.2-8.6 range or high Ni residue loss).</li>
                                <li>Automatically recalculates zero-defect compliance rate and generates an Audit CAPA log.</li>
                            </ul>
                        </div>

                        <!-- Preview Container for Analysis Results -->
                        <div id="analyzerPreview" class="hidden space-y-3 pt-2 border-t border-slate-800">
                            <!-- Injected dynamically by handleFileSelect -->
                        </div>
                    </div>
                    <div class="p-4 bg-dark-900/60 border-t border-slate-800 flex justify-end gap-3">
                        <button onclick="document.getElementById('uploadAnalyzerModal').remove()" class="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold">Cancel</button>
                        <button id="confirmMergeBtn" disabled onclick="QAArea.confirmMergeData('${area.id}')" class="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-cyan-500 hover:from-emerald-500 text-white rounded-xl text-xs font-bold shadow disabled:opacity-40 disabled:cursor-not-allowed transition-all">Confirm & Merge Data</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    // Temporary storage for analyzed data before merging
    let tempAnalyzedData = null;

    function handleFileSelect(event, areaId) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            const isJson = file.name.endsWith('.json');
            analyzeDataContent(content, isJson, file.name, areaId);
        };
        reader.readAsText(file);
    }

    function analyzeDataContent(content, isJson, filename, areaId) {
        const area = areas.find(a => a.id === areaId);
        if (!area) return;

        let totalRecords = 0;
        let outOfSpecCount = 0;
        let anomalies = [];
        let newComplianceRate = area.complianceRate;
        let parsedParameters = [];

        try {
            if (isJson) {
                const data = JSON.parse(content);
                const records = Array.isArray(data) ? data : (data.parameters || data.records || [data]);
                totalRecords = records.length;
                records.forEach(r => {
                    const val = parseFloat(r.value || r.val || 0);
                    const label = r.label || r.parameter || 'Imported Spec';
                    // Check if value is outside typical bounds or flagged
                    if (r.status === 'Out of Spec' || (val > 100 && label.includes('%')) || val < 0) {
                        outOfSpecCount++;
                        anomalies.push(`${label}: ${val} (Flagged out of standard range)`);
                    }
                    parsedParameters.push({ label, value: r.value || String(val), status: outOfSpecCount > 0 ? 'Out of Spec' : 'Optimal' });
                });
            } else {
                // CSV Parsing simulation
                const lines = content.split('\n').filter(l => l.trim().length > 0);
                totalRecords = Math.max(1, lines.length - 1); // exclude header
                
                lines.slice(1).forEach((line, idx) => {
                    const cols = line.split(',').map(c => c.replace(/"/g, '').trim());
                    const label = cols[0] || `CSV Row #${idx + 1}`;
                    const valStr = cols[1] || '8.4';
                    const valNum = parseFloat(valStr);

                    // Perform intelligent domain checks against area specs
                    let isAnomaly = false;
                    if (label.toLowerCase().includes('ph') && (valNum < 8.2 || valNum > 8.6)) isAnomaly = true;
                    if (label.toLowerCase().includes('ni') && valNum >= 0.05) isAnomaly = true;
                    if (label.toLowerCase().includes('density') && (valNum < 1.33 || valNum > 1.37)) isAnomaly = true;

                    if (isAnomaly) {
                        outOfSpecCount++;
                        anomalies.push(`${label}: ${valStr} (Exceeded QA tolerance limit)`);
                    }
                    parsedParameters.push({ label, value: valStr, status: isAnomaly ? 'Out of Spec' : 'Optimal' });
                });
            }

            // Calculate new simulated compliance score
            const complianceCalc = Math.max(85.0, (100 - (outOfSpecCount / Math.max(1, totalRecords)) * 100)).toFixed(1);
            newComplianceRate = parseFloat(complianceCalc);

            // Store in temp memory
            tempAnalyzedData = {
                filename,
                totalRecords,
                outOfSpecCount,
                anomalies,
                newComplianceRate,
                parsedParameters
            };

            // Render Preview
            const previewEl = document.getElementById('analyzerPreview');
            const confirmBtn = document.getElementById('confirmMergeBtn');
            if (previewEl && confirmBtn) {
                previewEl.classList.remove('hidden');
                confirmBtn.disabled = false;

                const statusColor = outOfSpecCount === 0 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' : 'text-amber-400 bg-amber-500/10 border-amber-500/30';

                previewEl.innerHTML = `
                    <div class="p-4 rounded-xl bg-dark-900 border border-slate-800 space-y-3 animate-fadeIn">
                        <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                            <span class="text-xs font-bold text-white"><i class="fas fa-check-double text-cyan-400 mr-1.5"></i> Analysis Complete: ${filename}</span>
                            <span class="px-2 py-0.5 rounded text-[10px] font-bold border ${statusColor}">${outOfSpecCount === 0 ? 'Optimal Telemetry' : `${outOfSpecCount} Anomalies Detected`}</span>
                        </div>
                        <div class="grid grid-cols-3 gap-2 text-center">
                            <div class="p-2 bg-dark-700 rounded-lg">
                                <span class="text-[10px] text-slate-400 block">Records Parsed</span>
                                <span class="text-sm font-bold text-white">${totalRecords}</span>
                            </div>
                            <div class="p-2 bg-dark-700 rounded-lg">
                                <span class="text-[10px] text-slate-400 block">Anomalies</span>
                                <span class="text-sm font-bold ${outOfSpecCount > 0 ? 'text-rose-400' : 'text-emerald-400'}">${outOfSpecCount}</span>
                            </div>
                            <div class="p-2 bg-dark-700 rounded-lg">
                                <span class="text-[10px] text-slate-400 block">New Compliance</span>
                                <span class="text-sm font-bold text-cyan-400">${newComplianceRate}%</span>
                            </div>
                        </div>
                        ${anomalies.length > 0 ? `
                            <div class="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-lg text-xs text-rose-300 space-y-1">
                                <strong class="block font-bold"><i class="fas fa-exclamation-triangle mr-1"></i> Out-of-Spec Spikes Detected:</strong>
                                ${anomalies.map(a => `<div>• ${a}</div>`).join('')}
                            </div>
                        ` : ''}
                        <p class="text-[11px] text-slate-400">Clicking <strong>Confirm & Merge Data</strong> will update the active telemetry specifications and record an automated audit summary into the area history log.</p>
                    </div>
                `;
            }
        } catch (err) {
            alert('Error parsing file: Please ensure it is a valid CSV or JSON telemetry dump.');
            console.error('File analysis error:', err);
        }
    }

    function confirmMergeData(areaId) {
        if (!tempAnalyzedData) return;
        const area = areas.find(a => a.id === areaId);
        if (!area) return;

        // Update compliance rate
        area.complianceRate = tempAnalyzedData.newComplianceRate;

        // Merge parameters or update existing ones if matching labels exist
        if (tempAnalyzedData.parsedParameters && tempAnalyzedData.parsedParameters.length > 0) {
            const firstParam = tempAnalyzedData.parsedParameters[0];
            const existingParam = area.parameters.find(p => p.label.toLowerCase() === firstParam.label.toLowerCase());
            if (existingParam) {
                existingParam.value = firstParam.value;
                existingParam.status = firstParam.status;
            } else {
                area.parameters.push({
                    id: 'p-' + Date.now(),
                    label: firstParam.label,
                    value: firstParam.value,
                    target: 'Imported Benchmark',
                    status: firstParam.status,
                    isNumeric: false
                });
            }
        }

        // Add attachment entry
        const now = new Date();
        const dateStr = `2026-07-03 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        area.attachments.unshift({
            id: 'att-' + Date.now(),
            name: tempAnalyzedData.filename,
            size: '420 KB',
            date: dateStr,
            type: 'Telemetry Dump',
            uploader: 'Automated Analyzer'
        });

        // Add history log
        const statusStr = tempAnalyzedData.outOfSpecCount === 0 ? 'Passed' : 'Pending CAPA';
        area.history.unshift({
            id: 'h-' + Date.now(),
            timestamp: dateStr,
            event: `Automated Telemetry Import & Assay (${tempAnalyzedData.filename})`,
            inspector: 'QA Telemetry Analyzer (AI/DCS)',
            status: statusStr,
            details: `Successfully analyzed ${tempAnalyzedData.totalRecords} telemetry records. Computed compliance: ${tempAnalyzedData.newComplianceRate}%. ${tempAnalyzedData.outOfSpecCount > 0 ? `Flagged ${tempAnalyzedData.outOfSpecCount} out-of-spec chemical readings requiring field titration check.` : 'All parameters verified within optimal zero-defect boundaries.'}`
        });

        saveToStorage();
        document.getElementById('uploadAnalyzerModal').remove();
        showToast('Data analyzed and merged successfully!', 'success');
        render();
    }

    // Notification Toast System
    function showToast(message, type = 'info') {
        const toastId = 'toast-' + Date.now();
        const bgColors = {
            success: 'bg-emerald-600 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]',
            info: 'bg-royalblue-600 border-sky-400 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]',
            error: 'bg-rose-600 border-rose-400 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]'
        };
        const icons = {
            success: 'fa-check-circle',
            info: 'fa-info-circle',
            error: 'fa-exclamation-circle'
        };

        const toastHtml = `
            <div id="${toastId}" class="fixed bottom-6 right-6 z-[9999] ${bgColors[type]} px-4 py-3 rounded-xl border flex items-center gap-3 text-xs font-bold animate-fadeIn transition-all transform translate-y-0">
                <i class="fas ${icons[type]} text-base"></i>
                <span>${message}</span>
                <button onclick="document.getElementById('${toastId}').remove()" class="ml-2 opacity-80 hover:opacity-100"><i class="fas fa-times"></i></button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', toastHtml);
        setTimeout(() => {
            const el = document.getElementById(toastId);
            if (el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(10px)';
                setTimeout(() => el.remove(), 300);
            }
        }, 4000);
    }

    // Inject styles and modals on load
    function injectModals() {
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes fadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
            .animate-fadeIn { animation: fadeIn 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        `;
        document.head.appendChild(style);
    }

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Public API
    return {
        init,
        switchTab,
        handleSearch,
        setFilterCategory,
        openSopProcedure,
        openAddEditAreaModal,
        saveArea,
        deleteArea,
        openAddParameterModal,
        saveParameter,
        deleteParameter,
        openAddHistoryModal,
        saveHistory,
        deleteHistory,
        openAddAttachmentModal,
        saveAttachment,
        deleteAttachment,
        downloadAttachment,
        exportData,
        openUploadAnalyzerModal,
        handleFileSelect,
        confirmMergeData,
        getAreas: () => areas
    };

})();