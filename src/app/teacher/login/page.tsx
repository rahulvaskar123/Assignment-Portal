
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { UserCog, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function TeacherLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
    // If already logged in, redirect to dashboard
    const userType = localStorage.getItem('userType');
    if (userType === 'teacher') {
      router.push('/teacher/dashboard');
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const normalizedEmail = email.toLowerCase().trim();

    // Simulate database lookup from our "global" registry
    setTimeout(() => {
      const teachers = JSON.parse(localStorage.getItem('all_global_teachers') || '[]');
      const teacher = teachers.find((t: any) => 
        t.email.toLowerCase().trim() === normalizedEmail && 
        t.password === password
      );

      if (teacher) {
        localStorage.setItem('userType', 'teacher');
        localStorage.setItem('userName', teacher.name);
        localStorage.setItem('teacherSubject', teacher.subject);
        localStorage.setItem('teacherYear', teacher.year);
        
        toast({
          title: "Welcome back!",
          description: `Logged in as Prof. ${teacher.name}`,
        });
        
        router.push('/teacher/dashboard');
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
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
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-accent mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Home
        </Link>
        
        <Card className="shadow-xl border-t-4 border-t-accent">
          <CardHeader className="space-y-1 text-center">
            <UserCog className="w-10 h-10 mx-auto text-accent mb-2" />
            <CardTitle className="text-2xl font-headline text-accent">Teacher Sign In</CardTitle>
            <CardDescription>
              Access your classroom and manage submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="vinayak.bharadi@uni.edu" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
              <Button type="submit" className="w-full mt-2 bg-accent hover:bg-accent/90" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {isLoading ? "Verifying..." : "Sign In to Workspace"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
            <div>
              New here? <Link href="/teacher/register" className="text-accent font-semibold hover:underline">Create a classroom</Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
