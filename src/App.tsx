import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Web3Provider } from './contexts/Web3Provider';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/common/Layout';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { RegistryPage } from './components/materials/RegistryPage';
import { CreatePage } from './components/create/CreatePage';
import { ProfilePage } from './components/profile/ProfilePage';
import { MaterialViewPage } from './components/materials/MaterialViewPage';
import { MaterialsListPage } from './components/materials/MaterialsListPage';
import { MaterialsDebugPage } from './components/materials/MaterialsDebugPage';
import { LeaderboardPage } from './components/materials/LeaderboardPage';
import LandingPage from './components/LandingPage';

function App() {
  return (
    <Web3Provider>
      <AuthProvider>
        <BrowserRouter>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <RegistryPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <Layout>
                  <CreatePage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <ProfilePage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/threads"
            element={
              <ProtectedRoute>
                <Layout>
                  <MaterialsListPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <LeaderboardPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/materials/:materialId"
            element={
              <ProtectedRoute>
                <Layout>
                  <MaterialViewPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/threads/:threadId/sessions/:sessionId"
            element={
              <ProtectedRoute>
                <Layout>
                  <MaterialViewPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/threads/:threadId"
            element={
              <ProtectedRoute>
                <Layout>
                  <div className="max-w-7xl mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-ink mb-4">
                      View material
                    </h1>
                    <p className="text-muted">
                      Page in development. Here will be a detailed view of the material.
                    </p>
                  </div>
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/debug/materials"
            element={
              <ProtectedRoute>
                <Layout>
                  <MaterialsDebugPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/test/dashboard"
            element={
              <Layout>
                <RegistryPage />
              </Layout>
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-ink mb-4">404</h1>
                  <p className="text-muted mb-6">Page not found</p>
                  <a
                    href="/"
                    className="text-primary hover:text-primary-hover underline"
                  >
                    Return to home
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </Web3Provider>
  );
}

export default App;

