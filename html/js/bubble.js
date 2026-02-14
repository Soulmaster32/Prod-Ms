/**
 * Filename: bubble.js
 * Description: Audit Module Extension - Inline Tabs within Header
 * Design: Tabs sit to the right of the Title. Dynamic Action Button on the right.
 */

const QMExtension = (() => {
    const EXT_STORE_KEY = 'QM_EXT_DATA_V3';
    
    // State
    let state = {
        activeTab: 'findings', // findings | claims | schedule
        externalClaims: [
            { id: 1, date: '2026-02-10', customer: 'Global Foods Inc', batch: 'B-9921', issue: 'Packaging Seal Failure', status: 'Open', action: 'Investigating Sealer #3' }
        ],
        auditSchedule: [
            { id: 1, month: 'January', area: 'Raw Material Warehouse', auditor: 'Sarah J.', status: 'Completed', score: '98%' },
            { id: 2, month: 'February', area: 'Production Line 1', auditor: 'Mike T.', status: 'Scheduled', score: '-' }
        ]
    };

    const init = () => {
        loadData();
        // Delay slightly to ensure main App DOM is ready
        setTimeout(() => {
            transformUI();
            renderActiveTab();
        }, 200);
    };

    const loadData = () => {
        const saved = localStorage.getItem(EXT_STORE_KEY);
        if(saved) try { state = { ...state, ...JSON.parse(saved) }; } catch(e) {}
    };

    const saveData = () => {
        const toSave = { externalClaims: state.externalClaims, auditSchedule: state.auditSchedule };
        localStorage.setItem(EXT_STORE_KEY, JSON.stringify(toSave));
    };

    // --- UI TRANSFORMATION ---
    const transformUI = () => {
        const container = document.getElementById('section-audit');
        if (!container || container.dataset.extended === "true") return;
        container.dataset.extended = "true";

        // 1. Get Elements
        const originalHeader = container.querySelector('.border-b'); // The existing header row
        const originalTableContainer = container.querySelector('.flex-1'); // The existing table div
        
        // 2. Hide Original Header (We replace it to control the layout perfectly)
        if(originalHeader) originalHeader.classList.add('hidden');

        // 3. Create New Header
        const newHeader = document.createElement('div');
        newHeader.className = "p-4 border-b border-white/10 flex flex-wrap justify-between items-center gap-4 bg-slate-950/20 rounded-t-xl";
        newHeader.innerHTML = `
            <div class="flex items-center gap-6">
                <h3 class="font-header text-lg text-white whitespace-nowrap">
                    <i class="fas fa-search text-gold-400 mr-2"></i>Audit
                </h3>
                
                <!-- INLINE TABS -->
                <div class="flex items-center gap-1 bg-slate-900/50 rounded-lg p-1 border border-white/5">
                    <button onclick="QMExtension.switchTab('findings')" id="tab-btn-findings" class="px-3 py-1 text-xs font-bold rounded transition-all text-gold-400 bg-white/10 shadow">Findings</button>
                    <button onclick="QMExtension.switchTab('claims')" id="tab-btn-claims" class="px-3 py-1 text-xs font-bold rounded transition-all text-slate-500 hover:text-slate-300">Ext. Claims</button>
                    <button onclick="QMExtension.switchTab('schedule')" id="tab-btn-schedule" class="px-3 py-1 text-xs font-bold rounded transition-all text-slate-500 hover:text-slate-300">Schedule</button>
                </div>
            </div>

            <!-- DYNAMIC ACTION BUTTON AREA -->
            <div id="ext-action-area">
                <!-- Injected via JS -->
            </div>
        `;
        
        container.insertBefore(newHeader, container.firstChild);

        // 4. Wrap Content Areas
        // Findings (Original)
        originalTableContainer.id = "view-findings";
        originalTableContainer.classList.add('transition-opacity', 'duration-300');

        // Claims (New)
        const viewClaims = document.createElement('div');
        viewClaims.id = "view-claims";
        viewClaims.className = "flex-1 overflow-x-auto custom-scroll hidden p-1";
        viewClaims.innerHTML = `<table class="w-full text-left border-collapse glass-table min-w-[800px]">
            <thead>
                <tr>
                    <th class="p-3 w-24">Date</th>
                    <th class="p-3">Customer</th>
                    <th class="p-3">Issue</th>
                    <th class="p-3">Status</th>
                    <th class="p-3 text-right">Action</th>
                </tr>
            </thead>
            <tbody id="extClaimsBody"></tbody>
        </table>`;
        container.appendChild(viewClaims);

        // Schedule (New)
        const viewSchedule = document.createElement('div');
        viewSchedule.id = "view-schedule";
        viewSchedule.className = "flex-1 overflow-x-auto custom-scroll hidden p-1";
        viewSchedule.innerHTML = `<table class="w-full text-left border-collapse glass-table min-w-[600px]">
            <thead>
                <tr>
                    <th class="p-3">Month</th>
                    <th class="p-3 w-1/3">Area</th>
                    <th class="p-3">Auditor</th>
                    <th class="p-3">Status</th>
                    <th class="p-3 text-right">Score</th>
                    <th class="p-3 text-right"></th>
                </tr>
            </thead>
            <tbody id="auditScheduleBody"></tbody>
        </table>`;
        container.appendChild(viewSchedule);
    };

    // --- LOGIC ---
    const switchTab = (tabId) => {
        state.activeTab = tabId;
        renderActiveTab();
    };

    const renderActiveTab = () => {
        // 1. Update Buttons
        ['findings', 'claims', 'schedule'].forEach(t => {
            const btn = document.getElementById(`tab-btn-${t}`);
            const view = document.getElementById(`view-${t}`);
            
            if (t === state.activeTab) {
                // Active Style
                btn.className = "px-3 py-1 text-xs font-bold rounded transition-all text-gold-400 bg-slate-800 shadow-neon border border-gold-500/20";
                view.classList.remove('hidden');
            } else {
                // Inactive Style
                btn.className = "px-3 py-1 text-xs font-bold rounded transition-all text-slate-500 hover:text-slate-300 hover:bg-white/5";
                view.classList.add('hidden');
            }
        });

        // 2. Render Data if needed
        if(state.activeTab === 'claims') renderClaimsTable();
        if(state.activeTab === 'schedule') renderScheduleTable();

        // 3. Update Action Button
        updateActionButton();
    };

    const updateActionButton = () => {
        const container = document.getElementById('ext-action-area');
        if(state.activeTab === 'findings') {
            // Call original App function
            container.innerHTML = `
                <button onclick="App.openAuditModal('add')" class="bg-gold-500 hover:bg-gold-400 text-slate-900 font-bold py-1.5 px-4 rounded shadow-lg transition-transform hover:-translate-y-0.5 text-xs">
                    <i class="fas fa-plus mr-1"></i> New Finding
                </button>`;
        } else if(state.activeTab === 'claims') {
            container.innerHTML = `
                <button onclick="QMExtension.addClaim()" class="bg-red-500 hover:bg-red-600 text-white font-bold py-1.5 px-4 rounded shadow-lg transition-transform hover:-translate-y-0.5 text-xs">
                    <i class="fas fa-plus mr-1"></i> Log Claim
                </button>`;
        } else if(state.activeTab === 'schedule') {
            container.innerHTML = `
                <div class="flex gap-2">
                    <button onclick="window.print()" class="text-xs bg-slate-800 border border-white/10 p-2 rounded text-slate-300 hover:text-white"><i class="fas fa-print"></i></button>
                    <button onclick="QMExtension.addSchedule()" class="bg-blue-600 hover:bg-blue-500 text-white font-bold py-1.5 px-4 rounded shadow-lg transition-transform hover:-translate-y-0.5 text-xs">
                        <i class="fas fa-plus mr-1"></i> Add Schedule
                    </button>
                </div>`;
        }
    };

    // --- RENDER TABLES ---
    const renderClaimsTable = () => {
        const tbody = document.getElementById('extClaimsBody');
        tbody.innerHTML = state.externalClaims.length ? state.externalClaims.map(c => `
            <tr class="hover:bg-white/5 transition-colors border-b border-white/5">
                <td class="p-3 text-slate-400 text-xs">${c.date}</td>
                <td class="p-3 font-bold text-slate-200">${c.customer} <div class="text-[10px] text-slate-500">${c.batch}</div></td>
                <td class="p-3 text-sm text-slate-300">${c.issue}</td>
                <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase ${c.status === 'Open' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}">${c.status}</span></td>
                <td class="p-3 text-right"><button onclick="QMExtension.deleteItem('externalClaims', ${c.id})" class="text-slate-600 hover:text-red-400"><i class="fas fa-trash"></i></button></td>
            </tr>
        `).join('') : `<tr><td colspan="5" class="p-6 text-center text-slate-600 italic text-xs">No claims found.</td></tr>`;
    };

    const renderScheduleTable = () => {
        const tbody = document.getElementById('auditScheduleBody');
        tbody.innerHTML = state.auditSchedule.length ? state.auditSchedule.map(s => `
            <tr class="hover:bg-white/5 transition-colors border-b border-white/5">
                <td class="p-3 font-header text-slate-300 text-sm">${s.month}</td>
                <td class="p-3 text-sm text-slate-200">${s.area}</td>
                <td class="p-3 text-xs text-slate-400"><i class="fas fa-user-circle mr-1"></i>${s.auditor}</td>
                <td class="p-3 text-xs font-bold uppercase ${s.status === 'Completed' ? 'text-green-400' : 'text-blue-400'}">${s.status}</td>
                <td class="p-3 text-right font-mono font-bold text-gold-400">${s.score}</td>
                <td class="p-3 text-right"><button onclick="QMExtension.deleteItem('auditSchedule', ${s.id})" class="text-slate-600 hover:text-red-400"><i class="fas fa-trash"></i></button></td>
            </tr>
        `).join('') : `<tr><td colspan="6" class="p-6 text-center text-slate-600 italic text-xs">Schedule is empty.</td></tr>`;
    };

    // --- ACTIONS ---
    const addClaim = () => {
        const c = prompt("Customer Name:"); if(!c) return;
        state.externalClaims.push({ id: Date.now(), date: new Date().toISOString().split('T')[0], customer: c, batch: 'B-'+Math.floor(Math.random()*999), issue: prompt("Issue:")||'N/A', status: 'Open' });
        saveData(); renderActiveTab();
    };

    const addSchedule = () => {
        const a = prompt("Area to Audit:"); if(!a) return;
        state.auditSchedule.push({ id: Date.now(), month: 'Next Month', area: a, auditor: 'Admin', status: 'Scheduled', score: '-' });
        saveData(); renderActiveTab();
    };

    const deleteItem = (key, id) => {
        if(confirm("Delete item?")) {
            state[key] = state[key].filter(x => x.id !== id);
            saveData(); renderActiveTab();
        }
    };

    return { init, switchTab, addClaim, addSchedule, deleteItem };
})();

document.addEventListener('DOMContentLoaded', QMExtension.init);