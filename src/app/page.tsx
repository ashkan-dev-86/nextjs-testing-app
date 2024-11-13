import Link from "next/link";
import { ToastProvider } from "./components/toast/toast.context";
// import ToastContainer from "./components/toast/toast";
import ErrorBoundary from "./components/error-boundary/error-boundary";
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

  return (
    <ToastProvider>
      <ErrorBoundary showToast={showToast}>
        <main className="flex-1 flex flex-col justify-center items-center">
          <h1 className="pt-24 txt-4xl font-medium mb-5 capitalize">
            Home Page
          </h1>

          <Link href="/article" className="underline">
            Article
          </Link>

          <Link href="/prisma-db/posts" className="underline">
            Posts
          </Link>
        </main>
      </ErrorBoundary>
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
