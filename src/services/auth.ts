// Simple authentication service
// This can be extended with real Google OAuth implementation

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: any;
  error?: string;
}

// Mock authentication service
export class AuthService {
  private static instance: AuthService;
  private users: Map<string, any> = new Map();

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation - in real app, this would call your backend
    if (credentials.email && credentials.password) {
      const user = {
        id: `user_${Date.now()}`,
        email: credentials.email,
        name: credentials.email.split('@')[0],
        role: this.determineUserRole(credentials.email),
        createdAt: new Date(),
      };
      
      this.users.set(credentials.email, user);
      
      return {
        success: true,
        user,
      };
    }
    
    return {
      success: false,
      error: 'Invalid credentials',
    };
  }

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation - in real app, this would call your backend
    if (credentials.email && credentials.password && credentials.name) {
      const user = {
        id: `user_${Date.now()}`,
        email: credentials.email,
        name: credentials.name,
        role: this.determineUserRole(credentials.email),
        createdAt: new Date(),
      };
      
      this.users.set(credentials.email, user);
      
      return {
        success: true,
        user,
      };
    }
    
    return {
      success: false,
      error: 'Invalid signup data',
    };
  }

  async loginWithGoogle(): Promise<AuthResponse> {
    // Simulate Google OAuth delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock Google user data - in real app, this would come from Google OAuth
    const user = {
      id: `google_user_${Date.now()}`,
      email: 'user@gmail.com',
      name: 'Google User',
      picture: 'https://via.placeholder.com/150',
      role: 'mentee', // Default role for Google users
      createdAt: new Date(),
    };
    
    return {
      success: true,
      user,
    };
  }

  private determineUserRole(email: string): 'admin' | 'mentor' | 'mentee' {
    if (email === 'unsaidtalkstech2@gmail.com') return 'admin';
    if (email === 'mokshkulshrestha@gmail.com') return 'mentor';
    if (email === 'mokshkulshrestha19@gmail.com') return 'mentee';
    return 'mentee'; // Default role
  }

  logout(): void {
    // Clear any stored tokens/sessions
    // In real app, this would clear JWT tokens, cookies, etc.
  }
}

export default AuthService.getInstance();
