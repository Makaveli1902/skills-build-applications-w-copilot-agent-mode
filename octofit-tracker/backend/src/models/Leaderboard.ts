import { InferSchemaType, model, models, Schema, Types } from 'mongoose';

const leaderboardSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    teamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    points: { type: Number, required: true, min: 0 },
    streakDays: { type: Number, required: true, min: 0 },
    rank: { type: Number, required: true, min: 1 },
  },
  { timestamps: true },
);

type LeaderboardDocument = InferSchemaType<typeof leaderboardSchema> & {
  userId: Types.ObjectId;
  teamId: Types.ObjectId;
};

const LeaderboardModel = models.Leaderboard || model<LeaderboardDocument>('Leaderboard', leaderboardSchema);

export { LeaderboardModel };
export type { LeaderboardDocument };