import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui';
import { useAuth } from '../../hooks/useAuth';
import { useMaterialsRegistry } from '../../hooks/useMaterialsRegistry';
import { HierarchyNavigation } from './HierarchyNavigation';
import { MaterialSearch } from './MaterialSearch';
import { MaterialCard } from './MaterialCard';
import { Plus, Filter, Grid, List, RefreshCw } from 'lucide-react';

export const RegistryPage: React.FC = () => {
  const navigate = useNavigate();
  const { } = useAuth();
  const {
    materials,
    hierarchy,
    isLoading,
    error,
    getFilteredMaterials,
    searchMaterials,
    reload
  } = useMaterialsRegistry();

  // Hierarchy navigation state
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>();
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>();
  const [selectedGrade, setSelectedGrade] = useState<string | undefined>();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get filtered materials 
  const filteredMaterials = useMemo(() => {
    let result = materials;

    // Apply hierarchy filters
    if (selectedSubject || selectedTopic || selectedGrade) {
      result = getFilteredMaterials(selectedSubject, selectedTopic, selectedGrade);
    }

    // Apply search
    if (searchQuery.trim()) {
      result = searchMaterials(searchQuery);
    }

    return result;
  }, [materials, selectedSubject, selectedTopic, selectedGrade, searchQuery, getFilteredMaterials, searchMaterials]);

  // Hierarchy navigation handlers
  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject);
    setSelectedTopic(undefined);
    setSelectedGrade(undefined);
  };

  const handleTopicSelect = (subject: string, topic: string) => {
    setSelectedSubject(subject);
    setSelectedTopic(topic);
    setSelectedGrade(undefined);
  };

  const handleGradeSelect = (subject: string, topic: string, grade: string) => {
    setSelectedSubject(subject);
    setSelectedTopic(topic);
    setSelectedGrade(grade);
  };

  const handleReset = () => {
    setSelectedSubject(undefined);
    setSelectedTopic(undefined);
    setSelectedGrade(undefined);
  };

  // Material click handler
  const handleMaterialClick = (material: any) => {
    navigate(`/materials/${material.id}`);
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card variant="bordered">
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-semibold text-ink mb-2">
              Error loading materials
            </h3>
            <p className="text-muted mb-6">{error}</p>
            <Button onClick={reload} icon={<RefreshCw size={18} />}>
              Try again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ink mb-2">
            Materials registry
          </h1>
          <p className="text-muted">
            View and study educational materials
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon={<RefreshCw size={18} />}
            onClick={reload}
            disabled={isLoading}
          > 
            Refresh
          </Button>
          <Button
            variant="primary"
            size="lg"
            icon={<Plus size={20} />}
            onClick={() => navigate('/create')}
          >
            Create material
          </Button>
        </div>
      </div>

      {/* Search and filters */}
      <Card variant="bordered">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1" >
              <MaterialSearch
                onSearch={setSearchQuery}
                placeholder="Search by name, subject, topic or content..."
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                icon={<Filter size={16} />}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters
              </Button>
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                  size="sm"
                  icon={<Grid size={16} />}
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                />
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'ghost'}
                  size="sm"
                  icon={<List size={16} />}
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hierarchy navigation */}
      <Card variant="bordered">
        <CardHeader>
          <CardTitle>Navigation by materials</CardTitle>
          <CardDescription>
            Choose subject, topic or grade to view materials
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4"></div>
                <p className="text-muted">Loading materials...</p>
              </div>
            </div>
          ) : (
            <HierarchyNavigation
              hierarchy={hierarchy}
              selectedSubject={selectedSubject}
              selectedTopic={selectedTopic}
              selectedGrade={selectedGrade}
              onSubjectSelect={handleSubjectSelect}
              onTopicSelect={handleTopicSelect}
              onGradeSelect={handleGradeSelect}
              onReset={handleReset}
            />
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-ink">
            {selectedSubject || selectedTopic || selectedGrade || searchQuery 
              ? `Found materials: ${filteredMaterials.length}`
              : 'All materials'
            }
          </h2>
          {filteredMaterials.length > 0 && (
            <div className="text-sm text-muted">
              Showed {filteredMaterials.length} of {materials.length} materials
            </div>
          )}
        </div>

        {filteredMaterials.length === 0 ? (
          <Card variant="bordered">
            <CardContent className="py-12 text-center">
              <h3 className="text-lg font-semibold text-ink mb-2">
                No materials found
              </h3>
              <p className="text-muted mb-6">
                {searchQuery 
                  ? 'Try changing your search query'
                  : 'No materials in the selected category yet'
                }
              </p>
              <Button
                variant="primary"
                icon={<Plus size={18} />}
                onClick={() => navigate('/create')}
              >
                Create first material
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1'
          }`}>
            {filteredMaterials.map((material) => (
              <MaterialCard
                key={material.id}
                material={material}
                viewMode={viewMode}
                onClick={() => handleMaterialClick(material)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
