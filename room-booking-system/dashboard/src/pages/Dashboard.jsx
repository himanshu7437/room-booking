import React, { useState, useEffect } from 'react';
import { Users, BedDouble, CalendarDays, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { formatCurrency, formatDate } from '@/utils/formatters';

const StatsCard = ({ title, value, icon: Icon, colorClass }) => (
  <Card>
    <CardContent className="p-6 flex items-center gap-4">
      <div className={`p-4 rounded-xl ${colorClass}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
      </div>
    </CardContent>
  </Card>
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalRooms: 0,
    activeBookings: 0,
    upcomingEvents: 0,
    revenue: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // In a real app, there might be a specific /dashboard endpoint. 
      // Assuming we need to fetch from individual endpoints for now:
      const [roomsRes, bookingsRes, eventsRes] = await Promise.all([
        api.get('/rooms').catch(() => ({ data: [] })),
        api.get('/bookings').catch(() => ({ data: [] })),
        api.get('/events').catch(() => ({ data: [] })),
      ]);

      const rooms = roomsRes.data.data || [];
      const bookings = bookingsRes.data.data || [];
      const events = eventsRes.data.data || [];

      // Calculate stats
      const activeBookings = bookings.filter(b => b.status === 'confirmed').length;
      const revenue = bookings
        .filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
      
      const upcomingEvents = events.filter(e => new Date(e.eventDate) > new Date()).length;

      setStats({
        totalRooms: rooms.length,
        activeBookings,
        upcomingEvents,
        revenue,
      });

      // Get 5 most recent
      setRecentBookings(bookings.slice(0, 5));
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse flex items-center justify-center py-20">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-500">Welcome back. Here is what is happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => navigate('/rooms')}>Add Room</Button>
          <Button variant="secondary" onClick={() => navigate('/events')}>Add Event</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Rooms" 
          value={stats.totalRooms} 
          icon={BedDouble} 
          colorClass="bg-indigo-500" 
        />
        <StatsCard 
          title="Active Bookings" 
          value={stats.activeBookings} 
          icon={Users} 
          colorClass="bg-teal-500" 
        />
        <StatsCard 
          title="Upcoming Events" 
          value={stats.upcomingEvents} 
          icon={CalendarDays} 
          colorClass="bg-orange-500" 
        />
        <StatsCard 
          title="Total Revenue" 
          value={formatCurrency(stats.revenue)} 
          icon={DollarSign} 
          colorClass="bg-emerald-500" 
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {recentBookings.length === 0 ? (
            <p className="text-gray-500 py-4 text-center">No recent bookings found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBookings.map((booking, idx) => (
                  <TableRow key={booking._id || idx}>
                    <TableCell className="font-medium">{booking.customer.name || 'N/A'}</TableCell>
                    <TableCell>{booking.room?.name || 'N/A'}</TableCell>
                    <TableCell>
                      {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {booking.status || 'pending'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
