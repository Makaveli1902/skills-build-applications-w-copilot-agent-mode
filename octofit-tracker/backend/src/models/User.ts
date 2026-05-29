import { InferSchemaType, model, models, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    fitnessLevel: { type: String, required: true, trim: true },
    weeklyGoal: { type: Number, required: true, min: 1 },
    favoriteActivity: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

type UserDocument = InferSchemaType<typeof userSchema>;

const UserModel = models.User || model<UserDocument>('User', userSchema);

export { UserModel };
export type { UserDocument };