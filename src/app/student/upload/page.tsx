
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
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
  FileCheck, 
  Loader2, 
  AlertCircle, 
  LogOut, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  Trash2, 
  Eye,
  FileText,
  RefreshCw
} from 'lucide-react';
import { assignmentVerificationAssistant } from '@/ai/flows/assignment-verification-assistant';
import { useToast } from '@/hooks/use-toast';

type Submission = {
  id: string;
  assignmentId?: string;
  subject: string;
  fileName: string;
  date: string;
  status: 'Submitted' | 'Reviewed';
  fileUrl?: string;
};

type Assignment = {
  id: string;
  title: string;
  description: string;
  subject: string;
  year: string;
  dueDate: string;
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
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<{ isAligned: boolean; suggestion: string } | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const loadData = () => {
    const storedId = localStorage.getItem('userId');
    const storedName = localStorage.getItem('userName');
    const userType = localStorage.getItem('userType');
    
    if (!storedId || userType !== 'student') {
      router.push('/student/login');
      return;
    }

    setUserId(storedId);
    if (storedName) setUserName(storedName);
    
    // Load submissions
    const storedSubmissions = JSON.parse(localStorage.getItem(`submissions_${storedId}`) || '[]');
    setSubmissions(storedSubmissions);

    // Load assignments from simulated global storage
    const allAssignments = JSON.parse(localStorage.getItem('assignments') || '[]');
    setAssignments(allAssignments);
  };

  useEffect(() => {
    setMounted(true);
    loadData();
  }, [router]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      loadData();
      setIsRefreshing(false);
      toast({
        title: "Classroom Synced",
        description: "Your assignment list is up to date.",
      });
    }, 800);
  };

  const handleLogout = () => {
    // Selective removal to preserve "global" simulation data
    localStorage.removeItem('userType');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    router.push('/');
  };

  const verifyWithAI = async () => {
    if (!selectedSubject || !description) return;
    setIsVerifying(true);
    try {
      const result = await assignmentVerificationAssistant({
        subject: selectedSubject as any,
        freeTextDescription: description
      });
      setAiFeedback(result);
    } catch (error) {
      toast({
        title: "AI Verification Error",
        description: "Could not verify assignment details at this time.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedSubject || !userName) return;

    setIsUploading(true);
    
    setTimeout(() => {
      const previewUrl = URL.createObjectURL(file);
      const newSubmission: Submission = {
        id: Math.random().toString(36).substr(2, 9),
        assignmentId: selectedAssignmentId,
        subject: selectedSubject,
        fileName: file.name,
        date: new Date().toISOString().split('T')[0],
        status: 'Submitted',
        fileUrl: previewUrl
      };
      
      const updatedSubmissions = [newSubmission, ...submissions];
      setSubmissions(updatedSubmissions);
      localStorage.setItem(`submissions_${userId}`, JSON.stringify(updatedSubmissions));

      const allSubmissions = JSON.parse(localStorage.getItem('all_global_submissions') || '[]');
      localStorage.setItem('all_global_submissions', JSON.stringify([
        { ...newSubmission, studentId: userId, studentName: userName },
        ...allSubmissions
      ]));

      setIsUploading(false);
      toast({
        title: "Submission Successful",
        description: "Your assignment has been uploaded to your classroom.",
      });
      
      setFile(null);
      setAiFeedback(null);
      setDescription('');
      setSelectedSubject('');
      setSelectedAssignmentId('');
    }, 1500);
  };

  const getAssignmentStatus = (assignment: Assignment) => {
    const isCompleted = submissions.some(s => s.assignmentId === assignment.id || (s.subject === assignment.subject && s.fileName.toLowerCase().includes(assignment.title.toLowerCase())));
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

  const handleDeleteSubmission = (id: string) => {
    const subToDelete = submissions.find(s => s.id === id);
    if (subToDelete?.status === 'Reviewed') {
      toast({ title: "Action Denied", description: "Reviewed assignments cannot be deleted.", variant: "destructive" });
      return;
    }
    const updated = submissions.filter(s => s.id !== id);
    setSubmissions(updated);
    localStorage.setItem(`submissions_${userId}`, JSON.stringify(updated));
    
    const allSubmissions = JSON.parse(localStorage.getItem('all_global_submissions') || '[]');
    localStorage.setItem('all_global_submissions', JSON.stringify(allSubmissions.filter((s: any) => s.id !== id)));

    toast({ title: "Submission Deleted", description: "The assignment has been removed." });
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary font-headline">Student Classroom</h1>
            <p className="text-muted-foreground">Welcome back, <span className="font-semibold text-primary">{userName || userId}</span></p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} /> Sync Classroom
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
                const subjectAssignments = assignments.filter(a => a.subject === s);
                return (
                  <Card key={s} className="hover:shadow-md transition-shadow border-l-4 border-l-primary">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg font-bold">{s}</CardTitle>
                      <BookOpen className="w-5 h-5 text-primary opacity-50" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-xs text-muted-foreground">Academic Year • {subjectAssignments.length} Assignments</p>
                      
                      <div className="space-y-2">
                        {subjectAssignments.length > 0 ? (
                          subjectAssignments.map(a => {
                            const status = getAssignmentStatus(a);
                            return (
                              <div key={a.id} className={`p-3 border rounded-lg flex justify-between items-center ${getStatusColor(status)}`}>
                                <div className="text-left">
                                  <p className="text-sm font-bold">{a.title}</p>
                                  <p className="text-[10px] flex items-center opacity-70">
                                    <Clock className="w-3 h-3 mr-1" /> Due: {a.dueDate}
                                  </p>
                                </div>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-8 text-[10px] font-bold"
                                  onClick={() => {
                                    setSelectedSubject(s);
                                    setSelectedAssignmentId(a.id);
                                    setDescription(`Assignment: ${a.title}`);
                                  }}
                                >
                                  {status === 'Completed' ? 'Resubmit' : 'Open'}
                                </Button>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-xs text-muted-foreground italic p-2 bg-slate-50 rounded">No active assignments.</div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {selectedSubject && (
              <Card className="shadow-lg border-primary/20 animate-in fade-in slide-in-from-bottom-4">
                <CardHeader>
                  <CardTitle className="flex items-center text-primary text-xl">
                    <UploadCloud className="w-5 h-5 mr-2" />
                    Upload Submission: {selectedSubject}
                  </CardTitle>
                  <CardDescription>
                    {assignments.find(a => a.id === selectedAssignmentId)?.description || "Complete your task and upload the file below."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpload} className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="description">Brief Topic Summary (AI Alignment Check)</Label>
                        <Button type="button" variant="link" size="sm" className="text-accent h-auto p-0" onClick={verifyWithAI} disabled={isVerifying || !description}>
                          {isVerifying ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <FileCheck className="w-3 h-3 mr-1" />} Check Alignment
                        </Button>
                      </div>
                      <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Explain your assignment topic in 1-2 sentences..." className="min-h-[80px]" />
                    </div>

                    {aiFeedback && (
                      <Alert className={aiFeedback.isAligned ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}>
                        <AlertTitle className="flex items-center text-sm">
                          {aiFeedback.isAligned ? <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" /> : <AlertCircle className="w-4 h-4 mr-2 text-amber-600" />} AI Feedback
                        </AlertTitle>
                        <AlertDescription className="text-xs mt-1">{aiFeedback.suggestion}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-3">
                      <Label>File Attachment</Label>
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/40 border-border transition-colors">
                        <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />
                        <p className="text-xs text-muted-foreground">{file ? file.name : "Select PDF, ZIP, or DOCX"}</p>
                        <input type="file" className="hidden" onChange={handleFileChange} required />
                      </label>
                    </div>

                    <div className="flex gap-4">
                      <Button type="submit" className="flex-1" disabled={isUploading || !file}>
                        {isUploading ? "Processing..." : "Submit to Classroom"}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => {
                        setSelectedSubject('');
                        setSelectedAssignmentId('');
                      }}>Cancel</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
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
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => sub.fileUrl && window.open(sub.fileUrl, '_blank')}><Eye className="w-4 h-4" /></Button>
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
