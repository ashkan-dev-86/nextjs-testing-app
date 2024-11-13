import { IPost } from "@/app/prisma-db/posts/models/post";
import { IPostInsert } from "@/app/prisma-db/posts/models/post-insert";
import { IPostInsertProps } from "@/app/prisma-db/posts/models/post-insert-props";
import { PostSandbox } from "@/app/prisma-db/posts/posts.sandbox";
// import errorMiddleware from "../error-boundary/error-middleware";

export const PostInsert = (props: IPostInsertProps) => {
  const insert = async (data: FormData): Promise<void> => {
    const post: IPostInsert = {
      title: data.get("title") as string,
      content: data.get("content") as string,
    };

    throw new Error("This is a test error!");

    // errorMiddleware({ name: "Error", message: "An error occurred" });

    return;

    const insertedPost: IPost = await PostSandbox.create(post);
    if (!!insertedPost) {
      const title = document.getElementById("title") as HTMLInputElement;
      title.value = "";

      const content = document.getElementById("content") as HTMLInputElement;
      content.value = "";

      props.postInserted(insertedPost);
    }
  };

  return (
    <form action={insert} className="flex flex-col gap-y-2 w-[300px]">
      <input
        id="title"
        type="text"
        className="py-2 py-1 rounded-sm text-black"
        name="title"
        placeholder="Title"
      />

      <textarea
        id="content"
        name="content"
        rows={5}
        placeholder="Content"
        className="py-2 py-1 rounded-sm text-black"
      ></textarea>

      <button type="submit" className="bg-blue-500 py-2 text-white rounded-sm">
        Create a post
      </button>
    </form>
  );
};
