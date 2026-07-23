import { useState } from "react";

interface ScheduleInterviewModalProps {
  dark: boolean;
  onClose: () => void;
  onConfirm: (details: { date: Date, time: string, feedback: string }) => void;
  candidateName: string;
}

export function ScheduleInterviewModal({
  dark,
  onClose,
  onConfirm,
  candidateName,
}: ScheduleInterviewModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i));
    return days;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleConfirm = () => {
    if (selectedDate && selectedTime) onConfirm({ date: selectedDate, time: selectedTime, feedback });
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="fixed inset-0 z-[60] flex items-start sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal - scrollable */}
      <div
        className={`relative w-full sm:max-w-lg max-h-screen sm:max-h-[92vh] overflow-y-auto sm:rounded-2xl border shadow-2xl ${dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
          }`}
      >
        {/* Header */}
        <div className={`sticky top-0 z-10 flex items-center justify-between px-5 py-3 border-b backdrop-blur-md ${dark ? "bg-slate-900/95 border-slate-800" : "bg-white/95 border-slate-200"}`}>
          <div className="min-w-0">
            <h3 className="text-base font-semibold">Schedule Interview</h3>
            <p className={`text-xs mt-0.5 truncate ${dark ? "text-slate-400" : "text-slate-500"}`}>
              For {candidateName}
            </p>
          </div>
          <button onClick={onClose} className={`p-1.5 rounded-lg flex-shrink-0 transition-colors ${dark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          {/* Calendar */}
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${dark ? "text-slate-300" : "text-slate-700"}`}>
              Select Date
            </label>
            <div className={`rounded-xl border p-3 ${dark ? "border-slate-800 bg-slate-950/50" : "border-slate-200 bg-slate-50"}`}>
              {/* Month nav */}
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  className={`p-1 rounded-lg transition-colors ${dark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-200 text-slate-600"}`}
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h4 className="text-sm font-semibold">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h4>
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  className={`p-1 rounded-lg transition-colors ${dark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-200 text-slate-600"}`}
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 gap-0.5 mb-1.5">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                  <div key={d} className={`text-[10px] font-medium text-center py-0.5 ${dark ? "text-slate-500" : "text-slate-400"}`}>{d}</div>
                ))}
              </div>

              {/* Days */}
              <div className="grid grid-cols-7 gap-0.5">
                {days.map((date, idx) =>
                  date ? (
                    <button
                      key={idx}
                      onClick={() => !isPastDate(date) && setSelectedDate(date)}
                      disabled={isPastDate(date)}
                      className={`aspect-square rounded-md text-xs font-medium transition-all ${isPastDate(date)
                          ? dark ? "text-slate-700 cursor-not-allowed" : "text-slate-300 cursor-not-allowed"
                          : selectedDate?.getTime() === date.getTime()
                            ? "bg-indigo-500 text-white"
                            : isToday(date)
                              ? dark ? "bg-slate-800 text-indigo-400 hover:bg-slate-700" : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                              : dark ? "hover:bg-slate-800 text-slate-300" : "hover:bg-slate-200 text-slate-700"
                        }`}
                    >
                      {date.getDate()}
                    </button>
                  ) : (
                    <div key={idx} />
                  )
                )}
              </div>
            </div>
          </div>

          {/* Time Slots */}
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${dark ? "text-slate-300" : "text-slate-700"}`}>
              Select Time
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${selectedTime === time
                      ? "bg-indigo-500 text-white"
                      : dark ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${dark ? "text-slate-300" : "text-slate-700"}`}>
              Interview Notes / Feedback
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
              placeholder="Add any notes or feedback..."
              className={`w-full px-3 py-2 rounded-xl border text-xs resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 ${dark ? "bg-slate-950/50 border-slate-800 text-slate-200 placeholder-slate-500" : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                }`}
            />
          </div>
        </div>

        {/* Footer */}
        <div className={`sticky bottom-0 flex items-center justify-end gap-2.5 px-5 py-3 border-t backdrop-blur-md ${dark ? "bg-slate-900/95 border-slate-800" : "bg-white/95 border-slate-200"}`}>
          <button
            onClick={onClose}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${dark ? "hover:bg-slate-800 text-slate-300" : "hover:bg-slate-100 text-slate-700"}`}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedDate || !selectedTime}
            className={`px-5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${!selectedDate || !selectedTime
                ? "bg-indigo-500/50 cursor-not-allowed text-white/50"
                : "bg-indigo-500 hover:bg-indigo-600 text-white"
              }`}
          >
            Confirm Schedule
          </button>
        </div>
      </div>
    </div>
  );
}
