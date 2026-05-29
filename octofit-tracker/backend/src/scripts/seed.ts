import mongoose from 'mongoose';

import { connectToDatabase, mongoUri } from '../config/database';
import { ActivityModel, LeaderboardModel, TeamModel, UserModel, WorkoutModel } from '../models';

const seedDatabase = async () => {
  console.log('Seed the octofit_db database with test data');

  await connectToDatabase();

  await Promise.all([
    ActivityModel.deleteMany({}),
    LeaderboardModel.deleteMany({}),
    TeamModel.deleteMany({}),
    UserModel.deleteMany({}),
    WorkoutModel.deleteMany({}),
  ]);

  const users = await UserModel.insertMany([
    {
      name: 'Maya Chen',
      email: 'maya.chen@example.com',
      fitnessLevel: 'Intermediate',
      weeklyGoal: 5,
      favoriteActivity: 'HIIT',
    },
    {
      name: 'Jordan Alvarez',
      email: 'jordan.alvarez@example.com',
      fitnessLevel: 'Advanced',
      weeklyGoal: 6,
      favoriteActivity: 'Cycling',
    },
    {
      name: 'Priya Nair',
      email: 'priya.nair@example.com',
      fitnessLevel: 'Beginner',
      weeklyGoal: 4,
      favoriteActivity: 'Yoga',
    },
  ]);

  const teams = await TeamModel.insertMany([
    {
      name: 'Summit Squad',
      city: 'Seattle',
      mission: 'Train for stronger endurance every week.',
      memberIds: [users[0]._id, users[1]._id],
      captainId: users[1]._id,
    },
    {
      name: 'Pulse Collective',
      city: 'Austin',
      mission: 'Build consistency through balanced workouts.',
      memberIds: [users[0]._id, users[2]._id],
      captainId: users[0]._id,
    },
  ]);

  await ActivityModel.insertMany([
    {
      userId: users[0]._id,
      teamId: teams[1]._id,
      type: 'HIIT Circuit',
      durationMinutes: 42,
      caloriesBurned: 460,
      completedAt: new Date('2026-05-24T07:15:00.000Z'),
    },
    {
      userId: users[1]._id,
      teamId: teams[0]._id,
      type: 'Hill Cycling',
      durationMinutes: 58,
      caloriesBurned: 720,
      completedAt: new Date('2026-05-25T13:30:00.000Z'),
    },
    {
      userId: users[2]._id,
      teamId: teams[1]._id,
      type: 'Mobility Yoga',
      durationMinutes: 35,
      caloriesBurned: 190,
      completedAt: new Date('2026-05-26T18:00:00.000Z'),
    },
    {
      userId: users[0]._id,
      teamId: teams[0]._id,
      type: 'Tempo Run',
      durationMinutes: 50,
      caloriesBurned: 540,
      completedAt: new Date('2026-05-27T06:45:00.000Z'),
    },
  ]);

  await LeaderboardModel.insertMany([
    {
      userId: users[1]._id,
      teamId: teams[0]._id,
      points: 1280,
      streakDays: 16,
      rank: 1,
    },
    {
      userId: users[0]._id,
      teamId: teams[1]._id,
      points: 1175,
      streakDays: 12,
      rank: 2,
    },
    {
      userId: users[2]._id,
      teamId: teams[1]._id,
      points: 940,
      streakDays: 9,
      rank: 3,
    },
  ]);

  await WorkoutModel.insertMany([
    {
      title: 'Explosive Core Builder',
      difficulty: 'Intermediate',
      durationMinutes: 30,
      focusAreas: ['Core', 'Cardio'],
      recommendedForUserId: users[0]._id,
    },
    {
      title: 'Endurance Climb Ride',
      difficulty: 'Advanced',
      durationMinutes: 55,
      focusAreas: ['Legs', 'Endurance'],
      recommendedForUserId: users[1]._id,
    },
    {
      title: 'Recovery Flow Sequence',
      difficulty: 'Beginner',
      durationMinutes: 25,
      focusAreas: ['Mobility', 'Breathing'],
      recommendedForUserId: users[2]._id,
    },
  ]);

  console.log(`Seeded octofit_db at ${mongoUri}`);
};

void seedDatabase()
  .catch((error) => {
    console.error('Failed to seed database:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });