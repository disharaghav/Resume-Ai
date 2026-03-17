import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '@/lib/api';
import { Briefcase } from 'lucide-react';

const AuthPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'job_seeker'
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.login(loginData);
      const data = response.data;
      localStorage.setItem('token', data.token);
      onLogin(data.token, data.user);
      toast.success('Login successful!');
      navigate(data.user.role === 'job_seeker' ? '/dashboard' : '/employer');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.signup(signupData);
      const data = response.data;
      localStorage.setItem('token', data.token);
      onLogin(data.token, data.user);
      toast.success('Account created successfully!');
      navigate(data.user.role === 'job_seeker' ? '/dashboard' : '/employer');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-emerald-50 px-4">
      <Card className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Briefcase className="w-8 h-8 text-indigo-600" />
          <span className="text-3xl font-bold" style={{ fontFamily: 'Outfit' }}>ResuMatch</span>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList data-testid="auth-tabs" className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger data-testid="login-tab" value="login">Login</TabsTrigger>
            <TabsTrigger data-testid="signup-tab" value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form data-testid="login-form" onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="login-email">Email</Label>
                <Input
                  data-testid="login-email-input"
                  id="login-email"
                  type="email"
                  placeholder="your@email.com"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                  className="rounded-lg h-11"
                />
              </div>
              <div>
                <Label htmlFor="login-password">Password</Label>
                <Input
                  data-testid="login-password-input"
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                  className="rounded-lg h-11"
                />
              </div>
              <Button
                data-testid="login-submit-btn"
                type="submit"
                className="w-full rounded-full h-11 bg-indigo-600 hover:bg-indigo-700"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form data-testid="signup-form" onSubmit={handleSignup} className="space-y-4">
              <div>
                <Label htmlFor="signup-name">Full Name</Label>
                <Input
                  data-testid="signup-name-input"
                  id="signup-name"
                  type="text"
                  placeholder="John Doe"
                  value={signupData.name}
                  onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                  required
                  className="rounded-lg h-11"
                />
              </div>
              <div>
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  data-testid="signup-email-input"
                  id="signup-email"
                  type="email"
                  placeholder="your@email.com"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  required
                  className="rounded-lg h-11"
                />
              </div>
              <div>
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  data-testid="signup-password-input"
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  required
                  className="rounded-lg h-11"
                />
              </div>
              <div>
                <Label htmlFor="signup-role">I am a</Label>
                <select
                  data-testid="signup-role-select"
                  id="signup-role"
                  value={signupData.role}
                  onChange={(e) => setSignupData({ ...signupData, role: e.target.value })}
                  className="w-full h-11 rounded-lg border border-slate-200 bg-white px-3 text-base focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                >
                  <option value="job_seeker">Job Seeker</option>
                  <option value="employer">Employer</option>
                </select>
              </div>
              <Button
                data-testid="signup-submit-btn"
                type="submit"
                className="w-full rounded-full h-11 bg-indigo-600 hover:bg-indigo-700"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Sign Up'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default AuthPage;
