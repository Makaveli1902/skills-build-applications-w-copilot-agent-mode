"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    fitnessLevel: { type: String, required: true, trim: true },
    weeklyGoal: { type: Number, required: true, min: 1 },
    favoriteActivity: { type: String, required: true, trim: true },
}, { timestamps: true });
const UserModel = mongoose_1.models.User || (0, mongoose_1.model)('User', userSchema);
exports.UserModel = UserModel;
