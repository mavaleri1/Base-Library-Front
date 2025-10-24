import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../ui';
import { ArrowLeft, Loader2, Download, FileText, BookOpen, HelpCircle, FileCheck, ChevronDown, ChevronRight } from 'lucide-react';
import { MarkdownViewer } from '../common';
import { MaterialNFTMint } from './MaterialNFTMint';
import { api } from '../../services/api';
import type { Session, Material } from '../../types';

interface SessionMetadata {
  session_id: string;
  thread_id: string;
  input_content: string;
  display_name: string;
  created: string;
  modified: string;
  status: string;
  files: string[];
  subject?: string;
  grade?: string;
  topic?: string;
}

interface MaterialContent {
  fileName: string;
  content: string;
  displayName: string;
  icon: React.ReactNode;
}

export const MaterialViewPage: React.FC = () => {
  const { threadId, sessionId, materialId } = useParams<{ 
    threadId?: string; 
    sessionId?: string; 
    materialId?: string; 
  }>();
  const navigate = useNavigate();
  
  const [metadata, setMetadata] = useState<SessionMetadata | null>(null);
  const [materials, setMaterials] = useState<MaterialContent[]>([]);
  const [materialData, setMaterialData] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  // Function to get display name for files
  const getFileDisplayName = (fileName: string): string => {
    switch (fileName) {
      case 'questions.md':
        return 'Questions and answers';
      case 'generated_material.md':
        return 'Main material';
      case 'synthesized_material.md':
        return 'Concatenation';
      case 'recognized_notes.md':
        return 'Recognized notes';
      default:
        return fileName;
    }
  };

  // Function to get icon for files
  const getFileIcon = (fileName: string): React.ReactNode => {
    switch (fileName) {
      case 'questions.md':
        return <HelpCircle size={20} className="text-blue-500" />;
      case 'generated_material.md':
        return <BookOpen size={20} className="text-green-500" />;
      case 'synthesized_material.md':
        return <FileCheck size={20} className="text-purple-500" />;
      case 'recognized_notes.md':
        return <FileText size={20} className="text-orange-500" />;
      default:
        return <FileText size={20} className="text-muted-foreground" />;
    }
  };

  useEffect(() => {
    const loadAllMaterials = async () => {
      // If we have a materialId, load the material by ID
      if (materialId) {
        try {
          console.log('🔍 Loading material by ID:', materialId);
          const material = await api.getMaterial(materialId, true);
          console.log('📦 Material data:', material);
          
          // Save material data
          setMaterialData(material);
          
          // Create metadata from material
          const metaData: SessionMetadata = {
            session_id: material.session_id,
            thread_id: material.thread_id,
            input_content: material.input_query || '',
            display_name: material.title,
            created: material.created_at,
            modified: material.updated_at,
            status: material.status === 'published' ? 'completed' : 'pending',
            files: ['generated_material.md'], // Will be updated after loading files
            subject: material.subject,
            grade: material.grade,
            topic: material.topic
          };
          
          setMetadata(metaData);
          
          // Try to load all session files
          try {
            console.log('🔍 Loading session files for thread:', material.thread_id, 'session:', material.session_id);
            const files = await api.getSessionFiles(material.thread_id, material.session_id);
            const fileNames = files.filter(f => f && f.path).map(f => f.path);
            console.log('📁 Available files:', fileNames);
            
            // Update metadata with found files
            metaData.files = fileNames;
            setMetadata(metaData);
            
            // Filter files - exclude individual answer files
            const filteredFileNames = fileNames.filter(fileName => 
              !fileName.startsWith('answers/answer_')
            );
            console.log('📁 Filtered files (excluding individual answers):', filteredFileNames);
            
            // Load content for filtered files
            const materialPromises = filteredFileNames.map(async (fileName) => {
              try {
                const content = await api.getFileContent(material.thread_id, material.session_id, fileName);
                return {
                  fileName,
                  content,
                  displayName: getFileDisplayName(fileName),
                  icon: getFileIcon(fileName)
                };
              } catch (err) {
                console.error(`Error loading file ${fileName}:`, err);
                return {
                  fileName,
                  content: `Error loading file: ${err}`,
                  displayName: getFileDisplayName(fileName),
                  icon: getFileIcon(fileName)
                };
              }
            });
            
            const loadedMaterials = await Promise.all(materialPromises);
            
            // Sort materials: main material first, then questions
            const sortedMaterials = loadedMaterials.sort((a, b) => {
              if (a.fileName === 'generated_material.md') return -1;
              if (b.fileName === 'generated_material.md') return 1;
              if (a.fileName === 'questions.md') return -1;
              if (b.fileName === 'questions.md') return 1;
              return 0;
            });
            
            setMaterials(sortedMaterials);
          } catch (filesErr) {
            console.log('❌ Could not load session files, using only main material:', filesErr);
            
            // Fallback: use only main material
            const materialContent: MaterialContent = {
              fileName: 'generated_material.md',
              content: material.content || '',
              displayName: 'Main material',
              icon: <BookOpen size={20} className="text-green-500" />
            };
            
            setMaterials([materialContent]);
          }
          
          setLoading(false);
          return;
        } catch (err) {
          console.error('❌ Error loading material:', err);
          setError('Error loading material');
          setLoading(false);
          return;
        }
      }
      
      // Old logic for threadId/sessionId
      if (!threadId || !sessionId) {
        setError('Invalid URL parameters');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        // Load session files to get available files
        const files = await api.getSessionFiles(threadId, sessionId);
        const fileNames = files.filter(f => f && f.path).map(f => f.path);
        
        // Try to get session info from database
        let sessionInfo: Session | null = null;
        
        // First try to get materials for this session
        try {
          console.log('🔍 Trying to get materials for session:', { threadId, sessionId });
          const materialsResponse = await api.getMyMaterials();
          console.log('📦 All materials:', materialsResponse);
          
          // Find material that matches this session
          const sessionMaterial = materialsResponse.materials.find(m => 
            m.thread_id === threadId && m.session_id === sessionId
          );
          
          if (sessionMaterial) {
            console.log('✅ Found session material:', sessionMaterial);
            // Create session info from material data
            sessionInfo = {
              session_id: sessionId!,
              created_at: sessionMaterial.created_at,
              status: 'completed',
              subject: sessionMaterial.subject,
              grade: sessionMaterial.grade,
              topic: sessionMaterial.topic
            };
          } else {
            console.log('❌ No material found for this session');
          }
        } catch (materialsErr) {
          console.log('❌ Could not get materials:', materialsErr);
          
          // Fallback: try to get session info from sessions list
          try {
            console.log('🔍 Trying to get sessions for thread:', threadId);
            const sessions = await api.getSessions(threadId);
            console.log('📋 All sessions:', sessions);
            
            const currentSession = sessions.find(s => s.session_id === sessionId);
            if (currentSession) {
              console.log('✅ Found session in sessions list:', currentSession);
              sessionInfo = currentSession;
            }
          } catch (sessionsErr) {
            console.log('❌ Could not get sessions:', sessionsErr);
          }
        }

        // Create metadata from available information
        const metaData: SessionMetadata = {
          session_id: sessionId!,
          thread_id: threadId!,
          input_content: '',
          display_name: 'Materials',
          created: sessionInfo?.created_at || new Date().toISOString(),
          modified: new Date().toISOString(),
          status: 'completed',
          files: fileNames,
          subject: sessionInfo?.subject,
          grade: sessionInfo?.grade,
          topic: sessionInfo?.topic
        };
        console.log('📋 Final metadata:', metaData);
        setMetadata(metaData);

        // Filter files - exclude individual answer files
        const filteredFileNames = fileNames.filter(fileName => 
          !fileName.startsWith('answers/answer_')
        );
        console.log('📁 Filtered files (excluding individual answers):', filteredFileNames);
        
        // Load content for filtered files
        const materialPromises = filteredFileNames.map(async (fileName) => {
          try {
            const content = await api.getFileContent(threadId, sessionId, fileName);
            return {
              fileName,
              content,
              displayName: getFileDisplayName(fileName),
              icon: getFileIcon(fileName)
            };
          } catch (err) {
            console.error(`Error loading file ${fileName}:`, err);
              return {
                fileName,
                content: `Error loading file: ${err}`,
                displayName: getFileDisplayName(fileName),
                icon: getFileIcon(fileName)
              };
          }
        });

        const loadedMaterials = await Promise.all(materialPromises);
        
        // Sort materials: main material first, then questions
        const sortedMaterials = loadedMaterials.sort((a, b) => {
          if (a.fileName === 'generated_material.md') return -1;
          if (b.fileName === 'generated_material.md') return 1;
          if (a.fileName === 'questions.md') return -1;
          if (b.fileName === 'questions.md') return 1;
          return 0;
        });
        
        setMaterials(sortedMaterials);
      } catch (err: any) {
        console.error('Error loading materials:', err);
        setError(err.message || 'Error loading materials');
      } finally {
        setLoading(false);
      }
    };

    loadAllMaterials();
  }, [threadId, sessionId, materialId]);

  const handleDownloadAll = () => {
    if (materials.length === 0) return;
    
    // Create a combined markdown file with all materials
    const combinedContent = materials.map(material => 
      `# ${material.displayName}\n\n${material.content}\n\n---\n\n`
    ).join('');
    
    const blob = new Blob([combinedContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    // Use materialId or sessionId for file name
    const fileName = materialId ? `material-${materialId}.md` : `materials-${sessionId}.md`;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadSingle = (material: MaterialContent) => {
    const blob = new Blob([material.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = material.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleSection = (fileName: string) => {
    setCollapsedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fileName)) {
        newSet.delete(fileName);
      } else {
        newSet.add(fileName);
      }
      return newSet;
    });
  };

  const isSectionCollapsed = (fileName: string) => {
    return collapsedSections.has(fileName);
  };

  const handleMintSuccess = (tokenId: number, txHash: string) => {
    console.log('✅ NFT successfully minted:', { tokenId, txHash });
    // Can add notification or update state
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted">Loading materials...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card variant="bordered">
          <CardContent className="py-8">
            <div className="text-center">
              <div className="text-error text-5xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-ink mb-2">Loading Error</h2>
              <p className="text-muted mb-6">{error}</p>
              <Button
                variant="primary"
                onClick={() => navigate('/dashboard')}
                icon={<ArrowLeft size={18} />}
              >
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            icon={<ArrowLeft size={18} />}
          >
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-ink">
              {metadata?.display_name || 'Session Materials'}
            </h1>
            {metadata?.created && (
              <p className="text-sm text-muted mt-1">
                Created: {new Date(metadata.created).toLocaleString('ru-RU')}
              </p>
            )}
            {(metadata?.subject || metadata?.grade || metadata?.topic) && (
              <div className="flex flex-wrap gap-4 mt-2 text-sm">
                {metadata?.subject && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md">
                    Subject: {metadata.subject}
                  </span>
                )}

                 {metadata?.topic && (
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md">
                      Topic: {metadata.topic}
                    </span>
                )}


                {metadata?.grade && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md">
                    Grade: {metadata.grade}
                  </span>
                )}
               
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleDownloadAll}
            icon={<Download size={18} />}
          >
            Download all materials
          </Button>
        </div>
      </div>

      {/* Info Card */}
      {metadata?.input_content && (
        <Card variant="bordered">
          <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText size={18} />
                Original Question
              </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-ink">{metadata.input_content}</p>
          </CardContent>
        </Card>
      )}

      {/* NFT Minting Section - only for materials with materialId */}
      {materialData && materialId && (
        <div className="mb-6">
          <MaterialNFTMint 
            material={materialData} 
            onMintSuccess={handleMintSuccess}
          />
        </div>
      )}

      {/* All Materials */}
      <div className="space-y-6">
        {materials.map((material) => (
          <Card key={material.fileName} variant="elevated">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSection(material.fileName)}
                    className="p-1 hover:bg-surface-hover"
                  >
                    {isSectionCollapsed(material.fileName) ? (
                      <ChevronRight size={20} className="text-muted" />
                    ) : (
                      <ChevronDown size={20} className="text-muted" />
                    )}
                  </Button>
                  <CardTitle className="text-xl flex items-center gap-3">
                    {material.icon}
                    {material.displayName}
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownloadSingle(material)}
                  icon={<Download size={16} />}
                >
                  Download
                </Button>
              </div>
            </CardHeader>
            {!isSectionCollapsed(material.fileName) && (
              <CardContent className="p-8">
                <MarkdownViewer content={material.content} />
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* No materials message */}
      {materials.length === 0 && !loading && (
        <Card variant="bordered">
          <CardContent className="py-8">
            <div className="text-center">
              <div className="text-muted text-5xl mb-4">📄</div>
              <h2 className="text-2xl font-bold text-ink mb-2">Materials not found</h2>
              <p className="text-muted">There are no materials available in this session.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

