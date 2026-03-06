import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Search, SlidersHorizontal } from "lucide-react";

import RoomCard from "../components/RoomCard";
import Button from "../components/ui/Button";
import { LoadingSkeleton } from "../components/ui/Loading";
import { Alert } from "../components/ui/Alert";

import { roomsApi } from "../lib/api";

export default function AllRooms() {

  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    guests: 1,
    maxPrice: 50000,
    amenity: "",
  });


  /* FETCH ROOMS */

  useEffect(() => {

    const fetchRooms = async () => {

      try {

        const res = await roomsApi.getList();

        const data = Array.isArray(res.data.data)
          ? res.data.data
          : [];

        const activeRooms = data.filter(r => r.isActive);

        setRooms(activeRooms);
        setFilteredRooms(activeRooms);

      } catch (err) {

        console.error(err);
        setError("Failed to load rooms");

      } finally {

        setLoading(false);

      }

    };

    fetchRooms();

  }, []);



  /* APPLY FILTERS */

  const applyFilters = () => {

    let results = [...rooms];

    if (filters.guests) {
      results = results.filter(
        (room) => room.capacity >= Number(filters.guests)
      );
    }

    if (filters.maxPrice) {
      results = results.filter(
        (room) => room.pricePerNight <= Number(filters.maxPrice)
      );
    }

    if (filters.amenity) {
      results = results.filter(
        (room) =>
          room.amenities &&
          room.amenities.includes(filters.amenity)
      );
    }

    setFilteredRooms(results);

  };


  const handleSubmit = (e) => {

    e.preventDefault();
    applyFilters();

  };



  return (

    <div className="bg-[#0f0f0f] text-white min-h-screen">

      {/* HERO */}

      <section
        className="relative h-[40vh] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=2000")',
        }}
      >

        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative text-center px-6">

          <h1 className="text-5xl font-bold mb-4">
            Explore Our Rooms
          </h1>

          <p className="text-gray-300">
            Luxury stays designed for comfort
          </p>

        </div>

      </section>



      {/* MAIN */}

      <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-4 gap-10">

        {/* SIDEBAR */}

        <aside className="lg:col-span-1">

          <div className="sticky top-28 bg-[#111] border border-white/10 rounded-xl p-6 space-y-6">

            <div className="flex items-center gap-2 text-xl font-semibold">
              <SlidersHorizontal size={18}/>
              Filters
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* GUESTS */}

              <div>

                <label className="text-sm text-gray-400 flex items-center gap-2 mb-2">
                  <Users size={16}/>
                  Guests
                </label>

                <select
                  value={filters.guests}
                  onChange={(e)=>
                    setFilters({
                      ...filters,
                      guests:e.target.value
                    })
                  }
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2"
                >
                  {[1,2,3,4,5,6,7,8].map((g)=>(
                    <option key={g} value={g}>
                      {g}+ Guests
                    </option>
                  ))}
                </select>

              </div>


              {/* PRICE RANGE */}

              <div>

                <label className="text-sm text-gray-400 mb-2 block">
                  Max Price: ₹{filters.maxPrice}
                </label>

                <input
                  type="range"
                  min="1000"
                  max="50000"
                  step="1000"
                  value={filters.maxPrice}
                  onChange={(e)=>
                    setFilters({
                      ...filters,
                      maxPrice:e.target.value
                    })
                  }
                  className="w-full"
                />

              </div>


              {/* AMENITIES */}

              <div>

                <label className="text-sm text-gray-400 mb-2 block">
                  Amenity
                </label>

                <select
                  value={filters.amenity}
                  onChange={(e)=>
                    setFilters({
                      ...filters,
                      amenity:e.target.value
                    })
                  }
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2"
                >
                  <option value="">Any</option>
                  <option value="WiFi">WiFi</option>
                  <option value="AC">AC</option>
                  <option value="TV">TV</option>
                  <option value="Breakfast">Breakfast</option>
                </select>

              </div>


              <Button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black"
              >

                <Search size={16}/>
                Apply Filters

              </Button>

            </form>

          </div>

        </aside>



        {/* ROOM GRID */}

        <main className="lg:col-span-3">

          {error && (
            <Alert type="error" message={error}/>
          )}

          {loading ? (

            <LoadingSkeleton count={6}/>

          ) : filteredRooms.length === 0 ? (

            <div className="text-center text-gray-400 py-20">
              No rooms found
            </div>

          ) : (

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-10">

              {filteredRooms.map((room)=>(
                <RoomCard
                  key={room._id}
                  room={room}
                  onViewDetails={(id)=>navigate(`/rooms/${id}`)}
                  onBook={(id)=>navigate(`/book/${id}`)}
                />
              ))}

            </div>

          )}

        </main>

      </div>

    </div>

  );

}