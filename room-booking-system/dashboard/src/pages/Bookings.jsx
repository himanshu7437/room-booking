import React, { useState, useEffect } from 'react';
import { Search, ClipboardList, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';
import api from '@/lib/api';
import { socket } from '@/lib/socket';
import toast from 'react-hot-toast';
import { formatDate } from '@/utils/formatters';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bookings');
      setBookings(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();

    // Socket.io for real-time updates
    socket.connect();
    socket.on('availabilityUpdate', () => {
      // Whenever availability updates (e.g. new booking), refresh the table
      fetchBookings();
    });

    return () => {
      socket.off('availabilityUpdate');
      socket.disconnect();
    };
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.put(`/bookings/${id}`, { status: newStatus });
      toast.success(`Booking marked as ${newStatus}`);
      fetchBookings();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.room?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const StatusBadge = ({ status }) => {
    switch (status) {
      case 'confirmed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Confirmed</span>;
      case 'cancelled':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" /> Cancelled</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" /> Pending</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bookings Management</h1>
        <p className="text-sm text-gray-500">View and manage customer reservations in real-time.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input 
                placeholder="Search by customer or room..." 
                className="pl-10 h-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="p-0">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading bookings...</div>
            ) : filteredBookings.length === 0 ? (
              <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                <ClipboardList className="w-12 h-12 text-gray-300 mb-4" />
                <p>No bookings found matching your filters.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Dates & Guests</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking._id}>
                      <TableCell>
                        <p className="font-medium text-gray-900">{booking.customer.name}</p>
                        <p className="text-xs text-gray-500">{booking.customer.email}</p>
                        <p className="text-xs text-gray-500">{booking.customer.phone}</p>
                      </TableCell>
                      <TableCell className="font-medium">{booking.room?.name || 'Unknown Room'}</TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-900">{formatDate(booking.checkIn)} to {formatDate(booking.checkOut)}</p>
                        <p className="text-xs text-gray-500">{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</p>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={booking.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <select
                          className="h-8 rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                          value={booking.status || 'pending'}
                          onChange={(e) => handleStatusUpdate(booking._id, e.target.value)}
                        >
                          <option value="pending">Mark Pending</option>
                          <option value="confirmed">Confirm</option>
                          <option value="cancelled">Cancel</option>
                        </select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
