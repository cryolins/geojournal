import { Schema, model, models } from "mongoose";

const hexValidator = (s: string) => (/^#([0-9a-f]{3}){1,2}$/i).test(s);

const CategorySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    color: { type: String, default: "#7f7f7f", lowercase: true,
        validate: {
            validator: hexValidator,
            message: "Invalid hex code"
        }
      }
});

// category must be unique per user
CategorySchema.index({ userId: 1, name: 1 }, { unique: true });

export const Category = models.Category || model("Category", CategorySchema);
