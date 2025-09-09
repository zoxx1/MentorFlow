import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  LogOut, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Users,
  BarChart3,
  Download,
  MessageSquare,
  Calendar
} from 'lucide-react';
import logoImage from 'figma:asset/aa2cc09e7b73919cb386f1e0dcf2773b34d09112.png';

interface MentorDashboardProps {
  mentorData: any;
  onLogout: () => void;
  onViewAnalysis: (submissionId: number) => void;
}

// Mock данные для демонстрации
const mockSubmissions = [
  {
    id: 1,
    studentName: 'Анна Петрова',
    studentGroup: 'ИС-21-1',
    assignment: 'Курсовая работа по базам данных',
    submittedAt: '2024-01-15T10:30:00',
    status: 'analyzed',
    overallScore: 7.5,
    fileName: 'database_coursework.docx',
    scores: {
      structure: 8,
      content: 9,
      grammar: 6,
      style: 7
    },
    needsReview: true
  },
  {
    id: 2,
    studentName: 'Максим Сидоров',
    studentGroup: 'ИС-21-2',
    assignment: 'Реферат по программированию',
    submittedAt: '2024-01-14T16:45:00',
    status: 'pending',
    fileName: 'programming_essay.pdf',
    needsReview: false
  },
  {
    id: 3,
    studentName: 'Елена Кузнецова',
    studentGroup: 'ИС-21-1',
    assignment: 'Лабораторная работа №5',
    submittedAt: '2024-01-13T09:15:00',
    status: 'reviewed',
    overallScore: 8.2,
    fileName: 'lab5_report.docx',
    scores: {
      structure: 8,
      content: 9,
      grammar: 8,
      style: 8
    },
    needsReview: false
  },
  {
    id: 4,
    studentName: 'Дмитрий Волков',
    studentGroup: 'ИС-21-2',
    assignment: 'Эссе по информационной безопасности',
    submittedAt: '2024-01-12T14:20:00',
    status: 'analyzed',
    overallScore: 6.8,
    fileName: 'security_essay.txt',
    scores: {
      structure: 7,
      content: 8,
      grammar: 5,
      style: 7
    },
    needsReview: true
  }
];

export const MentorDashboard: React.FC<MentorDashboardProps> = ({ 
  mentorData, 
  onLogout,
  onViewAnalysis 
}) => {
  const [selectedTab, setSelectedTab] = useState('submissions');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Ожидает анализа
        </Badge>;
      case 'analyzed':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Проанализировано
        </Badge>;
      case 'reviewed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Проверено
        </Badge>;
      default:
        return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const pendingSubmissions = mockSubmissions.filter(s => s.status === 'pending');
  const needsReviewSubmissions = mockSubmissions.filter(s => s.needsReview);

  return (
    <div className="min-h-screen bg-white">
      {/* Шапка */}
      <div className="border-b border-red-100 bg-red-50 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src={logoImage} alt="MentorFlow Logo" className="w-10 h-10" />
            <div>
              <h1 className="text-2xl text-red-600">MentorFlow</h1>
              <p className="text-sm text-red-700">Панель ментора</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-medium text-red-800">{mentorData.name}</p>
              <p className="text-sm text-red-600">{mentorData.department}</p>
            </div>
            <Avatar className="w-10 h-10">
              <AvatarImage src="" />
              <AvatarFallback className="bg-red-200 text-red-800">
                {mentorData.name.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onLogout}
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-red-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Всего работ</p>
                  <p className="text-2xl font-medium text-red-600">{mockSubmissions.length}</p>
                </div>
                <FileText className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ожидают анализа</p>
                  <p className="text-2xl font-medium text-yellow-600">{pendingSubmissions.length}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Требуют проверки</p>
                  <p className="text-2xl font-medium text-red-600">{needsReviewSubmissions.length}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Средний балл</p>
                  <p className="text-2xl font-medium text-green-600">7.5</p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Основной контент */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="submissions">Работы студентов</TabsTrigger>
            <TabsTrigger value="analytics">Аналитика</TabsTrigger>
            <TabsTrigger value="students">Студенты</TabsTrigger>
          </TabsList>

          <TabsContent value="submissions">
            <div className="space-y-4">
              {mockSubmissions.map((submission) => (
                <Card key={submission.id} className="border-red-100">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-lg">{submission.assignment}</h3>
                            <p className="text-gray-600">{submission.studentName} • {submission.studentGroup}</p>
                          </div>
                          {getStatusBadge(submission.status)}
                        </div>

                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <FileText className="w-4 h-4" />
                            <span>{submission.fileName}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(submission.submittedAt)}</span>
                          </div>
                        </div>

                        {submission.status === 'analyzed' || submission.status === 'reviewed' ? (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>Структура</span>
                                <span className={getScoreColor(submission.scores.structure)}>
                                  {submission.scores.structure}/10
                                </span>
                              </div>
                              <Progress value={submission.scores.structure * 10} className="h-2" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>Содержание</span>
                                <span className={getScoreColor(submission.scores.content)}>
                                  {submission.scores.content}/10
                                </span>
                              </div>
                              <Progress value={submission.scores.content * 10} className="h-2" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>Грамотность</span>
                                <span className={getScoreColor(submission.scores.grammar)}>
                                  {submission.scores.grammar}/10
                                </span>
                              </div>
                              <Progress value={submission.scores.grammar * 10} className="h-2" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>Стиль</span>
                                <span className={getScoreColor(submission.scores.style)}>
                                  {submission.scores.style}/10
                                </span>
                              </div>
                              <Progress value={submission.scores.style * 10} className="h-2" />
                            </div>
                          </div>
                        ) : null}
                      </div>

                      <div className="flex flex-col space-y-2 ml-6">
                        {submission.status === 'analyzed' || submission.status === 'reviewed' ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => onViewAnalysis(submission.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Просмотреть анализ
                            </Button>
                            <Button size="sm" variant="outline" className="border-red-200 text-red-600">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              Комментарий
                            </Button>
                          </>
                        ) : (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            Обрабатывается...
                          </Badge>
                        )}
                        
                        {submission.needsReview && (
                          <Badge variant="destructive" className="text-xs">
                            Требует внимания
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-red-100">
                <CardHeader>
                  <CardTitle className="text-red-700">Распределение оценок</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Отлично (8-10)</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={30} className="w-24 h-2" />
                        <span className="text-sm text-gray-600">30%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Хорошо (6-7)</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={50} className="w-24 h-2" />
                        <span className="text-sm text-gray-600">50%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Удовлетворительно (4-5)</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={20} className="w-24 h-2" />
                        <span className="text-sm text-gray-600">20%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-100">
                <CardHeader>
                  <CardTitle className="text-red-700">Частые проблемы</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <span className="text-sm">Грамматические ошибки</span>
                      <Badge variant="destructive">67%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <span className="text-sm">Структура работы</span>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">45%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm">Стиль изложения</span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">32%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['Анна Петрова', 'Максим Сидоров', 'Елена Кузнецова', 'Дмитрий Волков'].map((name, index) => (
                <Card key={name} className="border-red-100">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback className="bg-red-100 text-red-700">
                          {name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium">{name}</h4>
                        <p className="text-sm text-gray-600">ИС-21-{index % 2 + 1}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500">Работ:</span>
                          <Badge variant="outline" size="sm">{index + 1}</Badge>
                          <span className="text-xs text-gray-500">Средний балл:</span>
                          <Badge variant="outline" size="sm">{(7.5 + index * 0.3).toFixed(1)}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};