
"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { 
  UploadCloud, 
  Loader2, 
  LogOut, 
  BookOpen, 
  Clock, 
  Trash2, 
  Eye,
  FileText,
  RefreshCw,
  FileDown,
  ChevronRight,
  Cloud
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Submission = {
  id: string;
  studentId: string;
  studentName?: string;
  assignmentId?: string;
  subject: string;
  fileName: string;
  s3Key: string;
  date: string;
  status: 'Submitted' | 'Reviewed';
};

type Assignment = {
  id: string;
  title: string;
  description: string;
  subject: string;
  year: string;
  dueDate: string;
  s3Key?: string;
  fileName?: string;
};

const SUBJECTS = [
  "Big Data Analytics",
  "Blockchain",
  "Cloud Computing",
  "Digital Business Management"
];

export default function StudentDashboard() {
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [userYear, setUserYear] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [mounted, setMounted] = useState(false);
  
  const formRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { toast } = useToast();

  const loadData = async () => {
    const storedId = localStorage.getItem('userId');
    const storedName = localStorage.getItem('userName');
    const storedYear = localStorage.getItem('userYear');
    const userType = localStorage.getItem('userType');
    
    if (!storedId || userType !== 'student') {
      router.push('/student/login');
      return;
    }

    setUserId(storedId);
    setUserName(storedName || storedId);
    setUserYear(storedYear || '1st Year');
    
    try {
      // Fetch Assignments from S3
      const assRes = await fetch('/api/assignments?type=assignments');
      const allAssignments = await assRes.json();
      setAssignments(allAssignments);

      // Fetch Submissions from S3
      const subRes = await fetch('/api/assignments?type=submissions');
      const allSubmissions = await subRes.json();
      setSubmissions(allSubmissions.filter((s: Submission) => s.studentId === storedId));
    } catch (e) {
      toast({ title: "Sync Error", description: "Could not fetch classroom data from S3.", variant: "destructive" });
    }
  };

  useEffect(() => {
    setMounted(true);
    loadData();
  }, [router]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
    toast({
      title: "Classroom Synced",
      description: "Latest data fetched from AWS S3.",
    });
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  const handlePreview = async (s3Key: string) => {
    try {
      const response = await fetch('/api/upload/presigned', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: s3Key, operation: 'get' }),
      });
      const { url } = await response.json();
      if (url) window.open(url, '_blank');
    } catch (err) {
      toast({ title: "Error", description: "Could not retrieve file from AWS.", variant: "destructive" });
    }
  };

  const handleOpenAssignment = (subj: string, assignment: Assignment) => {
    setSelectedSubject(subj);
    setSelectedAssignmentId(assignment.id);
    setDescription(`Notes for: ${assignment.title}`);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedSubject || !userId) return;

    setIsUploading(true);

    try {
      const presignedRes = await fetch('/api/upload/presigned', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          studentId: userId,
          subject: selectedSubject,
        }),
      });
      const { url, key } = await presignedRes.json();

      if (!url) throw new Error("Could not get upload permission from AWS.");

      await fetch(url, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      const newSubmission: Submission = {
        id: Math.random().toString(36).substr(2, 9),
        studentId: userId,
        studentName: userName,
        assignmentId: selectedAssignmentId,
        subject: selectedSubject,
        fileName: file.name,
        s3Key: key,
        date: new Date().toISOString().split('T')[0],
        status: 'Submitted'
      };
      
      await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save-submission', data: newSubmission }),
      });

      toast({
        title: "AWS Upload Complete",
        description: "Submission saved to cloud registry.",
      });
      
      setFile(null);
      setDescription('');
      setSelectedSubject('');
      setSelectedAssignmentId('');
      loadData();
    } catch (error: any) {
      toast({
        title: "Upload Error",
        description: error.message || "Failed to upload to AWS.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const getAssignmentStatus = (assignment: Assignment) => {
    const isCompleted = submissions.some(s => s.assignmentId === assignment.id);
    const isPastDue = new Date(assignment.dueDate) < new Date();
    if (isCompleted) return 'Completed';
    if (isPastDue) return 'Missed';
    return 'Pending';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'Missed': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const handleDeleteSubmission = async (id: string) => {
    const subToDelete = submissions.find(s => s.id === id);
    if (subToDelete?.status === 'Reviewed') {
      toast({ title: "Action Denied", description: "Reviewed assignments cannot be deleted.", variant: "destructive" });
      return;
    }
    
    await fetch('/api/assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete-submission', data: { id } }),
    });

    toast({ title: "Submission Deleted", description: "Reference removed from S3." });
    loadData();
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary font-headline">Student Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, <span className="font-semibold text-primary">{userName}</span> 
              <Badge variant="outline" className="ml-2 text-[10px]">{userYear}</Badge>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-white text-[10px] py-1 text-green-600 border-green-200">
              <Cloud className="w-3 h-3 mr-1" /> AWS Cloud Sync Active
            </Badge>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} /> Sync
            </Button>
            <Button variant="ghost" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="classes" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mb-8">
            <TabsTrigger value="classes">My Classes</TabsTrigger>
            <TabsTrigger value="history">Submission History</TabsTrigger>
          </TabsList>

          <TabsContent value="classes" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SUBJECTS.map((s) => {
                // FILTER: Only show assignments for the student's year and the current subject card
                const subjectAssignments = assignments.filter(a => a.subject === s && a.year === userYear);
                return (
                  <Card key={s} className="hover:shadow-md transition-shadow border-l-4 border-l-primary">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg font-bold">{s}</CardTitle>
                      <BookOpen className="w-5 h-5 text-primary opacity-50" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-xs text-muted-foreground">{userYear} • {subjectAssignments.length} Assignment(s)</p>
                      <div className="space-y-2">
                        {subjectAssignments.length > 0 ? (
                          subjectAssignments.map(a => {
                            const status = getAssignmentStatus(a);
                            return (
                              <div key={a.id} className={`p-3 border rounded-lg flex flex-col gap-2 ${getStatusColor(status)}`}>
                                <div className="flex justify-between items-center w-full">
                                  <div className="text-left">
                                    <p className="text-sm font-bold">{a.title}</p>
                                    <p className="text-[10px] flex items-center opacity-70">
                                      <Clock className="w-3 h-3 mr-1" /> Due: {a.dueDate}
                                    </p>
                                  </div>
                                  <div className="flex gap-2">
                                    {a.s3Key && (
                                      <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => handlePreview(a.s3Key!)}>
                                        <FileDown className="w-4 h-4" />
                                      </Button>
                                    )}
                                    <Button size="sm" variant="secondary" className="h-8 text-[10px] font-bold bg-white/50 hover:bg-white" onClick={() => handleOpenAssignment(s, a)}>
                                      {status === 'Completed' ? 'Resubmit' : 'Open'} <ChevronRight className="w-3 h-3 ml-1" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-xs text-muted-foreground italic p-2 bg-slate-50 rounded">No assignments for your year yet.</div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {selectedSubject && (
              <div ref={formRef} className="pt-4 scroll-mt-6">
                <Card className="shadow-lg border-primary/30 border-2 animate-in fade-in slide-in-from-bottom-4">
                  <CardHeader className="bg-primary/5 border-b">
                    <CardTitle className="flex items-center text-primary text-xl">
                      <UploadCloud className="w-5 h-5 mr-2" /> Submit: {assignments.find(a => a.id === selectedAssignmentId)?.title || selectedSubject}
                    </CardTitle>
                    <CardDescription className="text-sm font-medium text-slate-700 mt-2">
                      Upload to AWS S3. Your submission will be recorded in the classroom registry.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <form onSubmit={handleUpload} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="description">Submission Notes</Label>
                        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Provide any additional notes about your submission..." className="min-h-[80px]" />
                      </div>
                      <div className="space-y-3">
                        <Label>File Attachment</Label>
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/40 border-border transition-colors">
                          <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />
                          <p className="text-xs text-muted-foreground">{file ? file.name : "Select PDF, ZIP, or DOCX"}</p>
                          <input type="file" className="hidden" onChange={handleFileChange} required />
                        </label>
                      </div>
                      <div className="flex gap-4">
                        <Button type="submit" className="flex-1" disabled={isUploading || !file || !selectedSubject}>
                          {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                          {isUploading ? "Uploading to S3..." : "Upload to AWS Cloud"}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => {
                          setSelectedSubject('');
                          setSelectedAssignmentId('');
                          setFile(null);
                        }}>Cancel</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {SUBJECTS.map((subj) => {
                const subjectSubmissions = submissions.filter(s => s.subject === subj);
                return (
                  <AccordionItem key={subj} value={subj} className="border rounded-lg bg-white px-4 shadow-sm border-none">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg text-primary"><BookOpen className="w-5 h-5" /></div>
                        <div className="text-left">
                          <p className="font-bold text-slate-800">{subj}</p>
                          <p className="text-xs text-muted-foreground">{subjectSubmissions.length} Assignment(s) Submitted</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-0 pb-4">
                      <div className="divide-y border-t mt-2">
                        {subjectSubmissions.length > 0 ? (
                          subjectSubmissions.map((sub) => (
                            <div key={sub.id} className="py-4 flex items-center justify-between gap-4">
                              <div className="flex items-center space-x-4 flex-1">
                                <FileText className="w-5 h-5 text-slate-400" />
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold truncate">{sub.fileName}</p>
                                  <div className="flex items-center text-[10px] text-muted-foreground mt-1"><Clock className="w-3 h-3 mr-1" /> {sub.date}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={sub.status === 'Reviewed' ? 'default' : 'secondary'} className="text-[10px] uppercase">{sub.status}</Badge>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handlePreview(sub.s3Key)}><Eye className="w-4 h-4" /></Button>
                                {sub.status !== 'Reviewed' && (
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteSubmission(sub.id)}><Trash2 className="w-4 h-4" /></Button>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-8 text-center text-sm text-muted-foreground italic">No submissions for this subject yet.</div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
