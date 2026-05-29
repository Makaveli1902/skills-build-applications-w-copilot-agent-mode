import express from 'express';
import mongoose from 'mongoose';

import { connectToDatabase, mongoUri } from './config/database';
import { ActivityModel, LeaderboardModel, TeamModel, UserModel, WorkoutModel } from './models';

const app = express();
const port = 8000;

app.use(express.json());

const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : `http://localhost:${port}`;
const apiUrl = `${baseUrl}/api`;

const createCollectionHandler = <TResponse>(
  resource: string,
  message: string,
  payloadKey: string,
  query: () => Promise<TResponse>,
) => {
  app.get(`/api/${resource}`, async (_req, res) => {
    try {
      const payload = await query();

      res.json({
        resource,
        message,
        [payloadKey]: payload,
        url: `${apiUrl}/${resource}`,
      });
    } catch (error) {
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
      uri: mongoUri,
      readyState: mongoose.connection.readyState,
    },
  });
});

createCollectionHandler('users', 'User profile and authentication endpoints are ready.', 'items', async () =>
  UserModel.find().sort({ name: 1 }).lean(),
);

createCollectionHandler('teams', 'Team management endpoints are ready.', 'items', async () =>
  TeamModel.find()
    .populate('captainId', 'name email fitnessLevel')
    .populate('memberIds', 'name email fitnessLevel')
    .sort({ name: 1 })
    .lean(),
);

createCollectionHandler('activities', 'Activity tracking endpoints are ready.', 'items', async () =>
  ActivityModel.find()
    .populate('userId', 'name favoriteActivity')
    .populate('teamId', 'name city')
    .sort({ completedAt: -1 })
    .lean(),
);

createCollectionHandler('leaderboard', 'Leaderboard endpoint is ready.', 'rankings', async () =>
  LeaderboardModel.find()
    .populate('userId', 'name fitnessLevel')
    .populate('teamId', 'name city')
    .sort({ rank: 1 })
    .lean(),
);

createCollectionHandler('workouts', 'Workout suggestion endpoint is ready.', 'suggestions', async () =>
  WorkoutModel.find()
    .populate('recommendedForUserId', 'name fitnessLevel favoriteActivity')
    .sort({ difficulty: 1, title: 1 })
    .lean(),
);

const startServer = async () => {
  try {
    await connectToDatabase();
    console.log(`Connected to MongoDB at ${mongoUri}`);

    app.listen(port, () => {
      console.log(`OctoFit backend listening on ${baseUrl}`);
    });
  } catch (error) {
    console.error('Failed to start backend:', error);
    process.exit(1);
  }
};

void startServer();
