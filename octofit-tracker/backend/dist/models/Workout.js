"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutModel = void 0;
const mongoose_1 = require("mongoose");
const workoutSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    difficulty: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    focusAreas: [{ type: String, required: true, trim: true }],
    recommendedForUserId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
const WorkoutModel = mongoose_1.models.Workout || (0, mongoose_1.model)('Workout', workoutSchema);
exports.WorkoutModel = WorkoutModel;
