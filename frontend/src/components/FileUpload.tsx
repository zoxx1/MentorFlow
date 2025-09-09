import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Upload, FileText, File } from 'lucide-react';
import logoImage from 'figma:asset/aa2cc09e7b73919cb386f1e0dcf2773b34d09112.png';

interface FileUploadProps {
  onFileAnalyzed: (analysisData: any) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileAnalyzed }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const mockAnalysisData = {
    overall: {
      structure: 6,
      content: 9,
      grammar: 5,
      style: 7
    },
    details: {
      grammar: {
        score: 5,
        issues: [
          {
            text: "В данном случае ихний вариант был лучше...",
            recommendation: "Заменить разговорное \"ихний\" на литературное \"их\"."
          },
          {
            text: "Он подошел к вопросу фундаментально...",
            recommendation: "Слово \"фундаментально\" здесь неуместно. Рекомендуется использовать \"всесторонне\" или \"основательно\"."
          },
          {
            text: "Данный вопрос требует более детального рассмотрения",
            recommendation: "Избегайте канцеляризмов. Лучше написать: \"Этот вопрос требует более подробного рассмотрения\"."
          }
        ]
      },
      structure: {
        score: 6,
        issues: [
          {
            text: "Отсутствует логическая связь между вторым и третьим абзацами",
            recommendation: "Добавьте переходное предложение, которое свяжет основные мысли этих абзацев."
          },
          {
            text: "Заключение не подводит итоги основных аргументов",
            recommendation: "Перепишите заключение, включив краткую сводку ключевых аргументов из основной части."
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

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    
    setIsAnalyzing(true);
    
    // Имитация анализа AI
    setTimeout(() => {
      setIsAnalyzing(false);
      onFileAnalyzed(mockAnalysisData);
    }, 3000);
  };

  const getSupportedFormats = () => {
    return '.docx,.pdf,.txt';
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <File className="w-6 h-6 text-red-500" />;
      case 'docx':
      case 'doc':
        return <FileText className="w-6 h-6 text-red-500" />;
      default:
        return <FileText className="w-6 h-6 text-red-400" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="w-full max-w-2xl space-y-8">
        {/* Логотип и заголовок */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <img src={logoImage} alt="MentorFlow Logo" className="w-16 h-16 mr-4" />
            <h1 className="text-4xl text-red-500">MentorFlow</h1>
          </div>
          <p className="text-gray-600">
            Анализ студенческих работ с помощью искусственного интеллекта
          </p>
        </div>

        {/* Зона загрузки */}
        <Card className="p-8 shadow-lg border border-red-100">
          <div
            className={`
              border-2 border-dashed rounded-lg p-12 text-center transition-colors
              ${isDragOver ? 'border-red-400 bg-red-50' : 'border-red-200'}
              ${selectedFile ? 'border-red-500 bg-red-50' : ''}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-3">
                  {getFileIcon(selectedFile.name)}
                  <span className="font-medium">{selectedFile.name}</span>
                </div>
                <p className="text-sm text-gray-500">
                  Размер: {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="w-16 h-16 text-red-400 mx-auto" />
                <div>
                  <p className="text-lg mb-2 text-gray-800">
                    Перетащите файл с работой сюда или нажмите для загрузки
                  </p>
                  <p className="text-sm text-gray-500">
                    Поддерживаемые форматы: DOCX, PDF, TXT
                  </p>
                </div>
              </div>
            )}

            <input
              type="file"
              accept={getSupportedFormats()}
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            
            {!selectedFile && (
              <label
                htmlFor="file-upload"
                className="inline-block mt-6 px-6 py-3 bg-red-500 text-white rounded-lg cursor-pointer hover:bg-red-600 transition-colors"
              >
                Выбрать файл
              </label>
            )}
          </div>

          {selectedFile && (
            <div className="mt-6 flex justify-center space-x-4">
              <Button
                onClick={() => setSelectedFile(null)}
                variant="outline"
              >
                Отменить
              </Button>
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="min-w-[200px]"
              >
                {isAnalyzing ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Анализируем...</span>
                  </div>
                ) : (
                  'Проанализировать'
                )}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};