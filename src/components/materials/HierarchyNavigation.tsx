import React from 'react';
import { Button } from '../ui';
import type { MaterialsHierarchy } from '../../types';
import { ChevronRight, BookOpen, FolderOpen, GraduationCap } from 'lucide-react';

interface HierarchyNavigationProps {
  hierarchy: MaterialsHierarchy;
  selectedSubject?: string;
  selectedTopic?: string;
  selectedGrade?: string;
  onSubjectSelect: (subject: string) => void;
  onTopicSelect: (subject: string, topic: string) => void;
  onGradeSelect: (subject: string, topic: string, grade: string) => void;
  onReset: () => void;
}

export const HierarchyNavigation: React.FC<HierarchyNavigationProps> = ({
  hierarchy,
  selectedSubject,
  selectedTopic,
  selectedGrade,
  onSubjectSelect,
  onTopicSelect,
  onGradeSelect,
  onReset
}) => {
  const selectedSubjectData = selectedSubject 
    ? hierarchy.subjects.find(s => s.name === selectedSubject)
    : null;
  
  const selectedTopicData = selectedSubjectData && selectedTopic
    ? selectedSubjectData.topics.find(t => t.name === selectedTopic)
    : null;

  return (
    <div className="space-y-6">
      {(selectedSubject || selectedTopic || selectedGrade) && (
        <div className="flex items-center gap-2 text-sm text-muted">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onReset}
            className="text-primary hover:text-primary"
          >
            All materials
          </Button>
          
          {selectedSubject && (
            <>
              <ChevronRight size={14} />
              <span className="text-ink">{selectedSubject}</span>
            </>
          )}
          
          {selectedTopic && (
            <>
              <ChevronRight size={14} />
              <span className="text-ink">{selectedTopic}</span>
            </>
          )}
          
          {selectedGrade && (
            <>
              <ChevronRight size={14} />
              <span className="text-ink">{selectedGrade}</span>
            </>
          )}
        </div>
      )}

      {/* Lvl 1: Subjects */}
      {!selectedSubject && (
        <div>
          <h3 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
            <BookOpen size={20} />
            Subjects
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {hierarchy.subjects.map((subject) => (
              <Button
                key={subject.name}
                variant="outline"
                className="justify-start h-16 py-4 px-4 hover:border-primary hover:bg-primary/5"
                onClick={() => onSubjectSelect(subject.name)}
              >
                <div className="text-left w-full">
                  <div className="font-medium text-ink truncate">{subject.name}</div>
                  <div className="text-sm text-muted">{subject.count} materials</div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* lvl 2: Topics */}
      {selectedSubjectData && !selectedTopic && (
        <div>
          <h3 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
            <FolderOpen size={20} />
            Topics in {selectedSubject}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {selectedSubjectData.topics.map((topic) => (
              <Button
                key={topic.name}
                variant="outline"
                className="justify-start h-16 py-4 px-4 hover:border-primary hover:bg-primary/5"
                onClick={() => onTopicSelect(selectedSubject!, topic.name)}
              >
                <div className="text-left w-full">
                  <div className="font-medium text-ink truncate">{topic.name}</div>
                  <div className="text-sm text-muted">{topic.count} materials</div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Level 3: Grades */}
      {selectedTopicData && !selectedGrade && (
        <div>
          <h3 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
            <GraduationCap size={20} />
            Grades in {selectedTopic}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {selectedTopicData.grades.map((grade) => (
              <Button
                key={grade.name}
                variant="outline"
                className="justify-start h-16 py-4 px-4 hover:border-primary hover:bg-primary/5"
                onClick={() => onGradeSelect(selectedSubject!, selectedTopic!, grade.name)}
              >
                <div className="text-left w-full">
                  <div className="font-medium text-ink truncate">{grade.name}</div>
                  <div className="text-sm text-muted">{grade.count} materials</div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
