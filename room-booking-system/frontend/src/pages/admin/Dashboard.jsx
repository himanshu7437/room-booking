import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { DoorOpen, Users, Calendar, Home } from "lucide-react";
import { AuthContext } from "../../contexts/AuthContext";
import { Loading, LoadingSkeleton } from "../../components/ui/Loading";
import Card, { CardBody } from "../../components/ui/Card";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { roomsApi, bookingsApi, eventsApi } from "../../lib/api.js";

export default function AdminDashboard() {
  const { admin, loading } = useContext(AuthContext);

  const [stats, setStats] = useState([]);
  const [latestRooms, setLatestRooms] = useState([]);
  const [latestBookings, setLatestBookings] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [roomsRes, bookingsRes, eventsRes] = await Promise.all([
          roomsApi.getList(),
          bookingsApi.getAll(),
          eventsApi.getList(),
        ]);

        const roomsData = roomsRes.data?.data || roomsRes.data || [];
        const bookingsData = bookingsRes.data?.data || bookingsRes.data || [];
        const eventsData = eventsRes.data?.data || eventsRes.data || [];

        const totalRooms = roomsData.length;
        const totalBookings = bookingsData.length;
        const revenue = bookingsData.reduce((sum, b) => sum + (b.total || 0), 0);

        const upcoming = eventsData
          .filter((e) => new Date(e.eventDate) >= new Date())
          .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));

        setStats([
          {
            icon: <DoorOpen className="w-7 h-7 text-yellow-500" />,
            label: "Total Rooms",
            value: totalRooms,
            description: "Active rooms",
          },
          {
            icon: <Users className="w-7 h-7 text-blue-500" />,
            label: "Bookings",
            value: totalBookings,
            description: "All time",
          },
          {
            icon: <Calendar className="w-7 h-7 text-green-500" />,
            label: "Upcoming Events",
            value: upcoming.length,
            description: "Next 30 days",
          },
          {
            icon: <Home className="w-7 h-7 text-purple-500" />,
            label: "Revenue",
            value: `$${revenue.toLocaleString()}`,
            description: "Total revenue",
          },
        ]);

        setLatestRooms(roomsData.slice(-5).reverse());
        setLatestBookings(bookingsData.slice(-5).reverse());
        setUpcomingEvents(upcoming.slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <Loading />;
  if (!admin) return <Navigate to="/admin/login" replace />;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 md:ml-64">
        <div className="max-w-7xl mx-auto space-y-4">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Welcome back, {admin.name || "Admin"}!
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {loadingStats
              ? [...Array(4)].map((_, i) => (
                  <Card key={i} className="h-24 animate-pulse bg-gray-200 rounded-lg shadow-sm" />
                ))
              : stats.map((stat, idx) => (
                  <Card key={idx} className="bg-white rounded-lg shadow hover:shadow-md border-l-4 border-yellow-500 transition-all">
                    <CardBody className="flex items-center gap-3 p-3">
                      <div className="p-2 bg-yellow-100 rounded-full">{stat.icon}</div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mt-0.5">{stat.value}</h3>
                        <p className="text-xs text-gray-400">{stat.description}</p>
                      </div>
                    </CardBody>
                  </Card>
                ))}
          </div>

          {/* Tables Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Latest Rooms */}
            <Card className="shadow rounded-lg border border-gray-200">
              <div className="px-3 py-2 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900 text-sm sm:text-base">Latest Rooms</h2>
              </div>
              <CardBody className="p-2">
                {loadingStats ? <LoadingSkeleton count={5} /> :
                  latestRooms?.length ? (
                    <ul className="divide-y divide-gray-200 text-sm text-gray-700">
                      {latestRooms.map((room) => (
                        <li key={room._id} className="py-1 px-2 flex justify-between items-center hover:bg-gray-50 rounded transition">
                          <span className="font-medium">{room.name}</span>
                          <span className="text-gray-400 text-xs sm:text-sm">{room.type}</span>
                        </li>
                      ))}
                    </ul>
                  ) : <p className="text-gray-400 text-sm">No rooms found.</p>
                }
              </CardBody>
            </Card>

            {/* Latest Bookings */}
            <Card className="shadow rounded-lg border border-gray-200">
              <div className="px-3 py-2 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900 text-sm sm:text-base">Latest Bookings</h2>
              </div>
              <CardBody className="p-2">
                {loadingStats ? <LoadingSkeleton count={5} /> :
                  latestBookings?.length ? (
                    <ul className="divide-y divide-gray-200 text-sm text-gray-700">
                      {latestBookings.map((b) => (
                        <li key={b._id} className="py-1 px-2 flex justify-between items-center hover:bg-gray-50 rounded transition">
                          <span className="font-medium">{b.guestName || "Guest"}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${b.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                            {b.status}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : <p className="text-gray-400 text-sm">No bookings found.</p>
                }
              </CardBody>
            </Card>

            {/* Upcoming Events */}
            <Card className="shadow rounded-lg border border-gray-200">
              <div className="px-3 py-2 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900 text-sm sm:text-base">Upcoming Events</h2>
              </div>
              <CardBody className="p-2">
                {loadingStats ? <LoadingSkeleton count={5} /> :
                  upcomingEvents?.length ? (
                    <ul className="divide-y divide-gray-200 text-sm text-gray-700">
                      {upcomingEvents.map((e) => (
                        <li key={e._id} className="py-1 px-2 flex justify-between items-center hover:bg-gray-50 rounded transition">
                          <span className="font-medium">{e.title}</span>
                          <span className="text-gray-400 text-xs sm:text-sm">{new Date(e.eventDate).toLocaleDateString()}</span>
                        </li>
                      ))}
                    </ul>
                  ) : <p className="text-gray-400 text-sm">No upcoming events.</p>
                }
              </CardBody>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="shadow rounded-lg border border-gray-200">
            <div className="px-3 py-2 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <CardBody className="space-y-1 text-gray-600 p-2 sm:p-3">
              <ul className="list-disc pl-5 text-sm sm:text-base space-y-1">
                <li>Manage room listings and inventory</li>
                <li>Create and publish events</li>
                <li>View and manage bookings</li>
                <li>Monitor real-time availability</li>
              </ul>
            </CardBody>
          </Card>

        </div>
      </main>
    </div>
  );
}