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
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
        <div className="glass-panel p-1 rounded-2xl mb-6">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-teal-600 dark:text-brand-primary" />
                    <h3 className="font-semibold text-gray-900 dark:text-white font-display tracking-wide">Filters</h3>
                    {activeFilterCount > 0 && (
                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-200 border border-blue-500/30 text-xs rounded-full font-medium">
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
                            className="bg-red-900/40 text-red-100 border border-red-700 hover:bg-red-900/60 hover:text-white transition-colors"
                        >
                            <X className="h-4 w-4 mr-1" />
                            Clear All
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="bg-white/50 dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white"
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
                        <label className="block text-sm font-semibold text-teal-600 dark:text-brand-primary font-display tracking-wide mb-2">
                            Search Tours
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                            <Input
                                type="text"
                                placeholder="Search by tour name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 !text-gray-900 dark:!text-white placeholder:text-gray-500 border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 focus:border-teal-500/50 dark:focus:border-[#29FFC6]/50 focus:ring-teal-500/20 dark:focus:ring-[#29FFC6]/20 transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                        {/* Provider Filter */}
                        <FilterDropdown
                            label="Provider"
                            options={providers.map(p => ({ label: p, value: p }))}
                            selectedValues={selectedProviders}
                            onToggle={toggleProvider}
                        />

                        {/* Health Score Filter */}
                        <FilterDropdown
                            label="Health Status"
                            options={healthOptions}
                            selectedValues={selectedHealth}
                            onToggle={toggleHealth}
                        />

                        {/* Location Filter */}
                        <FilterDropdown
                            label="Location"
                            options={locations.map(l => ({ label: l, value: l }))}
                            selectedValues={selectedLocations}
                            onToggle={toggleLocation}
                        />

                        {/* Sort Options */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-teal-600 dark:text-brand-primary font-display tracking-wide">
                                Sort By
                            </label>
                            <div className="flex gap-2">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="flex-1 border border-gray-200 dark:border-white/10 rounded-md px-3 py-2 text-sm font-medium text-gray-900 dark:text-white bg-white/50 dark:bg-brand-teal/50 focus:ring-2 focus:ring-teal-500 dark:focus:ring-[#29FFC6] focus:border-transparent outline-none"
                                >
                                    {sortOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <div className="flex border-2 border-gray-200 dark:border-gray-700 rounded-md overflow-hidden shrink-0">
                                    <button
                                        onClick={() => setSortOrder('asc')}
                                        className={`px-3 py-1.5 flex items-center justify-center transition-colors ${sortOrder === 'asc'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                            }`}
                                        title="Ascending"
                                    >
                                        <ChevronUp className="h-4 w-4" />
                                    </button>
                                    <div className="w-[1px] bg-gray-200 dark:bg-gray-700"></div>
                                    <button
                                        onClick={() => setSortOrder('desc')}
                                        className={`px-3 py-1.5 flex items-center justify-center transition-colors ${sortOrder === 'desc'
                                            ? 'bg-teal-500 dark:bg-brand-primary text-white dark:text-[#050F1A]'
                                            : 'bg-white/50 dark:bg-white/5 text-gray-400 hover:bg-white/80 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'
                                            }`}
                                        title="Descending"
                                    >
                                        <ChevronDown className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Active Filter Chips */}
                    {activeFilterCount > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2 border-t">
                            {searchQuery && (
                                <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-200 border border-blue-500/30 rounded-full text-xs font-medium">
                                    <span>Search: "{searchQuery}"</span>
                                    <button onClick={() => setSearchQuery('')} className="hover:bg-blue-500/30 rounded-full p-0.5">
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            )}
                            {selectedProviders.map((provider) => (
                                <div key={provider} className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-200 border border-purple-500/30 rounded-full text-xs font-medium">
                                    <span>{provider}</span>
                                    <button onClick={() => toggleProvider(provider)} className="hover:bg-purple-500/30 rounded-full p-0.5">
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                            {selectedHealth.map((health) => {
                                const option = healthOptions.find(o => o.value === health);
                                return (
                                    <div key={health} className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-200 border border-green-500/30 rounded-full text-xs font-medium">
                                        <span>{option?.label}</span>
                                        <button onClick={() => toggleHealth(health)} className="hover:bg-green-500/30 rounded-full p-0.5">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                );
                            })}
                            {selectedLocations.map((location) => (
                                <div key={location} className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-200 border border-yellow-500/30 rounded-full text-xs font-medium">
                                    <span>{location}</span>
                                    <button onClick={() => toggleLocation(location)} className="hover:bg-yellow-500/30 rounded-full p-0.5">
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

interface FilterDropdownProps {
    label: string;
    options: { value: string; label: string; color?: string }[];
    selectedValues: string[];
    onToggle: (value: string) => void;
}

function FilterDropdown({ label, options, selectedValues, onToggle }: FilterDropdownProps) {
    const selectedCount = selectedValues.length;

    return (
        <div className="space-y-2">
            <label className="block text-sm font-semibold text-teal-600 dark:text-brand-primary font-display tracking-wide">
                {label}
            </label>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        suppressHydrationWarning={true}
                        className="w-full justify-between border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-brand-teal/50 font-normal hover:bg-white/80 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white text-gray-700 dark:text-gray-300"
                    >
                        <span className="truncate">
                            {selectedCount === 0 ? 'All' : `${selectedCount} selected`}
                        </span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 max-h-80 overflow-y-auto bg-white/95 dark:bg-brand-dark/95 text-gray-900 dark:text-gray-200 border-gray-200 dark:border-white/10 backdrop-blur-xl" align="start">
                    {options.map((option) => (
                        <DropdownMenuCheckboxItem
                            key={option.value}
                            checked={selectedValues.includes(option.value)}
                            onCheckedChange={() => onToggle(option.value)}
                            className="cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 focus:bg-gray-100 dark:focus:bg-white/10 data-[state=checked]:text-teal-600 dark:data-[state=checked]:text-brand-primary"
                        >
                            <span className={option.color || 'text-gray-700 dark:text-gray-200'}>{option.label}</span>
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
