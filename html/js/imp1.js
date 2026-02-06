
/**
 * extension.js
 * Purpose: Extends the Quality Management Dashboard with:
 * 1. Advanced View Details Modal
 * 2. Interactive Comment & Reply System
 * 3. Enhanced Search Highlighting
 * 4. Robust Data Management for Collaboration
 */

$(document).ready(function () {
    QMExtension.init();
});

const QMExtension = (() => {
    const STORAGE_KEY_COMMENTS = 'QM_EXT_COMMENTS_V1';

    // --- 1. INJECTED STYLES ---
    const injectStyles = () => {
        const styles = `
            <style>
                /* Extension Modal Styles */
                .ext-modal-overlay { position: fixed; top:0; left:0; width:100%; height:100%; background:rgba(14, 36, 68, 0.85); display:none; z-index:4000; backdrop-filter: blur(4px); align-items:center; justify-content:center; }
                .ext-modal { background: #f3f4f6; width: 90%; max-width: 1000px; height: 85vh; border-radius: 8px; display: flex; flex-direction: column; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); overflow: hidden; border: 1px solid #b88a30; }
                
                .ext-header { background: #0e2444; color: #fff; padding: 15px 25px; display:flex; justify-content:space-between; align-items:center; border-bottom: 3px solid #b88a30; }
                .ext-header h2 { margin:0; font-family: 'Oswald'; font-size: 1.5rem; letter-spacing: 1px; color: #fcd34d; }
                
                .ext-body { display: flex; flex: 1; overflow: hidden; }
                
                /* Left Panel: Details */
                .ext-details-panel { flex: 1.2; padding: 25px; overflow-y: auto; background: white; border-right: 1px solid #ddd; }
                .detail-group { margin-bottom: 20px; }
                .detail-label { font-size: 0.7rem; color: #6b7280; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px; margin-bottom: 4px; }
                .detail-value { font-size: 0.95rem; color: #1f2937; font-weight: 500; border-bottom: 1px dashed #e5e7eb; padding-bottom: 5px; }
                .detail-images { display: flex; gap: 10px; margin-top: 10px; }
                .detail-img-box { width: 100px; height: 100px; border: 1px solid #ddd; border-radius: 4px; overflow: hidden; position: relative; }
                .detail-img-box img { width: 100%; height: 100%; object-fit: cover; cursor: pointer; transition: transform 0.3s; }
                .detail-img-box img:hover { transform: scale(1.1); }

                /* Right Panel: Interactive Comments */
                .ext-discuss-panel { flex: 0.8; display: flex; flex-direction: column; background: #f9fafb; }
                .discuss-header { padding: 15px; background: #fff; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #0e2444; display: flex; justify-content: space-between; align-items: center; }
                
                .discuss-list { flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 15px; }
                
                .comment-item { background: white; border-radius: 8px; padding: 12px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); border-left: 3px solid #3c78d8; position: relative; }
                .comment-meta { display: flex; justify-content: space-between; font-size: 0.75rem; color: #9ca3af; margin-bottom: 5px; }
                .comment-user { font-weight: bold; color: #0e2444; }
                .comment-text { font-size: 0.9rem; color: #374151; line-height: 1.4; white-space: pre-wrap; }
                
                .reply-list { margin-top: 10px; border-top: 1px solid #f3f4f6; padding-top: 8px; margin-left: 10px; display: none; }
                .reply-item { background: #f0f9ff; padding: 8px; border-radius: 4px; margin-bottom: 5px; border-left: 2px solid #b88a30; }
                
                .comment-actions { margin-top: 8px; display: flex; gap: 10px; font-size: 0.75rem; }
                .action-link { color: #3c78d8; cursor: pointer; text-decoration: none; font-weight: 500; }
                .action-link:hover { text-decoration: underline; }

                .discuss-input-area { padding: 15px; background: white; border-top: 1px solid #e5e7eb; }
                .discuss-input { width: 100%; border: 1px solid #d1d5db; border-radius: 6px; padding: 10px; resize: none; font-family: inherit; font-size: 0.9rem; margin-bottom: 10px; transition: border 0.2s; }
                .discuss-input:focus { outline: none; border-color: #b88a30; box-shadow: 0 0 0 3px rgba(184, 138, 48, 0.1); }

                /* Reply Input (Hidden by default) */
                .reply-box { margin-top: 8px; display: none; }
                .reply-input { width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px; font-size: 0.85rem; margin-bottom: 5px; }

                /* Highlight for search */
                .highlight-text { background-color: #fcd34d; color: #0e2444; font-weight: bold; padding: 0 2px; border-radius: 2px; }

                /* Utility Buttons */
                .btn-view { background: #3b82f6; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; margin-right: 5px; transition: 0.2s; }
                .btn-view:hover { background: #2563eb; }
                
                .btn-send { background: #0e2444; color: #fcd34d; border: 1px solid #b88a30; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold; text-transform: uppercase; font-size: 0.8rem; float: right; }
                .btn-send:hover { background: #b88a30; color: #0e2444; }

                /* Animations */
                .fade-in { animation: fadeIn 0.3s ease-in-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
            </style>
        `;
        $('head').append(styles);
    };

    // --- 2. INJECTED HTML (Modals) ---
    const injectHTML = () => {
        const modalHTML = `
            <div class="ext-modal-overlay" id="extViewModal">
                <div class="ext-modal">
                    <div class="ext-header">
                        <h2><i class="fas fa-search-plus"></i> Audit Finding Details</h2>
                        <button onclick="QMExtension.UI.closeModal()" style="background:none; border:none; color:white; font-size:1.5rem; cursor:pointer;">&times;</button>
                    </div>
                    <div class="ext-body">
                        <!-- Details Panel -->
                        <div class="ext-details-panel" id="extDetailContainer">
                            <!-- Dynamic Content Loaded Here -->
                        </div>
                        
                        <!-- Discussion Panel -->
                        <div class="ext-discuss-panel">
                            <div class="discuss-header">
                                <span><i class="fas fa-comments"></i> Collaboration</span>
                                <span class="badge bg-gray" id="commentCountBadge">0 Comments</span>
                            </div>
                            <div class="discuss-list" id="extCommentList">
                                <!-- Dynamic Comments Loaded Here -->
                            </div>
                            <div class="discuss-input-area">
                                <textarea class="discuss-input" id="extNewComment" rows="2" placeholder="Write a remark, question, or update..."></textarea>
                                <button class="btn-send" onclick="QMExtension.Actions.postComment()">Post Comment</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        $('body').append(modalHTML);
    };

    // --- 3. DATA STORE ---
    let commentsData = [];
    let currentAuditId = null;

    const Store = {
        load: () => {
            const saved = localStorage.getItem(STORAGE_KEY_COMMENTS);
            commentsData = saved ? JSON.parse(saved) : [];
        },
        save: () => {
            localStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(commentsData));
        },
        addComment: (refId, user, text) => {
            const newComment = {
                id: Date.now(),
                refId: parseInt(refId), // Audit ID
                user: user,
                text: text,
                timestamp: new Date().toISOString(),
                replies: []
            };
            commentsData.push(newComment);
            Store.save();
            return newComment;
        },
        addReply: (commentId, user, text) => {
            const comment = commentsData.find(c => c.id === commentId);
            if (comment) {
                if (!comment.replies) comment.replies = [];
                const reply = {
                    id: Date.now(),
                    user: user,
                    text: text,
                    timestamp: new Date().toISOString()
                };
                comment.replies.push(reply);
                Store.save();
                return true;
            }
            return false;
        },
        deleteComment: (commentId) => {
            commentsData = commentsData.filter(c => c.id !== commentId);
            Store.save();
        },
        getComments: (refId) => {
            return commentsData.filter(c => c.refId === parseInt(refId)).sort((a,b) => b.id - a.id); // Newest first
        }
    };

    // --- 4. UI LOGIC ---
    const UI = {
        openModal: (auditId) => {
            currentAuditId = auditId;
            Store.load(); // Ensure fresh data
            
            // Get Audit Data from existing App state (assuming access via LocalStorage or DOM)
            // Since App is an IIFE, we access data via LocalStorage 'QM_PRO_SYSTEM_V7'
            const appData = JSON.parse(localStorage.getItem('QM_PRO_SYSTEM_V7'));
            const audit = appData.audits.find(a => a.id === auditId);

            if (!audit) return alert("Audit record not found.");

            // Render Left Panel
            const detailsHtml = `
                <div class="detail-group">
                    <div class="detail-label">Item Description</div>
                    <div class="detail-value">${audit.desc}</div>
                </div>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
                    <div class="detail-group">
                        <div class="detail-label">PIC (Primary)</div>
                        <div class="detail-value"><i class="fas fa-user-circle"></i> ${audit.picPri}</div>
                    </div>
                    <div class="detail-group">
                        <div class="detail-label">PIC (Secondary)</div>
                        <div class="detail-value">${audit.picSec || '-'}</div>
                    </div>
                    <div class="detail-group">
                        <div class="detail-label">Target Date</div>
                        <div class="detail-value">${audit.targetDate}</div>
                    </div>
                    <div class="detail-group">
                        <div class="detail-label">Status</div>
                        <div class="detail-value">
                            <span class="badge ${audit.status === 'Closed' ? 'bg-green' : 'bg-orange'}">${audit.status}</span>
                            (${audit.progress}%)
                        </div>
                    </div>
                </div>
                <div class="detail-group">
                    <div class="detail-label">Plan of Action</div>
                    <div class="detail-value">${audit.plan || 'No plan recorded'}</div>
                </div>
                <div class="detail-group">
                    <div class="detail-label">Corrective Action Taken</div>
                    <div class="detail-value">${audit.caTaken || 'Pending'}</div>
                </div>
                
                <div class="detail-group">
                    <div class="detail-label">Evidence</div>
                    <div class="detail-images">
                        <div class="detail-img-box">
                            ${audit.imgBefore ? `<img src="${audit.imgBefore}" onclick="window.open(this.src)">` : '<div style="padding:10px; font-size:0.7rem; text-align:center;">No Before Image</div>'}
                        </div>
                        <div class="detail-img-box">
                            ${audit.imgAfter ? `<img src="${audit.imgAfter}" onclick="window.open(this.src)">` : '<div style="padding:10px; font-size:0.7rem; text-align:center;">No After Image</div>'}
                        </div>
                    </div>
                </div>
            `;
            $('#extDetailContainer').html(detailsHtml);

            // Render Right Panel (Comments)
            UI.renderComments();

            $('#extViewModal').css('display', 'flex').hide().fadeIn(200);
        },

        closeModal: () => {
            $('#extViewModal').fadeOut(200);
            currentAuditId = null;
        },

        renderComments: () => {
            const comments = Store.getComments(currentAuditId);
            $('#commentCountBadge').text(`${comments.length} Comments`);
            
            if (comments.length === 0) {
                $('#extCommentList').html('<div style="text-align:center; color:#999; margin-top:20px; font-style:italic;">No comments yet. Start the discussion.</div>');
                return;
            }

            const html = comments.map(c => {
                const date = new Date(c.timestamp).toLocaleString();
                const repliesHtml = c.replies && c.replies.length > 0 ? 
                    c.replies.map(r => `
                        <div class="reply-item">
                            <div style="font-size:0.7rem; font-weight:bold;">${r.user} <span style="font-weight:normal; color:#888;">${new Date(r.timestamp).toLocaleTimeString()}</span></div>
                            <div style="font-size:0.85rem;">${r.text}</div>
                        </div>
                    `).join('') : '';
                
                const replyCount = c.replies ? c.replies.length : 0;
                const toggleText = replyCount > 0 ? `Show Replies (${replyCount})` : '';

                return `
                <div class="comment-item fade-in" id="comment-${c.id}">
                    <div class="comment-meta">
                        <span class="comment-user"><i class="fas fa-user"></i> ${c.user}</span>
                        <span>${date}</span>
                    </div>
                    <div class="comment-text">${c.text}</div>
                    
                    <div class="comment-actions">
                        <span class="action-link" onclick="QMExtension.Actions.toggleReplyBox(${c.id})"><i class="fas fa-reply"></i> Reply</span>
                        ${replyCount > 0 ? `<span class="action-link" onclick="QMExtension.Actions.toggleReplies(${c.id})">${toggleText}</span>` : ''}
                        <span class="action-link" style="color:#dc2626; margin-left:auto;" onclick="QMExtension.Actions.deleteComment(${c.id})"><i class="fas fa-trash"></i></span>
                    </div>

                    <div class="reply-list" id="replies-${c.id}">
                        ${repliesHtml}
                    </div>

                    <div class="reply-box" id="reply-box-${c.id}">
                        <input type="text" class="reply-input" id="reply-input-${c.id}" placeholder="Type reply and press Enter..." onkeypress="QMExtension.Actions.handleReplyEnter(event, ${c.id})">
                        <div style="text-align:right;">
                            <button class="btn btn-sm btn-navy" onclick="QMExtension.Actions.submitReply(${c.id})">Send</button>
                        </div>
                    </div>
                </div>
                `;
            }).join('');

            $('#extCommentList').html(html);
        }
    };

    // --- 5. ACTIONS & LOGIC ---
    const Actions = {
        postComment: () => {
            const txt = $('#extNewComment').val().trim();
            if (!txt) return;
            
            // Simulate User (In real app, get from auth)
            const user = "Manager"; 
            Store.addComment(currentAuditId, user, txt);
            
            $('#extNewComment').val('');
            UI.renderComments();
        },

        deleteComment: (id) => {
            if(confirm("Delete this comment?")) {
                Store.deleteComment(id);
                UI.renderComments();
            }
        },

        toggleReplyBox: (id) => {
            $(`#reply-box-${id}`).slideToggle(150);
            setTimeout(() => $(`#reply-input-${id}`).focus(), 200);
        },

        toggleReplies: (id) => {
            $(`#replies-${id}`).slideToggle(150);
        },

        handleReplyEnter: (e, id) => {
            if (e.key === 'Enter') Actions.submitReply(id);
        },

        submitReply: (id) => {
            const input = $(`#reply-input-${id}`);
            const text = input.val().trim();
            if(!text) return;

            Store.addReply(id, "Supervisor", text);
            input.val('');
            $(`#reply-box-${id}`).hide();
            UI.renderComments(); // Re-render to show nested reply
        },

        // Search Highlighting Enhancement
        highlightSearch: () => {
            const term = $('#searchInput').val().toLowerCase();
            const table = document.getElementById('auditTable');
            
            if (!term) {
                $('#auditTable td span.highlight-text').contents().unwrap();
                return;
            }

            // Simple text walker to highlight
            // Note: This runs after the original App search filters the rows
            $('#auditTable tbody tr:visible td').each(function() {
                const text = $(this).text();
                if (text.toLowerCase().indexOf(term) > -1 && $(this).children().length === 0) {
                   const regex = new RegExp(`(${term})`, 'gi');
                   const newHtml = text.replace(regex, '<span class="highlight-text">$1</span>');
                   $(this).html(newHtml);
                }
            });
        }
    };

    // --- 6. DOM OBSERVER & INIT ---
    // Since the original App renders table via innerHTML, we need to re-inject buttons
    const setupTableHooks = () => {
        const targetNode = document.getElementById('auditBody');
        const config = { childList: true };

        const callback = function(mutationsList, observer) {
            for(const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    injectViewButtons();
                }
            }
        };

        const observer = new MutationObserver(callback);
        if(targetNode) observer.observe(targetNode, config);
        
        // Initial Injection
        injectViewButtons();
        
        // Hook search input for highlighting
        $('#searchInput').on('keyup', function() {
            setTimeout(Actions.highlightSearch, 100);
        });
    };

    const injectViewButtons = () => {
        // Find Action cells and prepend View button if not exists
        $('#auditTable tbody tr').each(function() {
            const row = $(this);
            const actionCell = row.find('td:last-child');
            // Get ID from the "Delete" button onclick attribute (hacky but works for provided code)
            // Original: onclick="App.deleteAudit(123)"
            const deleteBtnHtml = actionCell.html();
            const match = deleteBtnHtml ? deleteBtnHtml.match(/deleteAudit\((\d+)\)/) : null;
            
            if (match && actionCell.find('.btn-view').length === 0) {
                const id = match[1];
                const viewBtn = `<button class="btn-sm btn-view" onclick="QMExtension.UI.openModal(${id})"><i class="fas fa-eye"></i> View</button>`;
                actionCell.prepend(viewBtn);
            }
        });
        Actions.highlightSearch(); // Re-apply highlight if needed
    };

    const init = () => {
        console.log("QM Extension: Initializing...");
        injectStyles();
        injectHTML();
        Store.load();
        
        // Wait slightly for original App to render first time
        setTimeout(() => {
            setupTableHooks();
        }, 500);

        // Expose to Global Scope for onclick handlers in HTML
        window.QMExtension = {
            UI: UI,
            Actions: Actions
        };
    };

    return { init, UI, Actions };
})();
