const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    priority: { 
        type: String, 
        enum: ['Low', 'Medium', 'High', 'Critical'], 
        default: 'Medium' 
    },
    status: { 
        type: String, 
        enum: ['Open', 'In Progress', 'Resolved'], 
        default: 'Open' 
    },
    reportedBy: { type: String, required: true }, 
    assignedTo: { type: String, default: 'Unassigned' },
    deadline: { type: Date }, 
    resolvedAt: { type: Date },                 // 🟢 Kab resolve hua
    isBreached: { type: Boolean, default: false },// 🟢 SLA breach hua ya nahi
    actualResolutionTime: { type: Number },     // 🟢 Minutes mein kitna time laga
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Issue', IssueSchema);