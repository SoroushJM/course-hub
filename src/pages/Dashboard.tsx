import React, { useEffect } from 'react';
import { useCurriculum } from '../store';
import { CourseGroup } from '../components/CourseGroup';
import { Button } from "../components/ui/button";
import { Download, Upload, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import type { CourseGroup as ICourseGroup, Course } from "../types";

export const Dashboard: React.FC = () => {
  const { template, userProgress, loadTemplate, resetProgress, isLoading } =
    useCurriculum();

  useEffect(() => {
    if (!template && !isLoading) {
      loadTemplate("cs-1402");
    }
  }, [template, isLoading, loadTemplate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-6 text-center">
        <div className="p-6 bg-muted/30 rounded-full">
          <RotateCcw className="h-12 w-12 text-muted-foreground/50" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">هیچ چارت درسی یافت نشد</h3>
          <p className="text-muted-foreground">
            برای شروع، چارت پیش‌فرض را بارگذاری کنید.
          </p>
        </div>
        <Button
          size="lg"
          onClick={() => loadTemplate("cs-1402")}
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          بارگذاری چارت پیش‌فرض
        </Button>
      </div>
    );
  }

  // Calculate total progress
  const totalPassed = userProgress.passedCourses.reduce(
    (acc: number, p: { courseId: string }) => {
      const course = template.groups
        .flatMap((g: ICourseGroup) => g.courses)
        .find((c: Course) => c.id === p.courseId);
      return acc + (course ? course.units : 0);
    },
    0
  );

  const progressPercent = Math.min(
    100,
    (totalPassed / template.totalUnitsRequired) * 100
  );

  const handleExport = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(userProgress));
    const downloadAnchorNode = document.createElement("a");
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
          useCurriculum.setState({ userProgress: parsed });
        }
      };
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-violet-600 to-purple-700 p-8 text-white shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative z-10 grid gap-8 md:grid-cols-2 items-center">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              پیشرفت تحصیلی شما
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-md">
              شما تاکنون{" "}
              <span className="font-bold text-white text-2xl mx-1">
                {totalPassed}
              </span>{" "}
              واحد از
              <span className="font-bold text-white text-2xl mx-1">
                {template.totalUnitsRequired}
              </span>{" "}
              واحد الزامی را گذرانده‌اید.
            </p>
            <div className="flex flex-wrap gap-3 pt-4">
              <Button
                variant="secondary"
                onClick={handleExport}
                className="gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                <Download className="h-4 w-4" />
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
                <Button
                  variant="secondary"
                  className="gap-2 bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm"
                  asChild
                >
                  <label htmlFor="import-file" className="cursor-pointer">
                    <Upload className="h-4 w-4" />
                    بارگذاری فایل
                  </label>
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <div className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center">
              {/* Circular Progress Background */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  className="stroke-white/20 fill-none"
                  strokeWidth="12"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  className="stroke-white fill-none transition-all duration-1000 ease-out"
                  strokeWidth="12"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * progressPercent) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <span className="text-4xl md:text-5xl font-bold">
                  {Math.round(progressPercent)}%
                </span>
                <span className="text-sm opacity-80">تکمیل شده</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-wrap gap-4 justify-between items-center bg-card/50 backdrop-blur-sm p-4 rounded-2xl border border-border/50 shadow-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="text-sm">مدیریت چارت:</span>
        </div>
        <div className="flex gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetProgress}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <RotateCcw className="ml-2 h-4 w-4" />
            بازنشانی پیشرفت
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="border-primary/20 hover:border-primary/50 hover:bg-primary/5"
          >
            <Link to="/builder">ویرایش / ساخت چارت</Link>
          </Button>
        </div>
      </div>

      {/* Course Groups */}
      <div className="grid gap-6">
        {template.groups.map((group: ICourseGroup, index: number) => (
          <div
            key={group.id}
            className="animate-in fade-in slide-in-from-bottom-8 fill-mode-backwards"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CourseGroup group={group} />
          </div>
        ))}
      </div>
    </div>
  );
};
