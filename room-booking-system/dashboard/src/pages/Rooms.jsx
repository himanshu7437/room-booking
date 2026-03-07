import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, BedDouble } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { RoomFormModal } from '@/components/RoomFormModal';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/utils/formatters';

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      // CHANGED: Fetch ALL rooms (no { isActive: true } filter)
      const res = await api.get('/rooms');
      setRooms(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch rooms');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
      try {
        await api.delete(`/rooms/${id}`);
        toast.success('Room deleted successfully');
        fetchRooms();
      } catch (error) {
        toast.error('Failed to delete room');
      }
    }
  };

  const openAddModal = () => {
    setEditingRoom(null);
    setIsModalOpen(true);
  };

  const openEditModal = (room) => {
    setEditingRoom(room);
    setIsModalOpen(true);
  };

  const filteredRooms = rooms.filter(room => 
    room.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.pricePerNight?.toString().includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rooms Management</h1>
          <p className="text-sm text-gray-500">Manage hotel rooms, pricing, and availability.</p>
        </div>
        <Button onClick={openAddModal}>
          <Plus className="w-5 h-5 mr-2" />
          Add Room
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b border-gray-200">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input 
                placeholder="Search rooms..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="p-0">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading rooms...</div>
            ) : filteredRooms.length === 0 ? (
              <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                <BedDouble className="w-12 h-12 text-gray-300 mb-4" />
                <p>No rooms found. Add a new room to get started.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Room Details</TableHead>
                    <TableHead>Price / Night</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Images</TableHead>
                    {/* NEW COLUMN */}
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRooms.map((room) => (
                    <TableRow key={room._id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{room.name}</p>
                          <p className="text-xs text-gray-500 capitalize max-w-xs truncate">
                            {room.amenities?.length ? room.amenities.join(', ') : 'No amenities'}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{formatCurrency(room.pricePerNight)}</TableCell>
                      <TableCell>{room.capacity} {room.capacity === 1 ? 'Person' : 'Persons'}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {room.images?.length || 0} Images
                        </span>
                      </TableCell>
                      {/* NEW STATUS COLUMN */}
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            room.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {room.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditModal(room)}>
                            <Edit2 className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(room._id)}>
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

      {/* Room Modal */}
      <RoomFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        editingRoom={editingRoom}
        onSuccess={fetchRooms}
      />
    </div>
  );
}