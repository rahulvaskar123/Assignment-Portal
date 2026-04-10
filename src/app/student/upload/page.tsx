
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  FileText
} from 'lucide-react';
import { assignmentVerificationAssistant } from '@/ai/flows/assignment-verification-assistant';
import { useToast } from '@/hooks/use-toast';

type Submission = {
  id: string;
  subject: string;
  fileName: string;
  date: string;
  status: 'Submitted' | 'Reviewed';
  fileUrl?: string; // URL for previewing
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
  const [subject, setSubject] = useState<string>('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<{ isAligned: boolean; suggestion: string } | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
    const storedId = localStorage.getItem('userId');
    const storedName = localStorage.getItem('userName');
    const userType = localStorage.getItem('userType');
    
    if (!storedId || userType !== 'student') {
      router.push('/student/login');
    } else {
      setUserId(storedId);
      if (storedName) setUserName(storedName);
      
      // Load mock submissions
      const mockSubmissions: Submission[] = [
        { id: '1', subject: 'Cloud Computing', fileName: 'aws_arch_assignment.pdf', date: '2024-05-01', status: 'Reviewed' },
        { id: '2', subject: 'Blockchain', fileName: 'smart_contract_report.docx', date: '2024-05-08', status: 'Submitted' },
      ];
      setSubmissions(mockSubmissions);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  const verifyWithAI = async () => {
    if (!subject || !description) return;
    setIsVerifying(true);
    try {
      const result = await assignmentVerificationAssistant({
        subject: subject as any,
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
    if (!file || !subject || !userName) return;

    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      // Create a local preview URL for the uploaded file
      const previewUrl = URL.createObjectURL(file);
      
      const newSubmission: Submission = {
        id: Math.random().toString(36).substr(2, 9),
        subject,
        fileName: file.name,
        date: new Date().toISOString().split('T')[0],
        status: 'Submitted',
        fileUrl: previewUrl
      };
      
      setSubmissions([newSubmission, ...submissions]);
      setIsUploading(false);
      toast({
        title: "Submission Successful",
        description: "Your assignment has been uploaded to your classroom.",
      });
      
      // Reset form
      setFile(null);
      setAiFeedback(null);
      setDescription('');
      setSubject('');
    }, 1500);
  };

  const handleDeleteSubmission = (id: string) => {
    const subToDelete = submissions.find(s => s.id === id);
    if (subToDelete?.status === 'Reviewed') {
      toast({
        title: "Action Denied",
        description: "Reviewed assignments cannot be deleted.",
        variant: "destructive"
      });
      return;
    }

    // Revoke object URL to free memory if it exists
    if (subToDelete?.fileUrl) {
      URL.revokeObjectURL(subToDelete.fileUrl);
    }

    setSubmissions(submissions.filter(s => s.id !== id));
    toast({
      title: "Submission Deleted",
      description: "The assignment has been removed from your history.",
    });
  };

  const handlePreviewSubmission = (sub: Submission) => {
    if (sub.fileUrl) {
      // Open the local file preview in a new tab
      window.open(sub.fileUrl, '_blank');
    } else {
      // For mock submissions that don't have a physical file attached
      toast({
        title: "Preview Unavailable",
        description: `This is a historical mock entry. Only files uploaded in this session can be previewed.`,
      });
    }
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
          <Button variant="ghost" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>

        <Tabs defaultValue="classes" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mb-8">
            <TabsTrigger value="classes">My Classes</TabsTrigger>
            <TabsTrigger value="history">Submission History</TabsTrigger>
          </TabsList>

          <TabsContent value="classes" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SUBJECTS.map((s) => (
                <Card key={s} className="hover:shadow-md transition-shadow border-l-4 border-l-primary">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-bold">{s}</CardTitle>
                    <BookOpen className="w-5 h-5 text-primary opacity-50" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Class Year: 3rd Year</p>
                    <Button variant="outline" size="sm" onClick={() => setSubject(s)} className="w-full">
                      Submit Assignment
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {subject && (
              <Card className="shadow-lg border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-primary">
                    <UploadCloud className="w-5 h-5 mr-2" />
                    Submit to {subject}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpload} className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="description">Assignment Overview (AI verified)</Label>
                        <Button 
                          type="button" 
                          variant="link" 
                          size="sm" 
                          className="text-accent h-auto p-0"
                          onClick={verifyWithAI}
                          disabled={isVerifying || !description}
                        >
                          {isVerifying ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <FileCheck className="w-3 h-3 mr-1" />}
                          Check Alignment
                        </Button>
                      </div>
                      <Textarea 
                        id="description" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Briefly describe your assignment topic..." 
                        className="min-h-[100px]"
                      />
                    </div>

                    {aiFeedback && (
                      <Alert className={aiFeedback.isAligned ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}>
                        <AlertTitle className="flex items-center text-sm">
                          {aiFeedback.isAligned ? <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" /> : <AlertCircle className="w-4 h-4 mr-2 text-amber-600" />}
                          AI Guidance
                        </AlertTitle>
                        <AlertDescription className="text-xs mt-1">
                          {aiFeedback.suggestion}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-4">
                      <Label>Attachment</Label>
                      <div className="flex items-center justify-center w-full">
                        <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/40 border-border transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                            <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />
                            <p className="text-xs text-muted-foreground">
                              {file ? <span className="text-primary font-medium">{file.name}</span> : "PDF, ZIP, or DOCX (Max 10MB)"}
                            </p>
                          </div>
                          <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} required />
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button type="submit" className="flex-1" disabled={isUploading || !file}>
                        {isUploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</> : "Post to Classroom"}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => { setSubject(''); setFile(null); setAiFeedback(null); }}>
                        Cancel
                      </Button>
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
                        <div className="bg-primary/10 p-2 rounded-lg text-primary">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-slate-800">{subj}</p>
                          <p className="text-xs text-muted-foreground">{subjectSubmissions.length} Assignment(s)</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-0 pb-4">
                      <div className="divide-y border-t mt-2">
                        {subjectSubmissions.length > 0 ? (
                          subjectSubmissions.map((sub) => (
                            <div key={sub.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
                              <div className="flex items-center space-x-4 flex-1">
                                <div className="bg-slate-100 p-2 rounded-lg text-slate-500">
                                  <FileText className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold truncate text-slate-700">{sub.fileName}</p>
                                  <div className="flex items-center text-[10px] text-muted-foreground mt-1">
                                    <Clock className="w-3 h-3 mr-1" /> {sub.date}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${sub.status === 'Reviewed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                  {sub.status}
                                </span>
                                
                                <div className="flex items-center gap-1">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                                    onClick={() => handlePreviewSubmission(sub)}
                                    title="Preview Document"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  
                                  {sub.status !== 'Reviewed' && (
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                      onClick={() => handleDeleteSubmission(sub.id)}
                                      title="Delete Submission"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-8 text-center text-sm text-muted-foreground italic">
                            No assignments submitted for this class yet.
                          </div>
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
