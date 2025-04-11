import "@/styles/globals.css";
import {ChakraProvider, defaultSystem} from "@chakra-ui/react"
import { GeistSans } from "geist/font/sans";

export default function App({Component, pageProps}) {
  return (
    <main className={GeistSans.className}>
      <ChakraProvider value={defaultSystem}>
        <Component {...pageProps} />
      </ChakraProvider>
    </main>
  )
}
