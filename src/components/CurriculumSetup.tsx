import { useState } from "react";
import type { Curriculum, CourseCategory } from "@/types/course";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CurriculumSetupProps {
  onSetup: (curriculum: Curriculum) => void;
}

const defaultCategoryRequirements: Record<CourseCategory, number> = {
  general: 26,
  "required-basic": 24,
  "required-core": 15,
  "required-major": 30,
  "elective-selection": 15,
  "elective-guided": 32,
};

export const CurriculumSetup = ({ onSetup }: CurriculumSetupProps) => {
  const [formData, setFormData] = useState({
    name: "چارت درسی",
    major: "علوم کامپیوتر",
    degree: "کارشناسی",
    minUnits: 139,
    maxUnits: 142,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const curriculum: Curriculum = {
      id: crypto.randomUUID(),
      name: formData.name,
      major: formData.major,
      degree: formData.degree,
      totalUnits: {
        min: formData.minUnits,
        max: formData.maxUnits,
      },
      categoryRequirements: defaultCategoryRequirements,
      courses: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSetup(curriculum);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">راه‌اندازی چارت درسی</CardTitle>
          <CardDescription>
            اطلاعات دوره تحصیلی خود را وارد کنید یا یک فایل JSON وارد نمایید
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">نام چارت درسی</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="major">رشته تحصیلی</Label>
                <Input
                  id="major"
                  value={formData.major}
                  onChange={(e) =>
                    setFormData({ ...formData, major: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="degree">مقطع</Label>
                <Input
                  id="degree"
                  value={formData.degree}
                  onChange={(e) =>
                    setFormData({ ...formData, degree: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minUnits">حداقل واحد</Label>
                <Input
                  id="minUnits"
                  type="number"
                  value={formData.minUnits}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minUnits: parseInt(e.target.value),
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxUnits">حداکثر واحد</Label>
                <Input
                  id="maxUnits"
                  type="number"
                  value={formData.maxUnits}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxUnits: parseInt(e.target.value),
                    })
                  }
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              ایجاد چارت درسی
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
