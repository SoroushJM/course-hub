import React from 'react';
import type { CourseGroup as ICourseGroup } from '../types';
import { CourseItem } from './CourseItem';
import { useCurriculum } from '../store';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

interface CourseGroupProps {
  group: ICourseGroup;
}

export const CourseGroup: React.FC<CourseGroupProps> = ({ group }) => {
  const { getGroupProgress } = useCurriculum();
  const { passed, required, overflow } = getGroupProgress(group.id);
  
  const progressPercent = Math.min(100, (passed / required) * 100);
  const isComplete = passed >= required;

  return (
    <Accordion type="single" collapsible className="w-full mb-4 border rounded-lg bg-card">
      <AccordionItem value={group.id} className="border-0">
        <AccordionTrigger className="px-4 py-3 hover:no-underline">
          <div className="flex flex-1 items-center justify-between ml-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">{group.title}</span>
              {isComplete && <Badge variant="default" className="bg-green-600 hover:bg-green-700">تکمیل</Badge>}
              {overflow > 0 && <Badge variant="secondary">+{overflow} واحد مازاد</Badge>}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{passed} / {required} واحد</span>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <Progress value={progressPercent} className="h-2 mb-4" />
          <div className="space-y-1">
            {group.courses.map((course) => (
              <CourseItem key={course.id} course={course} />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
