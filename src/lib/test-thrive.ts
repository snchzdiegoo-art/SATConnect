import { auditTour } from "./thrive-engine";

// Mock Test
const healthyTour = {
    name: "Chichen Itza Deluxe",
    provider: "Mundo Maya",
    netRate: 1000,
    publicPrice: 2500, // Factor 2.5 (Healthy)
    images: ["img1.jpg"],
    description: "Great tour"
};

const riskyTour = {
    name: "Cheap Tour",
    provider: "Mundo Maya",
    netRate: 1000,
    publicPrice: 1200, // Factor 1.2 (B2C Only)
    images: [], // Missing images
    description: "Cheap"
};

console.log("Healthy Tour:", auditTour(healthyTour));
console.log("Risky Tour:", auditTour(riskyTour));
