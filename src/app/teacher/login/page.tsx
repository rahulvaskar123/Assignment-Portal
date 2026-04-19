
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { UserCog, ArrowLeft, Loader2, Cloud } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function TeacherLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
    const userType = localStorage.getItem('userType');
    const userName = localStorage.getItem('userName');
    // Only redirect if a valid teacher session exists
    if (userType === 'teacher' && userName) {
      router.push('/teacher/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const normalizedEmail = email.toLowerCase().trim();

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          userType: 'teacher',
          userData: { email: normalizedEmail, password }
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.clear(); // Clear any previous stale session data
        localStorage.setItem('userType', 'teacher');
        localStorage.setItem('userName', data.user.name);
        localStorage.setItem('teacherSubject', data.user.subject);
        localStorage.setItem('teacherYear', data.user.year);
        
        toast({
          title: "Welcome back!",
          description: `Logged in to AWS Workspace as Prof. ${data.user.name}`,
        });
        
        router.push('/teacher/dashboard');
      } else {
        toast({
          title: "Login Failed",
          description: data.error || "Invalid email or password.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    } catch (error) {
      toast({
        title: "AWS Error",
        description: "Failed to connect to S3 Registry.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
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
            <div className="flex justify-center mb-2">
              <Badge variant="outline" className="text-[10px] text-accent border-accent/20 bg-accent/5">
                <Cloud className="w-3 h-3 mr-1" /> AWS S3 AUTH
              </Badge>
            </div>
            <UserCog className="w-10 h-10 mx-auto text-accent mb-2" />
            <CardTitle className="text-2xl font-headline text-accent">Teacher Sign In</CardTitle>
            <CardDescription>
              Access your cloud workspace and management tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="e.g. vinayak.bharadi@uni.edu" 
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
                {isLoading ? "Verifying with AWS..." : "Sign In to Workspace"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
            <div>
              New here? <Link href="/teacher/register" className="text-accent font-semibold hover:underline">Create a cloud classroom</Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
