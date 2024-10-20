export interface IPost {
    id: string;
    title: string;
    content: string;
    published: boolean | null;
    updatedAt: Date;
    createdAt: Date;
}