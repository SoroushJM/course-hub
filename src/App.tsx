import { useState, useEffect } from "react";
import type { Curriculum, Course, StudentProgress } from "./types/course";
import {
  loadCurriculum,
  loadProgress,
  saveCurriculum,
  saveProgress,
} from "./lib/storage";
import { getFullyAvailableCourses } from "./lib/courseLogic";
import { CurriculumSetup } from "./components/CurriculumSetup";
import { CourseForm } from "./components/CourseForm";
import { CourseCard } from "./components/CourseCard";
import { ImportExport } from "./components/ImportExport";
import { ProgressSummary } from "./components/ProgressSummary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./components/ui/accordion";
import { Plus, BookOpen, GraduationCap, ListChecks } from "lucide-react";

function App() {
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("courses");

  // Load data on mount
  useEffect(() => {
    const loadedCurriculum = loadCurriculum();
    const loadedProgress = loadProgress();

    if (loadedCurriculum) {
      setCurriculum(loadedCurriculum);
    }

    if (loadedProgress) {
      setProgress(loadedProgress);
    } else if (loadedCurriculum) {
      // Initialize progress if curriculum exists but no progress
      const newProgress: StudentProgress = {
        curriculumId: loadedCurriculum.id,
        passedCourses: [],
        lastUpdated: new Date().toISOString(),
      };
      setProgress(newProgress);
      saveProgress(newProgress);
    }
  }, []);

  const handleSetupCurriculum = (newCurriculum: Curriculum) => {
    setCurriculum(newCurriculum);
    saveCurriculum(newCurriculum);

    const newProgress: StudentProgress = {
      curriculumId: newCurriculum.id,
      passedCourses: [],
      lastUpdated: new Date().toISOString(),
    };
    setProgress(newProgress);
    saveProgress(newProgress);
  };

  const handleAddCourse = (
    courseData: Omit<Course, "id"> & { id?: string }
  ) => {
    if (!curriculum) return;

    const updatedCurriculum = { ...curriculum };

    if (courseData.id) {
      // Edit existing course
      const index = updatedCurriculum.courses.findIndex(
        (c) => c.id === courseData.id
      );
      if (index !== -1) {
        updatedCurriculum.courses[index] = courseData as Course;
      }
    } else {
      // Add new course
      const newCourse: Course = {
        ...courseData,
        id: crypto.randomUUID(),
      };
      updatedCurriculum.courses.push(newCourse);
    }

    updatedCurriculum.updatedAt = new Date().toISOString();
    setCurriculum(updatedCurriculum);
    saveCurriculum(updatedCurriculum);
    setIsAddCourseOpen(false);
    setEditingCourse(null);
  };

  const handleDeleteCourse = (courseId: string) => {
    if (!curriculum || !confirm("آیا از حذف این درس مطمئن هستید؟")) return;

    const updatedCurriculum = {
      ...curriculum,
      courses: curriculum.courses.filter((c) => c.id !== courseId),
      updatedAt: new Date().toISOString(),
    };

    setCurriculum(updatedCurriculum);
    saveCurriculum(updatedCurriculum);

    // Remove from passed courses too
    if (progress) {
      const updatedProgress = {
        ...progress,
        passedCourses: progress.passedCourses.filter(
          (pc) => pc.courseId !== courseId
        ),
        lastUpdated: new Date().toISOString(),
      };
      setProgress(updatedProgress);
      saveProgress(updatedProgress);
    }
  };

  const handleTogglePassedCourse = (courseId: string) => {
    if (!progress || !curriculum) return;

    const updatedProgress = { ...progress };
    const existingIndex = updatedProgress.passedCourses.findIndex(
      (pc) => pc.courseId === courseId
    );

    if (existingIndex !== -1) {
      // Remove from passed
      updatedProgress.passedCourses.splice(existingIndex, 1);
    } else {
      // Add to passed
      updatedProgress.passedCourses.push({
        courseId,
        passedDate: new Date().toISOString(),
      });
    }

    updatedProgress.lastUpdated = new Date().toISOString();
    setProgress(updatedProgress);
    saveProgress(updatedProgress);
  };

  const handleImport = () => {
    const loadedCurriculum = loadCurriculum();
    const loadedProgress = loadProgress();

    if (loadedCurriculum) {
      setCurriculum(loadedCurriculum);
    }
    if (loadedProgress) {
      setProgress(loadedProgress);
    }
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setIsAddCourseOpen(true);
  };

  const closeDialog = () => {
    setIsAddCourseOpen(false);
    setEditingCourse(null);
  };

  if (!curriculum) {
    return <CurriculumSetup onSetup={handleSetupCurriculum} />;
  }

  const passedCourseIds =
    progress?.passedCourses.map((pc) => pc.courseId) || [];
  const availableCourses = getFullyAvailableCourses(
    curriculum.courses,
    progress?.passedCourses || []
  );

  // Filter courses by search query
  const filteredCourses = curriculum.courses.filter((course) =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group courses by category
  const coursesByCategory = filteredCourses.reduce((acc, course) => {
    if (!acc[course.category]) {
      acc[course.category] = [];
    }
    acc[course.category].push(course);
    return acc;
  }, {} as Record<string, Course[]>);

  const categoryNames: Record<string, string> = {
    general: "دروس عمومی",
    "required-basic": "دروس الزامی-پایه",
    "required-core": "دروس الزامی-هسته مشترک",
    "required-major": "دروس الزامی-رشته",
    "elective-selection": "دروس اختیاری-انتخاب",
    "elective-guided": "دروس اختیاری/کهاد",
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50"
    >
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">سامانه مدیریت چارت درسی</h1>
                <p className="text-sm text-muted-foreground">
                  {curriculum.degree} - {curriculum.major}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="courses">
                  <BookOpen className="w-4 h-4 ml-2" />
                  مدیریت دروس
                </TabsTrigger>
                <TabsTrigger value="passed">
                  <ListChecks className="w-4 h-4 ml-2" />
                  دروس گذرانده شده
                </TabsTrigger>
                <TabsTrigger value="available">
                  <Plus className="w-4 h-4 ml-2" />
                  دروس قابل اخذ
                </TabsTrigger>
              </TabsList>

              <TabsContent value="courses" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>لیست دروس</CardTitle>
                        <CardDescription>
                          مجموع {curriculum.courses.length} درس
                        </CardDescription>
                      </div>
                      <Button onClick={() => setIsAddCourseOpen(true)}>
                        <Plus className="w-4 h-4 ml-2" />
                        افزودن درس جدید
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Input
                      placeholder="جستجوی درس..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="mb-4"
                    />

                    <Accordion type="single" collapsible className="w-full">
                      {Object.entries(coursesByCategory).map(
                        ([category, courses]) => (
                          <AccordionItem key={category} value={category}>
                            <AccordionTrigger>
                              {categoryNames[category]} ({courses.length} درس)
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="grid grid-cols-1 gap-4">
                                {courses.map((course) => (
                                  <CourseCard
                                    key={course.id}
                                    course={course}
                                    allCourses={curriculum.courses}
                                    isPassed={passedCourseIds.includes(
                                      course.id
                                    )}
                                    onEdit={() => handleEditCourse(course)}
                                    onDelete={() =>
                                      handleDeleteCourse(course.id)
                                    }
                                    onTogglePass={() =>
                                      handleTogglePassedCourse(course.id)
                                    }
                                  />
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        )
                      )}
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="passed" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>دروس گذرانده شده</CardTitle>
                    <CardDescription>
                      {progress?.passedCourses.length || 0} درس گذرانده شده
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4">
                      {curriculum.courses
                        .filter((course) => passedCourseIds.includes(course.id))
                        .map((course) => (
                          <CourseCard
                            key={course.id}
                            course={course}
                            allCourses={curriculum.courses}
                            isPassed={true}
                            onTogglePass={() =>
                              handleTogglePassedCourse(course.id)
                            }
                          />
                        ))}
                      {passedCourseIds.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">
                          هنوز هیچ درسی گذرانده نشده است
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="available" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>دروس قابل اخذ</CardTitle>
                    <CardDescription>
                      {availableCourses.length} درس قابل اخذ در این ترم
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4">
                      {availableCourses.map((course) => (
                        <CourseCard
                          key={course.id}
                          course={course}
                          allCourses={curriculum.courses}
                          isAvailable={true}
                          onTogglePass={() =>
                            handleTogglePassedCourse(course.id)
                          }
                        />
                      ))}
                      {availableCourses.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">
                          در حال حاضر درسی برای اخذ وجود ندارد
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {progress && (
              <ProgressSummary
                curriculum={curriculum}
                passedCourses={progress.passedCourses}
              />
            )}
            <ImportExport onImport={handleImport} />
          </div>
        </div>
      </main>

      {/* Course Dialog */}
      <Dialog open={isAddCourseOpen} onOpenChange={closeDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCourse ? "ویرایش درس" : "افزودن درس جدید"}
            </DialogTitle>
            <DialogDescription>اطلاعات درس را وارد کنید</DialogDescription>
          </DialogHeader>
          <CourseForm
            course={editingCourse || undefined}
            allCourses={curriculum.courses}
            onSubmit={handleAddCourse}
            onCancel={closeDialog}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
