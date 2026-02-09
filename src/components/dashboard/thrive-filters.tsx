/**
 * SAT Connect - T.H.R.I.V.E. Engine Filters Component
 * Comprehensive filtering for tour inventory
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X, ChevronDown, ChevronUp, Filter } from 'lucide-react';

interface ThriveFiltersProps {
    providers: string[];
    locations: string[];
    onFilterChange?: () => void;
}

export function ThriveFilters({ providers, locations, onFilterChange }: ThriveFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isExpanded, setIsExpanded] = useState(true);

    // Filter states
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [selectedProviders, setSelectedProviders] = useState<string[]>(
        searchParams.get('providers')?.split('|').filter(Boolean) || []
    );
    const [selectedHealth, setSelectedHealth] = useState<string[]>(
        searchParams.get('health')?.split('|').filter(Boolean) || []
    );
    const [selectedLocations, setSelectedLocations] = useState<string[]>(
        searchParams.get('locations')?.split('|').filter(Boolean) || []
    );
    const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'name');
    const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'asc');

    const healthOptions = [
        { value: 'healthy', label: 'Healthy', color: 'text-green-600' },
        { value: 'audit_required', label: 'Audit Required', color: 'text-yellow-600' },
        { value: 'incomplete', label: 'Incomplete', color: 'text-red-600' },
        { value: 'global_ready', label: 'Global Ready', color: 'text-blue-600' },
    ];

    const sortOptions = [
        { value: 'name', label: 'Name' },
        { value: 'provider', label: 'Provider' },
        { value: 'netRate', label: 'Price' },
        { value: 'createdAt', label: 'Date Added' },
    ];

    // Update URL params
    useEffect(() => {
        const params = new URLSearchParams();

        if (searchQuery) params.set('search', searchQuery);
        if (selectedProviders.length > 0) params.set('providers', selectedProviders.join('|'));
        if (selectedHealth.length > 0) params.set('health', selectedHealth.join('|'));
        if (selectedLocations.length > 0) params.set('locations', selectedLocations.join('|'));
        if (sortBy !== 'name') params.set('sortBy', sortBy);
        if (sortOrder !== 'asc') params.set('sortOrder', sortOrder);

        router.push(`/thrive?${params.toString()}`, { scroll: false });
        onFilterChange?.();
    }, [searchQuery, selectedProviders, selectedHealth, selectedLocations, sortBy, sortOrder]);

    function toggleProvider(provider: string) {
        setSelectedProviders(prev =>
            prev.includes(provider)
                ? prev.filter(p => p !== provider)
                : [...prev, provider]
        );
    }

    function toggleHealth(health: string) {
        setSelectedHealth(prev =>
            prev.includes(health)
                ? prev.filter(h => h !== health)
                : [...prev, health]
        );
    }

    function toggleLocation(location: string) {
        setSelectedLocations(prev =>
            prev.includes(location)
                ? prev.filter(l => l !== location)
                : [...prev, location]
        );
    }

    function clearAllFilters() {
        setSearchQuery('');
        setSelectedProviders([]);
        setSelectedHealth([]);
        setSelectedLocations([]);
        setSortBy('name');
        setSortOrder('asc');
        router.push('/thrive', { scroll: false });
        onFilterChange?.();
    }

    const activeFilterCount =
        (searchQuery ? 1 : 0) +
        selectedProviders.length +
        selectedHealth.length +
        selectedLocations.length +
        (sortBy !== 'name' ? 1 : 0);

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">Filters</h3>
                    {activeFilterCount > 0 && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                            {activeFilterCount} active
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {activeFilterCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearAllFilters}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                            <X className="h-4 w-4 mr-1" />
                            Clear All
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        {isExpanded ? (
                            <>
                                <span className="mr-2 text-xs font-medium">Hide</span>
                                <ChevronUp className="h-4 w-4" />
                            </>
                        ) : (
                            <>
                                <span className="mr-2 text-xs font-medium">Show Filters</span>
                                <ChevronDown className="h-4 w-4" />
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Filter Content */}
            {isExpanded && (
                <div className="p-4 space-y-4">
                    {/* Search */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Search Tours
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <Input
                                type="text"
                                placeholder="Search by tour name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 !text-gray-900 placeholder:text-gray-500 border-gray-400 focus:border-blue-600"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {/* Provider Filter */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Provider
                            </label>
                            <div className="space-y-2 max-h-40 overflow-y-auto border-2 border-gray-300 rounded-md p-2 bg-white">
                                {providers.map((provider) => (
                                    <label
                                        key={provider}
                                        className="flex items-center gap-2 hover:bg-gray-100 p-1 rounded cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedProviders.includes(provider)}
                                            onChange={() => toggleProvider(provider)}
                                            className="rounded border-gray-400 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-medium text-gray-900">{provider}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Health Score Filter */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Health Status
                            </label>
                            <div className="space-y-2 border-2 border-gray-300 rounded-md p-2 bg-white">
                                {healthOptions.map((option) => (
                                    <label
                                        key={option.value}
                                        className="flex items-center gap-2 hover:bg-gray-100 p-1 rounded cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedHealth.includes(option.value)}
                                            onChange={() => toggleHealth(option.value)}
                                            className="rounded border-gray-400 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className={`text-sm font-semibold ${option.color}`}>
                                            {option.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Location Filter */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Location
                            </label>
                            <div className="space-y-2 max-h-40 overflow-y-auto border-2 border-gray-400 rounded-md p-2 bg-white">
                                {locations.map((location) => (
                                    <label
                                        key={location}
                                        className="flex items-center gap-2 hover:bg-gray-100 p-1 rounded cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedLocations.includes(location)}
                                            onChange={() => toggleLocation(location)}
                                            className="rounded border-gray-400 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-medium text-gray-900">{location}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Sort Options */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Sort By
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full border-2 border-gray-400 rounded-md px-3 py-2 text-sm font-medium text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-600"
                            >
                                {sortOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <div className="mt-2 flex gap-2">
                                <Button
                                    variant={sortOrder === 'asc' ? 'primary' : 'outline'}
                                    size="sm"
                                    onClick={() => setSortOrder('asc')}
                                    className="flex-1"
                                >
                                    ↑ Asc
                                </Button>
                                <Button
                                    variant={sortOrder === 'desc' ? 'primary' : 'outline'}
                                    size="sm"
                                    onClick={() => setSortOrder('desc')}
                                    className="flex-1"
                                >
                                    ↓ Desc
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Active Filter Chips */}
                    {activeFilterCount > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2 border-t">
                            {searchQuery && (
                                <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                    <span>Search: "{searchQuery}"</span>
                                    <button onClick={() => setSearchQuery('')} className="hover:bg-blue-200 rounded-full p-0.5">
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            )}
                            {selectedProviders.map((provider) => (
                                <div key={provider} className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                                    <span>{provider}</span>
                                    <button onClick={() => toggleProvider(provider)} className="hover:bg-purple-200 rounded-full p-0.5">
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                            {selectedHealth.map((health) => {
                                const option = healthOptions.find(o => o.value === health);
                                return (
                                    <div key={health} className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                        <span>{option?.label}</span>
                                        <button onClick={() => toggleHealth(health)} className="hover:bg-green-200 rounded-full p-0.5">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                );
                            })}
                            {selectedLocations.map((location) => (
                                <div key={location} className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                    <span>{location}</span>
                                    <button onClick={() => toggleLocation(location)} className="hover:bg-yellow-200 rounded-full p-0.5">
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )
            }
        </div >
    );
}
