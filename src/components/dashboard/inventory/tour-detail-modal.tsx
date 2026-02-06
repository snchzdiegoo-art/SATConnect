"use client"

import { TourInput } from "@/lib/thrive-engine"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Clock, DollarSign, Users, ExternalLink } from "lucide-react"

interface TourDetailModalProps {
    tour: TourInput | null
    isOpen: boolean
    onClose: () => void
}

export function TourDetailModal({ tour, isOpen, onClose }: TourDetailModalProps) {
    if (!tour) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px] bg-gray-900 border-gray-800 text-white max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-teal-400">
                        {tour.name}
                    </DialogTitle>
                    <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-blue-400 border-blue-400">
                            {tour.provider}
                        </Badge>
                        <Badge variant="outline" className="text-xs text-gray-400 border-gray-600">
                            ID: {tour.id}
                        </Badge>
                    </div>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    {/* Economics */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-950 p-4 rounded-lg border border-gray-800">
                            <div className="flex items-center gap-2 text-gray-400 mb-2">
                                <DollarSign className="h-4 w-4" />
                                <span className="text-sm">Net Rate</span>
                            </div>
                            <div className="text-2xl font-bold text-teal-400">
                                ${tour.netRate?.toFixed(2) || '0.00'}
                            </div>
                        </div>
                        <div className="bg-gray-950 p-4 rounded-lg border border-gray-800">
                            <div className="flex items-center gap-2 text-gray-400 mb-2">
                                <DollarSign className="h-4 w-4" />
                                <span className="text-sm">Public Price</span>
                            </div>
                            <div className="text-2xl font-bold text-blue-400">
                                ${tour.publicPrice?.toFixed(2) || '0.00'}
                            </div>
                        </div>
                    </div>

                    {/* Location & Category */}
                    {(tour.location || tour.activityType || tour.tourType) && (
                        <div className="bg-gray-950 p-4 rounded-lg border border-gray-800">
                            <h3 className="font-semibold text-gray-300 mb-3">Categorización</h3>
                            <div className="grid grid-cols-3 gap-4">
                                {tour.location && (
                                    <div>
                                        <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                                            <MapPin className="h-3 w-3" />
                                            Location
                                        </div>
                                        <div className="text-sm text-white">{tour.location}</div>
                                    </div>
                                )}
                                {tour.activityType && (
                                    <div>
                                        <div className="text-gray-500 text-xs mb-1">Activity Type</div>
                                        <div className="text-sm text-white">{tour.activityType}</div>
                                    </div>
                                )}
                                {tour.tourType && (
                                    <div>
                                        <div className="text-gray-500 text-xs mb-1">Tour Type</div>
                                        <div className="text-sm text-white">{tour.tourType}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Technical Specs */}
                    {(tour.duration || tour.opsDays || tour.cxlPolicy) && (
                        <div className="bg-gray-950 p-4 rounded-lg border border-gray-800">
                            <h3 className="font-semibold text-gray-300 mb-3">Especificaciones Técnicas</h3>
                            <div className="grid grid-cols-3 gap-4">
                                {tour.duration && (
                                    <div>
                                        <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                                            <Clock className="h-3 w-3" />
                                            Duration
                                        </div>
                                        <div className="text-sm text-white">{tour.duration}</div>
                                    </div>
                                )}
                                {tour.opsDays && (
                                    <div>
                                        <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                                            <Calendar className="h-3 w-3" />
                                            Ops Days
                                        </div>
                                        <div className="text-sm text-white">{tour.opsDays}</div>
                                    </div>
                                )}
                                {tour.cxlPolicy && (
                                    <div>
                                        <div className="text-gray-500 text-xs mb-1">Cancellation</div>
                                        <div className="text-sm text-white">{tour.cxlPolicy}</div>
                                    </div>
                                )}
                            </div>
                            {tour.meetingPoint && (
                                <div className="mt-3 pt-3 border-t border-gray-800">
                                    <div className="text-gray-500 text-xs mb-1">Meeting Point</div>
                                    <div className="text-sm text-white">{tour.meetingPoint}</div>
                                </div>
                            )}
                            {tour.infantAge && (
                                <div className="mt-3">
                                    <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                                        <Users className="h-3 w-3" />
                                        Infant Age
                                    </div>
                                    <div className="text-sm text-white">{tour.infantAge}</div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Storytelling */}
                    {tour.storytelling && (
                        <div className="bg-gray-950 p-4 rounded-lg border border-gray-800">
                            <h3 className="font-semibold text-gray-300 mb-2">Storytelling</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">{tour.storytelling}</p>
                        </div>
                    )}

                    {/* Landing Page */}
                    {tour.landingPageUrl && (
                        <div className="bg-gray-950 p-4 rounded-lg border border-gray-800">
                            <h3 className="font-semibold text-gray-300 mb-2">Landing Page</h3>
                            <a
                                href={tour.landingPageUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-teal-400 hover:text-teal-300 flex items-center gap-2"
                            >
                                {tour.landingPageUrl}
                                <ExternalLink className="h-3 w-3" />
                            </a>
                        </div>
                    )}

                    {/* Distribution Channels */}
                    {tour.channels && Object.keys(tour.channels).length > 0 && (
                        <div className="bg-gray-950 p-4 rounded-lg border border-gray-800">
                            <h3 className="font-semibold text-gray-300 mb-3">Distribution Channels</h3>
                            <div className="grid grid-cols-4 gap-3">
                                {Object.entries(tour.channels).map(([channel, status]) => (
                                    <div key={channel} className="text-center">
                                        <div className="text-xs text-gray-500 mb-1 capitalize">{channel}</div>
                                        <Badge
                                            variant={status === "Active" ? "primary" : "outline"}
                                            className={status === "Active" ? "bg-green-600" : "text-gray-500 border-gray-700"}
                                        >
                                            {status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Images */}
                    {tour.images && tour.images.length > 0 && (
                        <div className="bg-gray-950 p-4 rounded-lg border border-gray-800">
                            <h3 className="font-semibold text-gray-300 mb-3">Images</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {tour.images.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={`${tour.name} ${idx + 1}`}
                                        className="w-full h-48 object-cover rounded-lg border border-gray-700"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
