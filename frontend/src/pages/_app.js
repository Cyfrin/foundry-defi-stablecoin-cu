import "@/styles/globals.css";
import RootLayout from "../layouts/RootLayout";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
export default function App({ Component, pageProps }) {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: process.env.NEXT_PUBLIC_SUB_GRAPH,
  });
  return (
    <ApolloProvider client={client}>
      <RootLayout>
        <Component {...pageProps} />
        <ToastContainer />
      </RootLayout>
    </ApolloProvider>
  );
}
