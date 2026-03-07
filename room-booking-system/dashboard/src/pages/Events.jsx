import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, CalendarDays } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EventFormModal } from '@/components/EventFormModal';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { formatDate } from '@/utils/formatters';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/events');
      setEvents(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await api.delete(`/events/${id}`);
        toast.success('Event deleted');
        fetchEvents();
      } catch (error) {
        toast.error('Failed to delete event');
      }
    }
  };

  const handleTogglePublish = async (id, currentStatus) => {
    try {
      await api.patch(`/events/${id}/publish`, { isPublished: !currentStatus });
      toast.success(currentStatus ? 'Event unpublished' : 'Event published');
      fetchEvents();
    } catch (error) {
      toast.error('Failed to update publishing status');
    }
  };

  const openAddModal = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const filteredEvents = events.filter(e => 
    e.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events Management</h1>
          <p className="text-sm text-gray-500">Plan and manage upcoming hotel events and vlogs.</p>
        </div>
        <Button onClick={openAddModal}>
          <Plus className="w-5 h-5 mr-2" />
          Add Event
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b border-gray-200">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input 
                placeholder="Search events..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="p-0">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading events...</div>
            ) : filteredEvents.length === 0 ? (
              <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                <CalendarDays className="w-12 h-12 text-gray-300 mb-4" />
                <p>No events found. Add a new event to get started.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Details</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Media</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map((event) => (
                    <TableRow key={event._id}>
                      <TableCell>
                        <p className="font-medium text-gray-900 truncate max-w-[200px]">{event.title}</p>
                      </TableCell>
                      <TableCell>{formatDate(event.eventDate)}</TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleTogglePublish(event._id, event.isPublished)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors
                            ${event.isPublished ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                        >
                          {event.isPublished ? 'Published' : 'Draft'}
                        </button>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-gray-500">
                          {event.images?.length || 0} imgs • {event.vlogType !== 'none' ? '1 vid' : '0 vid'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditModal(event)}>
                            <Edit2 className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(event._id)}>
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      <EventFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        editingEvent={editingEvent}
        onSuccess={fetchEvents}
      />
    </div>
  );
}
