import { Star, Users } from "lucide-react";
import { formatPrice } from "../utils/helpers";

const RoomCard = ({ room, onViewDetails, onBook }) => {

  const mainImage = room.images?.[0]
    ? `http://localhost:5000${room.images[0]}`
    : "/placeholder-room.jpg";

  const rating = room.rating || 4.6;

  return (

    <div className="group bg-[#151515] border border-white/10 rounded-xl overflow-hidden hover:border-yellow-500 transition duration-300">

      {/* IMAGE */}

      <div className="relative h-64 overflow-hidden">

        <img
          src={mainImage}
          alt={room.name}
          className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
          loading="lazy"
        />

        {/* overlay */}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

        {/* PRICE */}

        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-4 py-1 rounded-full text-sm text-yellow-400 font-semibold">
          {formatPrice(room.pricePerNight)}
        </div>

        {/* RATING */}

        <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-sm">

          <Star size={14} className="text-yellow-400 fill-yellow-400" />

          {rating}

        </div>

      </div>

      {/* CONTENT */}

      <div className="p-6 flex flex-col gap-4">

        {/* TITLE */}

        <h3 className="text-lg font-semibold text-white">
          {room.name}
        </h3>

        {/* DESCRIPTION */}

        {room.description && (

          <p className="text-gray-400 text-sm line-clamp-2">
            {room.description}
          </p>

        )}

        {/* CAPACITY */}

        <div className="flex items-center gap-2 text-gray-400 text-sm">

          <Users size={16} />

          {room.capacity} Guests

        </div>

        {/* AMENITIES */}

        {room.amenities?.length > 0 && (

          <div className="flex flex-wrap gap-2">

            {room.amenities.slice(0, 3).map((amenity, i) => (

              <span
                key={i}
                className="text-xs bg-[#1f1f1f] text-gray-300 px-3 py-1 rounded-full border border-white/10"
              >
                {amenity}
              </span>

            ))}

          </div>

        )}

        {/* ACTIONS */}

        <div className="flex gap-3 pt-2">

          {/* VIEW DETAILS */}

          <button
            onClick={() => onViewDetails?.(room._id)}
            className="flex-1 border border-white/10 rounded-lg py-2 text-sm text-gray-300 hover:border-yellow-500 hover:text-yellow-400 transition"
          >
            View Details
          </button>

          {/* BOOK NOW */}

          <button
            onClick={() => onBook?.(room._id)}
            className="flex-1 py-2 text-sm rounded-lg bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-semibold hover:brightness-110 transition"
          >
            Book Now
          </button>

        </div>

      </div>

    </div>

  );

};

export default RoomCard;