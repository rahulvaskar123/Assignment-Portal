
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { 
  LogOut, 
  RefreshCw, 
  FileText, 
  Users, 
  CalendarDays, 
  PlusCircle, 
  Bell,
  User,
  Clock,
  ExternalLink,
  Trash2,
  Eye,
  UploadCloud,
  Loader2,
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

const ENROLLED_STUDENTS = 67;

export default function TeacherDashboard() {
  const [userName, setUserName] = useState('');
  const [teacherSubject, setTeacherSubject] = useState('');
  const [teacherYear, setTeacherYear] = useState('');
  const [allSubmissions, setAllSubmissions] = useState<Submission[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [targetYear, setTargetYear] = useState('');
  const [newFile, setNewFile] = useState<File | null>(null);

  const router = useRouter();
  const { toast } = useToast();

  const loadData = async (subject: string) => {
    try {
      const assRes = await fetch('/api/assignments?type=assignments');
      const allAss = await assRes.json();
      setAssignments(allAss.filter((a: Assignment) => a.subject === subject));

      const subRes = await fetch('/api/assignments?type=submissions');
      const allSubs = await subRes.json();
      setAllSubmissions(allSubs.filter((s: Submission) => s.subject === subject));
    } catch (e) {
      toast({ title: "Sync Error", description: "Could not fetch classroom data from S3.", variant: "destructive" });
    }
  };

  useEffect(() => {
    setMounted(true);
    const userType = localStorage.getItem('userType');
    const storedName = localStorage.getItem('userName');
    const storedSubject = localStorage.getItem('teacherSubject');
    const storedYear = localStorage.getItem('teacherYear');
    
    if (userType !== 'teacher') {
      router.push('/teacher/login');
    } else {
      setUserName(storedName || 'Professor');
      setTeacherSubject(storedSubject || 'Unassigned');
      setTeacherYear(storedYear || '1st Year');
      setTargetYear(storedYear || '1st Year');
      loadData(storedSubject || '');
    }
  }, [router]);

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
      toast({ title: "Error", description: "AWS file retrieval failed.", variant: "destructive" });
    }
  };

  const handlePostAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc || !newDueDate || !targetYear) return;

    setIsPosting(true);
    let s3Key = '';

    try {
      if (newFile) {
        const presignedRes = await fetch('/api/upload/presigned', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: newFile.name,
            contentType: newFile.type,
            studentId: 'TEACHER',
            subject: teacherSubject,
          }),
        });
        const { url, key } = await presignedRes.json();
        
        await fetch(url, {
          method: 'PUT',
          body: newFile,
          headers: { 'Content-Type': newFile.type },
        });
        s3Key = key;
      }

      const assignment: Assignment = {
        id: Math.random().toString(36).substr(2, 9),
        title: newTitle,
        description: newDesc,
        subject: teacherSubject,
        year: targetYear,
        dueDate: newDueDate,
        s3Key,
        fileName: newFile?.name
      };

      await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save-assignment', data: assignment }),
      });
      
      setIsDialogOpen(false);
      setNewTitle('');
      setNewDesc('');
      setNewDueDate('');
      setNewFile(null);

      toast({
        title: "AWS Sync Complete",
        description: `Assignment posted for ${targetYear}.`,
      });
      loadData(teacherSubject);
    } catch (error: any) {
      toast({ title: "Upload Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsPosting(false);
    }
  };

  const handleDeleteAssignment = async (id: string) => {
    await fetch('/api/assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete-assignment', data: { id } }),
    });
    loadData(teacherSubject);
    toast({ title: "Assignment Deleted", description: "Reference removed from S3." });
  };

  const refreshSubmissions = async () => {
    setIsLoading(true);
    await loadData(teacherSubject);
    setIsLoading(false);
    toast({ title: "Updated", description: "Latest student S3 references fetched." });
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-accent text-white p-6 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg"><FileText className="w-8 h-8" /></div>
            <div>
              <h1 className="text-2xl font-bold font-headline">Teacher Workspace</h1>
              <p className="text-sm text-white/80">{userName} | {teacherSubject}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-white border-white/20 bg-white/10">
              <Cloud className="w-3 h-3 mr-1" /> AWS S3 Backend
            </Badge>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary" className="bg-white text-accent hover:bg-white/90">
                  <PlusCircle className="w-4 h-4 mr-2" /> Post Assignment
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader><DialogTitle>New Assignment</DialogTitle></DialogHeader>
                <form onSubmit={handlePostAssignment} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. AWS Final Lab" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="desc">Description</Label>
                    <Textarea id="desc" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Briefly describe the task..." required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetYear">Target Year Level</Label>
                    <Select value={targetYear} onValueChange={setTargetYear} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1st Year">1st Year</SelectItem>
                        <SelectItem value="2nd Year">2nd Year</SelectItem>
                        <SelectItem value="3rd Year">3rd Year</SelectItem>
                        <SelectItem value="4th Year">4th Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input id="dueDate" type="date" value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Reference Document (Optional)</Label>
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/40 border-border transition-colors">
                      <UploadCloud className="w-6 h-6 text-muted-foreground mb-1" />
                      <p className="text-[10px] text-muted-foreground">{newFile ? newFile.name : "Attach Reference File"}</p>
                      <input type="file" className="hidden" onChange={(e) => setNewFile(e.target.files?.[0] || null)} />
                    </label>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={isPosting}>
                      {isPosting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      {isPosting ? "Uploading to S3..." : "Announce to Class"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white hover:bg-white/10">
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card shadow-sm border-l-4 border-l-accent">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center"><Users className="w-4 h-4 mr-1" /> Enrolled Students</CardDescription>
              <CardTitle className="text-4xl font-bold text-accent">{ENROLLED_STUDENTS}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-card shadow-sm border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center"><CalendarDays className="w-4 h-4 mr-1" /> My Profile Year</CardDescription>
              <CardTitle className="text-4xl font-bold text-primary">{teacherYear}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-card shadow-sm border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center"><Bell className="w-4 h-4 mr-1" /> Subject Posts</CardDescription>
              <CardTitle className="text-4xl font-bold text-green-500">{assignments.length}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Assignment Monitoring: {teacherSubject}</h2>
          <Button variant="outline" size="sm" onClick={refreshSubmissions} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Feed
          </Button>
        </div>

        <div className="space-y-4">
          {assignments.length > 0 ? (
            assignments.map((assignment) => {
              const assignmentSubmissions = allSubmissions.filter(s => s.assignmentId === assignment.id);
              const submissionPercentage = Math.round((assignmentSubmissions.length / ENROLLED_STUDENTS) * 100);
              return (
                <Card key={assignment.id} className="overflow-hidden border-none shadow-sm">
                  <div className="bg-primary/5 p-4 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-slate-800">{assignment.title} <Badge variant="secondary" className="ml-2 text-[10px]">{assignment.year}</Badge></h3>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> Due: {assignment.dueDate}</span>
                        <span className="flex items-center"><Users className="w-3 h-3 mr-1" /> {assignmentSubmissions.length} / {ENROLLED_STUDENTS} Submitted</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {assignment.s3Key && (
                        <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => handlePreview(assignment.s3Key!)}>
                          <Eye className="w-3 h-3 mr-1" /> Reference
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="h-8 text-xs text-destructive hover:text-destructive" onClick={() => handleDeleteAssignment(assignment.id)}>
                        <Trash2 className="w-3 h-3 mr-1" /> Remove Post
                      </Button>
                      <Badge variant="outline" className="bg-white">{submissionPercentage}% Turnover</Badge>
                    </div>
                  </div>
                  <CardContent className="p-0">
                    <Accordion type="single" collapsible>
                      <AccordionItem value="submissions" className="border-none">
                        <AccordionTrigger className="px-6 py-3 hover:no-underline text-sm font-medium text-primary">View Student Submissions</AccordionTrigger>
                        <AccordionContent className="px-6 pb-6 pt-0">
                          {assignmentSubmissions.length > 0 ? (
                            <div className="divide-y border rounded-lg overflow-hidden bg-slate-50/30">
                              {assignmentSubmissions.map((sub) => (
                                <div key={sub.id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-50 transition-colors">
                                  <div className="flex items-center gap-3">
                                    <div className="bg-white p-2 rounded-full border shadow-sm"><User className="w-4 h-4 text-accent" /></div>
                                    <div>
                                      <p className="text-sm font-bold text-slate-700">{sub.studentName || sub.studentId}</p>
                                      <p className="text-[10px] text-muted-foreground font-mono">{sub.studentId}</p>
                                    </div>
                                  </div>
                                  <div className="flex-1 px-4 min-w-0">
                                    <p className="text-xs font-medium truncate text-slate-600">{sub.fileName}</p>
                                    <p className="text-[10px] text-muted-foreground">Submitted on {sub.date}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10 h-8" onClick={() => handlePreview(sub.s3Key)}>
                                      <ExternalLink className="w-4 h-4 mr-1" /> Review S3 File
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="py-8 text-center text-sm text-muted-foreground italic border-2 border-dashed rounded-lg">No submissions yet.</div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border">
              <PlusCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">No assignments yet for {teacherSubject}.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
