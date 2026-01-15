export interface NoteData{
    _id: string
    title: string
    body: string
    imageLinks: string[]
    categoryIds: string[]
    location: { coordinates: [number, number] }
    createdAt: string
    updatedAt: string
}

export interface CategoryData{
    _id: string
    name: string
    color: string
}

export interface ErrorResponse{
    message: string
}