import Button from "./ui/Button";
import { Calendar } from "lucide-react";
import { formatDate } from "../utils/helpers";

const EventCard = ({ event, onView }) => {

  const mainImage = event.images?.[0]
    ? event.images[0]
    : "https://i.sstatic.net/y9DpT.jpg";

  return (
    <div className="group bg-[#151515] border border-white/10 rounded-xl overflow-hidden hover:border-yellow-500 transition duration-500">

      {/* IMAGE */}
      <div className="relative h-56 overflow-hidden">

        <img
          src={mainImage}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

        {/* date badge */}
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
          <Calendar size={12} />
          {formatDate(event.eventDate, "MMM dd")}
        </div>

      </div>

      {/* CONTENT */}
      <div className="p-6 flex flex-col gap-4">

        {/* Title */}
        <h3 className="text-xl font-semibold text-white group-hover:text-yellow-500 transition">
          {event.title}
        </h3>

        {/* Description */}
        {event.description && (
          <p className="text-gray-400 text-sm line-clamp-2">
            {event.description}
          </p>
        )}

        {/* Date */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar size={16} className="text-yellow-500" />
          {formatDate(event.eventDate, "MMMM dd, yyyy")}
        </div>

        {/* Action */}
        <div className="pt-2">

          <Button
            size="sm"
            className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-semibold hover:opacity-90"
            onClick={() => onView?.(event._id)}
          >
            View Event
          </Button>

        </div>

      </div>

    </div>
  );
};

export default EventCard;