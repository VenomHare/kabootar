"use client";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import store from "@/store";
import { Suspense } from "react";
import { Provider } from "react-redux";

interface ProvidersProps {
    children: React.ReactNode
}

const Providers = ({ children }: ProvidersProps) => {
    return (<>
        <Provider store={store}>
            <Suspense>
                <Toaster />
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange={false}
                >
                    {children}
                </ThemeProvider>
            </Suspense>
        </Provider>
    </>)
}
export default Providers