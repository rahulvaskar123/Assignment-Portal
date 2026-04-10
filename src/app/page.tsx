import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { GraduationCap, UserCog, NotebookPen } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 space-y-12">
      <div className="text-center space-y-4 max-w-2xl">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full text-primary mb-4">
          <NotebookPen className="w-12 h-12" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary font-headline">
          Assignment Portal
        </h1>
        <p className="text-lg text-muted-foreground">
          A secure, efficient platform for students to submit coursework and teachers to manage academic assessments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Card className="hover:shadow-lg transition-all border-t-4 border-t-primary">
          <CardHeader className="text-center">
            <GraduationCap className="w-12 h-12 mx-auto text-primary mb-2" />
            <CardTitle className="text-2xl">For Students</CardTitle>
            <CardDescription>
              Submit your assignments, check deadlines, and get AI feedback on your submissions.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            <Link href="/student/login" className="w-full">
              <Button size="lg" className="w-full text-lg">
                Student Access
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all border-t-4 border-t-accent">
          <CardHeader className="text-center">
            <UserCog className="w-12 h-12 mx-auto text-accent mb-2" />
            <CardTitle className="text-2xl">For Teachers</CardTitle>
            <CardDescription>
              Review student submissions, filter by subject, and download assignments securely.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            <Link href="/teacher/dashboard" className="w-full">
              <Button size="lg" variant="outline" className="w-full text-lg border-accent text-accent hover:bg-accent hover:text-white">
                Teacher Access
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
