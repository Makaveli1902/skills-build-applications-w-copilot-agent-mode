import { InferSchemaType, model, models, Schema, Types } from 'mongoose';

const teamSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    mission: { type: String, required: true, trim: true },
    memberIds: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    captainId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

type TeamDocument = InferSchemaType<typeof teamSchema> & {
  memberIds: Types.ObjectId[];
  captainId: Types.ObjectId;
};

const TeamModel = models.Team || model<TeamDocument>('Team', teamSchema);

export { TeamModel };
export type { TeamDocument };