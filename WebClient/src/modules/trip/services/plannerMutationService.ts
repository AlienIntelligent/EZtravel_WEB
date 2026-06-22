import { DragEndEvent } from '@dnd-kit/core';
import { TripPlace, TripService } from '../../../shared/types';
import { DropValidationResult, validateDrop } from './plannerValidationService';
import { AppDispatch } from '../../../store';
import { insertTimelineNode } from '../../../store/tripSlice';

export const handleDnDDrop = (
    event: DragEndEvent,
    draggedItem: TripPlace | TripService | undefined,
    dispatch: AppDispatch,
    servicesDictionary: Record<string, any>
) => {
    if (!event.over || !draggedItem) return;

    const { active, over } = event;
    const targetType = over.data?.current?.type || '';
    
    // 1. Validate Drop
    const validation: DropValidationResult = validateDrop(
        event, 
        draggedItem, 
        { type: targetType, id: over.id as string }, 
        servicesDictionary
    );

    if (!validation.valid) {
        alert(validation.message || 'Hành động không hợp lệ');
        return;
    }

    const draggedType = 'serviceId' in draggedItem ? 'SERVICE' : 'PLACE';
    const dayId = over.data?.current?.dayId as string;
    const targetIndex = over.data?.current?.index ?? 0;

    // Persistable timeline rows are intentionally flat. The backend can then
    // rebuild the same day/item graph after refresh without losing identities.
    dispatch(insertTimelineNode({
        dayId,
        index: targetIndex,
        node: {
            id: `node-${crypto.randomUUID()}`,
            type: 'TIMELINE_ITEM',
            sequence: targetIndex,
            item: {
                ...draggedItem,
                id: `item-${crypto.randomUUID()}`,
                dayId,
                sequence: targetIndex,
                estimatedCost: draggedType === 'SERVICE'
                    ? (draggedItem as TripService).estimatedCost || 0
                    : undefined
            } as TripPlace | TripService
        }
    }));
};
