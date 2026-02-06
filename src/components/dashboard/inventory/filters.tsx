"use client"

import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export interface FilterState {
    search: string
    providers: string[]
    locations: string[]
    activityTypes: string[]
    tourTypes: string[]
    priorityOnly: boolean
}

interface InventoryFiltersProps {
    filters: FilterState
    onFilterChange: (filters: FilterState) => void
    uniqueProviders: string[]
    uniqueLocations: string[]
    uniqueActivityTypes: string[]
    uniqueTourTypes: string[]
}

export function InventoryFilters({
    filters,
    onFilterChange,
    uniqueProviders,
    uniqueLocations,
    uniqueActivityTypes,
    uniqueTourTypes
}: InventoryFiltersProps) {
    const handleSearchChange = (value: string) => {
        onFilterChange({ ...filters, search: value })
    }

    const toggleFilter = (category: 'providers' | 'locations' | 'activityTypes' | 'tourTypes', value: string) => {
        const current = filters[category]
        const updated = current.includes(value)
            ? current.filter(item => item !== value)
            : [...current, value]
        onFilterChange({ ...filters, [category]: updated })
    }

    const togglePriority = () => {
        onFilterChange({ ...filters, priorityOnly: !filters.priorityOnly })
    }

    const clearAllFilters = () => {
        onFilterChange({
            search: '',
            providers: [],
            locations: [],
            activityTypes: [],
            tourTypes: [],
            priorityOnly: false
        })
    }

    const activeFilterCount =
        filters.providers.length +
        filters.locations.length +
        filters.activityTypes.length +
        filters.tourTypes.length +
        (filters.priorityOnly ? 1 : 0)

    return (
        <div className="space-y-4">
            {/* Search and Priority Toggle */}
            <div className="flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Buscar por nombre de tour..."
                        value={filters.search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-10 bg-gray-900 border-gray-800 text-gray-300"
                    />
                </div>
                <Button
                    variant={filters.priorityOnly ? "primary" : "outline"}
                    onClick={togglePriority}
                    className={filters.priorityOnly ? "bg-red-600 hover:bg-red-500" : ""}
                >
                    ⚠️ Prioritarios
                </Button>
                {activeFilterCount > 0 && (
                    <Button
                        variant="ghost"
                        onClick={clearAllFilters}
                        className="text-gray-400 hover:text-white"
                    >
                        <X className="h-4 w-4 mr-2" />
                        Limpiar ({activeFilterCount})
                    </Button>
                )}
            </div>

            {/* Filter Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Provider Filter */}
                <div>
                    <label className="text-xs text-gray-500 mb-1.5 block">Proveedor</label>
                    <Select onValueChange={(value: string) => toggleFilter('providers', value)}>
                        <SelectTrigger className="bg-gray-900 border-gray-800">
                            <SelectValue placeholder="Seleccionar..." />
                        </SelectTrigger>
                        <SelectContent>
                            {uniqueProviders.map(provider => (
                                <SelectItem key={provider} value={provider}>
                                    {provider}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                        {filters.providers.map(provider => (
                            <Badge
                                key={provider}
                                variant="outline"
                                className="bg-teal-900/30 text-teal-300 cursor-pointer hover:bg-red-900/30 hover:text-red-300"
                                onClick={() => toggleFilter('providers', provider)}
                            >
                                {provider}
                                <X className="h-3 w-3 ml-1" />
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Location Filter */}
                <div>
                    <label className="text-xs text-gray-500 mb-1.5 block">Ubicación</label>
                    <Select onValueChange={(value: string) => toggleFilter('locations', value)}>
                        <SelectTrigger className="bg-gray-900 border-gray-800">
                            <SelectValue placeholder="Seleccionar..." />
                        </SelectTrigger>
                        <SelectContent>
                            {uniqueLocations.map(location => (
                                <SelectItem key={location} value={location}>
                                    {location}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                        {filters.locations.map(location => (
                            <Badge
                                key={location}
                                variant="outline"
                                className="bg-blue-900/30 text-blue-300 cursor-pointer hover:bg-red-900/30 hover:text-red-300"
                                onClick={() => toggleFilter('locations', location)}
                            >
                                {location}
                                <X className="h-3 w-3 ml-1" />
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Activity Type Filter */}
                <div>
                    <label className="text-xs text-gray-500 mb-1.5 block">Tipo de Actividad</label>
                    <Select onValueChange={(value: string) => toggleFilter('activityTypes', value)}>
                        <SelectTrigger className="bg-gray-900 border-gray-800">
                            <SelectValue placeholder="Seleccionar..." />
                        </SelectTrigger>
                        <SelectContent>
                            {uniqueActivityTypes.map(type => (
                                <SelectItem key={type} value={type}>
                                    {type}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                        {filters.activityTypes.map(type => (
                            <Badge
                                key={type}
                                variant="outline"
                                className="bg-purple-900/30 text-purple-300 cursor-pointer hover:bg-red-900/30 hover:text-red-300"
                                onClick={() => toggleFilter('activityTypes', type)}
                            >
                                {type}
                                <X className="h-3 w-3 ml-1" />
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Tour Type Filter */}
                <div>
                    <label className="text-xs text-gray-500 mb-1.5 block">Tipo de Tour</label>
                    <Select onValueChange={(value: string) => toggleFilter('tourTypes', value)}>
                        <SelectTrigger className="bg-gray-900 border-gray-800">
                            <SelectValue placeholder="Seleccionar..." />
                        </SelectTrigger>
                        <SelectContent>
                            {uniqueTourTypes.map(type => (
                                <SelectItem key={type} value={type}>
                                    {type}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                        {filters.tourTypes.map(type => (
                            <Badge
                                key={type}
                                variant="outline"
                                className="bg-green-900/30 text-green-300 cursor-pointer hover:bg-red-900/30 hover:text-red-300"
                                onClick={() => toggleFilter('tourTypes', type)}
                            >
                                {type}
                                <X className="h-3 w-3 ml-1" />
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
