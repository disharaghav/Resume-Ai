import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { jobsAPI, resumesAPI, applicationsAPI } from '@/lib/api';
import { Briefcase, Upload, FileText, TrendingUp, LogOut, Loader2 } from 'lucide-react';

const JobSeekerDashboard = ({ user, onLogout }) => {
  const [resumes, setResumes] = useState([]);
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resumesRes, jobsRes, appsRes] = await Promise.all([
        resumesAPI.list(),
        jobsAPI.list(),
        applicationsAPI.list()
      ]);

      if (resumesRes.ok) setResumes(await resumesRes.json());
      if (jobsRes.ok) setMatchedJobs(await jobsRes.json());
      if (appsRes.ok) setApplications(await appsRes.json());
    } catch (error) {
      toast.error('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf') && !file.name.toLowerCase().endsWith('.docx')) {
      toast.error('Please upload a PDF or DOCX file');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await resumesAPI.create({ filename: file.name, content: 'parsed content' });

      if (response.ok) {
        toast.success('Resume uploaded successfully!');
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Upload failed');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setUploading(false);
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
        <h1 data-testid="dashboard-heading" className="text-4xl md:text-5xl tracking-tight font-semibold mb-8" style={{ fontFamily: 'Outfit' }}>
          Job Seeker Dashboard
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card data-testid="stat-resumes" className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <div className="text-3xl font-bold" style={{ fontFamily: 'Outfit' }}>{resumes.length}</div>
                <p className="text-sm text-slate-600">Resumes Uploaded</p>
              </div>
            </div>
          </Card>

          <Card data-testid="stat-matched-jobs" className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <div className="text-3xl font-bold" style={{ fontFamily: 'Outfit' }}>{matchedJobs.length}</div>
                <p className="text-sm text-slate-600">Matched Jobs</p>
              </div>
            </div>
          </Card>

          <Card data-testid="stat-applications" className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-violet-600" />
              </div>
              <div>
                <div className="text-3xl font-bold" style={{ fontFamily: 'Outfit' }}>{applications.length}</div>
                <p className="text-sm text-slate-600">Applications</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Upload Resume Section */}
        <Card data-testid="upload-section" className="p-8 mb-8 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: 'Outfit' }}>Upload Your Resume</h2>
          <p className="text-slate-600 mb-6">Upload your resume in PDF or DOCX format. Our AI will analyze it and match you with relevant jobs.</p>
          <label htmlFor="resume-upload">
            <input
              data-testid="resume-upload-input"
              id="resume-upload"
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
            <Button data-testid="upload-resume-btn" asChild disabled={uploading} className="rounded-full bg-indigo-600 hover:bg-indigo-700">
              <span>
                {uploading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</>
                ) : (
                  <><Upload className="w-4 h-4 mr-2" /> Upload Resume</>
                )}
              </span>
            </Button>
          </label>
        </Card>

        {/* Top Matched Jobs */}
        <div data-testid="matched-jobs-section">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-semibold" style={{ fontFamily: 'Outfit' }}>Top Matched Jobs</h2>
            <Link to="/jobs">
              <Button data-testid="view-all-jobs-btn" variant="outline" className="rounded-full">View All</Button>
            </Link>
          </div>

          {resumes.length === 0 ? (
            <Card data-testid="no-resume-message" className="p-8 bg-white rounded-2xl border border-slate-100 text-center">
              <p className="text-slate-600">Upload your resume to see matched jobs</p>
            </Card>
          ) : matchedJobs.length === 0 ? (
            <Card data-testid="no-jobs-message" className="p-8 bg-white rounded-2xl border border-slate-100 text-center">
              <p className="text-slate-600">No jobs available at the moment</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedJobs.slice(0, 6).map((job) => (
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
    </div>
  );
};

export default JobSeekerDashboard;
