/**
 * SAT Connect - Load Center Form Component
 * Multi-section form for creating new tours in T.H.R.I.V.E. system
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { HealthBadge } from '@/components/ui/health-badge';
import type { HealthStatus } from '@/components/ui/health-badge';

interface LoadCenterFormProps {
    onSuccess?: () => void;
}

export function LoadCenterForm({ onSuccess }: LoadCenterFormProps) {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{
        success: boolean;
        health?: { status: HealthStatus; issues: string[] };
        message?: string;
        error?: string;
    } | null>(null);

    const [formData, setFormData] = useState({
        // Basic Info
        product_name: '',
        supplier: '',
        location: '',
        bokun_id: '',

        // Shared Rates
        net_rate_adult: '',
        shared_factor: '1.5',
        net_rate_child: '',
        shared_min_pax: '',
        infant_age_threshold: '',

        // Private Rates
        net_rate_private: '',
        private_factor: '1.5',
        private_min_pax: '',
        private_min_pax_net_rate: '',

        // Operations
        duration: '',
        days_of_operation: '',
        cxl_policy: '',
        meeting_point_info: '',
        pickup_info: '',
        extra_fees: '',

        // Content
        pictures_url: '',
        landing_page_url: '',
        storytelling_url: '',
        notes: '',
    });

    function handleChange(field: string, value: string) {
        setFormData({ ...formData, [field]: value });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        try {
            const payload = {
                product_name: formData.product_name,
                supplier: formData.supplier,
                location: formData.location,
                bokun_id: formData.bokun_id ? parseInt(formData.bokun_id) : undefined,
                is_active: true,
                is_audited: false, // New tours require audit

                pricing: {
                    net_rate_adult: parseFloat(formData.net_rate_adult),
                    shared_factor: parseFloat(formData.shared_factor),
                    net_rate_child: formData.net_rate_child ? parseFloat(formData.net_rate_child) : undefined,
                    infant_age_threshold: formData.infant_age_threshold ? parseInt(formData.infant_age_threshold) : undefined,
                    shared_min_pax: formData.shared_min_pax ? parseInt(formData.shared_min_pax) : undefined,
                    net_rate_private: formData.net_rate_private ? parseFloat(formData.net_rate_private) : undefined,
                    private_factor: parseFloat(formData.private_factor),
                    private_min_pax: formData.private_min_pax ? parseInt(formData.private_min_pax) : undefined,
                    private_min_pax_net_rate: formData.private_min_pax_net_rate ? parseFloat(formData.private_min_pax_net_rate) : undefined,
                    extra_fees: formData.extra_fees || undefined,
                },

                logistics: {
                    duration: formData.duration || undefined,
                    days_of_operation: formData.days_of_operation || undefined,
                    cxl_policy: formData.cxl_policy || undefined,
                    meeting_point_info: formData.meeting_point_info || undefined,
                    pickup_info: formData.pickup_info || undefined,
                },

                assets: {
                    pictures_url: formData.pictures_url || undefined,
                    landing_page_url: formData.landing_page_url || undefined,
                    storytelling_url: formData.storytelling_url || undefined,
                    notes: formData.notes || undefined,
                },

                distribution: {},
            };

            const response = await fetch('/api/tours', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (data.success) {
                setResult({
                    success: true,
                    health: data.health,
                    message: data.message,
                });

                // Reset form
                setFormData({
                    product_name: '',
                    supplier: '',
                    location: '',
                    bokun_id: '',
                    net_rate_adult: '',
                    shared_factor: '1.5',
                    net_rate_child: '',
                    shared_min_pax: '',
                    infant_age_threshold: '',
                    net_rate_private: '',
                    private_factor: '1.5',
                    private_min_pax: '',
                    private_min_pax_net_rate: '',
                    duration: '',
                    days_of_operation: '',
                    cxl_policy: '',
                    meeting_point_info: '',
                    pickup_info: '',
                    extra_fees: '',
                    pictures_url: '',
                    landing_page_url: '',
                    storytelling_url: '',
                    notes: '',
                });

                onSuccess?.();
            } else {
                setResult({
                    success: false,
                    error: data.error || 'Failed to create tour',
                });
            }
        } catch (error) {
            setResult({
                success: false,
                error: 'Network error - please try again',
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Result Message */}
            {result && (
                <div className={`p-4 rounded-lg border ${result.success
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                    }`}>
                    {result.success ? (
                        <div className="space-y-2">
                            <p className="font-medium text-green-800">✓ {result.message}</p>
                            {result.health && (
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-green-700">Product Health:</span>
                                        <HealthBadge status={result.health.status} />
                                    </div>
                                    {result.health.issues.length > 0 && (
                                        <ul className="text-sm text-green-700 list-disc list-inside">
                                            {result.health.issues.map((issue, i) => (
                                                <li key={i}>{issue}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-red-800">✗ {result.error}</p>
                    )}
                </div>
            )}

            {/* Section 1: Basic Information */}
            <section className="border border-gray-800 rounded-lg p-6 bg-gray-900/50">
                <h3 className="text-lg font-semibold mb-4 text-white">📝 Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="product_name" className="text-gray-300">Product Name *</Label>
                        <Input
                            id="product_name"
                            value={formData.product_name}
                            onChange={(e) => handleChange('product_name', e.target.value)}
                            required
                            placeholder="e.g., Chichen Itza All-Inclusive"
                            className="bg-gray-950 border-gray-700 text-white placeholder:text-gray-500"
                        />
                    </div>
                    <div>
                        <Label htmlFor="supplier" className="text-gray-300">Supplier *</Label>
                        <Input
                            id="supplier"
                            value={formData.supplier}
                            onChange={(e) => handleChange('supplier', e.target.value)}
                            required
                            placeholder="e.g., Cancun Explorer Tours"
                            className="bg-gray-950 border-gray-700 text-white placeholder:text-gray-500"
                        />
                    </div>
                    <div>
                        <Label htmlFor="location" className="text-gray-300">Location *</Label>
                        <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => handleChange('location', e.target.value)}
                            required
                            placeholder="e.g., Cancun, Quintana Roo"
                            className="bg-gray-950 border-gray-700 text-white placeholder:text-gray-500"
                        />
                    </div>
                    <div>
                        <Label htmlFor="bokun_id" className="text-gray-300">Bókun ID (optional)</Label>
                        <Input
                            id="bokun_id"
                            type="number"
                            value={formData.bokun_id}
                            onChange={(e) => handleChange('bokun_id', e.target.value)}
                            placeholder="e.g., 1001"
                            className="bg-gray-950 border-gray-700 text-white placeholder:text-gray-500"
                        />
                    </div>
                </div>
            </section>

            {/* Section 2: Shared Rates */}
            <section className="border border-green-900/30 rounded-lg p-6 bg-green-950/10">
                <h3 className="text-lg font-semibold mb-4 text-green-400">👥 Shared Rates</h3>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <Label htmlFor="net_rate_adult" className="text-gray-300">Net Rate Adult * (USD)</Label>
                        <Input
                            id="net_rate_adult"
                            type="number"
                            step="0.01"
                            value={formData.net_rate_adult}
                            onChange={(e) => handleChange('net_rate_adult', e.target.value)}
                            required
                            placeholder="65.00"
                            className="bg-gray-950 border-gray-700 text-white placeholder:text-gray-500"
                        />
                    </div>
                    <div>
                        <Label htmlFor="shared_factor" className="text-gray-300">Shared Factor * (1.0-2.0)</Label>
                        <Input
                            id="shared_factor"
                            type="number"
                            step="0.01"
                            value={formData.shared_factor}
                            onChange={(e) => handleChange('shared_factor', e.target.value)}
                            required
                            placeholder="1.5"
                            className="bg-gray-950 border-gray-700 text-white placeholder:text-gray-500"
                        />
                    </div>
                    <div>
                        <Label htmlFor="shared_min_pax" className="text-gray-300">Min Pax (Shared)</Label>
                        <Input
                            id="shared_min_pax"
                            type="number"
                            value={formData.shared_min_pax}
                            onChange={(e) => handleChange('shared_min_pax', e.target.value)}
                            placeholder="2"
                            className="bg-gray-950 border-gray-700 text-white placeholder:text-gray-500"
                        />
                    </div>
                    <div>
                        <Label htmlFor="net_rate_child" className="text-gray-300">Net Rate Child (USD)</Label>
                        <Input
                            id="net_rate_child"
                            type="number"
                            step="0.01"
                            value={formData.net_rate_child}
                            onChange={(e) => handleChange('net_rate_child', e.target.value)}
                            placeholder="45.00"
                            className="bg-gray-950 border-gray-700 text-white placeholder:text-gray-500"
                        />
                    </div>
                    <div>
                        <Label htmlFor="infant_age_threshold" className="text-gray-300">Free Infant Age (years)</Label>
                        <Input
                            id="infant_age_threshold"
                            type="number"
                            value={formData.infant_age_threshold}
                            onChange={(e) => handleChange('infant_age_threshold', e.target.value)}
                            placeholder="5"
                            className="bg-gray-950 border-gray-700 text-white placeholder:text-gray-500"
                        />
                    </div>
                </div>
            </section>

            {/* Section 3: Private Rates */}
            <section className="border border-blue-900/30 rounded-lg p-6 bg-blue-950/10">
                <h3 className="text-lg font-semibold mb-4 text-blue-400">🚗 Private Rates</h3>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <Label htmlFor="private_min_pax_net_rate" className="text-gray-300">Private Net Rate (USD)</Label>
                        <Input
                            id="private_min_pax_net_rate"
                            type="number"
                            step="0.01"
                            value={formData.private_min_pax_net_rate}
                            onChange={(e) => handleChange('private_min_pax_net_rate', e.target.value)}
                            placeholder="400.00"
                            className="bg-gray-950 border-gray-700 text-white placeholder:text-gray-500"
                        />
                    </div>
                    <div>
                        <Label htmlFor="private_factor" className="text-gray-300">Private Factor (1.0-2.0)</Label>
                        <Input
                            id="private_factor"
                            type="number"
                            step="0.01"
                            value={formData.private_factor}
                            onChange={(e) => handleChange('private_factor', e.target.value)}
                            placeholder="1.5"
                            className="bg-gray-950 border-gray-700 text-white placeholder:text-gray-500"
                        />
                    </div>
                    <div>
                        <Label htmlFor="private_min_pax" className="text-gray-300">Min Pax (Private)</Label>
                        <Input
                            id="private_min_pax"
                            type="number"
                            value={formData.private_min_pax}
                            onChange={(e) => handleChange('private_min_pax', e.target.value)}
                            placeholder="6"
                            className="bg-gray-950 border-gray-700 text-white placeholder:text-gray-500"
                        />
                    </div>
                </div>
            </section>

            {/* Section 4: Operations */}
            <section className="border border-yellow-900/30 rounded-lg p-6 bg-yellow-950/10">
                <h3 className="text-lg font-semibold mb-4 text-yellow-400">⚙️ Operations</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="duration" className="text-gray-300">Duration</Label>
                        <Input
                            id="duration"
                            value={formData.duration}
                            onChange={(e) => handleChange('duration', e.target.value)}
                            placeholder="Full Day (12 hours)"
                            className="bg-gray-950 border-gray-700 text-white placeholder:text-gray-500"
                        />
                    </div>
                    <div>
                        <Label htmlFor="days_of_operation" className="text-gray-300">Days of Operation</Label>
                        <Input
                            id="days_of_operation"
                            value={formData.days_of_operation}
                            onChange={(e) => handleChange('days_of_operation', e.target.value)}
                            placeholder="Daily"
                            className="bg-gray-950 border-gray-700 text-white placeholder:text-gray-500"
                        />
                    </div>
                    <div>
                        <Label htmlFor="cxl_policy" className="text-gray-300">Cancellation Policy</Label>
                        <Input
                            id="cxl_policy"
                            value={formData.cxl_policy}
                            onChange={(e) => handleChange('cxl_policy', e.target.value)}
                            placeholder="Free cancellation 24h before"
                            className="bg-gray-950 border-gray-700 text-white placeholder:text-gray-500"
                        />
                    </div>
                    <div>
                        <Label htmlFor="extra_fees" className="text-gray-300">Extra Fees</Label>
                        <Input
                            id="extra_fees"
                            value={formData.extra_fees}
                            onChange={(e) => handleChange('extra_fees', e.target.value)}
                            placeholder="Includes lunch and entrance"
                            className="bg-gray-950 border-gray-700 text-white placeholder:text-gray-500"
                        />
                    </div>
                    <div className="col-span-2">
                        <Label htmlFor="meeting_point_info" className="text-gray-300">Meeting Point / Pickup Info</Label>
                        <Textarea
                            id="meeting_point_info"
                            value={formData.meeting_point_info}
                            onChange={(e) => handleChange('meeting_point_info', e.target.value)}
                            placeholder="Hotel pickup available from all Cancun hotels"
                            rows={2}
                            className="bg-gray-950 border-gray-700 text-white placeholder:text-gray-500"
                        />
                    </div>
                </div>
            </section>

            {/* Section 5: Content & Links */}
            <section className="border border-purple-900/30 rounded-lg p-6 bg-purple-950/10">
                <h3 className="text-lg font-semibold mb-4 text-purple-400">📸 Content & Links</h3>
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <Label htmlFor="pictures_url" className="text-gray-300">Pictures Link</Label>
                        <Input
                            id="pictures_url"
                            type="url"
                            value={formData.pictures_url}
                            onChange={(e) => handleChange('pictures_url', e.target.value)}
                            placeholder="https://example.com/tours/gallery"
                            className="bg-gray-950 border-gray-700 text-white placeholder:text-gray-500"
                        />
                    </div>
                    <div>
                        <Label htmlFor="landing_page_url" className="text-gray-300">Landing Page URL</Label>
                        <Input
                            id="landing_page_url"
                            type="url"
                            value={formData.landing_page_url}
                            onChange={(e) => handleChange('landing_page_url', e.target.value)}
                            placeholder="https://satconnect.mx/tours/tour-name"
                            className="bg-gray-950 border-gray-700 text-white placeholder:text-gray-500"
                        />
                    </div>
                    <div>
                        <Label htmlFor="storytelling_url" className="text-gray-300">Storytelling Link</Label>
                        <Input
                            id="storytelling_url"
                            type="url"
                            value={formData.storytelling_url}
                            onChange={(e) => handleChange('storytelling_url', e.target.value)}
                            placeholder="https://example.com/stories/tour-story"
                            className="bg-gray-950 border-gray-700 text-white placeholder:text-gray-500"
                        />
                    </div>
                    <div>
                        <Label htmlFor="notes" className="text-gray-300">Notes</Label>
                        <Textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => handleChange('notes', e.target.value)}
                            placeholder="Additional notes about this tour..."
                            rows={3}
                            className="bg-gray-950 border-gray-700 text-white placeholder:text-gray-500"
                        />
                    </div>
                </div>
            </section>

            {/* Submit Button */}
            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                    {loading ? '🔄 Deploying...' : '🚀 Deploy to System'}
                </Button>
            </div>
        </form>
    );
}
