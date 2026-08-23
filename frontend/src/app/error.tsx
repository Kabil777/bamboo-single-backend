"use client";
import { Button } from "@/components/shadcnUI/button";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { BiSolidError } from "react-icons/bi";
export default function ErrorPage({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Error:", error);
    }, [error]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: -1.25 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut",
            },
        },
    };

    const buttonVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: [0.23, 1, 0.32, 1],
            },
        },
        hover: {
            y: -0.25,
            boxShadow: "0 0.25rem 0.75rem rgba(0, 0, 0, 0.1)",
            transition: {
                duration: 0.2,
            },
        },
        tap: {
            scale: 0.98,
        },
    };

    const iconVariants = {
        animate: {
            opacity: [1, 0.6, 1],
            transition: {
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
            },
        },
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-4 bg-background">
            <motion.div
                className="flex flex-col items-center gap-4 max-w-[30rem] text-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={iconVariants} animate="animate">
                    <BiSolidError size={60} className="text-danger" />
                </motion.div>

                <motion.h1
                    variants={itemVariants}
                    className="text-danger-600 font-extrabold text-2xl md:text-4xl"
                >
                    Error Encountered!
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    className="text-foreground/80 text-lg"
                >
                    &quot;Apologies! The issue is being looked into.&quot;
                </motion.p>

                <motion.div variants={buttonVariants} whileTap="tap">
                    <Button
                        color="primary"
                        size="lg"
                        onClick={() => reset()}
                        className="mt-4 px-8 py-6 text-lg font-semibold rounded-full"
                    >
                        Try again
                    </Button>
                </motion.div>
            </motion.div>

            {process.env.NODE_ENV === "development" && (
                <motion.div
                    initial={{ opacity: 0, y: 1.25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    <div className="max-w-[50rem] mt-8 text-sm font-semibold bg-accent border rounded-md p-4">
                        {error.message}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
