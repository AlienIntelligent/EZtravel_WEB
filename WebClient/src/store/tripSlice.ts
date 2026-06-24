import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Trip, TripDay, TripPlace, TripService, BudgetSummary, Place, Service } from '../shared/types';

export type NodeType = 'TIMELINE_ITEM' | 'TRAVEL_SEGMENT' | 'LOCATION_CANVAS' | 'SERVICE_NODE';

export interface BaseNode {
    id: string;
    type: NodeType;
    sequence: number;
}

export interface TimelineItemNode extends BaseNode {
    type: 'TIMELINE_ITEM';
    item: TripPlace | TripService;
}

export interface TravelSegmentNode extends BaseNode {
    type: 'TRAVEL_SEGMENT';
    mode: 'TAXI' | 'WALKING' | 'BUS' | 'FLIGHT' | 'TRAIN';
    duration?: string;
    distance?: string;
    cost?: number;
    originNodeId?: string;
    destinationNodeId?: string;
}

export interface ServiceGroup {
    type: 'ACCOMMODATION_GROUP' | 'FOOD_BEVERAGE_GROUP' | 'ACTIVITIES_GROUP';
    items: TripService[];
}

export interface LocationCanvasNode extends BaseNode {
    type: 'LOCATION_CANVAS';
    anchorPlace: TripPlace;
    groups: Record<string, ServiceGroup>;
    locationBudget: number;
}

export type TimelineNode = TimelineItemNode | TravelSegmentNode | LocationCanvasNode;

export interface PopulatedTripDay extends TripDay {
    nodes: TimelineNode[];
}

export interface TripState {
    activeTrip: Trip | null;
    selectedDay: string | null;
    scratchpadPlaces: TripPlace[];
    scratchpadServices: TripService[];
    timelineDays: PopulatedTripDay[];
    budgetSummary: BudgetSummary;
    placesDictionary: Record<string, Place>;
    servicesDictionary: Record<string, Service>;
    highlightedItemId: string | null;
    saveStatus: 'IDLE' | 'SAVING' | 'SAVED' | 'ERROR';
    lastSavedAt: string | null;
}

const initialBudget: BudgetSummary = { total: 0, accommodation: 0, food: 0, activity: 0, transport: 0 };

const mockPlacesData: Place[] = [
    { id: 'p1', name: 'Bà Nà Hills', type: 'ATTRACTION', location: { address: 'Đà Nẵng' }, imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80' },
    { id: 'p2', name: 'Phố cổ Hội An', type: 'ATTRACTION', location: { address: 'Quảng Nam' }, imageUrl: 'https://images.unsplash.com/photo-1540483761890-a1f7be05ce34?w=400&q=80' }
] as any as Place[];

const mockServicesData: Service[] = [
    { id: 'h1', name: 'Novotel Đà Nẵng', type: 'ACCOMMODATION', providerId: 'prov1', price: 1500000, images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80'] },
    { id: 'r1', name: 'Mì Quảng Bà Mua', type: 'FOOD', providerId: 'prov2', price: 150000, images: ['https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80'] },
    { id: 'a1', name: 'Lướt ván biển Mỹ Khê', type: 'ACTIVITY', providerId: 'prov3', price: 500000, images: ['https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&q=80'] },
    { id: 't1', name: 'Xe điện VinBus', type: 'TRANSPORT', providerId: 'prov4', price: 20000, images: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80'] }
] as any as Service[];

const initialPlacesDict = mockPlacesData.reduce((acc, p) => { acc[p.id] = p; return acc; }, {} as Record<string, Place>);
const initialServicesDict = mockServicesData.reduce((acc, s) => { acc[s.id] = s; return acc; }, {} as Record<string, Service>);

const initialState: TripState = {
    activeTrip: null,
    selectedDay: 'day1',
    scratchpadPlaces: [
        { id: 'sp1', placeId: 'p1', dayId: 'none', sequence: 0 },
        { id: 'sp2', placeId: 'p2', dayId: 'none', sequence: 1 }
    ],
    scratchpadServices: [
        { id: 'ss1', serviceId: 'h1', dayId: 'none', sequence: 0, estimatedCost: 1500000 },
        { id: 'ss2', serviceId: 'r1', dayId: 'none', sequence: 1, estimatedCost: 150000 },
        { id: 'ss3', serviceId: 'a1', dayId: 'none', sequence: 2, estimatedCost: 500000 },
        { id: 'ss4', serviceId: 't1', dayId: 'none', sequence: 3, estimatedCost: 20000 }
    ],
    timelineDays: [
        {
            id: 'day1',
            tripId: 'mockTripId',
            date: new Date().toISOString(),
            sequence: 0,
            nodes: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ],
    budgetSummary: initialBudget,
    placesDictionary: initialPlacesDict,
    servicesDictionary: initialServicesDict,
    highlightedItemId: null,
    saveStatus: 'IDLE',
    lastSavedAt: null,
};

const tripSlice = createSlice({
    name: 'trip',
    initialState,
    reducers: {
        setActiveTrip: (state, action: PayloadAction<Trip>) => {
            state.activeTrip = action.payload;
        },
        setSelectedDay: (state, action: PayloadAction<string | null>) => {
            state.selectedDay = action.payload;
        },
        setTimelineDays: (state, action: PayloadAction<PopulatedTripDay[]>) => {
            state.timelineDays = action.payload;
            state.budgetSummary = calculateBudget(state.timelineDays, state.servicesDictionary);
        },
        setScratchpad: (state, action: PayloadAction<{ places: TripPlace[]; services: TripService[] }>) => {
            state.scratchpadPlaces = action.payload.places;
            state.scratchpadServices = action.payload.services;
        },
        appendScratchpad: (state, action: PayloadAction<{ places: TripPlace[]; services: TripService[] }>) => {
            const existingPlaceIds = new Set(state.scratchpadPlaces.map(p => p.placeId));
            const existingServiceIds = new Set(state.scratchpadServices.map(s => s.serviceId));

            action.payload.places.forEach(p => {
                if (!existingPlaceIds.has(p.placeId)) {
                    state.scratchpadPlaces.push(p);
                    existingPlaceIds.add(p.placeId);
                }
            });

            action.payload.services.forEach(s => {
                if (!existingServiceIds.has(s.serviceId)) {
                    state.scratchpadServices.push(s);
                    existingServiceIds.add(s.serviceId);
                }
            });
        },
        
        // DnD Actions
        moveItemToDay: (state, action: PayloadAction<{ 
            itemType: 'PLACE' | 'SERVICE'; 
            itemId: string; 
            targetDayId: string; 
            targetIndex: number 
        }>) => {
            const { itemType, itemId, targetDayId, targetIndex } = action.payload;
            
            // 1. Find the item
            let itemToMove: TripPlace | TripService | undefined;
            
            // Check scratchpad
            if (itemType === 'PLACE') {
                const idx = state.scratchpadPlaces.findIndex(p => p.id === itemId);
                if (idx !== -1) {
                    itemToMove = state.scratchpadPlaces[idx];
                    state.scratchpadPlaces.splice(idx, 1);
                }
            } else {
                const idx = state.scratchpadServices.findIndex(s => s.id === itemId);
                if (idx !== -1) {
                    itemToMove = state.scratchpadServices[idx];
                    state.scratchpadServices.splice(idx, 1);
                }
            }

            // Check days (only basic TIMELINE_ITEM for now - full DnD engine will handle nested later)
            if (!itemToMove) {
                for (const day of state.timelineDays) {
                    const idx = day.nodes.findIndex(n => n.type === 'TIMELINE_ITEM' && n.item.id === itemId);
                    if (idx !== -1) {
                        itemToMove = (day.nodes[idx] as TimelineItemNode).item;
                        day.nodes.splice(idx, 1);
                        break;
                    }
                }
            }

            if (!itemToMove) return;

            // 2. Add to target day
            const targetDay = state.timelineDays.find(d => d.id === targetDayId);
            if (targetDay) {
                itemToMove.dayId = targetDayId;
                const newNode: TimelineItemNode = {
                    id: `node-${itemToMove.id}`,
                    type: 'TIMELINE_ITEM',
                    sequence: targetIndex,
                    item: itemToMove
                };
                targetDay.nodes.splice(targetIndex, 0, newNode);
                
                // 3. Update sequences
                targetDay.nodes.forEach((node, index) => {
                    node.sequence = index;
                });
            }

            // Recalculate budget
            state.budgetSummary = calculateBudget(state.timelineDays, state.servicesDictionary);
        },
        
        moveItemToScratchpad: (state, action: PayloadAction<{ itemType: 'PLACE' | 'SERVICE'; itemId: string; sourceDayId: string }>) => {
            const { itemType, itemId, sourceDayId } = action.payload;
            const sourceDay = state.timelineDays.find(d => d.id === sourceDayId);
            if (!sourceDay) return;

            const idx = sourceDay.nodes.findIndex(n => n.type === 'TIMELINE_ITEM' && n.item.id === itemId);
            if (idx === -1) return;

            const [removedNode] = sourceDay.nodes.splice(idx, 1);
            if (removedNode.type !== 'TIMELINE_ITEM') return;
            const removed = removedNode.item;
            
            removed.dayId = ''; // Clear day association
            removed.sequence = 0;

            if (itemType === 'PLACE') {
                state.scratchpadPlaces.push(removed as TripPlace);
            } else {
                state.scratchpadServices.push(removed as TripService);
            }

            // Update sequences for the remaining items in the source day
            sourceDay.nodes.forEach((node, index) => {
                node.sequence = index;
            });

            state.budgetSummary = calculateBudget(state.timelineDays, state.servicesDictionary);
        },
        // Advanced DnD Mutations (Nested)
        insertTimelineNode: (state, action: PayloadAction<{ dayId: string; index: number; node: TimelineNode }>) => {
            const day = state.timelineDays.find(d => d.id === action.payload.dayId);
            if (day) {
                let index = action.payload.index;
                if (index < 0) index = day.nodes.length;
                day.nodes.splice(index, 0, action.payload.node);
                day.nodes.forEach((n, idx) => n.sequence = idx);
                state.budgetSummary = calculateBudget(state.timelineDays, state.servicesDictionary);
            }
        },
        removeTimelineNode: (state, action: PayloadAction<{ dayId: string; nodeId: string }>) => {
            const day = state.timelineDays.find(d => d.id === action.payload.dayId);
            if (day) {
                const idx = day.nodes.findIndex(n => n.id === action.payload.nodeId);
                if (idx !== -1) {
                    day.nodes.splice(idx, 1);
                    day.nodes.forEach((n, idx) => n.sequence = idx);
                    state.budgetSummary = calculateBudget(state.timelineDays, state.servicesDictionary);
                }
            }
        },
        moveTimelineNode: (state, action: PayloadAction<{
            sourceDayId: string;
            targetDayId: string;
            nodeId: string;
            targetIndex: number;
        }>) => {
            const { sourceDayId, targetDayId, nodeId } = action.payload;
            const sourceDay = state.timelineDays.find(day => day.id === sourceDayId);
            const targetDay = state.timelineDays.find(day => day.id === targetDayId);
            if (!sourceDay || !targetDay) return;

            const sourceIndex = sourceDay.nodes.findIndex(node => node.id === nodeId);
            if (sourceIndex < 0) return;

            const [node] = sourceDay.nodes.splice(sourceIndex, 1);
            let targetIndex = Math.max(0, Math.min(action.payload.targetIndex, targetDay.nodes.length));
            if (sourceDayId === targetDayId && sourceIndex < targetIndex) targetIndex -= 1;
            targetDay.nodes.splice(targetIndex, 0, node);

            sourceDay.nodes.forEach((item, index) => item.sequence = index);
            if (targetDay !== sourceDay) {
                targetDay.nodes.forEach((item, index) => item.sequence = index);
            }
            state.budgetSummary = calculateBudget(state.timelineDays, state.servicesDictionary);
        },
        updateTimelineItem: (state, action: PayloadAction<{
            dayId: string;
            nodeId: string;
            changes: Partial<TripPlace & TripService>;
        }>) => {
            const day = state.timelineDays.find(item => item.id === action.payload.dayId);
            const node = day?.nodes.find(item => item.id === action.payload.nodeId);
            if (!node || node.type !== 'TIMELINE_ITEM') return;

            if (action.payload.changes.placeId) delete (node.item as Partial<TripService>).serviceId;
            if (action.payload.changes.serviceId) delete (node.item as Partial<TripPlace>).placeId;
            Object.assign(node.item, action.payload.changes);
            state.budgetSummary = calculateBudget(state.timelineDays, state.servicesDictionary);
        },
        insertServiceIntoCanvas: (state, action: PayloadAction<{ dayId: string; canvasId: string; groupType: string; index: number; service: TripService }>) => {
            const day = state.timelineDays.find(d => d.id === action.payload.dayId);
            if (!day) return;
            const canvas = day.nodes.find(n => n.id === action.payload.canvasId && n.type === 'LOCATION_CANVAS') as LocationCanvasNode | undefined;
            if (!canvas) return;
            
            if (!canvas.groups[action.payload.groupType]) {
                canvas.groups[action.payload.groupType] = { type: action.payload.groupType as any, items: [] };
            }
            canvas.groups[action.payload.groupType].items.splice(action.payload.index, 0, action.payload.service);
            state.budgetSummary = calculateBudget(state.timelineDays, state.servicesDictionary);
        },
        removeServiceFromCanvas: (state, action: PayloadAction<{ dayId: string; canvasId: string; groupType: string; serviceId: string }>) => {
            const day = state.timelineDays.find(d => d.id === action.payload.dayId);
            if (!day) return;
            const canvas = day.nodes.find(n => n.id === action.payload.canvasId && n.type === 'LOCATION_CANVAS') as LocationCanvasNode | undefined;
            if (!canvas || !canvas.groups[action.payload.groupType]) return;
            
            const group = canvas.groups[action.payload.groupType];
            const idx = group.items.findIndex(i => i.id === action.payload.serviceId);
            if (idx !== -1) {
                group.items.splice(idx, 1);
                state.budgetSummary = calculateBudget(state.timelineDays, state.servicesDictionary);
            }
        },
        setHighlightedItemId: (state, action: PayloadAction<string | null>) => {
            state.highlightedItemId = action.payload;
        },
        setDictionaries: (state, action: PayloadAction<{ places: Place[], services: Service[] }>) => {
            action.payload.places.forEach(p => state.placesDictionary[p.id] = p);
            action.payload.services.forEach(s => state.servicesDictionary[s.id] = s);
            state.budgetSummary = calculateBudget(state.timelineDays, state.servicesDictionary);
        },
        setSaveState: (state, action: PayloadAction<{
            status: TripState['saveStatus'];
            savedAt?: string | null;
        }>) => {
            state.saveStatus = action.payload.status;
            if (action.payload.savedAt !== undefined) {
                state.lastSavedAt = action.payload.savedAt;
            }
        }
    },
});

function calculateBudget(days: PopulatedTripDay[], servicesDict: Record<string, Service>): BudgetSummary {
    const summary: BudgetSummary = { total: 0, accommodation: 0, food: 0, activity: 0, transport: 0 };
    days.forEach(day => {
        day.nodes.forEach(node => {
            if (node.type === 'TIMELINE_ITEM' && 'serviceId' in node.item) {
                const cost = node.item.estimatedCost || 0;
                summary.total += cost;
                const service = servicesDict[node.item.serviceId];
                if (service) {
                    if (service.type === 'ACCOMMODATION') summary.accommodation += cost;
                    else if (service.type === 'FOOD') summary.food += cost;
                    else if (service.type === 'ACTIVITY') summary.activity += cost;
                    else if (service.type === 'TRANSPORT') summary.transport += cost;
                }
            } else if (node.type === 'TRAVEL_SEGMENT' && node.cost) {
                summary.total += node.cost;
                summary.transport += node.cost;
            } else if (node.type === 'LOCATION_CANVAS') {
                Object.values(node.groups).forEach(group => {
                    group.items.forEach(item => {
                        const cost = item.estimatedCost || 0;
                        summary.total += cost;
                        const service = servicesDict[item.serviceId];
                        if (service) {
                            if (service.type === 'ACCOMMODATION') summary.accommodation += cost;
                            else if (service.type === 'FOOD') summary.food += cost;
                            else if (service.type === 'ACTIVITY') summary.activity += cost;
                            else if (service.type === 'TRANSPORT') summary.transport += cost;
                        }
                    });
                });
            }
        });
    });
    return summary;
}

export const {
    setActiveTrip,
    setSelectedDay,
    setTimelineDays,
    setScratchpad,
    appendScratchpad,
    moveItemToDay,
    moveItemToScratchpad,
    insertTimelineNode,
    removeTimelineNode,
    moveTimelineNode,
    updateTimelineItem,
    insertServiceIntoCanvas,
    removeServiceFromCanvas,
    setHighlightedItemId,
    setDictionaries,
    setSaveState
} = tripSlice.actions;

export default tripSlice.reducer;
