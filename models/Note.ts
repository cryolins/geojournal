import { Schema, model, models } from "mongoose";

const NoteSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, default: "Untitled note" },
    body: String,
    imageLinks: [String],
    categoryIds: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    location: {
        type: { type: String, enum: ["Point"], required: true},
        coordinates: { type: [Number], required: true }
    }
},
{
    timestamps: true
});

export const Note = models.Note || model("Note", NoteSchema);