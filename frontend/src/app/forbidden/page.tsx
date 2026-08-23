"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CircleX } from "lucide-react";

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
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
};

const iconVariants = {
    animate: {
        opacity: [1, 0.6, 1],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
};

export default function ForbiddenPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-4 bg-background">
            <motion.div
                className="flex flex-col items-center gap-4 max-w-[32rem] text-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={iconVariants} animate="animate">
                    <CircleX size={100} className="text-danger" />
                </motion.div>

                <motion.h1
                    variants={itemVariants}
                    className="text-danger-600 font-extrabold text-2xl md:text-4xl"
                >
                    404 Page | NOT FOUND
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    className="text-foreground/80 text-lg"
                >
                    Forbidden: you do not have access to this document.
                </motion.p>

                <motion.div variants={itemVariants}>
                    <Link
                        href="/"
                        className="text-primary hover:underline font-semibold text-lg"
                    >
                        Return Home
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}
