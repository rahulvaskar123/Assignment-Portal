"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download, Filter, LogOut, RefreshCw, FileText, Users, CalendarDays } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Submission = {
  id: string;
  studentId: string;
  subject: string;
  fileName: string;
  uploadTime: string;
};

export default function TeacherDashboard() {
  const [userName, setUserName] = useState('');
  const [teacherSubject, setTeacherSubject] = useState('');
  const [teacherYear, setTeacherYear] = useState('');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filterSubject, setFilterSubject] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
    const userType = localStorage.getItem('userType');
    const storedName = localStorage.getItem('userName');
    const storedSubject = localStorage.getItem('teacherSubject');
    const storedYear = localStorage.getItem('teacherYear');
    
    if (userType !== 'teacher') {
      router.push('/teacher/register');
    } else {
      setUserName(storedName || 'Professor');
      setTeacherSubject(storedSubject || 'Unassigned');
      setTeacherYear(storedYear || 'General');
      setFilterSubject(storedSubject || 'All');
      
      // Load mock submissions
      setSubmissions([
        { id: '1', studentId: 'STU9012', subject: storedSubject || 'Cloud Computing', fileName: 'Final_Project_V1.pdf', uploadTime: '2024-05-10 14:20' },
        { id: '2', studentId: 'STU4567', subject: storedSubject || 'Cloud Computing', fileName: 'Architecture_Diagram.zip', uploadTime: '2024-05-11 09:15' },
      ]);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  const handleDownload = (fileName: string) => {
    toast({
      title: "Downloading File",
      description: `Opening secure link for ${fileName}`,
    });
  };

  const refreshSubmissions = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({ title: "Updated", description: "Latest student submissions fetched." });
    }, 1000);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-accent text-white p-6 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-headline">Teacher Workspace</h1>
              <p className="text-sm text-white/80">{userName} | {teacherSubject}</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={handleLogout} className="bg-white text-accent hover:bg-white/90">
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card shadow-sm border-l-4 border-l-accent">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center"><Users className="w-4 h-4 mr-1" /> Enrolled Students</CardDescription>
              <CardTitle className="text-4xl font-bold text-accent">24</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-card shadow-sm border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center"><CalendarDays className="w-4 h-4 mr-1" /> Year Level</CardDescription>
              <CardTitle className="text-4xl font-bold text-primary">{teacherYear}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-card shadow-sm border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center"><RefreshCw className="w-4 h-4 mr-1" /> New Submissions</CardDescription>
              <CardTitle className="text-4xl font-bold text-green-500">{submissions.length}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Classroom Feed</h2>
          <Button variant="outline" size="sm" onClick={refreshSubmissions} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <Card className="shadow-sm border-none bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold">Student ID</TableHead>
                <TableHead className="font-semibold">Document</TableHead>
                <TableHead className="font-semibold">Timestamp</TableHead>
                <TableHead className="text-right font-semibold">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.length > 0 ? (
                submissions.map((sub) => (
                  <TableRow key={sub.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="font-medium text-accent">{sub.studentId}</TableCell>
                    <TableCell className="max-w-[300px] truncate">
                      <span className="text-slate-700">{sub.fileName}</span>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {sub.uploadTime}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-accent hover:bg-accent/10"
                        onClick={() => handleDownload(sub.fileName)}
                      >
                        <Download className="w-4 h-4 mr-1" /> Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-slate-400">
                    No submissions from students yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </main>
    </div>
  );
}
