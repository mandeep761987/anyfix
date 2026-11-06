import React, { useState, useEffect } from 'react';
import {
  Search,
  Shield,
  CheckCircle2,
  AlertCircle,
  Loader2,
  XCircle,
  ArrowRight,
  RefreshCw,
  HelpCircle,
} from 'lucide-react';
import { getBookingStatus } from '../services/anyfixApi';

interface TrackingViewProps {
  initialBookingId?: string;
  onBookNew: () => void;
}

interface StatusHistoryItem {
  status?: string;
  timestamp?: string;
  updatedAt?: string;
  createdAt?: string;
  time?: string;
  note?: string;
  description?: string;
}

interface BookingDetails {
  bookingId: string;
  createdAt?: string;
  brand?: string;
  model?: string;
  service?: string;
  partGrade?: string;
  customerName?: string;
  phone?: string;
  address?: string;
  status: string; // The exact uppercase status from Google Sheet column N
  preferredDate?: string;
  timeSlot?: string;
  price?: number | string;
  warranty?: string;
  repairTime?: string;
  history?: StatusHistoryItem[];
}

// Exactly the 4 fixed workflow labels requested
const PROGRESS_STEPS = [
  {
    status: 'BOOKING CONFIRMED',
    label: 'BOOKING CONFIRMED',
    description: 'Booking received and confirmed for doorstep repair',
  },
  {
    status: 'TECHNICIAN ASSIGNED',
    label: 'TECHNICIAN ASSIGNED',
    description: 'Expert technician assigned to your service',
  },
  {
    status: 'REPAIR IN PROGRESS',
    label: 'REPAIR IN PROGRESS',
    description: 'Technician is actively testing and repairing your phone',
  },
  {
    status: 'REPAIR FINISHED',
    label: 'REPAIR FINISHED',
    description: 'Quality check completed & warranty activated',
  },
] as const;

const PROGRESS_STEP_KEYS = [
  'BOOKING CONFIRMED',
  'TECHNICIAN ASSIGNED',
  'REPAIR IN PROGRESS',
  'REPAIR FINISHED',
];

const formatPrice = (val: number | string | undefined | null): string => {
  if (val === undefined || val === null || val === '') return '';
  const num =
    typeof val === 'number' ? val : Number(String(val).replace(/[^0-9.-]+/g, ''));
  if (isNaN(num) || num === 0) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

export const TrackingView: React.FC<TrackingViewProps> = ({
  initialBookingId = '',
  onBookNew,
}) => {
  const [searchId, setSearchId] = useState<string>(initialBookingId);
  const [activeBookingId, setActiveBookingId] = useState<string>('');
  const [trackingData, setTrackingData] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const fetchTrackingInfo = async (idToFetch: string, isSilentPoll = false) => {
    const cleanId = String(idToFetch || '').trim();
    if (!cleanId) {
      if (!isSilentPoll) {
        setErrorMsg('Enter your Booking ID to track your repair.');
        setTrackingData(null);
        setActiveBookingId('');
      }
      return;
    }

    if (!isSilentPoll) {
      setLoading(true);
      setErrorMsg('');
    } else {
      setIsPolling(true);
    }

    try {
      // Execute the real Apps Script API call: ?action=getBookingStatus&bookingId=BOOKING_ID
      const result = await getBookingStatus(cleanId);

      // Development logging requirement (never shown to customer)
      if (import.meta.env.DEV) {
        console.log('TRACKING BOOKING ID:', cleanId);
        console.log('REAL API RESPONSE:', result);
        console.log('REAL SHEET STATUS:', result?.data?.status);
      }

      if (!result || !result.success || !result.data) {
        throw new Error(result?.message || `No booking found for ID: "${cleanId}"`);
      }

      // STRICT VALIDATION: Only use result.data.status from Google Sheet
      const rawStatus = result.data.status;
      if (!rawStatus) {
        throw new Error('Booking status was not returned by API');
      }

      const currentStatus = String(rawStatus).trim().toUpperCase();

      const rawHistory = Array.isArray(result.data.history)
        ? result.data.history
        : Array.isArray(result.data.statusHistory)
        ? result.data.statusHistory
        : [];

      const booking: BookingDetails = {
        bookingId: String(result.data.bookingId || cleanId),
        createdAt: result.data.createdAt ? String(result.data.createdAt) : undefined,
        brand: String(result.data.brand || result.data.device?.brand || ''),
        model: String(result.data.model || result.data.device?.model || ''),
        service: String(result.data.service || result.data.repair?.service || ''),
        partGrade: String(result.data.partGrade || result.data.repair?.partGrade || ''),
        customerName: result.data.customerName
          ? String(result.data.customerName)
          : result.data.customer?.name
          ? String(result.data.customer.name)
          : undefined,
        phone: result.data.phone
          ? String(result.data.phone)
          : result.data.customer?.phone
          ? String(result.data.customer.phone)
          : undefined,
        address: result.data.formattedAddress
          ? String(result.data.formattedAddress)
          : result.data.address
          ? String(result.data.address)
          : result.data.doorstepAddress
          ? String(result.data.doorstepAddress)
          : undefined,
        status: currentStatus,
        preferredDate: result.data.preferredDate
          ? String(result.data.preferredDate)
          : undefined,
        timeSlot: result.data.timeSlot
          ? String(result.data.timeSlot)
          : result.data.preferredTime
          ? String(result.data.preferredTime)
          : undefined,
        price: result.data.price ?? result.data.quotedPrice ?? '',
        warranty: result.data.warranty ? String(result.data.warranty) : '',
        repairTime: result.data.repairTime
          ? String(result.data.repairTime)
          : result.data.time
          ? String(result.data.time)
          : '',
        history: rawHistory,
      };

      setTrackingData(booking);
      setActiveBookingId(cleanId);
      setErrorMsg('');
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to retrieve tracking info.';
      if (!isSilentPoll) {
        setErrorMsg(msg);
        setTrackingData(null);
        setActiveBookingId('');
      } else {
        console.warn('[ANYFIX TRACKING] Background poll warning:', msg);
      }
    } finally {
      if (!isSilentPoll) {
        setLoading(false);
      } else {
        setIsPolling(false);
      }
    }
  };

  // 1. Initial load from prop or URL query parameter
  useEffect(() => {
    let idToLoad = initialBookingId;
    if (!idToLoad && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      idToLoad = params.get('bookingId') || params.get('id') || '';
    }
    if (idToLoad) {
      const clean = idToLoad.trim();
      setSearchId(clean);
      fetchTrackingInfo(clean, false);
    }
  }, [initialBookingId]);

  // 2. Polling: exactly one interval per active Booking ID, every 30 seconds
  useEffect(() => {
    if (!activeBookingId) return;

    const intervalId = window.setInterval(() => {
      fetchTrackingInfo(activeBookingId, true);
    }, 30000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [activeBookingId]);

  // 3. Tab visibility / Window focus live refresh
  useEffect(() => {
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible' && activeBookingId) {
        fetchTrackingInfo(activeBookingId, true);
      }
    };

    window.addEventListener('focus', handleVisibilityOrFocus);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);

    return () => {
      window.removeEventListener('focus', handleVisibilityOrFocus);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
    };
  }, [activeBookingId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = searchId.trim();
    if (!cleanId) {
      setErrorMsg('Enter your Booking ID to track your repair.');
      setTrackingData(null);
      setActiveBookingId('');
      return;
    }
    // Update URL query string smoothly without reload
    if (typeof window !== 'undefined') {
      const newUrl = `${window.location.pathname}?bookingId=${encodeURIComponent(
        cleanId
      )}`;
      window.history.replaceState({}, '', newUrl);
    }
    fetchTrackingInfo(cleanId, false);
  };

  // Status mapping derived from real API / Firebase response
  const rawStatus = trackingData?.status || '';
  const isCancelled = rawStatus === 'CANCELLED';
  const normalizedStatus = (rawStatus === 'NEW' || rawStatus === 'PENDING' || rawStatus === 'CONFIRMED')
    ? 'BOOKING CONFIRMED'
    : rawStatus;
  const currentStatus = normalizedStatus;
  // Index from real API status: 0 for BOOKING CONFIRMED, 1 for TECHNICIAN ASSIGNED, 2 for REPAIR IN PROGRESS, 3 for REPAIR FINISHED, -1 if unmapped
  const currentIndex = currentStatus ? PROGRESS_STEP_KEYS.indexOf(currentStatus) : -1;
  const isUnknownStatus = Boolean(currentStatus && !isCancelled && currentIndex === -1);

  return (
    <div id="customer-tracking-view" className="space-y-6">
      {/* Search Header with Glassmorphism */}
      <div className="glass-panel rounded-2xl border border-white/80 bg-white/75 backdrop-blur-xl shadow-[0_10px_32px_rgba(15,23,42,0.05)] p-5 sm:p-7">
        <h2 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#1D4ED8]" />
          Track Your Doorstep Repair
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mb-5">
          Enter your official ANYFIX Booking ID to see live technician updates and milestones.
        </p>

        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-slate-400" />
            </div>
            <input
              id="input-tracking-id"
              type="text"
              placeholder="e.g. AFX-20261001-0001"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              disabled={loading}
              className="glass-input w-full pl-10 pr-4 py-3 rounded-xl text-sm font-mono uppercase tracking-wider text-slate-900 outline-none transition"
            />
          </div>
          <button
            id="btn-search-tracking"
            type="submit"
            disabled={loading}
            className="glass-btn-primary py-3 px-6 rounded-xl text-white font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Checking...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Track Status</span>
              </>
            )}
          </button>
        </form>

        {errorMsg && (
          <div className="mt-4 p-3.5 bg-rose-50/90 backdrop-blur-md border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-800 text-xs sm:text-sm shadow-2xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>{errorMsg}</div>
          </div>
        )}
      </div>

      {/* Case 1: Initial Loading State when API request is in-flight */}
      {loading && !trackingData && (
        <div className="glass-panel rounded-2xl border border-white/80 bg-white/75 backdrop-blur-xl shadow-md p-8 sm:p-12 text-center max-w-xl mx-auto animate-in fade-in duration-150">
          <div className="w-12 h-12 rounded-full bg-blue-50/90 text-[#1D4ED8] flex items-center justify-center mx-auto mb-4 shadow-2xs">
            <Loader2 className="w-6 h-6 animate-spin text-[#1D4ED8]" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
            Checking your repair status...
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Retrieving live repair milestones from our system.
          </p>
        </div>
      )}

      {/* Case 2: No Booking ID provided yet */}
      {!loading && !trackingData && !errorMsg && (
        <div className="glass-panel rounded-2xl border border-white/80 bg-white/75 backdrop-blur-xl shadow-md p-8 sm:p-12 text-center max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-4 shadow-2xs">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
            Enter your Booking ID to track your repair.
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Your Booking ID was displayed when you booked your service and sent via confirmation.
          </p>
        </div>
      )}

      {/* Case 3: Tracking Result View (ONLY rendered after real API response) */}
      {trackingData && (
        <div className="glass-panel rounded-2xl border border-white/80 bg-white/75 backdrop-blur-xl shadow-[0_12px_36px_rgba(15,23,42,0.06)] p-5 sm:p-7 space-y-6 animate-in fade-in duration-150">
          {/* Top Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/80">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono font-black text-[#1D4ED8] text-lg sm:text-xl">
                  {trackingData.bookingId}
                </span>
              </div>
              {trackingData.createdAt && (
                <p className="text-xs text-slate-400 mt-1">
                  Booked on{' '}
                  {new Date(trackingData.createdAt).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => fetchTrackingInfo(activeBookingId, false)}
              disabled={loading}
              className="glass-btn-secondary inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200/80 text-xs font-semibold text-slate-700 hover:bg-white transition cursor-pointer self-start sm:self-auto disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  loading || isPolling ? 'animate-spin' : ''
                }`}
              />
              <span>Refresh Status</span>
            </button>
          </div>

          {/* Device & Repair Summary Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/60 backdrop-blur-md p-4 rounded-xl border border-white/80 text-xs shadow-2xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">
                Device
              </span>
              <span className="font-bold text-slate-900 text-sm">
                {trackingData.brand} {trackingData.model}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">
                Repair
              </span>
              <span className="font-bold text-slate-900 text-sm">
                {trackingData.service}
              </span>
              {trackingData.partGrade && (
                <span className="text-[10px] text-slate-500 block">
                  Grade: {trackingData.partGrade}
                </span>
              )}
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">
                {trackingData.price ? 'Price' : 'Warranty'}
              </span>
              <span className="font-bold text-[#1D4ED8] text-sm font-mono">
                {trackingData.price
                  ? formatPrice(trackingData.price)
                  : trackingData.warranty || '6 Months Warranty'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">
                {trackingData.preferredDate ? 'Schedule' : 'Repair Time'}
              </span>
              <span className="font-semibold text-slate-800">
                {trackingData.preferredDate
                  ? `${trackingData.preferredDate}${
                      trackingData.timeSlot ? ` (${trackingData.timeSlot})` : ''
                    }`
                  : trackingData.repairTime || '30 mins Doorstep'}
              </span>
            </div>
          </div>

          {/* Cancelled State View */}
          {isCancelled && (
            <div className="p-5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3.5 text-rose-900">
              <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-extrabold text-base text-rose-900">
                  Repair Cancelled
                </h3>
                <p className="text-xs sm:text-sm text-rose-700 mt-1 leading-relaxed">
                  This repair booking has been cancelled in the system. The appointment will not be fulfilled. If you would like to book a new repair or have questions, please submit a new request or reach out to our team.
                </p>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={onBookNew}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>Book a New Repair</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Unknown / Unmapped Status Handling (No guessing, show exact API status) */}
          {isUnknownStatus && (
            <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3.5 text-amber-900">
              <HelpCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-extrabold text-base text-amber-900">
                  Current status: {currentStatus}
                </h3>
                <p className="text-xs sm:text-sm text-amber-700 mt-1 leading-relaxed">
                  Our system recorded the status &ldquo;{currentStatus}&rdquo; for your booking. Our support team is managing this request.
                </p>
              </div>
            </div>
          )}

          {/* Fixed 4-Step Stepper Timeline (Only when not cancelled and recognized status) */}
          {!isCancelled && currentIndex !== -1 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Live Repair Progress
                </h3>
                {isPolling && (
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin text-[#1D4ED8]" />
                    <span>Syncing with Sheet...</span>
                  </span>
                )}
              </div>

              <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {PROGRESS_STEPS.map((step, idx) => {
                  const isCompleted = currentIndex >= idx;
                  const isCurrentNext =
                    !isCompleted && idx === currentIndex + 1;

                  return (
                    <div
                      key={`${step.status}-${idx}`}
                      className="relative flex items-start gap-4"
                    >
                      {/* Step Circle Marker */}
                      <div
                        className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                          isCompleted
                            ? 'bg-[#1D4ED8] border-[#1D4ED8] text-white shadow-xs'
                            : isCurrentNext
                            ? 'bg-[#1D4ED8] border-[#1D4ED8] text-white ring-4 ring-blue-100 ring-offset-1'
                            : 'bg-white border-slate-300 text-slate-400'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white stroke-[2.5]" />
                        ) : isCurrentNext ? (
                          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        ) : (
                          <span className="text-[10px] font-bold">
                            {idx + 1}
                          </span>
                        )}
                      </div>

                      {/* Step Text */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4
                            className={`text-sm font-bold tracking-tight ${
                              isCompleted
                                ? 'text-slate-900'
                                : isCurrentNext
                                ? 'text-[#1D4ED8]'
                                : 'text-slate-400'
                            }`}
                          >
                            {step.label}
                          </h4>
                          {isCurrentNext && (
                            <span className="text-[10px] font-extrabold uppercase bg-[#1D4ED8] text-white px-2 py-0.5 rounded-full animate-pulse tracking-wider">
                              In Progress
                            </span>
                          )}
                          {idx === 3 && currentIndex === 3 && (
                            <span className="text-[10px] font-extrabold uppercase bg-emerald-600 text-white px-2 py-0.5 rounded-full tracking-wider">
                              Completed
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-xs mt-0.5 ${
                            isCompleted
                              ? 'text-slate-600'
                              : isCurrentNext
                              ? 'text-slate-600'
                              : 'text-slate-400'
                          }`}
                        >
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Historical Logs if available from API */}
          {trackingData.history && trackingData.history.length > 0 && (
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Status History Log
              </h4>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 divide-y divide-slate-200/60 text-xs">
                {trackingData.history.map((item, i) => {
                  const itemStatus = String(
                    item.status || item.description || ''
                  ).trim();
                  const itemNote = item.note || item.description || '';
                  const rawTime =
                    item.timestamp ||
                    item.updatedAt ||
                    item.time ||
                    item.createdAt ||
                    '';
                  let formattedTime = '';
                  if (rawTime) {
                    try {
                      const d = new Date(rawTime);
                      formattedTime = !isNaN(d.getTime())
                        ? d.toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })
                        : String(rawTime);
                    } catch {
                      formattedTime = String(rawTime);
                    }
                  }

                  return (
                    <div
                      key={i}
                      className="py-2.5 flex items-start sm:items-center justify-between flex-col sm:flex-row gap-1"
                    >
                      <div>
                        <span className="font-bold text-slate-800">
                          {itemStatus}
                        </span>
                        {itemNote && itemNote !== itemStatus && (
                          <span className="text-slate-500 ml-2">
                            — {itemNote}
                          </span>
                        )}
                      </div>
                      {formattedTime && (
                        <span className="text-slate-400 text-[11px] font-mono shrink-0">
                          {formattedTime}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrackingView;
