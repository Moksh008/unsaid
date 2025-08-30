import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Loader2, Mail, Lock, Chrome, User, Shield, Users, GraduationCap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RoleBasedLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const { login, loginWithGoogle, signup, isAuthenticated, dashboardUrl } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate(dashboardUrl);
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
      navigate(dashboardUrl);
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await signup(email, password, name);
      toast({
        title: "Success",
        description: "Account created successfully!",
      });
      navigate(dashboardUrl);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async (action: 'login' | 'signup') => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      toast({
        title: "Success",
        description: `${action === 'login' ? 'Logged in' : 'Signed up'} with Google successfully!`,
      });
      navigate(dashboardUrl);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} with Google`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'admin':
        return {
          title: 'Admin Access',
          description: 'Full system control and user management',
          icon: Shield,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
        };
      case 'mentor':
        return {
          title: 'Mentor Access',
          description: 'Guide students and manage sessions',
          icon: Users,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
        };
      case 'mentee':
        return {
          title: 'Student Access',
          description: 'Learn from mentors and track progress',
          icon: GraduationCap,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
        };
      default:
        return {
          title: 'User Access',
          description: 'Standard user functionality',
          icon: User,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
        };
    }
  };

  const roleInfo = getRoleInfo('user');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left side - Role Information */}
        <div className="space-y-6">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to Pulse Robot
            </h1>
            <p className="text-lg text-gray-600">
              Choose your role and get started with your learning journey
            </p>
          </div>

          <div className="space-y-4">
            {/* Admin Role */}
            <div className={`p-6 rounded-lg border-2 ${getRoleInfo('admin').bgColor} border-red-200`}>
              <div className="flex items-center space-x-3 mb-2">
                <Shield className={`h-6 w-6 ${getRoleInfo('admin').color}`} />
                <h3 className="text-lg font-semibold text-gray-900">Admin</h3>
              </div>
              <p className="text-gray-600 mb-3">Full system control and user management</p>
              <div className="text-sm text-gray-500">
                <p>• Manage all users and roles</p>
                <p>• Monitor system performance</p>
                <p>• Access analytics and reports</p>
              </div>
            </div>

            {/* Mentor Role */}
            <div className={`p-6 rounded-lg border-2 ${getRoleInfo('mentor').bgColor} border-blue-200`}>
              <div className="flex items-center space-x-3 mb-2">
                <Users className={`h-6 w-6 ${getRoleInfo('mentor').color}`} />
                <h3 className="text-lg font-semibold text-gray-900">Mentor</h3>
              </div>
              <p className="text-gray-600 mb-3">Guide students and manage sessions</p>
              <div className="text-sm text-gray-500">
                <p>• Schedule mentoring sessions</p>
                <p>• Track student progress</p>
                <p>• Manage your availability</p>
              </div>
            </div>

            {/* Mentee Role */}
            <div className={`p-6 rounded-lg border-2 ${getRoleInfo('mentee').bgColor} border-green-200`}>
              <div className="flex items-center space-x-3 mb-2">
                <GraduationCap className={`h-6 w-6 ${getRoleInfo('mentee').color}`} />
                <h3 className="text-lg font-semibold text-gray-900">Student</h3>
              </div>
              <p className="text-gray-600 mb-3">Learn from mentors and track progress</p>
              <div className="text-sm text-gray-500">
                <p>• Book sessions with mentors</p>
                <p>• Track your learning progress</p>
                <p>• Access learning resources</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Authentication Forms */}
        <Card className="w-full">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Get Started</CardTitle>
            <CardDescription>
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => handleGoogleAuth('login')}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Chrome className="mr-2 h-4 w-4" />
                  )}
                  Google
                </Button>
              </TabsContent>

              {/* Signup Tab */}
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => handleGoogleAuth('signup')}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Chrome className="mr-2 h-4 w-4" />
                  )}
                  Google
                </Button>
              </TabsContent>
            </Tabs>

            {/* Quick Login Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Quick Login Info</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Admin:</strong> unsaidtalkstech2@gmail.com</p>
                <p><strong>Mentor:</strong> mokshkulshrestha@gmail.com</p>
                <p><strong>Student:</strong> mokshkulshrestha19@gmail.com</p>
                <p className="text-xs mt-2">Use any password for demo purposes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RoleBasedLogin;
