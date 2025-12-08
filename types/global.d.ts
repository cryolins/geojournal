import mongoose from "mongoose";

// create global mongoose variable to use for caching
declare global {
    var mongoose: {
        conn: mongoose | null;
        promise: Promise<mongoose> | null;
    };
}

export {};
