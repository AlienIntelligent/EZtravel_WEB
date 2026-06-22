import { DragEndEvent } from '@dnd-kit/core';
import { TripPlace, TripService } from '../../../shared/types';
import { PopulatedTripDay } from '../../../store/tripSlice';

export type DropValidationResult = {
  valid: boolean;
  code?: string;
  message?: string;
};

/**
 * Validates whether a dragged item can be dropped onto a specific target container.
 * This intercepts the dragEnd event before mutation.
 */
export const validateDrop = (
  event: DragEndEvent,
  draggedItem: TripPlace | TripService | undefined,
  targetContext: { type: string; id: string },
  servicesDictionary: Record<string, any>
): DropValidationResult => {
  if (!event.over || !draggedItem) {
    return { valid: false, code: 'INVALID_TARGET', message: 'Invalid target or item' };
  }

  const { over } = event;
  const targetId = over.id as string;
  const targetType = over.data?.current?.type || targetContext.type; // Extract semantic target type

  // Check if it's a service and get its type
  let draggedServiceType = null;
  if ('serviceId' in draggedItem) {
    const service = servicesDictionary[draggedItem.serviceId];
    if (service) {
      draggedServiceType = service.type; // 'HOTEL', 'RESTAURANT', 'ACTIVITY', 'TRANSPORT'
    }
  }

  // Example Validation Rule: Accommodations cannot be dropped into Food & Beverage groups
  if (targetType === 'FOOD_BEVERAGE_GROUP' && draggedServiceType) {
    if (draggedServiceType === 'HOTEL' || draggedServiceType === 'RESORT' || draggedServiceType === 'HOMESTAY') {
      return { valid: false, code: 'INVALID_GROUP', message: 'Không thể thêm nơi lưu trú vào nhóm Ăn uống.' };
    }
  }

  // Example Validation Rule: Places cannot be dropped into Service Groups
  if (targetType === 'SERVICE_GROUP' && !('serviceId' in draggedItem)) {
    return { valid: false, code: 'INVALID_ENTITY', message: 'Chỉ có thể thêm Dịch vụ vào Nhóm Dịch vụ.' };
  }

  return { valid: true };
};
