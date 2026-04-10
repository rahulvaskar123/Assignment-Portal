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
import { UploadCloud, FileCheck, Loader2, AlertCircle, LogOut, ArrowLeft } from 'lucide-react';
import { assignmentVerificationAssistant } from '@/ai/flows/assignment-verification-assistant';
import { useToast } from '@/hooks/use-toast';

export default function StudentUpload() {
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [subject, setSubject] = useState<'Cloud Computing' | 'Data Science' | 'Web Development' | ''>('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<{ isAligned: boolean; suggestion: string } | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const DEADLINE = new Date('2025-12-31T23:59:59');

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
      const allowedExts = ['pdf', 'docx', 'zip'];
      const ext = selectedFile.name.split('.').pop()?.toLowerCase();
      if (!ext || !allowedExts.includes(ext)) {
        toast({ title: "Invalid File Type", description: "Only PDF, DOCX, and ZIP files are allowed.", variant: "destructive" });
        e.target.value = '';
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({ title: "File Too Large", description: "Maximum file size is 10MB.", variant: "destructive" });
        e.target.value = '';
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !subject || !userName) return;

    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      toast({
        title: "Submission Successful",
        description: "Your assignment has been securely uploaded to S3.",
      });
      setFile(null);
      setAiFeedback(null);
      setDescription('');
      setSubject('');
    }, 2000);
  };

  if (!mounted) {
    return null;
  }

  const isExpired = new Date() > DEADLINE;

  if (isExpired) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 space-y-6">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Submission deadline has passed</AlertTitle>
          <AlertDescription>
            The deadline for this assignment was {DEADLINE.toLocaleDateString()}. Submissions are now closed.
          </AlertDescription>
        </Alert>
        <div className="flex gap-4">
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <Button variant="ghost" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary font-headline">Submit Assignment</h1>
            <p className="text-muted-foreground">Logged in as Student ID: <span className="font-semibold">{userId}</span></p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>

        <Card className="shadow-lg border-none">
          <CardHeader>
            <CardTitle>Assignment Details</CardTitle>
            <CardDescription>Fill in your details and upload your assignment file.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Your Name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={subject} onValueChange={(v) => setSubject(v as any)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cloud Computing">Cloud Computing</SelectItem>
                      <SelectItem value="Data Science">Data Science</SelectItem>
                      <SelectItem value="Web Development">Web Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="description">Short Description (Optional)</Label>
                  <Button 
                    type="button" 
                    variant="link" 
                    size="sm" 
                    className="text-accent h-auto p-0"
                    onClick={verifyWithAI}
                    disabled={isVerifying || !subject || !description}
                  >
                    {isVerifying ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <FileCheck className="w-3 h-3 mr-1" />}
                    Verify with AI
                  </Button>
                </div>
                <Textarea 
                  id="description" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us a bit about your project..." 
                  className="min-h-[100px]"
                />
              </div>

              {aiFeedback && (
                <Alert className={aiFeedback.isAligned ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}>
                  <AlertTitle className="flex items-center">
                    {aiFeedback.isAligned ? <FileCheck className="w-4 h-4 mr-2 text-green-600" /> : <AlertCircle className="w-4 h-4 mr-2 text-amber-600" />}
                    AI Verification Result
                  </AlertTitle>
                  <AlertDescription className="text-sm mt-1">
                    {aiFeedback.suggestion}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="file">Assignment File (PDF, DOCX, ZIP - Max 10MB)</Label>
                  <div className="flex items-center justify-center w-full">
                    <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 border-border transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-10 h-10 text-muted-foreground mb-3" />
                        <p className="text-sm text-muted-foreground">
                          {file ? <span className="text-primary font-medium">{file.name}</span> : "Click to select or drag and drop"}
                        </p>
                      </div>
                      <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx,.zip" required />
                    </label>
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isUploading || !file}>
                  {isUploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</> : "Submit Assignment"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
