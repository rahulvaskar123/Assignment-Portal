
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

export default function StudentRegister() {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !studentId || !password) return;
    
    setIsLoading(true);
    const normalizedId = studentId.toUpperCase().trim();

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          userType: 'student',
          userData: { name, studentId: normalizedId, password }
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('userType', 'student');
        localStorage.setItem('userId', normalizedId);
        localStorage.setItem('userName', name);
        
        toast({
          title: "AWS Registration Complete",
          description: `Profile created in S3 Registry. Welcome, ${name}!`,
        });
        
        router.push('/student/upload');
      } else {
        toast({
          title: "Registration Failed",
          description: data.error || "Could not save to AWS.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    } catch (error) {
      toast({
        title: "AWS Connection Error",
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
        <Link href="/student/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Login
        </Link>
        
        <Card className="shadow-xl border-t-4 border-t-primary">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <Badge variant="outline" className="text-[10px] text-primary border-primary/20 bg-primary/5">
                <Cloud className="w-3 h-3 mr-1" /> AWS CLOUD PROFILE
              </Badge>
            </div>
            <GraduationCap className="w-10 h-10 mx-auto text-primary mb-2" />
            <CardTitle className="text-2xl font-headline">Student Registration</CardTitle>
            <CardDescription>
              Create your permanent profile in the AWS Registry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  placeholder="e.g. Rahul" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>
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
                {isLoading ? "Syncing with AWS..." : "Create Cloud Account"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center text-sm text-muted-foreground flex justify-center">
            Already have an account? <Link href="/student/login" className="text-primary font-semibold hover:underline ml-1">Sign In</Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
