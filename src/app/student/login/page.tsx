
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { GraduationCap, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function StudentLogin() {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
    const userType = localStorage.getItem('userType');
    if (userType === 'student') {
      router.push('/student/upload');
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !password) return;

    setIsLoading(true);
    const normalizedId = studentId.toUpperCase().trim();

    // Simulate database lookup
    setTimeout(() => {
      const students = JSON.parse(localStorage.getItem('all_global_students') || '[]');
      const student = students.find((s: any) => 
        s.studentId === normalizedId && 
        s.password === password
      );

      if (student) {
        localStorage.setItem('userType', 'student');
        localStorage.setItem('userId', student.studentId);
        localStorage.setItem('userName', student.name);
        
        toast({
          title: "Login Successful",
          description: `Welcome back, ${student.name}`,
        });
        
        router.push('/student/upload');
      } else {
        toast({
          title: "Access Denied",
          description: "Invalid Student ID or password. Please register if you haven't yet.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    }, 1000);
  };

  if (!mounted) return null;

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-slate-50">
      <div className="w-full max-w-md space-y-4">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Home
        </Link>
        
        <Card className="shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <GraduationCap className="w-10 h-10 mx-auto text-primary mb-2" />
            <CardTitle className="text-2xl font-headline">Student Login</CardTitle>
            <CardDescription>
              Enter your student ID to access the upload portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input 
                  id="studentId" 
                  placeholder="e.g. STU12345" 
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
              <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {isLoading ? "Verifying..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
            <div>
              Don't have an account? <Link href="/student/register" className="text-primary font-semibold hover:underline">Register now</Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
