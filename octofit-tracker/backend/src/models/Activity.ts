import { InferSchemaType, model, models, Schema, Types } from 'mongoose';

const activitySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    teamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    type: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    caloriesBurned: { type: Number, required: true, min: 0 },
    completedAt: { type: Date, required: true },
  },
  { timestamps: true },
);

type ActivityDocument = InferSchemaType<typeof activitySchema> & {
  userId: Types.ObjectId;
  teamId: Types.ObjectId;
};

const ActivityModel = models.Activity || model<ActivityDocument>('Activity', activitySchema);

export { ActivityModel };
export type { ActivityDocument };