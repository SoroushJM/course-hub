import React, { useEffect } from 'react';
import { useCurriculum } from '../store';
import { CourseGroup } from '../components/CourseGroup';
import { TemplateManager } from "../components/TemplateManager";
import { Button } from "../components/ui/button";
import { Download, Upload, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import type {
  CourseGroup as ICourseGroup,
  Course,
  UserProgress,
} from "../types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

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
          try {
            const parsed = JSON.parse(
              e.target.result as string
            ) as UserProgress;

            // Validation: Check if progress matches current template
            if (parsed.templateId !== template.id) {
              toast.error(
                `این فایل پیشرفت مربوط به چارت ${parsed.templateId} است، اما چارت فعلی ${template.id} است.`
              );
              return;
            }

            useCurriculum.setState({ userProgress: parsed });
            toast.success("پیشرفت با موفقیت بارگذاری شد");
          } catch (err) {
            console.error(err);
            toast.error("خطا در خواندن فایل پیشرفت");
          }
        }
      };
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-violet-600 to-purple-700 p-4 md:p-8 text-white shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative z-10 grid gap-8 md:grid-cols-2 items-center">
          <div className="space-y-4">
            <div className="space-y-1 mb-2">
              <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {template.university}
              </div>
              <h2 className="text-lg font-medium text-white/90 opacity-90">
                {template.title}
              </h2>
            </div>
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
                خروجی پیشرفت
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
                    وارد کردن پیشرفت
                  </label>
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <div className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center">
              {/* Circular Progress Background */}
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  className="stroke-white/20 fill-none"
                  strokeWidth="5"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  className="stroke-white fill-none transition-all duration-1000 ease-out"
                  strokeWidth="5"
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
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card/50 backdrop-blur-sm p-4 rounded-2xl border border-border/50 shadow-sm">
        <div className="flex items-center gap-2 text-muted-foreground w-full md:w-auto justify-center md:justify-start">
          <span className="text-sm whitespace-nowrap">مدیریت چارت:</span>
        </div>
        <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-3 w-full md:w-auto">
          <TemplateManager />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full sm:w-auto"
              >
                <RotateCcw className="ml-2 h-4 w-4" />
                بازنشانی پیشرفت
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  آیا از بازنشانی پیشرفت اطمینان دارید؟
                </AlertDialogTitle>
                <AlertDialogDescription>
                  این عمل غیرقابل بازگشت است. تمام درس‌های پاس شده و نمرات شما
                  پاک خواهند شد.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>انصراف</AlertDialogCancel>
                <AlertDialogAction
                  onClick={resetProgress}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  بله، بازنشانی کن
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="border-primary/20 hover:border-primary/50 hover:bg-primary/5 w-full sm:w-auto"
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
