(function (window, document) {
    'use strict';

    // ========================================================================
    // 1. DATA STORAGE & STATE MANAGEMENT
    // ========================================================================
    const STORAGE_KEY = 'QAMS_Calendar_Events_v1';
    const HISTORY_KEY = 'QAMS_Calendar_History_v1';

    // Default Seed Data representing July 2026 Operational Calendar
    const defaultEvents = [
        {
            id: 'EVT-2026-0701',
            date: '2026-07-01',
            category: 'routine',
            title: 'Routine IPQC Slurry Sampling & Titration Check',
            area: 'FNTRL Area',
            reporter: 'Engr. M. Santos (QA Lab)',
            time: '08:00',
            status: 'Completed',
            rootCause: 'Scheduled daily quality assurance compliance verification.',
            description: 'Conducted routine discharge slurry pH verification and flocculant dosing inspection across all final neutralization cells.',
            capa: 'All parameters within optimal 8.2 - 8.6 pH tolerance. No corrective action required.',
            isCritical: false,
            attachments: [
                { name: 'FNTRL_Daily_IPQC_Log_0701.pdf', size: '1.1 MB', type: 'application/pdf' }
            ],
            history: [
                { timestamp: '2026-07-01 08:30', action: 'Routine Event Logged', user: 'Engr. M. Santos' }
            ]
        },
        {
            id: 'EVT-2026-0702',
            date: '2026-07-02',
            category: 'improvement',
            title: 'Limestone Slurry Density Sensor Optimization',
            area: 'Limestone Area',
            reporter: 'Engr. M. Santos (QA Lab)',
            time: '13:50',
            status: 'In Progress',
            rootCause: 'Slight calibration drift (+/- 0.05 g/cm³) identified during automated titration feed loop audit.',
            description: 'QA Analysis identified slight drift in automatic titration feed loop. Recommended proactive recalibration of Sub DCS field sensor #LS-402 during scheduled shift turnover.',
            capa: 'SOP-409 recalibration procedure initiated. Sensor zero-point offset adjusted by field instrumentation team.',
            isCritical: false,
            attachments: [
                { name: 'Sensor_Drift_Analysis_LS402.csv', size: '340 KB', type: 'text/csv' },
                { name: 'SOP_409_Calibration_Checklist.pdf', size: '2.2 MB', type: 'application/pdf' }
            ],
            history: [
                { timestamp: '2026-07-02 13:50', action: 'Improvement Logged in Calendar', user: 'Engr. M. Santos' },
                { timestamp: '2026-07-02 15:10', action: 'CAPA Workflow Assigned', user: 'Lead QA Chief' }
            ]
        },
        {
            id: 'EVT-2026-0706',
            date: '2026-07-06',
            category: 'nearmiss',
            title: 'Near Miss: H2S Scrubber Line Pressure Fluctuation',
            area: 'H2S Area',
            reporter: 'J. Reyes (Safety Inspector)',
            time: '10:15',
            status: 'Resolved & Monitored',
            rootCause: 'Transient voltage sag on Sub DCS PLC Node 3 causing momentary valve actuator hesitation.',
            description: 'During routine QA inspection, toxic gas sensor #H2S-109 registered a transient 3-second pressure spike before DCS automated safety interlocks regulated the valve. No gas release occurred.',
            capa: 'Installed UPS power conditioning module on PLC Node 3. Increased scrubber caustic feed rate to maintain 10.8 pH safety buffer.',
            isCritical: true,
            attachments: [
                { name: 'H2S_Telemetry_Spike_Log.json', size: '620 KB', type: 'application/json' }
            ],
            history: [
                { timestamp: '2026-07-06 10:20', action: 'Near Miss Emergency Log Created', user: 'J. Reyes' },
                { timestamp: '2026-07-06 14:00', action: 'Safety Interlock Verified by DCS Team', user: 'Engr. D. Cruz' }
            ]
        },
        {
            id: 'EVT-2026-0714',
            date: '2026-07-14',
            category: 'accident',
            title: 'Incident: Flocculant Dosing Pump Mechanical Seal Failure',
            area: 'FNTRL Area',
            reporter: 'Engr. D. Cruz (Plant Supv)',
            time: '14:30',
            status: 'CAPA Action Completed',
            rootCause: 'Abrasive slurry wear on mechanical seal ring exceeding 8,000 operational hours without preventive replacement.',
            description: 'Mechanical seal failure on Sub DCS dosing pump #FN-04 resulted in localized slurry overflow in containment basin. QA emergency procedure SOP-FN-104 initiated immediately.',
            capa: 'Pump #FN-04 isolated and upgraded with tungsten-carbide mechanical seals. containment basin neutralized and flushed. SOP maintenance schedule revised to 6,000 hours.',
            isCritical: true,
            attachments: [
                { name: 'Incident_Investigation_Report_FN04.pdf', size: '4.5 MB', type: 'application/pdf' },
                { name: 'Containment_Basin_Assay.csv', size: '180 KB', type: 'text/csv' }
            ],
            history: [
                { timestamp: '2026-07-14 14:45', action: 'Accident/Incident Logged', user: 'Engr. D. Cruz' },
                { timestamp: '2026-07-15 09:00', action: 'Root Cause Investigation Completed', user: 'QA Compliance Committee' }
            ]
        },
        {
            id: 'EVT-2026-0720',
            date: '2026-07-20',
            category: 'nearmiss',
            title: 'Near Miss: Zinc Solvent Extraction Phase Separation Delay',
            area: 'MS-Dezinc Area',
            reporter: 'R. Gomez (Lab Chemist)',
            time: '11:20',
            status: 'Resolved (SOP-MS-101)',
            rootCause: 'Ambient temperature drop in solvent storage tank causing slight increase in organic phase viscosity.',
            description: 'QA laboratory titration sample showed phase separation taking 45 seconds longer than SOP tolerance (115 sec vs 90 sec max). Stirrer impeller speed in MS-Dezinc tank adjusted via Master DCS override.',
            capa: 'Stirrer impeller speed increased by 5 RPM via Master DCS override. Automated temperature heating loop setpoint raised to 38°C.',
            isCritical: true,
            attachments: [],
            history: [
                { timestamp: '2026-07-20 11:30', action: 'Near Miss Logged', user: 'R. Gomez' }
            ]
        },
        {
            id: 'EVT-2026-0728',
            date: '2026-07-28',
            category: 'audit',
            title: 'Comprehensive MS Section ISO 9001 Quality Audit Prep',
            area: 'DCS Control Room',
            reporter: 'QA Compliance Committee',
            time: '09:00',
            status: 'Scheduled',
            rootCause: 'Annual external third-party quality assurance and environmental compliance audit.',
            description: 'Plant-wide audit preparation covering FNTRL, Dezinc, H2S, and Limestone SOP compliance. All field chemists to present calibration logs and titration records.',
            capa: 'Pre-audit checklist distribution initiated. All Sub DCS field nodes undergoing digital sensor verification.',
            isCritical: false,
            attachments: [
                { name: 'ISO_9001_PreAudit_Checklist_2026.pdf', size: '3.1 MB', type: 'application/pdf' }
            ],
            history: [
                { timestamp: '2026-07-01 10:00', action: 'Audit Event Scheduled', user: 'Lead QA Chief' }
            ]
        }
    ];

    const defaultHistory = [
        { id: 'HLOG-101', timestamp: '2026-07-02 15:10', action: 'Updated CAPA for EVT-2026-0702', user: 'Lead QA Chief', details: 'Assigned sensor recalibration to instrumentation team.' },
        { id: 'HLOG-102', timestamp: '2026-07-02 13:50', action: 'Created Event EVT-2026-0702', user: 'Engr. M. Santos', details: 'Limestone Slurry Density Sensor Optimization logged.' },
        { id: 'HLOG-103', timestamp: '2026-07-01 10:00', action: 'Scheduled Audit EVT-2026-0728', user: 'Lead QA Chief', details: 'ISO 9001 prep added to plant calendar.' },
        { id: 'HLOG-104', timestamp: '2026-07-01 08:30', action: 'Created Routine EVT-2026-0701', user: 'Engr. M. Santos', details: 'Daily IPQC slurry sampling logged.' }
    ];

    // LocalStorage Helper Object
    const Store = {
        getEvents: () => {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : defaultEvents;
        },
        saveEvents: (events) => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
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
                id: 'HLOG-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
                timestamp,
                action,
                user,
                details
            });
            localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50))); // Keep last 50 logs
        }
    };

    // ========================================================================
    // 2. MAIN CALENDAR CONTROLLER & UI RENDERER
    // ========================================================================
    const QACalendar = {
        currentYear: 2026,
        currentMonth: 6, // 0-indexed: 6 = July
        selectedDate: '2026-07-02', // Default Philippines current date
        activeFilter: 'all',
        searchQuery: '',
        showTableView: false,

        // Initialize module and take over #calendar-section in index.html
        init: function () {
            this.injectCalendarContainer();
            this.bindSidebarListeners();
            this.render();
            this.enforceSectionVisibility();
            console.log('✅ QA Calendar & Incident Module successfully initialized.');
        },

        // Built-in safety guard to prevent legacy scripts from hiding top-level sections
        enforceSectionVisibility: function () {
            if (typeof window.enforceSectionVisibility === 'function') {
                window.enforceSectionVisibility();
            } else {
                const mainSections = [
                    'bulletin-board-section',
                    'quality-spec-section',
                    'qamsproduct-portal',
                    'home',
                    'calendar-section',
                    'area-explorer',
                    'dcs-section',
                    'sop-section',
                    'user-management-section'
                ];
                mainSections.forEach(id => {
                    const el = document.getElementById(id);
                    if (el) {
                        el.style.setProperty('display', 'block', 'important');
                        el.style.setProperty('opacity', '1', 'important');
                        el.style.setProperty('visibility', 'visible', 'important');
                    }
                });
            }
        },

        // Safe Navigation Helper: Jump to Bulletin Board tabs without event bubbling
        navigateToBulletin: function (e, tab = 'nearmiss') {
            if (e && typeof e.stopImmediatePropagation === 'function') {
                e.stopImmediatePropagation();
                e.stopPropagation();
            }
            if (typeof window.switchBulletinTab === 'function') {
                window.switchBulletinTab(e, tab);
            }
            const sec = document.getElementById('bulletin-board-section');
            if (sec) {
                sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            this.enforceSectionVisibility();
        },

        // Open specific filter or reset view from sidebar/header links
        open: function (e, filter = 'all') {
            if (typeof e === 'string' && !filter || (e && typeof e === 'string')) {
                filter = e;
                e = null;
            }
            if (e && typeof e.stopImmediatePropagation === 'function') {
                e.stopImmediatePropagation();
                e.stopPropagation();
            }
            this.activeFilter = filter;
            this.render();
            const section = document.getElementById('calendar-section');
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            this.enforceSectionVisibility();
        },

        // Ensure #calendar-section exists in index.html
        injectCalendarContainer: function () {
            let section = document.getElementById('calendar-section');
            if (!section) {
                section = document.createElement('section');
                section.id = 'calendar-section';
                section.className = 'py-16 px-4 sm:px-8 bg-dark-900 border-b border-slate-800/80';
                const main = document.querySelector('main');
                if (main) main.appendChild(section);
            }
        },

        // Bind clicks on anchor links pointing to #calendar-section
        bindSidebarListeners: function () {
            document.querySelectorAll('a[href="#calendar-section"]').forEach(link => {
                link.addEventListener('click', (e) => {
                    this.open(e, 'all');
                });
            });
        },

        // Navigate between calendar months
        changeMonth: function (delta) {
            this.currentMonth += delta;
            if (this.currentMonth < 0) {
                this.currentMonth = 11;
                this.currentYear--;
            } else if (this.currentMonth > 11) {
                this.currentMonth = 0;
                this.currentYear++;
            }
            // Reset selected date to the 1st of the new month if current selected is out of scope
            const monthStr = String(this.currentMonth + 1).padStart(2, '0');
            if (!this.selectedDate.startsWith(`${this.currentYear}-${monthStr}`)) {
                this.selectedDate = `${this.currentYear}-${monthStr}-01`;
            }
            this.render();
            this.enforceSectionVisibility();
        },

        // Filter events by category and text search
        getFilteredEvents: function () {
            let events = Store.getEvents();
            if (this.activeFilter !== 'all') {
                events = events.filter(e => e.category === this.activeFilter);
            }
            if (this.searchQuery.trim() !== '') {
                const q = this.searchQuery.toLowerCase();
                events = events.filter(e =>
                    e.title.toLowerCase().includes(q) ||
                    e.area.toLowerCase().includes(q) ||
                    e.reporter.toLowerCase().includes(q) ||
                    e.description.toLowerCase().includes(q) ||
                    e.rootCause.toLowerCase().includes(q) ||
                    e.id.toLowerCase().includes(q)
                );
            }
            return events;
        },

        // Main Render Loop
        render: function () {
            const container = document.getElementById('calendar-section');
            if (!container) return;

            const allEvents = Store.getEvents();
            const filteredEvents = this.getFilteredEvents();

            // Month Name
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const currentMonthName = `${monthNames[this.currentMonth]} ${this.currentYear}`;

            // KPI Stats
            const stats = {
                total: allEvents.length,
                nearmiss: allEvents.filter(e => e.category === 'nearmiss').length,
                accident: allEvents.filter(e => e.category === 'accident').length,
                improvement: allEvents.filter(e => e.category === 'improvement').length,
                routine: allEvents.filter(e => e.category === 'routine' || e.category === 'audit').length,
                critical: allEvents.filter(e => e.isCritical).length
            };

            container.innerHTML = `
                <div class="max-w-7xl mx-auto">
                    <!-- Section Header -->
                    <div class="flex flex-col lg:flex-row lg:items-end justify-between mb-8" data-aos="fade-up">
                        <div>
                            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-500/10 text-cyan-400 font-bold text-xs mb-3 border border-cyan-500/20 shadow-inner">
                                <i class="fas fa-calendar-alt animate-pulse"></i> Real-Time Operational Sync &bull; MS Section
                            </div>
                            <h3 class="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">QA Calendar & Incident Analysis</h3>
                            <p class="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                                Interactive scheduling and root-cause investigation portal. Click calendar dates to inspect daily telemetry logs, Near Miss reports, and CAPA resolutions.
                            </p>
                        </div>
                        
                        <!-- Top Action Buttons -->
                        <div class="flex flex-wrap items-center gap-2.5 mt-4 lg:mt-0">
                            <button onclick="QACalendar.openAddModal('${this.selectedDate}')" class="px-4 py-2.5 bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold text-xs sm:text-sm rounded-xl shadow-[0_0_15px_rgba(244,63,94,0.3)] transition-all flex items-center gap-2">
                                <i class="fas fa-plus-circle"></i> Log QA Event / Incident
                            </button>
                            <button onclick="QACalendar.openUploadModal()" class="px-4 py-2.5 bg-dark-500 hover:bg-dark-400 border border-slate-700 hover:border-cyan-500/50 text-cyan-400 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-2 shadow">
                                <i class="fas fa-cloud-upload-alt"></i> Upload & AI Analyze
                            </button>
                            <button onclick="QACalendar.exportToCSV()" class="px-3.5 py-2.5 bg-dark-500 hover:bg-dark-400 border border-slate-700 text-slate-300 hover:text-white font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5" title="Export CSV">
                                <i class="fas fa-file-csv text-emerald-400"></i> Export
                            </button>
                            <button onclick="QACalendar.openHistoryModal()" class="px-3.5 py-2.5 bg-dark-500 hover:bg-dark-400 border border-slate-700 text-slate-300 hover:text-white font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5" title="Audit Trail">
                                <i class="fas fa-history text-amber-400"></i> Audit Log
                            </button>
                            <button onclick="QACalendar.toggleTableView()" class="px-3.5 py-2.5 bg-dark-500 hover:bg-dark-400 border border-slate-700 text-slate-300 hover:text-white font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5" title="Toggle Table View">
                                <i class="fas ${this.showTableView ? 'fa-calendar' : 'fa-table'} text-sky-400"></i> ${this.showTableView ? 'Grid View' : 'Table View'}
                            </button>
                        </div>
                    </div>

                    <!-- KPI Statistics Cards -->
                    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
                        <div onclick="QACalendar.open(event, 'all')" class="p-4 rounded-xl bg-dark-500 border ${this.activeFilter === 'all' ? 'border-sky-400 ring-1 ring-sky-400' : 'border-slate-800'} cursor-pointer hover:border-slate-600 transition-all">
                            <span class="text-[11px] font-bold text-slate-400 uppercase block">Total Logged</span>
                            <div class="flex items-center justify-between mt-1">
                                <span class="text-2xl font-extrabold text-white">${stats.total}</span>
                                <i class="fas fa-calendar-check text-sky-400 text-lg"></i>
                            </div>
                        </div>
                        <div onclick="QACalendar.open(event, 'nearmiss')" class="p-4 rounded-xl bg-dark-500 border ${this.activeFilter === 'nearmiss' ? 'border-amber-400 ring-1 ring-amber-400' : 'border-slate-800'} cursor-pointer hover:border-slate-600 transition-all">
                            <span class="text-[11px] font-bold text-slate-400 uppercase block">Near Misses</span>
                            <div class="flex items-center justify-between mt-1">
                                <span class="text-2xl font-extrabold text-amber-400">${stats.nearmiss}</span>
                                <i class="fas fa-exclamation-triangle text-amber-400 text-lg"></i>
                            </div>
                        </div>
                        <div onclick="QACalendar.open(event, 'accident')" class="p-4 rounded-xl bg-dark-500 border ${this.activeFilter === 'accident' ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-800'} cursor-pointer hover:border-slate-600 transition-all">
                            <span class="text-[11px] font-bold text-slate-400 uppercase block">Accidents / Inc.</span>
                            <div class="flex items-center justify-between mt-1">
                                <span class="text-2xl font-extrabold text-rose-500">${stats.accident}</span>
                                <i class="fas fa-car-crash text-rose-500 text-lg"></i>
                            </div>
                        </div>
                        <div onclick="QACalendar.open(event, 'improvement')" class="p-4 rounded-xl bg-dark-500 border ${this.activeFilter === 'improvement' ? 'border-emerald-400 ring-1 ring-emerald-400' : 'border-slate-800'} cursor-pointer hover:border-slate-600 transition-all">
                            <span class="text-[11px] font-bold text-slate-400 uppercase block">Improvement</span>
                            <div class="flex items-center justify-between mt-1">
                                <span class="text-2xl font-extrabold text-emerald-400">${stats.improvement}</span>
                                <i class="fas fa-lightbulb text-emerald-400 text-lg"></i>
                            </div>
                        </div>
                        <div onclick="QACalendar.open(event, 'routine')" class="p-4 rounded-xl bg-dark-500 border ${this.activeFilter === 'routine' ? 'border-cyan-400 ring-1 ring-cyan-400' : 'border-slate-800'} cursor-pointer hover:border-slate-600 transition-all">
                            <span class="text-[11px] font-bold text-slate-400 uppercase block">Routine / Audit</span>
                            <div class="flex items-center justify-between mt-1">
                                <span class="text-2xl font-extrabold text-cyan-400">${stats.routine}</span>
                                <i class="fas fa-clipboard-check text-cyan-400 text-lg"></i>
                            </div>
                        </div>
                        <div class="p-4 rounded-xl bg-gradient-to-br from-dark-500 to-dark-700 border border-slate-800">
                            <span class="text-[11px] font-bold text-slate-400 uppercase block">Critical Alarms</span>
                            <div class="flex items-center justify-between mt-1">
                                <span class="text-2xl font-extrabold ${stats.critical > 0 ? 'text-rose-400' : 'text-emerald-400'}">${stats.critical}</span>
                                <i class="fas fa-bell text-rose-400 text-lg animate-bounce"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Search & Filter Bar -->
                    <div class="bg-dark-500 p-4 rounded-2xl border border-slate-800 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <!-- Filter Pills -->
                        <div class="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
                            ${this.renderFilterPill('all', 'All Events', 'fa-layer-group')}
                            ${this.renderFilterPill('nearmiss', 'Near Misses', 'fa-exclamation-triangle', 'text-amber-400')}
                            ${this.renderFilterPill('accident', 'Incidents / Accidents', 'fa-car-crash', 'text-rose-500')}
                            ${this.renderFilterPill('improvement', 'For Improvement', 'fa-lightbulb', 'text-emerald-400')}
                            ${this.renderFilterPill('routine', 'Routine IPQC / Audits', 'fa-clipboard-check', 'text-cyan-400')}
                        </div>

                        <!-- Search Input -->
                        <div class="relative w-full md:w-80">
                            <i class="fas fa-search absolute left-3.5 top-3 text-slate-400 text-xs"></i>
                            <input type="text" value="${this.searchQuery}" oninput="QACalendar.handleSearch(this.value)" placeholder="Search event ID, area, root cause..." class="w-full bg-dark-700 border border-slate-700 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-400 outline-none focus:border-cyan-500 transition-all">
                            ${this.searchQuery ? `<button onclick="QACalendar.handleSearch('')" class="absolute right-3 top-2.5 text-slate-400 hover:text-white"><i class="fas fa-times text-xs"></i></button>` : ''}
                        </div>
                    </div>

                    <!-- MAIN DISPLAY: Split Calendar vs Table View -->
                    ${this.showTableView ? this.renderTableView(filteredEvents) : this.renderSplitCalendarView(currentMonthName, filteredEvents)}
                </div>
            `;
            this.enforceSectionVisibility();
        },

        renderFilterPill: function (key, label, icon, color = 'text-white') {
            const isActive = this.activeFilter === key;
            return `
                <button onclick="QACalendar.open(event, '${key}')" class="px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${isActive ? 'bg-royalblue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.4)]' : 'bg-dark-700 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/80'}">
                    <i class="fas ${icon} ${isActive ? 'text-white' : color}"></i> ${label}
                </button>
            `;
        },

        // Render Split View: Left Calendar Grid + Right Daily Event Inspector
        renderSplitCalendarView: function (monthName, filteredEvents) {
            // Find events for the currently selected date
            const dayEvents = filteredEvents.filter(e => e.date === this.selectedDate);
            const dateDisplay = new Date(this.selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

            return `
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <!-- LEFT: Interactive Calendar Grid -->
                    <div class="lg:col-span-7 bg-dark-500 rounded-2xl p-4 sm:p-6 border border-slate-800 shadow-xl">
                        <!-- Calendar Header & Navigation -->
                        <div class="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-dark-700 border border-slate-700 flex items-center justify-center text-cyan-400 shadow">
                                    <i class="fas fa-calendar-day text-base"></i>
                                </div>
                                <div>
                                    <h4 class="font-bold text-base sm:text-lg text-white leading-tight">${monthName}</h4>
                                    <span class="text-[11px] text-sky-400 font-semibold uppercase tracking-wider block">MS Section Schedule</span>
                                </div>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <button onclick="QACalendar.changeMonth(-1)" class="p-2 bg-dark-700 hover:bg-slate-700 text-slate-300 rounded-lg transition-all border border-slate-700" title="Previous Month">
                                    <i class="fas fa-chevron-left text-xs"></i>
                                </button>
                                <button onclick="QACalendar.resetToToday()" class="px-3 py-1.5 bg-royalblue-600/30 hover:bg-royalblue-600/50 text-sky-300 border border-royalblue-500/40 rounded-lg text-xs font-bold transition-all">
                                    Today
                                </button>
                                <button onclick="QACalendar.changeMonth(1)" class="p-2 bg-dark-700 hover:bg-slate-700 text-slate-300 rounded-lg transition-all border border-slate-700" title="Next Month">
                                    <i class="fas fa-chevron-right text-xs"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Days of Week Header -->
                        <div class="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-bold text-slate-400 uppercase mb-2">
                            <div class="text-rose-400">Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div class="text-sky-400">Sat</div>
                        </div>

                        <!-- Dynamic Days Grid -->
                        <div class="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs sm:text-sm font-semibold">
                            ${this.generateCalendarCells(filteredEvents)}
                        </div>

                        <!-- Legend Footer -->
                        <div class="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-3">
                            <div class="flex items-center gap-3 flex-wrap">
                                <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-amber-400"></span> Near Miss</span>
                                <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-rose-500"></span> Incident</span>
                                <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-400"></span> Improvement</span>
                                <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-cyan-400"></span> Routine / Audit</span>
                            </div>
                            <span class="text-sky-400 font-semibold"><i class="fas fa-mouse-pointer mr-1"></i> Click date to inspect</span>
                        </div>
                    </div>

                    <!-- RIGHT: Dynamic Daily Event Inspector Panel -->
                    <div class="lg:col-span-5 bg-dark-500 rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between min-h-[500px]">
                        <div>
                            <!-- Panel Header -->
                            <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                                <div>
                                    <span class="text-[10px] font-bold tracking-widest text-sky-400 uppercase block">Daily Inspection Log</span>
                                    <h4 class="text-sm sm:text-base font-extrabold text-white mt-0.5">${dateDisplay}</h4>
                                </div>
                                <span class="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                                    ${dayEvents.length} Event(s)
                                </span>
                            </div>

                            <!-- Daily Events List -->
                            <div class="space-y-3 overflow-y-auto max-h-[420px] pr-1">
                                ${dayEvents.length > 0 ? dayEvents.map(e => this.renderInspectorCard(e)).join('') : `
                                    <div class="text-center py-12 bg-dark-700/40 rounded-xl border border-slate-800/80 p-6">
                                        <div class="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 mx-auto mb-3">
                                            <i class="fas fa-clipboard-check text-xl"></i>
                                        </div>
                                        <h5 class="text-sm font-bold text-white mb-1">Zero-Defect Day Verified</h5>
                                        <p class="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                                            No critical incidents, Near Misses, or out-of-spec alarms logged for this date. Routine IPQC chemical sampling completed nominally.
                                        </p>
                                        <button onclick="QACalendar.openAddModal('${this.selectedDate}')" class="mt-4 px-4 py-2 bg-royalblue-600/30 hover:bg-royalblue-600/50 text-sky-300 border border-royalblue-500/40 font-bold text-xs rounded-xl transition-all">
                                            <i class="fas fa-plus mr-1"></i> Schedule / Log Event for this Date
                                        </button>
                                    </div>
                                `}
                            </div>
                        </div>

                        <!-- Panel Footer CTA -->
                        <div class="mt-6 pt-4 border-t border-slate-800 flex gap-3">
                            <button onclick="QACalendar.openAddModal('${this.selectedDate}')" class="flex-1 py-2.5 bg-gradient-to-r from-royalblue-600 to-sky-500 hover:from-royalblue-500 text-white rounded-xl text-xs font-bold transition-all text-center shadow">
                                <i class="fas fa-plus-circle mr-1"></i> Add Event to ${this.selectedDate.split('-')[2]} ${monthName.split(' ')[0]}
                            </button>
                            <button onclick="QACalendar.openHistoryModal()" class="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all border border-slate-700" title="Audit Trail">
                                <i class="fas fa-history"></i> Log
                            </button>
                        </div>
                    </div>
                </div>
            `;
        },

        // Generate the 35 or 42 grid cells for the current month
        generateCalendarCells: function (filteredEvents) {
            const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay(); // 0 (Sun) to 6 (Sat)
            const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
            const daysInPrevMonth = new Date(this.currentYear, this.currentMonth, 0).getDate();

            let cellsHtml = '';

            // 1. Previous Month Trailing Days (Inactive)
            for (let i = firstDay - 1; i >= 0; i--) {
                const dayNum = daysInPrevMonth - i;
                cellsHtml += `<div class="p-2 sm:p-3 rounded-xl bg-dark-700/20 text-slate-600 opacity-30 select-none cursor-default">${dayNum}</div>`;
            }

            // 2. Current Month Active Days
            for (let day = 1; day <= daysInMonth; day++) {
                const dayStr = String(day).padStart(2, '0');
                const monthStr = String(this.currentMonth + 1).padStart(2, '0');
                const dateStr = `${this.currentYear}-${monthStr}-${dayStr}`;
                const isSelected = dateStr === this.selectedDate;
                const isToday = dateStr === '2026-07-02'; // Philippines default anchor

                // Find events occurring on this date
                const evts = filteredEvents.filter(e => e.date === dateStr);
                const hasNearMiss = evts.some(e => e.category === 'nearmiss');
                const hasAccident = evts.some(e => e.category === 'accident');
                const hasImprovement = evts.some(e => e.category === 'improvement');
                const hasRoutine = evts.some(e => e.category === 'routine' || e.category === 'audit');

                // Determine styling and badge indicators
                let bgClass = "bg-slate-800/40 hover:bg-slate-700 text-slate-300";
                let borderClass = "border border-transparent hover:border-slate-600";
                let badgeIndicator = "";

                if (hasAccident) {
                    bgClass = "bg-rose-500/20 text-rose-300 font-bold";
                    borderClass = "border border-rose-500/50 shadow-[0_0_12px_rgba(244,63,94,0.25)]";
                    badgeIndicator = `<span class="block w-1.5 h-1.5 rounded-full bg-rose-500 mx-auto mt-1 animate-ping"></span>`;
                } else if (hasNearMiss) {
                    bgClass = "bg-amber-500/20 text-amber-300 font-bold";
                    borderClass = "border border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]";
                    badgeIndicator = `<span class="block w-1.5 h-1.5 rounded-full bg-amber-400 mx-auto mt-1"></span>`;
                } else if (hasImprovement) {
                    bgClass = "bg-emerald-500/20 text-emerald-300 font-bold";
                    borderClass = "border border-emerald-500/40";
                    badgeIndicator = `<span class="block w-1.5 h-1.5 rounded-full bg-emerald-400 mx-auto mt-1"></span>`;
                } else if (hasRoutine) {
                    bgClass = "bg-cyan-500/20 text-cyan-300 font-bold";
                    borderClass = "border border-cyan-500/40";
                    badgeIndicator = `<span class="block w-1.5 h-1.5 rounded-full bg-cyan-400 mx-auto mt-1"></span>`;
                }

                if (isSelected) {
                    borderClass = "border-2 border-sky-400 ring-2 ring-sky-400/40 shadow-[0_0_15px_rgba(56,189,248,0.5)]";
                }

                cellsHtml += `
                    <div onclick="QACalendar.selectDate('${dateStr}')" class="p-2 sm:p-3 rounded-xl cursor-pointer transition-all relative ${bgClass} ${borderClass}">
                        <span class="${isToday ? 'bg-royalblue-600 text-white px-1.5 py-0.5 rounded-md font-extrabold text-xs shadow' : ''}">${day}</span>
                        ${badgeIndicator}
                    </div>
                `;
            }

            // 3. Next Month Leading Days (Inactive)
            const totalCells = firstDay + daysInMonth;
            const remainingCells = (totalCells > 35 ? 42 : 35) - totalCells;
            for (let i = 1; i <= remainingCells; i++) {
                cellsHtml += `<div class="p-2 sm:p-3 rounded-xl bg-dark-700/20 text-slate-600 opacity-30 select-none cursor-default">${i}</div>`;
            }

            return cellsHtml;
        },

        // Render card inside the Daily Inspector
        renderInspectorCard: function (e) {
            const catColors = {
                nearmiss: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
                accident: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
                improvement: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
                routine: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
                audit: 'bg-sky-500/20 text-sky-300 border-sky-500/30'
            };
            const catLabels = { nearmiss: 'Near Miss', accident: 'Incident / Accident', improvement: 'Improvement', routine: 'Routine IPQC', audit: 'QA Audit' };

            return `
                <div class="p-4 bg-dark-700 rounded-xl border border-slate-800 hover:border-slate-600 transition-all flex flex-col justify-between group">
                    <div>
                        <div class="flex items-center justify-between mb-2">
                            <span class="px-2 py-0.5 rounded text-[10px] font-bold border ${catColors[e.category] || 'bg-slate-800 text-slate-300'}">
                                ${catLabels[e.category] || e.category.toUpperCase()}
                            </span>
                            <span class="text-[11px] text-slate-400 font-semibold"><i class="far fa-clock mr-1"></i>${e.time || '08:00'}</span>
                        </div>
                        <h5 onclick="QACalendar.viewDetails('${e.id}')" class="text-sm font-bold text-white hover:text-sky-400 cursor-pointer transition-colors leading-snug mb-1">
                            ${e.title}
                        </h5>
                        <p class="text-xs text-slate-300 leading-relaxed font-normal line-clamp-2 mb-3 bg-dark-500/60 p-2.5 rounded-lg border border-slate-800">
                            ${e.description}
                        </p>
                        <div class="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
                            <span><i class="fas fa-map-marker-alt text-sky-400 mr-1"></i><strong>${e.area}</strong></span>
                            <span class="text-emerald-400 font-semibold">${e.status}</span>
                        </div>
                    </div>
                    <div class="flex items-center justify-end gap-1.5 mt-3 pt-2 border-t border-slate-800">
                        <button onclick="QACalendar.viewDetails('${e.id}')" class="px-2.5 py-1 bg-slate-800 hover:bg-sky-600 hover:text-white text-sky-400 rounded-md text-[11px] font-bold transition-all flex items-center gap-1">
                            <i class="fas fa-eye"></i> View Report
                        </button>
                        <button onclick="QACalendar.openEditModal('${e.id}')" class="p-1.5 bg-slate-800 hover:bg-amber-600 hover:text-white text-amber-400 rounded-md text-[11px] transition-all" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="QACalendar.deleteEvent('${e.id}')" class="p-1.5 bg-slate-800 hover:bg-rose-600 hover:text-white text-rose-400 rounded-md text-[11px] transition-all" title="Delete">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            `;
        },

        // Render Table View (Full grid of all events)
        renderTableView: function (events) {
            const catColors = {
                nearmiss: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                accident: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
                improvement: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                routine: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
                audit: 'bg-sky-500/10 text-sky-400 border-sky-500/20'
            };
            const catLabels = { nearmiss: 'Near Miss', accident: 'Incident', improvement: 'Improvement', routine: 'Routine IPQC', audit: 'QA Audit' };

            return `
                <div class="bg-dark-500 rounded-2xl border border-slate-800 overflow-hidden shadow-xl animate-fadeIn">
                    <div class="p-4 bg-dark-700/80 border-b border-slate-800 flex items-center justify-between">
                        <span class="text-xs font-bold text-white uppercase tracking-wider"><i class="fas fa-list mr-2 text-cyan-400"></i>All Calendar Events & Incidents (${events.length})</span>
                        <span class="text-xs text-slate-400">Chronological MS Section Log</span>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-dark-700 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                    <th class="py-3.5 px-4">Event ID & Date</th>
                                    <th class="py-3.5 px-4">Classification</th>
                                    <th class="py-3.5 px-4">Title & Root Cause</th>
                                    <th class="py-3.5 px-4">Plant Area</th>
                                    <th class="py-3.5 px-4">Reporter</th>
                                    <th class="py-3.5 px-4">Status</th>
                                    <th class="py-3.5 px-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-800/80 text-xs font-medium text-slate-300">
                                ${events.length > 0 ? events.map(e => `
                                    <tr class="hover:bg-slate-800/40 transition-colors group">
                                        <td class="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                                            <span onclick="QACalendar.viewDetails('${e.id}')" class="hover:text-cyan-400 cursor-pointer underline decoration-slate-600 hover:decoration-cyan-400">${e.id}</span>
                                            <span class="block text-[10px] text-slate-500 font-normal mt-0.5"><i class="far fa-calendar mr-1"></i>${e.date} (${e.time})</span>
                                        </td>
                                        <td class="py-3.5 px-4 whitespace-nowrap">
                                            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border ${catColors[e.category] || 'bg-slate-800 text-slate-300'}">
                                                ${catLabels[e.category] || e.category.toUpperCase()}
                                            </span>
                                        </td>
                                        <td class="py-3.5 px-4 max-w-xs">
                                            <div class="font-bold text-white text-sm truncate group-hover:text-cyan-300 transition-colors" title="${e.title}">${e.title}</div>
                                            <div class="text-[11px] text-slate-400 truncate mt-0.5" title="${e.rootCause}">${e.rootCause || e.description}</div>
                                        </td>
                                        <td class="py-3.5 px-4 whitespace-nowrap font-semibold text-slate-200">${e.area}</td>
                                        <td class="py-3.5 px-4 whitespace-nowrap text-slate-400">${e.reporter.split(' ')[0]}...</td>
                                        <td class="py-3.5 px-4 whitespace-nowrap">
                                            <span class="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-800 text-emerald-400 border border-slate-700">${e.status}</span>
                                        </td>
                                        <td class="py-3.5 px-4 text-center whitespace-nowrap">
                                            <div class="inline-flex items-center gap-1">
                                                <button onclick="QACalendar.viewDetails('${e.id}')" class="p-1.5 bg-slate-800 hover:bg-cyan-600 hover:text-white text-cyan-400 rounded-lg transition-all" title="View Report">
                                                    <i class="fas fa-eye text-xs"></i>
                                                </button>
                                                <button onclick="QACalendar.openEditModal('${e.id}')" class="p-1.5 bg-slate-800 hover:bg-amber-600 hover:text-white text-amber-400 rounded-lg transition-all" title="Edit">
                                                    <i class="fas fa-edit text-xs"></i>
                                                </button>
                                                <button onclick="QACalendar.deleteEvent('${e.id}')" class="p-1.5 bg-slate-800 hover:bg-rose-600 hover:text-white text-rose-400 rounded-lg transition-all" title="Delete">
                                                    <i class="fas fa-trash-alt text-xs"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                `).join('') : `
                                    <tr>
                                        <td colspan="7" class="py-12 text-center text-slate-400 font-normal">
                                            <i class="fas fa-folder-open text-3xl text-slate-600 mb-2 block"></i>
                                            No calendar events found matching your filter or search query.
                                        </td>
                                    </tr>
                                `}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        },

        // Select a date from the calendar grid
        selectDate: function (dateStr) {
            this.selectedDate = dateStr;
            this.render();
            this.enforceSectionVisibility();
        },

        // Reset calendar to anchor today date
        resetToToday: function () {
            this.currentYear = 2026;
            this.currentMonth = 6; // July
            this.selectedDate = '2026-07-02';
            this.render();
            this.enforceSectionVisibility();
        },

        // Toggle between Split Grid and full Table View
        toggleTableView: function () {
            this.showTableView = !this.showTableView;
            this.render();
            this.enforceSectionVisibility();
        },

        handleSearch: function (val) {
            this.searchQuery = val;
            this.render();
            this.enforceSectionVisibility();
        },

        // ====================================================================
        // 3. CRUD CONTROLLERS & MODAL MANAGEMENT
        // ====================================================================

        // VIEW DETAILS MODAL
        viewDetails: function (id) {
            const e = Store.getEvents().find(item => item.id === id);
            if (!e) return;

            const modalHtml = `
                <div id="qacal-modal" class="fixed inset-0 bg-dark-900/85 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn">
                    <div class="bg-dark-500 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden flex flex-col max-h-[90vh]">
                        <!-- Header -->
                        <div class="bg-gradient-to-r from-cyan-600/30 to-royalblue-600/20 p-5 border-b border-slate-800 flex justify-between items-center">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center text-white shadow">
                                    <i class="fas fa-file-alt text-base"></i>
                                </div>
                                <div>
                                    <div class="flex items-center gap-2">
                                        <span class="text-xs font-bold text-cyan-400 uppercase tracking-wider">${e.id}</span>
                                        <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">${e.category.toUpperCase()}</span>
                                    </div>
                                    <h3 class="text-base sm:text-lg font-bold text-white truncate max-w-md">${e.title}</h3>
                                </div>
                            </div>
                            <button onclick="QACalendar.closeModal()" class="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800/50">
                                <i class="fas fa-times text-base"></i>
                            </button>
                        </div>

                        <!-- Scrollable Body -->
                        <div class="p-6 space-y-5 overflow-y-auto font-sans text-xs sm:text-sm">
                            <!-- Meta Grid -->
                            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-dark-700 rounded-xl border border-slate-800">
                                <div><span class="text-[11px] text-slate-400 block uppercase font-bold">Plant Area</span><span class="text-white font-semibold">${e.area}</span></div>
                                <div><span class="text-[11px] text-slate-400 block uppercase font-bold">Date & Time</span><span class="text-white font-semibold">${e.date} (${e.time})</span></div>
                                <div><span class="text-[11px] text-slate-400 block uppercase font-bold">Reported By</span><span class="text-white font-semibold">${e.reporter}</span></div>
                                <div><span class="text-[11px] text-slate-400 block uppercase font-bold">Status</span><span class="text-emerald-400 font-bold">${e.status}</span></div>
                            </div>

                            <!-- Root Cause Box -->
                            <div class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                                <h4 class="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                    <i class="fas fa-search"></i> Identified Root Cause / Purpose
                                </h4>
                                <p class="text-slate-200 font-normal leading-relaxed">${e.rootCause || 'No specific root cause logged.'}</p>
                            </div>

                            <!-- Description -->
                            <div>
                                <h4 class="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5"><i class="fas fa-align-left mr-1.5 text-cyan-400"></i>Event Observations & Summary</h4>
                                <p class="text-slate-300 bg-dark-700/60 p-3.5 rounded-xl border border-slate-800/80 leading-relaxed font-normal">${e.description}</p>
                            </div>

                            <!-- CAPA -->
                            <div>
                                <h4 class="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5"><i class="fas fa-shield-alt mr-1.5 text-emerald-400"></i>Corrective & Preventive Action (CAPA) Resolution</h4>
                                <p class="text-slate-300 bg-dark-700/60 p-3.5 rounded-xl border border-slate-800/80 leading-relaxed font-normal">${e.capa || 'No CAPA resolution recorded.'}</p>
                            </div>

                            <!-- Attachments -->
                            <div>
                                <h4 class="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2"><i class="fas fa-paperclip mr-1.5 text-sky-400"></i>Attached Documents & Telemetry Logs (${e.attachments ? e.attachments.length : 0})</h4>
                                ${e.attachments && e.attachments.length > 0 ? `
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        ${e.attachments.map(att => `
                                            <div class="p-2.5 bg-dark-700 rounded-xl border border-slate-800 flex items-center justify-between">
                                                <div class="flex items-center gap-2.5 truncate">
                                                    <i class="fas ${att.name.endsWith('.pdf') ? 'fa-file-pdf text-rose-400' : 'fa-file-code text-cyan-400'} text-base"></i>
                                                    <div class="truncate">
                                                        <span class="text-xs font-semibold text-white block truncate">${att.name}</span>
                                                        <span class="text-[10px] text-slate-400">${att.size}</span>
                                                    </div>
                                                </div>
                                                <button onclick="QACalendar.downloadAttachment('${att.name}')" class="p-1.5 bg-slate-800 hover:bg-cyan-600 text-cyan-400 hover:text-white rounded-lg transition-all text-xs" title="Download">
                                                    <i class="fas fa-download"></i>
                                                </button>
                                            </div>
                                        `).join('')}
                                    </div>
                                ` : '<p class="text-xs text-slate-500 italic">No files attached to this event report.</p>'}
                            </div>

                            <!-- History Timeline -->
                            ${e.history && e.history.length > 0 ? `
                                <div>
                                    <h4 class="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2"><i class="fas fa-history mr-1.5 text-amber-400"></i>Event Audit Trail</h4>
                                    <div class="space-y-2 border-l-2 border-slate-700 pl-3 ml-1">
                                        ${e.history.map(h => `
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

                        <!-- Footer -->
                        <div class="p-4 bg-dark-700/80 border-t border-slate-800 flex justify-end gap-2">
                            <button onclick="QACalendar.openEditModal('${e.id}')" class="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow transition-all">
                                <i class="fas fa-edit mr-1"></i> Edit Event
                            </button>
                            <button onclick="QACalendar.closeModal()" class="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            `;
            this.showModalHtml(modalHtml);
        },

        // ADD / EDIT FORM MODAL
        openAddModal: function (dateStr = null, category = 'routine') {
            this.renderFormModal(null, dateStr || this.selectedDate, category);
        },

        openEditModal: function (id) {
            const e = Store.getEvents().find(item => item.id === id);
            if (e) {
                this.renderFormModal(e, e.date, e.category);
            }
        },

        renderFormModal: function (eventObj = null, defaultDate = '2026-07-02', defaultCat = 'routine') {
            const isEdit = eventObj !== null;
            const e = eventObj || {
                id: 'EVT-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
                date: defaultDate,
                category: defaultCat,
                title: '',
                area: 'FNTRL Area',
                reporter: 'Engr. M. Santos (QA Lab)',
                time: new Date().toTimeString().split(' ')[0].substring(0, 5),
                status: 'In Progress',
                rootCause: '',
                description: '',
                capa: '',
                isCritical: false,
                attachments: []
            };

            const modalHtml = `
                <div id="qacal-modal" class="fixed inset-0 bg-dark-900/85 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn">
                    <div class="bg-dark-500 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden flex flex-col max-h-[90vh]">
                        <!-- Header -->
                        <div class="bg-gradient-to-r from-rose-600/30 to-amber-500/20 p-5 border-b border-slate-800 flex justify-between items-center">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-amber-500 flex items-center justify-center text-white shadow">
                                    <i class="fas ${isEdit ? 'fa-edit' : 'fa-calendar-plus'} text-base"></i>
                                </div>
                                <div>
                                    <h3 class="text-base sm:text-lg font-bold text-white">${isEdit ? 'Edit QA Event Record' : 'Schedule / Log QA Event'}</h3>
                                    <span class="text-xs text-rose-300 font-semibold block">${e.id} &bull; MS Section Calendar</span>
                                </div>
                            </div>
                            <button type="button" onclick="QACalendar.closeModal()" class="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800/50">
                                <i class="fas fa-times text-base"></i>
                            </button>
                        </div>

                        <!-- Form Body -->
                        <form onsubmit="QACalendar.handleSaveEvent(event, ${isEdit})" class="p-6 space-y-4 overflow-y-auto font-sans text-xs">
                            <input type="hidden" id="form-ev-id" value="${e.id}">
                            
                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Classification <span class="text-rose-400">*</span></label>
                                    <select id="form-ev-category" required class="w-full bg-dark-700 border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-rose-500">
                                        <option value="routine" ${e.category === 'routine' ? 'selected' : ''}>Routine IPQC Sampling</option>
                                        <option value="nearmiss" ${e.category === 'nearmiss' ? 'selected' : ''}>Near Miss (Potential Hazard)</option>
                                        <option value="accident" ${e.category === 'accident' ? 'selected' : ''}>Incident / Accident</option>
                                        <option value="improvement" ${e.category === 'improvement' ? 'selected' : ''}>For Improvement (CAPA)</option>
                                        <option value="audit" ${e.category === 'audit' ? 'selected' : ''}>QA Compliance Audit</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Plant Area <span class="text-rose-400">*</span></label>
                                    <select id="form-ev-area" required class="w-full bg-dark-700 border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-rose-500">
                                        <option value="FNTRL Area" ${e.area === 'FNTRL Area' ? 'selected' : ''}>FNTRL Area</option>
                                        <option value="MS-Dezinc Area" ${e.area === 'MS-Dezinc Area' ? 'selected' : ''}>MS-Dezinc Area</option>
                                        <option value="H2S Area" ${e.area === 'H2S Area' ? 'selected' : ''}>H2S Area</option>
                                        <option value="Limestone Area" ${e.area === 'Limestone Area' ? 'selected' : ''}>Limestone Area</option>
                                        <option value="DCS Control" ${e.area === 'DCS Control' ? 'selected' : ''}>DCS Control Room</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Status <span class="text-rose-400">*</span></label>
                                    <select id="form-ev-status" required class="w-full bg-dark-700 border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-rose-500">
                                        <option value="In Progress" ${e.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                                        <option value="Completed" ${e.status === 'Completed' ? 'selected' : ''}>Completed</option>
                                        <option value="Resolved & Monitored" ${e.status === 'Resolved & Monitored' ? 'selected' : ''}>Resolved & Monitored</option>
                                        <option value="CAPA Action Completed" ${e.status === 'CAPA Action Completed' ? 'selected' : ''}>CAPA Action Completed</option>
                                        <option value="Scheduled" ${e.status === 'Scheduled' ? 'selected' : ''}>Scheduled</option>
                                    </select>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div class="sm:col-span-1">
                                    <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Event Date <span class="text-rose-400">*</span></label>
                                    <input type="date" id="form-ev-date" required value="${e.date}" class="w-full bg-dark-700 border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-rose-500">
                                </div>
                                <div class="sm:col-span-1">
                                    <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Time (24h)</label>
                                    <input type="time" id="form-ev-time" value="${e.time}" class="w-full bg-dark-700 border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-rose-500">
                                </div>
                                <div class="sm:col-span-1">
                                    <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Reported By <span class="text-rose-400">*</span></label>
                                    <input type="text" id="form-ev-reporter" required value="${e.reporter}" placeholder="e.g., J. Reyes" class="w-full bg-dark-700 border border-slate-700 rounded-xl p-2.5 text-white placeholder-slate-500 outline-none focus:border-rose-500">
                                </div>
                            </div>

                            <div>
                                <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Event Title / Brief Summary <span class="text-rose-400">*</span></label>
                                <input type="text" id="form-ev-title" required value="${e.title}" placeholder="e.g., Slurry Pump Seal Leakage in FNTRL Cell 2" class="w-full bg-dark-700 border border-slate-700 rounded-xl p-2.5 text-white placeholder-slate-500 outline-none focus:border-rose-500">
                            </div>

                            <div>
                                <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Root Cause / Purpose</label>
                                <input type="text" id="form-ev-root" value="${e.rootCause || ''}" placeholder="Identify why this incident occurred or the purpose of the routine audit..." class="w-full bg-dark-700 border border-slate-700 rounded-xl p-2.5 text-white placeholder-slate-500 outline-none focus:border-rose-500">
                            </div>

                            <div>
                                <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Detailed Description & Observations <span class="text-rose-400">*</span></label>
                                <textarea id="form-ev-description" rows="3" required placeholder="Describe what occurred, telemetry alarm values, or inspection findings..." class="w-full bg-dark-700 border border-slate-700 rounded-xl p-2.5 text-white placeholder-slate-500 outline-none focus:border-rose-500">${e.description}</textarea>
                            </div>

                            <div>
                                <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Corrective & Preventive Action (CAPA)</label>
                                <textarea id="form-ev-capa" rows="2" placeholder="Specify corrective engineering interlocks, valve replacements, or SOP updates..." class="w-full bg-dark-700 border border-slate-700 rounded-xl p-2.5 text-white placeholder-slate-500 outline-none focus:border-rose-500">${e.capa}</textarea>
                            </div>

                            <!-- Interactivity Box: Sync to QA MS Product Hub -->
                            <div class="p-3.5 bg-gradient-to-r from-royalblue-900/40 to-sky-900/30 rounded-xl border border-sky-500/30 flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <i class="fas fa-sync-alt text-sky-400 text-lg animate-spin-slow"></i>
                                    <div>
                                        <span class="font-bold text-white text-xs block">Sync to QA MS Product Hub (qamsproduct.js)</span>
                                        <span class="text-[10px] text-slate-300">Automatically push a mirrored copy into the interactive QA MS Product database.</span>
                                    </div>
                                </div>
                                <input type="checkbox" id="form-ev-sync" checked class="w-4 h-4 rounded accent-sky-500 cursor-pointer">
                            </div>

                            <!-- Attachments Simulation -->
                            <div>
                                <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Add Attachment (Simulated File Upload)</label>
                                <div class="flex gap-2">
                                    <input type="text" id="form-ev-att-name" placeholder="Filename (e.g., Investigation_Report.pdf)" class="flex-1 bg-dark-700 border border-slate-700 rounded-xl p-2 text-white placeholder-slate-500 text-xs outline-none">
                                    <button type="button" onclick="QACalendar.addSimulatedAttachment()" class="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-rose-400 font-bold rounded-xl border border-slate-700 text-xs">
                                        <i class="fas fa-plus"></i> Attach
                                    </button>
                                </div>
                                <div id="form-ev-att-list" class="mt-2 space-y-1">
                                    ${(e.attachments || []).map(a => `
                                        <div class="flex items-center justify-between p-1.5 bg-dark-700 rounded text-[11px] text-slate-300" data-att='${JSON.stringify(a)}'>
                                            <span><i class="fas fa-paperclip text-rose-400 mr-1.5"></i>${a.name} (${a.size})</span>
                                            <button type="button" onclick="this.parentElement.remove()" class="text-rose-400 hover:text-white"><i class="fas fa-times"></i></button>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            <!-- Footer -->
                            <div class="pt-4 border-t border-slate-800 flex justify-end gap-2">
                                <button type="button" onclick="QACalendar.closeModal()" class="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all">Cancel</button>
                                <button type="submit" class="px-6 py-2.5 bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 text-white font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(244,63,94,0.3)] transition-all">
                                    <i class="fas fa-save mr-1"></i> Save Calendar Event
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
            this.showModalHtml(modalHtml);
        },

        addSimulatedAttachment: function () {
            const nameInput = document.getElementById('form-ev-att-name');
            const name = nameInput.value.trim();
            if (!name) {
                alert('Please enter a simulated filename.');
                return;
            }
            const att = {
                name: name,
                size: (Math.random() * 3 + 0.5).toFixed(1) + ' MB',
                type: name.endsWith('.csv') || name.endsWith('.json') ? 'text/csv' : 'application/pdf'
            };
            const list = document.getElementById('form-ev-att-list');
            const div = document.createElement('div');
            div.className = "flex items-center justify-between p-1.5 bg-dark-700 rounded text-[11px] text-slate-300";
            div.setAttribute('data-att', JSON.stringify(att));
            div.innerHTML = `
                <span><i class="fas fa-paperclip text-rose-400 mr-1.5"></i>${att.name} (${att.size})</span>
                <button type="button" onclick="this.parentElement.remove()" class="text-rose-400 hover:text-white"><i class="fas fa-times"></i></button>
            `;
            list.appendChild(div);
            nameInput.value = '';
        },

        handleSaveEvent: function (event, isEdit) {
            event.preventDefault();
            const id = document.getElementById('form-ev-id').value;

            // Gather attachments
            const attElements = document.querySelectorAll('#form-ev-att-list [data-att]');
            const attachments = Array.from(attElements).map(el => JSON.parse(el.getAttribute('data-att')));

            const category = document.getElementById('form-ev-category').value;
            const isCritical = category === 'nearmiss' || category === 'accident';
            const shouldSync = document.getElementById('form-ev-sync').checked;

            const eventData = {
                id: id,
                date: document.getElementById('form-ev-date').value,
                category: category,
                title: document.getElementById('form-ev-title').value.trim(),
                area: document.getElementById('form-ev-area').value,
                reporter: document.getElementById('form-ev-reporter').value.trim(),
                time: document.getElementById('form-ev-time').value || '08:00',
                status: document.getElementById('form-ev-status').value,
                rootCause: document.getElementById('form-ev-root').value.trim(),
                description: document.getElementById('form-ev-description').value.trim(),
                capa: document.getElementById('form-ev-capa').value.trim(),
                isCritical: isCritical,
                attachments: attachments
            };

            let events = Store.getEvents();
            if (isEdit) {
                const idx = events.findIndex(item => item.id === id);
                if (idx !== -1) {
                    eventData.history = events[idx].history || [];
                    eventData.history.unshift({
                        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
                        action: 'Event Updated in Calendar',
                        user: 'Current QA User'
                    });
                    events[idx] = eventData;
                    Store.addHistory(`Updated Event ${id}`, `Title: ${eventData.title}`);
                }
            } else {
                eventData.history = [{
                    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
                    action: 'Event Created in Calendar',
                    user: 'Current QA User'
                }];
                events.unshift(eventData);
                Store.addHistory(`Created Event ${id}`, `Category: ${eventData.category.toUpperCase()} on ${eventData.date}`);
            }

            Store.saveEvents(events);

            // TWO-WAY INTERACTIVITY: Check if sync to qamsproduct.js is requested
            if (shouldSync && window.QAMSProduct) {
                try {
                    const qamsRecords = JSON.parse(localStorage.getItem('QAMS_Product_Records_v1')) || [];
                    // Check if record already exists in QAMSProduct
                    const existingIdx = qamsRecords.findIndex(r => r.id === id);
                    const mirroredRecord = {
                        id: id,
                        category: category === 'routine' || category === 'audit' ? 'analysis' : category,
                        title: eventData.title,
                        area: eventData.area,
                        reporter: eventData.reporter,
                        date: eventData.date,
                        status: eventData.status === 'Completed' ? 'Approved' : 'In Progress',
                        description: `[Synced from QA Calendar] ${eventData.description}`,
                        capa: eventData.capa,
                        metricName: 'Calendar Alarm Audit',
                        metricValue: isCritical ? 'Critical Event' : 'Nominal Check',
                        metricLimit: 'Zero-Defect Limit',
                        isCompliant: !isCritical,
                        attachments: eventData.attachments,
                        history: eventData.history
                    };

                    if (existingIdx !== -1) {
                        qamsRecords[existingIdx] = mirroredRecord;
                    } else {
                        qamsRecords.unshift(mirroredRecord);
                    }
                    localStorage.setItem('QAMS_Product_Records_v1', JSON.stringify(qamsRecords));
                    // Re-render QAMSProduct module if currently active
                    if (window.QAMSProduct.render) window.QAMSProduct.render();
                    console.log(`🔄 Successfully synchronized ${id} to QA MS Product database.`);
                } catch (err) {
                    console.error('Failed to sync to QAMSProduct:', err);
                }
            }

            this.selectedDate = eventData.date; // Focus calendar on the saved date
            this.closeModal();
            this.render();
            this.enforceSectionVisibility();
            alert(`✅ Calendar Event ${id} saved successfully!${shouldSync ? ' A copy has also been synchronized to the QA MS Product portal.' : ''}`);
        },

        deleteEvent: function (id) {
            if (!confirm(`Are you sure you want to delete Event ${id} from the QA Calendar? This action cannot be undone.`)) return;

            let events = Store.getEvents();
            events = events.filter(e => e.id !== id);
            Store.saveEvents(events);
            Store.addHistory(`Deleted Event ${id}`, 'Removed from calendar storage.');
            this.render();
            this.enforceSectionVisibility();
            alert(`🗑️ Event ${id} removed from the calendar schedule.`);
        },

        // ====================================================================
        // 4. AUDIT TRAIL & HISTORY LOG MODAL
        // ====================================================================
        openHistoryModal: function () {
            const history = Store.getHistory();
            const modalHtml = `
                <div id="qacal-modal" class="fixed inset-0 bg-dark-900/85 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn">
                    <div class="bg-dark-500 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden flex flex-col max-h-[85vh]">
                        <!-- Header -->
                        <div class="bg-gradient-to-r from-amber-500/20 to-rose-500/10 p-5 border-b border-slate-800 flex justify-between items-center">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow">
                                    <i class="fas fa-history text-base"></i>
                                </div>
                                <div>
                                    <h3 class="text-base sm:text-lg font-bold text-white">Calendar System Audit Trail</h3>
                                    <span class="text-xs text-amber-300 font-semibold block">Chronological Operational Tracking</span>
                                </div>
                            </div>
                            <button onclick="QACalendar.closeModal()" class="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800/50">
                                <i class="fas fa-times text-base"></i>
                            </button>
                        </div>

                        <!-- Body -->
                        <div class="p-6 overflow-y-auto space-y-3 font-sans text-xs">
                            ${history.length > 0 ? history.map(h => `
                                <div class="p-3 bg-dark-700 rounded-xl border border-slate-800/80 flex items-start justify-between gap-4">
                                    <div class="flex items-start gap-3">
                                        <i class="fas fa-check-circle text-cyan-400 mt-0.5"></i>
                                        <div>
                                            <div class="font-bold text-white">${h.action}</div>
                                            <div class="text-[11px] text-slate-400 mt-0.5">${h.details || 'No additional notes recorded.'}</div>
                                        </div>
                                    </div>
                                    <div class="text-right whitespace-nowrap">
                                        <span class="text-[10px] text-slate-500 block font-semibold">${h.timestamp}</span>
                                        <span class="text-[10px] text-cyan-400 font-bold">${h.user}</span>
                                    </div>
                                </div>
                            `).join('') : '<p class="text-center text-slate-500 py-6">No audit history recorded yet.</p>'}
                        </div>

                        <!-- Footer -->
                        <div class="p-4 bg-dark-700/80 border-t border-slate-800 flex justify-end">
                            <button onclick="QACalendar.closeModal()" class="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all">Close Log</button>
                        </div>
                    </div>
                </div>
            `;
            this.showModalHtml(modalHtml);
        },

        // ====================================================================
        // 5. AUTOMATED UPLOAD & AI HAZARD CLUSTER ANALYSIS ENGINE
        // ====================================================================
        openUploadModal: function () {
            const modalHtml = `
                <div id="qacal-modal" class="fixed inset-0 bg-dark-900/85 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn">
                    <div class="bg-dark-500 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden flex flex-col">
                        <!-- Header -->
                        <div class="bg-gradient-to-r from-cyan-600/20 to-royalblue-600/10 p-5 border-b border-slate-800 flex justify-between items-center">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow">
                                    <i class="fas fa-cloud-upload-alt text-base"></i>
                                </div>
                                <div>
                                    <h3 class="text-base sm:text-lg font-bold text-white">Upload & Analyze QA Event Logs</h3>
                                    <span class="text-xs text-cyan-300 font-semibold block">AI Hazard Cluster Detection Engine</span>
                                </div>
                            </div>
                            <button onclick="QACalendar.closeModal()" class="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800/50">
                                <i class="fas fa-times text-base"></i>
                            </button>
                        </div>

                        <!-- Body -->
                        <div class="p-6 space-y-4 font-sans text-xs">
                            <p class="text-slate-300 leading-relaxed">
                                Upload a JSON or CSV file containing plant incident logs or scheduled IPQC sampling batches. The AI engine will analyze the timestamps to detect **Hazard Clusters** (multiple incidents occurring on the same date or plant sector) before importing.
                            </p>

                            <!-- Drop zone -->
                            <label class="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-2xl p-8 bg-dark-700/50 cursor-pointer transition-all group">
                                <i class="fas fa-file-import text-4xl text-slate-500 group-hover:text-cyan-400 mb-3 transition-colors"></i>
                                <span class="font-bold text-white text-sm">Click to select file or drag & drop</span>
                                <span class="text-[11px] text-slate-400 mt-1">Supports .JSON or .CSV QA Calendar Exports</span>
                                <input type="file" accept=".json,.csv" onchange="QACalendar.handleFileUpload(this)" class="hidden">
                            </label>

                            <!-- Demo Test -->
                            <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                                <span class="text-[11px] text-slate-400">Want to test the algorithm?</span>
                                <button type="button" onclick="QACalendar.runSimulatedAIAnalysis()" class="px-3.5 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold rounded-xl transition-all flex items-center gap-1.5">
                                    <i class="fas fa-magic"></i> Run AI Cluster Test
                                </button>
                            </div>
                        </div>

                        <!-- Footer -->
                        <div class="p-4 bg-dark-700/80 border-t border-slate-800 flex justify-end">
                            <button onclick="QACalendar.closeModal()" class="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all">Cancel</button>
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
                        const lines = content.split('\n');
                        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
                        for (let i = 1; i < lines.length; i++) {
                            if (!lines[i].trim()) continue;
                            const vals = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
                            let obj = {};
                            headers.forEach((h, idx) => obj[h] = vals[idx] || '');
                            parsedData.push(obj);
                        }
                    }
                    this.analyzeAndDisplayReport(parsedData, file.name);
                } catch (err) {
                    alert('Error parsing uploaded file. Ensure valid JSON or CSV formatting.');
                    console.error(err);
                }
            };
            reader.readAsText(file);
        },

        runSimulatedAIAnalysis: function () {
            // Simulated dataset containing a "Hazard Cluster" (2 incidents on July 10 in FNTRL)
            const sampleBatch = [
                { date: '2026-07-10', category: 'nearmiss', title: 'FNTRL Flocculant Dosing Surge', area: 'FNTRL Area', reporter: 'Engr. M. Santos', description: 'Transient dosing surge detected.', isCritical: true },
                { date: '2026-07-10', category: 'accident', title: 'FNTRL Slurry Valve #102 Jam', area: 'FNTRL Area', reporter: 'D. Cruz', description: 'Mechanical jam caused localized slurry backup.', isCritical: true }, // CLUSTER!
                { date: '2026-07-18', category: 'routine', title: 'Dezinc Solvent Extraction Titration', area: 'MS-Dezinc Area', reporter: 'R. Gomez', description: 'Phase separation time verified nominal.', isCritical: false },
                { date: '2026-07-22', category: 'improvement', title: 'H2S Gas Sensor Recalibration Schedule', area: 'H2S Area', reporter: 'J. Reyes', description: 'Monthly zero-point drift adjustment.', isCritical: false }
            ];
            this.analyzeAndDisplayReport(sampleBatch, 'Simulated_QA_Incident_Batch_0710.json');
        },

        analyzeAndDisplayReport: function (dataset, filename) {
            const total = dataset.length;
            const criticalCount = dataset.filter(d => d.isCritical === true || d.isCritical === 'true' || d.category === 'accident' || d.category === 'nearmiss').length;

            // AI HAZARD CLUSTER ALGORITHM: Detect days with > 1 critical event or multiple events in same area
            const dateMap = {};
            const areaMap = {};
            dataset.forEach(d => {
                const dt = d.date || '2026-07-02';
                const ar = d.area || 'FNTRL Area';
                dateMap[dt] = (dateMap[dt] || 0) + 1;
                areaMap[ar] = (areaMap[ar] || 0) + 1;
            });

            const clusterDates = Object.keys(dateMap).filter(k => dateMap[k] > 1);
            const highRiskAreas = Object.keys(areaMap).filter(k => areaMap[k] >= 2);
            const safetyScore = total > 0 ? ((1 - (criticalCount / (total * 2))) * 100).toFixed(1) : '100.0';

            const reportHtml = `
                <div id="qacal-modal" class="fixed inset-0 bg-dark-900/85 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn">
                    <div class="bg-dark-500 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden flex flex-col max-h-[90vh]">
                        <!-- Header -->
                        <div class="bg-gradient-to-r from-cyan-600/30 to-royalblue-600/20 p-5 border-b border-slate-800 flex justify-between items-center">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center text-white shadow animate-bounce">
                                    <i class="fas fa-brain text-base"></i>
                                </div>
                                <div>
                                    <h3 class="text-base sm:text-lg font-bold text-white">AI Calendar Hazard Analysis Report</h3>
                                    <span class="text-xs text-cyan-300 font-semibold block">File Analyzed: ${filename}</span>
                                </div>
                            </div>
                            <button onclick="QACalendar.closeModal()" class="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800/50">
                                <i class="fas fa-times text-base"></i>
                            </button>
                        </div>

                        <!-- Scrollable Body -->
                        <div class="p-6 space-y-5 overflow-y-auto font-sans text-xs sm:text-sm">
                            <!-- Safety Score Banner -->
                            <div class="p-4 rounded-xl bg-dark-700 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div class="text-center sm:text-left">
                                    <span class="text-[11px] font-bold text-slate-400 uppercase block">Algorithmic Zero-Defect Safety Score</span>
                                    <span class="text-3xl font-black ${safetyScore >= 85 ? 'text-emerald-400' : 'text-amber-400'}">${safetyScore}%</span>
                                    <span class="text-xs text-slate-300 block mt-0.5">${criticalCount} Critical Alarms in ${total} Logged Events</span>
                                </div>
                                <div class="w-full sm:w-48 bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700">
                                    <div class="bg-gradient-to-r ${safetyScore >= 85 ? 'from-sky-400 to-emerald-400' : 'from-amber-400 to-rose-500'} h-full" style="width: ${safetyScore}%"></div>
                                </div>
                            </div>

                            <!-- Hazard Cluster Warning Box -->
                            <div>
                                <h4 class="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <i class="fas ${clusterDates.length > 0 ? 'fa-exclamation-triangle text-amber-400 animate-pulse' : 'fa-check-circle text-emerald-400'}"></i>
                                    Detected Operational Hazard Clusters (${clusterDates.length})
                                </h4>
                                ${clusterDates.length > 0 ? `
                                    <div class="space-y-2">
                                        ${clusterDates.map(dt => `
                                            <div class="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start justify-between gap-3">
                                                <div>
                                                    <span class="font-bold text-white block">Date Cluster: ${dt}</span>
                                                    <span class="text-xs text-amber-300 mt-1 block">
                                                        <strong>${dateMap[dt]} independent events</strong> detected on this single operational date. Potential localized plant disturbance or maintenance turnover overlap.
                                                    </span>
                                                </div>
                                                <span class="px-2 py-0.5 rounded bg-amber-500 text-dark-900 font-extrabold text-[10px] uppercase whitespace-nowrap">High Traffic</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                    <div class="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl mt-3 text-xs text-rose-300">
                                        <i class="fas fa-exclamation-circle mr-1.5"></i> <strong>AI Recommendation:</strong> High-risk cluster detected in <strong>${highRiskAreas.join(', ')}</strong>. Recommend dispatching field QA supervisors to conduct localized mechanical integrity audits.
                                    </div>
                                ` : `
                                    <div class="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center text-emerald-300 font-semibold text-xs">
                                        <i class="fas fa-shield-check text-2xl mb-1 block text-emerald-400"></i>
                                        No overlapping hazard clusters detected. Operational events are cleanly distributed across the plant schedule!
                                    </div>
                                `}
                            </div>
                        </div>

                        <!-- Footer -->
                        <div class="p-4 bg-dark-700/80 border-t border-slate-800 flex justify-end gap-2">
                            <button onclick="QACalendar.importAnalyzedBatch(${JSON.stringify(dataset).replace(/"/g, '&quot;')})" class="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-royalblue-600 hover:from-cyan-500 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5">
                                <i class="fas fa-file-import"></i> Import Analyzed Events into Schedule
                            </button>
                            <button onclick="QACalendar.closeModal()" class="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all">Discard</button>
                        </div>
                    </div>
                </div>
            `;
            this.showModalHtml(reportHtml);
        },

        importAnalyzedBatch: function (dataset) {
            let events = Store.getEvents();
            let count = 0;
            dataset.forEach(d => {
                const newEv = {
                    id: 'EVT-IMP-' + Math.floor(1000 + Math.random() * 9000),
                    date: d.date || '2026-07-02',
                    category: d.category || 'routine',
                    title: d.title || 'Imported QA Event',
                    area: d.area || 'FNTRL Area',
                    reporter: d.reporter || 'AI Batch Analyst',
                    time: d.time || '09:00',
                    status: d.category === 'accident' || d.category === 'nearmiss' ? 'In Progress' : 'Completed',
                    rootCause: d.rootCause || 'Identified during automated upload analysis.',
                    description: d.description || 'Imported via QA Calendar AI Cluster Detection Engine.',
                    capa: d.capa || (d.category === 'accident' || d.category === 'nearmiss' ? 'AI CAPA investigation workflow initiated.' : 'Nominal routine check.'),
                    isCritical: d.isCritical === true || d.isCritical === 'true' || d.category === 'accident' || d.category === 'nearmiss',
                    attachments: [],
                    history: [{ timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16), action: 'Imported via Upload Engine', user: 'System AI' }]
                };
                events.unshift(newEv);
                count++;
            });
            Store.saveEvents(events);
            Store.addHistory(`Imported Batch of ${count} events`, 'Automated AI Cluster tool import.');
            this.closeModal();
            this.render();
            this.enforceSectionVisibility();
            alert(`✅ Successfully imported ${count} analyzed events into the QA Calendar schedule!`);
        },

        // ====================================================================
        // 6. UTILITIES: EXPORT, DOWNLOADS & MODAL INJECTION
        // ====================================================================
        exportToCSV: function () {
            const events = Store.getEvents();
            if (events.length === 0) {
                alert('No events available to export.');
                return;
            }
            const headers = ['Event ID', 'Date', 'Time', 'Category', 'Title', 'Area', 'Reporter', 'Status', 'Root Cause', 'Critical'];
            const rows = events.map(e => [
                e.id, e.date, e.time || '08:00', e.category, `"${e.title.replace(/"/g, '""')}"`, e.area, `"${e.reporter}"`, e.status,
                `"${(e.rootCause || '').replace(/"/g, '""')}"`, e.isCritical ? 'Yes' : 'No'
            ]);

            let csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `QAMS_Calendar_Export_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            Store.addHistory('Exported CSV Schedule', `Exported ${events.length} events.`);
        },

        downloadAttachment: function (filename) {
            alert(`[SIMULATED SECURE DOWNLOAD]\n\nRetrieving file: ${filename}\nStatus: Decrypting document from MS Section Storage Server... Complete!`);
            Store.addHistory('Downloaded Attachment', `File: ${filename}`);
        },

        showModalHtml: function (html) {
            this.closeModal();
            const div = document.createElement('div');
            div.innerHTML = html;
            document.body.appendChild(div.firstElementChild);
            document.body.classList.add('overflow-hidden');
        },

        closeModal: function () {
            const modal = document.getElementById('qacal-modal');
            if (modal) {
                modal.remove();
                document.body.classList.remove('overflow-hidden');
            }
        }
    };

    // Secure global export to prevent legacy script overrides
    try {
        window.QACalendar = QACalendar;
        Object.defineProperty(window, 'QACalendar', { value: QACalendar, writable: false, configurable: false });
    } catch (err) {
        window.QACalendar = QACalendar;
    }

    window.addEventListener('DOMContentLoaded', () => {
        QACalendar.init();
    });

})(window, document);
