/**
 * extension.js
 * Enhances the MS Section Dashboard with a functional, interactive Navigation Bar.
 * Place this file in your directory and link it at the bottom of your HTML body.
 */

$(document).ready(function() {

    // --- Configuration: Menu Data Structure ---
    const navStructure = [
        { 
            title: "Home", 
            icon: "fa-home", 
            color: "text-white", 
            hover: "hover:text-brand-gold", 
            link: "indexh.html", 
            dropdown: null 
        },
        { 
            title: "About Us", 
            icon: "fa-info-circle", 
            color: "text-white", 
            hover: "hover:text-brand-gold", 
            link: "#about", 
            dropdown: null 
        },
        { 
            title: "Quality Management", 
            icon: "fa-star", 
            color: "group-hover:text-blue-400", 
            border: "border-blue-500",
            link: "Qualitymanagement.html",
            dropdown: [
                { name: "ISO 9001 Manual", url: "#iso9001" },
                { name: "Internal Audit Reports", url: "#audit-q" },
                { name: "QC Data Analytics", url: "#qc-data" },
                { name: "Customer Claims", url: "#claims" },
                { name: "Instrument Calibration", url: "#calibration" },
                { name: "Improvement Projects (QIP)", url: "#qip" }
            ]
        },
        { 
            title: "Environmental", 
            icon: "fa-leaf", 
            color: "group-hover:text-green-400", 
            border: "border-green-500",
            link: "#envi",
            dropdown: [
                { name: "ISO 14001 Standards", url: "#iso14001" },
                { name: "Waste Management Log", url: "#waste" },
                { name: "Spill Response Control", url: "#spill" },
                { name: "Air & Water Monitoring", url: "#monitoring" },
                { name: "Legal Register", url: "#legal" },
                { name: "Carbon Footprint Data", url: "#carbon" }
            ]
        },
        { 
            title: "MS 5S Management", 
            icon: "fa-broom", 
            color: "group-hover:text-red-400", 
            border: "border-red-500",
            link: "MSManagement.html",
            dropdown: [
                { name: "Seiri (Sort) Records", url: "#seiri" },
                { name: "Seiton (Set) Standards", url: "#seiton" },
                { name: "Seiso (Shine) Checklist", url: "#seiso" },
                { name: "Seiketsu (Standardize)", url: "#seiketsu" },
                { name: "Shitsuke (Sustain) Audit", url: "#shitsuke" },
                { name: "Red Tag Strategy", url: "#redtag" }
            ]
        },
        { 
            title: "Safety Management", 
            icon: "fa-hard-hat", 
            color: "group-hover:text-yellow-400", 
            border: "border-yellow-500",
            link: "#safety",
            dropdown: [
                { name: "Risk Assessment (HIRADC)", url: "#risk" },
                { name: "Incident Reporting", url: "#incident" },
                { name: "PPE Inventory", url: "#ppe" },
                { name: "Safety Toolbox Talks", url: "#talks" },
                { name: "Emergency Prep", url: "#emergency" },
                { name: "Work Permits", url: "#permits" }
            ]
        }
    ];

    // --- HTML Generation ---
    
    // Create the container
    let navBarHTML = `
        <div id="extension-navbar" class="w-full bg-slate-800/90 backdrop-blur-md border-b border-t border-slate-600 mb-6 shadow-2xl relative z-40 transform transition-all duration-500 ease-in-out">
            <div class="max-w-7xl mx-auto px-4">
                <ul class="flex flex-wrap justify-center items-center gap-1 md:gap-4 lg:gap-8 h-auto min-h-[60px] py-2">
    `;

    // Loop through data to build links
    navStructure.forEach(item => {
        const hasDropdown = item.dropdown !== null;
        
        navBarHTML += `
            <li class="relative group h-full flex items-center">
                <a href="${item.link}" class="flex items-center gap-2 px-4 py-2 text-sm font-oswald font-medium uppercase tracking-wider text-slate-300 transition-colors duration-300 ${item.hover || ''} ${item.color}">
                    <i class="fas ${item.icon}"></i>
                    <span>${item.title}</span>
                    ${hasDropdown ? '<i class="fas fa-chevron-down text-[10px] ml-1 opacity-50 group-hover:opacity-100 transition-opacity"></i>' : ''}
                </a>
        `;

        // Build Dropdown if exists
        if (hasDropdown) {
            navBarHTML += `
                <div class="absolute top-full left-0 mt-0 w-64 bg-slate-900 border-t-4 ${item.border} shadow-xl rounded-b-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top -translate-y-2 group-hover:translate-y-0 z-50 overflow-hidden">
                    <ul class="py-2">
            `;
            
            item.dropdown.forEach(subItem => {
                navBarHTML += `
                    <li>
                        <a href="${subItem.url}" class="block px-5 py-3 text-xs text-slate-400 hover:bg-slate-800 hover:text-white hover:pl-7 transition-all border-b border-slate-800 last:border-0" onclick="handleMenuClick('${subItem.name}')">
                            <i class="fas fa-caret-right mr-2 text-slate-600"></i> ${subItem.name}
                        </a>
                    </li>
                `;
            });

            navBarHTML += `
                    </ul>
                </div>
            `;
        }

        navBarHTML += `</li>`;
    });

    navBarHTML += `
                </ul>
            </div>
        </div>
    `;

    // --- DOM Injection ---

    // Select the main container
    const $mainContainer = $('main');
    
    // Select the Announcement Div (The ticker)
    // Based on HTML provided: div with class mb-8, border-l-4, brand-gold
    const $announcementDiv = $mainContainer.find('.mb-8').first();

    // Inject the Navbar BEFORE the announcement
    if ($announcementDiv.length) {
        $announcementDiv.before(navBarHTML);
        console.log("Extension: Navigation injected successfully.");
    } else {
        // Fallback: Prepend to main if announcement not found
        $mainContainer.prepend(navBarHTML);
        console.warn("Extension: Announcement div not found, prepending to main.");
    }

    // --- Interaction Logic (Simulated) ---
    window.handleMenuClick = function(menuName) {
        // Prevent default jump for demo purposes
        // In production, this would simply allow the href to work
        console.log(`Navigating to module: ${menuName}`);
        
        // Visual feedback
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-5 right-5 bg-brand-blue border border-brand-gold text-white px-6 py-3 rounded shadow-lg z-50 font-oswald text-sm animate-pulse';
        notification.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i> Loading ${menuName}...`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 1500);
    };
});
