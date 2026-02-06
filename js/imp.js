/**
 * imp.js
 * Version: 2.1 (Enhanced)
 * Description: Injects a responsive navigation bar, handles active state highlighting,
 * and manages Trend Analysis Modals via Chart.js.
 */

(function($) {
    'use strict';

    // --- 1. CONFIGURATION & DATA ---
    const APP_CONFIG = {
        // Defines the visual themes for different sections
        themes: {
            quality: { color: '#0ea5e9', gradient: ['rgba(14, 165, 233, 0.5)', 'rgba(14, 165, 233, 0)'] },
            envi:    { color: '#10b981', gradient: ['rgba(16, 185, 129, 0.5)', 'rgba(16, 185, 129, 0)'] },
            '5s':    { color: '#ef4444', gradient: ['rgba(239, 68, 68, 0.5)', 'rgba(239, 68, 68, 0)'] },
            safety:  { color: '#eab308', gradient: ['rgba(234, 179, 8, 0.5)', 'rgba(234, 179, 8, 0)'] }
        },
        
        // Navigation Structure
        menu: [
            { id: 'home', title: "Overview", icon: "fa-chart-pie", color: "hover:text-white", link: "indexh.html" },
            { 
                id: 'quality', 
                title: "Quality", 
                icon: "fa-certificate", 
                color: "group-hover:text-brand-blue", 
                borderColor: "border-brand-blue",
                link: "Qualitymanagement.html",
                links: [
                    { label: "ISO 9001 Manual", action: "link", url: "#" },
                    { label: "Internal Audit Reports", action: "link", url: "#" },
                    { label: "QC Data Analytics", action: "link", url: "#" },
                    { label: "Trend Analysis", action: "modal", type: "quality", icon: "fa-chart-line" }
                ]
            },
            { 
                id: '5s', 
                title: "5S System", 
                icon: "fa-broom", 
                color: "group-hover:text-brand-red", 
                borderColor: "border-brand-red",
                link: "MSManagement.html",
                links: [
                    { label: "Seiri (Sort) Records", action: "link", url: "#" },
                    { label: "Objectives Monitoring", action: "link", url: "#" },
                    { label: "Audit Trends", action: "modal", type: "5s", icon: "fa-chart-line" }
                ]
            },
            { 
                id: 'envi', 
                title: "Envi", 
                icon: "fa-leaf", 
                color: "group-hover:text-brand-green", 
                borderColor: "border-brand-green",
                link: "#",
                locked: true, // Visual Indicator
                links: [
                    { label: "ISO 14001 Standards", action: "link", url: "#" },
                    { label: "Emission Trends", action: "modal", type: "envi", icon: "fa-chart-line" }
                ]
            },
            { 
                id: 'safety', 
                title: "Safety", 
                icon: "fa-shield-alt", 
                color: "group-hover:text-brand-yellow", 
                borderColor: "border-brand-yellow",
                link: "#",
                locked: true,
                links: [
                    { label: "Incident Reporting", action: "link", url: "#" },
                    { label: "Safety Trends", action: "modal", type: "safety", icon: "fa-chart-line" }
                ]
            }
        ],

        // Mock Data for Charts
        charts: {
            quality: { label: 'First Pass Yield (%)', data: [96.5, 97.0, 96.8, 98.1, 98.4, 98.8], theme: 'quality' },
            envi:    { label: 'Waste Reduction (Tons)', data: [45, 42, 40, 38, 35, 32], theme: 'envi' },
            '5s':    { label: 'Audit Scores (Avg)', data: [82, 85, 84, 88, 90, 92], theme: '5s' },
            safety:  { label: 'Near Miss Reports', data: [2, 5, 1, 3, 0, 1], theme: 'safety' }
        }
    };

    // --- 2. CORE CLASS ---
    class MSNavbarSystem {
        constructor() {
            this.chartInstance = null;
            this.currentFile = window.location.pathname.split("/").pop() || "indexh.html";
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
            console.log("MS Navbar System v2.1 Loaded");
        }

        // --- HTML GENERATORS ---
        generateNavHtml() {
            // Main Container
            let html = `
                <div id="ms-navbar" class="w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-700 shadow-xl sticky top-0 z-50">
                    <div class="max-w-7xl mx-auto px-4">
                        <ul class="flex flex-wrap justify-center md:justify-center items-center">
            `;

            APP_CONFIG.menu.forEach(item => {
                const hasDropdown = item.links && item.links.length > 0;
                // Check if this menu item matches current page
                const isActive = item.link === this.currentFile;
                const activeClass = isActive ? "bg-slate-800 text-white border-b-2 " + item.borderColor.replace('border', 'border') : "text-slate-400";
                
                html += `
                    <li class="relative group">
                        <a href="${item.link}" class="flex items-center gap-2 px-6 py-4 text-sm font-oswald font-medium uppercase tracking-wider transition-all duration-300 hover:bg-slate-800 ${item.color} ${activeClass}">
                            <i class="fas ${item.icon} text-lg mb-0.5 ${item.locked ? 'opacity-70' : ''}"></i>
                            <span>${item.title}</span>
                            ${item.locked ? '<i class="fas fa-lock text-[10px] ml-1 opacity-50"></i>' : ''}
                            ${hasDropdown ? '<i class="fas fa-chevron-down text-[10px] ml-1 opacity-50 group-hover:opacity-100 transition-transform group-hover:rotate-180"></i>' : ''}
                        </a>
                `;

                if (hasDropdown) {
                    html += `
                        <div class="absolute left-0 mt-0 w-60 bg-slate-800 border-t-2 ${item.borderColor} shadow-2xl rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top -translate-y-2 group-hover:translate-y-0 z-50 overflow-hidden ring-1 ring-slate-700">
                            <ul class="py-1">
                    `;
                    
                    item.links.forEach(link => {
                        const isAction = link.action === 'modal';
                        const iconHtml = link.icon ? `<i class="fas ${link.icon} mr-2 text-brand-gold w-4 text-center"></i>` : `<i class="fas fa-angle-right mr-2 text-slate-600 w-4 text-center"></i>`;
                        const bgClass = isAction ? "bg-slate-700/30 hover:bg-slate-700" : "hover:bg-slate-700";
                        const textClass = isAction ? "text-brand-gold font-bold" : "text-slate-300";
                        
                        html += `
                            <li>
                                <a href="${link.url || '#'}" 
                                   class="block px-4 py-3 text-xs ${textClass} ${bgClass} transition-all border-b border-slate-700/50 last:border-0"
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
            const navHtml = this.generateNavHtml();
            const $placeholder = $('#nav-placeholder');
            const $loadingBar = $('.loading-bar');

            if ($placeholder.length) {
                $placeholder.html(navHtml);
            } else if ($loadingBar.length) {
                $loadingBar.after(navHtml);
            } else {
                $('body').prepend(navHtml);
            }
        }

        injectModalHtml() {
            if ($('#trendModal').length) return; // Prevent double injection

            const modalHtml = `
                <div id="trendModal" class="fixed inset-0 z-[100] hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <!-- Backdrop -->
                    <div class="fixed inset-0 bg-slate-900/90 backdrop-blur-sm transition-opacity opacity-0 modal-backdrop"></div>

                    <!-- Panel -->
                    <div class="fixed inset-0 z-10 overflow-y-auto">
                        <div class="flex min-h-full items-center justify-center p-4 text-center">
                            <div class="relative transform overflow-hidden rounded-xl bg-slate-800 border border-slate-600 text-left shadow-2xl transition-all opacity-0 translate-y-4 sm:scale-95 modal-panel w-full max-w-4xl">
                                
                                <!-- Header -->
                                <div class="bg-slate-900/50 px-6 py-4 flex justify-between items-center border-b border-slate-700">
                                    <h3 class="text-xl font-oswald text-white tracking-wide" id="modal-title">
                                        <i class="fas fa-chart-area text-brand-gold mr-2"></i> Performance Trend Analysis
                                    </h3>
                                    <button type="button" class="close-modal text-slate-400 hover:text-white hover:bg-slate-700 rounded-full w-8 h-8 flex items-center justify-center transition">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>

                                <!-- Body -->
                                <div class="px-6 py-6">
                                    <div class="relative h-96 w-full bg-slate-900 rounded-lg p-4 border border-slate-700/50 shadow-inner">
                                        <canvas id="trendCanvas"></canvas>
                                    </div>
                                    <div class="mt-4 flex justify-center gap-4 text-[10px] uppercase tracking-widest text-slate-500 font-oswald">
                                        <span><i class="fas fa-circle text-brand-blue mr-1"></i> Quality</span>
                                        <span><i class="fas fa-circle text-brand-red mr-1"></i> 5S</span>
                                        <span><i class="fas fa-circle text-brand-green mr-1"></i> Envi</span>
                                        <span><i class="fas fa-circle text-brand-yellow mr-1"></i> Safety</span>
                                    </div>
                                </div>

                                <!-- Footer -->
                                <div class="bg-slate-900/50 px-6 py-4 flex justify-end">
                                    <button type="button" class="close-modal inline-flex justify-center rounded bg-slate-700 px-4 py-2 text-xs font-bold text-white uppercase tracking-wider hover:bg-slate-600 transition border border-slate-600">Close Panel</button>
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

            // Handle Modal Triggers
            $(document).on('click', '[data-action="modal"]', function(e) {
                e.preventDefault();
                const type = $(this).data('type');
                self.openModal(type);
            });

            // Close Modal Actions
            $(document).on('click', '.close-modal, .modal-backdrop', function() {
                self.closeModal();
            });

            // Escape Key
            $(document).on('keydown', function(e) {
                if (e.key === "Escape") self.closeModal();
            });
        }

        // --- CHARTING LOGIC ---
        openModal(type) {
            const $modal = $('#trendModal');
            const dataConfig = APP_CONFIG.charts[type];

            if (!dataConfig) return;

            // Show Modal
            $modal.removeClass('hidden');
            
            // CSS Animation Class Toggle
            setTimeout(() => {
                $modal.find('.modal-backdrop').removeClass('opacity-0');
                $modal.find('.modal-panel').removeClass('opacity-0 translate-y-4 sm:scale-95').addClass('opacity-100 translate-y-0 sm:scale-100');
            }, 10);

            // Render Graph
            this.renderChart(dataConfig);
        }

        closeModal() {
            const $modal = $('#trendModal');
            
            // Animation Out
            $modal.find('.modal-backdrop').addClass('opacity-0');
            $modal.find('.modal-panel').removeClass('opacity-100 translate-y-0 sm:scale-100').addClass('opacity-0 translate-y-4 sm:scale-95');

            // Hide after transition
            setTimeout(() => {
                $modal.addClass('hidden');
                if (this.chartInstance) {
                    this.chartInstance.destroy();
                }
            }, 300);
        }

        renderChart(config) {
            const ctx = document.getElementById('trendCanvas').getContext('2d');
            const theme = APP_CONFIG.themes[config.theme];

            if (this.chartInstance) {
                this.chartInstance.destroy();
            }

            // Create Gradient
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, theme.gradient[0]);
            gradient.addColorStop(1, theme.gradient[1]);

            this.chartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: config.label,
                        data: config.data,
                        borderColor: theme.color,
                        backgroundColor: gradient,
                        borderWidth: 3,
                        pointBackgroundColor: '#1e293b',
                        pointBorderColor: theme.color,
                        pointBorderWidth: 2,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        fill: true,
                        tension: 0.3
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { labels: { color: '#cbd5e1', font: { family: 'Oswald' } } },
                        tooltip: {
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            titleFont: { family: 'Oswald', size: 14 },
                            bodyFont: { family: 'Roboto' },
                            borderColor: 'rgba(255,255,255,0.1)',
                            borderWidth: 1,
                            padding: 10,
                            displayColors: false
                        }
                    },
                    scales: {
                        x: {
                            grid: { color: 'rgba(255,255,255,0.05)' },
                            ticks: { color: '#94a3b8', font: { family: 'Oswald' } }
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
