import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Download, ArrowLeft } from 'lucide-react';
import logoImage from 'figma:asset/aa2cc09e7b73919cb386f1e0dcf2773b34d09112.png';

interface AnalysisResultsProps {
  analysisData: any;
  onBack: () => void;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analysisData, onBack }) => {
  const chartData = [
    { subject: 'Структура', score: analysisData.overall.structure, fullMark: 10 },
    { subject: 'Содержание', score: analysisData.overall.content, fullMark: 10 },
    { subject: 'Грамотность', score: analysisData.overall.grammar, fullMark: 10 },
    { subject: 'Стиль', score: analysisData.overall.style, fullMark: 10 }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" | "outline" => {
    if (score >= 8) return 'default';
    if (score >= 6) return 'secondary';
    return 'destructive';
  };

  const generatePDFReport = () => {
    // В реальном приложении здесь была бы генерация PDF
    const reportContent = `
ОТЧЕТ АНАЛИЗА РАБОТЫ
===================

ОБЩАЯ ОЦЕНКА:
- Структура: ${analysisData.overall.structure}/10
- Содержание: ${analysisData.overall.content}/10  
- Грамотность: ${analysisData.overall.grammar}/10
- Стиль: ${analysisData.overall.style}/10

ДЕТАЛЬНАЯ ОБРАТНАЯ СВЯЗЬ:

ГРАМОТНОСТЬ (${analysisData.details.grammar.score}/10):
${analysisData.details.grammar.issues.map((issue: any) => `
• "${issue.text}"
  Рекомендация: ${issue.recommendation}
`).join('')}

СТРУКТУРА (${analysisData.details.structure.score}/10):
${analysisData.details.structure.issues.map((issue: any) => `
• ${issue.text}
  Рекомендация: ${issue.recommendation}
`).join('')}

СОДЕРЖАНИЕ (${analysisData.details.content.score}/10):
${analysisData.details.content.issues.map((issue: any) => `
• ${issue.text}
  Рекомендация: ${issue.recommendation}
`).join('')}

СТИЛЬ (${analysisData.details.style.score}/10):
${analysisData.details.style.issues.map((issue: any) => `
• ${issue.text}
  Рекомендация: ${issue.recommendation}
`).join('')}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mentorflow-analysis-report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Шапка */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={onBack} className="flex items-center space-x-2 border-red-200 text-red-600 hover:bg-red-50">
            <ArrowLeft className="w-4 h-4" />
            <span>Назад</span>
          </Button>
          <div className="flex items-center space-x-3">
            <img src={logoImage} alt="MentorFlow Logo" className="w-8 h-8" />
            <h1 className="text-2xl text-red-500">Результаты анализа</h1>
          </div>
          <div></div>
        </div>

        {/* Визуальная сводка */}
        <Card className="shadow-lg border border-red-100">
          <CardHeader className="bg-red-50">
            <CardTitle className="text-red-800">Общая оценка</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Custom Radar Chart visualization */}
              <div className="h-80 flex items-center justify-center">
                <div className="relative w-64 h-64">
                  <svg width="256" height="256" viewBox="0 0 256 256" className="absolute inset-0">
                    {/* Background circles */}
                    <circle cx="128" cy="128" r="100" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                    <circle cx="128" cy="128" r="75" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                    <circle cx="128" cy="128" r="50" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                    <circle cx="128" cy="128" r="25" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                    
                    {/* Axis lines */}
                    <line x1="128" y1="28" x2="128" y2="228" stroke="#e5e7eb" strokeWidth="1" />
                    <line x1="28" y1="128" x2="228" y2="128" stroke="#e5e7eb" strokeWidth="1" />
                    
                    {/* Data visualization */}
                    <polygon
                      points={`
                        128,${128 - (analysisData.overall.structure * 10)}
                        ${128 + (analysisData.overall.content * 10)},128
                        128,${128 + (analysisData.overall.grammar * 10)}
                        ${128 - (analysisData.overall.style * 10)},128
                      `}
                      fill="#ef4444"
                      fillOpacity="0.2"
                      stroke="#ef4444"
                      strokeWidth="2"
                    />
                    
                    {/* Data points */}
                    <circle cx="128" cy={128 - (analysisData.overall.structure * 10)} r="4" fill="#ef4444" />
                    <circle cx={128 + (analysisData.overall.content * 10)} cy="128" r="4" fill="#ef4444" />
                    <circle cx="128" cy={128 + (analysisData.overall.grammar * 10)} r="4" fill="#ef4444" />
                    <circle cx={128 - (analysisData.overall.style * 10)} cy="128" r="4" fill="#ef4444" />
                  </svg>
                  
                  {/* Labels */}
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs text-red-700">Структура</div>
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-red-700">Содержание</div>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-red-700">Грамотность</div>
                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-xs text-red-700">Стиль</div>
                </div>
              </div>

              {/* Оценки в виде прогресс-баров */}
              <div className="space-y-6">
                {chartData.map((item) => (
                  <div key={item.subject} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>{item.subject}</span>
                      <Badge variant={getScoreBadgeVariant(item.score)}>
                        {item.score}/10
                      </Badge>
                    </div>
                    <Progress value={item.score * 10} className="h-2" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Детализированная обратная связь */}
        <Card className="shadow-lg border border-red-100">
          <CardHeader className="bg-red-50">
            <CardTitle className="text-red-800">Детализированная обратная связь</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="grammar">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center justify-between w-full mr-4">
                    <span>Критерий: Грамотность и стиль</span>
                    <Badge variant={getScoreBadgeVariant(analysisData.details.grammar.score)}>
                      Оценка: {analysisData.details.grammar.score}/10
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Найдено {analysisData.details.grammar.issues.length} проблем. Примеры:
                    </p>
                    {analysisData.details.grammar.issues.map((issue: any, index: number) => (
                      <div key={index} className="border-l-4 border-red-400 pl-4 py-2 bg-red-50 rounded-r">
                        <p className="font-medium mb-2 text-red-800">• "{issue.text}"</p>
                        <p className="text-sm text-red-700">
                          <strong>Рекомендация:</strong> {issue.recommendation}
                        </p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="structure">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center justify-between w-full mr-4">
                    <span>Критерий: Структура</span>
                    <Badge variant={getScoreBadgeVariant(analysisData.details.structure.score)}>
                      Оценка: {analysisData.details.structure.score}/10
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Найдено {analysisData.details.structure.issues.length} проблем. Примеры:
                    </p>
                    {analysisData.details.structure.issues.map((issue: any, index: number) => (
                      <div key={index} className="border-l-4 border-red-300 pl-4 py-2 bg-red-50 rounded-r">
                        <p className="font-medium mb-2 text-red-800">• {issue.text}</p>
                        <p className="text-sm text-red-700">
                          <strong>Рекомендация:</strong> {issue.recommendation}
                        </p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="content">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center justify-between w-full mr-4">
                    <span>Критерий: Содержание</span>
                    <Badge variant={getScoreBadgeVariant(analysisData.details.content.score)}>
                      Оценка: {analysisData.details.content.score}/10
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Анализ содержания:
                    </p>
                    {analysisData.details.content.issues.map((issue: any, index: number) => (
                      <div key={index} className="border-l-4 border-red-500 pl-4 py-2 bg-red-50 rounded-r">
                        <p className="font-medium mb-2 text-red-800">• {issue.text}</p>
                        <p className="text-sm text-red-700">
                          <strong>Рекомендация:</strong> {issue.recommendation}
                        </p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="style">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center justify-between w-full mr-4">
                    <span>Критерий: Стиль изложения</span>
                    <Badge variant={getScoreBadgeVariant(analysisData.details.style.score)}>
                      Оценка: {analysisData.details.style.score}/10
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Анализ стиля изложения:
                    </p>
                    {analysisData.details.style.issues.map((issue: any, index: number) => (
                      <div key={index} className="border-l-4 border-red-600 pl-4 py-2 bg-red-50 rounded-r">
                        <p className="font-medium mb-2 text-red-800">• {issue.text}</p>
                        <p className="text-sm text-red-700">
                          <strong>Рекомендация:</strong> {issue.recommendation}
                        </p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Блок действий */}
        <Card className="shadow-lg border border-red-100">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={generatePDFReport} className="flex items-center space-x-2 bg-red-500 hover:bg-red-600">
                <Download className="w-4 h-4" />
                <span>Скачать полный отчет</span>
              </Button>
              <Button variant="outline" disabled className="flex items-center space-x-2 border-red-200 text-red-400">
                <span>Отправить ментору</span>
                <Badge variant="secondary" className="ml-2 bg-red-100 text-red-600">В разработке</Badge>
              </Button>
            </div>
            
            <div className="mt-6 p-4 bg-red-50 rounded-lg text-center border border-red-200">
              <p className="text-sm text-red-800">
                💡 <strong>Совет:</strong> Исправив эти замечания, вы можете повысить общую оценку на 2-3 балла!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};