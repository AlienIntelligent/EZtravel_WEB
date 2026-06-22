export interface Trip {
    id: string;
    title: string;
    trip_budget: number;
    status: 'DRAFT' | 'PRIVATE' | 'SHARED' | 'PUBLIC' | 'ARCHIVED';
    days: Day[];
}

export interface Day {
    id: string;
    date: string; // ISO String
    day_budget: number;
    nodes: TimelineNode[];
}

export type TimelineNode = SimpleItem | LocationCanvas | TravelSegment;

export interface SimpleItem {
    id: string;
    type: 'SIMPLE_ITEM';
    time: string;
    resourceType: 'PLACE' | 'HOTEL' | 'RESTAURANT' | 'ACTIVITY' | 'TRANSPORT';
    name: string;
    cost: number;
}

export interface TravelSegment {
    id: string;
    type: 'TRAVEL_SEGMENT';
    mode: 'TAXI' | 'WALKING' | 'FLIGHT' | 'TRAIN' | 'BUS';
    duration: string; // e.g. "45 min"
    distance?: string; // e.g. "12 km"
    cost?: number;
}

export interface LocationCanvas {
    id: string;
    type: 'LOCATION_CANVAS';
    locationName: string;
    location_budget: number;
    rootPlace: ResourceItem;
    serviceGroups: {
        HOTEL: ResourceItem[];
        RESTAURANT: ResourceItem[];
        ACTIVITY: ResourceItem[];
        TRANSPORT: ResourceItem[];
    };
}

export interface ResourceItem {
    id: string;
    type: 'PLACE' | 'HOTEL' | 'RESTAURANT' | 'ACTIVITY' | 'TRANSPORT';
    name: string;
    estimated_cost: number;
    time?: string;
    duration?: string;
    imageUrl?: string;
}
