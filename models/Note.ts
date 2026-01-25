import { Schema, model, models } from "mongoose";

const NoteSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, default: "Untitled note" },
    body: String,
    imageLinks: [String],
    categoryIds: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    location: {
        type: { type: String, enum: ["Point"], required: true },
        coordinates: { type: [Number], required: true }
    },
    h3: { 
        h3_7: { type: String, required: true },
        h3_8: { type: String, required: true },
        h3_9: { type: String, required: true },
    }
},
{
    timestamps: true
});

// indexes to help search
NoteSchema.index({ location: "2dsphere" });
NoteSchema.index({ userId: 1, categories: 1 });

export const Note = models.Note || model("Note", NoteSchema);