"use client";

// import Link from "next/link";
import { ToastProvider } from "./components/toast/toast.context";
// import ErrorBoundary from "./components/error-boundary/error-boundary";
import { useToast } from "./components/toast/toast.hook";

export default function Home() {
  // return (
  //   <main className="flex-1 flex flex-col justify-center items-center">
  //     <h1 className="pt-24 txt-4xl font-medium mb-5 capitalize">Home Page</h1>

  //     <Link href="/article" className="underline">
  //       Article
  //     </Link>

  //     <Link href="/prisma-db/posts" className="underline">
  //       Posts
  //     </Link>
  //   </main>
  // );

  const { showToast } = useToast();

  const triggerToast = () => {
    showToast("This is an error message to show toast component", "error");
  };

  return (
    <ToastProvider>
      {/* <ErrorBoundary showToast={showToast}> */}

      <main className="flex-1 flex flex-col justify-center items-center">
        <button
          style={{background: 'white', color: 'black', padding: '10px', border: '1px solid black', borderRadius: '5px', margin: '10px'}}
          onClick={triggerToast}
        >Press</button>

        {/* <h1 className="pt-24 txt-4xl font-medium mb-5 capitalize">
            Home Page
          </h1>

          <Link href="/article" className="underline">
            Article
          </Link>

          <Link href="/prisma-db/posts" className="underline">
            Posts
          </Link> */}
      </main>
      {/* </ErrorBoundary> */}
    </ToastProvider>
  );

  // return (
  //   <ErrorBoundary>
  //     <ToastProvider>
  //       {/* <ToastContainer /> */}

  //       <main className="flex-1 flex flex-col justify-center items-center">
  //         <h1 className="pt-24 txt-4xl font-medium mb-5 capitalize">
  //           Home Page
  //         </h1>

  //         <Link href="/article" className="underline">
  //           Article
  //         </Link>

  //         <Link href="/prisma-db/posts" className="underline">
  //           Posts
  //         </Link>
  //       </main>
  //     </ToastProvider>
  //   </ErrorBoundary>
  // );
}

// function withPageErrorBoundary(PageComponent: React.ComponentType) {
//   return function PageWithErrorBoundary(props: JSX.Element) {
//     const { showToast } = useToast();

//     return (
//       <ToastProvider>
//         <ErrorBoundary showToast={showToast}>
//           <PageComponent {...props} />
//         </ErrorBoundary>
//       </ToastProvider>
//     );
//   };
// }

// export default withPageErrorBoundary(Home);
