"use client";

import { Provider } from "react-redux";
import store from "@/store/store";
import { ThemeProvider } from "@/components/theme-provider";
import NextTopLoader from "nextjs-toploader";
import setupInterceptors from "@/api/interceptors";
import api from "@/api/axios";
import { Toaster } from "@/components/shadcnUI/sonner";
import { AuthBootstrap } from "./AuthenticationBootstrap";

setupInterceptors(api);
export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <ThemeProvider attribute="class" defaultTheme="light">
                <AuthBootstrap />
                <NextTopLoader
                    color="linear-gradient(0.25turn, var(--background), var(--foreground))"
                    height={2}
                    showSpinner={true}
                />
                <Toaster  />
                {children}
            </ThemeProvider>
        </Provider>
    );
}
