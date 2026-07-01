// activity.js - Activity/Task Management Functions

const ACTIVITY_DB_KEY = 'qg_activities_db';

// Initialize activity database
function initializeActivityDB() {
    const existingDB = localStorage.getItem(ACTIVITY_DB_KEY);
    if (!existingDB) {
        const initialDB = {
            activities: [
                {
                    id: 'ACT-001',
                    title: 'Bag seal integrity spot check',
                    category: 'MS Bagger Checking',
                    priority: 'High',
                    status: 'Completed',
                    description: 'Verify all bag seals are intact and secure',
                    ownerUsername: 'admin',
                    dueDate: '2026-07-05',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    history: [
                        { status: 'Pending', at: new Date(Date.now() - 86400000).toISOString() },
                        { status: 'In Progress', at: new Date(Date.now() - 43200000).toISOString() },
                        { status: 'Completed', at: new Date().toISOString() }
                    ]
                }
            ]
        };
        localStorage.setItem(ACTIVITY_DB_KEY, JSON.stringify(initialDB));
    }
}

// Get all activities
function getAllActivities() {
    const db = JSON.parse(localStorage.getItem(ACTIVITY_DB_KEY) || '{"activities":[]}');
    return db.activities || [];
}

// Get user activities
function getUserActivities(username) {
    const activities = getAllActivities();
    return activities.filter(a => a.ownerUsername === username);
}

// Create new activity
function createActivity(activityData) {
    const activities = getAllActivities();
    
    const newActivity = {
        id: 'ACT-' + String(activities.length + 1).padStart(3, '0'),
        title: activityData.title,
        category: activityData.category || 'Other',
        priority: activityData.priority || 'Medium',
        status: 'Pending',
        description: activityData.description || '',
        ownerUsername: activityData.ownerUsername,
        dueDate: activityData.dueDate || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        history: [
            { status: 'Pending', at: new Date().toISOString() }
        ]
    };
    
    activities.push(newActivity);
    const db = { activities };
    localStorage.setItem(ACTIVITY_DB_KEY, JSON.stringify(db));
    
    return { success: true, activity: newActivity };
}

// Update activity status
function updateActivityStatus(activityId, newStatus) {
    const activities = getAllActivities();
    const activityIndex = activities.findIndex(a => a.id === activityId);
    
    if (activityIndex === -1) {
        return { success: false, error: 'Activity not found' };
    }
    
    const STAGES = ['Pending', 'In Progress', 'Under Review', 'Completed'];
    if (!STAGES.includes(newStatus)) {
        return { success: false, error: 'Invalid status' };
    }
    
    activities[activityIndex].status = newStatus;
    activities[activityIndex].updatedAt = new Date().toISOString();
    activities[activityIndex].history.push({
        status: newStatus,
        at: new Date().toISOString()
    });
    
    const db = { activities };
    localStorage.setItem(ACTIVITY_DB_KEY, JSON.stringify(db));
    
    return { success: true, activity: activities[activityIndex] };
}

// Advance activity to next stage
function advanceActivity(activityId) {
    const activities = getAllActivities();
    const activity = activities.find(a => a.id === activityId);
    
    if (!activity) {
        return { success: false, error: 'Activity not found' };
    }
    
    const STAGES = ['Pending', 'In Progress', 'Under Review', 'Completed'];
    const currentIndex = STAGES.indexOf(activity.status);
    
    if (currentIndex === -1 || currentIndex === STAGES.length - 1) {
        return { success: false, error: 'Cannot advance further' };
    }
    
    return updateActivityStatus(activityId, STAGES[currentIndex + 1]);
}

// Update activity details
function updateActivity(activityId, updates) {
    const activities = getAllActivities();
    const activityIndex = activities.findIndex(a => a.id === activityId);
    
    if (activityIndex === -1) {
        return { success: false, error: 'Activity not found' };
    }
    
    activities[activityIndex] = {
        ...activities[activityIndex],
        ...updates,
        updatedAt: new Date().toISOString()
    };
    
    const db = { activities };
    localStorage.setItem(ACTIVITY_DB_KEY, JSON.stringify(db));
    
    return { success: true, activity: activities[activityIndex] };
}

// Delete activity
function deleteActivity(activityId) {
    const activities = getAllActivities();
    const activityIndex = activities.findIndex(a => a.id === activityId);
    
    if (activityIndex === -1) {
        return { success: false, error: 'Activity not found' };
    }
    
    activities.splice(activityIndex, 1);
    const db = { activities };
    localStorage.setItem(ACTIVITY_DB_KEY, JSON.stringify(db));
    
    return { success: true };
}

// Get activity by ID
function getActivityById(activityId) {
    const activities = getAllActivities();
    return activities.find(a => a.id === activityId) || null;
}

// Get activities by status
function getActivitiesByStatus(status) {
    const activities = getAllActivities();
    return activities.filter(a => a.status === status);
}

// Get activities by category
function getActivitiesByCategory(category) {
    const activities = getAllActivities();
    return activities.filter(a => a.category === category);
}

// Get activity statistics
function getActivityStats(username = null) {
    let activities = getAllActivities();
    if (username) {
        activities = activities.filter(a => a.ownerUsername === username);
    }
    
    const completed = activities.filter(a => a.status === 'Completed').length;
    const inProgress = activities.filter(a => a.status === 'In Progress').length;
    const pending = activities.filter(a => a.status === 'Pending').length;
    const underReview = activities.filter(a => a.status === 'Under Review').length;
    
    return {
        total: activities.length,
        completed,
        inProgress,
        pending,
        underReview,
        completionRate: activities.length > 0 ? Math.round((completed / activities.length) * 100) : 0,
        overdue: activities.filter(a => a.dueDate && a.status !== 'Completed' && a.dueDate < todayStr()).length
    };
}

// Search activities
function searchActivities(query, username = null) {
    let activities = getAllActivities();
    if (username) {
        activities = activities.filter(a => a.ownerUsername === username);
    }
    
    const lowerQuery = query.toLowerCase();
    return activities.filter(a =>
        a.title.toLowerCase().includes(lowerQuery) ||
        a.category.toLowerCase().includes(lowerQuery) ||
        a.id.toLowerCase().includes(lowerQuery)
    );
}

// Get completion trend (last 14 days)
function getCompletionTrend() {
    const activities = getAllActivities();
    const days = [];
    
    for (let i = 13; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const completed = activities.filter(a =>
            a.status === 'Completed' &&
            a.updatedAt &&
            a.updatedAt.split('T')[0] === dateStr
        ).length;
        
        days.push({
            day: dateStr.slice(5),
            completed: completed
        });
    }
    
    return days;
}

// Helper function
function todayStr() {
    return new Date().toISOString().split('T')[0];
}

// Initialize on load
initializeActivityDB();