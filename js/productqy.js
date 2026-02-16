/* 
   Filename: productqy.js
   Description: Product Quality Module - Data Entry, Charting, and Trend Analysis
   Version: 2.1 (Enhanced)
*/

const QualityExt = (() => {
    const STORE_KEY = 'QM_EXT_QUALITY_V3';
    
    // State
    let state = {
        selectedDate: new Date().toISOString().split('T')[0],
        currentMonth: new Date(),
        data: [] 
    };

    const ICONS = {
        save: '<i class="fas fa-save"></i>',
        trash: '<i class="fas fa-trash"></i>',
        edit: '<i class="fas fa-edit"></i>',
        close: '<i class="fas fa-times"></i>',
        flask: '<i class="fas fa-flask"></i>',
        up: '<i class="fas fa-caret-up"></i>',
        down: '<i class="fas fa-caret-down"></i>',
        flat: '<i class="fas fa-minus"></i>'
    };

    // --- INITIALIZATION ---
    const init = () => {
        loadData();
        injectStyles();
        injectUI();
        renderSummaryTable();
        renderCalendar();
        // Wait for Chart instance to be available
        setTimeout(updateMainChart, 800); 
    };

    const loadData = () => {
        const saved = localStorage.getItem(STORE_KEY);
        if (saved) {
            try { state.data = JSON.parse(saved); } catch (e) { console.error("Extension Data Load Error"); }
        } else {
            // Seed Data
            state.data = [
                { id: 1705276800000, date: '2026-01-15', target: 92.5, zn: 1.2, mg: 0.5, ps: 120, h2o: 5.0 },
                { id: 1707955200000, date: '2026-02-10', target: 94.0, zn: 1.4, mg: 0.6, ps: 110, h2o: 4.8 },
                { id: 1710460800000, date: '2026-03-05', target: 96.0, zn: 1.1, mg: 0.4, ps: 115, h2o: 3.5 }
            ];
        }
    };

    const saveData = () => {
        localStorage.setItem(STORE_KEY, JSON.stringify(state.data));
        renderSummaryTable(); 
        renderCalendar();     
        renderModalTable();
        updateMainChart();
    };

    // --- DOM INJECTION ---
    const injectStyles = () => {
        if(document.getElementById('pq-styles')) return;
        const style = document.createElement('style');
        style.id = 'pq-styles';
        style.innerHTML = `
            .pq-calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
            .pq-day { aspect-ratio: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; border-radius: 6px; font-size: 0.8rem; position: relative; transition: all 0.2s; border: 1px solid transparent; }
            .pq-day:hover { background: rgba(255, 255, 255, 0.1); }
            .pq-day.active { background: rgba(250, 204, 21, 0.2); border-color: #facc15; color: #facc15; font-weight: bold; }
            .pq-day.has-data::after { content: ''; width: 4px; height: 4px; background: #facc15; border-radius: 50%; position: absolute; bottom: 4px; }
            .pq-day.text-muted { color: #475569; pointer-events: none; }
            .pq-input { background: #0f172a; border: 1px solid rgba(255,255,255,0.1); color: white; padding: 0.5rem; border-radius: 0.375rem; width: 100%; font-size: 0.875rem; transition: border-color 0.2s; }
            .pq-input:focus { outline: none; border-color: #facc15; background: #1e293b; }
            .trend-up { color: #4ade80; } 
            .trend-down { color: #f87171; }
            .trend-flat { color: #94a3b8; }
        `;
        document.head.appendChild(style);
    };

    const injectUI = () => {
        const sectionHeader = $('#section-product').find('.flex.justify-between');
        if (sectionHeader.find('#btnManageData').length === 0) {
            const btnHtml = `
                <button id="btnManageData" onclick="QualityExt.openModal()" class="ml-auto mr-4 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-gold-400 border border-gold-500/30 text-xs font-bold py-1.5 px-3 rounded shadow transition-all flex items-center gap-2">
                    ${ICONS.flask} Lab Data
                </button>
            `;
            sectionHeader.find('span').before(btnHtml); 
        }

        if ($('#pqSummarySection').length === 0) {
            const summaryHtml = `
                <div id="pqSummarySection" class="mt-6 border-t border-white/10 pt-4">
                    <div class="flex justify-between items-end mb-3">
                        <h4 class="text-xs font-header text-slate-400 uppercase tracking-wider">Latest Lab Results</h4>
                        <span class="text-[10px] text-slate-500 italic">*Arrows indicate trend vs previous entry</span>
                    </div>
                    <div class="overflow-x-auto rounded-lg border border-white/5">
                        <table class="w-full text-left border-collapse glass-table text-xs">
                            <thead>
                                <tr class="bg-slate-900/50">
                                    <th class="p-2 text-slate-400">Date</th>
                                    <th class="p-2 text-gold-400">Target %</th>
                                    <th class="p-2 text-green-400">ZN <span class="text-[9px] text-slate-500">(ppm)</span></th>
                                    <th class="p-2 text-orange-400">MG <span class="text-[9px] text-slate-500">(ppm)</span></th>
                                    <th class="p-2 text-blue-400">H2O <span class="text-[9px] text-slate-500">(%)</span></th>
                                    <th class="p-2 text-center text-slate-300">Status</th>
                                </tr>
                            </thead>
                            <tbody id="pqSummaryBody"></tbody>
                        </table>
                    </div>
                </div>
            `;
            $('#section-product').append(summaryHtml);
        }

        if ($('#pqModal').length === 0) {
            // Modal HTML (Condensed)
            const modalHtml = `
                <div id="pqModal" class="fixed inset-0 z-[110] hidden items-center justify-center">
                    <div class="absolute inset-0 bg-black/80 backdrop-blur-md" onclick="QualityExt.closeModal()"></div>
                    <div class="relative bg-slate-900 border border-gold-500/30 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-bounce-slow" style="animation: none;">
                        <div class="bg-slate-950 p-4 border-b border-white/10 flex justify-between items-center">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 rounded bg-gold-500/10 flex items-center justify-center text-gold-400 border border-gold-500/20">${ICONS.flask}</div>
                                <div>
                                    <h3 class="font-header text-lg text-white leading-none">Product Quality Log</h3>
                                    <span class="text-[10px] text-slate-500">Manage daily lab analysis records</span>
                                </div>
                            </div>
                            <button onclick="QualityExt.closeModal()" class="text-slate-400 hover:text-white text-xl transition-colors">${ICONS.close}</button>
                        </div>
                        <div class="flex flex-col md:flex-row h-full overflow-hidden">
                            <!-- Sidebar -->
                            <div class="w-full md:w-1/3 bg-slate-900/50 p-5 border-r border-white/5 overflow-y-auto custom-scroll flex flex-col gap-5">
                                <div class="bg-slate-800/50 rounded-lg p-4 border border-white/5 shadow-inner">
                                    <div class="flex justify-between items-center mb-4">
                                        <button onclick="QualityExt.changeMonth(-1)" class="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 text-slate-400"><i class="fas fa-chevron-left"></i></button>
                                        <span id="pqCalTitle" class="font-header text-gold-400 tracking-wide text-sm"></span>
                                        <button onclick="QualityExt.changeMonth(1)" class="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 text-slate-400"><i class="fas fa-chevron-right"></i></button>
                                    </div>
                                    <div class="grid grid-cols-7 gap-1 text-center text-[10px] text-slate-500 font-bold mb-2">
                                        <div>SU</div><div>MO</div><div>TU</div><div>WE</div><div>TH</div><div>FR</div><div>SA</div>
                                    </div>
                                    <div id="pqCalendarGrid" class="pq-calendar-grid"></div>
                                </div>
                                <form id="pqForm" class="bg-slate-800/50 rounded-lg p-4 border border-white/5 space-y-3 shadow-lg">
                                    <input type="hidden" id="pqId">
                                    <div class="flex justify-between items-center border-b border-white/5 pb-2 mb-2">
                                        <span class="text-xs font-bold text-white uppercase">Data Entry</span>
                                        <span id="pqSelectedDateDisplay" class="text-xs text-gold-400 font-mono bg-gold-500/10 px-2 py-0.5 rounded"></span>
                                    </div>
                                    <div><label class="text-[10px] text-slate-400 uppercase font-bold">Target (%)</label><input type="number" step="0.01" id="pqTarget" class="pq-input" placeholder="90.00 - 100.00"></div>
                                    <div class="grid grid-cols-2 gap-3">
                                        <div><label class="text-[10px] text-green-400 uppercase font-bold">ZN (ppm)</label><input type="number" step="0.01" id="pqZn" class="pq-input"></div>
                                        <div><label class="text-[10px] text-orange-400 uppercase font-bold">MG (ppm)</label><input type="number" step="0.01" id="pqMg" class="pq-input"></div>
                                        <div><label class="text-[10px] text-slate-400 uppercase font-bold">PS (Particle)</label><input type="number" step="0.01" id="pqPs" class="pq-input"></div>
                                        <div><label class="text-[10px] text-blue-400 uppercase font-bold">H2O (%)</label><input type="number" step="0.01" id="pqH2o" class="pq-input"></div>
                                    </div>
                                    <div class="pt-2 flex gap-2">
                                        <button type="button" onclick="QualityExt.saveEntry()" class="flex-1 bg-gold-600 hover:bg-gold-500 text-slate-900 font-bold py-2 rounded text-xs transition-colors shadow-lg">${ICONS.save} Save</button>
                                        <button type="button" onclick="QualityExt.resetForm()" class="px-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-xs transition-colors">Clear</button>
                                    </div>
                                </form>
                            </div>
                            <!-- Table -->
                            <div class="w-full md:w-2/3 flex flex-col bg-slate-950/30">
                                <div class="p-4 border-b border-white/5 flex justify-between items-center">
                                    <h4 class="text-xs font-bold text-slate-400 uppercase">History: <span id="pqTableFilterDate" class="text-white">All</span></h4>
                                    <button onclick="QualityExt.viewAll()" class="text-[10px] bg-slate-800 border border-white/10 px-3 py-1 rounded-full text-slate-300 hover:text-white hover:border-gold-500 transition-all">View All</button>
                                </div>
                                <div class="flex-1 overflow-auto custom-scroll p-4">
                                    <table class="w-full text-left border-collapse glass-table text-sm">
                                        <thead>
                                            <tr class="bg-slate-900/80 sticky top-0 z-10 backdrop-blur">
                                                <th class="p-3 w-28">Date</th>
                                                <th class="p-3 text-center">Target</th>
                                                <th class="p-3 text-center">ZN</th>
                                                <th class="p-3 text-center">MG</th>
                                                <th class="p-3 text-center">H2O</th>
                                                <th class="p-3 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody id="pqModalTableBody"></tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            $('body').append(modalHtml);
        }
    };

    // --- LOGIC ---
    const getTrendIcon = (current, prev) => {
        if (!prev) return `<span class="text-xs ${ICONS.flat}">-</span>`;
        if (current > prev) return `<span class="text-[10px] trend-up">${ICONS.up}</span>`;
        if (current < prev) return `<span class="text-[10px] trend-down">${ICONS.down}</span>`;
        return `<span class="text-[10px] trend-flat">${ICONS.flat}</span>`;
    };

    const renderSummaryTable = () => {
        const sorted = [...state.data].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);
        
        const html = sorted.map((row, index) => {
            const prev = sorted[index + 1]; // Compare with next item in descending list (which is chronologically previous)
            const status = row.target >= 92 ? '<span class="text-green-400 font-bold">PASS</span>' : '<span class="text-red-400 font-bold">FAIL</span>';
            
            return `
            <tr class="hover:bg-white/5 transition-colors border-b border-white/5 group">
                <td class="p-2 text-slate-300 font-mono whitespace-nowrap">${row.date.substring(5)}</td>
                <td class="p-2 text-gold-400 font-bold">
                    ${row.target}% ${getTrendIcon(row.target, prev?.target)}
                </td>
                <td class="p-2 text-green-400">
                    ${row.zn} ${getTrendIcon(row.zn, prev?.zn)}
                </td>
                <td class="p-2 text-orange-400">
                    ${row.mg} ${getTrendIcon(row.mg, prev?.mg)}
                </td>
                <td class="p-2 text-blue-400 font-bold">
                    ${row.h2o}% ${getTrendIcon(row.h2o, prev?.h2o)}
                </td>
                <td class="p-2 text-center text-[10px]">${status}</td>
            </tr>
        `}).join('');

        $('#pqSummaryBody').html(html || '<tr><td colspan="6" class="p-4 text-center text-slate-500 italic">No recent data.</td></tr>');
    };

    const updateMainChart = () => {
        const chart = Chart.getChart("qualityChart");
        if (!chart) return;

        const months = chart.data.labels; // ['Jan', 'Feb', ...]
        const datasets = { target: [], zn: [], mg: [], h2o: [] };
        const counts = Array(months.length).fill(0);
        
        // Initialize arrays with null
        Object.keys(datasets).forEach(k => datasets[k] = Array(months.length).fill(0));

        // Aggregate Data
        state.data.forEach(entry => {
            const d = new Date(entry.date);
            if(d.getFullYear() === 2026) {
                const m = d.getMonth();
                if(m < months.length) {
                    datasets.target[m] += parseFloat(entry.target);
                    datasets.zn[m] += parseFloat(entry.zn);
                    datasets.mg[m] += parseFloat(entry.mg);
                    datasets.h2o[m] += parseFloat(entry.h2o);
                    counts[m]++;
                }
            }
        });

        // Calculate Averages
        const finalData = {
            target: datasets.target.map((v, i) => counts[i] ? v/counts[i] : null),
            zn: datasets.zn.map((v, i) => counts[i] ? v/counts[i] : null),
            mg: datasets.mg.map((v, i) => counts[i] ? v/counts[i] : null),
            h2o: datasets.h2o.map((v, i) => counts[i] ? v/counts[i] : null),
        };

        chart.data.datasets = [
            { label: 'Target %', data: finalData.target, borderColor: '#facc15', backgroundColor: 'rgba(250, 204, 21, 0.1)', borderWidth: 2, fill: true, tension: 0.4 },
            { label: 'ZN (ppm)', data: finalData.zn, borderColor: '#10b981', borderWidth: 2, tension: 0.4, hidden: false },
            { label: 'MG (ppm)', data: finalData.mg, borderColor: '#f97316', borderWidth: 2, tension: 0.4, hidden: false },
            { label: 'H2O (%)', data: finalData.h2o, borderColor: '#3b82f6', borderWidth: 2, borderDash: [5, 5], tension: 0.4 }
        ];
        chart.update();
    };

    // --- CALENDAR & FORM OPS ---
    const changeMonth = (offset) => { state.currentMonth.setMonth(state.currentMonth.getMonth() + offset); renderCalendar(); };
    
    const renderCalendar = () => {
        const year = state.currentMonth.getFullYear();
        const month = state.currentMonth.getMonth();
        $('#pqCalTitle').text(state.currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));

        const firstDay = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();
        let html = '';
        
        for (let i = 0; i < firstDay; i++) html += `<div class="pq-day text-muted"></div>`;
        for (let day = 1; day <= totalDays; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isSel = dateStr === state.selectedDate;
            const hasData = state.data.some(d => d.date === dateStr);
            html += `<div class="pq-day ${isSel ? 'active' : ''} ${hasData ? 'has-data' : ''}" onclick="QualityExt.selectDate('${dateStr}')">${day}</div>`;
        }
        $('#pqCalendarGrid').html(html);
    };

    const selectDate = (dateStr) => {
        state.selectedDate = dateStr;
        $('#pqSelectedDateDisplay').text(dateStr);
        renderCalendar();
        
        const existing = state.data.find(d => d.date === dateStr);
        populateForm(existing || { date: dateStr });
        renderModalTable(dateStr);
    };

    const populateForm = (data) => {
        $('#pqId').val(data.id || ''); 
        $('#pqTarget').val(data.target || '');
        $('#pqZn').val(data.zn || '');
        $('#pqMg').val(data.mg || '');
        $('#pqPs').val(data.ps || '');
        $('#pqH2o').val(data.h2o || '');
    };

    const saveEntry = () => {
        const id = $('#pqId').val();
        if(!state.selectedDate) return alert("Select a date");
        
        const entry = {
            id: id ? parseInt(id) : Date.now(),
            date: state.selectedDate,
            target: parseFloat($('#pqTarget').val() || 0).toFixed(2),
            zn: parseFloat($('#pqZn').val() || 0).toFixed(2),
            mg: parseFloat($('#pqMg').val() || 0).toFixed(2),
            ps: parseFloat($('#pqPs').val() || 0).toFixed(2),
            h2o: parseFloat($('#pqH2o').val() || 0).toFixed(2),
        };

        if (id) {
            const idx = state.data.findIndex(d => d.id === parseInt(id));
            if (idx > -1) state.data[idx] = entry;
        } else {
            state.data.push(entry);
        }
        saveData();
        resetForm();
        renderModalTable(state.selectedDate);
    };

    const deleteEntry = (id) => {
        if(confirm('Delete record?')) {
            state.data = state.data.filter(d => d.id !== id);
            saveData();
            renderModalTable(state.selectedDate);
        }
    };

    const renderModalTable = (filterDate = null) => {
        let displayData = [...state.data].sort((a, b) => new Date(b.date) - new Date(a.date));
        if (filterDate) {
            displayData = displayData.filter(d => d.date === filterDate);
            $('#pqTableFilterDate').text(filterDate);
        } else $('#pqTableFilterDate').text('All');

        const html = displayData.map(row => `
            <tr class="hover:bg-white/5 border-b border-white/5">
                <td class="p-3 text-slate-300 font-mono">${row.date}</td>
                <td class="p-3 text-center text-gold-400 font-bold">${row.target}</td>
                <td class="p-3 text-center text-green-400">${row.zn}</td>
                <td class="p-3 text-center text-orange-400">${row.mg}</td>
                <td class="p-3 text-center text-blue-400">${row.h2o}</td>
                <td class="p-3 text-right">
                    <button onclick="QualityExt.selectDate('${row.date}')" class="text-slate-500 hover:text-gold-400 mx-1 transition-colors">${ICONS.edit}</button>
                    <button onclick="QualityExt.deleteEntry(${row.id})" class="text-slate-500 hover:text-red-400 mx-1 transition-colors">${ICONS.trash}</button>
                </td>
            </tr>
        `).join('');
        $('#pqModalTableBody').html(html || '<tr><td colspan="6" class="p-6 text-center text-slate-600">No records found.</td></tr>');
    };

    const resetForm = () => { $('#pqId').val(''); $('#pqForm')[0].reset(); };
    return { init, openModal: () => { $('#pqModal').removeClass('hidden').addClass('flex'); selectDate(state.selectedDate); }, closeModal: () => $('#pqModal').addClass('hidden').removeClass('flex'), changeMonth, selectDate, saveEntry, resetForm, deleteEntry, viewAll: () => renderModalTable(null) };
})();

$(document).ready(() => setTimeout(QualityExt.init, 500));