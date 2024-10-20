// import prisma from "@/lib/db";

export default async function  Article() {
    // const data = await prisma.article.findFirst();

    return(
        <main className='flex-1 flex flex-col justify-center items-center max-w-[800px] mx-auto px-10 text-center'>
            <h1 className='text-4xl font-medium mb-5 capitalize'>Article</h1>

            {/* {data.text} */}
        </main>
    );
}