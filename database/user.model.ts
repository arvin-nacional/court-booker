import { Schema, model, models, Document } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: string;
  picture: string;
  joinedAt: Date;
  address: Schema.Types.ObjectId;
  privacyPolicyAccepted: boolean;
  verified: boolean;
}

const UserSchema = new Schema({
  clerkId: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String },
  picture: { type: String, required: true },
  role: { type: String, default: "user" },
  address: { type: Schema.Types.ObjectId, ref: "Address" },
  joinedAt: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false },
  privacyPolicyAccepted: { type: Boolean, default: false },
});

const User = models.User || model("User", UserSchema);

export default User;
