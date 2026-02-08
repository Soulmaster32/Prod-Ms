/**
 * extension.js
 * Version: 3.0 (Material Design Edition)
 * Purpose: Extends the Quality Management Dashboard with:
 * 1. Advanced Audit Details & Collaboration (Material Threaded Comments)
 * 2. Editable Product Quality KPIs (Overlay Edit)
 * 3. Interactive Annual Schedule Builder
 * 4. Process Flow SOP Manager
 */

$(document).ready(function () {
    QMExtension.init();
});

const QMExtension = (() => {
    // --- CONFIGURATION & KEYS ---
    const KEYS = {
        COMMENTS: 'QM_EXT_COMMENTS_V3',
        KPI: 'QM_EXT_KPI_V1',
        SCHEDULE: 'QM_EXT_SCHEDULE_V1',
        PROCESS: 'QM_EXT_PROCESS_V1'
    };

    // --- 1. INJECTED RESOURCES & STYLES ---
    const injectResources = () => {
        // Inject Material Icons and Roboto Font
        $('head').append(`
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
            <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
        `);

        const styles = `
            <style>
                /* --- MATERIAL DESIGN VARIABLES --- */
                :root {
                    --md-primary: #3f51b5; /* Indigo 500 */
                    --md-primary-dark: #303f9f;
                    --md-accent: #ffca28; /* Amber 400 */
                    --md-bg: #f5f5f5;
                    --md-surface: #ffffff;
                    --md-text-primary: #212121;
                    --md-text-secondary: #757575;
                    --md-divider: #e0e0e0;
                    --shadow-2: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
                    --shadow-4: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
                    --radius: 8px;
                }

                /* --- GLOBAL OVERRIDES --- */
                .ext-scope { font-family: 'Roboto', sans-serif; color: var(--md-text-primary); }
                
                /* --- EDITABLE ZONES --- */
                .pq-box, .flow-step, .sch-cell:not(.sch-head) { position: relative; overflow: hidden; }
                .pq-box:hover .ext-edit-overlay, .flow-step:hover .ext-edit-overlay, .sch-cell:not(.sch-head):hover .ext-edit-overlay {
                    opacity: 1; transform: translateY(0);
                }
                .ext-edit-overlay {
                    position: absolute; top: 0; right: 0; bottom: 0; left: 0;
                    background: rgba(63, 81, 181, 0.1);
                    display: flex; align-items: center; justify-content: center;
                    opacity: 0; transition: all 0.2s ease; cursor: pointer;
                    border: 2px solid var(--md-primary);
                }

                /* --- MATERIAL MODAL --- */
                .md-overlay {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0, 0, 0, 0.6); z-index: 9999;
                    display: none; align-items: center; justify-content: center;
                    backdrop-filter: blur(3px); opacity: 0; transition: opacity 0.3s;
                }
                .md-dialog {
                    background: var(--md-surface); width: 90%; max-width: 900px;
                    border-radius: var(--radius); box-shadow: var(--shadow-4);
                    display: flex; flex-direction: column; max-height: 90vh;
                    transform: translateY(20px); transition: transform 0.3s;
                    overflow: hidden;
                }
                .md-dialog.small { max-width: 450px; }
                
                .md-header {
                    background: var(--md-primary); color: white; padding: 16px 24px;
                    display: flex; justify-content: space-between; align-items: center;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2); z-index: 10;
                }
                .md-header h2 { margin: 0; font-weight: 500; font-size: 1.25rem; display: flex; align-items: center; gap: 10px; }
                
                .md-body { flex: 1; overflow-y: auto; display: flex; flex-direction: column; background: #fafafa; }
                .md-body.row { flex-direction: row; }
                
                .md-footer {
                    padding: 12px 24px; border-top: 1px solid var(--md-divider);
                    background: var(--md-surface); display: flex; justify-content: flex-end; gap: 10px;
                }

                /* --- MATERIAL INPUTS --- */
                .md-input-group { position: relative; margin-bottom: 20px; width: 100%; }
                .md-input, .md-textarea, .md-select {
                    width: 100%; padding: 12px 12px 12px 12px; display: block;
                    border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;
                    font-size: 1rem; transition: 0.2s; background: white;
                }
                .md-input:focus, .md-textarea:focus {
                    border-color: var(--md-primary); outline: none; box-shadow: 0 0 0 2px rgba(63, 81, 181, 0.2);
                }
                .md-label {
                    position: absolute; top: -8px; left: 10px; background: white;
                    padding: 0 5px; font-size: 0.75rem; color: var(--md-primary); font-weight: 500;
                }

                /* --- MATERIAL BUTTONS --- */
                .md-btn {
                    border: none; border-radius: 4px; padding: 8px 16px;
                    text-transform: uppercase; font-weight: 500; letter-spacing: 0.5px;
                    cursor: pointer; transition: background 0.2s; font-size: 0.875rem;
                }
                .md-btn-text { background: transparent; color: var(--md-primary); }
                .md-btn-text:hover { background: rgba(63, 81, 181, 0.08); }
                .md-btn-contained { background: var(--md-primary); color: white; box-shadow: 0 2px 2px rgba(0,0,0,0.24); }
                .md-btn-contained:hover { background: var(--md-primary-dark); box-shadow: 0 3px 6px rgba(0,0,0,0.26); }
                .md-icon-btn { background: none; border: none; color: white; cursor: pointer; border-radius: 50%; padding: 8px; }
                .md-icon-btn:hover { background: rgba(255,255,255,0.2); }

                /* --- AUDIT & COMMENTS --- */
                .details-pane { padding: 24px; flex: 1; border-right: 1px solid var(--md-divider); background: white; }
                .discuss-pane { padding: 0; flex: 0.8; display: flex; flex-direction: column; background: #f0f2f5; }
                
                .chat-list { flex: 1; padding: 16px; overflow-y: auto; }
                .chat-input-area { padding: 16px; background: white; border-top: 1px solid var(--md-divider); display: flex; gap: 10px; align-items: flex-end; }
                
                .msg-card { display: flex; gap: 12px; margin-bottom: 16px; }
                .msg-avatar { 
                    width: 36px; height: 36px; border-radius: 50%; color: white; 
                    display: flex; align-items: center; justify-content: center; 
                    font-weight: bold; font-size: 0.9rem; flex-shrink: 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .msg-bubble { background: white; padding: 10px 14px; border-radius: 0 12px 12px 12px; box-shadow: 0 1px 2px rgba(0,0,0,0.1); max-width: 90%; }
                .msg-meta { font-size: 0.7rem; color: var(--md-text-secondary); margin-bottom: 4px; display: flex; justify-content: space-between; gap: 10px;}
                .msg-text { font-size: 0.9rem; color: #333; line-height: 1.4; }
                .msg-actions { margin-top: 5px; font-size: 0.75rem; }
                .msg-actions a { text-decoration: none; color: var(--md-primary); margin-right: 10px; font-weight: 500; }

                /* --- SNACKBAR --- */
                #md-snackbar {
                    visibility: hidden; min-width: 250px; background-color: #333; color: #fff;
                    text-align: center; border-radius: 4px; padding: 14px; position: fixed;
                    z-index: 10000; left: 50%; bottom: 30px; transform: translateX(-50%);
                    box-shadow: 0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12);
                    font-size: 0.9rem;
                }
                #md-snackbar.show { visibility: visible; animation: fadein 0.5s, fadeout 0.5s 2.5s; }
                @keyframes fadein { from {bottom: 0; opacity: 0;} to {bottom: 30px; opacity: 1;} }
                @keyframes fadeout { from {bottom: 30px; opacity: 1;} to {bottom: 0; opacity: 0;} }
                
                /* HELPERS */
                .badge-status { padding: 4px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: bold; text-transform: uppercase; }
                .st-closed { background: #e8f5e9; color: #2e7d32; }
                .st-open { background: #fff3e0; color: #ef6c00; }
                .hidden { display: none; }
            </style>
        `;
        $('head').append(styles);
    };

    // --- 2. INJECTED HTML (Dialogs) ---
    const injectHTML = () => {
        const html = `
            <!-- AUDIT & DISCUSSION MODAL -->
            <div class="md-overlay ext-scope" id="extAuditModal">
                <div class="md-dialog">
                    <div class="md-header">
                        <h2><span class="material-icons">fact_check</span> Finding Details</h2>
                        <button class="md-icon-btn" onclick="QMExtension.UI.closeModal('extAuditModal')"><span class="material-icons">close</span></button>
                    </div>
                    <div class="md-body row">
                        <div class="details-pane" id="extAuditDetails">
                            <!-- Details Injected Here -->
                        </div>
                        <div class="discuss-pane">
                            <div style="padding:12px 16px; background:white; border-bottom:1px solid #eee; font-weight:500; color:var(--md-primary);">
                                Team Discussion (<span id="extCommentCount">0</span>)
                            </div>
                            <div id="extCommentList" class="chat-list"></div>
                            <div class="chat-input-area">
                                <textarea id="extNewComment" class="md-textarea" rows="1" placeholder="Add a comment..." style="resize:none; padding:10px;"></textarea>
                                <button class="md-btn md-btn-contained" style="min-width:auto; padding:8px 12px;" onclick="QMExtension.Logic.Audits.postComment()">
                                    <span class="material-icons" style="font-size:1.2rem;">send</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- UNIVERSAL EDITOR MODAL -->
            <div class="md-overlay ext-scope" id="extEditorModal">
                <div class="md-dialog small">
                    <div class="md-header">
                        <h2 id="extEditorTitle"><span class="material-icons">edit</span> Edit Item</h2>
                        <button class="md-icon-btn" onclick="QMExtension.UI.closeModal('extEditorModal')"><span class="material-icons">close</span></button>
                    </div>
                    <div class="md-body" style="padding:24px;">
                        <div id="extEditorContent">
                            <!-- Form Injected Here -->
                        </div>
                    </div>
                    <div class="md-footer">
                        <button class="md-btn md-btn-text" onclick="QMExtension.UI.closeModal('extEditorModal')">Cancel</button>
                        <button class="md-btn md-btn-contained" id="extEditorSaveBtn">Save Changes</button>
                    </div>
                </div>
            </div>

            <!-- SNACKBAR TOAST -->
            <div id="md-snackbar" class="ext-scope">Notification</div>
        `;
        $('body').append(html);
    };

    // --- 3. UTILITIES & STORAGE ---
    const Utils = {
        getInitials: (name) => {
            let initials = name.match(/\b\w/g) || [];
            return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
        },
        getColorFromName: (name) => {
            const colors = ['#e57373', '#ba68c8', '#7986cb', '#4db6ac', '#ffb74d', '#a1887f'];
            let hash = 0;
            for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
            return colors[Math.abs(hash) % colors.length];
        },
        storage: {
            get: (key) => JSON.parse(localStorage.getItem(key)) || null,
            set: (key, data) => localStorage.setItem(key, JSON.stringify(data))
        }
    };

    // --- 4. LOGIC MODULES ---
    const Logic = {
        Audits: {
            currentId: null,
            data: [], 

            open: (id) => {
                Logic.Audits.currentId = id;
                Logic.Audits.data = Utils.storage.get(KEYS.COMMENTS) || [];
                
                // Simulate getting data (Replace with real App Data Fetch)
                const appState = JSON.parse(localStorage.getItem('QM_PRO_SYSTEM_V7')) || { audits: [] };
                const audit = appState.audits.find(a => a.id === id);

                if(!audit) return QMExtension.UI.snack("Audit Record not found.");

                // Render Details
                const statusClass = audit.status === 'Closed' ? 'st-closed' : 'st-open';
                
                $('#extAuditDetails').html(`
                    <div class="md-input-group">
                        <label class="md-label">Problem Description</label>
                        <div style="font-size:1.1rem; line-height:1.5; color:#333;">${audit.desc}</div>
                    </div>
                    
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-bottom:20px;">
                         <div class="md-input-group">
                            <label class="md-label">Person In Charge</label>
                            <div>${audit.picPri}</div>
                        </div>
                        <div class="md-input-group">
                            <label class="md-label">Target Date</label>
                            <div>${audit.targetDate}</div>
                        </div>
                    </div>

                    <div class="md-input-group">
                        <label class="md-label">Current Status</label>
                        <span class="badge-status ${statusClass}">${audit.status}</span>
                    </div>

                    <div class="md-input-group">
                        <label class="md-label">Evidence</label>
                        <div style="display:flex; gap:10px; margin-top:10px;">
                            ${audit.imgBefore ? `<img src="${audit.imgBefore}" style="width:100px; height:100px; border-radius:4px; object-fit:cover; box-shadow:var(--shadow-2); cursor:pointer;" onclick="window.open(this.src)">` : '<span style="color:#999; font-style:italic;">No Before Image</span>'}
                            ${audit.imgAfter ? `<img src="${audit.imgAfter}" style="width:100px; height:100px; border-radius:4px; object-fit:cover; box-shadow:var(--shadow-2); cursor:pointer;" onclick="window.open(this.src)">` : ''}
                        </div>
                    </div>
                `);

                Logic.Audits.renderComments();
                QMExtension.UI.openModal('extAuditModal');
            },

            renderComments: () => {
                const comments = Logic.Audits.data.filter(c => c.refId === Logic.Audits.currentId).sort((a,b) => a.id - b.id);
                $('#extCommentCount').text(comments.length);
                
                const html = comments.length ? comments.map(c => {
                    const initials = Utils.getInitials(c.user);
                    const bg = Utils.getColorFromName(c.user);
                    return `
                    <div class="msg-card">
                        <div class="msg-avatar" style="background:${bg}">${initials}</div>
                        <div style="flex:1;">
                            <div class="msg-meta">
                                <strong>${c.user}</strong>
                                <span>${new Date(c.time).toLocaleDateString()} ${new Date(c.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                            <div class="msg-bubble">
                                <div class="msg-text">${c.text}</div>
                            </div>
                            <!-- Simple Reply Logic -->
                            ${c.replies ? c.replies.map(r => `
                                <div style="margin-top:8px; display:flex; gap:8px;">
                                    <div class="msg-avatar" style="width:24px; height:24px; font-size:0.7rem; background:#999;">${Utils.getInitials(r.user)}</div>
                                    <div class="msg-bubble" style="background:#f5f5f5; padding:8px;">
                                        <div class="msg-text" style="font-size:0.85rem;"><strong>${r.user}:</strong> ${r.text}</div>
                                    </div>
                                </div>
                            `).join('') : ''}
                            <div class="msg-actions">
                                <a href="#" onclick="QMExtension.Logic.Audits.replyTo(${c.id}); return false;">Reply</a>
                            </div>
                        </div>
                    </div>
                    `;
                }).join('') : '<div style="text-align:center; padding:20px; color:#aaa;">No comments yet. Start the discussion!</div>';
                
                const list = $('#extCommentList');
                list.html(html);
                list.scrollTop(list[0].scrollHeight); // Auto scroll to bottom
            },

            postComment: () => {
                const txt = $('#extNewComment').val().trim();
                if(!txt) return;
                
                const newC = { id: Date.now(), refId: Logic.Audits.currentId, user: 'Current User', time: Date.now(), text: txt, replies: [] };
                Logic.Audits.data.push(newC);
                Utils.storage.set(KEYS.COMMENTS, Logic.Audits.data);
                $('#extNewComment').val('');
                Logic.Audits.renderComments();
            },

            replyTo: (commentId) => {
                const reply = prompt("Enter your reply:"); // Simple prompt for reply to keep UI clean, or could use modal
                if(reply) {
                    const comment = Logic.Audits.data.find(c => c.id === commentId);
                    if(comment) {
                        if(!comment.replies) comment.replies = [];
                        comment.replies.push({ user: 'Current User', text: reply, time: Date.now() });
                        Utils.storage.set(KEYS.COMMENTS, Logic.Audits.data);
                        Logic.Audits.renderComments();
                    }
                }
            }
        },

        KPI: {
            init: () => {
                $('.pq-box').each(function(i) {
                    $(this).attr('data-kpi-id', i);
                    if($(this).find('.ext-edit-overlay').length === 0) {
                        $(this).append('<div class="ext-edit-overlay"><span class="material-icons" style="color:var(--md-primary);">edit</span></div>');
                    }
                });
                
                Logic.KPI.load();

                $(document).on('click', '.pq-box .ext-edit-overlay', function(e) {
                    e.stopPropagation();
                    const box = $(this).parent();
                    Logic.KPI.openEditor(box.data('kpi-id'), box.find('.pq-label').text(), box.find('.pq-val').text());
                });
            },

            load: () => {
                const data = Utils.storage.get(KEYS.KPI) || {};
                $('.pq-box').each(function() {
                    const id = $(this).data('kpi-id');
                    if(data[id]) {
                        $(this).find('.pq-label').text(data[id].label);
                        $(this).find('.pq-val').text(data[id].val);
                    }
                });
            },

            openEditor: (id, label, val) => {
                $('#extEditorTitle').html('<span class="material-icons">analytics</span> Edit Metric');
                $('#extEditorContent').html(`
                    <div class="md-input-group">
                        <label class="md-label">Metric Name</label>
                        <input type="text" id="kpiLabel" class="md-input" value="${label}">
                    </div>
                    <div class="md-input-group">
                        <label class="md-label">Value</label>
                        <input type="text" id="kpiVal" class="md-input" value="${val}">
                    </div>
                `);

                $('#extEditorSaveBtn').off('click').on('click', () => {
                    const data = Utils.storage.get(KEYS.KPI) || {};
                    data[id] = { label: $('#kpiLabel').val(), val: $('#kpiVal').val() };
                    Utils.storage.set(KEYS.KPI, data);
                    Logic.KPI.load();
                    QMExtension.UI.closeModal('extEditorModal');
                    QMExtension.UI.snack("KPI Updated Successfully");
                });
                QMExtension.UI.openModal('extEditorModal');
            }
        },

        Schedule: {
            init: () => {
                $('.sch-cell').not('.sch-head').each(function(i) {
                    $(this).attr('data-sch-id', i);
                    $(this).append('<div class="ext-edit-overlay"><span class="material-icons" style="font-size:1rem;">edit</span></div>');
                });
                Logic.Schedule.load();

                $(document).on('click', '.sch-cell .ext-edit-overlay', function(e) {
                    e.stopPropagation();
                    const cell = $(this).parent();
                    Logic.Schedule.openEditor(cell.data('sch-id'), cell.text().trim());
                });
            },

            load: () => {
                const data = Utils.storage.get(KEYS.SCHEDULE) || {};
                $('.sch-cell[data-sch-id]').each(function() {
                    const id = $(this).data('sch-id');
                    if(data[id]) {
                        // Preserve the overlay
                        const overlay = $(this).find('.ext-edit-overlay').detach();
                        $(this).text(data[id].text).append(overlay);
                        $(this).removeClass('bg-sched-blue bg-sched-yellow bg-sched-green bg-sched-red').addClass(data[id].color);
                    }
                });
            },

            openEditor: (id, text) => {
                $('#extEditorTitle').html('<span class="material-icons">event</span> Update Schedule');
                $('#extEditorContent').html(`
                    <div class="md-input-group">
                        <label class="md-label">Plan / Activity</label>
                        <input type="text" id="schText" class="md-input" value="${text}">
                    </div>
                    <div class="md-input-group">
                        <label class="md-label">Status Color</label>
                        <select id="schColor" class="md-select">
                            <option value="">None</option>
                            <option value="bg-sched-blue">Blue (Planned)</option>
                            <option value="bg-sched-yellow">Yellow (In Progress)</option>
                            <option value="bg-sched-green">Green (Done)</option>
                            <option value="bg-sched-red">Red (Delayed)</option>
                        </select>
                    </div>
                `);

                $('#extEditorSaveBtn').off('click').on('click', () => {
                    const data = Utils.storage.get(KEYS.SCHEDULE) || {};
                    data[id] = { text: $('#schText').val(), color: $('#schColor').val() };
                    Utils.storage.set(KEYS.SCHEDULE, data);
                    Logic.Schedule.load();
                    QMExtension.UI.closeModal('extEditorModal');
                    QMExtension.UI.snack("Schedule Saved");
                });
                QMExtension.UI.openModal('extEditorModal');
            }
        },

        Process: {
            init: () => {
                $('.flow-step').each(function(i) {
                    $(this).attr('data-proc-id', i);
                    $(this).append('<div class="ext-edit-overlay"><span class="material-icons" style="color:var(--md-primary);">description</span></div>');
                });
                Logic.Process.load();

                $(document).on('click', '.flow-step .ext-edit-overlay', function(e) {
                    e.stopPropagation();
                    const step = $(this).parent();
                    Logic.Process.openEditor(step.data('proc-id'), step.find('.flow-text').text());
                });
            },
            
            load: () => {
                // Add indicator for existing SOPs
                const data = Utils.storage.get(KEYS.PROCESS) || {};
                $('.flow-step').each(function() {
                    const id = $(this).data('proc-id');
                    if(data[id] && data[id].sop) {
                         $(this).css('border-bottom', '3px solid var(--md-accent)');
                    }
                });
            },

            openEditor: (id, title) => {
                const data = Utils.storage.get(KEYS.PROCESS) || {};
                const current = data[id] || { sop: '', notes: '' };

                $('#extEditorTitle').html(`<span class="material-icons">schema</span> ${title}`);
                $('#extEditorContent').html(`
                    <div class="md-input-group">
                        <label class="md-label">Standard Operating Procedure (SOP)</label>
                        <textarea id="procSop" class="md-textarea" rows="6">${current.sop}</textarea>
                    </div>
                    <div class="md-input-group">
                        <label class="md-label">Internal Notes</label>
                        <textarea id="procNotes" class="md-textarea" rows="2">${current.notes}</textarea>
                    </div>
                `);

                $('#extEditorSaveBtn').off('click').on('click', () => {
                    const newData = Utils.storage.get(KEYS.PROCESS) || {};
                    newData[id] = { sop: $('#procSop').val(), notes: $('#procNotes').val() };
                    Utils.storage.set(KEYS.PROCESS, newData);
                    Logic.Process.load();
                    QMExtension.UI.closeModal('extEditorModal');
                    QMExtension.UI.snack("Process Details Saved");
                });
                QMExtension.UI.openModal('extEditorModal');
            }
        }
    };

    // --- 5. UI CONTROLLERS ---
    const UI = {
        openModal: (id) => {
            const el = $(`#${id}`);
            el.css('display', 'flex').animate({ opacity: 1 }, 150);
            el.find('.md-dialog').css('transform', 'translateY(20px)');
            setTimeout(() => el.find('.md-dialog').css('transform', 'translateY(0)'), 10);
        },

        closeModal: (id) => {
            const el = $(`#${id}`);
            el.animate({ opacity: 0 }, 150, () => {
                el.hide();
            });
        },

        snack: (msg) => {
            const x = $("#md-snackbar");
            x.text(msg).addClass("show");
            setTimeout(() => { x.removeClass("show"); }, 3000);
        },

        // Material Search Highlighting
        setupSearch: () => {
            $('#searchInput').on('keyup', function() {
                const val = $(this).val().toLowerCase();
                setTimeout(() => {
                    $('#auditTable tbody tr:visible td').each(function() {
                        const cell = $(this);
                        if(cell.children().length === 0 && val) {
                            const txt = cell.text();
                            if(txt.toLowerCase().includes(val)) {
                                cell.html(txt.replace(new RegExp(`(${val})`, 'gi'), 
                                    '<span style="background:var(--md-accent); color:black; padding:0 2px;">$1</span>'));
                            }
                        } else if (!val) {
                             // Reset highlight logic would go here if needed, 
                             // but simple table redraws usually handle this in main app
                        }
                    });
                }, 200);
            });
        }
    };

    // --- 6. INIT ---
    const init = () => {
        console.log("QM Extension 3.0 (Material Design) Loaded");
        injectResources();
        injectHTML();
        
        Logic.KPI.init();
        Logic.Schedule.init();
        Logic.Process.init();
        UI.setupSearch();

        // Dynamically Inject View Buttons into Audit Table
        const obs = new MutationObserver((mutations) => {
            mutations.forEach((m) => { if(m.type === 'childList') injectAuditButtons(); });
        });
        const target = document.getElementById('auditBody');
        if(target) {
            obs.observe(target, { childList: true });
            injectAuditButtons();
        }
    };

    const injectAuditButtons = () => {
        $('#auditTable tbody tr').each(function() {
            const row = $(this);
            const actionCell = row.find('td:last-child');
            if(actionCell.find('.ext-view-btn').length === 0) {
                const onclick = actionCell.find('.btn-danger').attr('onclick');
                const idMatch = onclick ? onclick.match(/(\d+)/) : null;
                
                if(idMatch) {
                    const btn = $(`
                        <button class="md-btn md-btn-text ext-view-btn" style="min-width:auto; padding:4px 8px; margin-right:4px;" title="View Details">
                            <span class="material-icons" style="font-size:1.2rem;">visibility</span>
                        </button>
                    `);
                    btn.click((e) => {
                        e.preventDefault();
                        Logic.Audits.open(parseInt(idMatch[1]));
                    });
                    actionCell.prepend(btn);
                }
            }
        });
    };

    return { init, UI, Logic };
})();
