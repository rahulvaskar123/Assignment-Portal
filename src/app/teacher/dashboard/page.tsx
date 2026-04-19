
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
} from "@/accordion";
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

const COURSE_DATA: Record<string, string[]> = {
  "1st Year": ["Engineering Mathematics", "Engineering Physics", "C Programming", "Basic Electrical Engineering", "Engineering Mechanics"],
  "2nd Year": ["Data Structures", "Computer Organization & Architecture", "Database Management System", "Discrete Structures", "Principle of Communication"],
  "3rd Year": ["Software Engineering", "Computer Network", "Operating System", "Theory of Computation", "Web Development"],
  "4th Year": ["Big Data Analytics", "Blockchain", "Cloud Computing", "Digital Business Management"]
};

export default function TeacherDashboard() {
  const [userName, setUserName] = useState('');
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
  const [targetSubject, setTargetSubject] = useState('');
  const [newFile, setNewFile] = useState<File | null>(null);

  const router = useRouter();
  const { toast } = useToast();

  const loadData = async () => {
    try {
      const assRes = await fetch('/api/assignments?type=assignments&t=' + Date.now(), { cache: 'no-store' });
      const allAss = await assRes.json();
      setAssignments(Array.isArray(allAss) ? allAss : []);

      const subRes = await fetch('/api/assignments?type=submissions&t=' + Date.now(), { cache: 'no-store' });
      const allSubs = await subRes.json();
      setAllSubmissions(Array.isArray(allSubs) ? allSubs : []);
    } catch (e) {
      toast({ title: "Sync Error", description: "Could not fetch classroom data from S3.", variant: "destructive" });
    }
  };

  useEffect(() => {
    setMounted(true);
    const userType = localStorage.getItem('userType');
    const storedName = localStorage.getItem('userName');
    
    if (userType !== 'teacher') {
      window.location.href = '/teacher/login';
    } else {
      setUserName(storedName || 'Professor');
      loadData();
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    // Force a full reload to clear any in-memory router state
    window.location.href = '/';
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
    if (!newTitle || !newDesc || !newDueDate || !targetYear || !targetSubject) return;

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
            subject: targetSubject,
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
        subject: targetSubject,
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
        description: `Assignment posted for ${targetSubject} (${targetYear}).`,
      });
      loadData();
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
    loadData();
    toast({ title: "Assignment Deleted", description: "Reference removed from S3." });
  };

  const refreshSubmissions = async () => {
    setIsLoading(true);
    await loadData();
    setIsLoading(false);
    toast({ title: "Updated", description: "Latest classroom data fetched from S3." });
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
              <p className="text-sm text-white/80">{userName} | Multi-Class Hub</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-white border-white/20 bg-white/10 hidden md:flex">
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
                    <Label htmlFor="title">Assignment Title</Label>
                    <Input id="title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Lab 1: Data structures" required />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Target Year</Label>
                      <Select value={targetYear} onValueChange={(val) => {
                        setTargetYear(val);
                        setTargetSubject('');
                      }} required>
                        <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
                        <SelectContent>
                          {Object.keys(COURSE_DATA).map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Subject</Label>
                      <Select value={targetSubject} onValueChange={setTargetSubject} required disabled={!targetYear}>
                        <SelectTrigger><SelectValue placeholder="Subject" /></SelectTrigger>
                        <SelectContent>
                          {targetYear && COURSE_DATA[targetYear].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="desc">Description</Label>
                    <Textarea id="desc" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Briefly describe the task..." required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input id="dueDate" type="date" value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Reference (Optional)</Label>
                    <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/40 border-border">
                      <UploadCloud className="w-5 h-5 text-muted-foreground mb-1" />
                      <p className="text-[10px] text-muted-foreground">{newFile ? newFile.name : "Attach File"}</p>
                      <input type="file" className="hidden" onChange={(e) => setNewFile(e.target.files?.[0] || null)} />
                    </label>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={isPosting}>
                      {isPosting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Post to Classroom"}
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
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Global Assignment Registry</h2>
          <Button variant="outline" size="sm" onClick={refreshSubmissions} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} /> Sync Cloud
          </Button>
        </div>

        <div className="space-y-6">
          {Object.keys(COURSE_DATA).map(year => {
            const yearAssignments = assignments.filter(a => a.year === year);
            if (yearAssignments.length === 0) return null;

            return (
              <div key={year} className="space-y-4">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-accent" />
                  <h3 className="text-lg font-bold text-slate-700">{year} Posts</h3>
                  <Badge variant="outline" className="text-[10px]">{yearAssignments.length} Assignments</Badge>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {yearAssignments.map((assignment) => {
                    const assignmentSubmissions = allSubmissions.filter(s => s.assignmentId === assignment.id);
                    return (
                      <Card key={assignment.id} className="overflow-hidden border-none shadow-sm">
                        <div className="bg-primary/5 p-4 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-accent hover:bg-accent text-[10px]">{assignment.subject}</Badge>
                              <h3 className="text-sm font-bold text-slate-800">{assignment.title}</h3>
                            </div>
                            <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                              <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> Due: {assignment.dueDate}</span>
                              <span className="flex items-center"><Users className="w-3 h-3 mr-1" /> {assignmentSubmissions.length} Submissions</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {assignment.s3Key && (
                              <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => handlePreview(assignment.s3Key!)}>
                                <Eye className="w-3 h-3 mr-1" /> Reference
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" className="h-7 text-[10px] text-destructive hover:text-destructive" onClick={() => handleDeleteAssignment(assignment.id)}>
                              <Trash2 className="w-3 h-3 mr-1" /> Remove
                            </Button>
                          </div>
                        </div>
                        <CardContent className="p-0">
                          <Accordion type="single" collapsible>
                            <AccordionItem value="submissions" className="border-none">
                              <AccordionTrigger className="px-6 py-2 hover:no-underline text-xs font-medium text-primary">View Student Submissions</AccordionTrigger>
                              <AccordionContent className="px-6 pb-4 pt-0">
                                {assignmentSubmissions.length > 0 ? (
                                  <div className="divide-y border rounded overflow-hidden bg-slate-50/30">
                                    {assignmentSubmissions.map((sub) => (
                                      <div key={sub.id} className="p-3 flex justify-between items-center hover:bg-slate-50">
                                        <div className="flex items-center gap-3">
                                          <div className="bg-white p-1.5 rounded-full border shadow-sm text-accent"><User className="w-3 h-3" /></div>
                                          <div>
                                            <p className="text-xs font-bold text-slate-700">{sub.studentName || sub.studentId}</p>
                                            <p className="text-[9px] text-muted-foreground">{sub.date}</p>
                                          </div>
                                        </div>
                                        <Button variant="ghost" size="sm" className="text-primary h-7 text-[10px]" onClick={() => handlePreview(sub.s3Key)}>
                                          <ExternalLink className="w-3 h-3 mr-1" /> Review S3
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="py-4 text-center text-[10px] text-muted-foreground italic">No submissions yet.</div>
                                )}
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {assignments.length === 0 && (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border">
              <PlusCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">Your Global Registry is empty. Post your first assignment!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
