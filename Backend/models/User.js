import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  plan: {
    type: String,
    enum: ["free", "pro", "prime"],
    default: "free",
  },
  messageCountToday: {
    type: Number,
    default: 0,
  },
  messageCountDate: {
    type: String,
    default: () => new Date().toISOString().slice(0, 10),
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    plan: this.plan,
    createdAt: this.createdAt,
  };
};

export default mongoose.model("User", UserSchema);
