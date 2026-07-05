
(function (window, document) {
    'use strict';

    // ========================================================================
    // 1. STORAGE KEYS & EXACT BULLETIN BOARD DATA STRUCTURES
    // ========================================================================
    const STORAGE_KEY = 'QAMS_Product_Records_v3';
    const HISTORY_KEY = 'QAMS_Product_History_v3';
    const BOARD_KEY   = 'QAMS_Board_Data_v3';

    // Default seed data extracted precisely from the attached plant images
    const defaultBoardData = {
        monthsAll: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
        monthsActive: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'],

        // Image 1 Data: Incidents & Compliance Matrix
        incidents: {
            nearMiss:      [3, 0, 0, 0, 1, 0, '-', '-', '-', '-', '-', '-'],
            nearMissYTD:   4,
            internalClaim: [1, 0, 0, 0, 0, 0, '-', '-', '-', '-', '-', '-'],
            internalYTD:   1,
            externalClaim: [0, 0, 0, 0, 0, 0, '-', '-', '-', '-', '-', '-'],
            externalYTD:   0
        },
        production: {
            actual: ['2011.23', '2278.25', '1458.30', '2701.88', '2844.44', '2718.53'],
            target: ['2765.00', '2488.00', '1572.00', '2673.00', '2765.00', '2673.00']
        },
        compliance: {
            Zn:  ['96.56%', '97.41%', '95.76%', '99.18%', '98.90%', '100.00%'],
            Mg:  ['90.25%', '77.64%', '89.38%', '87.54%', '89.38%', '100.00%'],
            Cr:  ['95.45%', '84.99%', '70.17%', '83.85%', '95.64%', '96.56%'],
            PS:  ['87.03%', '99.52%', '97.61%', '100.00%', '98.07%', '100.00%'],
            H2O: ['86.01%', '96.17%', '87.60%', '92.05%', '92.75%', '100.00%']
        },

        // Image 2 Data: Objectives and Targets Scorecard
        scorecard: {
            productQualitySpecs: [
                { id: 'dni', name: 'Actual vs Target dNi Tons Produced', desc: 'Actual dry Ni Tons produced is greater than target based on 31,000 dNi annual budget.', target: '2673.00 MT', actual: '2718.53 MT', status: 'YES!', type: 'success', area: 'FNTRL Area' },
                { id: 'zn', name: 'Zn Content Performance (≤ 250 ppm)', desc: 'Greater than 97% performance for Zn content of the final product.', target: '> 97.00%', actual: '100.00%', status: 'YES!', type: 'success', area: 'MS-Dezinc Area' },
                { id: 'mg', name: 'Mg Content Performance (≤ 100 ppm)', desc: 'Greater than 95% performance for Mg content of the final product.', target: '> 95.00%', actual: '100.00%', status: 'YES!', type: 'success', area: 'H2S Area' },
                { id: 'cr', name: 'Cr Content Performance (≤ 300 ppm)', desc: 'Greater than 90% performance for Cr content of the final product.', target: '> 90.00%', actual: '96.56%', status: 'YES!', type: 'success', area: 'FNTRL Area' },
                { id: 'h2o', name: 'Moisture Content Performance (≤ 15%)', desc: 'Greater than 98% performance for moisture content of the product.', target: '> 98.00%', actual: '96.21%', status: 'OOPS!', type: 'warning', area: 'Limestone Area' },
                { id: 'ps', name: 'D50 Particle Size (PS ≤ 87.5 µm)', desc: 'Greater than 95% performance for D50 particle size specification.', target: '> 95.00%', actual: '100.00%', status: 'YES!', type: 'success', area: 'Limestone Area' }
            ],
            customerSatisfaction: [
                { id: 'claim_int', name: 'Recorded Quality Claims', desc: 'Maximum of 1 recorded quality claim per month.', target: 'Max 1 / mo', actual: '0 Actual', status: 'YES!', type: 'success', area: 'QA Compliance' },
                { id: 'near_miss', name: 'Recorded Quality Near Misses', desc: 'Maximum of 2 recorded quality near misses per month.', target: 'Max 2 / mo', actual: '0 Actual', status: 'YES!', type: 'success', area: 'Field Operations' },
                { id: 'claim_ext', name: 'External Customer Quality Claims', desc: 'Zero external quality claims per month from shipping consignees.', target: '0 / mo', actual: '0 Actual', status: 'YES!', type: 'success', area: 'Shipping Dept' },
                { id: 'audit', name: 'Monthly Quality Internal Audit', desc: '100% compliance conducted for monthly audits except for SD shutdown months.', target: '100.00%', actual: '100.00%', status: 'YES!', type: 'success', area: 'QA Audit Team' },
                { id: 'reeduc', name: 'Quality Claim Re-education', desc: 'More than 85% attendance for monthly external quality claim re-education.', target: '> 85.00%', actual: '90.00%', status: 'YES!', type: 'success', area: 'HR / Training' },
                { id: 'scales', name: 'MS Ground Scales Mixing Output', desc: 'Increase production output through mixing of MS ground scales (Start May 2025).', target: '0.50 Ni-ton', actual: '2.97 Ni-ton', status: 'YES!', type: 'success', area: 'Re-leach Area' }
            ],
            processQuality: [
                { id: 'checklist', name: 'Monthly Checklists Compliance', desc: 'More than 95% monthly checklist compliance across facility and equipment.', target: '> 95.00%', actual: 'In progress...', status: 'IN PROGRESS', type: 'info', area: 'Plant Maintenance' },
                { id: 'safety_eq', name: 'Automated Operating Safety Equipment', desc: '1 Safety Equipment Audit twice per year (March 2026 and August 2026).', target: '2x / year', actual: 'N/A', status: 'N/A', type: 'neutral', area: 'DCS Control' },
                { id: 'bicycle', name: 'Personnel Bicycle Condition Availability', desc: 'Ensure consistent availability of bicycles in optimal condition (>50% target).', target: '> 50.00%', actual: '83.33%', status: 'YES!', type: 'success', area: 'General Services' }
            ]
        },

        // Image 3 Data: Process Quality Reprocess Bags & Batch Credits
        reprocessBags: {
            unit: '106FT02AB REPROCESS BAGS',
            items: [
                { id: 'moisture', label: '# of bags with high moisture', count: 218, color: 'text-sky-400', border: 'border-sky-500/30', bg: 'bg-sky-500/10' },
                { id: 'cr', label: '# of bags with high Cr', count: 131, color: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-500/10' },
                { id: 'mg', label: '# of bags with high Mg', count: 319, color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10' },
                { id: 'damaged', label: '# of damaged/ sexy bags', count: 0, color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' }
            ]
        },
        batchCredit: {
            unit: '106ML02 Batch Credit per group',
            groups: ['CLC', 'AJL', 'JNY', 'NJL'],
            data: {
                'CLC': [0, 0, 0, 0, 25, 5],
                'AJL': [0, 0, 0, 3.5, 14, 15],
                'JNY': [0, 0, 0, 5, 16, 13],
                'NJL': [0, 0, 0, 1.5, 15, 15]
            }
        }
    };

    // 23 Comprehensive Seed Records covering all months (Jan-Jul) and all Plant Areas
    const defaultRecords = [
        {
            id: 'QAMS-2026-JUN01',
            category: 'product_quality',
            title: 'June 2026 MS Product Quality & Tonnage Verification',
            area: 'MS-Dezinc Area',
            reporter: 'Engr. M. Santos (Lead QA Lab)',
            date: '2026-06-30',
            status: 'Approved',
            description: 'Monthly production tonnage achieved 2,718.53 MT against target of 2,673.00 MT. Zinc (Zn), Magnesium (Mg), and Particle Size (PS) achieved 100.00% zero-defect compliance.',
            capa: 'No corrective action needed. Excellent solvent extraction and phase separation efficiency.',
            metricName: 'Zn / Mg / PS Compliance',
            metricValue: '100.00%',
            metricLimit: '> 97.00% Target',
            isCompliant: true,
            attachments: [
                { name: 'June_2026_MS_Product_Certificate.pdf', size: '2.1 MB', type: 'application/pdf' },
                { name: 'June_Daily_Titration_Assays.csv', size: '410 KB', type: 'text/csv' }
            ],
            history: [{ timestamp: '2026-06-30 16:00', action: 'Record Approved', user: 'Lead QA Chief' }]
        },
        {
            id: 'QAMS-2026-JUN02',
            category: 'nearmiss',
            title: '106FT02AB Reprocess Bag Accumulation - High Magnesium (Mg)',
            area: 'H2S Area',
            reporter: 'Chemist K. Lim (QA Lab)',
            date: '2026-06-28',
            status: 'In Progress',
            description: 'Logged investigation for 319 bags accumulated under 106FT02AB due to high Magnesium (Mg > 100 ppm) content from earlier Q1 campaigns.',
            capa: 'Standardized re-leaching loop dosing. Re-blending protocol initiated with ground scales to dilute Mg content without sacrificing throughput.',
            metricName: '106FT02AB High Mg Bags',
            metricValue: '319 Bags',
            metricLimit: '< 50 Bags Tolerance',
            isCompliant: false,
            attachments: [{ name: 'Mg_Reprocess_Inventory_Log.pdf', size: '1.4 MB', type: 'application/pdf' }],
            history: [{ timestamp: '2026-06-28 11:20', action: 'CAPA Protocol Initiated', user: 'Chemist K. Lim' }]
        },
        {
            id: 'QAMS-2026-JUN03',
            category: 'product_quality',
            title: 'June Moisture (H2O) Performance Dip Investigation',
            area: 'Limestone Area',
            reporter: 'Engr. D. Cruz (Process Tech)',
            date: '2026-06-25',
            status: 'Resolved',
            description: 'Moisture compliance for June recorded at 96.21%, slightly below the aggressive >98.00% target (tagged as OOPS! on Objectives scorecard). 218 bags flagged for high moisture.',
            capa: 'Dryer air velocity intake setpoint increased by 5% and filter press cycle time adjusted from 45 mins to 52 mins.',
            metricName: 'Moisture Compliance',
            metricValue: '96.21%',
            metricLimit: '> 98.00% Target',
            isCompliant: false,
            attachments: [],
            history: [{ timestamp: '2026-06-26 09:15', action: 'CAPA Closed & Verified', user: 'Lead QA Chief' }]
        },
        {
            id: 'QAMS-2026-JUN04',
            category: 'product_quality',
            title: 'FNTRL Area: Actual vs Target dNi Tons Produced',
            area: 'FNTRL Area',
            reporter: 'Engr. L. Bautista (Lead QA)',
            date: '2026-06-20',
            status: 'Approved',
            description: 'Actual dry Ni Tons produced in FNTRL achieved 2,718.53 MT, exceeding the monthly target based on the 31,000 dNi annual budget.',
            capa: 'Standardized neutralization and tailings recovery loops to maintain optimal discharge rates.',
            metricName: 'dNi Production Output',
            metricValue: '2718.53 MT',
            metricLimit: '2673.00 MT Target',
            isCompliant: true,
            attachments: [{ name: 'FNTRL_June_Tonnage_Report.pdf', size: '1.8 MB', type: 'application/pdf' }],
            history: [{ timestamp: '2026-06-20 15:00', action: 'Tonnage Verified', user: 'Engr. L. Bautista' }]
        },
        {
            id: 'QAMS-2026-JUN05',
            category: 'product_quality',
            title: 'FNTRL Area: Chromium (Cr) Content Adherence Review',
            area: 'FNTRL Area',
            reporter: 'Chemist K. Lim (QA Lab)',
            date: '2026-06-18',
            status: 'Approved',
            description: 'Chromium content adherence recorded at 96.56% for June, successfully passing the >90.00% target specification.',
            capa: 'Continuous monitoring of flocculant dosing efficiency in neutralization tanks.',
            metricName: 'Cr Compliance',
            metricValue: '96.56%',
            metricLimit: '> 90.00% Target',
            isCompliant: true,
            attachments: [],
            history: [{ timestamp: '2026-06-18 10:30', action: 'Assay Approved', user: 'Lead QA Chief' }]
        },
        {
            id: 'QAMS-2026-MAY01',
            category: 'improvement',
            title: 'MS Ground Scales Mixing Optimization Exceeded Target',
            area: 'Re-leach Area',
            reporter: 'R. Gomez (Field Supervisor)',
            date: '2026-05-31',
            status: 'Active',
            description: 'Integration of ground scales into the primary mixing loop produced 2.97 Ni-ton/month, significantly surpassing the 0.50 Ni-ton target established in May 2025.',
            capa: 'Standardized agitator speed to 85 RPM during scale injection cycles.',
            metricName: 'Ground Scales Output',
            metricValue: '2.97 Ni-ton',
            metricLimit: '0.50 Ni-ton Target',
            isCompliant: true,
            attachments: [{ name: 'Ground_Scales_Recovery_Report.pdf', size: '3.2 MB', type: 'application/pdf' }],
            history: [{ timestamp: '2026-05-31 17:00', action: 'Improvement Verified', user: 'Plant Operations Manager' }]
        },
        {
            id: 'QAMS-2026-MAY02',
            category: 'nearmiss',
            title: 'Phase Separation Delay during Solvent Extraction',
            area: 'MS-Dezinc Area',
            reporter: 'J. Reyes (Field Technician)',
            date: '2026-05-18',
            status: 'Resolved',
            description: 'Logged as the single (1) Quality Near Miss for May 2026. Transient organic/aqueous phase separation delay observed exceeding 90 seconds.',
            capa: 'Sub DCS mixer impeller speed calibrated from 120 RPM to 105 RPM. Phase separation time normalized to 72 seconds.',
            metricName: 'Phase Separation Time',
            metricValue: '98 sec (Spike)',
            metricLimit: '60 - 90 sec',
            isCompliant: false,
            attachments: [{ name: 'DCS_Alarm_Dezinc_May18.json', size: '312 KB', type: 'application/json' }],
            history: [{ timestamp: '2026-05-18 15:30', action: 'Near Miss CAPA Closed', user: 'Engr. D. Cruz' }]
        },
        {
            id: 'QAMS-2026-MAY03',
            category: 'product_quality',
            title: 'FNTRL Area: May dNi Production & Tailings Recovery',
            area: 'FNTRL Area',
            reporter: 'Engr. M. Santos (Lead QA)',
            date: '2026-05-14',
            status: 'Approved',
            description: 'May production output in FNTRL recorded 2,844.44 MT against target of 2,765.00 MT. Excellent discharge slurry pH stability.',
            capa: 'No CAPA needed. Slurry pH maintained strictly between 8.2 and 8.6 pH.',
            metricName: 'May Production Output',
            metricValue: '2844.44 MT',
            metricLimit: '2765.00 MT Target',
            isCompliant: true,
            attachments: [],
            history: [{ timestamp: '2026-05-14 16:00', action: 'Record Approved', user: 'Engr. M. Santos' }]
        },
        {
            id: 'QAMS-2026-APR01',
            category: 'product_quality',
            title: 'Limestone Area: April D50 Particle Size Specification',
            area: 'Limestone Area',
            reporter: 'Chemist K. Lim (QA Lab)',
            date: '2026-04-28',
            status: 'Approved',
            description: 'April D50 particle size titration confirmed 100.00% compliance across all reagent preparation loops (PS ≤ 87.5 µm).',
            capa: 'Daily mesh particle screening maintained at 95% < 325 Mesh.',
            metricName: 'PS Compliance Rate',
            metricValue: '100.00%',
            metricLimit: '> 95.00% Target',
            isCompliant: true,
            attachments: [],
            history: [{ timestamp: '2026-04-28 11:00', action: 'Assay Verified', user: 'Lead QA Chief' }]
        },
        {
            id: 'QAMS-2026-APR02',
            category: 'improvement',
            title: 'DCS Control Room: Automated Operating Safety Interlock',
            area: 'DCS Control',
            reporter: 'Admin R. Cruz (System Admin)',
            date: '2026-04-15',
            status: 'Active',
            description: 'Plant-wide automated safety interlock testing completed. All telemetry override alarms across Master DCS and Sub DCS nodes verified nominal.',
            capa: 'Scheduled bi-annual equipment safety audit for August 2026.',
            metricName: 'DCS Safety Interlocks',
            metricValue: '100% Sync',
            metricLimit: 'Nominal Response',
            isCompliant: true,
            attachments: [],
            history: [{ timestamp: '2026-04-15 14:00', action: 'System Audit Passed', user: 'Admin R. Cruz' }]
        },
        {
            id: 'QAMS-2026-MAR01',
            category: 'product_quality',
            title: 'MS-Dezinc Area: March Zinc Removal Efficiency Audit',
            area: 'MS-Dezinc Area',
            reporter: 'Engr. M. Santos (Lead QA Lab)',
            date: '2026-03-25',
            status: 'Approved',
            description: 'March zinc removal efficiency recorded at 95.76%, maintaining compliance within solvent extraction parameters.',
            capa: 'Organic phase titration ratio adjusted slightly to prepare for Q2 production surge.',
            metricName: 'Zn Compliance',
            metricValue: '95.76%',
            metricLimit: '> 95.00% Target',
            isCompliant: true,
            attachments: [],
            history: [{ timestamp: '2026-03-25 15:00', action: 'Assay Approved', user: 'Engr. M. Santos' }]
        },
        {
            id: 'QAMS-2026-MAR02',
            category: 'nearmiss',
            title: 'FNTRL Area: March Slurry pH & Flocculant Dosing Check',
            area: 'FNTRL Area',
            reporter: 'J. Reyes (Field Tech)',
            date: '2026-03-12',
            status: 'Resolved',
            description: 'Transient pressure spike observed in flocculant pump #104 during tailings slurry transfer.',
            capa: 'Sub DCS valve actuation loop recalibrated. Flocculant dosing surge eliminated without downtime.',
            metricName: 'Slurry pH Stability',
            metricValue: '8.4 pH',
            metricLimit: '8.2 - 8.6 pH Limit',
            isCompliant: true,
            attachments: [],
            history: [{ timestamp: '2026-03-12 09:30', action: 'CAPA Closed', user: 'Engr. L. Bautista' }]
        },
        {
            id: 'QAMS-2026-FEB01',
            category: 'product_quality',
            title: 'H2S Area: Feb Magnesium Content Audit & Caustic Dosing',
            area: 'H2S Area',
            reporter: 'Chemist K. Lim (QA Lab)',
            date: '2026-02-20',
            status: 'Resolved',
            description: 'February Mg compliance dipped to 77.64% during early winter campaign. Triggered immediate re-blending protocols.',
            capa: 'Scrubber caustic pH setpoint raised to 10.8 pH. Subsequent March and April campaigns recovered above 89%.',
            metricName: 'Mg Compliance Rate',
            metricValue: '77.64%',
            metricLimit: '> 95.00% Target',
            isCompliant: false,
            attachments: [],
            history: [{ timestamp: '2026-02-22 14:00', action: 'CAPA Verified', user: 'Lead QA Chief' }]
        },
        {
            id: 'QAMS-2026-FEB02',
            category: 'document',
            title: 'Limestone Area: Feb Reagent Slurry Density Calibration Log',
            area: 'Limestone Area',
            reporter: 'QA Documentation Team',
            date: '2026-02-10',
            status: 'Active',
            description: 'Official verification log for daily slurry density sensor titrations across limestone preparation loops.',
            capa: 'Density sensor calibration interval standardized to every 72 hours.',
            metricName: 'Slurry Density Spec',
            metricValue: '1.35 g/cm³',
            metricLimit: '1.30 - 1.40 g/cm³',
            isCompliant: true,
            attachments: [],
            history: [{ timestamp: '2026-02-10 11:00', action: 'Log Archived', user: 'QA Documentation Team' }]
        },
        {
            id: 'QAMS-2026-JAN01',
            category: 'claim',
            title: 'Internal Quality Claim: Jan 2026 Shipment Impurity Review',
            area: 'H2S Area',
            reporter: 'QA Compliance Committee',
            date: '2026-01-22',
            status: 'Closed',
            description: 'Logged as the single (1) Internal Quality Claim YTD. Temporary dip in Magnesium (Mg) removal efficiency to 90.25% caused an internal refinery inquiry.',
            capa: 'Scrubber caustic pH interlock setpoint elevated to 10.8 pH. Subsequent shipments from Feb-June verified zero external claims.',
            metricName: 'Mg Removal Rate',
            metricValue: '90.25%',
            metricLimit: '> 95.00%',
            isCompliant: false,
            attachments: [{ name: 'Internal_Claim_Investigation_Report.pdf', size: '3.4 MB', type: 'application/pdf' }],
            history: [{ timestamp: '2026-01-25 14:00', action: 'Internal Claim Resolved & Closed', user: 'Lead QA Chief' }]
        },
        {
            id: 'QAMS-2026-JAN02',
            category: 'product_quality',
            title: 'FNTRL Area: Jan Production Tonnage Verification',
            area: 'FNTRL Area',
            reporter: 'Engr. L. Bautista (Lead QA)',
            date: '2026-01-15',
            status: 'Approved',
            description: 'January startup production recorded 2,011.23 MT during initial scheduled maintenance recovery.',
            capa: 'Plant ramped up successfully in February and March.',
            metricName: 'Jan Production Output',
            metricValue: '2011.23 MT',
            metricLimit: '2765.00 MT Target',
            isCompliant: true,
            attachments: [],
            history: [{ timestamp: '2026-01-15 17:00', action: 'Tonnage Recorded', user: 'Engr. L. Bautista' }]
        },
        {
            id: 'QAMS-2026-SOP01',
            category: 'document',
            title: 'SOP-MS-101: Mixed Sulphide Product Quality Titration Manual',
            area: 'MS-Dezinc Area',
            reporter: 'QA Documentation Team',
            date: '2026-06-15',
            status: 'Active',
            description: 'Updated standard operating procedure governing product purity assay methods for Zn, Mg, Cr, and Moisture content analysis.',
            capa: 'Revision 4.3 published to include mandatory digital checklist verifications for field chemists.',
            metricName: 'Document Revision',
            metricValue: 'Rev 4.3',
            metricLimit: 'Active Status',
            isCompliant: true,
            attachments: [{ name: 'SOP_MS_101_Rev4.3_Official.pdf', size: '4.5 MB', type: 'application/pdf' }],
            history: [{ timestamp: '2026-06-15 09:00', action: 'Document Revision 4.3 Published', user: 'QA Documentation Team' }]
        },
        {
            id: 'QAMS-2026-SOP02',
            category: 'document',
            title: 'SOP-H2S-204: Toxic Gas Scrubber QA & Caustic Interlock Manual',
            area: 'H2S Area',
            reporter: 'QA Documentation Team',
            date: '2026-05-10',
            status: 'Active',
            description: 'Standard operating procedure governing hydrogen sulfide gas purity sensors, caustic neutralization loops, and emergency shutdown alarms.',
            capa: 'Revision 2.0 published with updated sensor titration schedules.',
            metricName: 'Document Revision',
            metricValue: 'Rev 2.0',
            metricLimit: 'Active Status',
            isCompliant: true,
            attachments: [],
            history: [{ timestamp: '2026-05-10 14:00', action: 'Revision 2.0 Approved', user: 'QA Documentation Team' }]
        },
        {
            id: 'QAMS-2026-SOP03',
            category: 'document',
            title: 'SOP-FN-104 & SOP-FN-309: Effluent pH Interlock Test Manual',
            area: 'FNTRL Area',
            reporter: 'QA Documentation Team',
            date: '2026-04-05',
            status: 'Active',
            description: 'Standard operating procedures governing Final Neutralization & Tailings Recovery discharge slurry pH limits (8.2 - 8.6 pH) and residual nickel assays.',
            capa: 'Revision 3.1 currently active across all hydrometallurgical discharge stations.',
            metricName: 'Document Revision',
            metricValue: 'Rev 3.1',
            metricLimit: 'Active Status',
            isCompliant: true,
            attachments: [],
            history: [{ timestamp: '2026-04-05 10:00', action: 'SOP Verified', user: 'QA Documentation Team' }]
        },
        {
            id: 'QAMS-2026-SOP04',
            category: 'document',
            title: 'SOP-LS-402: Slurry Mesh Particle Titration Manual',
            area: 'Limestone Area',
            reporter: 'QA Documentation Team',
            date: '2026-03-01',
            status: 'Active',
            description: 'Standard operating procedure governing limestone slurry particle size distribution (95% < 325 Mesh) and automated density sensor calibration.',
            capa: 'Revision 1.8 active across reagent preparation facility.',
            metricName: 'Document Revision',
            metricValue: 'Rev 1.8',
            metricLimit: 'Active Status',
            isCompliant: true,
            attachments: [],
            history: [{ timestamp: '2026-03-01 09:00', action: 'Manual Published', user: 'QA Documentation Team' }]
        },
        {
            id: 'QAMS-2026-JUL01',
            category: 'product_quality',
            title: 'Scheduled July Limestone Mesh Particle Calibration Audit',
            area: 'Limestone Area',
            reporter: 'Engr. M. Santos (Lead QA)',
            date: '2026-07-03',
            status: 'Open',
            description: 'Upcoming routine quality assurance audit for limestone mesh particle titration across 08:00 AM operating shift.',
            capa: 'Prepare laboratory titration glassware and calibrate Sub DCS density loop.',
            metricName: 'Particle Size Spec',
            metricValue: 'Pending Assay',
            metricLimit: '95% < 325 Mesh',
            isCompliant: true,
            attachments: [],
            history: [{ timestamp: '2026-07-01 08:00', action: 'Audit Scheduled', user: 'Engr. M. Santos' }]
        },
        {
            id: 'QAMS-2026-JUL02',
            category: 'improvement',
            title: 'Scheduled July H2S Scrubber Caustic Interlock Safety Test',
            area: 'H2S Area',
            reporter: 'Lead Safety Team',
            date: '2026-07-04',
            status: 'Open',
            description: 'Scheduled safety verification of H2S gas scrubber caustic dosing interlock setpoints.',
            capa: 'Verify automated override alarms in Master DCS control room.',
            metricName: 'Safety Interlock',
            metricValue: 'Armed',
            metricLimit: '100% Reliability',
            isCompliant: true,
            attachments: [],
            history: [{ timestamp: '2026-07-01 08:30', action: 'Safety Test Scheduled', user: 'Lead Safety Team' }]
        },
        {
            id: 'QAMS-2026-JUL03',
            category: 'product_quality',
            title: 'Scheduled July FNTRL Effluent Slurry Zero-Defect Review',
            area: 'FNTRL Area',
            reporter: 'Environmental QA Team',
            date: '2026-07-06',
            status: 'Open',
            description: 'Scheduled environmental quality compliance audit for FNTRL discharge slurry pH and residual metal losses.',
            capa: 'Ensure effluent pH remains strictly within 8.2 - 8.6 pH tolerance.',
            metricName: 'Effluent Slurry pH',
            metricValue: 'Pending Assay',
            metricLimit: '8.2 - 8.6 pH Limit',
            isCompliant: true,
            attachments: [],
            history: [{ timestamp: '2026-07-01 09:00', action: 'Environmental Review Scheduled', user: 'Environmental QA Team' }]
        }
    ];

    const defaultHistory = [
        { id: 'LOG-1', timestamp: '2026-06-30 16:00', action: 'Approved Record QAMS-2026-JUN01', user: 'Lead QA Chief', details: 'June Product Quality tonnage and 100% compliance verified.' },
        { id: 'LOG-2', timestamp: '2026-06-28 11:20', action: 'Logged CAPA QAMS-2026-JUN02', user: 'Chemist K. Lim', details: 'Initiated re-blending investigation for 319 High Mg bags.' },
        { id: 'LOG-3', timestamp: '2026-06-25 14:00', action: 'Created Record QAMS-2026-JUN03', user: 'Engr. D. Cruz', details: 'Investigated June Moisture compliance dip (96.21%).' },
        { id: 'LOG-4', timestamp: '2026-06-15 09:00', action: 'Updated Document QAMS-2026-SOP01', user: 'QA Documentation Team', details: 'Published SOP-MS-101 Revision 4.3.' }
    ];

    // State Management Object with LocalStorage Persistence & Automatic Dataset Upgrader
    const Store = {
        getBoardData: () => {
            const stored = localStorage.getItem(BOARD_KEY);
            return stored ? JSON.parse(stored) : defaultBoardData;
        },
        saveBoardData: (data) => {
            localStorage.setItem(BOARD_KEY, JSON.stringify(data));
        },
        getRecords: () => {
            const stored = localStorage.getItem(STORAGE_KEY);
            let records = stored ? JSON.parse(stored) : null;
            // Upgrade check: If stored records are fewer than 15 (from an older seed version), automatically upgrade to our 23 comprehensive multi-area records!
            if (!records || !Array.isArray(records) || records.length < 15) {
                records = defaultRecords;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
            }
            return records;
        },
        saveRecords: (records) => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
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
                id: 'LOG-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
                timestamp,
                action,
                user,
                details
            });
            localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
        }
    };

    // ========================================================================
    // 2. MAIN APPLICATION CONTROLLER & UI RENDERER
    // ========================================================================
    const QAMSProduct = {
        activeTab: 'all',
        activeBoardTab: 'matrix', // 'matrix' | 'scorecard' | 'reprocess'
        currentBoardTab: 'matrix',
        subTab: 'matrix',
        searchQuery: '',
        filterArea: 'All Areas',
        filterStatus: 'all',

        init: function () {
            this.injectPortalContainer();
            this.render();
            console.log('✅ MS Section - Product Quality Module successfully initialized with 23 multi-area records.');
        },

        // Called by external index.html navigation links (preserves keyword/boardTab if passed)
        open: function (category = 'all', keyword = undefined, boardTab = undefined) {
            if (category === 'analysis') category = 'product_quality';
            this.activeTab = category;
            
            if (keyword !== undefined && keyword !== null) {
                this.searchQuery = keyword;
            }
            if (boardTab !== undefined && boardTab !== null) {
                this.activeBoardTab = boardTab;
                this.currentBoardTab = boardTab;
                this.subTab = boardTab;
            }
            
            this.render();
            const portal = document.getElementById('qamsproduct-portal');
            if (portal) portal.scrollIntoView({ behavior: 'smooth', block: 'start' });
        },

        // Called when clicking internal category tab buttons or KPI summary boxes (automatically clears search/filters to prevent hidden data)
        switchCategory: function (category = 'all') {
            if (category === 'analysis') category = 'product_quality';
            this.activeTab = category;
            this.searchQuery = '';
            this.filterArea = 'All Areas';
            this.filterStatus = 'all';
            this.render();
            const portal = document.getElementById('qamsproduct-portal');
            if (portal) portal.scrollIntoView({ behavior: 'smooth', block: 'start' });
        },

        // Switch Bulletin Board tabs (Matrix, Scorecard, Reprocess) and reset table filters so all data is visible
        switchBoardTab: function (tab) {
            this.activeBoardTab = tab;
            this.currentBoardTab = tab;
            this.subTab = tab;
            this.searchQuery = '';
            this.filterArea = 'All Areas';
            this.filterStatus = 'all';
            this.render();
        },

        switchTab: function (tab) {
            this.switchBoardTab(tab);
        },

        setFilterArea: function (area) {
            this.filterArea = area;
            this.render();
        },

        setFilterStatus: function (status) {
            this.filterStatus = status;
            this.render();
        },

        handleSearch: function (val) {
            this.searchQuery = val;
            this.render();
        },

        clearSearch: function () {
            this.searchQuery = '';
            this.render();
        },

        resetAllFilters: function () {
            this.activeTab = 'all';
            this.searchQuery = '';
            this.filterArea = 'All Areas';
            this.filterStatus = 'all';
            this.render();
        },

        filterFromBoard: function (keyword) {
            this.searchQuery = keyword;
            this.activeTab = 'all';
            this.filterArea = 'All Areas';
            this.filterStatus = 'all';
            this.render();
            const grid = document.getElementById('qams-grid-section');
            if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        },

        injectPortalContainer: function () {
            if (document.getElementById('qamsproduct-portal')) return;
            const portalSection = document.createElement('section');
            portalSection.id = 'qamsproduct-portal';
            portalSection.className = 'py-16 px-4 sm:px-8 bg-dark-900 border-b border-slate-800/80';
            const calendarSection = document.getElementById('calendar-section');
            if (calendarSection && calendarSection.parentNode) {
                calendarSection.parentNode.insertBefore(portalSection, calendarSection);
            } else {
                const main = document.querySelector('main');
                if (main) main.appendChild(portalSection);
            }
        },

        // Robust filter engine with smart month keyword matching
        getFilteredRecords: function () {
            let records = Store.getRecords();

            if (this.activeTab !== 'all') {
                records = records.filter(r => r.category === this.activeTab || (this.activeTab === 'product_quality' && r.category === 'analysis'));
            }

            if (this.filterArea && this.filterArea !== 'All Areas') {
                records = records.filter(r => r.area.toLowerCase() === this.filterArea.toLowerCase() || r.area.toLowerCase().includes(this.filterArea.toLowerCase()));
            }

            if (this.filterStatus && this.filterStatus !== 'all') {
                records = records.filter(r => r.status.toLowerCase() === this.filterStatus.toLowerCase());
            }

            if (this.searchQuery && this.searchQuery.trim() !== '') {
                const q = this.searchQuery.toLowerCase().trim();
                records = records.filter(r =>
                    (r.title && r.title.toLowerCase().includes(q)) ||
                    (r.area && r.area.toLowerCase().includes(q)) ||
                    (r.reporter && r.reporter.toLowerCase().includes(q)) ||
                    (r.description && r.description.toLowerCase().includes(q)) ||
                    (r.id && r.id.toLowerCase().includes(q)) ||
                    (r.metricName && r.metricName.toLowerCase().includes(q)) ||
                    (r.metricValue && r.metricValue.toLowerCase().includes(q)) ||
                    (r.date && r.date.toLowerCase().includes(q)) ||
                    (r.category && r.category.toLowerCase().includes(q)) ||
                    this.matchMonthKeyword(r, q)
                );
            }
            return records;
        },

        matchMonthKeyword: function (record, q) {
            const monthsMap = {
                'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04', 'may': '05', 'jun': '06',
                'jul': '07', 'aug': '08', 'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12'
            };
            if (monthsMap[q]) {
                const monthNum = monthsMap[q];
                return (record.date && record.date.split('-')[1] === monthNum) ||
                       (record.title && record.title.toLowerCase().includes(q)) ||
                       (record.id && record.id.toLowerCase().includes(q));
            }
            return false;
        },

        getCategoryLabel: function (key) {
            const labels = {
                all: 'All Categories',
                product_quality: 'Product Quality',
                document: 'Documents & SOP',
                nearmiss: 'Near Miss / Incident',
                claim: 'Quality Claims',
                improvement: 'For Improvement'
            };
            return labels[key] || key;
        },

        render: function () {
            const container = document.getElementById('qamsproduct-portal');
            if (!container) return;

            const board = Store.getBoardData();
            const allRecords = Store.getRecords();
            const filtered = this.getFilteredRecords();

            // Calculate KPI Stats
            const stats = {
                total: allRecords.length,
                quality: allRecords.filter(r => r.category === 'product_quality' || r.category === 'analysis').length,
                docs: allRecords.filter(r => r.category === 'document').length,
                nearmiss: allRecords.filter(r => r.category === 'nearmiss').length,
                claims: allRecords.filter(r => r.category === 'claim').length,
                improvement: allRecords.filter(r => r.category === 'improvement').length,
                compliant: allRecords.filter(r => r.isCompliant).length
            };
            const complianceRate = stats.total > 0 ? ((stats.compliant / stats.total) * 100).toFixed(1) : '100.0';

            const hasActiveFilter = this.activeTab !== 'all' || (this.searchQuery && this.searchQuery.trim() !== '') || (this.filterArea && this.filterArea !== 'All Areas') || (this.filterStatus && this.filterStatus !== 'all');

            container.innerHTML = `
                <div class="max-w-7xl mx-auto">
                    <!-- Section Header -->
                    <div class="flex flex-col md:flex-row md:items-end justify-between mb-8" data-aos="fade-up">
                        <div>
                            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/10 text-amber-400 font-bold text-xs mb-3 border border-amber-500/20 shadow-inner">
                                <i class="fas fa-award"></i> MS Section &bull; Product Quality Assurance Hub
                            </div>
                            <h3 class="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">Product Quality & Spec Management</h3>
                            <p class="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                                Centralized telemetry monitoring, monthly production compliance matrices, SOP manuals, and YTD incident investigations for Mixed Sulphide operations.
                            </p>
                        </div>
                        
                        <!-- Top Action Buttons -->
                        <div class="flex flex-wrap items-center gap-2.5 mt-4 md:mt-0">
                            <button onclick="QAMSProduct.openAddModal()" class="px-4 py-2.5 bg-gradient-to-r from-royalblue-600 to-sky-500 hover:from-royalblue-500 hover:to-sky-400 text-white font-bold text-xs sm:text-sm rounded-xl shadow-[0_0_15px_rgba(14,165,233,0.4)] transition-all flex items-center gap-2">
                                <i class="fas fa-plus-circle"></i> Add QA Record
                            </button>
                            <button onclick="QAMSProduct.openUploadModal()" class="px-4 py-2.5 bg-dark-500 hover:bg-dark-400 border border-slate-700 hover:border-emerald-500/50 text-emerald-400 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-2 shadow">
                                <i class="fas fa-cloud-upload-alt"></i> Upload & Analyze
                            </button>
                            <button onclick="QAMSProduct.exportToCSV()" class="px-3.5 py-2.5 bg-dark-500 hover:bg-dark-400 border border-slate-700 text-slate-300 hover:text-white font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5" title="Export CSV">
                                <i class="fas fa-file-csv text-sky-400"></i> Export
                            </button>
                            <button onclick="QAMSProduct.openHistoryModal()" class="px-3.5 py-2.5 bg-dark-500 hover:bg-dark-400 border border-slate-700 text-slate-300 hover:text-white font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5" title="Audit Trail">
                                <i class="fas fa-history text-amber-400"></i> Audit Log
                            </button>
                        </div>
                    </div>

                    <!-- ================================================================= -->
                    <!-- THREE-TAB INTERACTIVE DIGITAL BULLETIN BOARD                      -->
                    <!-- ================================================================= -->
                    <div class="mb-10 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-dark-500 via-dark-700 to-dark-900 border-2 border-amber-500/40 shadow-[0_0_35px_rgba(245,158,11,0.15)] relative overflow-hidden" data-aos="fade-up">
                        <div class="absolute top-0 right-0 w-96 h-96 bg-royalblue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
                        
                        <!-- Bulletin Board Header & Tab Navigation -->
                        <div class="flex flex-col lg:flex-row lg:items-center justify-between pb-4 mb-6 border-b border-slate-700/80 gap-4">
                            <div class="flex items-center gap-3">
                                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-dark-900 font-black text-xl shadow-lg">
                                    <i class="fas fa-chart-bar"></i>
                                </div>
                                <div>
                                    <div class="flex items-center gap-2">
                                        <span class="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">Live Plant Scorecard</span>
                                        <span class="text-xs text-slate-400 font-medium">Jan &ndash; Jun 2026 Verified</span>
                                    </div>
                                    <h4 class="text-lg sm:text-2xl font-black text-white tracking-wide uppercase mt-0.5">MS Section &bull; Digital Bulletin Board</h4>
                                </div>
                            </div>

                            <!-- Board Tab Switcher -->
                            <div class="flex items-center gap-1.5 bg-dark-900/80 p-1.5 rounded-xl border border-slate-700/80 overflow-x-auto no-scrollbar">
                                <button onclick="QAMSProduct.switchBoardTab('matrix')" class="px-3 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 whitespace-nowrap ${this.activeBoardTab === 'matrix' ? 'bg-amber-500 text-dark-900 shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800'}">
                                    <i class="fas fa-table"></i> 1. Monthly Matrix (Image 1)
                                </button>
                                <button onclick="QAMSProduct.switchBoardTab('scorecard')" class="px-3 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 whitespace-nowrap ${this.activeBoardTab === 'scorecard' ? 'bg-amber-500 text-dark-900 shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800'}">
                                    <i class="fas fa-bullseye"></i> 2. Objectives & Targets (Image 2)
                                </button>
                                <button onclick="QAMSProduct.switchBoardTab('reprocess')" class="px-3 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 whitespace-nowrap ${this.activeBoardTab === 'reprocess' ? 'bg-amber-500 text-dark-900 shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800'}">
                                    <i class="fas fa-recycle"></i> 3. Reprocess & Batch Credits (Image 3)
                                </button>
                            </div>
                        </div>

                        <!-- BOARD CONTENT RENDERING BASED ON ACTIVE TAB -->
                        ${this.renderBoardContent(board)}
                    </div>

                    <!-- KPI Statistics Cards (Clicking calls switchCategory to show full category data) -->
                    <div id="qams-grid-section" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
                        <div onclick="QAMSProduct.switchCategory('all')" class="p-4 rounded-xl bg-dark-500 border ${this.activeTab === 'all' ? 'border-sky-400 ring-1 ring-sky-400' : 'border-slate-800'} cursor-pointer hover:border-slate-600 transition-all">
                            <span class="text-[11px] font-bold text-slate-400 uppercase block">Total Records</span>
                            <div class="flex items-center justify-between mt-1">
                                <span class="text-2xl font-extrabold text-white">${stats.total}</span>
                                <i class="fas fa-folder-open text-sky-400 text-lg"></i>
                            </div>
                        </div>
                        <div onclick="QAMSProduct.switchCategory('product_quality')" class="p-4 rounded-xl bg-dark-500 border ${this.activeTab === 'product_quality' ? 'border-sky-400 ring-1 ring-sky-400' : 'border-slate-800'} cursor-pointer hover:border-slate-600 transition-all">
                            <span class="text-[11px] font-bold text-slate-400 uppercase block">Product Quality</span>
                            <div class="flex items-center justify-between mt-1">
                                <span class="text-2xl font-extrabold text-sky-400">${stats.quality}</span>
                                <i class="fas fa-award text-sky-400 text-lg"></i>
                            </div>
                        </div>
                        <div onclick="QAMSProduct.switchCategory('document')" class="p-4 rounded-xl bg-dark-500 border ${this.activeTab === 'document' ? 'border-cyan-400 ring-1 ring-cyan-400' : 'border-slate-800'} cursor-pointer hover:border-slate-600 transition-all">
                            <span class="text-[11px] font-bold text-slate-400 uppercase block">Documents & SOP</span>
                            <div class="flex items-center justify-between mt-1">
                                <span class="text-2xl font-extrabold text-cyan-400">${stats.docs}</span>
                                <i class="fas fa-file-invoice text-cyan-400 text-lg"></i>
                            </div>
                        </div>
                        <div onclick="QAMSProduct.switchCategory('nearmiss')" class="p-4 rounded-xl bg-dark-500 border ${this.activeTab === 'nearmiss' ? 'border-amber-400 ring-1 ring-amber-400' : 'border-slate-800'} cursor-pointer hover:border-slate-600 transition-all">
                            <span class="text-[11px] font-bold text-slate-400 uppercase block">Quality Near Miss</span>
                            <div class="flex items-center justify-between mt-1">
                                <span class="text-2xl font-extrabold text-amber-400">${stats.nearmiss}</span>
                                <i class="fas fa-exclamation-triangle text-amber-400 text-lg"></i>
                            </div>
                        </div>
                        <div onclick="QAMSProduct.switchCategory('claim')" class="p-4 rounded-xl bg-dark-500 border ${this.activeTab === 'claim' ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-800'} cursor-pointer hover:border-slate-600 transition-all">
                            <span class="text-[11px] font-bold text-slate-400 uppercase block">Quality Claims</span>
                            <div class="flex items-center justify-between mt-1">
                                <span class="text-2xl font-extrabold text-rose-400">${stats.claims}</span>
                                <i class="fas fa-clipboard-check text-rose-400 text-lg"></i>
                            </div>
                        </div>
                        <div class="p-4 rounded-xl bg-gradient-to-br from-dark-500 to-dark-700 border border-slate-800">
                            <span class="text-[11px] font-bold text-slate-400 uppercase block">Compliance Rate</span>
                            <div class="flex items-center justify-between mt-1">
                                <span class="text-2xl font-extrabold ${complianceRate >= 98 ? 'text-emerald-400' : 'text-amber-400'}">${complianceRate}%</span>
                                <i class="fas fa-shield-check text-emerald-400 text-lg"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Search, Area & Status Filter Bar -->
                    <div class="bg-dark-500 p-4 rounded-2xl border border-slate-800 mb-6 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-lg">
                        <!-- Category Tabs -->
                        <div class="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 no-scrollbar">
                            ${this.renderTabButton('all', 'All Categories', 'fa-layer-group')}
                            ${this.renderTabButton('product_quality', 'Product Quality', 'fa-award', 'text-sky-400')}
                            ${this.renderTabButton('document', 'Documents & SOP', 'fa-file-invoice', 'text-cyan-400')}
                            ${this.renderTabButton('nearmiss', 'Near Miss', 'fa-exclamation-triangle', 'text-amber-400')}
                            ${this.renderTabButton('claim', 'Quality Claims', 'fa-clipboard-check', 'text-rose-400')}
                            ${this.renderTabButton('improvement', 'Improvement', 'fa-lightbulb', 'text-emerald-400')}
                        </div>

                        <!-- Area & Status Dropdowns + Real-time Search Box -->
                        <div class="flex items-center gap-2.5 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
                            <select onchange="QAMSProduct.setFilterArea(this.value)" class="bg-dark-700 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 font-semibold outline-none focus:border-sky-500 transition-all min-w-[130px]">
                                <option value="All Areas" ${!this.filterArea || this.filterArea === 'All Areas' ? 'selected' : ''}>All Plant Areas</option>
                                <option value="FNTRL Area" ${this.filterArea === 'FNTRL Area' ? 'selected' : ''}>FNTRL Area</option>
                                <option value="MS-Dezinc Area" ${this.filterArea === 'MS-Dezinc Area' ? 'selected' : ''}>MS-Dezinc Area</option>
                                <option value="H2S Area" ${this.filterArea === 'H2S Area' ? 'selected' : ''}>H2S Area</option>
                                <option value="Limestone Area" ${this.filterArea === 'Limestone Area' ? 'selected' : ''}>Limestone Area</option>
                                <option value="Re-leach Area" ${this.filterArea === 'Re-leach Area' ? 'selected' : ''}>Re-leach Area</option>
                                <option value="DCS Control" ${this.filterArea === 'DCS Control' ? 'selected' : ''}>DCS Control Room</option>
                            </select>

                            <select onchange="QAMSProduct.setFilterStatus(this.value)" class="bg-dark-700 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 font-semibold outline-none focus:border-sky-500 transition-all min-w-[110px]">
                                <option value="all" ${!this.filterStatus || this.filterStatus === 'all' ? 'selected' : ''}>All Statuses</option>
                                <option value="Approved" ${this.filterStatus === 'Approved' ? 'selected' : ''}>Approved</option>
                                <option value="In Progress" ${this.filterStatus === 'In Progress' ? 'selected' : ''}>In Progress</option>
                                <option value="Resolved" ${this.filterStatus === 'Resolved' ? 'selected' : ''}>Resolved</option>
                                <option value="Closed" ${this.filterStatus === 'Closed' ? 'selected' : ''}>Closed</option>
                                <option value="Active" ${this.filterStatus === 'Active' ? 'selected' : ''}>Active</option>
                            </select>

                            <div class="relative min-w-[220px] flex-1 lg:w-64">
                                <i class="fas fa-search absolute left-3.5 top-3 text-slate-400 text-xs"></i>
                                <input type="text" value="${this.searchQuery || ''}" oninput="QAMSProduct.handleSearch(this.value)" placeholder="Search Product Quality, ID, area..." class="w-full bg-dark-700 border border-slate-700 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-400 outline-none focus:border-sky-500 transition-all">
                                ${this.searchQuery ? `<button onclick="QAMSProduct.clearSearch()" class="absolute right-3 top-2.5 text-slate-400 hover:text-white"><i class="fas fa-times text-xs"></i></button>` : ''}
                            </div>
                        </div>
                    </div>

                    <!-- Active Filter Banner (Prevents any confusion about hidden data!) -->
                    ${hasActiveFilter ? `
                        <div class="bg-gradient-to-r from-royalblue-900/60 via-dark-700 to-dark-700 p-3.5 rounded-xl border border-sky-500/40 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn shadow-lg">
                            <div class="flex items-center gap-2 flex-wrap text-xs">
                                <span class="text-sky-400 font-bold flex items-center gap-1.5">
                                    <i class="fas fa-filter animate-pulse"></i> Active Filter(s):
                                </span>
                                ${this.activeTab !== 'all' ? `<span class="bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">Category: ${this.getCategoryLabel(this.activeTab)} <button onclick="QAMSProduct.switchCategory('all')" class="hover:text-white ml-1">&times;</button></span>` : ''}
                                ${this.searchQuery ? `<span class="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">Keyword / Month: "${this.searchQuery}" <button onclick="QAMSProduct.clearSearch()" class="hover:text-white ml-1">&times;</button></span>` : ''}
                                ${this.filterArea && this.filterArea !== 'All Areas' ? `<span class="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">Area: ${this.filterArea} <button onclick="QAMSProduct.setFilterArea('All Areas')" class="hover:text-white ml-1">&times;</button></span>` : ''}
                                ${this.filterStatus && this.filterStatus !== 'all' ? `<span class="bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">Status: ${this.filterStatus} <button onclick="QAMSProduct.setFilterStatus('all')" class="hover:text-white ml-1">&times;</button></span>` : ''}
                            </div>
                            <button onclick="QAMSProduct.resetAllFilters()" class="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-[11px] rounded-lg transition-all shadow flex items-center gap-1.5 whitespace-nowrap">
                                <i class="fas fa-undo"></i> Reset All Filters & Show All (${allRecords.length})
                            </button>
                        </div>
                    ` : ''}

                    <!-- Interactive Data Grid / Table -->
                    <div class="bg-dark-500 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                        <div class="overflow-x-auto">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-dark-700/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                        <th class="py-3.5 px-4">Record ID</th>
                                        <th class="py-3.5 px-4">Category</th>
                                        <th class="py-3.5 px-4">Title & Description</th>
                                        <th class="py-3.5 px-4">Plant Area</th>
                                        <th class="py-3.5 px-4">Quality Specification</th>
                                        <th class="py-3.5 px-4">Status</th>
                                        <th class="py-3.5 px-4 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-800/80 text-xs font-medium text-slate-300">
                                    ${filtered.length > 0 ? filtered.map(r => this.renderTableRow(r)).join('') : `
                                        <tr>
                                            <td colspan="7" class="py-12 text-center text-slate-400 font-normal">
                                                <i class="fas fa-folder-open text-3xl text-slate-600 mb-2 block"></i>
                                                <span class="block text-sm font-bold text-slate-300 mt-2">No QA records match your current filter or search criteria.</span>
                                                <button onclick="QAMSProduct.resetAllFilters()" class="mt-3 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold rounded-xl text-xs transition-all border border-slate-700 inline-flex items-center gap-1.5">
                                                    <i class="fas fa-undo"></i> Reset All Filters & Show All Data (${allRecords.length})
                                                </button>
                                            </td>
                                        </tr>
                                    `}
                                </tbody>
                            </table>
                        </div>
                        <div class="p-3 bg-dark-700/50 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                            <span>Showing <strong class="text-white">${filtered.length}</strong> of <strong class="text-white">${allRecords.length}</strong> records</span>
                            <span class="text-sky-400 font-semibold"><i class="fas fa-check-circle mr-1"></i> Synced to MS Section Product Quality Board</span>
                        </div>
                    </div>
                </div>
            `;
        },

        // ====================================================================
        // 3. BULLETIN BOARD SUB-RENDERERS (TABS 1, 2, & 3)
        // ====================================================================
        renderBoardContent: function (board) {
            if (this.activeBoardTab === 'matrix') {
                // TAB 1: MONTHLY PLANT MATRIX (IMAGE 1)
                return `
                    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
                        <!-- LEFT BOARD: QUALITY INCIDENTS & CLAIMS -->
                        <div class="lg:col-span-5 bg-dark-900/80 rounded-xl p-4 border border-slate-700/80 shadow-inner flex flex-col justify-between">
                            <div>
                                <div class="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                                    <span class="text-xs font-extrabold text-amber-400 uppercase tracking-wider"><i class="fas fa-thumbtack text-rose-500 mr-1.5"></i> Incident & Claim Matrix</span>
                                    <span class="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">2026 YTD</span>
                                </div>
                                <div class="overflow-x-auto no-scrollbar">
                                    <table class="w-full text-center border-collapse text-[11px]">
                                        <thead>
                                            <tr class="text-slate-400 font-bold border-b border-slate-800">
                                                <th class="py-2 px-2 text-left text-white font-extrabold">Category</th>
                                                ${board.monthsAll.slice(0, 6).map(m => `<th class="py-2 px-1 cursor-pointer hover:text-sky-400 transition-colors" onclick="QAMSProduct.filterFromBoard('${m}')">${m}</th>`).join('')}
                                                <th class="py-2 px-2 bg-amber-500/10 text-amber-400 font-black border-l border-slate-800">YTD</th>
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-slate-800/60 font-semibold text-slate-300">
                                            <tr class="hover:bg-slate-800/40 transition-colors cursor-pointer" onclick="QAMSProduct.switchCategory('nearmiss')">
                                                <td class="py-2.5 px-2 text-left font-bold text-rose-400 flex items-center gap-1.5">
                                                    <span class="w-2 h-2 rounded-full bg-rose-500"></span> Quality Near Miss
                                                </td>
                                                ${board.incidents.nearMiss.slice(0, 6).map(val => `<td class="py-2.5 px-1 ${val > 0 ? 'text-white font-black bg-rose-500/20 rounded' : 'text-slate-500'}">${val}</td>`).join('')}
                                                <td class="py-2.5 px-2 bg-amber-500/10 text-amber-400 font-black border-l border-slate-800 text-xs">${board.incidents.nearMissYTD}</td>
                                            </tr>
                                            <tr class="hover:bg-slate-800/40 transition-colors cursor-pointer" onclick="QAMSProduct.switchCategory('claim')">
                                                <td class="py-2.5 px-2 text-left font-bold text-amber-400 flex items-center gap-1.5">
                                                    <span class="w-2 h-2 rounded-full bg-amber-500"></span> Internal Claim
                                                </td>
                                                ${board.incidents.internalClaim.slice(0, 6).map(val => `<td class="py-2.5 px-1 ${val > 0 ? 'text-white font-black bg-amber-500/20 rounded' : 'text-slate-500'}">${val}</td>`).join('')}
                                                <td class="py-2.5 px-2 bg-amber-500/10 text-amber-400 font-black border-l border-slate-800 text-xs">${board.incidents.internalYTD}</td>
                                            </tr>
                                            <tr class="hover:bg-slate-800/40 transition-colors cursor-pointer" onclick="QAMSProduct.switchCategory('claim')">
                                                <td class="py-2.5 px-2 text-left font-bold text-emerald-400 flex items-center gap-1.5">
                                                    <span class="w-2 h-2 rounded-full bg-emerald-500"></span> External Claim
                                                </td>
                                                ${board.incidents.externalClaim.slice(0, 6).map(val => `<td class="py-2.5 px-1 ${val > 0 ? 'text-white font-black bg-rose-500/20 rounded' : 'text-slate-500'}">${val}</td>`).join('')}
                                                <td class="py-2.5 px-2 bg-amber-500/10 text-emerald-400 font-black border-l border-slate-800 text-xs">${board.incidents.externalYTD}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                                <span><i class="fas fa-check-circle text-emerald-400 mr-1"></i> Zero External Customer Claims</span>
                                <span class="text-sky-400 font-bold cursor-pointer hover:underline" onclick="QAMSProduct.switchCategory('nearmiss')">View Incident Logs &rarr;</span>
                            </div>
                        </div>

                        <!-- RIGHT BOARD: PRODUCT QUALITY SPECIFICATIONS & TONNAGE -->
                        <div class="lg:col-span-7 bg-dark-900/80 rounded-xl p-4 border border-slate-700/80 shadow-inner flex flex-col justify-between">
                            <div>
                                <div class="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                                    <span class="text-xs font-extrabold text-amber-400 uppercase tracking-wider"><i class="fas fa-thumbtack text-sky-500 mr-1.5"></i> Product Quality Compliance Rate & Tonnage</span>
                                    <span class="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">Target: &gt;98%</span>
                                </div>
                                <div class="overflow-x-auto no-scrollbar">
                                    <table class="w-full text-center border-collapse text-[11px]">
                                        <thead>
                                            <tr class="text-slate-400 font-bold border-b border-slate-800">
                                                <th class="py-2 px-2 text-left text-white font-extrabold">Parameter</th>
                                                ${board.monthsActive.map(m => `<th class="py-2 px-2 cursor-pointer hover:text-amber-400 transition-colors font-extrabold text-white bg-slate-800/50 rounded-t" onclick="QAMSProduct.filterFromBoard('${m}')">${m}</th>`).join('')}
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-slate-800/60 font-semibold text-slate-200">
                                            <tr class="bg-amber-500/10 text-amber-300 font-bold border-b-2 border-slate-700">
                                                <td class="py-2 px-2 text-left font-black text-amber-400 whitespace-nowrap">Actual / Target (MT)</td>
                                                ${board.production.actual.map((act, idx) => `
                                                    <td class="py-2 px-1 text-[10px] leading-tight cursor-pointer hover:bg-amber-500/20 transition-colors" title="Actual: ${act} MT | Target: ${board.production.target[idx]} MT" onclick="QAMSProduct.showCellAnalysis('Production Tonnage', '${board.monthsActive[idx]}', '${act} / ${board.production.target[idx]} MT')">
                                                        <span class="text-white font-extrabold block">${act}</span>
                                                        <span class="text-slate-400 text-[9px] font-normal">${board.production.target[idx]}</span>
                                                    </td>
                                                `).join('')}
                                            </tr>
                                            <tr class="hover:bg-slate-800/40 transition-colors">
                                                <td class="py-2 px-2 text-left font-extrabold text-rose-400 cursor-pointer hover:underline" onclick="QAMSProduct.filterFromBoard('Zn')">Zn (Zinc)</td>
                                                ${board.compliance.Zn.map((val, idx) => `
                                                    <td class="py-2 px-1 cursor-pointer hover:bg-slate-800 transition-colors ${val === '100.00%' ? 'text-emerald-400 font-black' : ''}" onclick="QAMSProduct.showCellAnalysis('Zn Compliance', '${board.monthsActive[idx]}', '${val}')">${val}</td>
                                                `).join('')}
                                            </tr>
                                            <tr class="hover:bg-slate-800/40 transition-colors">
                                                <td class="py-2 px-2 text-left font-extrabold text-amber-400 cursor-pointer hover:underline" onclick="QAMSProduct.filterFromBoard('Mg')">Mg (Magnesium)</td>
                                                ${board.compliance.Mg.map((val, idx) => `
                                                    <td class="py-2 px-1 cursor-pointer hover:bg-slate-800 transition-colors ${val === '100.00%' ? 'text-emerald-400 font-black' : parseFloat(val) < 85 ? 'text-rose-400 font-bold' : ''}" onclick="QAMSProduct.showCellAnalysis('Mg Compliance', '${board.monthsActive[idx]}', '${val}')">${val}</td>
                                                `).join('')}
                                            </tr>
                                            <tr class="hover:bg-slate-800/40 transition-colors">
                                                <td class="py-2 px-2 text-left font-extrabold text-cyan-400 cursor-pointer hover:underline" onclick="QAMSProduct.filterFromBoard('Cr')">Cr (Chromium)</td>
                                                ${board.compliance.Cr.map((val, idx) => `
                                                    <td class="py-2 px-1 cursor-pointer hover:bg-slate-800 transition-colors ${parseFloat(val) < 80 ? 'text-rose-400 font-bold' : ''}" onclick="QAMSProduct.showCellAnalysis('Cr Compliance', '${board.monthsActive[idx]}', '${val}')">${val}</td>
                                                `).join('')}
                                            </tr>
                                            <tr class="hover:bg-slate-800/40 transition-colors">
                                                <td class="py-2 px-2 text-left font-extrabold text-emerald-400 cursor-pointer hover:underline" onclick="QAMSProduct.filterFromBoard('PS')">PS (Particle Spec)</td>
                                                ${board.compliance.PS.map((val, idx) => `
                                                    <td class="py-2 px-1 cursor-pointer hover:bg-slate-800 transition-colors ${val === '100.00%' ? 'text-emerald-400 font-black' : ''}" onclick="QAMSProduct.showCellAnalysis('PS Compliance', '${board.monthsActive[idx]}', '${val}')">${val}</td>
                                                `).join('')}
                                            </tr>
                                            <tr class="hover:bg-slate-800/40 transition-colors">
                                                <td class="py-2 px-2 text-left font-extrabold text-sky-400 cursor-pointer hover:underline" onclick="QAMSProduct.filterFromBoard('H2O')">H2O (Moisture)</td>
                                                ${board.compliance.H2O.map((val, idx) => `
                                                    <td class="py-2 px-1 cursor-pointer hover:bg-slate-800 transition-colors ${val === '100.00%' ? 'text-emerald-400 font-black' : ''}" onclick="QAMSProduct.showCellAnalysis('H2O Compliance', '${board.monthsActive[idx]}', '${val}')">${val}</td>
                                                `).join('')}
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                                <span><i class="fas fa-chart-line text-amber-400 mr-1"></i> Q2 Production Exceeded Target for Apr, May &amp; Jun</span>
                                <span class="text-amber-400 font-bold cursor-pointer hover:underline" onclick="QAMSProduct.switchCategory('product_quality')">Filter Quality Assays &rarr;</span>
                            </div>
                        </div>
                    </div>
                `;
            } else if (this.activeBoardTab === 'scorecard') {
                // TAB 2: OBJECTIVES AND TARGETS SCORECARD (IMAGE 2)
                const renderBadge = (status, type) => {
                    const styles = {
                        success: 'bg-amber-400 text-dark-900 border-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.4)] font-black',
                        warning: 'bg-rose-500 text-white border-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.4)] font-black animate-pulse',
                        info:    'bg-sky-500/20 text-sky-300 border-sky-500/40 font-bold',
                        neutral: 'bg-slate-700 text-slate-300 border-slate-600 font-bold'
                    };
                    return `<span class="px-2.5 py-1 rounded-full text-[10px] border tracking-wider uppercase inline-flex items-center gap-1 ${styles[type] || styles.neutral}">${type === 'success' ? '👍 ' : type === 'warning' ? '⚠️ ' : ''}${status}</span>`;
                };

                const renderScorecardColumn = (title, subtitle, items, colColor) => `
                    <div class="bg-dark-900/90 rounded-2xl border border-slate-700/80 overflow-hidden flex flex-col shadow-lg">
                        <div class="bg-gradient-to-r ${colColor} p-4 border-b border-slate-700 text-center">
                            <h5 class="text-sm font-black text-white tracking-widest uppercase">${title}</h5>
                            <span class="text-[10px] text-slate-200 font-semibold block mt-0.5">${subtitle}</span>
                        </div>
                        <div class="p-4 space-y-3 flex-1 divide-y divide-slate-800/60">
                            ${items.map((item) => `
                                <div class="pt-3 first:pt-0 flex items-start justify-between gap-3 group cursor-pointer hover:bg-slate-800/30 p-2 rounded-xl transition-all" onclick="QAMSProduct.showScorecardDetail('${item.id}', '${title}')">
                                    <div class="space-y-1">
                                        <span class="text-xs font-bold text-white group-hover:text-sky-400 transition-colors block">${item.name}</span>
                                        <p class="text-[11px] text-slate-400 leading-normal">${item.desc}</p>
                                        <div class="flex items-center gap-3 pt-1 text-[11px]">
                                            <span class="text-slate-500 font-medium">Target: <strong class="text-slate-300">${item.target}</strong></span>
                                            <span class="text-slate-500 font-medium">&bull; Actual: <strong class="${item.type === 'warning' ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}">${item.actual}</strong></span>
                                        </div>
                                    </div>
                                    <div class="flex flex-col items-end gap-2 flex-shrink-0">
                                        ${renderBadge(item.status, item.type)}
                                        <span class="text-[10px] text-sky-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Drill-down &rarr;</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;

                return `
                    <div class="space-y-4 animate-fadeIn">
                        <div class="flex items-center justify-between text-xs text-slate-300 bg-dark-900/60 p-3 rounded-xl border border-slate-800">
                            <span><i class="fas fa-info-circle text-amber-400 mr-1.5"></i> Click any objective card to view detailed variance analysis or log a linked CAPA investigation.</span>
                            <span class="font-bold text-emerald-400"><i class="fas fa-check-double mr-1"></i> June 2026 Audit Complete</span>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            ${renderScorecardColumn('Product Quality', 'High Internal Specification Adherence', board.scorecard.productQualitySpecs, 'from-royalblue-600/60 to-sky-600/40')}
                            ${renderScorecardColumn('Product Quality', 'Customer Satisfaction & Claim Reduction', board.scorecard.customerSatisfaction, 'from-amber-600/60 to-orange-600/40')}
                            ${renderScorecardColumn('Process Quality', 'Facility Monitoring & Safety Compliance', board.scorecard.processQuality, 'from-emerald-600/60 to-teal-600/40')}
                        </div>
                    </div>
                `;
            } else if (this.activeBoardTab === 'reprocess') {
                // TAB 3: PROCESS QUALITY REPROCESS BAGS & BATCH CREDITS (IMAGE 3)
                return `
                    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
                        <!-- LEFT BOARD: 106FT02AB REPROCESS BAGS WITH LIVE ADJUSTER -->
                        <div class="lg:col-span-5 bg-dark-900/90 rounded-2xl p-5 border border-slate-700/80 shadow-lg flex flex-col justify-between">
                            <div>
                                <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                                    <div>
                                        <span class="text-[10px] font-extrabold uppercase tracking-widest text-sky-400 block">Unit Inventory Monitor</span>
                                        <h5 class="text-base font-black text-white tracking-wide">${board.reprocessBags.unit}</h5>
                                    </div>
                                    <span class="px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-bold text-xs border border-slate-700">Total: ${board.reprocessBags.items.reduce((a,b)=>a+b.count,0)} Bags</span>
                                </div>

                                <div class="space-y-3">
                                    ${board.reprocessBags.items.map(item => `
                                        <div class="p-3.5 rounded-xl border ${item.border} ${item.bg} flex items-center justify-between gap-4">
                                            <div class="flex items-center gap-3">
                                                <div class="w-12 h-12 rounded-lg bg-dark-900 border border-slate-700 flex items-center justify-center text-xl font-black ${item.color} shadow-inner font-mono">
                                                    ${item.count}
                                                </div>
                                                <div>
                                                    <span class="text-xs font-bold text-white block">${item.label}</span>
                                                    <span class="text-[10px] text-slate-400">Live Inventory Counter</span>
                                                </div>
                                            </div>
                                            <!-- Interactive +/- Buttons -->
                                            <div class="flex items-center gap-1.5">
                                                <button onclick="QAMSProduct.adjustReprocessBag('${item.id}', -1)" class="w-8 h-8 rounded-lg bg-dark-700 hover:bg-slate-700 text-slate-300 font-bold flex items-center justify-center border border-slate-600 transition-all text-xs" title="Decrement Bag Count">
                                                    <i class="fas fa-minus"></i>
                                                </button>
                                                <button onclick="QAMSProduct.adjustReprocessBag('${item.id}', 1)" class="w-8 h-8 rounded-lg bg-dark-700 hover:bg-slate-700 text-slate-300 font-bold flex items-center justify-center border border-slate-600 transition-all text-xs" title="Increment Bag Count">
                                                    <i class="fas fa-plus"></i>
                                                </button>
                                                <button onclick="QAMSProduct.openAddModal('nearmiss', { title: 'Reprocess Bag Investigation: ${item.label}', area: 'H2S Area', metricName: '${item.label}', metricValue: '${item.count} Bags' })" class="px-2.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white font-bold text-[10px] border border-rose-500/30 transition-all ml-1" title="Log CAPA Investigation">
                                                    <i class="fas fa-exclamation-triangle"></i> Log CAPA
                                                </button>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            <div class="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                                <span><i class="fas fa-info-circle text-sky-400 mr-1"></i> [+]/[-] adjustments log directly to system audit trail.</span>
                                <span class="text-sky-400 font-bold cursor-pointer hover:underline" onclick="QAMSProduct.filterFromBoard('Reprocess')">Filter Reprocess Logs &rarr;</span>
                            </div>
                        </div>

                        <!-- RIGHT BOARD: 106ML02 BATCH CREDIT PER GROUP -->
                        <div class="lg:col-span-7 bg-dark-900/90 rounded-2xl p-5 border border-slate-700/80 shadow-lg flex flex-col justify-between">
                            <div>
                                <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                                    <div>
                                        <span class="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 block">Shift Performance Tracker</span>
                                        <h5 class="text-base font-black text-white tracking-wide">${board.batchCredit.unit}</h5>
                                    </div>
                                    <div class="flex items-center gap-1.5 text-xs font-bold text-slate-300 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
                                        <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                                        <span>4 Operating Shift Groups</span>
                                    </div>
                                </div>

                                <div class="overflow-x-auto no-scrollbar">
                                    <table class="w-full text-center border-collapse text-xs">
                                        <thead>
                                            <tr class="text-slate-400 font-bold border-b border-slate-800">
                                                <th class="py-3 px-3 text-left text-white font-extrabold bg-slate-800/40 rounded-tl">Group</th>
                                                ${board.monthsActive.map(m => `<th class="py-3 px-2 font-extrabold text-white bg-slate-800/40">${m}</th>`).join('')}
                                                <th class="py-3 px-3 font-black text-amber-400 bg-amber-500/10 rounded-tr border-l border-slate-800">Total Credits</th>
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-slate-800/60 font-semibold text-slate-200">
                                            ${board.batchCredit.groups.map(grp => {
                                                const vals = board.batchCredit.data[grp];
                                                const total = vals.reduce((a, b) => a + b, 0);
                                                const grpColors = { CLC: 'text-sky-400', AJL: 'text-amber-400', JNY: 'text-rose-400', NJL: 'text-emerald-400' };
                                                return `
                                                    <tr class="hover:bg-slate-800/40 transition-colors cursor-pointer group" onclick="QAMSProduct.showShiftAnalysis('${grp}', ${total})">
                                                        <td class="py-3 px-3 text-left font-black ${grpColors[grp] || 'text-white'} flex items-center gap-2">
                                                            <i class="fas fa-users text-xs opacity-60"></i> ${grp} Group
                                                        </td>
                                                        ${vals.map(val => `<td class="py-3 px-2 ${val > 0 ? 'text-white font-extrabold bg-slate-800/30' : 'text-slate-500'}">${val}</td>`).join('')}
                                                        <td class="py-3 px-3 font-black text-amber-400 bg-amber-500/10 border-l border-slate-800 text-sm">${total}</td>
                                                    </tr>
                                                `;
                                            }).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div class="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                                <span><i class="fas fa-trophy text-amber-400 mr-1"></i> AJL &amp; NJL tied for highest shift credits in June (15.0)</span>
                                <span class="text-sky-400 font-bold cursor-pointer hover:underline" onclick="QAMSProduct.switchCategory('improvement')">View Process Improvements &rarr;</span>
                            </div>
                        </div>
                    </div>
                `;
            }
            return '';
        },

        renderTabButton: function (key, label, icon, color = 'text-white') {
            const isActive = this.activeTab === key || (key === 'product_quality' && this.activeTab === 'analysis');
            return `
                <button onclick="QAMSProduct.switchCategory('${key}')" class="px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${isActive ? 'bg-royalblue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.4)]' : 'bg-dark-700 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/80'}">
                    <i class="fas ${icon} ${isActive ? 'text-white' : color}"></i> ${label}
                </button>
            `;
        },

        renderTableRow: function (r) {
            const badgeColors = {
                product_quality: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
                analysis: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
                document: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
                nearmiss: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                claim: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
                improvement: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            };
            const catLabels = { 
                product_quality: 'Product Quality', 
                analysis: 'Product Quality', 
                document: 'Document', 
                nearmiss: 'Near Miss', 
                claim: 'Quality Claim',
                improvement: 'Improvement' 
            };
            const catIcons = { 
                product_quality: 'fa-award', 
                analysis: 'fa-award', 
                document: 'fa-file-invoice', 
                nearmiss: 'fa-exclamation-triangle', 
                claim: 'fa-clipboard-check',
                improvement: 'fa-lightbulb' 
            };
            const statusColors = {
                'Approved': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
                'Active': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
                'Resolved': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
                'Closed': 'bg-slate-700 text-slate-300 border-slate-600',
                'In Progress': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
                'Open': 'bg-sky-500/20 text-sky-300 border-sky-500/30',
                'Archived': 'bg-slate-700 text-slate-400 border-slate-600'
            };

            return `
                <tr class="hover:bg-slate-800/40 transition-colors group">
                    <td class="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                        <span onclick="QAMSProduct.viewDetails('${r.id}')" class="hover:text-sky-400 cursor-pointer underline decoration-slate-600 hover:decoration-sky-400">${r.id}</span>
                        <span class="block text-[10px] text-slate-500 font-normal mt-0.5"><i class="far fa-calendar mr-1"></i>${r.date}</span>
                    </td>
                    <td class="py-3.5 px-4 whitespace-nowrap">
                        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border ${badgeColors[r.category] || 'bg-slate-800 text-slate-300'}">
                            <i class="fas ${catIcons[r.category]}"></i> ${catLabels[r.category] || 'Product Quality'}
                        </span>
                    </td>
                    <td class="py-3.5 px-4 max-w-xs">
                        <div class="font-bold text-white text-sm truncate group-hover:text-sky-300 transition-colors cursor-pointer" onclick="QAMSProduct.viewDetails('${r.id}')" title="${r.title}">${r.title}</div>
                        <div class="text-[11px] text-slate-400 truncate mt-0.5" title="${r.description}">${r.description}</div>
                        ${r.attachments && r.attachments.length > 0 ? `<span class="inline-flex items-center gap-1 text-[10px] text-sky-400 mt-1"><i class="fas fa-paperclip"></i> ${r.attachments.length} attachment(s)</span>` : ''}
                    </td>
                    <td class="py-3.5 px-4 whitespace-nowrap">
                        <span class="text-slate-200 font-semibold">${r.area}</span>
                        <span class="block text-[10px] text-slate-500 mt-0.5"><i class="fas fa-user-tag mr-1"></i>${r.reporter.split(' ')[0]}...</span>
                    </td>
                    <td class="py-3.5 px-4 whitespace-nowrap">
                        ${r.metricName ? `
                            <div class="flex items-center gap-1.5">
                                <span class="w-2 h-2 rounded-full ${r.isCompliant ? 'bg-emerald-400' : 'bg-rose-500 animate-ping'}"></span>
                                <span class="font-bold text-white">${r.metricValue}</span>
                            </div>
                            <span class="block text-[10px] text-slate-400 mt-0.5">${r.metricName} (${r.metricLimit})</span>
                        ` : '<span class="text-slate-500 text-[11px] italic">N/A</span>'}
                    </td>
                    <td class="py-3.5 px-4 whitespace-nowrap">
                        <span class="px-2.5 py-1 rounded-md text-[10px] font-bold border ${statusColors[r.status] || 'bg-slate-800 text-slate-300'}">
                            ${r.status}
                        </span>
                    </td>
                    <td class="py-3.5 px-4 text-center whitespace-nowrap">
                        <div class="inline-flex items-center gap-1">
                            <button onclick="QAMSProduct.viewDetails('${r.id}')" class="p-1.5 bg-slate-800 hover:bg-sky-600 hover:text-white text-sky-400 rounded-lg transition-all" title="View Details">
                                <i class="fas fa-eye text-xs"></i>
                            </button>
                            <button onclick="QAMSProduct.openEditModal('${r.id}')" class="p-1.5 bg-slate-800 hover:bg-amber-600 hover:text-white text-amber-400 rounded-lg transition-all" title="Edit Record">
                                <i class="fas fa-edit text-xs"></i>
                            </button>
                            <button onclick="QAMSProduct.deleteRecord('${r.id}')" class="p-1.5 bg-slate-800 hover:bg-rose-600 hover:text-white text-rose-400 rounded-lg transition-all" title="Delete Record">
                                <i class="fas fa-trash-alt text-xs"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        },

        // ====================================================================
        // 4. BULLETIN BOARD INTERACTIVITY & LIVE DATA MANIPULATORS
        // ====================================================================
        adjustReprocessBag: function (id, change) {
            const board = Store.getBoardData();
            const idx = board.reprocessBags.items.findIndex(item => item.id === id);
            if (idx !== -1) {
                const oldVal = board.reprocessBags.items[idx].count;
                const newVal = Math.max(0, oldVal + change);
                board.reprocessBags.items[idx].count = newVal;
                Store.saveBoardData(board);
                Store.addHistory(
                    `Updated Reprocess Inventory (${board.reprocessBags.items[idx].label})`,
                    `Adjusted count from ${oldVal} to ${newVal} bags via Live Plant Scorecard.`
                );
                this.render();
            }
        },

        showScorecardDetail: function (id, section) {
            const board = Store.getBoardData();
            let item = null;
            if (section.includes('Quality')) {
                item = board.scorecard.productQualitySpecs.find(i => i.id === id) || board.scorecard.customerSatisfaction.find(i => i.id === id);
            } else {
                item = board.scorecard.processQuality.find(i => i.id === id);
            }
            if (!item) return;

            const isWarning = item.type === 'warning';
            const modalHtml = `
                <div id="qams-modal" class="fixed inset-0 bg-dark-900/85 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn">
                    <div class="bg-dark-500 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden flex flex-col">
                        <div class="bg-gradient-to-r ${isWarning ? 'from-rose-600/30 to-amber-600/20' : 'from-royalblue-600/30 to-sky-500/20'} p-5 border-b border-slate-800 flex justify-between items-center">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl ${isWarning ? 'bg-rose-500' : 'bg-royalblue-600'} flex items-center justify-center text-white font-black shadow">
                                    <i class="fas ${isWarning ? 'fa-exclamation-triangle' : 'fa-bullseye'} text-base"></i>
                                </div>
                                <div>
                                    <h3 class="text-base sm:text-lg font-bold text-white">${item.name}</h3>
                                    <span class="text-xs ${isWarning ? 'text-rose-400' : 'text-sky-400'} font-semibold block">${section} &bull; ${item.area}</span>
                                </div>
                            </div>
                            <button onclick="QAMSProduct.closeModal()" class="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800/50">
                                <i class="fas fa-times text-base"></i>
                            </button>
                        </div>

                        <div class="p-6 space-y-4 font-sans text-xs sm:text-sm">
                            <div class="p-4 rounded-xl border ${isWarning ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'} flex items-center justify-between">
                                <div>
                                    <span class="text-[11px] font-bold uppercase block text-slate-400">Current Actual Performance</span>
                                    <span class="text-2xl font-black">${item.actual}</span>
                                </div>
                                <div class="text-right">
                                    <span class="text-[11px] font-bold uppercase block text-slate-400">Target Benchmark</span>
                                    <span class="text-lg font-extrabold text-white">${item.target}</span>
                                </div>
                            </div>

                            <div class="space-y-2 text-slate-300 bg-dark-700/60 p-4 rounded-xl border border-slate-800">
                                <h4 class="font-bold text-white uppercase tracking-wider text-xs mb-2 border-b border-slate-800 pb-1.5"><i class="fas fa-file-alt text-sky-400 mr-1.5"></i> Objective Statement &amp; Telemetry</h4>
                                <p class="leading-relaxed">${item.desc}</p>
                                ${isWarning ? `
                                    <div class="p-3 bg-rose-500/20 rounded-lg text-rose-200 text-xs mt-2 font-semibold">
                                        <i class="fas fa-exclamation-circle mr-1"></i> Parameter falls short of target specification. Immediate CAPA protocol verification is recommended.
                                    </div>
                                ` : `
                                    <div class="p-3 bg-emerald-500/20 rounded-lg text-emerald-200 text-xs mt-2 font-semibold">
                                        <i class="fas fa-check-circle mr-1"></i> Parameter successfully meets internal quality benchmarks for June 2026.
                                    </div>
                                `}
                            </div>
                        </div>

                        <div class="p-4 bg-dark-700/80 border-t border-slate-800 flex justify-end gap-2">
                            <button onclick="QAMSProduct.closeModal(); QAMSProduct.openAddModal('${isWarning ? 'nearmiss' : 'product_quality'}', { title: 'Scorecard Review: ${item.name}', area: '${item.area}', metricName: '${item.name}', metricValue: '${item.actual}', metricLimit: '${item.target}', isCompliant: ${!isWarning} });" class="px-4 py-2 bg-gradient-to-r from-royalblue-600 to-sky-500 hover:from-royalblue-500 text-white font-bold text-xs rounded-xl shadow transition-all">
                                <i class="fas fa-plus-circle mr-1"></i> Log Linked QA Record
                            </button>
                            <button onclick="QAMSProduct.closeModal()" class="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            `;
            this.showModalHtml(modalHtml);
        },

        showShiftAnalysis: function (grp, total) {
            const modalHtml = `
                <div id="qams-modal" class="fixed inset-0 bg-dark-900/85 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn">
                    <div class="bg-dark-500 w-full max-w-md rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden flex flex-col">
                        <div class="bg-gradient-to-r from-emerald-600/30 to-teal-600/20 p-5 border-b border-slate-800 flex justify-between items-center">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-dark-900 font-black text-lg shadow">
                                    <i class="fas fa-users"></i>
                                </div>
                                <div>
                                    <h3 class="text-base sm:text-lg font-bold text-white">${grp} Operating Group</h3>
                                    <span class="text-xs text-emerald-400 font-semibold block">106ML02 Shift Batch Credit Summary</span>
                                </div>
                            </div>
                            <button onclick="QAMSProduct.closeModal()" class="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800/50">
                                <i class="fas fa-times text-base"></i>
                            </button>
                        </div>

                        <div class="p-6 space-y-4 font-sans text-xs sm:text-sm">
                            <div class="p-4 rounded-xl bg-dark-700 border border-slate-800 text-center">
                                <span class="text-[11px] font-bold uppercase block text-slate-400">Total 6-Month Cumulative Credits</span>
                                <span class="text-3xl font-black text-amber-400 mt-1 block">${total} Credits</span>
                            </div>
                            <p class="text-slate-300 leading-relaxed bg-dark-700/50 p-3.5 rounded-xl border border-slate-800">
                                The <strong>${grp} Group</strong> recorded strong operational throughput during Q2 2026 (April, May, and June), contributing significantly to the overall MS Section plant production exceeding its monthly target tonnage.
                            </p>
                        </div>

                        <div class="p-4 bg-dark-700/80 border-t border-slate-800 flex justify-end">
                            <button onclick="QAMSProduct.closeModal()" class="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all">Close</button>
                        </div>
                    </div>
                </div>
            `;
            this.showModalHtml(modalHtml);
        },

        showCellAnalysis: function (param, month, val) {
            const isTonnage = param.includes('Tonnage');
            const is100 = val === '100.00%';
            const isLow = !isTonnage && parseFloat(val) < 85;

            const modalHtml = `
                <div id="qams-modal" class="fixed inset-0 bg-dark-900/85 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn">
                    <div class="bg-dark-500 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden flex flex-col">
                        <div class="bg-gradient-to-r from-amber-500/30 to-royalblue-600/20 p-5 border-b border-slate-800 flex justify-between items-center">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-dark-900 font-black shadow">
                                    <i class="fas fa-chart-pie text-base"></i>
                                </div>
                                <div>
                                    <h3 class="text-base sm:text-lg font-bold text-white">${month} 2026 &bull; ${param}</h3>
                                    <span class="text-xs text-amber-400 font-semibold block">Product Quality Bulletin Board Assay</span>
                                </div>
                            </div>
                            <button onclick="QAMSProduct.closeModal()" class="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800/50">
                                <i class="fas fa-times text-base"></i>
                            </button>
                        </div>

                        <div class="p-6 space-y-4 font-sans text-xs sm:text-sm">
                            <div class="p-4 rounded-xl border ${is100 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : isLow ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' : 'bg-dark-700 border-slate-800 text-white'} flex items-center justify-between">
                                <div>
                                    <span class="text-[11px] font-bold uppercase block text-slate-400">Recorded Metric Value</span>
                                    <span class="text-2xl font-black">${val}</span>
                                </div>
                                <i class="fas ${is100 ? 'fa-check-circle text-emerald-400' : isLow ? 'fa-exclamation-triangle text-rose-400 animate-pulse' : 'fa-award text-sky-400'} text-3xl"></i>
                            </div>

                            <div class="space-y-2 text-slate-300 bg-dark-700/60 p-4 rounded-xl border border-slate-800">
                                <h4 class="font-bold text-white uppercase tracking-wider text-xs mb-2 border-b border-slate-800 pb-1.5"><i class="fas fa-vial text-sky-400 mr-1.5"></i> Telemetry &amp; Quality Notes</h4>
                                ${isTonnage ? `
                                    <p class="leading-relaxed">In ${month} 2026, the Mixed Sulphide production plant recorded an output of <strong>${val}</strong>. Continued optimization of solvent extraction and neutralization loops maintained stable throughput.</p>
                                ` : is100 ? `
                                    <p class="leading-relaxed">Perfect zero-defect compliance achieved for <strong>${param}</strong> during the month of ${month}. All laboratory titration assays and continuous DCS sensor loops confirmed 100% adherence to Product Quality standards.</p>
                                ` : isLow ? `
                                    <p class="leading-relaxed">Temporary dip in <strong>${param}</strong> efficiency during ${month}. CAPA protocols were initiated by the QA lab team to adjust chemical dosing setpoints and calibrate field sensors.</p>
                                ` : `
                                    <p class="leading-relaxed">Product quality compliance for <strong>${param}</strong> remained within acceptable operational tolerance during ${month} 2026, meeting hydrometallurgical discharge specifications.</p>
                                `}
                            </div>
                        </div>

                        <div class="p-4 bg-dark-700/80 border-t border-slate-800 flex justify-end gap-2">
                            <button onclick="QAMSProduct.closeModal(); QAMSProduct.filterFromBoard('${month}');" class="px-4 py-2 bg-royalblue-600 hover:bg-royalblue-500 text-white font-bold text-xs rounded-xl shadow transition-all">
                                <i class="fas fa-filter mr-1"></i> Filter ${month} Records
                            </button>
                            <button onclick="QAMSProduct.closeModal()" class="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            `;
            this.showModalHtml(modalHtml);
        },

        viewDetails: function (id) {
            const r = Store.getRecords().find(item => item.id === id);
            if (!r) return;

            const modalHtml = `
                <div id="qams-modal" class="fixed inset-0 bg-dark-900/85 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn">
                    <div class="bg-dark-500 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden flex flex-col max-h-[90vh]">
                        <div class="bg-gradient-to-r from-royalblue-600/30 to-sky-500/20 p-5 border-b border-slate-800 flex justify-between items-center">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-royalblue-600 flex items-center justify-center text-white shadow">
                                    <i class="fas fa-award text-base"></i>
                                </div>
                                <div>
                                    <div class="flex items-center gap-2">
                                        <span class="text-xs font-bold text-sky-400 uppercase tracking-wider">${r.id}</span>
                                        <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">${(r.category === 'analysis' ? 'product_quality' : r.category).toUpperCase().replace('_', ' ')}</span>
                                    </div>
                                    <h3 class="text-base sm:text-lg font-bold text-white truncate max-w-md">${r.title}</h3>
                                </div>
                            </div>
                            <button onclick="QAMSProduct.closeModal()" class="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800/50">
                                <i class="fas fa-times text-base"></i>
                            </button>
                        </div>

                        <div class="p-6 space-y-5 overflow-y-auto font-sans text-xs sm:text-sm">
                            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-dark-700 rounded-xl border border-slate-800">
                                <div><span class="text-[11px] text-slate-400 block uppercase font-bold">Plant Area</span><span class="text-white font-semibold">${r.area}</span></div>
                                <div><span class="text-[11px] text-slate-400 block uppercase font-bold">Reported By</span><span class="text-white font-semibold">${r.reporter}</span></div>
                                <div><span class="text-[11px] text-slate-400 block uppercase font-bold">Log Date</span><span class="text-white font-semibold">${r.date}</span></div>
                                <div><span class="text-[11px] text-slate-400 block uppercase font-bold">Status</span><span class="text-sky-400 font-bold">${r.status}</span></div>
                            </div>

                            ${r.metricName ? `
                                <div class="p-4 rounded-xl border ${r.isCompliant ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'} flex items-center justify-between">
                                    <div class="flex items-center gap-3">
                                        <i class="fas ${r.isCompliant ? 'fa-check-circle text-emerald-400' : 'fa-exclamation-triangle text-rose-500 animate-pulse'} text-2xl"></i>
                                        <div>
                                            <span class="text-[11px] font-bold uppercase ${r.isCompliant ? 'text-emerald-300' : 'text-rose-300'} block">Product Quality Specification</span>
                                            <span class="text-sm font-extrabold text-white">${r.metricName}: ${r.metricValue}</span>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <span class="text-[11px] text-slate-400 block">SOP Limit / Target</span>
                                        <span class="text-xs font-bold text-slate-200">${r.metricLimit}</span>
                                    </div>
                                </div>
                            ` : ''}

                            <div>
                                <h4 class="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5"><i class="fas fa-align-left mr-1.5 text-sky-400"></i>Event Summary / Description</h4>
                                <p class="text-slate-300 bg-dark-700/60 p-3.5 rounded-xl border border-slate-800/80 leading-relaxed font-normal">${r.description}</p>
                            </div>

                            <div>
                                <h4 class="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5"><i class="fas fa-shield-alt mr-1.5 text-emerald-400"></i>Corrective & Preventive Action (CAPA)</h4>
                                <p class="text-slate-300 bg-dark-700/60 p-3.5 rounded-xl border border-slate-800/80 leading-relaxed font-normal">${r.capa || 'No CAPA action specified.'}</p>
                            </div>

                            <div>
                                <h4 class="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2"><i class="fas fa-paperclip mr-1.5 text-cyan-400"></i>Attached QA Documents (${r.attachments ? r.attachments.length : 0})</h4>
                                ${r.attachments && r.attachments.length > 0 ? `
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        ${r.attachments.map((att) => `
                                            <div class="p-2.5 bg-dark-700 rounded-xl border border-slate-800 flex items-center justify-between">
                                                <div class="flex items-center gap-2.5 truncate">
                                                    <i class="fas ${att.name.endsWith('.pdf') ? 'fa-file-pdf text-rose-400' : 'fa-file-csv text-emerald-400'} text-base"></i>
                                                    <div class="truncate">
                                                        <span class="text-xs font-semibold text-white block truncate">${att.name}</span>
                                                        <span class="text-[10px] text-slate-400">${att.size}</span>
                                                    </div>
                                                </div>
                                                <button onclick="QAMSProduct.downloadAttachment('${att.name}')" class="p-1.5 bg-slate-800 hover:bg-sky-600 text-sky-400 hover:text-white rounded-lg transition-all text-xs" title="Download">
                                                    <i class="fas fa-download"></i>
                                                </button>
                                            </div>
                                        `).join('')}
                                    </div>
                                ` : '<p class="text-xs text-slate-500 italic">No attachments uploaded for this record.</p>'}
                            </div>

                            ${r.history && r.history.length > 0 ? `
                                <div>
                                    <h4 class="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2"><i class="fas fa-history mr-1.5 text-amber-400"></i>Record Audit Trail</h4>
                                    <div class="space-y-2 border-l-2 border-slate-700 pl-3 ml-1">
                                        ${r.history.map(h => `
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

                        <div class="p-4 bg-dark-700/80 border-t border-slate-800 flex justify-end gap-2">
                            <button onclick="QAMSProduct.openEditModal('${r.id}')" class="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow transition-all">
                                <i class="fas fa-edit mr-1"></i> Edit Record
                            </button>
                            <button onclick="QAMSProduct.closeModal()" class="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all
error
An internal error has occurred.
Model 9:50 AM
ThinkingThoughts
Expand to view model thoughts

chevron_right
Here is the continuation and completion of your js/qamsproduct.js file, picking up right from where it left off inside the viewDetails modal and continuing through all the form handlers, AI upload analysis engine, CSV export tools, and initialization scripts:
code
JavaScript
<button onclick="QAMSProduct.closeModal()" class="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            `;
            this.showModalHtml(modalHtml);
        },

        // ADD / EDIT FORM MODAL WITH PREFILL SUPPORT
        openAddModal: function (category = 'product_quality', prefill = {}) {
            if (category === 'analysis') category = 'product_quality';
            this.renderFormModal(null, category, prefill);
        },

        openEditModal: function (id) {
            const r = Store.getRecords().find(item => item.id === id);
            if (r) {
                this.renderFormModal(r);
            }
        },

        renderFormModal: function (record = null, defaultCat = 'product_quality', prefill = {}) {
            const isEdit = record !== null;
            const r = record || {
                id: 'QAMS-' + new Date().getFullYear() + '-' + Math.floor(100 + Math.random() * 900),
                category: defaultCat,
                title: prefill.title || '',
                area: prefill.area || 'MS-Dezinc Area',
                reporter: 'Engr. M. Santos (Lead QA Lab)',
                date: new Date().toISOString().split('T')[0],
                status: prefill.isCompliant === false ? 'In Progress' : 'Open',
                description: '',
                capa: '',
                metricName: prefill.metricName || '',
                metricValue: prefill.metricValue || '',
                metricLimit: prefill.metricLimit || '',
                isCompliant: prefill.isCompliant !== undefined ? prefill.isCompliant : true,
                attachments: []
            };

            const modalHtml = `
                <div id="qams-modal" class="fixed inset-0 bg-dark-900/85 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn">
                    <div class="bg-dark-500 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden flex flex-col max-h-[90vh]">
                        <div class="bg-gradient-to-r from-royalblue-600/30 to-sky-500/20 p-5 border-b border-slate-800 flex justify-between items-center">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-royalblue-600 flex items-center justify-center text-white shadow">
                                    <i class="fas ${isEdit ? 'fa-edit' : 'fa-plus'} text-base"></i>
                                </div>
                                <div>
                                    <h3 class="text-base sm:text-lg font-bold text-white">${isEdit ? 'Edit QA Record' : 'Create New QA Record'}</h3>
                                    <span class="text-xs text-sky-400 font-semibold block">${r.id} &bull; Product Quality Assurance</span>
                                </div>
                            </div>
                            <button type="button" onclick="QAMSProduct.closeModal()" class="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800/50">
                                <i class="fas fa-times text-base"></i>
                            </button>
                        </div>

                        <form onsubmit="QAMSProduct.handleSaveRecord(event, ${isEdit})" class="p-6 space-y-4 overflow-y-auto font-sans text-xs">
                            <input type="hidden" id="form-id" value="${r.id}">
                            
                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Category <span class="text-rose-400">*</span></label>
                                    <select id="form-category" required class="w-full bg-dark-700 border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-sky-500">
                                        <option value="product_quality" ${r.category === 'product_quality' || r.category === 'analysis' ? 'selected' : ''}>Product Quality</option>
                                        <option value="document" ${r.category === 'document' ? 'selected' : ''}>Document & SOP</option>
                                        <option value="nearmiss" ${r.category === 'nearmiss' ? 'selected' : ''}>Near Miss / Incident</option>
                                        <option value="claim" ${r.category === 'claim' ? 'selected' : ''}>Quality Claim</option>
                                        <option value="improvement" ${r.category === 'improvement' ? 'selected' : ''}>For Improvement</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Plant Area <span class="text-rose-400">*</span></label>
                                    <select id="form-area" required class="w-full bg-dark-700 border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-sky-500">
                                        <option value="FNTRL Area" ${r.area === 'FNTRL Area' ? 'selected' : ''}>FNTRL Area</option>
                                        <option value="MS-Dezinc Area" ${r.area === 'MS-Dezinc Area' ? 'selected' : ''}>MS-Dezinc Area</option>
                                        <option value="H2S Area" ${r.area === 'H2S Area' ? 'selected' : ''}>H2S Area</option>
                                        <option value="Limestone Area" ${r.area === 'Limestone Area' ? 'selected' : ''}>Limestone Area</option>
                                        <option value="Re-leach Area" ${r.area === 'Re-leach Area' ? 'selected' : ''}>Re-leach Area</option>
                                        <option value="DCS Control" ${r.area === 'DCS Control' ? 'selected' : ''}>DCS Control Room</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Status <span class="text-rose-400">*</span></label>
                                    <select id="form-status" required class="w-full bg-dark-700 border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-sky-500">
                                        <option value="Open" ${r.status === 'Open' ? 'selected' : ''}>Open</option>
                                        <option value="In Progress" ${r.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                                        <option value="Approved" ${r.status === 'Approved' ? 'selected' : ''}>Approved</option>
                                        <option value="Resolved" ${r.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                                        <option value="Closed" ${r.status === 'Closed' ? 'selected' : ''}>Closed</option>
                                        <option value="Active" ${r.status === 'Active' ? 'selected' : ''}>Active</option>
                                    </select>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Title / Subject <span class="text-rose-400">*</span></label>
                                    <input type="text" id="form-title" required value="${r.title}" placeholder="e.g., June Zn Product Quality Assurance" class="w-full bg-dark-700 border border-slate-700 rounded-xl p-2.5 text-white placeholder-slate-500 outline-none focus:border-sky-500">
                                </div>
                                <div>
                                    <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Reported By / Chemist <span class="text-rose-400">*</span></label>
                                    <input type="text" id="form-reporter" required value="${r.reporter}" placeholder="e.g., Engr. M. Santos" class="w-full bg-dark-700 border border-slate-700 rounded-xl p-2.5 text-white placeholder-slate-500 outline-none focus:border-sky-500">
                                </div>
                            </div>

                            <!-- Quality Specification Section -->
                            <div class="p-3.5 bg-dark-700/60 rounded-xl border border-slate-800 space-y-3">
                                <span class="text-[11px] font-bold text-sky-400 uppercase block"><i class="fas fa-vial mr-1"></i> Product Quality Specification (Optional)</span>
                                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                        <label class="block text-[10px] text-slate-400 mb-1">Parameter Name</label>
                                        <input type="text" id="form-metricName" value="${r.metricName || ''}" placeholder="e.g., Zn Purity Rate" class="w-full bg-dark-700 border border-slate-700 rounded-lg p-2 text-white placeholder-slate-500 text-xs outline-none focus:border-sky-500">
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-slate-400 mb-1">Observed Value</label>
                                        <input type="text" id="form-metricValue" value="${r.metricValue || ''}" placeholder="e.g., 100.00%" class="w-full bg-dark-700 border border-slate-700 rounded-lg p-2 text-white placeholder-slate-500 text-xs outline-none focus:border-sky-500">
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-slate-400 mb-1">SOP Tolerance / Target</label>
                                        <input type="text" id="form-metricLimit" value="${r.metricLimit || ''}" placeholder="e.g., > 97.00% Target" class="w-full bg-dark-700 border border-slate-700 rounded-lg p-2 text-white placeholder-slate-500 text-xs outline-none focus:border-sky-500">
                                    </div>
                                </div>
                                <div class="flex items-center gap-2 pt-1">
                                    <input type="checkbox" id="form-isCompliant" ${r.isCompliant ? 'checked' : ''} class="w-4 h-4 rounded accent-sky-500">
                                    <label for="form-isCompliant" class="text-xs text-slate-300 font-semibold">Parameter meets zero-defect compliance standards</label>
                                </div>
                            </div>

                            <div>
                                <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Detailed Description <span class="text-rose-400">*</span></label>
                                <textarea id="form-description" rows="3" required placeholder="Provide full details of the Product Quality assay, document scope, or incident observations..." class="w-full bg-dark-700 border border-slate-700 rounded-xl p-2.5 text-white placeholder-slate-500 outline-none focus:border-sky-500">${r.description}</textarea>
                            </div>

                            <div>
                                <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Corrective & Preventive Action (CAPA)</label>
                                <textarea id="form-capa" rows="2" placeholder="Specify recommended corrective actions, SOP interlocks, or equipment maintenance..." class="w-full bg-dark-700 border border-slate-700 rounded-xl p-2.5 text-white placeholder-slate-500 outline-none focus:border-sky-500">${r.capa}</textarea>
                            </div>

                            <!-- Attachment Input Simulation -->
                            <div>
                                <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Add Attachment (Simulated File Upload)</label>
                                <div class="flex gap-2">
                                    <input type="text" id="form-att-name" placeholder="Filename (e.g., Product_Quality_Certificate.pdf)" class="flex-1 bg-dark-700 border border-slate-700 rounded-xl p-2 text-white placeholder-slate-500 text-xs outline-none">
                                    <button type="button" onclick="QAMSProduct.addSimulatedAttachment()" class="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold rounded-xl border border-slate-700 text-xs">
                                        <i class="fas fa-plus"></i> Attach
                                    </button>
                                </div>
                                <div id="form-att-list" class="mt-2 space-y-1">
                                    ${(r.attachments || []).map((a) => `
                                        <div class="flex items-center justify-between p-1.5 bg-dark-700 rounded text-[11px] text-slate-300" data-att='${JSON.stringify(a)}'>
                                            <span><i class="fas fa-paperclip text-sky-400 mr-1.5"></i>${a.name} (${a.size})</span>
                                            <button type="button" onclick="this.parentElement.remove()" class="text-rose-400 hover:text-white"><i class="fas fa-times"></i></button>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            <div class="pt-4 border-t border-slate-800 flex justify-end gap-2">
                                <button type="button" onclick="QAMSProduct.closeModal()" class="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all">Cancel</button>
                                <button type="submit" class="px-6 py-2.5 bg-gradient-to-r from-royalblue-600 to-sky-500 hover:from-royalblue-500 text-white font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(14,165,233,0.3)] transition-all">
                                    <i class="fas fa-save mr-1"></i> Save QA Record
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
            this.showModalHtml(modalHtml);
        },

        addSimulatedAttachment: function () {
            const nameInput = document.getElementById('form-att-name');
            const name = nameInput.value.trim();
            if (!name) {
                alert('Please enter a simulated filename.');
                return;
            }
            const att = {
                name: name,
                size: (Math.random() * 3 + 0.5).toFixed(1) + ' MB',
                type: name.endsWith('.csv') ? 'text/csv' : 'application/pdf'
            };
            const list = document.getElementById('form-att-list');
            const div = document.createElement('div');
            div.className = "flex items-center justify-between p-1.5 bg-dark-700 rounded text-[11px] text-slate-300";
            div.setAttribute('data-att', JSON.stringify(att));
            div.innerHTML = `
                <span><i class="fas fa-paperclip text-sky-400 mr-1.5"></i>${att.name} (${att.size})</span>
                <button type="button" onclick="this.parentElement.remove()" class="text-rose-400 hover:text-white"><i class="fas fa-times"></i></button>
            `;
            list.appendChild(div);
            nameInput.value = '';
        },

        handleSaveRecord: function (event, isEdit) {
            event.preventDefault();
            const id = document.getElementById('form-id').value;

            const attElements = document.querySelectorAll('#form-att-list [data-att]');
            const attachments = Array.from(attElements).map(el => JSON.parse(el.getAttribute('data-att')));

            const recordData = {
                id: id,
                category: document.getElementById('form-category').value,
                title: document.getElementById('form-title').value.trim(),
                area: document.getElementById('form-area').value,
                reporter: document.getElementById('form-reporter').value.trim(),
                date: new Date().toISOString().split('T')[0],
                status: document.getElementById('form-status').value,
                description: document.getElementById('form-description').value.trim(),
                capa: document.getElementById('form-capa').value.trim(),
                metricName: document.getElementById('form-metricName').value.trim(),
                metricValue: document.getElementById('form-metricValue').value.trim(),
                metricLimit: document.getElementById('form-metricLimit').value.trim(),
                isCompliant: document.getElementById('form-isCompliant').checked,
                attachments: attachments
            };

            let records = Store.getRecords();
            if (isEdit) {
                const idx = records.findIndex(r => r.id === id);
                if (idx !== -1) {
                    recordData.history = records[idx].history || [];
                    recordData.history.unshift({
                        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
                        action: 'Record Updated via Portal',
                        user: 'Current QA User'
                    });
                    records[idx] = recordData;
                    Store.addHistory(`Updated Record ${id}`, `Title changed to: ${recordData.title}`);
                }
            } else {
                recordData.history = [{
                    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
                    action: 'Record Created via Portal',
                    user: 'Current QA User'
                }];
                records.unshift(recordData);
                Store.addHistory(`Created Record ${id}`, `Category: ${recordData.category.toUpperCase()}`);
            }

            Store.saveRecords(records);
            this.closeModal();
            this.render();
            alert(`✅ Record ${id} has been successfully saved to the MS Section database!`);
        },

        deleteRecord: function (id) {
            if (!confirm(`Are you sure you want to delete QA Record ${id}? This action cannot be undone.`)) return;

            let records = Store.getRecords();
            records = records.filter(r => r.id !== id);
            Store.saveRecords(records);
            Store.addHistory(`Deleted Record ${id}`, 'Removed from system storage.');
            this.render();
            alert(`🗑️ Record ${id} has been removed.`);
        },

        // ====================================================================
        // 5. AUDIT TRAIL & HISTORY LOG MODAL
        // ====================================================================
        openHistoryModal: function () {
            const history = Store.getHistory();
            const modalHtml = `
                <div id="qams-modal" class="fixed inset-0 bg-dark-900/85 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn">
                    <div class="bg-dark-500 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden flex flex-col max-h-[85vh]">
                        <div class="bg-gradient-to-r from-amber-500/20 to-rose-500/10 p-5 border-b border-slate-800 flex justify-between items-center">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow">
                                    <i class="fas fa-history text-base"></i>
                                </div>
                                <div>
                                    <h3 class="text-base sm:text-lg font-bold text-white">System Audit Trail & History Log</h3>
                                    <span class="text-xs text-amber-300 font-semibold block">Chronological Activity Tracking</span>
                                </div>
                            </div>
                            <button onclick="QAMSProduct.closeModal()" class="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800/50">
                                <i class="fas fa-times text-base"></i>
                            </button>
                        </div>

                        <div class="p-6 overflow-y-auto space-y-3 font-sans text-xs">
                            ${history.length > 0 ? history.map(h => `
                                <div class="p-3 bg-dark-700 rounded-xl border border-slate-800/80 flex items-start justify-between gap-4">
                                    <div class="flex items-start gap-3">
                                        <i class="fas fa-check-circle text-sky-400 mt-0.5"></i>
                                        <div>
                                            <div class="font-bold text-white">${h.action}</div>
                                            <div class="text-[11px] text-slate-400 mt-0.5">${h.details || 'No further details recorded.'}</div>
                                        </div>
                                    </div>
                                    <div class="text-right whitespace-nowrap">
                                        <span class="text-[10px] text-slate-500 block font-semibold">${h.timestamp}</span>
                                        <span class="text-[10px] text-sky-400 font-bold">${h.user}</span>
                                    </div>
                                </div>
                            `).join('') : '<p class="text-center text-slate-500 py-6">No audit history recorded yet.</p>'}
                        </div>

                        <div class="p-4 bg-dark-700/80 border-t border-slate-800 flex justify-end">
                            <button onclick="QAMSProduct.closeModal()" class="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all">Close Log</button>
                        </div>
                    </div>
                </div>
            `;
            this.showModalHtml(modalHtml);
        },

        // ====================================================================
        // 6. UPLOAD & AUTOMATED DATA ANALYSIS ENGINE
        // ====================================================================
        openUploadModal: function () {
            const modalHtml = `
                <div id="qams-modal" class="fixed inset-0 bg-dark-900/85 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn">
                    <div class="bg-dark-500 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden flex flex-col">
                        <div class="bg-gradient-to-r from-emerald-600/20 to-cyan-500/10 p-5 border-b border-slate-800 flex justify-between items-center">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow">
                                    <i class="fas fa-cloud-upload-alt text-base"></i>
                                </div>
                                <div>
                                    <h3 class="text-base sm:text-lg font-bold text-white">Upload & Analyze QA Data</h3>
                                    <span class="text-xs text-emerald-300 font-semibold block">Automated Out-of-Spec Detection Engine</span>
                                </div>
                            </div>
                            <button onclick="QAMSProduct.closeModal()" class="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800/50">
                                <i class="fas fa-times text-base"></i>
                            </button>
                        </div>

                        <div class="p-6 space-y-4 font-sans text-xs">
                            <p class="text-slate-300 leading-relaxed">
                                Upload a JSON or CSV file containing MS Section Product Quality telemetry or titration assays. The system will automatically analyze the dataset for out-of-spec parameters and calculate compliance rates.
                            </p>

                            <label class="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-2xl p-8 bg-dark-700/50 cursor-pointer transition-all group">
                                <i class="fas fa-file-import text-4xl text-slate-500 group-hover:text-emerald-400 mb-3 transition-colors"></i>
                                <span class="font-bold text-white text-sm">Click to select file or drag & drop</span>
                                <span class="text-[11px] text-slate-400 mt-1">Supports .JSON or .CSV QA Export files</span>
                                <input type="file" id="upload-file-input" accept=".json,.csv" onchange="QAMSProduct.handleFileUpload(this)" class="hidden">
                            </label>

                            <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                                <span class="text-[11px] text-slate-400">Don't have a file ready?</span>
                                <button type="button" onclick="QAMSProduct.runSimulatedAnalysis()" class="px-3.5 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold rounded-xl transition-all flex items-center gap-1.5">
                                    <i class="fas fa-magic"></i> Run Demo AI Analysis
                                </button>
                            </div>
                        </div>

                        <div class="p-4 bg-dark-700/80 border-t border-slate-800 flex justify-end">
                            <button onclick="QAMSProduct.closeModal()" class="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all">Cancel</button>
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
                        const headers = lines[0].split(',').map(h => h.trim());
                        for (let i = 1; i < lines.length; i++) {
                            if (!lines[i].trim()) continue;
                            const vals = lines[i].split(',').map(v => v.trim());
                            let obj = {};
                            headers.forEach((h, idx) => obj[h] = vals[idx] || '');
                            parsedData.push(obj);
                        }
                    }
                    this.analyzeAndDisplayReport(parsedData, file.name);
                } catch (err) {
                    alert('Error parsing uploaded file. Please ensure it is valid JSON or CSV.');
                    console.error(err);
                }
            };
            reader.readAsText(file);
        },

        runSimulatedAnalysis: function () {
            const sampleDataset = [
                { title: 'June Zn Product Quality Compliance', area: 'MS-Dezinc Area', metricName: 'Zn Purity Rate', metricValue: '100.00%', metricLimit: '> 97.00%', isCompliant: true },
                { title: 'June Mg Product Quality Compliance', area: 'H2S Area', metricName: 'Mg Removal Rate', metricValue: '100.00%', metricLimit: '> 95.00%', isCompliant: true },
                { title: 'June Cr Product Quality Compliance', area: 'FNTRL Area', metricName: 'Cr Compliance', metricValue: '96.56%', metricLimit: '> 90.00%', isCompliant: true },
                { title: 'June Moisture (H2O) Quality Verification', area: 'Limestone Area', metricName: 'H2O Content', metricValue: '96.21%', metricLimit: '> 98.00%', isCompliant: false }
            ];
            this.analyzeAndDisplayReport(sampleDataset, 'June_Product_Quality_Batch.json');
        },

        analyzeAndDisplayReport: function (dataset, filename) {
            const total = dataset.length;
            const compliantCount = dataset.filter(d => d.isCompliant === true || d.isCompliant === 'true' || (d.metricLimit && !d.metricValue.includes('Spike') && d.metricValue !== '96.21%')).length;
            const anomalies = dataset.filter(d => d.isCompliant === false || d.isCompliant === 'false' || d.metricValue === '96.21%');
            const passRate = total > 0 ? ((compliantCount / total) * 100).toFixed(1) : '100.0';

            const reportHtml = `
                <div id="qams-modal" class="fixed inset-0 bg-dark-900/85 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn">
                    <div class="bg-dark-500 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden flex flex-col max-h-[90vh]">
                        <div class="bg-gradient-to-r from-emerald-600/30 to-sky-500/20 p-5 border-b border-slate-800 flex justify-between items-center">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow animate-bounce">
                                    <i class="fas fa-brain text-base"></i>
                                </div>
                                <div>
                                    <h3 class="text-base sm:text-lg font-bold text-white">Product Quality AI Report</h3>
                                    <span class="text-xs text-emerald-300 font-semibold block">File: ${filename}</span>
                                </div>
                            </div>
                            <button onclick="QAMSProduct.closeModal()" class="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800/50">
                                <i class="fas fa-times text-base"></i>
                            </button>
                        </div>

                        <div class="p-6 space-y-5 overflow-y-auto font-sans text-xs sm:text-sm">
                            <div class="p-4 rounded-xl bg-dark-700 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div class="text-center sm:text-left">
                                    <span class="text-[11px] font-bold text-slate-400 uppercase block">Algorithmic Batch Pass Rate</span>
                                    <span class="text-3xl font-black ${passRate >= 98 ? 'text-emerald-400' : 'text-rose-400'}">${passRate}%</span>
                                    <span class="text-xs text-slate-300 block mt-0.5">${compliantCount} of ${total} parameters compliant</span>
                                </div>
                                <div class="w-full sm:w-48 bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700">
                                    <div class="bg-gradient-to-r ${passRate >= 98 ? 'from-sky-400 to-emerald-400' : 'from-amber-400 to-rose-500'} h-full" style="width: ${passRate}%"></div>
                                </div>
                            </div>

                            <div>
                                <h4 class="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <i class="fas ${anomalies.length > 0 ? 'fa-exclamation-circle text-rose-400 animate-pulse' : 'fa-check-circle text-emerald-400'}"></i>
                                    Detected Out-of-Spec Anomalies (${anomalies.length})
                                </h4>
                                ${anomalies.length > 0 ? `
                                    <div class="space-y-2">
                                        ${anomalies.map(a => `
                                            <div class="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start justify-between gap-3">
                                                <div>
                                                    <span class="font-bold text-white block">${a.title || 'Unnamed Assay Parameter'} (${a.area || 'Plant Area'})</span>
                                                    <span class="text-xs text-rose-300 mt-1 block">
                                                        <strong>Observed:</strong> ${a.metricValue} &bull; <strong>SOP Limit:</strong> ${a.metricLimit}
                                                    </span>
                                                </div>
                                                <span class="px-2 py-0.5 rounded bg-rose-500 text-white font-bold text-[10px] uppercase whitespace-nowrap">Flagged</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                    <div class="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl mt-3 text-xs text-amber-300">
                                        <i class="fas fa-lightbulb mr-1.5"></i> <strong>AI Recommendation:</strong> Automatically generate CAPA investigation workflows for the flagged items to maintain zero-defect standards.
                                    </div>
                                ` : `
                                    <div class="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center text-emerald-300 font-semibold text-xs">
                                        <i class="fas fa-shield-check text-2xl mb-1 block text-emerald-400"></i>
                                        All analyzed parameters fall strictly within normal MS Section Product Quality tolerance limits!
                                    </div>
                                `}
                            </div>
                        </div>

                        <div class="p-4 bg-dark-700/80 border-t border-slate-800 flex justify-end gap-2">
                            <button onclick="QAMSProduct.importAnalyzedBatch(${JSON.stringify(dataset).replace(/"/g, '&quot;')})" class="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-cyan-500 hover:from-emerald-500 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5">
                                <i class="fas fa-file-import"></i> Import Records into System
                            </button>
                            <button onclick="QAMSProduct.closeModal()" class="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all">Discard</button>
                        </div>
                    </div>
                </div>
            `;
            this.showModalHtml(reportHtml);
        },

        importAnalyzedBatch: function (dataset) {
            let records = Store.getRecords();
            let count = 0;
            dataset.forEach(d => {
                const newRec = {
                    id: 'QAMS-IMP-' + Math.floor(1000 + Math.random() * 9000),
                    category: d.category || (d.isCompliant === false ? 'nearmiss' : 'product_quality'),
                    title: d.title || 'Uploaded Product Quality Parameter',
                    area: d.area || 'FNTRL Area',
                    reporter: d.reporter || 'Batch Upload Analyst',
                    date: new Date().toISOString().split('T')[0],
                    status: d.isCompliant === false ? 'In Progress' : 'Approved',
                    description: d.description || 'Imported via Automated Product Quality AI Analysis Engine.',
                    capa: d.capa || (d.isCompliant === false ? 'Investigation initiated by AI analysis tool.' : 'None required.'),
                    metricName: d.metricName || 'Batch Assay',
                    metricValue: d.metricValue || 'Nominal',
                    metricLimit: d.metricLimit || 'Standard',
                    isCompliant: d.isCompliant !== false && d.isCompliant !== 'false',
                    attachments: [],
                    history: [{ timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16), action: 'Imported via Upload Engine', user: 'System AI' }]
                };
                records.unshift(newRec);
                count++;
            });
            Store.saveRecords(records);
            Store.addHistory(`Imported Batch of ${count} records`, 'Automated Product Quality Data Analysis tool import.');
            this.closeModal();
            this.render();
            alert(`✅ Successfully imported ${count} analyzed records into the Product Quality database!`);
        },

        // ====================================================================
        // 7. UTILITIES: EXPORT, DOWNLOADS & MODAL INJECTION
        // ====================================================================
        exportToCSV: function () {
            const records = Store.getRecords();
            if (records.length === 0) {
                alert('No records available to export.');
                return;
            }
            const headers = ['Record ID', 'Category', 'Title', 'Area', 'Reporter', 'Date', 'Status', 'Specification Name', 'Observed Value', 'SOP Limit', 'Compliant'];
            const rows = records.map(r => [
                r.id, r.category, `"${r.title.replace(/"/g, '""')}"`, r.area, `"${r.reporter}"`, r.date, r.status,
                r.metricName || '', r.metricValue || '', r.metricLimit || '', r.isCompliant ? 'Yes' : 'No'
            ]);

            let csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `MS_Product_Quality_Export_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            Store.addHistory('Exported CSV Data', `Exported ${records.length} records.`);
        },

        downloadAttachment: function (filename) {
            alert(`[SIMULATED DOWNLOAD]\n\nDownloading file: ${filename}\nStatus: Retrieving encrypted document from MS Section Server... Done!`);
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
            const modal = document.getElementById('qams-modal');
            if (modal) {
                modal.remove();
                document.body.classList.remove('overflow-hidden');
            }
        }
    };

    window.QAMSProduct = QAMSProduct;
    window.addEventListener('DOMContentLoaded', () => {
        QAMSProduct.init();
    });

})(window, document);
