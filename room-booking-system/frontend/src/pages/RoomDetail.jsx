import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Users, Wifi } from "lucide-react";

import { roomsApi, bookingsApi } from "../lib/api";
import { LoadingSkeleton } from "../components/ui/Loading";
import { Alert } from "../components/ui/Alert";
import Button from "../components/ui/Button";
import Card, {CardBody } from "../components/ui/Card";
import { formatPrice } from "../utils/helpers";
import { showErrorToast } from "../utils/toast";

export default function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);

  const [availability, setAvailability] = useState(null);
  const [checking, setChecking] = useState(false);
  const [checkDates, setCheckDates] = useState({ checkIn: "", checkOut: "" });

  const fetchRoom = useCallback(async () => {
    try {
      const res = await roomsApi.getById(id);
      const data = res.data.room || res.data;
      setRoom(data.data);
    } catch (err) {
      showErrorToast("Failed to load room");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRoom();
  }, [fetchRoom]);

  const handleCheckAvailability = async (e) => {
    e.preventDefault();
    if (!checkDates.checkIn || !checkDates.checkOut) {
      showErrorToast("Select check-in & check-out dates");
      return;
    }
    try {
      setChecking(true);
      const res = await bookingsApi.checkAvailability(
        id,
        checkDates.checkIn,
        checkDates.checkOut
      );
      setAvailability(res.data.available);
    } catch {
      showErrorToast("Availability check failed");
    } finally {
      setChecking(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#0c0c0c] min-h-screen py-32 px-6">
        <LoadingSkeleton count={6} />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="bg-[#0c0c0c] min-h-screen py-32 px-6">
        <Alert type="error" message="Room not found" />
      </div>
    );
  }

  const images =
    room.images?.length > 0
      ? room.images.map((img) => img)
      : ["https://i.sstatic.net/y9DpT.jpg"];
  const currentImage = images[imageIndex];
  const isVideo = currentImage.endsWith(".mp4");

  return (
    <div className="bg-[#0c0c0c] text-white min-h-screen">
      {/* HERO */}
      <section className="relative h-[60vh] flex items-end">
        {isVideo ? (
          <video
            src={currentImage}
            controls
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <img
            src={currentImage}
            alt={room.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-12 w-full">
          <button
            onClick={() => navigate("/rooms")}
            className="flex items-center gap-2 text-gray-300 hover:text-yellow-500 mb-6"
          >
            <ChevronLeft size={18} />
            Back to Rooms
          </button>
          <h1 className="text-4xl md:text-6xl font-semibold max-w-3xl leading-tight">
            {room.name}
          </h1>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-16">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-2 space-y-10">
            {/* DESCRIPTION */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">About This Room</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {room.description}
              </p>
            </div>

            {/* IMAGE GALLERY */}
            {images.length > 1 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Gallery</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`room-${index}`}
                      className="rounded-xl object-cover h-64 w-full hover:scale-105 transition duration-500 cursor-pointer"
                      onClick={() => setImageIndex(index)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* AMENITIES */}
            {room.amenities?.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-5">Amenities</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {room.amenities.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg"
                    >
                      <Wifi size={18} className="text-yellow-500" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">
            <Card className="sticky top-10 shadow-xl rounded-2xl border border-gray-700 bg-gray-900">
              <CardBody className="space-y-6">
                {/* PRICE */}
                <div>
                  <div className="text-4xl font-bold text-yellow-500">
                    {formatPrice(room.pricePerNight)}
                  </div>
                  <p className="text-gray-400 text-sm">per night</p>
                </div>

                {/* CAPACITY */}
                {room.capacity && (
                  <div className="flex items-center gap-3 text-gray-300">
                    <Users size={18} /> {room.capacity} Guests
                  </div>
                )}

                {/* CHECK AVAILABILITY FORM */}
                <form onSubmit={handleCheckAvailability} className="space-y-3">
                  <h3 className="font-semibold text-white">Check Availability</h3>
                  <input
                    type="date"
                    value={checkDates.checkIn}
                    onChange={(e) =>
                      setCheckDates({ ...checkDates, checkIn: e.target.value })
                    }
                    className="w-full border rounded-lg p-2 text-black"
                  />
                  <input
                    type="date"
                    value={checkDates.checkOut}
                    onChange={(e) =>
                      setCheckDates({ ...checkDates, checkOut: e.target.value })
                    }
                    className="w-full border rounded-lg p-2 text-black"
                  />
                  <Button
                    type="submit"
                    className="w-full bg-black text-white hover:bg-gray-900"
                  >
                    {checking ? "Checking..." : "Check Availability"}
                  </Button>
                </form>

                {/* AVAILABILITY ALERT */}
                {availability !== null && (
                  <Alert
                    type={availability ? "success" : "error"}
                    title={availability ? "Available" : "Not Available"}
                    message={
                      availability
                        ? "Room available for your dates"
                        : "Room not available"
                    }
                  />
                )}

                {/* BOOK BUTTON */}
                <Button
                  className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-semibold hover:opacity-90"
                  disabled={availability === false}
                  onClick={() => navigate(`/book/${room._id}`)}
                >
                  Reserve This Room
                </Button>
                <p className="text-xs text-gray-400 text-center">
                  Free cancellation up to 48 hours before check-in
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}