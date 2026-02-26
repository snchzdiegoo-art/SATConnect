"use client";

import { useRef, useTransition } from "react";
import { Plus } from "lucide-react";
import { createTask } from "@/app/dashboard/workspace/actions";

export function QuickAdd() {
    const formRef = useRef<HTMLFormElement>(null);
    const [isPending, startTransition] = useTransition();

    return (
        <form
            ref={formRef}
            action={async (formData) => {
                formRef.current?.reset();
                await createTask(formData);
            }}
            className="group flex items-center gap-4 py-4 px-5 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/20 focus-within:bg-white dark:focus-within:bg-black/40 transition-colors duration-300 rounded-b-2xl"
        >
            <div className="w-5 h-5 flex items-center justify-center text-teal-600 dark:text-teal-500">
                <Plus className="w-5 h-5 transition-transform group-focus-within:rotate-90 group-focus-within:text-teal-500" />
            </div>
            <input
                name="title"
                type="text"
                placeholder="Add a new task..."
                autoComplete="off"
                className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:ring-0"
            />
            <input type="hidden" name="status" value="inbox" />
        </form>
    );
}
