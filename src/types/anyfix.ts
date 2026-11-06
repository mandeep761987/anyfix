/**
 * ANYFIX Database & Domain Data Contracts
 */

export type BookingStatus =
  | 'BOOKING CONFIRMED'
  | 'TECHNICIAN ASSIGNED'
  | 'REPAIR IN PROGRESS'
  | 'REPAIR FINISHED'
  | 'CANCELLED'
  | 'NEW'
  | 'PENDING'
  | 'CONFIRMED'
  | 'TECHNICIAN_ASSIGNED'
  | 'TECHNICIAN_ACCEPTED'
  | 'TECHNICIAN_ON_THE_WAY'
  | 'ARRIVED'
  | 'REPAIR_STARTED'
  | 'QUALITY_CHECK'
  | 'COMPLETED';

/* -------------------------------------------------------------------------- */
/*                                API Contract                                */
/* -------------------------------------------------------------------------- */

export interface ApiSuccess<T> {
  success: true;
  data: T;
  bookingId?: string;
  count?: number;
  brand?: string;
  message?: string;
  error?: string;
}

export interface ApiError {
  success: false;
  error?: string;
  message?: string;
  data?: undefined;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

/* -------------------------------------------------------------------------- */
/*                               Status Tracking                              */
/* -------------------------------------------------------------------------- */

export interface PublicStatusHistoryItem {
  status: BookingStatus;
  timestamp: string;
  note?: string;
}

export interface BookingPublicTracking {
  bookingId: string;
  createdAt: string;
  brand: string;
  model: string;
  service: string;
  partGrade: string;
  quotedPrice: number;
  warranty: string;
  repairTime: string;
  city: string;
  customerName?: string;
  phone?: string;
  address?: string;
  landmark?: string;
  notes?: string;
  preferredDate?: string;
  preferredTime?: string;
  currentStatus: BookingStatus;
  statusHistory: PublicStatusHistoryItem[];
}

export interface BookingStatusRecord {
  bookingId: string;
  status: BookingStatus;
  updatedAt: string;
  updatedBy: string;
  note?: string;
}

export interface UpdateBookingStatusPayload {
  bookingId: string;
  status: BookingStatus;
  updatedBy: string;
  note?: string;
}

export interface PartTypeDetail {
  partType: string;
  partGrade: string;
  price: number;
  warranty: string;
  repairTime: string;
  bookingFee: number;
}

export interface PartTypesResponseData {
  partTypes: string[];
  details: PartTypeDetail[];
}

export interface CreateBookingPayload {
  customerName: string;
  phone: string;
  brand: string;
  model: string;
  service: string;
  partGrade: string;
  address: string;
  formattedAddress?: string;
  landmark?: string;
  notes?: string;
  preferredDate: string;
  preferredTime: string;
  quotedPrice?: number;
  warranty?: string;
  repairTime?: string;
  bookingFee?: number;
}

export interface BookingSubmissionResult {
  bookingId: string;
  status: string;
  createdAt: string;
  customerName: string;
  phone: string;
  brand: string;
  model: string;
  service: string;
  partGrade: string;
  price: number;
  warranty: string;
  repairTime: string;
  address: string;
  formattedAddress?: string;
  preferredDate: string;
  preferredTime: string;
}
