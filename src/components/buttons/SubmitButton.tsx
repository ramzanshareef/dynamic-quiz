"use client";
import React from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
    "inline-flex justify-center items-center rounded text-sm font-medium leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-disabled disabled:opacity-50",
    {
        variants: {
            variant: {
                default: ["bg-indigo-600", "hover:bg-indigo-500", "focus-visible:outline-indigo-600"],
                danger: ["bg-red-600", "hover:bg-red-500", "focus-visible:outline-red-600"],
                priviliged: ["bg-yellow-600", "hover:bg-yellow-500", "focus-visible:outline-yellow-600"],
            },
            size: {
                default: "px-3 py-1.5",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    children: React.ReactNode;
}

const Button = ({ className, children, size, variant, ...props }: ButtonProps) => {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            className={cn(buttonVariants({ size, variant }), className)}
            disabled={pending}
            {...props}
        >
            {!pending && children}
            {pending &&
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white">
                </div>
            }
        </button>
    );
};

export { Button };