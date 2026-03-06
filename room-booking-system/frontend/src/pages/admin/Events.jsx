import { useEffect, useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { Plus, Edit, Trash2, Eye, EyeOff, CalendarDays } from "lucide-react";
import { AuthContext } from "../../contexts/AuthContext";
import { LoadingSkeleton } from "../../components/ui/Loading";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { Alert } from "../../components/ui/Alert";
import { eventsApi } from "../../lib/api";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import { formatDate } from "../../utils/helpers";
import AdminSidebar from "../../components/admin/AdminSidebar";
import EventFormModal from "../../components/admin/EventFormModal";

export default function AdminEvents() {
  const { admin, loading: authLoading } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    if (!authLoading && admin) {
      fetchEvents();
    }
  }, [authLoading, admin]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventsApi.getList();
      setEvents(response.data?.data || response.data || []);
    } catch (err) {
      setError("Failed to load events. Please try again.");
      console.error("Events fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishToggle = async (event) => {
    try {
      await eventsApi.publish(event._id);
      setEvents((prev) =>
        prev.map((e) =>
          e._id === event._id ? { ...e, published: !e.published } : e
        )
      );
      showSuccessToast(event.published ? "Event unpublished" : "Event published");
    } catch (err) {
      showErrorToast("Failed to update publish status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event permanently?")) return;

    try {
      await eventsApi.delete(id);
      setEvents((prev) => prev.filter((e) => e._id !== id));
      showSuccessToast("Event deleted successfully");
    } catch (err) {
      showErrorToast(err.response?.data?.message || "Failed to delete event");
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
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Fixed Sidebar */}
      <div className="hidden lg:block lg:w-72 lg:flex-shrink-0 border-r border-gray-200 bg-white overflow-y-auto">
        <AdminSidebar />
      </div>

      {/* Scrollable Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Events Management
              </h1>
              <p className="mt-1.5 text-gray-600">
                Create, publish, and manage upcoming hotel events and promotions
              </p>
            </div>

            <Button
              variant="primary"
              size="lg"
              icon={<Plus size={18} />}
              onClick={() => {
                setEditingEvent(null);
                setShowForm(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 whitespace-nowrap px-6 py-3 rounded-xl font-medium"
            >
              Create New Event
            </Button>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert
              type="error"
              title="Error"
              message={error}
              className="mb-8"
              onClose={() => setError(null)}
            />
          )}

          {/* Events Grid */}
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
          ) : events.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="mx-auto w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                <CalendarDays className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                No Events Added Yet
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Start creating exciting events for your guests — promotions, weddings, live music, and more.
              </p>
              <Button
                variant="primary"
                icon={<Plus size={18} />}
                onClick={() => {
                  setEditingEvent(null);
                  setShowForm(true);
                }}
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 px-8 py-4 rounded-xl"
              >
                Create Your First Event
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card
                  key={event._id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 rounded-2xl group bg-white"
                >
                  {/* Image / Media */}
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    {event.images?.[0] ? (
                      <img
                        src={event.images[0]}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-teal-50">
                        <CalendarDays className="w-16 h-16 text-indigo-300" />
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                          event.published
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {event.published ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {event.title}
                    </h3>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays size={16} />
                        {formatDate(event.eventDate, "MMM dd, yyyy")}
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-3 mb-6 min-h-[4.5rem]">
                      {event.description}
                    </p>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 mt-4">
                      <Button
                        variant={event.published ? "secondary" : "primary"}
                        size="sm"
                        icon={event.published ? <EyeOff size={16} /> : <Eye size={16} />}
                        onClick={() => handlePublishToggle(event)}
                        className="flex-1 min-w-[110px] shadow-sm hover:shadow transition-all"
                      >
                        {event.published ? "Unpublish" : "Publish"}
                      </Button>

                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<Edit size={16} />}
                        onClick={() => {
                          setEditingEvent(event);
                          setShowForm(true);
                        }}
                        className="flex-1 min-w-[110px] shadow-sm hover:shadow transition-all"
                      >
                        Edit
                      </Button>

                      <Button
                        variant="danger-outline"
                        size="sm"
                        icon={<Trash2 size={16} />}
                        onClick={() => handleDelete(event._id)}
                        className="flex-1 min-w-[110px] shadow-sm hover:shadow transition-all"
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
        <EventFormModal
          event={editingEvent}
          onClose={() => {
            setShowForm(false);
            setEditingEvent(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setEditingEvent(null);
            fetchEvents();
          }}
        />
      )}
    </div>
  );
}