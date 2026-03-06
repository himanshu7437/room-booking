import { useEffect, useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { Plus, Edit, Trash2, DollarSign, Users } from "lucide-react";
import { AuthContext } from "../../contexts/AuthContext";
import { LoadingSkeleton } from "../../components/ui/Loading";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { Alert } from "../../components/ui/Alert";
import { roomsApi } from "../../lib/api";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import AdminSidebar from "../../components/admin/AdminSidebar";
import RoomFormModal from "../../components/admin/RoomFormModal";

export default function AdminRooms() {
  const { admin, loading: authLoading } = useContext(AuthContext);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  useEffect(() => {
    if (!authLoading && admin) {
      fetchRooms();
    }
  }, [authLoading, admin]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await roomsApi.getList();
      setRooms(response.data?.data || response.data || []);
    } catch (err) {
      setError("Failed to load rooms. Please try again.");
      console.error("Rooms fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this room permanently? This cannot be undone.")) return;

    try {
      await roomsApi.delete(id);
      setRooms((prev) => prev.filter((r) => r._id !== id));
      showSuccessToast("Room deleted successfully");
    } catch (err) {
      showErrorToast(err.response?.data?.message || "Failed to delete room");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSkeleton count={1} height="h-96" />
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Fixed Sidebar */}
      <div className="hidden lg:block lg:w-72 lg:flex-shrink-0 border-r border-gray-200 bg-white overflow-y-auto">
        <AdminSidebar />
      </div>

      {/* Scrollable Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Rooms Management
              </h1>
              <p className="mt-1.5 text-gray-600">
                Manage room inventory, pricing, photos, and availability
              </p>
            </div>

            <Button
              variant="primary"
              size="lg"
              icon={<Plus size={18} />}
              onClick={() => {
                setEditingRoom(null);
                setShowForm(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 px-6 py-3 rounded-xl font-medium whitespace-nowrap"
            >
              Add New Room
            </Button>
          </div>

          {/* Error */}
          {error && (
            <Alert
              type="error"
              title="Error"
              message={error}
              className="mb-8"
              onClose={() => setError(null)}
            />
          )}

          {/* Rooms Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="animate-pulse">
                    <div className="h-48 bg-gray-200" />
                    <div className="p-6 space-y-4">
                      <div className="h-7 bg-gray-300 rounded w-4/5" />
                      <div className="h-4 bg-gray-200 rounded w-full" />
                      <div className="flex gap-6">
                        <div className="h-5 bg-gray-200 rounded w-16" />
                        <div className="h-5 bg-gray-200 rounded w-20" />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : rooms.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="mx-auto w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                <Users className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                No Rooms Added Yet
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Start building your inventory — add photos, pricing, capacity, and amenities.
              </p>
              <Button
                variant="primary"
                icon={<Plus size={18} />}
                onClick={() => {
                  setEditingRoom(null);
                  setShowForm(true);
                }}
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 px-8 py-4 rounded-xl"
              >
                Add Your First Room
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <Card
                  key={room._id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 rounded-2xl group bg-white"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    {room.images?.[0] ? (
                      <img
                        src={room.images[0]}
                        alt={room.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-teal-50">
                        <Users className="w-16 h-16 text-indigo-300" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {room.name}
                      </h3>
                      <span className="text-lg font-bold text-indigo-600">
                        ${room.pricePerNight}
                        <span className="text-sm font-normal text-gray-500">/night</span>
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-5 line-clamp-2 min-h-[2.5rem]">
                      {room.description}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                      <div className="flex items-center gap-1.5">
                        <Users size={16} />
                        <span>Up to {room.capacity} guests</span>
                      </div>
                      {room.amenities?.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs bg-teal-50 text-teal-700 px-2.5 py-0.5 rounded-full">
                            {room.amenities[0]}
                          </span>
                          {room.amenities.length > 1 && (
                            <span className="text-xs text-gray-500">+{room.amenities.length - 1}</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-auto">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<Edit size={16} />}
                        onClick={() => {
                          setEditingRoom(room);
                          setShowForm(true);
                        }}
                        className="flex-1 shadow-sm hover:shadow transition-all duration-200"
                      >
                        Edit
                      </Button>

                      <Button
                        variant="danger-outline"
                        size="sm"
                        icon={<Trash2 size={16} />}
                        onClick={() => handleDelete(room._id)}
                        className="flex-1 shadow-sm hover:shadow transition-all duration-200"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <RoomFormModal
          room={editingRoom}
          onClose={() => {
            setShowForm(false);
            setEditingRoom(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setEditingRoom(null);
            fetchRooms();
          }}
        />
      )}
    </div>
  );
}