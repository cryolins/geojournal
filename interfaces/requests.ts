import { z } from 'zod';

// for note api's POST
export const noteRequestSchema = z.object({
    title: z.string().nullable(),
    body: z.string().nullable(),
    imageLinks: z.array(z.string()),
    categoryIds: z.array(z.string()),
    lng: z.number().min(-180, "invalid longitude").max(180, "invalid longitude"),
    lat: z.number().min(-90, "invalid latitude").max(90, "invalid latitude")
});

// for note api's PUT
export const optionalNoteRequestSchema = z.object({
    title: z.string().nullable().optional(),
    body: z.string().nullable().optional(),
    imageLinks: z.array(z.string()).optional(),
    categoryIds: z.array(z.string()).optional(),
    lng: z.number().min(-180, "invalid longitude").max(180, "invalid longitude").optional(),
    lat: z.number().min(-90, "invalid latitude").max(90, "invalid latitude").optional()
});

// for category api's POST
export const categoryRequestSchema = z.object({
    name: z.string(),
    color: z.string().regex(/^#([0-9a-f]{3}){1,2}$/i, "Invalid hex code").optional()
});

// for category api's PUT
export const optionalCategoryRequestSchema = z.object({
    name: z.string().optional(),
    color: z.string().regex(/^#([0-9a-f]{3}){1,2}$/i, "Invalid hex code").optional()
});

// for user api's POST
export const signupRequestSchema = z.object({
    username: z.string().min(3).max(20).regex(/^[A-Za-z0-9._-]+$/i),
    email: z.email(),
    password: z.string().min(8),
});

// for user api's PUT
export const editUserRequestSchema = z.object({
    username: z.string().min(3).max(20).regex(/^[A-Za-z0-9._-]+$/i).optional(),
    name: z.string().optional(),
    email: z.email().optional(),
    newPassword: z.string().min(8).optional(),
    oldPassword: z.string()
});