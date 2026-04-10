
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { UserCog, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function TeacherRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [subject, setSubject] = useState('');
  const [year, setYear] = useState('');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && password && subject && year) {
      const teachers = JSON.parse(localStorage.getItem('all_global_teachers') || '[]');
      
      // Check if already exists
      const existing = teachers.find((t: any) => t.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        toast({
          title: "Registration Failed",
          description: "An account with this email already exists. Please log in.",
          variant: "destructive"
        });
        return;
      }

      const newTeacher = { name, email, password, subject, year };
      localStorage.setItem('all_global_teachers', JSON.stringify([...teachers, newTeacher]));

      // Create session
      localStorage.setItem('userType', 'teacher');
      localStorage.setItem('userName', name);
      localStorage.setItem('teacherSubject', subject);
      localStorage.setItem('teacherYear', year);

      toast({
        title: "Teacher Registration Successful",
        description: `Welcome, Prof. ${name}! Your classroom for ${subject} (${year}) is ready.`,
      });
      
      router.push('/teacher/dashboard');
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
            <UserCog className="w-10 h-10 mx-auto text-accent mb-2" />
            <CardTitle className="text-2xl font-headline text-accent">Teacher Registration</CardTitle>
            <CardDescription>
              Set up your classroom profile and manage student submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Dr. Vinayak Bharadi" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="vinayak.bharadi@uni.edu" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject Specialty</Label>
                  <Select value={subject} onValueChange={setSubject} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Big Data Analytics">Big Data Analytics</SelectItem>
                      <SelectItem value="Blockchain">Blockchain</SelectItem>
                      <SelectItem value="Cloud Computing">Cloud Computing</SelectItem>
                      <SelectItem value="Digital Business Management">Digital Business Management</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Teaching Year</Label>
                  <Select value={year} onValueChange={setYear} required>
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              <Button type="submit" className="w-full mt-4 bg-accent hover:bg-accent/90">
                Complete Setup
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
