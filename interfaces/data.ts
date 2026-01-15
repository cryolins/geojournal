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

export interface UserData{
    _id: string
    email: string
    name: string
    username: string
    createdAt: string
    updatedAt: string
}