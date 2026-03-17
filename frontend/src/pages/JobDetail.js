import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { jobsAPI, applicationsAPI } from '@/lib/api';
import { Briefcase, MapPin, Clock, DollarSign, CheckCircle, ArrowLeft, Loader2, LogOut } from 'lucide-react';

const JobDetail = ({ user, onLogout }) => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const fetchJobDetails = useCallback(async () => {
    try {
      const response = await jobsAPI.get(jobId);

      if (response.ok) {
        setJob(await response.json());
      } else {
        toast.error('Job not found');
        navigate('/jobs');
      }
    } catch (error) {
      toast.error('Error loading job details');
    } finally {
      setLoading(false);
    }
  }, [jobId, navigate]);

  const checkApplicationStatus = useCallback(async () => {
    try {
      const response = await applicationsAPI.list();

      if (response.ok) {
        const applications = await response.json();
        const applied = applications.some(app => app.job_id === jobId);
        setHasApplied(applied);
      }
    } catch (error) {
      console.error('Error checking application status');
    }
  }, [jobId]);

  useEffect(() => {
    fetchJobDetails();

    if (user?.role === 'job_seeker') {
      checkApplicationStatus();
    }
  }, [jobId, user?.role, fetchJobDetails, checkApplicationStatus]);

  const handleApply = async () => {
    setApplying(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ job_id: jobId })
      });

      if (response.ok) {
        toast.success('Application submitted successfully!');
        setHasApplied(true);
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Failed to apply');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Briefcase className="w-8 h-8 text-indigo-600" />
              <span className="text-2xl font-bold">ResuMatch</span>
            </Link>

            <div className="flex items-center gap-4">
              <Link to={user?.role === 'job_seeker' ? '/dashboard' : '/employer'}>
                <Button variant="ghost" className="rounded-full">
                  Dashboard
                </Button>
              </Link>

              <Button
                onClick={onLogout}
                variant="outline"
                className="rounded-full"
                size="sm"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="mb-6 rounded-full"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        <Card className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-semibold mb-2">{job.title}</h1>
                <p className="text-xl text-slate-600">{job.company}</p>
              </div>

              {job.match_score && (
                <div className="px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-lg font-medium">
                  {Math.round(job.match_score)}% Match
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-slate-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{job.location}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{job.job_type}</span>
              </div>

              {job.salary_range && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  <span>{job.salary_range}</span>
                </div>
              )}
            </div>
          </div>

          {user?.role === 'job_seeker' && (
            <div className="pt-6 border-t border-slate-100">
              {hasApplied ? (
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">
                    You have already applied to this job
                  </span>
                </div>
              ) : (
                <Button
                  onClick={handleApply}
                  disabled={applying}
                  size="lg"
                  className="w-full rounded-full h-12 bg-indigo-600 hover:bg-indigo-700"
                >
                  {applying ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Submitting Application...
                    </>
                  ) : (
                    'Apply Now'
                  )}
                </Button>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default JobDetail;