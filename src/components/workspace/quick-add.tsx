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
            className="group flex items-center gap-3 py-3 px-4 border-t border-white/5 mt-2"
        >
            <div className="w-5 h-5 flex items-center justify-center text-teal-500">
                <Plus className="w-5 h-5 transition-transform group-focus-within:rotate-90" />
            </div>
            <input
                name="title"
                type="text"
                placeholder="New Task..."
                autoComplete="off"
                className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-gray-600 focus:ring-0"
            />
            <input type="hidden" name="status" value="inbox" />
        </form>
    );
}
