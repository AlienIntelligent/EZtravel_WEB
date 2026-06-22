import { Service } from '../../../shared/types';

export enum TargetGroup {
  ACCOMMODATION = 'ACCOMMODATION_GROUP',
  FOOD_BEVERAGE = 'FOOD_BEVERAGE_GROUP',
  ACTIVITIES = 'ACTIVITIES_GROUP',
  TRAVEL_SEGMENT = 'TRAVEL_SEGMENT',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Dynamically infers the target group based on the underlying DICH_VU_DU_LICH classification.
 */
export const inferTargetGroup = (serviceType: string): TargetGroup => {
  const type = serviceType.toUpperCase();

  // Accommodation matches
  if (['RESORT', 'HOTEL', 'HOMESTAY', 'VILLA', 'APARTMENT'].includes(type)) {
    return TargetGroup.ACCOMMODATION;
  }

  // Food & Beverage matches
  if (['RESTAURANT', 'CAFE', 'BAR', 'STREET_FOOD', 'BUFFET'].includes(type)) {
    return TargetGroup.FOOD_BEVERAGE;
  }

  // Activities matches
  if (['TOUR', 'SPA', 'MUSEUM', 'THEME_PARK', 'TICKET', 'SHOW', 'EXPERIENCE'].includes(type)) {
    return TargetGroup.ACTIVITIES;
  }

  // Travel Segments (Transport) matches
  if (['BUS', 'FLIGHT', 'TRAIN', 'TAXI', 'TRANSFER', 'CAR_RENTAL', 'BOAT'].includes(type)) {
    return TargetGroup.TRAVEL_SEGMENT;
  }

  return TargetGroup.UNKNOWN;
};
