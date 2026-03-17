import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Briefcase, Target, Zap, TrendingUp, Users, Award } from 'lucide-react';

const LandingPage = ({ user, onLogout }) => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-slate-900/80 backdrop-blur-md border-b border-slate-700 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-8 h-8 text-indigo-600" />
              <span className="text-2xl font-bold" style={{ fontFamily: 'Outfit' }}>ResuMatch</span>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Link to={user.role === 'job_seeker' ? '/dashboard' : '/employer'}>
                    <Button data-testid="dashboard-btn" variant="ghost" className="rounded-full">Dashboard</Button>
                  </Link>
                  <Button data-testid="logout-btn" onClick={onLogout} variant="outline" className="rounded-full">Logout</Button>
                </>
              ) : (
                <>
                  <Link to="/auth">
                    <Button data-testid="login-btn" variant="ghost" className="rounded-full">Login</Button>
                  </Link>
                  <Link to="/auth">
                    <Button data-testid="get-started-btn" className="rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div data-testid="hero-content" className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl tracking-tight font-bold" style={{ fontFamily: 'Outfit' }}>
                Find Your Perfect Job <span className="text-indigo-600">Match</span>
              </h1>
              <p className="text-lg leading-relaxed text-slate-600">
                Powered by AI, our smart resume-to-job matching platform connects talented professionals with their dream opportunities. Upload your resume and let AI find the best matches.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/auth">
                  <Button data-testid="upload-resume-btn" size="lg" className="rounded-full h-12 px-8 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 font-medium">
                    Upload Resume
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button data-testid="post-job-btn" size="lg" variant="outline" className="rounded-full h-12 px-8 border-slate-200 hover:bg-slate-50 font-medium">
                    Post a Job
                  </Button>
                </Link>
              </div>
            </div>
            <div data-testid="hero-image" className="relative">
              <img 
                src="https://images.unsplash.com/photo-1758518731468-98e90ffd7430?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwcHJvZmVzc2lvbmFscyUyMG9mZmljZSUyMG1lZXRpbmd8ZW58MHx8fHwxNzcwNjE1NTU2fDA&ixlib=rb-4.1.0&q=85"
                alt="Diverse professionals"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl tracking-tight font-semibold mb-4" style={{ fontFamily: 'Outfit' }}>How It Works</h2>
            <p className="text-lg text-slate-600">AI-powered matching in three simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div data-testid="feature-upload" className="bg-slate-700 rounded-2xl border border-slate-600 shadow-sm hover:shadow-md p-8 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-3" style={{ fontFamily: 'Outfit' }}>Upload Resume</h3>
              <p className="text-slate-600 leading-relaxed">Upload your resume in PDF or DOCX format. Our AI will parse and understand your skills and experience.</p>
            </div>
            <div data-testid="feature-match" className="bg-slate-700 rounded-2xl border border-slate-600 shadow-sm hover:shadow-md p-8 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-3" style={{ fontFamily: 'Outfit' }}>AI Matching</h3>
              <p className="text-slate-600 leading-relaxed">Our advanced AI analyzes your profile against thousands of job postings to find the perfect matches.</p>
            </div>
            <div data-testid="feature-apply" className="bg-slate-700 rounded-2xl border border-slate-600 shadow-sm hover:shadow-md p-8 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-violet-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-3" style={{ fontFamily: 'Outfit' }}>Get Hired</h3>
              <p className="text-slate-600 leading-relaxed">Apply to top-matched positions with one click and track your applications in real-time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div data-testid="stat-jobs" className="text-center">
              <div className="text-5xl font-bold text-indigo-600 mb-2" style={{ fontFamily: 'Outfit' }}>10K+</div>
              <p className="text-lg text-slate-600">Active Jobs</p>
            </div>
            <div data-testid="stat-matches" className="text-center">
              <div className="text-5xl font-bold text-emerald-600 mb-2" style={{ fontFamily: 'Outfit' }}>50K+</div>
              <p className="text-lg text-slate-600">Successful Matches</p>
            </div>
            <div data-testid="stat-companies" className="text-center">
              <div className="text-5xl font-bold text-violet-600 mb-2" style={{ fontFamily: 'Outfit' }}>500+</div>
              <p className="text-lg text-slate-600">Partner Companies</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 data-testid="cta-heading" className="text-4xl md:text-5xl tracking-tight font-semibold text-white mb-6" style={{ fontFamily: 'Outfit' }}>
            Ready to Find Your Dream Job?
          </h2>
          <p className="text-lg text-indigo-100 mb-8">
            Join thousands of professionals who found their perfect match through AI-powered job matching.
          </p>
          <Link to="/auth">
            <Button data-testid="cta-button" size="lg" className="rounded-full h-12 px-8 bg-white text-indigo-600 hover:bg-indigo-50 font-medium">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Briefcase className="w-6 h-6" />
              <span className="text-xl font-bold text-white" style={{ fontFamily: 'Outfit' }}>ResuMatch</span>
            </div>
            <p className="text-sm">© 2026 ResuMatch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
