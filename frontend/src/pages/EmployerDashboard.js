import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { jobsAPI } from '@/lib/api';
import { Briefcase, Plus, Users, LogOut, Loader2 } from 'lucide-react';

const EmployerDashboard = ({ user, onLogout }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    location: '',
    job_type: 'Full-time',
    description: '',
    requirements: '',
    salary_range: ''
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await jobsAPI.myJobs();

      if (response.ok) {
        setJobs(await response.json());
      }
    } catch (error) {
      toast.error('Error loading jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();

    const requirements = jobData.requirements.split('\n').filter(r => r.trim());

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...jobData,
          requirements
        })
      });

      if (response.ok) {
        toast.success('Job posted successfully!');
        setDialogOpen(false);
        setJobData({
          title: '',
          company: '',
          location: '',
          job_type: 'Full-time',
          description: '',
          requirements: '',
          salary_range: ''
        });
        fetchJobs();
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Failed to create job');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
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
              <span className="text-sm text-slate-600">Welcome, {user.name}</span>
              <Button data-testid="logout-btn" onClick={onLogout} variant="outline" className="rounded-full" size="sm">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 data-testid="dashboard-heading" className="text-4xl md:text-5xl tracking-tight font-semibold" style={{ fontFamily: 'Outfit' }}>
            Employer Dashboard
          </h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="post-job-btn" className="rounded-full bg-indigo-600 hover:bg-indigo-700">
                <Plus className="w-4 h-4 mr-2" /> Post a Job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby="job-posting-form">
              <DialogHeader>
                <DialogTitle>Post a New Job</DialogTitle>
              </DialogHeader>
              <form data-testid="create-job-form" onSubmit={handleCreateJob} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    data-testid="job-title-input"
                    id="title"
                    value={jobData.title}
                    onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
                    required
                    className="rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    data-testid="job-company-input"
                    id="company"
                    value={jobData.company}
                    onChange={(e) => setJobData({ ...jobData, company: e.target.value })}
                    required
                    className="rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      data-testid="job-location-input"
                      id="location"
                      value={jobData.location}
                      onChange={(e) => setJobData({ ...jobData, location: e.target.value })}
                      required
                      className="rounded-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="job_type">Job Type</Label>
                    <select
                      data-testid="job-type-select"
                      id="job_type"
                      value={jobData.job_type}
                      onChange={(e) => setJobData({ ...jobData, job_type: e.target.value })}
                      className="w-full h-11 rounded-lg border border-slate-200 bg-white px-3 text-base focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    >
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Contract</option>
                      <option>Remote</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Job Description</Label>
                  <Textarea
                    data-testid="job-description-input"
                    id="description"
                    value={jobData.description}
                    onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
                    required
                    rows={4}
                    className="rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="requirements">Requirements (one per line)</Label>
                  <Textarea
                    data-testid="job-requirements-input"
                    id="requirements"
                    value={jobData.requirements}
                    onChange={(e) => setJobData({ ...jobData, requirements: e.target.value })}
                    required
                    rows={4}
                    placeholder="Bachelor's degree in Computer Science\n3+ years of experience\nProficient in React"
                    className="rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="salary_range">Salary Range (optional)</Label>
                  <Input
                    data-testid="job-salary-input"
                    id="salary_range"
                    value={jobData.salary_range}
                    onChange={(e) => setJobData({ ...jobData, salary_range: e.target.value })}
                    placeholder="$80,000 - $120,000"
                    className="rounded-lg"
                  />
                </div>
                <Button data-testid="submit-job-btn" type="submit" className="w-full rounded-full bg-indigo-600 hover:bg-indigo-700">
                  Post Job
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card data-testid="stat-active-jobs" className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <div className="text-3xl font-bold" style={{ fontFamily: 'Outfit' }}>{jobs.length}</div>
                <p className="text-sm text-slate-600">Active Job Postings</p>
              </div>
            </div>
          </Card>

          <Card data-testid="stat-total-applications" className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <div className="text-3xl font-bold" style={{ fontFamily: 'Outfit' }}>0</div>
                <p className="text-sm text-slate-600">Total Applications</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Job Listings */}
        <div data-testid="my-jobs-section">
          <h2 className="text-3xl font-semibold mb-6" style={{ fontFamily: 'Outfit' }}>My Job Postings</h2>

          {jobs.length === 0 ? (
            <Card data-testid="no-jobs-message" className="p-8 bg-white rounded-2xl border border-slate-100 text-center">
              <p className="text-slate-600 mb-4">You haven't posted any jobs yet</p>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="post-first-job-btn" className="rounded-full bg-indigo-600 hover:bg-indigo-700">
                    Post Your First Job
                  </Button>
                </DialogTrigger>
              </Dialog>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <Card key={job.id} data-testid={`job-card-${job.id}`} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Outfit' }}>{job.title}</h3>
                  <p className="text-sm text-slate-600 mb-2">{job.company}</p>
                  <p className="text-sm text-slate-600 mb-4">{job.location} • {job.job_type}</p>
                  <p className="text-sm text-slate-700 line-clamp-3 mb-4">{job.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">{job.status}</span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
