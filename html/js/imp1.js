/**
 * extension.js
 * Version: 2.0 (Robust & Feature Rich)
 * Purpose: Extends the Quality Management Dashboard with:
 * 1. Advanced Audit Details & Collaboration (Comments/Replies)
 * 2. Editable Product Quality KPIs
 * 3. Interactive Annual Schedule Builder
 * 4. Process Flow SOP Manager
 */

$(document).ready(function () {
    QMExtension.init();
});

const QMExtension = (() => {
    // --- CONFIGURATION & KEYS ---
    const KEYS = {
        COMMENTS: 'QM_EXT_COMMENTS_V2',
        KPI: 'QM_EXT_KPI_V1',
        SCHEDULE: 'QM_EXT_SCHEDULE_V1',
        PROCESS: 'QM_EXT_PROCESS_V1'
    };

    // --- 1. INJECTED STYLES ---
    const injectStyles = () => {
        const styles = `
            <style>
                /* --- GENERAL EXTENSION STYLES --- */
                .ext-cursor-pointer { cursor: pointer !important; transition: all 0.2s; }
                .ext-hover-effect:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); filter: brightness(105%); }
                
                /* Highlight Editable Areas */
                .pq-box, .flow-step, .sch-cell:not(.sch-head) { position: relative; }
                .pq-box:hover::after, .flow-step:hover::after, .sch-cell:not(.sch-head):hover::after {
                    content: '✎'; position: absolute; top: 0; right: 0; 
                    background: var(--gold-light, #fcd34d); color: #000; 
                    font-size: 0.6rem; padding: 2px 5px; border-radius: 0 0 0 4px;
                }

                /* --- MODAL STYLES --- */
                .ext-modal-overlay { position: fixed; top:0; left:0; width:100%; height:100%; background:rgba(14, 36, 68, 0.85); display:none; z-index:5000; backdrop-filter: blur(4px); align-items:center; justify-content:center; }
                .ext-modal { background: #f3f4f6; width: 90%; max-width: 1000px; max-height: 90vh; border-radius: 8px; display: flex; flex-direction: column; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); border: 1px solid #b88a30; overflow:hidden; }
                .ext-modal.small { max-width: 500px; height: auto; }
                
                .ext-header { background: #0e2444; color: #fff; padding: 15px 20px; display:flex; justify-content:space-between; align-items:center; border-bottom: 3px solid #b88a30; }
                .ext-header h2 { margin:0; font-family: 'Oswald', sans-serif; font-size: 1.2rem; letter-spacing: 1px; color: #fcd34d; }
                
                .ext-body { padding: 0; overflow-y: auto; flex: 1; display:flex; }
                .ext-content-full { padding: 20px; width: 100%; }

                /* --- AUDIT VIEW STYLES --- */
                .ext-details-panel { flex: 1.2; padding: 25px; background: white; border-right: 1px solid #ddd; overflow-y:auto; }
                .ext-discuss-panel { flex: 0.8; display: flex; flex-direction: column; background: #f9fafb; min-height: 400px; }
                
                .detail-group { margin-bottom: 15px; }
                .detail-label { font-size: 0.7rem; color: #6b7280; text-transform: uppercase; font-weight: bold; margin-bottom: 4px; }
                .detail-value { font-size: 0.95rem; color: #1f2937; border-bottom: 1px dashed #e5e7eb; padding-bottom: 5px; }
                
                .comment-item { background: white; border-radius: 6px; padding: 10px; margin-bottom: 10px; border-left: 3px solid #3c78d8; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
                .comment-meta { display: flex; justify-content: space-between; font-size: 0.7rem; color: #888; margin-bottom: 5px; }
                .reply-list { margin-left: 15px; border-left: 2px solid #ddd; padding-left: 10px; margin-top: 5px; display:none; }
                .reply-item { background: #f1f5f9; padding: 8px; border-radius: 4px; margin-bottom: 5px; font-size: 0.85rem; }

                /* --- FORM ELEMENTS --- */
                .ext-input { width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 4px; margin-bottom: 15px; }
                .ext-select { width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 4px; margin-bottom: 15px; background: white; }
                .ext-btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; text-transform: uppercase; font-size: 0.8rem; }
                .ext-btn-primary { background: #0e2444; color: #fcd34d; border: 1px solid #b88a30; }
                .ext-btn-primary:hover { background: #b88a30; color: #0e2444; }

                /* --- SEARCH HIGHLIGHT --- */
                .highlight-text { background-color: #fcd34d; color: #0e2444; font-weight: bold; padding: 0 2px; }
            </style>
        `;
        $('head').append(styles);
    };

    // --- 2. INJECTED HTML (Modals) ---
    const injectHTML = () => {
        const modals = `
            <!-- AUDIT VIEW MODAL -->
            <div class="ext-modal-overlay" id="extAuditModal">
                <div class="ext-modal">
                    <div class="ext-header">
                        <h2><i class="fas fa-clipboard-check"></i> Finding Details & Discussion</h2>
                        <button onclick="QMExtension.UI.closeModal('extAuditModal')" style="background:none; border:none; color:white; font-size:1.5rem; cursor:pointer;">&times;</button>
                    </div>
                    <div class="ext-body">
                        <div class="ext-details-panel" id="extAuditDetails"></div>
                        <div class="ext-discuss-panel">
                            <div style="padding:15px; border-bottom:1px solid #eee; font-weight:bold; color:#0e2444; display:flex; justify-content:space-between;">
                                <span>Discussion Board</span><span class="badge bg-gray" id="extCommentCount">0</span>
                            </div>
                            <div id="extCommentList" style="flex:1; padding:15px; overflow-y:auto;"></div>
                            <div style="padding:15px; background:white; border-top:1px solid #eee;">
                                <textarea id="extNewComment" class="ext-input" rows="2" placeholder="Type a comment..."></textarea>
                                <button class="ext-btn ext-btn-primary" style="width:100%;" onclick="QMExtension.Logic.Audits.postComment()">Post</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- GENERIC EDITOR MODAL (For KPI, Schedule, Process) -->
            <div class="ext-modal-overlay" id="extEditorModal">
                <div class="ext-modal small">
                    <div class="ext-header">
                        <h2 id="extEditorTitle">Edit Item</h2>
                        <button onclick="QMExtension.UI.closeModal('extEditorModal')" style="background:none; border:none; color:white; font-size:1.5rem; cursor:pointer;">&times;</button>
                    </div>
                    <div class="ext-body">
                        <div class="ext-content-full" id="extEditorContent">
                            <!-- Dynamic Form -->
                        </div>
                    </div>
                    <div style="padding:15px; background:#e5e7eb; display:flex; justify-content:flex-end; gap:10px;">
                        <button class="ext-btn" onclick="QMExtension.UI.closeModal('extEditorModal')">Cancel</button>
                        <button class="ext-btn ext-btn-primary" id="extEditorSaveBtn">Save Changes</button>
                    </div>
                </div>
            </div>
        `;
        $('body').append(modals);
    };

    // --- 3. STORAGE MANAGER ---
    const Storage = {
        get: (key) => {
            try { return JSON.parse(localStorage.getItem(key)) || null; } 
            catch (e) { console.error("Data Load Error", e); return null; }
        },
        set: (key, data) => {
            localStorage.setItem(key, JSON.stringify(data));
        }
    };

    // --- 4. LOGIC MODULES ---
    const Logic = {
        // --- AUDIT & COMMENTS LOGIC ---
        Audits: {
            currentId: null,
            data: [], // Comments cache

            open: (id) => {
                Logic.Audits.currentId = id;
                Logic.Audits.data = Storage.get(KEYS.COMMENTS) || [];
                
                // Get Audit Data from Main App's LocalStorage
                const appState = JSON.parse(localStorage.getItem('QM_PRO_SYSTEM_V7'));
                const audit = appState.audits.find(a => a.id === id);

                if(!audit) return alert("Record not found.");

                // Render Details
                $('#extAuditDetails').html(`
                    <div class="detail-group"><div class="detail-label">Description</div><div class="detail-value">${audit.desc}</div></div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                        <div class="detail-group"><div class="detail-label">PIC</div><div class="detail-value">${audit.picPri}</div></div>
                        <div class="detail-group"><div class="detail-label">Target</div><div class="detail-value">${audit.targetDate}</div></div>
                    </div>
                    <div class="detail-group"><div class="detail-label">Status</div><div class="detail-value"><span class="badge ${audit.status==='Closed'?'bg-green':'bg-orange'}">${audit.status}</span></div></div>
                    <div class="detail-group"><div class="detail-label">Images</div>
                        <div style="display:flex; gap:10px;">
                            ${audit.imgBefore ? `<img src="${audit.imgBefore}" style="width:80px; height:80px; object-fit:cover; border:1px solid #ccc; cursor:pointer;" onclick="window.open(this.src)">` : ''}
                            ${audit.imgAfter ? `<img src="${audit.imgAfter}" style="width:80px; height:80px; object-fit:cover; border:1px solid #ccc; cursor:pointer;" onclick="window.open(this.src)">` : ''}
                        </div>
                    </div>
                `);

                Logic.Audits.renderComments();
                $('#extAuditModal').css('display', 'flex').hide().fadeIn(200);
            },

            renderComments: () => {
                const comments = Logic.Audits.data.filter(c => c.refId === Logic.Audits.currentId).sort((a,b) => b.id - a.id);
                $('#extCommentCount').text(comments.length);
                
                $('#extCommentList').html(comments.length ? comments.map(c => `
                    <div class="comment-item">
                        <div class="comment-meta">
                            <span style="font-weight:bold; color:#0e2444;"><i class="fas fa-user"></i> ${c.user}</span>
                            <span>${new Date(c.time).toLocaleString()}</span>
                        </div>
                        <div style="font-size:0.9rem; margin-bottom:5px;">${c.text}</div>
                        <div style="font-size:0.75rem;">
                            <a href="#" onclick="QMExtension.Logic.Audits.toggleReply(${c.id}); return false;">Reply</a>
                            ${c.replies && c.replies.length ? `| <a href="#" onclick="$('#replies-${c.id}').slideToggle(); return false;">View Replies (${c.replies.length})</a>` : ''}
                        </div>
                        
                        <div id="reply-box-${c.id}" style="display:none; margin-top:5px;">
                            <input type="text" id="reply-input-${c.id}" class="ext-input" style="margin-bottom:5px; padding:5px;" placeholder="Write reply...">
                            <button class="ext-btn ext-btn-primary" style="padding:4px 8px; font-size:0.7rem;" onclick="QMExtension.Logic.Audits.postReply(${c.id})">Send</button>
                        </div>

                        <div id="replies-${c.id}" class="reply-list">
                            ${(c.replies || []).map(r => `
                                <div class="reply-item">
                                    <strong>${r.user}</strong>: ${r.text}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('') : '<div style="text-align:center; color:#ccc; margin-top:20px;">No comments yet.</div>');
            },

            postComment: () => {
                const txt = $('#extNewComment').val().trim();
                if(!txt) return;
                Logic.Audits.data.push({ id: Date.now(), refId: Logic.Audits.currentId, user: 'Manager', time: Date.now(), text: txt, replies: [] });
                Storage.set(KEYS.COMMENTS, Logic.Audits.data);
                $('#extNewComment').val('');
                Logic.Audits.renderComments();
            },

            toggleReply: (id) => { $(`#reply-box-${id}`).slideToggle().find('input').focus(); },

            postReply: (cId) => {
                const txt = $(`#reply-input-${cId}`).val().trim();
                if(!txt) return;
                const comment = Logic.Audits.data.find(c => c.id === cId);
                if(comment) {
                    if(!comment.replies) comment.replies = [];
                    comment.replies.push({ user: 'User', text: txt, time: Date.now() });
                    Storage.set(KEYS.COMMENTS, Logic.Audits.data);
                    Logic.Audits.renderComments();
                }
            }
        },

        // --- KPI / PRODUCT QUALITY LOGIC ---
        KPI: {
            init: () => {
                // Initialize IDs for KPI boxes to track them
                $('.pq-box').each(function(index) {
                    $(this).attr('data-kpi-id', index).addClass('ext-cursor-pointer ext-hover-effect');
                });
                Logic.KPI.load();
                
                // Bind Click
                $(document).on('click', '.pq-box', function() {
                    const id = $(this).data('kpi-id');
                    const label = $(this).find('.pq-label').text();
                    const val = $(this).find('.pq-val').text();
                    Logic.KPI.openEditor(id, label, val);
                });
            },

            load: () => {
                const data = Storage.get(KEYS.KPI) || {};
                $('.pq-box').each(function() {
                    const id = $(this).data('kpi-id');
                    if(data[id]) {
                        $(this).find('.pq-label').text(data[id].label);
                        $(this).find('.pq-val').text(data[id].val);
                    }
                });
            },

            openEditor: (id, label, val) => {
                $('#extEditorTitle').text('Edit KPI Metric');
                $('#extEditorContent').html(`
                    <label class="detail-label">Metric Name</label>
                    <input type="text" id="kpiLabel" class="ext-input" value="${label}">
                    <label class="detail-label">Current Value</label>
                    <input type="text" id="kpiVal" class="ext-input" value="${val}">
                `);
                
                $('#extEditorSaveBtn').off('click').on('click', () => {
                    const data = Storage.get(KEYS.KPI) || {};
                    data[id] = { label: $('#kpiLabel').val(), val: $('#kpiVal').val() };
                    Storage.set(KEYS.KPI, data);
                    Logic.KPI.load();
                    QMExtension.UI.closeModal('extEditorModal');
                    QMExtension.UI.showToast("KPI Updated");
                });
                
                $('#extEditorModal').css('display', 'flex').hide().fadeIn(200);
            }
        },

        // --- ANNUAL SCHEDULE LOGIC ---
        Schedule: {
            init: () => {
                // Ignore headers, target content cells
                $('.sch-cell').not('.sch-head').not('[style*="font-weight:bold"]').each(function(index) {
                    $(this).attr('data-sch-id', index).addClass('ext-cursor-pointer');
                });
                Logic.Schedule.load();

                $(document).on('click', '.sch-cell[data-sch-id]', function() {
                    const id = $(this).data('sch-id');
                    const currentText = $(this).text();
                    Logic.Schedule.openEditor(id, currentText);
                });
            },

            load: () => {
                const data = Storage.get(KEYS.SCHEDULE) || {};
                $('.sch-cell[data-sch-id]').each(function() {
                    const id = $(this).data('sch-id');
                    if(data[id]) {
                        $(this).text(data[id].text);
                        // Reset classes then add specific one
                        $(this).removeClass('bg-sched-blue bg-sched-yellow bg-sched-green bg-sched-red')
                               .addClass(data[id].colorClass);
                    }
                });
            },

            openEditor: (id, text) => {
                $('#extEditorTitle').text('Update Schedule');
                $('#extEditorContent').html(`
                    <label class="detail-label">Cell Text</label>
                    <input type="text" id="schText" class="ext-input" value="${text}">
                    <label class="detail-label">Status Color</label>
                    <select id="schColor" class="ext-select">
                        <option value="">None (White)</option>
                        <option value="bg-sched-blue">Blue (Planned)</option>
                        <option value="bg-sched-yellow">Yellow (In-Progress)</option>
                        <option value="bg-sched-green">Green (Completed)</option>
                        <option value="bg-sched-red">Red (Issue)</option>
                    </select>
                `);

                $('#extEditorSaveBtn').off('click').on('click', () => {
                    const data = Storage.get(KEYS.SCHEDULE) || {};
                    data[id] = { 
                        text: $('#schText').val(), 
                        colorClass: $('#schColor').val() 
                    };
                    Storage.set(KEYS.SCHEDULE, data);
                    Logic.Schedule.load();
                    QMExtension.UI.closeModal('extEditorModal');
                });
                
                $('#extEditorModal').css('display', 'flex').hide().fadeIn(200);
            }
        },

        // --- PROCESS FLOW LOGIC ---
        Process: {
            init: () => {
                $('.flow-step').each(function(index) {
                    $(this).attr('data-proc-id', index).addClass('ext-cursor-pointer ext-hover-effect');
                });
                Logic.Process.load(); // Load any custom tooltips?

                $(document).on('click', '.flow-step', function() {
                    const id = $(this).data('proc-id');
                    const title = $(this).find('.flow-text').text();
                    const num = $(this).find('.flow-num').text();
                    Logic.Process.openDetails(id, num, title);
                });
            },

            load: () => {
                // Optional: Visually indicate steps that have SOPs attached
                const data = Storage.get(KEYS.PROCESS) || {};
                $('.flow-step').each(function() {
                    const id = $(this).data('proc-id');
                    if(data[id] && data[id].sop) {
                        $(this).css('border-color', '#b88a30');
                    }
                });
            },

            openDetails: (id, num, title) => {
                const data = Storage.get(KEYS.PROCESS) || {};
                const currentData = data[id] || { sop: '', notes: '' };

                $('#extEditorTitle').text(`Stage ${num}: ${title}`);
                $('#extEditorContent').html(`
                    <div style="background:#eef2ff; padding:10px; border-radius:4px; margin-bottom:15px; font-size:0.8rem; border-left:4px solid #3c78d8;">
                        Edit the Standard Operating Procedure (SOP) or Notes for this stage.
                    </div>
                    <label class="detail-label">SOP / Guidelines</label>
                    <textarea id="procSop" class="ext-input" rows="4">${currentData.sop}</textarea>
                    <label class="detail-label">Internal Notes</label>
                    <textarea id="procNotes" class="ext-input" rows="2">${currentData.notes}</textarea>
                `);

                $('#extEditorSaveBtn').off('click').on('click', () => {
                    const newData = Storage.get(KEYS.PROCESS) || {};
                    newData[id] = { 
                        sop: $('#procSop').val(), 
                        notes: $('#procNotes').val() 
                    };
                    Storage.set(KEYS.PROCESS, newData);
                    Logic.Process.load();
                    QMExtension.UI.closeModal('extEditorModal');
                    QMExtension.UI.showToast("Process Info Saved");
                });

                $('#extEditorModal').css('display', 'flex').hide().fadeIn(200);
            }
        }
    };

    // --- 5. UI UTILITIES ---
    const UI = {
        closeModal: (id) => { $(`#${id}`).fadeOut(200); },
        
        showToast: (msg) => {
            // Re-use the main app's toast container if available
            if($('#toast-container').length) {
                const t = $(`<div class="toast info" style="border-left-color:#b88a30;"><span><i class="fas fa-wrench"></i></span> ${msg}</div>`);
                $('#toast-container').append(t);
                t.animate({right: '0', opacity: 1}, 300);
                setTimeout(() => t.fadeOut(500, () => t.remove()), 3000);
            } else {
                alert(msg);
            }
        },

        // Enhanced Search Highlighting
        setupSearch: () => {
            $('#searchInput').on('keyup', function() {
                const term = $(this).val().toLowerCase();
                if(!term) { 
                    $('.highlight-text').contents().unwrap(); 
                    return; 
                }
                
                // Wait for Main App Filter to finish
                setTimeout(() => {
                    $('#auditTable tbody tr:visible td').each(function() {
                        const text = $(this).text();
                        if(text.toLowerCase().includes(term) && $(this).children().length === 0) {
                            const regex = new RegExp(`(${term})`, 'gi');
                            $(this).html(text.replace(regex, '<span class="highlight-text">$1</span>'));
                        }
                    });
                }, 100);
            });
        }
    };

    // --- 6. INITIALIZATION ---
    const init = () => {
        console.log("QM Extension v2.0: Loaded");
        injectStyles();
        injectHTML();
        
        // Init Sub-Modules
        Logic.KPI.init();
        Logic.Schedule.init();
        Logic.Process.init();
        UI.setupSearch();

        // Inject "View" buttons into existing Audit Table dynamically
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((m) => {
                if(m.type === 'childList') injectAuditButtons();
            });
        });
        const target = document.getElementById('auditBody');
        if(target) {
            observer.observe(target, { childList: true });
            injectAuditButtons(); // Initial run
        }
    };

    const injectAuditButtons = () => {
        $('#auditTable tbody tr').each(function() {
            const row = $(this);
            const actionCell = row.find('td:last-child');
            // Extract ID from the delete function string (Fragile but necessary without changing main code)
            const onclick = actionCell.find('.btn-danger').attr('onclick');
            if(onclick && actionCell.find('.ext-view-btn').length === 0) {
                const idMatch = onclick.match(/(\d+)/);
                if(idMatch) {
                    const btn = $(`<button class="btn-sm ext-view-btn" style="background:#3b82f6; color:white; border:1px solid #2563eb; margin-right:5px; border-radius:4px;"><i class="fas fa-eye"></i></button>`);
                    btn.click(() => Logic.Audits.open(parseInt(idMatch[1])));
                    actionCell.prepend(btn);
                }
            }
        });
    };

    return { 
        init, 
        UI, 
        Logic 
    };
})();
