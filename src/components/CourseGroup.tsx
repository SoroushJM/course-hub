import React from 'react';
import type { CourseGroup as ICourseGroup } from '../types';
import { CourseItem } from './CourseItem';
import { useCurriculum } from '../store';
import { cn } from "../lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Badge } from "./ui/badge";

interface CourseGroupProps {
  group: ICourseGroup;
}

export const CourseGroup: React.FC<CourseGroupProps> = ({ group }) => {
  const { getGroupProgress } = useCurriculum();
  const { passed, required, overflow } = getGroupProgress(group.id);

  const progressPercent = Math.min(100, (passed / required) * 100);
  const isComplete = passed >= required;

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full border-0 bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden ring-1 ring-border/50"
    >
      <AccordionItem value={group.id} className="border-0">
        <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/30 transition-colors">
          <div className="flex flex-1 items-center justify-between ml-4">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-2 h-8 rounded-full",
                  isComplete ? "bg-green-500" : "bg-primary/50"
                )}
              ></div>
              <span className="font-bold text-lg tracking-tight">
                {group.title}
              </span>
              {isComplete && (
                <Badge
                  variant="default"
                  className="bg-green-600 hover:bg-green-700 shadow-sm"
                >
                  تکمیل شده
                </Badge>
              )}
              {overflow > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300"
                >
                  +{overflow} واحد مازاد
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex flex-col items-end">
                <span className="font-medium text-foreground">
                  {passed} از {required} واحد
                </span>
                <span className="text-xs opacity-70">گذرانده شده</span>
              </div>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-0 pb-0">
          <div className="h-1 w-full bg-muted">
            <div
              className={cn(
                "h-full transition-all duration-500 ease-out",
                isComplete ? "bg-green-500" : "bg-primary"
              )}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="p-4 space-y-2 bg-muted/10">
            {group.courses.map((course) => (
              <CourseItem key={course.id} course={course} />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
