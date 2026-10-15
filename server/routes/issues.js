const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');

// @route   POST api/issues/create
router.post('/create', async (req, res) => {
    try {
        const { title, description, priority, reportedBy } = req.body;

        let slaHours = 24; 
        if (priority === 'Critical') slaHours = 2;
        if (priority === 'High') slaHours = 6;
        if (priority === 'Low') slaHours = 48;

        const deadline = new Date();
        deadline.setHours(deadline.getHours() + slaHours);

        const newIssue = new Issue({
            title,
            description,
            priority,
            reportedBy,
            deadline 
        });

        const issue = await newIssue.save();
        res.status(201).json({ success: true, data: issue });
    } catch (err) {
        console.error("🔥 CREATE ERROR:", err.message);
        res.status(500).json({ success: false, msg: "Failed to initialize SLA" });
    }
});

// @route   GET api/issues/
router.get('/', async (req, res) => {
    try {
        const issues = await Issue.find().sort({ createdAt: -1 });
        res.json({ success: true, data: issues });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server Error" });
    }
});

// @route   PUT api/issues/assign/:id
router.put('/assign/:id', async (req, res) => {
    try {
        const { engineerName } = req.body;
        const updatedIssue = await Issue.findByIdAndUpdate(
            req.params.id,
            { assignedTo: engineerName, status: 'In Progress' },
            { new: true }
        );
        res.json({ success: true, data: updatedIssue });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Assignment failed" });
    }
});

// @route   PUT api/issues/resolve/:id
// 🟢 FIXED: Ab yeh automatically calculate karega ki ticket on-time resolve hua ya late (Breach).
router.put('/resolve/:id', async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id);
        if (!issue) return res.status(404).json({ success: false, msg: "Issue not found" });

        const now = new Date();
        
        // Check if resolution time passed the deadline
        const isBreached = now > issue.deadline;

        // Calculate resolution time in minutes
        const timeDiffMs = now - issue.createdAt;
        const actualResolutionTime = Math.round(timeDiffMs / (1000 * 60));

        issue.status = 'Resolved';
        issue.resolvedAt = now;
        issue.isBreached = isBreached;
        issue.actualResolutionTime = actualResolutionTime;

        await issue.save();
        res.json({ success: true, data: issue });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Resolution failed" });
    }
});

// @route   GET api/issues/analytics
// 🟢 NEW: Dashboard ke statistics metrics (Total counters) nikalne ke liye
router.get('/analytics', async (req, res) => {
    try {
        const totalTickets = await Issue.countDocuments();
        const openTickets = await Issue.countDocuments({ status: 'Open' });
        const inProgressTickets = await Issue.countDocuments({ status: 'In Progress' });
        const resolvedTickets = await Issue.countDocuments({ status: 'Resolved' });
        const breachedTickets = await Issue.countDocuments({ isBreached: true });

        // Calculate Average Resolution Time of resolved tickets
        const resolvedIssues = await Issue.find({ status: 'Resolved' });
        let avgResolutionTime = 0;
        if (resolvedIssues.length > 0) {
            const totalMinutes = resolvedIssues.reduce((sum, item) => sum + (item.actualResolutionTime || 0), 0);
            avgResolutionTime = Math.round(totalMinutes / resolvedIssues.length); // in minutes
        }

        res.json({
            success: true,
            metrics: {
                totalTickets,
                openTickets,
                inProgressTickets,
                resolvedTickets,
                breachedTickets,
                avgResolutionTime: `${avgResolutionTime} mins`
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Failed to fetch analytics" });
    }
});

module.exports = router;