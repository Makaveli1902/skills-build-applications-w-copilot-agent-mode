"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamModel = void 0;
const mongoose_1 = require("mongoose");
const teamSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    mission: { type: String, required: true, trim: true },
    memberIds: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true }],
    captainId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
const TeamModel = mongoose_1.models.Team || (0, mongoose_1.model)('Team', teamSchema);
exports.TeamModel = TeamModel;
