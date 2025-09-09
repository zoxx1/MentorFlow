import React, { useState } from 'react';
import { Login } from './components/Login';
import { FileUpload } from './components/FileUpload';
import { AnalysisResults } from './components/AnalysisResults';
import { MentorDashboard } from './components/MentorDashboard';

type UserType = 'student' | 'mentor' | null;
type StudentView = 'upload' | 'results';

export default function App() {
  const [userType, setUserType] = useState<UserType>(null);
  const [userData, setUserData] = useState<any>(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [currentView, setCurrentView] = useState<StudentView>('upload');

  const handleLogin = (type: 'student' | 'mentor', data: any) => {
    setUserType(type);
    setUserData(data);
  };

  const handleLogout = () => {
    setUserType(null);
    setUserData(null);
    setAnalysisData(null);
    setCurrentView('upload');
  };

  const handleFileAnalyzed = (data: any) => {
    setAnalysisData(data);
    setCurrentView('results');
  };

  const handleBackToUpload = () => {
    setCurrentView('upload');
    setAnalysisData(null);
  };

  const handleViewAnalysis = (submissionId: number) => {
    // Mock данные для анализа конкретной работы
    const mockAnalysisData = {
      overall: {
        structure: 8,
        content: 9,
        grammar: 6,
        style: 7
      },
      details: {
        grammar: {
          score: 6,
          issues: [
            {
              text: "В данном случае ихний вариант был лучше...",
              recommendation: "Заменить разговорное \"ихний\" на литературное \"их\"."
            },
            {
              text: "Он подошел к вопросу фундаментально...",
              recommendation: "Слово \"фундаментально\" здесь неуместно. Рекомендуется использовать \"всесторонне\" или \"основательно\"."
            }
          ]
        },
        structure: {
          score: 8,
          issues: [
            {
              text: "Хорошая структура работы с четким введением и заключением",
              recommendation: "Продолжайте придерживаться логичной структуры в будущих работах."
            }
          ]
        },
        content: {
          score: 9,
          issues: [
            {
              text: "Отличное раскрытие темы с использованием актуальных источников",
              recommendation: "Продолжайте использовать современные исследования для подкрепления ваших аргументов."
            }
          ]
        },
        style: {
          score: 7,
          issues: [
            {
              text: "Некоторые предложения слишком длинные и сложные для восприятия",
              recommendation: "Разделите сложные предложения на более короткие для улучшения читаемости."
            }
          ]
        }
      }
    };
    
    setAnalysisData(mockAnalysisData);
    setCurrentView('results');
  };

  // Экран авторизации
  if (!userType) {
    return <Login onLogin={handleLogin} />;
  }

  // Интерфейс ментора
  if (userType === 'mentor') {
    if (currentView === 'results' && analysisData) {
      return (
        <AnalysisResults 
          analysisData={analysisData} 
          onBack={() => setCurrentView('upload')} 
        />
      );
    }
    
    return (
      <MentorDashboard 
        mentorData={userData}
        onLogout={handleLogout}
        onViewAnalysis={handleViewAnalysis}
      />
    );
  }

  // Интерфейс студента
  return (
    <div className="min-h-screen">
      {currentView === 'upload' ? (
        <div>
          {/* Мини-шапка для студента */}
          <div className="bg-red-50 border-b border-red-100 p-3">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm text-red-700">Добро пожаловать, {userData.name}</span>
                <span className="text-xs text-red-600">• {userData.group}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Выйти
              </button>
            </div>
          </div>
          <FileUpload onFileAnalyzed={handleFileAnalyzed} />
        </div>
      ) : (
        <AnalysisResults 
          analysisData={analysisData} 
          onBack={handleBackToUpload} 
        />
      )}
    </div>
  );
}