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
import { Calendar, Clock, User, BookOpen, History, Users, Star, MessageCircle, TrendingUp } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  specialization: string;
  avatar: string;
  totalSessions: number;
  lastSession: string;
  rating: number;
}

interface Appointment {
  id: string;
  studentName: string;
  studentEmail: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  duration: number;
  notes: string;
  specialization: string;
}

const MentorDashboard = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'students' | 'history'>('overview');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [sessionNotes, setSessionNotes] = useState('');

  // Mock data - replace with API calls
  useEffect(() => {
    const mockStudents: Student[] = [
      {
        id: '1',
        name: 'Alex Thompson',
        email: 'alex.thompson@example.com',
        specialization: 'Frontend Development',
        avatar: '/api/placeholder/40/40',
        totalSessions: 12,
        lastSession: '2024-01-20',
        rating: 4.8
      },
      {
        id: '2',
        name: 'Maria Garcia',
        email: 'maria.garcia@example.com',
        specialization: 'Backend Development',
        avatar: '/api/placeholder/40/40',
        totalSessions: 8,
        lastSession: '2024-01-18',
        rating: 4.9
      },
      {
        id: '3',
        name: 'David Kim',
        email: 'david.kim@example.com',
        specialization: 'Data Science',
        avatar: '/api/placeholder/40/40',
        totalSessions: 15,
        lastSession: '2024-01-22',
        rating: 4.7
      }
    ];

    const mockAppointments: Appointment[] = [
      {
        id: '1',
        studentName: 'Alex Thompson',
        studentEmail: 'alex.thompson@example.com',
        date: '2024-01-25',
        time: '14:00',
        status: 'upcoming',
        duration: 60,
        notes: 'Discuss React performance optimization',
        specialization: 'Frontend Development'
      },
      {
        id: '2',
        studentName: 'Maria Garcia',
        studentEmail: 'maria.garcia@example.com',
        date: '2024-01-26',
        time: '10:00',
        status: 'upcoming',
        duration: 60,
        notes: 'API design review session',
        specialization: 'Backend Development'
      },
      {
        id: '3',
        studentName: 'David Kim',
        studentEmail: 'david.kim@example.com',
        date: '2024-01-20',
        time: '15:00',
        status: 'completed',
        duration: 60,
        notes: 'Machine learning model review',
        specialization: 'Data Science'
      }
    ];

    setStudents(mockStudents);
    setAppointments(mockAppointments);
  }, []);

  const handleCompleteSession = (appointmentId: string) => {
    setAppointments(appointments.map(apt => 
      apt.id === appointmentId 
        ? { ...apt, status: 'completed' as const }
        : apt
    ));
  };

  const handleCancelSession = (appointmentId: string) => {
    setAppointments(appointments.map(apt => 
      apt.id === appointmentId 
        ? { ...apt, status: 'cancelled' as const }
        : apt
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const upcomingAppointments = appointments.filter(a => a.status === 'upcoming');
  const completedAppointments = appointments.filter(a => a.status === 'completed');
  const totalEarnings = completedAppointments.length * 75; // Assuming $75 per session

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Mentor Dashboard</h1>
            <div className="flex items-center space-x-4">
              <Badge variant="default">Mentor</Badge>
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
            { id: 'appointments', label: 'Appointments', icon: Calendar },
            { id: 'students', label: 'My Students', icon: Users },
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
            {/* Mentor Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Your Mentor Profile
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
                    <p className="text-sm text-gray-500">Mentor since {new Date(user?.createdAt || '').toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">{upcomingAppointments.length}</p>
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
                      <p className="text-2xl font-bold">{completedAppointments.length}</p>
                      <p className="text-sm text-gray-600">Completed Sessions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Users className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold">{students.length}</p>
                      <p className="text-sm text-gray-600">Active Students</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">${totalEarnings}</p>
                      <p className="text-sm text-gray-600">Total Earnings</p>
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
                          <p className="font-medium">{appointment.studentName}</p>
                          <p className="text-sm text-gray-600">{appointment.date} at {appointment.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                        {appointment.status === 'upcoming' && (
                          <Button size="sm" variant="outline" onClick={() => handleCompleteSession(appointment.id)}>
                            Complete
                          </Button>
                        )}
                      </div>
                    </div>
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
              <CardTitle>Appointments</CardTitle>
              <CardDescription>Manage your upcoming and completed sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{appointment.studentName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{appointment.studentName}</p>
                            <p className="text-sm text-gray-600">{appointment.studentEmail}</p>
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
                      <TableCell>{appointment.specialization}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{appointment.notes}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {appointment.status === 'upcoming' && (
                            <>
                              <Button 
                                size="sm" 
                                onClick={() => handleCompleteSession(appointment.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Complete
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleCancelSession(appointment.id)}
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                          {appointment.status === 'completed' && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  Add Notes
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Add Session Notes</DialogTitle>
                                  <DialogDescription>
                                    Add notes about the completed session
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="notes">Session Notes</Label>
                                    <Textarea
                                      id="notes"
                                      placeholder="How did the session go? What was discussed?"
                                      value={sessionNotes}
                                      onChange={(e) => setSessionNotes(e.target.value)}
                                    />
                                  </div>
                                  <Button onClick={() => setSessionNotes('')} className="w-full">
                                    Save Notes
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <Card>
            <CardHeader>
              <CardTitle>My Students</CardTitle>
              <CardDescription>View all students you've mentored</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Total Sessions</TableHead>
                    <TableHead>Last Session</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-gray-600">{student.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{student.specialization}</TableCell>
                      <TableCell>{student.totalSessions}</TableCell>
                      <TableCell>{student.lastSession}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span>{student.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          View Profile
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
              <CardDescription>View all completed and cancelled sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.filter(a => a.status !== 'upcoming').map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{appointment.studentName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{appointment.studentName}</p>
                            <p className="text-sm text-gray-600">{appointment.studentEmail}</p>
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
                      <TableCell>{appointment.specialization}</TableCell>
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

export default MentorDashboard;
