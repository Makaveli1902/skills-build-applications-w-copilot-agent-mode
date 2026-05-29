import { InferSchemaType, model, models, Schema, Types } from 'mongoose';

const workoutSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    difficulty: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    focusAreas: [{ type: String, required: true, trim: true }],
    recommendedForUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

type WorkoutDocument = InferSchemaType<typeof workoutSchema> & {
  recommendedForUserId: Types.ObjectId;
};

const WorkoutModel = models.Workout || model<WorkoutDocument>('Workout', workoutSchema);

export { WorkoutModel };
export type { WorkoutDocument };