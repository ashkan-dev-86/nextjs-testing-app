import { fetchArticles } from "./articles.repository";
import { IArticleGet } from "./article.get-model";

export default async function Article() {
    const data: IArticleGet[] = await fetchArticles();

    return(
        <main className='flex-1 flex flex-col justify-center items-center max-w-[800px] mx-auto px-10 text-center'>
            <h1 className='text-4xl font-medium mb-5 capitalize'>Article</h1>
            
            {data[0].content}
        </main>
    );
}