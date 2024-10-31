import { IPost } from "./post";

export interface IPostInsertProps {
    postInserted: (post: IPost) => void;
}