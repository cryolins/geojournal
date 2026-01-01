import { Schema, model, models } from "mongoose";

const CategorySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: {type: String, required: true}
});

// category must be unique per user
CategorySchema.index({ userId: 1, name: 1 }, { unique: true });

export const Category = models.Category || model("Category", CategorySchema);
