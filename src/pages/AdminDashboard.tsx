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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Users, TrendingUp, Shield, Activity, Star, DollarSign, UserCheck } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  specialization: string;
  avatar: string;
  joinDate: string;
  totalSessions: number;
  status: 'active' | 'inactive';
  lastActive: string;
}

interface Mentor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  avatar: string;
  joinDate: string;
  totalStudents: number;
  rating: number;
  hourlyRate: number;
  status: 'active' | 'inactive' | 'pending';
  totalEarnings: number;
}

interface Meeting {
  id: string;
  studentName: string;
  mentorName: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  duration: number;
  specialization: string;
  amount: number;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'mentors' | 'meetings'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Mock data - replace with API calls
  useEffect(() => {
    const mockStudents: Student[] = [
      {
        id: '1',
        name: 'Alex Thompson',
        email: 'alex.thompson@example.com',
        specialization: 'Frontend Development',
        avatar: '/api/placeholder/40/40',
        joinDate: '2024-01-01',
        totalSessions: 12,
        status: 'active',
        lastActive: '2024-01-22'
      },
      {
        id: '2',
        name: 'Maria Garcia',
        email: 'maria.garcia@example.com',
        specialization: 'Backend Development',
        avatar: '/api/placeholder/40/40',
        joinDate: '2024-01-05',
        totalSessions: 8,
        status: 'active',
        lastActive: '2024-01-21'
      },
      {
        id: '3',
        name: 'David Kim',
        email: 'david.kim@example.com',
        specialization: 'Data Science',
        avatar: '/api/placeholder/40/40',
        joinDate: '2024-01-10',
        totalSessions: 15,
        status: 'active',
        lastActive: '2024-01-23'
      },
      {
        id: '4',
        name: 'Sarah Wilson',
        email: 'sarah.wilson@example.com',
        specialization: 'Mobile Development',
        avatar: '/api/placeholder/40/40',
        joinDate: '2024-01-15',
        totalSessions: 5,
        status: 'inactive',
        lastActive: '2024-01-18'
      }
    ];

    const mockMentors: Mentor[] = [
      {
        id: '1',
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@example.com',
        specialization: 'Frontend Development',
        avatar: '/api/placeholder/40/40',
        joinDate: '2024-01-01',
        totalStudents: 8,
        rating: 4.9,
        hourlyRate: 75,
        status: 'active',
        totalEarnings: 2250
      },
      {
        id: '2',
        name: 'Mike Chen',
        email: 'mike.chen@example.com',
        specialization: 'Backend Development',
        avatar: '/api/placeholder/40/40',
        joinDate: '2024-01-02',
        totalStudents: 6,
        rating: 4.8,
        hourlyRate: 65,
        status: 'active',
        totalEarnings: 1950
      },
      {
        id: '3',
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@example.com',
        specialization: 'Data Science',
        avatar: '/api/placeholder/40/40',
        joinDate: '2024-01-03',
        totalStudents: 10,
        rating: 4.7,
        hourlyRate: 70,
        status: 'active',
        totalEarnings: 2800
      },
      {
        id: '4',
        name: 'John Smith',
        email: 'john.smith@example.com',
        specialization: 'DevOps',
        avatar: '/api/placeholder/40/40',
        joinDate: '2024-01-20',
        totalStudents: 0,
        rating: 0,
        hourlyRate: 80,
        status: 'pending',
        totalEarnings: 0
      }
    ];

    const mockMeetings: Meeting[] = [
      {
        id: '1',
        studentName: 'Alex Thompson',
        mentorName: 'Dr. Sarah Johnson',
        date: '2024-01-25',
        time: '14:00',
        status: 'upcoming',
        duration: 60,
        specialization: 'Frontend Development',
        amount: 75
      },
      {
        id: '2',
        studentName: 'Maria Garcia',
        mentorName: 'Mike Chen',
        date: '2024-01-26',
        time: '10:00',
        status: 'upcoming',
        duration: 60,
        specialization: 'Backend Development',
        amount: 65
      },
      {
        id: '3',
        studentName: 'David Kim',
        mentorName: 'Emily Rodriguez',
        date: '2024-01-20',
        time: '15:00',
        status: 'completed',
        duration: 60,
        specialization: 'Data Science',
        amount: 70
      },
      {
        id: '4',
        studentName: 'Sarah Wilson',
        mentorName: 'Dr. Sarah Johnson',
        date: '2024-01-18',
        time: '11:00',
        status: 'cancelled',
        duration: 60,
        specialization: 'Frontend Development',
        amount: 75
      }
    ];

    setStudents(mockStudents);
    setMentors(mockMentors);
    setMeetings(mockMeetings);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === 'all' || student.status === statusFilter)
  );

  const filteredMentors = mentors.filter(mentor => 
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === 'all' || mentor.status === statusFilter)
  );

  const filteredMeetings = meetings.filter(meeting => 
    (meeting.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     meeting.mentorName.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'all' || meeting.status === statusFilter)
  );

  const totalRevenue = meetings.filter(m => m.status === 'completed').reduce((sum, m) => sum + m.amount, 0);
  const activeStudents = students.filter(s => s.status === 'active').length;
  const activeMentors = mentors.filter(m => m.status === 'active').length;
  const totalMeetings = meetings.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <Badge variant="destructive">Admin</Badge>
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.picture} />
                <AvatarFallback>{user?.name?.split(' ').map(n => n[0]).join('') || 'A'}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'students', label: 'All Students', icon: Users },
            { id: 'mentors', label: 'All Mentors', icon: UserCheck },
            { id: 'meetings', label: 'All Meetings', icon: Calendar }
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
            {/* Platform Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">{activeStudents}</p>
                      <p className="text-sm text-gray-600">Active Students</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">{activeMentors}</p>
                      <p className="text-sm text-gray-600">Active Mentors</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold">{totalMeetings}</p>
                      <p className="text-sm text-gray-600">Total Meetings</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">${totalRevenue}</p>
                      <p className="text-sm text-gray-600">Total Revenue</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {students.slice(0, 5).map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-gray-600">{student.specialization}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(student.status)}>
                          {student.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Meetings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {meetings.slice(0, 5).map((meeting) => (
                      <div key={meeting.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium">{meeting.studentName} → {meeting.mentorName}</p>
                            <p className="text-sm text-gray-600">{meeting.date} at {meeting.time}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(meeting.status)}>
                          {meeting.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <Card>
            <CardHeader>
              <CardTitle>All Students</CardTitle>
              <CardDescription>Manage and monitor all registered students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 mb-6">
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Total Sessions</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
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
                      <TableCell>{student.joinDate}</TableCell>
                      <TableCell>{student.totalSessions}</TableCell>
                      <TableCell>{student.lastActive}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(student.status)}>
                          {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Mentors Tab */}
        {activeTab === 'mentors' && (
          <Card>
            <CardHeader>
              <CardTitle>All Mentors</CardTitle>
              <CardDescription>Manage and monitor all registered mentors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 mb-6">
                <Input
                  placeholder="Search mentors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mentor</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Total Students</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Hourly Rate</TableHead>
                    <TableHead>Total Earnings</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMentors.map((mentor) => (
                    <TableRow key={mentor.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{mentor.name}</p>
                            <p className="text-sm text-gray-600">{mentor.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{mentor.specialization}</TableCell>
                      <TableCell>{mentor.joinDate}</TableCell>
                      <TableCell>{mentor.totalStudents}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span>{mentor.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>${mentor.hourlyRate}</TableCell>
                      <TableCell>${mentor.totalEarnings}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(mentor.status)}>
                          {mentor.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          {mentor.status === 'pending' && (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              Approve
                            </Button>
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

        {/* Meetings Tab */}
        {activeTab === 'meetings' && (
          <Card>
            <CardHeader>
              <CardTitle>All Meetings</CardTitle>
              <CardDescription>Monitor all scheduled and completed meetings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 mb-6">
                <Input
                  placeholder="Search meetings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Meeting</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMeetings.map((meeting) => (
                    <TableRow key={meeting.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium">{meeting.studentName}</p>
                            <p className="text-sm text-gray-600">→ {meeting.mentorName}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{meeting.date}</p>
                          <p className="text-sm text-gray-600">{meeting.time}</p>
                        </div>
                      </TableCell>
                      <TableCell>{meeting.duration} min</TableCell>
                      <TableCell>{meeting.specialization}</TableCell>
                      <TableCell>${meeting.amount}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(meeting.status)}>
                          {meeting.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </TableCell>
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

export default AdminDashboard;
