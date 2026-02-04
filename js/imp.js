/**
 * extension.js
 * Version: 2.0 (Robust)
 * Description: Injects a responsive navigation bar with interactive dropdowns
 * and a Trend Analysis Modal system using Chart.js.
 */

(function($) {
    'use strict';

    // --- 1. CONFIGURATION & DATA ---
    const APP_CONFIG = {
        colors: {
            blue: '#3b82f6',  // Quality
            green: '#10b981', // Envi
            red: '#ef4444',   // 5S
            yellow: '#eab308',// Safety
            dark: '#0f172a',
            light: '#f1f5f9'
        },
        menu: [
            { id: 'home', title: "Home", icon: "fa-home", color: "hover:text-white", link: "indexh.html" },
            { id: 'about', title: "About Us", icon: "fa-info-circle", color: "hover:text-white", link: "#about" },
            { 
                id: 'quality', 
                title: "Quality Management", 
                icon: "fa-star", 
                color: "group-hover:text-blue-400", 
                borderColor: "border-blue-500",
                link: "Qualitymanagement.html",
                links: [
                    { label: "ISO 9001 Manual", action: "link", url: "#iso9001" },
                    { label: "Internal Audit Reports", action: "link", url: "#audit" },
                    { label: "QC Data Analytics", action: "link", url: "#qc" },
                    { label: "Customer Claims", action: "link", url: "#claims" },
                    { label: "Instrument Calibration", action: "link", url: "#calib" },
                    { label: "View Trend Analysis", action: "modal", type: "quality", icon: "fa-chart-line" } // Special Feature
                ]
            },
            { 
                id: 'envi', 
                title: "Environmental", 
                icon: "fa-leaf", 
                color: "group-hover:text-green-400", 
                borderColor: "border-green-500",
                link: "#envi",
                links: [
                    { label: "ISO 14001 Standards", action: "link", url: "#iso14001" },
                    { label: "Waste Management Log", action: "link", url: "#waste" },
                    { label: "Spill Response Control", action: "link", url: "#spill" },
                    { label: "Air & Water Monitoring", action: "link", url: "#air" },
                    { label: "Legal Register", action: "link", url: "#legal" },
                    { label: "View Emission Trends", action: "modal", type: "envi", icon: "fa-chart-line" }
                ]
            },
            { 
                id: '5s', 
                title: "MS 5S Management System", 
                icon: "fa-broom", 
                color: "group-hover:text-red-400", 
                borderColor: "border-red-500",
                link: "MSManagement.html",
                links: [
                    { label: "Seiri (Sort) Records", action: "link", url: "#seiri" },
                    { label: "Seiton (Set) Standards", action: "link", url: "#seiton" },
                    { label: "Seiso (Shine) Checklist", action: "link", url: "#seiso" },
                    { label: "Seiketsu (Standardize)", action: "link", url: "#seiketsu" },
                    { label: "Shitsuke (Sustain)", action: "link", url: "#shitsuke" },
                    { label: "View Audit Trends", action: "modal", type: "5s", icon: "fa-chart-line" }
                ]
            },
            { 
                id: 'safety', 
                title: "Safety Management", 
                icon: "fa-hard-hat", 
                color: "group-hover:text-yellow-400", 
                borderColor: "border-yellow-500",
                link: "#safety",
                links: [
                    { label: "Risk Assessment (HIRADC)", action: "link", url: "#hiradc" },
                    { label: "Incident Reporting", action: "link", url: "#incident" },
                    { label: "PPE Inventory", action: "link", url: "#ppe" },
                    { label: "Safety Toolbox Talks", action: "link", url: "#talks" },
                    { label: "Emergency Prep", action: "link", url: "#emergency" },
                    { label: "View Safety Trends", action: "modal", type: "safety", icon: "fa-chart-line" }
                ]
            }
        ],
        // Mock Data for the Trend Graph Feature
        charts: {
            quality: {
                label: 'First Pass Yield (%)',
                data: [96.5, 97.0, 96.8, 98.1, 98.4, 98.8],
                color: '#3b82f6'
            },
            envi: {
                label: 'Waste Reduction (Tons)',
                data: [45, 42, 40, 38, 35, 32],
                color: '#10b981'
            },
            '5s': {
                label: 'Audit Scores (Avg)',
                data: [82, 85, 84, 88, 90, 92],
                color: '#ef4444'
            },
            safety: {
                label: 'Near Miss Reports',
                data: [2, 5, 1, 3, 0, 1],
                color: '#eab308'
            }
        }
    };

    // --- 2. CORE CLASS ---
    class MSNavbarSystem {
        constructor() {
            this.chartInstance = null;
            this.init();
        }

        init() {
            if (typeof $ === 'undefined') {
                console.error("jQuery is missing.");
                return;
            }
            
            this.injectNavbar();
            this.injectModalHtml();
            this.bindEvents();
            console.log("MS Navbar System v2.0 Loaded");
        }

        // --- HTML GENERATORS ---
        generateNavHtml() {
            let html = `
                <div id="ms-navbar" class="w-full bg-slate-900/95 backdrop-blur-md border-y border-slate-700 mb-6 shadow-2xl relative z-40">
                    <div class="max-w-7xl mx-auto px-4">
                        <ul class="flex flex-wrap justify-center md:justify-between items-center h-auto min-h-[60px]">
            `;

            APP_CONFIG.menu.forEach(item => {
                const hasDropdown = item.links && item.links.length > 0;
                
                html += `
                    <li class="relative group h-full">
                        <a href="${item.link}" class="flex items-center gap-2 px-3 lg:px-5 py-4 text-sm font-oswald font-medium uppercase tracking-wider text-slate-400 transition-all duration-300 hover:bg-slate-800 ${item.color}">
                            <i class="fas ${item.icon} text-lg mb-0.5"></i>
                            <span>${item.title}</span>
                            ${hasDropdown ? '<i class="fas fa-chevron-down text-[10px] ml-1 opacity-50 group-hover:opacity-100 transition-transform group-hover:rotate-180"></i>' : ''}
                        </a>
                `;

                if (hasDropdown) {
                    html += `
                        <div class="absolute left-0 mt-0 w-64 bg-slate-800 border-t-4 ${item.borderColor} shadow-xl rounded-b-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top -translate-y-2 group-hover:translate-y-0 z-50 overflow-hidden">
                            <ul class="py-1">
                    `;
                    
                    item.links.forEach(link => {
                        const isAction = link.action === 'modal';
                        const iconHtml = link.icon ? `<i class="fas ${link.icon} mr-2 text-brand-gold"></i>` : `<i class="fas fa-angle-right mr-2 text-slate-600"></i>`;
                        const textClass = isAction ? "text-brand-gold font-bold bg-slate-700/50" : "text-slate-300";
                        
                        html += `
                            <li>
                                <a href="${link.url || '#'}" 
                                   class="block px-5 py-3 text-xs ${textClass} hover:bg-slate-700 hover:pl-6 transition-all border-b border-slate-700/50 last:border-0"
                                   ${isAction ? `data-action="modal" data-type="${link.type}"` : ''}>
                                   ${iconHtml} ${link.label}
                                </a>
                            </li>
                        `;
                    });

                    html += `</ul></div>`;
                }

                html += `</li>`;
            });

            html += `</ul></div></div>`;
            return html;
        }

        injectNavbar() {
            const $announcement = $('.mb-8').first(); // Target the marquee box
            const navHtml = this.generateNavHtml();

            if ($announcement.length) {
                $announcement.before(navHtml);
            } else {
                $('main').prepend(navHtml);
            }
        }

        injectModalHtml() {
            // Robust Trend Analysis Modal
            const modalHtml = `
                <div id="trendModal" class="fixed inset-0 z-[60] hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <!-- Backdrop -->
                    <div class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity opacity-0 modal-backdrop"></div>

                    <!-- Panel -->
                    <div class="fixed inset-0 z-10 overflow-y-auto">
                        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <div class="relative transform overflow-hidden rounded-lg bg-slate-800 border border-slate-600 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-3xl opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95 modal-panel">
                                
                                <!-- Header -->
                                <div class="bg-slate-700 px-4 py-3 sm:px-6 flex justify-between items-center border-b border-slate-600">
                                    <h3 class="text-lg font-oswald leading-6 text-white" id="modal-title">
                                        <i class="fas fa-chart-line text-brand-gold mr-2"></i> Performance Trend Analysis
                                    </h3>
                                    <button type="button" class="close-modal text-slate-400 hover:text-white transition">
                                        <i class="fas fa-times text-xl"></i>
                                    </button>
                                </div>

                                <!-- Body -->
                                <div class="px-4 py-5 sm:p-6">
                                    <div class="relative h-80 w-full bg-slate-900/50 rounded p-2">
                                        <canvas id="trendCanvas"></canvas>
                                    </div>
                                    <p class="mt-4 text-xs text-slate-400 text-center font-mono">
                                        <i class="fas fa-circle text-[8px] mr-1"></i> Data reflects last 6 months performance.
                                    </p>
                                </div>

                                <!-- Footer -->
                                <div class="bg-slate-700/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button type="button" class="close-modal mt-3 inline-flex w-full justify-center rounded-md bg-slate-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 sm:mt-0 sm:w-auto font-oswald uppercase tracking-wider">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            $('body').append(modalHtml);
        }

        // --- INTERACTION LOGIC ---
        bindEvents() {
            const self = this;

            // 1. Handle "Trend Analysis" clicks
            $(document).on('click', '[data-action="modal"]', function(e) {
                e.preventDefault();
                const type = $(this).data('type');
                self.openModal(type);
            });

            // 2. Close Modal
            $(document).on('click', '.close-modal, .modal-backdrop', function() {
                self.closeModal();
            });

            // 3. Escape Key to close
            $(document).on('keydown', function(e) {
                if (e.key === "Escape") self.closeModal();
            });
        }

        // --- CHARTING LOGIC ---
        openModal(type) {
            const $modal = $('#trendModal');
            const dataConfig = APP_CONFIG.charts[type];

            if (!dataConfig) return;

            // Show Modal Container
            $modal.removeClass('hidden');
            
            // Animate In (Tailwind transitions)
            setTimeout(() => {
                $modal.find('.modal-backdrop').removeClass('opacity-0');
                $modal.find('.modal-panel').removeClass('opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95');
            }, 10);

            // Render Graph
            this.renderChart(dataConfig);
        }

        closeModal() {
            const $modal = $('#trendModal');
            
            // Animate Out
            $modal.find('.modal-backdrop').addClass('opacity-0');
            $modal.find('.modal-panel').addClass('opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95');

            // Hide after animation
            setTimeout(() => {
                $modal.addClass('hidden');
                if (this.chartInstance) {
                    this.chartInstance.destroy(); // Clean up memory
                }
            }, 300);
        }

        renderChart(config) {
            const ctx = document.getElementById('trendCanvas').getContext('2d');

            if (this.chartInstance) {
                this.chartInstance.destroy();
            }

            // Create robust Gradient
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, config.color);
            gradient.addColorStop(1, 'rgba(15, 23, 42, 0)'); // Fade to dark

            this.chartInstance = new Chart(ctx, {
                type: 'line', // Trend Graph
                data: {
                    labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'],
                    datasets: [{
                        label: config.label,
                        data: config.data,
                        borderColor: config.color,
                        backgroundColor: gradient,
                        borderWidth: 3,
                        // --- Dot Graph Settings ---
                        pointStyle: 'circle',
                        pointRadius: 6,
                        pointHoverRadius: 9,
                        pointBackgroundColor: '#fff',
                        pointBorderColor: config.color,
                        pointBorderWidth: 2,
                        fill: true,
                        tension: 0.4 // Smooth curve
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        mode: 'index',
                        intersect: false,
                    },
                    plugins: {
                        legend: {
                            labels: { color: '#e2e8f0', font: { family: 'Oswald' } }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            titleFont: { family: 'Oswald' },
                            bodyFont: { family: 'Roboto' },
                            borderColor: 'rgba(255,255,255,0.1)',
                            borderWidth: 1
                        }
                    },
                    scales: {
                        x: {
                            grid: { color: 'rgba(255,255,255,0.05)' },
                            ticks: { color: '#94a3b8' }
                        },
                        y: {
                            grid: { color: 'rgba(255,255,255,0.05)' },
                            ticks: { color: '#94a3b8' }
                        }
                    }
                }
            });
        }
    }

    // --- 3. INITIALIZATION ---
    $(document).ready(function() {
        new MSNavbarSystem();
    });

})(jQuery);
