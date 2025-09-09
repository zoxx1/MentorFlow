import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { GraduationCap, Users, Eye, EyeOff } from 'lucide-react';
import logoImage from 'figma:asset/aa2cc09e7b73919cb386f1e0dcf2773b34d09112.png';

interface LoginProps {
  onLogin: (userType: 'student' | 'mentor', userData: any) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const handleLogin = async (userType: 'student' | 'mentor') => {
    setIsLoading(true);
    
    // Имитация авторизации
    setTimeout(() => {
      const userData = userType === 'student' 
        ? {
            id: 1,
            name: 'Анна Петрова',
            email: loginData.email || 'anna.petrova@example.com',
            group: 'ИС-21-1',
            course: 3
          }
        : {
            id: 1,
            name: 'Дмитрий Сидоров',
            email: loginData.email || 'dmitry.sidorov@example.com',
            department: 'Кафедра информационных систем',
            experience: 5
          };
      
      setIsLoading(false);
      onLogin(userType, userData);
    }, 1500);
  };

  const handleDemoLogin = (userType: 'student' | 'mentor') => {
    const demoData = userType === 'student'
      ? {
          id: 1,
          name: 'Анна Петрова',
          email: 'anna.petrova@example.com',
          group: 'ИС-21-1',
          course: 3
        }
      : {
          id: 1,
          name: 'Дмитрий Сидоров',
          email: 'dmitry.sidorov@example.com',
          department: 'Кафедра информационных систем',
          experience: 5
        };
    
    onLogin(userType, demoData);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="w-full max-w-md space-y-8">
        {/* Логотип и заголовок */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <img src={logoImage} alt="MentorFlow Logo" className="w-16 h-16 mr-4" />
            <h1 className="text-4xl text-red-500">MentorFlow</h1>
          </div>
          <p className="text-gray-600">
            Авторизация в системе анализа студенческих работ
          </p>
        </div>

        {/* Вкладки авторизации */}
        <Card className="shadow-lg border border-red-100">
          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="student" className="flex items-center space-x-2">
                <GraduationCap className="w-4 h-4" />
                <span>Студент</span>
              </TabsTrigger>
              <TabsTrigger value="mentor" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Ментор</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="student">
              <Card className="border-0 shadow-none">
                <CardHeader className="pb-4">
                  <CardTitle className="text-center text-red-700">Вход для студента</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="student-email">Email</Label>
                    <Input
                      id="student-email"
                      type="email"
                      placeholder="your.email@university.edu"
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="student-password">Пароль</Label>
                    <div className="relative">
                      <Input
                        id="student-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Введите пароль"
                        value={loginData.password}
                        onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Button
                      onClick={() => handleLogin('student')}
                      disabled={isLoading}
                      className="w-full bg-red-500 hover:bg-red-600"
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Вход...</span>
                        </div>
                      ) : (
                        'Войти как студент'
                      )}
                    </Button>
                    <Button
                      onClick={() => handleDemoLogin('student')}
                      variant="outline"
                      className="w-full border-red-200 text-red-600 hover:bg-red-50"
                    >
                      Демо вход (студент)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mentor">
              <Card className="border-0 shadow-none">
                <CardHeader className="pb-4">
                  <CardTitle className="text-center text-red-700">Вход для ментора</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mentor-email">Email</Label>
                    <Input
                      id="mentor-email"
                      type="email"
                      placeholder="mentor@university.edu"
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mentor-password">Пароль</Label>
                    <div className="relative">
                      <Input
                        id="mentor-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Введите пароль"
                        value={loginData.password}
                        onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Button
                      onClick={() => handleLogin('mentor')}
                      disabled={isLoading}
                      className="w-full bg-red-500 hover:bg-red-600"
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Вход...</span>
                        </div>
                      ) : (
                        'Войти как ментор'
                      )}
                    </Button>
                    <Button
                      onClick={() => handleDemoLogin('mentor')}
                      variant="outline"
                      className="w-full border-red-200 text-red-600 hover:bg-red-50"
                    >
                      Демо вход (ментор)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Информация для демо */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Для демонстрации используйте кнопки "Демо вход"
          </p>
        </div>
      </div>
    </div>
  );
};