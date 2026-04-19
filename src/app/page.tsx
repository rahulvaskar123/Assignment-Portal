
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { GraduationCap, UserCog, NotebookPen, BookOpen, Layers, FileCheck, Cloud, Server } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 space-y-12 bg-slate-50">
      <div className="text-center space-y-4 max-w-2xl">
        <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-2xl text-primary mb-6 shadow-sm">
          <NotebookPen className="w-16 h-16" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <Badge variant="outline" className="bg-white text-xs py-1 text-primary border-primary/20 mb-2">
            <Cloud className="w-3 h-3 mr-1" /> CLOUD DEPLOYMENT ACTIVE
          </Badge>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-primary font-headline">
            Classroom Hub
          </h1>
          <p className="text-xl text-muted-foreground font-medium">
            The next-generation assignment portal for academic excellence.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl">
        <Card className="hover:shadow-2xl transition-all border-none bg-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <GraduationCap className="w-32 h-32 rotate-12 group-hover:rotate-0 transition-transform" />
          </div>
          <CardHeader className="text-center pt-8">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">For Students</CardTitle>
            <CardDescription className="text-lg px-4">
              Access your classes, submit assignments, and track your academic progress in real-time.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4 pb-8">
            <Link href="/student/login" className="w-full">
              <Button size="lg" className="w-full text-lg h-14 rounded-xl shadow-lg">
                Enter Student Lounge
              </Button>
            </Link>
          </CardContent>
          <div className="h-2 bg-primary" />
        </Card>

        <Card className="hover:shadow-2xl transition-all border-none bg-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <UserCog className="w-32 h-32 -rotate-12 group-hover:rotate-0 transition-transform" />
          </div>
          <CardHeader className="text-center pt-8">
            <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCog className="w-8 h-8 text-accent" />
            </div>
            <CardTitle className="text-3xl font-bold">For Teachers</CardTitle>
            <CardDescription className="text-lg px-4">
              Manage classrooms, track student progress, and organize course years with S3 storage.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4 pb-8">
            <div className="grid grid-cols-2 gap-4">
              <Link href="/teacher/login" className="w-full">
                <Button size="lg" className="w-full text-lg h-14 rounded-xl bg-accent hover:bg-accent/90">
                  Login
                </Button>
              </Link>
              <Link href="/teacher/register" className="w-full">
                <Button size="lg" variant="outline" className="w-full text-lg h-14 rounded-xl border-accent text-accent hover:bg-accent hover:text-white transition-colors">
                  Register
                </Button>
              </Link>
            </div>
          </CardContent>
          <div className="h-2 bg-accent" />
        </Card>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-wrap justify-center gap-8 text-muted-foreground/60">
          <div className="flex items-center"><BookOpen className="w-4 h-4 mr-2" /> Structured Learning</div>
          <div className="flex items-center"><Layers className="w-4 h-4 mr-2" /> Batch Management</div>
          <div className="flex items-center"><FileCheck className="w-4 h-4 mr-2" /> Digital Submissions</div>
        </div>
        
        <div className="flex items-center px-4 py-2 bg-slate-200/50 rounded-full text-[10px] font-mono text-slate-500 gap-3 border border-slate-300/50">
          <div className="flex items-center gap-1"><Server className="w-3 h-3" /> RUNTIME: AWS LAMBDA (ap-south-1)</div>
          <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
          <div className="flex items-center gap-1 font-bold">PROD v1.0.4</div>
        </div>
      </div>
    </div>
  );
}
