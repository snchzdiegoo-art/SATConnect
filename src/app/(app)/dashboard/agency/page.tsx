import AgencyClient from "./agency-client"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Agency Portal | SAT Connect",
    description: "Centra de operaciones para agentes de viaje autorizados.",
}

export default function AgencyPage() {
    return <AgencyClient />
}
