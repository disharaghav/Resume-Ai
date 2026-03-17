import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { jobsAPI } from '@/lib/api';
import { Briefcase, LogOut, Loader2, Search } from 'lucide-react';

const JobListings = ({ user, onLogout }) => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = jobs.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredJobs(filtered);
    } else {
      setFilteredJobs(jobs);
    }
  }, [searchQuery, jobs]);

  const fetchJobs = async () => {
    try {
      const data = await jobsAPI.list();
      setJobs(data.data);
      setFilteredJobs(data.data);
    } catch (error) {
      toast.error('Error loading jobs');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Briefcase className="w-8 h-8 text-indigo-600" />
              <span className="text-2xl font-bold" style={{ fontFamily: 'Outfit' }}>ResuMatch</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to={user.role === 'job_seeker' ? '/dashboard' : '/employer'}>
                <Button data-testid="dashboard-link-btn" variant="ghost" className="rounded-full">Dashboard</Button>
              </Link>
              <Button data-testid="logout-btn" onClick={onLogout} variant="outline" className="rounded-full" size="sm">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 data-testid="page-heading" className="text-4xl md:text-5xl tracking-tight font-semibold mb-8" style={{ fontFamily: 'Outfit' }}>
          Available Jobs
        </h1>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              data-testid="search-input"
              type="text"
              placeholder="Search jobs by title, company, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-full bg-white border-slate-200"
            />
          </div>
        </div>

        {/* Job Listings */}
        {filteredJobs.length === 0 ? (
          <Card data-testid="no-jobs-message" className="p-8 bg-white rounded-2xl border border-slate-100 text-center">
            <p className="text-slate-600">No jobs found</p>
          </Card>
        ) : (
          <div data-testid="jobs-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <Link key={job.id} to={`/jobs/${job.id}`}>
                <Card data-testid={`job-card-${job.id}`} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md cursor-pointer hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-1" style={{ fontFamily: 'Outfit' }}>{job.title}</h3>
                      <p className="text-sm text-slate-600">{job.company}</p>
                    </div>
                    {job.match_score && (
                      <div data-testid={`match-score-${job.id}`} className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                        {Math.round(job.match_score)}% Match
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mb-4">{job.location} • {job.job_type}</p>
                  <p className="text-sm text-slate-700 line-clamp-2">{job.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobListings;
