import { SignUp } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-950">
            <SignUp
                appearance={{
                    elements: {
                        formButtonPrimary: 'bg-teal-500 hover:bg-teal-600 text-slate-950',
                        footerActionLink: 'text-teal-400 hover:text-teal-300',
                        card: 'bg-slate-900 border border-slate-800'
                    }
                }}
            />
        </div>
    );
}
