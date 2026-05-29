"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const database_1 = require("./config/database");
const models_1 = require("./models");
const app = (0, express_1.default)();
const port = 8000;
app.use(express_1.default.json());
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : `http://localhost:${port}`;
const apiUrl = `${baseUrl}/api`;
const createCollectionHandler = (resource, message, payloadKey, query) => {
    app.get(`/api/${resource}`, async (_req, res) => {
        try {
            const payload = await query();
            res.json({
                resource,
                message,
                [payloadKey]: payload,
                url: `${apiUrl}/${resource}`,
            });
        }
        catch (error) {
            res.status(500).json({
                resource,
                message: `Unable to load ${resource}.`,
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    });
};
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ok',
        baseUrl,
        apiUrl,
        database: {
            uri: database_1.mongoUri,
            readyState: mongoose_1.default.connection.readyState,
        },
    });
});
createCollectionHandler('users', 'User profile and authentication endpoints are ready.', 'items', async () => models_1.UserModel.find().sort({ name: 1 }).lean());
createCollectionHandler('teams', 'Team management endpoints are ready.', 'items', async () => models_1.TeamModel.find()
    .populate('captainId', 'name email fitnessLevel')
    .populate('memberIds', 'name email fitnessLevel')
    .sort({ name: 1 })
    .lean());
createCollectionHandler('activities', 'Activity tracking endpoints are ready.', 'items', async () => models_1.ActivityModel.find()
    .populate('userId', 'name favoriteActivity')
    .populate('teamId', 'name city')
    .sort({ completedAt: -1 })
    .lean());
createCollectionHandler('leaderboard', 'Leaderboard endpoint is ready.', 'rankings', async () => models_1.LeaderboardModel.find()
    .populate('userId', 'name fitnessLevel')
    .populate('teamId', 'name city')
    .sort({ rank: 1 })
    .lean());
createCollectionHandler('workouts', 'Workout suggestion endpoint is ready.', 'suggestions', async () => models_1.WorkoutModel.find()
    .populate('recommendedForUserId', 'name fitnessLevel favoriteActivity')
    .sort({ difficulty: 1, title: 1 })
    .lean());
const startServer = async () => {
    try {
        await (0, database_1.connectToDatabase)();
        console.log(`Connected to MongoDB at ${database_1.mongoUri}`);
        app.listen(port, () => {
            console.log(`OctoFit backend listening on ${baseUrl}`);
        });
    }
    catch (error) {
        console.error('Failed to start backend:', error);
        process.exit(1);
    }
};
void startServer();
