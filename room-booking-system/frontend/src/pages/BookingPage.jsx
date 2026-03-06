import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/api";
import { formatPrice } from "../utils/helpers";

export default function BookingPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1: dates, 2: details

  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    name: "",
    email: "",
    phone: "",
    guests: 1,
  });

  const [nights, setNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Fetch room details
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/rooms/${roomId}`);
        setRoom(res.data.data || res.data);
      } catch (err) {
        toast.error("Failed to load room details");
        navigate("/rooms");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId, navigate]);

  // Calculate nights & total price whenever dates change
  useEffect(() => {
    if (formData.checkIn && formData.checkOut && room) {
      const inDate = new Date(formData.checkIn);
      const outDate = new Date(formData.checkOut);
      const diffTime = Math.abs(outDate - inDate);
      const nightsCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNights(nightsCount);
      setTotalPrice(nightsCount * room.pricePerNight);
    } else {
      setNights(0);
      setTotalPrice(0);
    }
  }, [formData.checkIn, formData.checkOut, room]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "guests") {
      newValue = Math.max(1, Math.min(room?.capacity || 10, Number(value)));
    }

    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  const handleDateSubmit = (e) => {
    e.preventDefault();

    if (!formData.checkIn || !formData.checkOut) {
      toast.error("Please select both dates");
      return;
    }

    const inDate = new Date(formData.checkIn);
    const outDate = new Date(formData.checkOut);

    if (inDate >= outDate) {
      toast.error("Check-out must be after check-in");
      return;
    }

    setStep(2);
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill in all personal details");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        room: roomId,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          guests: formData.guests,
        },
      };

      const res = await api.post("/bookings", payload);

      toast.success(res.data.message || "Booking request sent! Awaiting confirmation.");
      setTimeout(() => navigate("/"), 2500);
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to submit booking request";
      toast.error(msg);
      console.error("Booking error:", error.response?.data);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Loading room details...</div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-red-400 text-2xl">Room not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            ← Back to Rooms
          </button>

          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Book: {room.name}
          </h1>
          <p className="text-gray-400 text-lg">
            {room.pricePerNight.toLocaleString("en-US", { style: "currency", currency: "USD" })} / night
            {" • "} Up to {room.capacity} guests
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">

          {/* Left: Room Summary */}
          <div className="space-y-10">
            {/* Main Image */}
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
              <img
                src={room.images?.[0] 
                  ? `http://localhost:5000${room.images[0]}`
                  : "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200"}
                alt={room.name}
                className="w-full h-80 md:h-96 object-cover"
              />
            </div>

            {/* Description */}
            {room.description && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">About This Room</h2>
                <p className="text-gray-300 leading-relaxed">{room.description}</p>
              </div>
            )}

            {/* Amenities */}
            {room.amenities?.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
                <div className="flex flex-wrap gap-3">
                  {room.amenities.map((amenity, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-gray-800/70 rounded-full text-sm text-gray-200 border border-gray-700"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Booking Form */}
          <div className="lg:sticky lg:top-10 h-fit">
            <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-sm">

              {/* Step 1: Dates */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-center mb-2">Select Your Dates</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Check-in</label>
                      <input
                        type="date"
                        value={formData.checkIn}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => handleChange({ target: { name: "checkIn", value: e.target.value } })}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Check-out</label>
                      <input
                        type="date"
                        value={formData.checkOut}
                        min={formData.checkIn || new Date().toISOString().split("T")[0]}
                        onChange={(e) => handleChange({ target: { name: "checkOut", value: e.target.value } })}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleDateSubmit}
                    className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-semibold py-4 rounded-xl transition-all shadow-lg disabled:opacity-50"
                  >
                    Continue to Details
                  </button>
                </div>
              )}

              {/* Step 2: Customer Details */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-center mb-2">Your Details</h2>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 123-4567"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Number of Guests</label>
                      <select
                        name="guests"
                        value={formData.guests}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500 outline-none"
                      >
                        {[...Array(room.capacity || 10)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1} {i + 1 === 1 ? "guest" : "guests"}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="pt-4 border-t border-gray-800">
                    <h3 className="text-lg font-semibold mb-3">Booking Summary</h3>
                    <div className="space-y-2 text-gray-300">
                      <div className="flex justify-between">
                        <span>Room</span>
                        <span className="font-medium">{room.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dates</span>
                        <span className="font-medium">
                          {new Date(formData.checkIn).toLocaleDateString()} → {new Date(formData.checkOut).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Nights</span>
                        <span className="font-medium">{nights}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Price per night</span>
                        <span className="font-medium">{formatPrice(room.pricePerNight)}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-700 text-lg font-bold text-amber-400">
                        <span>Total</span>
                        <span>{formatPrice(totalPrice)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 py-4 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition"
                    >
                      Back to Dates
                    </button>

                    <button
                      onClick={handleBooking}
                      disabled={submitting}
                      className="flex-1 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold rounded-xl transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-black" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" fill="none" />
                            <path fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
                          </svg>
                          Processing...
                        </>
                      ) : (
                        "Confirm Booking"
                      )}
                    </button>
                  </div>

                  <p className="text-center text-sm text-gray-500 mt-4">
                    Confirmation email will be sent after admin approval
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}