"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download, Filter, Search, LogOut, RefreshCw, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Submission = {
  id: string;
  studentId: string;
  subject: string;
  fileName: string;
  uploadTime: string;
};

const MOCK_SUBMISSIONS: Submission[] = [
  { id: '1', studentId: 'STU9012', subject: 'Cloud Computing', fileName: 'STU9012_CloudComputing_1715001234_project.pdf', uploadTime: '2024-05-06 14:20' },
  { id: '2', studentId: 'STU4567', subject: 'Data Science', fileName: 'STU4567_DataScience_1715009876_analysis.zip', uploadTime: '2024-05-07 09:15' },
  { id: '3', studentId: 'STU1234', subject: 'Web Development', fileName: 'STU1234_WebDev_1715012345_portfolio.docx', uploadTime: '2024-05-07 11:45' },
  { id: '4', studentId: 'STU5588', subject: 'Cloud Computing', fileName: 'STU5588_CloudComputing_1715022222_aws_arch.pdf', uploadTime: '2024-05-08 16:30' },
];

export default function TeacherDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>(MOCK_SUBMISSIONS);
  const [filterSubject, setFilterSubject] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Basic session simulation
    const userType = localStorage.getItem('userType');
    // For demo purposes, we skip the hard teacher login redirect if testing directly
    // but in production we would enforce it.
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  const handleDownload = (fileName: string) => {
    toast({
      title: "Generating Secure URL",
      description: `Downloading ${fileName}... (Presigned URL generated)`,
    });
    // In real app: call API to get presigned URL and open it
    window.alert(`Simulating download for ${fileName} via S3 Presigned URL`);
  };

  const filteredSubmissions = filterSubject === 'All' 
    ? submissions 
    : submissions.filter(s => s.subject === filterSubject);

  const refreshSubmissions = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({ title: "Updated", description: "Latest submissions fetched from S3." });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-white p-6 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-headline">Teacher Portal</h1>
              <p className="text-sm text-primary-foreground/80">Management Dashboard</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={handleLogout} className="bg-white text-primary hover:bg-white/90">
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card shadow-sm border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <CardDescription>Total Submissions</CardDescription>
              <CardTitle className="text-4xl font-bold text-primary">{submissions.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-card shadow-sm border-l-4 border-l-accent">
            <CardHeader className="pb-2">
              <CardDescription>Active Subjects</CardDescription>
              <CardTitle className="text-4xl font-bold text-accent">3</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-card shadow-sm border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardDescription>Pending Reviews</CardDescription>
              <CardTitle className="text-4xl font-bold text-green-500">{submissions.length}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="flex-1 md:w-64">
              <Select value={filterSubject} onValueChange={setFilterSubject}>
                <SelectTrigger className="bg-white">
                  <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Filter by Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Subjects</SelectItem>
                  <SelectItem value="Cloud Computing">Cloud Computing</SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="Web Development">Web Development</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="icon" onClick={refreshSubmissions} disabled={isLoading} className="bg-white">
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        <Card className="shadow-sm border-none bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-semibold">Student ID</TableHead>
                <TableHead className="font-semibold">Subject</TableHead>
                <TableHead className="font-semibold">File Name</TableHead>
                <TableHead className="font-semibold">Upload Time</TableHead>
                <TableHead className="text-right font-semibold">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((sub) => (
                  <TableRow key={sub.id} className="hover:bg-muted/10 transition-colors">
                    <TableCell className="font-medium text-primary">{sub.studentId}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal border-primary/20 bg-primary/5 text-primary">
                        {sub.subject}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate text-muted-foreground">
                      {sub.fileName}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {sub.uploadTime}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-primary hover:bg-primary/10"
                        onClick={() => handleDownload(sub.fileName)}
                      >
                        <Download className="w-4 h-4 mr-1" /> Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No submissions found for the selected subject.
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