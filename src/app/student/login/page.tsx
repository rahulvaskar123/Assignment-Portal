
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { GraduationCap, ArrowLeft, Loader2, Cloud } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !password) return;

    setIsLoading(true);
    const normalizedId = studentId.toUpperCase().trim();

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          userType: 'student',
          userData: { id: normalizedId, password }
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('userType', 'student');
        localStorage.setItem('userId', data.user.studentId);
        localStorage.setItem('userName', data.user.name);
        
        toast({
          title: "Login Successful",
          description: `Welcome back to the AWS Cloud, ${data.user.name}`,
        });
        
        router.push('/student/upload');
      } else {
        toast({
          title: "Access Denied",
          description: data.error || "Invalid Student ID or password.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Failed to connect to AWS Registry.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
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
            <div className="flex justify-center mb-2">
              <Badge variant="outline" className="text-[10px] text-primary border-primary/20 bg-primary/5">
                <Cloud className="w-3 h-3 mr-1" /> AWS S3 AUTH
              </Badge>
            </div>
            <GraduationCap className="w-10 h-10 mx-auto text-primary mb-2" />
            <CardTitle className="text-2xl font-headline">Student Login</CardTitle>
            <CardDescription>
              Access your classroom data from the AWS Cloud
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
                {isLoading ? "Fetching AWS Record..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
            <div>
              Don't have an account? <Link href="/student/register" className="text-primary font-semibold hover:underline">Register to AWS Cloud</Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
