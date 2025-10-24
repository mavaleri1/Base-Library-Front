import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardContent } from '../ui';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import type { Material, MaterialsFilter } from '../../types';
import { BookOpen, FileText, Clock, Grid3X3, List, ArrowRight } from 'lucide-react';

type TabType = 'all' | 'my';
type ViewMode = 'grid' | 'list';

export const MaterialsListPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters] = useState<MaterialsFilter>({
    page: 1,
    page_size: 50,
  });

  useEffect(() => {
    loadMaterials();
  }, [activeTab, currentPage, filters.subject, filters.grade, filters.status]);

  const loadMaterials = async () => {
    setIsLoading(true);
    try {
      const filterParams = { ...filters, page: currentPage };
      console.log('🔄 Loading materials for tab:', activeTab, 'with params:', filterParams);
      console.log('👤 Current user:', user);
      
      const response = activeTab === 'all' 
        ? await api.getAllMaterials(filterParams)
        : await api.getMyMaterials(filterParams);
      
      console.log('✅ Materials loaded:', response);
      setMaterials(response.materials);
      setTotalCount(response.total);
    } catch (error) {
      console.error('❌ Failed to load materials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewMaterial = (material: Material) => {
    navigate(`/threads/${material.thread_id}/sessions/${material.session_id}`);
  };




  const totalPages = Math.ceil(totalCount / (filters.page_size || 50));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ink mb-2">
            Educational Materials
          </h1>
          <p className="text-muted">
            View and manage educational materials
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* View mode switcher */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Grid3X3 size={16} />
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <List size={16} />
              List
            </button>
          </div>
          
          <Button
            variant="primary"
            onClick={() => navigate('/create')}
          >
            Create Material
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-border">
        <button
          onClick={() => {
            setActiveTab('all');
            setCurrentPage(1);
          }}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'all'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted hover:text-ink'
          }`}
        >
          All Materials
          {activeTab === 'all' && totalCount > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary/10">
              {totalCount}
            </span>
          )}
        </button>
        <button
          onClick={() => {
            setActiveTab('my');
            setCurrentPage(1);
          }}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'my'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted hover:text-ink'
          }`}
        >
          My Materials
          {activeTab === 'my' && totalCount > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary/10">
              {totalCount}
            </span>
          )}
        </button>
      </div>

      {/* Materials List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4"></div>
            <p className="text-muted">Loading materials...</p>
          </div>
        </div>
      ) : materials.length === 0 ? (
        <Card variant="bordered">
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <FileText className="text-primary" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-ink mb-2">
              {activeTab === 'all' ? 'No materials yet' : 'You have no materials yet'}
            </h3>
            <p className="text-muted mb-6">
              {activeTab === 'all' 
                ? 'Be the first to create an educational material'
                : 'Create your first educational material'
              }
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/create')}
            >
              Create Material
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "space-y-4"
        }>
          {materials.map((material) => (
            <div key={material.id} className="relative">
              {viewMode === 'grid' ? (
                // Grid mode - square cards
                <Card
                  variant="bordered"
                  className="hover:border-primary transition-all duration-300 cursor-pointer group hover:shadow-lg h-full"
                  onClick={() => handleViewMaterial(material)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    width: '250px',
                    height: '300px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <CardContent className="p-4 h-full flex flex-col">
                    {/* Top section with badge */}
                    <div className="flex justify-start items-start mb-3">
                      <div 
                        className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: '#F5E8C7',
                          color: '#333333'
                        }}
                      >
                        <BookOpen size={12} />
                        <span>{material.subject}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 
                      className="font-bold text-lg leading-tight mb-3 line-clamp-3"
                      style={{ color: '#000000' }}
                    >
                      {material.title}
                    </h3>

                    {/* Description */}
                    <p 
                      className="text-sm leading-relaxed mb-4 flex-1 line-clamp-4"
                      style={{ color: '#666666' }}
                    >
                      {material.topic && `Topic: ${material.topic}`}
                      {material.grade && ` • Level: ${material.grade}`}
                      {material.word_count && ` • ${material.word_count} words`}
                    </p>

                    {/* Bottom section with duration and button */}
                    <div className="flex justify-between items-center mt-auto">
                      <div 
                        className="flex items-center gap-2 text-sm font-medium"
                        style={{ color: '#666666' }}
                      >
                        <Clock size={14} />
                        <span>
                          {material.word_count < 500 ? '15 min' :
                           material.word_count < 1000 ? '30 min' :
                           material.word_count < 1500 ? '45 min' : '1 hour'}
                        </span>
                      </div>
                      
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                        style={{ backgroundColor: '#E6F0FA' }}
                      >
                        <ArrowRight 
                          size={16} 
                          style={{ color: '#000000' }}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                // List mode - horizontally stretched cards
                <Card
                  variant="bordered"
                  className="hover:border-primary transition-all duration-300 cursor-pointer group hover:shadow-lg"
                  onClick={() => handleViewMaterial(material)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Subject badge */}
                      <div className="flex-shrink-0">
                        <div 
                          className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: '#F5E8C7',
                            color: '#333333'
                          }}
                        >
                          <BookOpen size={12} />
                          <span>{material.subject}</span>
                        </div>
                      </div>
                      
                      {/* Title and description */}
                      <div className="flex-1 min-w-0 w-96">
                        <h3 className="font-bold text-lg leading-tight mb-1 line-clamp-1">
                          {material.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {material.topic && `Topic: ${material.topic}`}
                          {material.grade && ` • Level: ${material.grade}`}
                          {material.word_count && ` • ${material.word_count} words`}
                        </p>
                      </div>
                      
                      {/* Duration */}
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground flex-shrink-0">
                        <Clock size={14} />
                        <span>
                          {material.word_count < 500 ? '15 min' :
                           material.word_count < 1000 ? '30 min' :
                           material.word_count < 1500 ? '45 min' : '1 hour'}
                        </span>
                      </div>
                      
                      {/* Button with arrow */}
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 flex-shrink-0"
                        style={{ backgroundColor: '#E6F0FA' }}
                      >
                        <ArrowRight 
                          size={16} 
                          style={{ color: '#000000' }}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Back
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded transition-colors ${
                      page === currentPage
                        ? 'bg-primary text-white'
                        : 'hover:bg-muted text-muted'
                    }`}
                  >
                    {page}
                  </button>
                );
              } else if (
                page === currentPage - 2 ||
                page === currentPage + 2
              ) {
                return (
                  <span key={page} className="px-2 text-muted">
                    ...
                  </span>
                );
              }
              return null;
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};



