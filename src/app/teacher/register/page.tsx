
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { UserCog, ArrowLeft, Loader2, Cloud } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

// Mumbai University IT Engineering Curriculum
const COURSE_DATA: Record<string, string[]> = {
  "1st Year": ["Engineering Mathematics", "Engineering Physics", "C Programming", "Basic Electrical Engineering", "Engineering Mechanics"],
  "2nd Year": ["Data Structures", "Computer Organization & Architecture", "Database Management System", "Discrete Structures", "Principle of Communication"],
  "3rd Year": ["Software Engineering", "Computer Network", "Operating System", "Theory of Computation", "Web Development"],
  "4th Year": ["Big Data Analytics", "Blockchain", "Cloud Computing", "Digital Business Management"]
};

export default function TeacherRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [subject, setSubject] = useState('');
  const [year, setYear] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && password && subject && year) {
      setIsLoading(true);
      const normalizedEmail = email.toLowerCase().trim();

      try {
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'register',
            userType: 'teacher',
            userData: { name, email: normalizedEmail, password, subject, year }
          }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('userType', 'teacher');
          localStorage.setItem('userName', name);
          localStorage.setItem('teacherSubject', subject);
          localStorage.setItem('teacherYear', year);

          toast({
            title: "AWS Setup Complete",
            description: `Teacher profile saved to cloud registry. Welcome, Prof. ${name}!`,
          });
          
          router.push('/teacher/dashboard');
        } else {
          toast({
            title: "Registration Failed",
            description: data.error || "Could not save profile to AWS.",
            variant: "destructive"
          });
          setIsLoading(false);
        }
      } catch (error) {
        toast({
          title: "Connection Error",
          description: "Failed to connect to S3 Registry.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-slate-50">
      <div className="w-full max-w-lg space-y-4">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-accent mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Home
        </Link>
        
        <Card className="shadow-xl border-t-4 border-t-accent">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <Badge variant="outline" className="text-[10px] text-accent border-accent/20 bg-accent/5">
                <Cloud className="w-3 h-3 mr-1" /> AWS CLOUD REGISTRY
              </Badge>
            </div>
            <UserCog className="w-10 h-10 mx-auto text-accent mb-2" />
            <CardTitle className="text-2xl font-headline text-accent">Teacher Registration</CardTitle>
            <CardDescription>
              Set up your profile and select your primary classroom specialty
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="e.g. Dr. Vinayak Bharadi" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="e.g. vinayak.bharadi@uni.edu" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Primary Year Specialty</Label>
                  <Select value={year} onValueChange={(val) => {
                    setYear(val);
                    setSubject('');
                  }} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(COURSE_DATA).map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Primary Subject Specialty</Label>
                  <Select value={subject} onValueChange={setSubject} required disabled={!year}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {year && COURSE_DATA[year].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              <Button type="submit" className="w-full mt-4 bg-accent hover:bg-accent/90" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Complete AWS Setup"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center text-sm text-muted-foreground flex justify-center">
            Already have a classroom? <Link href="/teacher/login" className="text-accent font-semibold hover:underline ml-1">Sign In</Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
