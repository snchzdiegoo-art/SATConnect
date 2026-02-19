import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignOutButton } from "@clerk/nextjs";
import { LockKeyhole, Mail } from "lucide-react";

export default function PendingApprovalPage() {
    return (
        <div className="min-h-screen bg-[#07101E] flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-white/5 border-white/10 backdrop-blur-xl text-center">
                <CardHeader>
                    <div className="mx-auto bg-amber-500/10 p-3 rounded-full mb-4 w-fit">
                        <LockKeyhole className="h-8 w-8 text-amber-500" />
                    </div>
                    <CardTitle className="text-2xl text-white">Cuenta Pendiente de Aprobación</CardTitle>
                    <CardDescription className="text-gray-400">
                        Tu cuenta ha sido creada exitosamente, pero requiere autorización de un administrador para acceder al sistema.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="bg-gray-900/50 p-4 rounded-lg text-sm text-gray-300">
                        <p>Hemos notificado al equipo de administración.</p>
                        <p className="mt-2 text-xs text-gray-500">
                            Si crees que esto es un error, contacta a soporte.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button variant="outline" className="w-full border-gray-700 hover:bg-gray-800 text-gray-300">
                            <Mail className="mr-2 h-4 w-4" /> Contactar Soporte
                        </Button>

                        <SignOutButton>
                            <Button variant="ghost" className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
                                Cerrar Sesión
                            </Button>
                        </SignOutButton>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
