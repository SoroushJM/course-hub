import React, { useEffect } from 'react';
import { useCurriculum } from '../store';
import { CourseGroup } from '../components/CourseGroup';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Download, Upload, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CourseGroup as ICourseGroup, Course } from '../types';

export const Dashboard: React.FC = () => {
  const { template, userProgress, loadTemplate, resetProgress, isLoading } = useCurriculum();

  useEffect(() => {
    if (!template && !isLoading) {
      // Load default template if none selected
      // In a real app, we might check URL params or local storage for last active template
      loadTemplate('cs-1402');
    }
  }, [template, isLoading, loadTemplate]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">در حال بارگذاری...</div>;
  }

  if (!template) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p>هیچ چارت درسی یافت نشد.</p>
        <Button onClick={() => loadTemplate('cs-1402')}>بارگذاری چارت پیش‌فرض (علوم کامپیوتر)</Button>
      </div>
    );
  }

  // Calculate total progress
  const totalPassed = userProgress.passedCourses.reduce((acc: number, p: { courseId: string }) => {
    const course = template.groups.flatMap((g: ICourseGroup) => g.courses).find((c: Course) => c.id === p.courseId);
    return acc + (course ? course.units : 0);
  }, 0);

  const progressPercent = Math.min(100, (totalPassed / template.totalUnitsRequired) * 100);

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(userProgress));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "progress.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (event.target.files && event.target.files[0]) {
      fileReader.readAsText(event.target.files[0], "UTF-8");
      fileReader.onload = (e) => {
        if (e.target?.result) {
          const parsed = JSON.parse(e.target.result as string);
          // Basic validation could go here
          useCurriculum.setState({ userProgress: parsed });
        }
      };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">واحد های پاس شده</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPassed} / {template.totalUnitsRequired}</div>
            <Progress value={progressPercent} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {progressPercent.toFixed(1)}% از کل دوره
            </p>
          </CardContent>
        </Card>
        
        {/* Add more stats cards here if needed */}
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-muted/50 p-4 rounded-lg">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="ml-2 h-4 w-4" />
            خروجی گرفتن
          </Button>
          <div className="relative">
            <input
              type="file"
              id="import-file"
              className="hidden"
              accept=".json"
              onChange={handleImport}
            />
            <Button variant="outline" size="sm" asChild>
              <label htmlFor="import-file" className="cursor-pointer">
                <Upload className="ml-2 h-4 w-4" />
                بارگذاری فایل
              </label>
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
           <Button variant="destructive" size="sm" onClick={resetProgress}>
            <RotateCcw className="ml-2 h-4 w-4" />
            بازنشانی پیشرفت
          </Button>
          <Button variant="secondary" size="sm" asChild>
            <Link to="/builder">ویرایش / ساخت چارت</Link>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {template.groups.map((group: ICourseGroup) => (
          <CourseGroup key={group.id} group={group} />
        ))}
      </div>
    </div>
  );
};
