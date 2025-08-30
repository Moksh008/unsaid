import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, User, BookOpen, History, MapPin, Star, MessageCircle } from 'lucide-react';

interface Mentor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  experience: number;
  rating: number;
  avatar: string;
  bio: string;
  hourlyRate: number;
  availableSlots: string[];
}

interface Appointment {
  id: string;
  mentorName: string;
  mentorSpecialization: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  duration: number;
  notes: string;
}

const MenteeDashboard = () => {
  const { user } = useAuth();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'mentors' | 'appointments' | 'history'>('overview');

  // Mock data - replace with API calls
  useEffect(() => {
    const mockMentors: Mentor[] = [
      {
        id: '1',
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@example.com',
        specialization: 'Frontend Development',
        experience: 8,
        rating: 4.9,
        avatar: '/api/placeholder/40/40',
        bio: 'Senior Frontend Developer with expertise in React, Vue, and modern CSS frameworks.',
        hourlyRate: 75,
        availableSlots: ['09:00', '10:00', '14:00', '15:00']
      },
      {
        id: '2',
        name: 'Mike Chen',
        email: 'mike.chen@example.com',
        specialization: 'Backend Development',
        experience: 6,
        rating: 4.8,
        avatar: '/api/placeholder/40/40',
        bio: 'Full-stack developer specializing in Node.js, Python, and database design.',
        hourlyRate: 65,
        availableSlots: ['11:00', '13:00', '16:00', '17:00']
      },
      {
        id: '3',
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@example.com',
        specialization: 'Data Science',
        experience: 5,
        rating: 4.7,
        avatar: '/api/placeholder/40/40',
        bio: 'Data Scientist with experience in Python, R, and machine learning algorithms.',
        hourlyRate: 70,
        availableSlots: ['10:00', '12:00', '15:00', '16:00']
      }
    ];

    const mockAppointments: Appointment[] = [
      {
        id: '1',
        mentorName: 'Dr. Sarah Johnson',
        mentorSpecialization: 'Frontend Development',
        date: '2024-01-25',
        time: '14:00',
        status: 'upcoming',
        duration: 60,
        notes: 'Discuss React performance optimization'
      },
      {
        id: '2',
        mentorName: 'Mike Chen',
        mentorSpecialization: 'Backend Development',
        date: '2024-01-20',
        time: '11:00',
        status: 'completed',
        duration: 60,
        notes: 'API design review session'
      }
    ];

    setMentors(mockMentors);
    setAppointments(mockAppointments);
  }, []);

  const handleBookAppointment = () => {
    if (!selectedMentor || !bookingDate || !bookingTime) return;

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      mentorName: selectedMentor.name,
      mentorSpecialization: selectedMentor.specialization,
      date: bookingDate,
      time: bookingTime,
      status: 'upcoming',
      duration: 60,
      notes: bookingNotes
    };

    setAppointments([...appointments, newAppointment]);
    setSelectedMentor(null);
    setBookingDate('');
    setBookingTime('');
    setBookingNotes('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Mentee Dashboard</h1>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">Mentee</Badge>
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.picture} />
                <AvatarFallback>{user?.name?.split(' ').map(n => n[0]).join('') || 'M'}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: BookOpen },
            { id: 'mentors', label: 'Find Mentors', icon: User },
            { id: 'appointments', label: 'My Appointments', icon: Calendar },
            { id: 'history', label: 'History', icon: History }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* User Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Your Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user?.picture} />
                    <AvatarFallback>{user?.name?.split(' ').map(n => n[0]).join('') || 'M'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{user?.name}</h3>
                    <p className="text-gray-600">{user?.email}</p>
                    <p className="text-sm text-gray-500">Member since {new Date(user?.createdAt || '').toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">{appointments.filter(a => a.status === 'upcoming').length}</p>
                      <p className="text-sm text-gray-600">Upcoming Sessions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <History className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">{appointments.filter(a => a.status === 'completed').length}</p>
                      <p className="text-sm text-gray-600">Completed Sessions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <User className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold">{mentors.length}</p>
                      <p className="text-sm text-gray-600">Available Mentors</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {appointments.slice(0, 3).map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium">{appointment.mentorName}</p>
                          <p className="text-sm text-gray-600">{appointment.date} at {appointment.time}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Mentors Tab */}
        {activeTab === 'mentors' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Mentors</CardTitle>
                <CardDescription>Find and book sessions with experienced mentors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mentors.map((mentor) => (
                    <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <Avatar className="h-16 w-16 mx-auto mb-4">
                            <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <h3 className="font-semibold text-lg mb-2">{mentor.name}</h3>
                          <p className="text-gray-600 mb-2">{mentor.specialization}</p>
                          <div className="flex items-center justify-center space-x-1 mb-3">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{mentor.rating}</span>
                            <span className="text-sm text-gray-500">({mentor.experience} years)</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{mentor.bio}</p>
                          <p className="text-lg font-semibold text-blue-600 mb-4">${mentor.hourlyRate}/hour</p>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                onClick={() => setSelectedMentor(mentor)}
                                className="w-full"
                              >
                                Book Session
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Book Session with {mentor.name}</DialogTitle>
                                <DialogDescription>
                                  Schedule a mentoring session
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="date">Date</Label>
                                  <Input
                                    id="date"
                                    type="date"
                                    value={bookingDate}
                                    onChange={(e) => setBookingDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="time">Time</Label>
                                  <Select value={bookingTime} onValueChange={setBookingTime}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {mentor.availableSlots.map((slot) => (
                                        <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor="notes">Notes (Optional)</Label>
                                  <Textarea
                                    id="notes"
                                    placeholder="What would you like to discuss?"
                                    value={bookingNotes}
                                    onChange={(e) => setBookingNotes(e.target.value)}
                                  />
                                </div>
                                <Button onClick={handleBookAppointment} className="w-full">
                                  Confirm Booking
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <Card>
            <CardHeader>
              <CardTitle>My Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mentor</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.filter(a => a.status === 'upcoming').map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{appointment.mentorName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{appointment.mentorName}</p>
                            <p className="text-sm text-gray-600">{appointment.mentorSpecialization}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{appointment.date}</p>
                          <p className="text-sm text-gray-600">{appointment.time}</p>
                        </div>
                      </TableCell>
                      <TableCell>{appointment.duration} min</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{appointment.notes}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Reschedule
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <Card>
            <CardHeader>
              <CardTitle>Session History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mentor</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.filter(a => a.status === 'completed').map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{appointment.mentorName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{appointment.mentorName}</p>
                            <p className="text-sm text-gray-600">{appointment.mentorSpecialization}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{appointment.date}</p>
                          <p className="text-sm text-gray-600">{appointment.time}</p>
                        </div>
                      </TableCell>
                      <TableCell>{appointment.duration} min</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{appointment.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MenteeDashboard;
