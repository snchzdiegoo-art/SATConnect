import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, Users, CalendarCheck, TrendingUp } from "lucide-react"

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Resumen</h1>
                    <p className="text-gray-400 mt-1">Bienvenido de vuelta, Diego. Aquí está lo que está pasando hoy.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" className="border-gray-700 bg-gray-800 text-gray-300">
                        Exportar Reporte
                    </Button>
                    <Button variant="primary" className="bg-teal-600 hover:bg-teal-500">
                        + Nueva Reserva
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatsCard
                    title="Ventas Totales"
                    value="$124,500"
                    metric="+12% vs mes anterior"
                    icon={DollarSign}
                    color="text-green-400"
                    bg="bg-green-500/10"
                />
                <StatsCard
                    title="Reservas Activas"
                    value="342"
                    metric="+5 nuevos hoy"
                    icon={CalendarCheck}
                    color="text-blue-400"
                    bg="bg-blue-500/10"
                />
                <StatsCard
                    title="Tasa de Ocupación"
                    value="87%"
                    metric="Top performer: Chichen Itza"
                    icon={TrendingUp}
                    color="text-orange-400"
                    bg="bg-orange-500/10"
                />
                <StatsCard
                    title="Clientes Nuevos"
                    value="18"
                    metric="Esta semana"
                    icon={Users}
                    color="text-purple-400"
                    bg="bg-purple-500/10"
                />
            </div>

            {/* Quick Actions / Recent Activity Placeholder */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-gray-900 border-gray-800 p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Actividad Reciente</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-lg transition-colors cursor-pointer">
                                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400 border border-gray-700">JS</div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-200">Juan Soto reservó <span className="text-teal-400">Chichen Itza Deluxe</span></p>
                                    <p className="text-xs text-gray-500">Hace 5 minutos • $1,200 MXN</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="bg-gray-900 border-gray-800 p-6 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <TrendingUp className="h-8 w-8 text-gray-600" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Conecta más canales</h3>
                    <p className="text-gray-400 text-sm mb-6 max-w-xs">
                        Aumenta tus ventas conectando Viator, Expedia y GetYourGuide.
                    </p>
                    <Button variant="outline" className="border-teal-500/30 text-teal-400 hover:bg-teal-500/10">
                        Ver Integraciones
                    </Button>
                </Card>
            </div>

        </div>
    )
}

function StatsCard({ title, value, metric, icon: Icon, color, bg }: any) {
    return (
        <Card className="bg-gray-900 border-gray-800 p-6 hover:border-gray-700 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-sm text-gray-400 font-medium mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-white">{value}</h3>
                </div>
                <div className={`p-2 rounded-lg ${bg}`}>
                    <Icon className={`h-5 w-5 ${color}`} />
                </div>
            </div>
            <p className="text-xs text-gray-500 font-medium bg-gray-800 w-fit px-2 py-1 rounded">
                {metric}
            </p>
        </Card>
    )
}
