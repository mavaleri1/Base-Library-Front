import { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import type { Material, MaterialsFilter, MaterialsHierarchy, SubjectInfo } from '../types';

export const useMaterialsRegistry = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MaterialsFilter>({
    page: 1,
    page_size: 1000 // Load many materials to build hierarchy
  });

  // Load all materials
  const loadMaterials = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // First try getAllMaterials, if it doesn't work - use getMyMaterials
      let response;
      try {
        // Try without parameters first
        response = await api.getAllMaterials();
      } catch (allMaterialsError) {
        console.log('⚠️ getAllMaterials failed, trying getMyMaterials:', allMaterialsError);
        try {
          response = await api.getMyMaterials();
        } catch (myMaterialsError) {
          console.log('⚠️ getMyMaterials also failed:', myMaterialsError);
          throw myMaterialsError;
        }
      }
      setMaterials(response.materials);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading materials');
    } finally {
      setIsLoading(false);
    }
  };

  // Build hierarchy from materials
  const hierarchy = useMemo((): MaterialsHierarchy => {
    const subjectsMap = new Map<string, SubjectInfo>();

    // Filter only published materials for hierarchy
    const publishedMaterials = materials.filter(material => 
      material.status === 'published' || !material.status
    );

    publishedMaterials.forEach(material => {
      const { subject, topic, grade } = material;
      
      if (!subject || !topic || !grade) return;

      // Create or get subject
      if (!subjectsMap.has(subject)) {
        subjectsMap.set(subject, {
          name: subject,
          count: 0,
          topics: []
        });
      }
      
      const subjectInfo = subjectsMap.get(subject)!;
      subjectInfo.count++;

      // Create or get topic
      let topicInfo = subjectInfo.topics.find(t => t.name === topic);
      if (!topicInfo) {
        topicInfo = {
          name: topic,
          count: 0,
          grades: []
        };
        subjectInfo.topics.push(topicInfo);
      }
      topicInfo.count++;

      // Create or get grade
      let gradeInfo = topicInfo.grades.find(g => g.name === grade);
      if (!gradeInfo) {
        gradeInfo = {
          name: grade,
          count: 0
        };
        topicInfo.grades.push(gradeInfo);
      }
      gradeInfo.count++;
    });

    return {
      subjects: Array.from(subjectsMap.values()).sort((a: SubjectInfo, b: SubjectInfo) => a.name.localeCompare(b.name))
    };
  }, [materials]);

  // Filter materials by selected hierarchy
  const getFilteredMaterials = (subject?: string, topic?: string, grade?: string): Material[] => {
    return materials.filter(material => {
      if (subject && material.subject !== subject) return false;
      if (topic && material.topic !== topic) return false;
      if (grade && material.grade !== grade) return false;
      return true;
    });
  };

  // Search materials
  const searchMaterials = (query: string): Material[] => {
    if (!query.trim()) return materials;
    
    const lowercaseQuery = query.toLowerCase();
    return materials.filter(material => 
      material.title.toLowerCase().includes(lowercaseQuery) ||
      material.subject.toLowerCase().includes(lowercaseQuery) ||
      material.topic.toLowerCase().includes(lowercaseQuery) ||
      material.grade.toLowerCase().includes(lowercaseQuery) ||
      (material.input_query && material.input_query.toLowerCase().includes(lowercaseQuery))
    );
  };

  useEffect(() => {
    loadMaterials();
  }, [filters]);

  return {
    materials,
    hierarchy,
    isLoading,
    error,
    filters,
    setFilters,
    getFilteredMaterials,
    searchMaterials,
    reload: loadMaterials
  };
};
