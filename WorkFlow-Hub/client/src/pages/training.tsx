import { Layout } from "@/components/layout";
import { useStore, TRAINING_MODULES, TrainingModule } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  BookOpen, 
  CheckCircle2, 
  Lock, 
  ChevronRight, 
  GraduationCap,
  Trophy,
  AlertCircle,
  XCircle,
  HelpCircle,
  ShieldCheck,
  Target,
  FileText
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function TrainingPage() {
  const { currentUser, completeModule, registerAttempt } = useStore();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const [activeModule, setActiveModule] = useState<TrainingModule | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizResults, setQuizResults] = useState<{ score: number; passed: boolean } | null>(null);

  if (!currentUser || currentUser.role !== "worker") {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold">Access Restricted</h1>
          <p className="text-slate-500">Only workers can access the training portal.</p>
        </div>
      </Layout>
    );
  }

  const completedCount = currentUser.completedModules.length;
  const progressPercent = (completedCount / TRAINING_MODULES.length) * 100;
  const isFullyTrained = completedCount === TRAINING_MODULES.length;

  const handleStartModule = (module: TrainingModule) => {
    setActiveModule(module);
    setShowQuiz(false);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuizResults(null);
  };

  const handleQuizSubmit = () => {
    if (!activeModule) return;
    
    let correctCount = 0;
    activeModule.quiz.forEach((q, idx) => {
      if (parseInt(userAnswers[idx]) === q.correctAnswer) {
        correctCount++;
      }
    });

    const score = correctCount / activeModule.quiz.length;
    const passed = score >= activeModule.passingScore;

    registerAttempt(activeModule.id);
    setQuizResults({ score, passed });

    if (passed) {
      completeModule(activeModule.id);
      toast({
        title: "Module Authorized",
        description: `Score: ${Math.round(score * 100)}%. Qualification updated.`,
        className: "bg-emerald-600 text-white border-none rounded-2xl font-black uppercase tracking-tight"
      });
    } else {
      toast({
        title: "Authorization Failed",
        description: `Score: ${Math.round(score * 100)}%. Required: ${Math.round(activeModule.passingScore * 100)}%.`,
        variant: "destructive",
        className: "rounded-2xl font-black uppercase tracking-tight"
      });
    }
  };

  const handleNextModule = () => {
    const currentIndex = TRAINING_MODULES.findIndex(m => m.id === activeModule?.id);
    if (currentIndex < TRAINING_MODULES.length - 1) {
      handleStartModule(TRAINING_MODULES[currentIndex + 1]);
    } else {
      setActiveModule(null);
    }
  };

  const handlePrevModule = () => {
    const currentIndex = TRAINING_MODULES.findIndex(m => m.id === activeModule?.id);
    if (currentIndex > 0) {
      handleStartModule(TRAINING_MODULES[currentIndex - 1]);
    }
  };

  const currentAttempts = currentUser.moduleAttempts[activeModule?.id || ""] || 0;
  const isOutOfAttempts = activeModule && currentAttempts >= activeModule.maxAttempts && !currentUser.completedModules.includes(activeModule.id);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="space-y-3">
            <Badge className="bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.2em] px-3 py-1 mb-2">Lexington Academy</Badge>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 flex items-center gap-4">
              <ShieldCheck className="h-10 w-10 text-blue-600" />
              Specialist Certification
            </h1>
            <p className="text-slate-500 font-medium text-lg max-w-xl">Advance through our proprietary verification protocols to unlock Tier-1 mission opportunities.</p>
          </div>
          <Card className="bg-white border-slate-200/60 premium-shadow w-full md:w-80 rounded-[2rem] overflow-hidden">
            <CardContent className="p-8">
              <div className="flex justify-between items-end mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Academy Completion</span>
                <span className="text-2xl font-black text-slate-900 tracking-tight">{Math.round(progressPercent)}%</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-1000 ease-out" style={{ width: `${progressPercent}%` }} />
              </div>
              <p className="mt-4 text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                <Target className="h-3 w-3" /> {completedCount} / {TRAINING_MODULES.length} Modules Verified
              </p>
            </CardContent>
          </Card>
        </div>

        {isFullyTrained && (
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 border-none rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-10 shadow-2xl shadow-emerald-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-10 transition-transform group-hover:scale-125 group-hover:rotate-12">
              <Trophy className="h-48 w-48 text-white" />
            </div>
            <div className="p-6 bg-white/10 rounded-[2rem] text-white backdrop-blur-md border border-white/20 shadow-xl relative z-10">
              <Trophy className="h-12 w-12" />
            </div>
            <div className="flex-1 text-center md:text-left relative z-10">
              <h3 className="text-3xl font-black text-white tracking-tight mb-2">Tier-1 Certification Secured</h3>
              <p className="text-emerald-100 font-medium text-lg leading-relaxed max-w-xl">Your identity and skills have been cryptographically verified. Access to high-yield enterprise vaults is now authorized.</p>
            </div>
            <Button onClick={() => setLocation("/dashboard")} className="bg-white text-emerald-700 hover:bg-emerald-50 font-black px-10 h-14 rounded-2xl shadow-xl transition-all relative z-10 text-xs uppercase tracking-[0.2em]">
              Access Vaults
            </Button>
          </div>
        )}

        {activeModule ? (
          <div className="grid lg:grid-cols-4 gap-12 items-start animate-in slide-in-from-bottom-8 duration-500">
            <Card className="lg:col-span-3 border-slate-200/60 premium-shadow rounded-[2.5rem] overflow-hidden bg-white min-h-[600px] flex flex-col">
              <CardHeader className="p-10 border-b border-slate-50">
                <div className="flex justify-between items-center mb-6">
                  <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full">Protocol {TRAINING_MODULES.indexOf(activeModule) + 1}</Badge>
                  <Button variant="ghost" size="sm" className="font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-red-600 transition-colors" onClick={() => setActiveModule(null)}>Abort Module</Button>
                </div>
                <CardTitle className="text-4xl font-black text-slate-900 tracking-tight leading-tight">{activeModule.title}</CardTitle>
                <div className="flex gap-6 mt-6">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <Trophy className="h-3.5 w-3.5 text-blue-600" /> Threshold: {Math.round(activeModule.passingScore * 100)}%
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <AlertCircle className="h-3.5 w-3.5 text-blue-600" /> Attempts: {currentAttempts} / {activeModule.maxAttempts}
                  </div>
                </div>
              </CardHeader>
              
              {!showQuiz ? (
                <>
                  <CardContent className="p-10 flex-1 prose prose-slate max-w-none">
                    <div className="text-xl leading-relaxed text-slate-600 font-medium space-y-6">
                      {activeModule.content.split('\n').map((para, i) => (
                        <p key={i} className="mb-6">{para}</p>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="p-10 border-t border-slate-50 flex justify-between bg-slate-50/30">
                    <Button 
                      variant="outline" 
                      className="h-12 px-8 rounded-xl font-black text-[10px] uppercase tracking-widest border-slate-200"
                      onClick={handlePrevModule}
                      disabled={TRAINING_MODULES.indexOf(activeModule) === 0}
                    >
                      Previous Protocol
                    </Button>
                    {isOutOfAttempts ? (
                      <div className="flex items-center gap-3 text-red-600 font-black text-[10px] uppercase tracking-widest bg-red-50 px-6 rounded-2xl border border-red-100 h-12">
                        <XCircle className="h-4 w-4" /> Maximum Access Attempts Reached
                      </div>
                    ) : (
                      <div className="flex gap-4">
                         <Button 
                          variant="ghost"
                          className="h-12 px-8 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-400"
                          onClick={handleNextModule}
                          disabled={TRAINING_MODULES.indexOf(activeModule) === TRAINING_MODULES.length - 1}
                        >
                          Skip Content
                        </Button>
                        <Button onClick={() => setShowQuiz(true)} className="bg-blue-600 hover:bg-blue-500 h-12 px-10 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-500/20 group">
                          Initialize Verification <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </div>
                    )}
                  </CardFooter>
                </>
              ) : quizResults ? (
                <CardContent className="p-20 text-center space-y-10 flex-1 flex flex-col items-center justify-center">
                  <div className={`p-8 rounded-[2rem] shadow-2xl ${quizResults.passed ? 'bg-emerald-50 text-emerald-600 shadow-emerald-500/10' : 'bg-red-50 text-red-600 shadow-red-500/10'}`}>
                    {quizResults.passed ? <CheckCircle2 className="h-20 w-20" /> : <XCircle className="h-20 w-20" />}
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">{quizResults.passed ? "Authorization Secured" : "Verification Failed"}</h2>
                    <p className="text-slate-500 text-lg font-medium">System Telemetry: Accuracy at {Math.round(quizResults.score * 100)}%</p>
                  </div>
                  
                  <div className="w-full max-w-xl text-left border border-slate-100 rounded-[2rem] p-8 bg-slate-50/50 space-y-6">
                    <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                      <FileText className="h-4 w-4" /> Audit Log Feedback
                    </h4>
                    <div className="space-y-4">
                      {activeModule.quiz.map((q, i) => (
                        <div key={i} className="flex gap-4 items-start">
                          <div className={`mt-1 p-1 rounded-full ${parseInt(userAnswers[i]) === q.correctAnswer ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                            {parseInt(userAnswers[i]) === q.correctAnswer ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 leading-tight">{q.question}</p>
                            <p className="text-xs text-slate-500 mt-1 font-medium italic">{q.explanation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" className="h-12 px-8 rounded-xl font-black text-[10px] uppercase tracking-widest border-slate-200" onClick={() => handleStartModule(activeModule)}>
                      {quizResults.passed ? "Review Content" : "Restart Protocol"}
                    </Button>
                    {quizResults.passed ? (
                      <Button onClick={handleNextModule} className="bg-blue-600 hover:bg-blue-500 h-12 px-10 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-500/20">
                        {TRAINING_MODULES.indexOf(activeModule) === TRAINING_MODULES.length - 1 ? "Finish Certification" : "Next Protocol"}
                      </Button>
                    ) : (
                      <Button onClick={() => setActiveModule(null)} variant="ghost" className="h-12 px-8 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-400">Exit</Button>
                    )}
                  </div>
                </CardContent>
              ) : (
                <>
                  <CardContent className="p-10 flex-1 space-y-12">
                    <div className="space-y-8">
                      <div className="flex justify-between items-end border-b border-slate-50 pb-6">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Verification Instance</p>
                          <h4 className="text-2xl font-black text-slate-900 tracking-tight">Challenge {currentQuestionIndex + 1} of {activeModule.quiz.length}</h4>
                        </div>
                        <HelpCircle className="h-6 w-6 text-slate-200" />
                      </div>
                      
                      <div className="space-y-10">
                        <p className="text-2xl font-black text-slate-800 leading-tight max-w-3xl">{activeModule.quiz[currentQuestionIndex].question}</p>
                        <RadioGroup 
                          onValueChange={(val) => setUserAnswers({...userAnswers, [currentQuestionIndex]: val})} 
                          value={userAnswers[currentQuestionIndex] || ""}
                          className="grid md:grid-cols-1 gap-4"
                        >
                          {activeModule.quiz[currentQuestionIndex].options.map((option, i) => (
                            <div key={i} className={`flex items-center space-x-4 p-6 border-2 rounded-[1.5rem] transition-all duration-300 group cursor-pointer ${userAnswers[currentQuestionIndex] === i.toString() ? 'border-blue-600 bg-blue-50/30' : 'border-slate-100 bg-white hover:border-blue-200'}`} onClick={() => setUserAnswers({...userAnswers, [currentQuestionIndex]: i.toString()})}>
                              <RadioGroupItem value={i.toString()} id={`opt-${i}`} className="h-5 w-5 border-2 text-blue-600" />
                              <Label htmlFor={`opt-${i}`} className="flex-1 cursor-pointer font-black text-lg text-slate-900 group-hover:text-blue-700 transition-colors">{option}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-10 border-t border-slate-50 flex justify-between bg-slate-50/30">
                    <Button 
                      variant="ghost" 
                      className="h-12 px-8 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-400"
                      onClick={() => setCurrentQuestionIndex(prev => prev - 1)} 
                      disabled={currentQuestionIndex === 0}
                    >
                      Previous Stage
                    </Button>
                    <div className="flex items-center gap-4">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-4">
                        Phase {currentQuestionIndex + 1} / {activeModule.quiz.length}
                      </div>
                      {currentQuestionIndex < activeModule.quiz.length - 1 ? (
                        <Button 
                          className="h-12 px-10 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl bg-slate-900 text-white hover:bg-slate-800 transition-all"
                          onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                          disabled={!userAnswers[currentQuestionIndex]}
                        >
                          Advance Phase <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      ) : (
                        <Button 
                          onClick={handleQuizSubmit} 
                          className="h-14 px-12 font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl bg-blue-600 text-white shadow-2xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                          disabled={Object.keys(userAnswers).length < activeModule.quiz.length}
                        >
                          Authorize Submission
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </>
              )}
            </Card>

            <div className="space-y-6">
              <h3 className="font-black text-slate-900 px-2 uppercase text-[10px] tracking-[0.2em] text-slate-400">Curriculum Sequence</h3>
              <div className="space-y-3">
                {TRAINING_MODULES.map((m, idx) => {
                  const isCompleted = currentUser.completedModules.includes(m.id);
                  const isActive = m.id === activeModule.id;
                  return (
                    <div key={m.id} className={`p-5 rounded-2xl border transition-all duration-300 flex items-center gap-4 ${isActive ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/20 scale-[1.05]' : isCompleted ? 'bg-white border-slate-200 opacity-60' : 'bg-slate-50 border-slate-100 opacity-40'}`}>
                      <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${isActive ? 'bg-white/20' : isCompleted ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                        {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <div className="text-[10px] font-black">{idx + 1}</div>}
                      </div>
                      <div className="space-y-0.5">
                        <p className={`text-xs font-black tracking-tight ${isActive ? 'text-white' : 'text-slate-900'}`}>{m.title}</p>
                        {isActive && <p className="text-[9px] font-black uppercase tracking-widest text-blue-200">Current Phase</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TRAINING_MODULES.map((module, index) => {
              const isCompleted = currentUser.completedModules.includes(module.id);
              const isLocked = index > 0 && !currentUser.completedModules.includes(TRAINING_MODULES[index - 1].id);
              const attempts = currentUser.moduleAttempts[module.id] || 0;
              
              return (
                <Card 
                  key={module.id} 
                  className={`flex flex-col h-full transition-all duration-500 border-slate-200/60 bg-white rounded-[2.5rem] overflow-hidden group ${isLocked ? 'opacity-50 grayscale pointer-events-none' : 'hover:shadow-2xl hover:translate-y-[-8px] premium-shadow'}`}
                >
                  <CardHeader className="p-8 pb-4">
                    <div className="flex justify-between items-start mb-6">
                      <div className={`p-4 rounded-2xl transition-transform group-hover:rotate-6 group-hover:scale-110 ${isCompleted ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : isLocked ? 'bg-slate-50 text-slate-300' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                        {isCompleted ? <CheckCircle2 className="h-7 w-7" /> : isLocked ? <Lock className="h-7 w-7" /> : <GraduationCap className="h-7 w-7" />}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {isCompleted && <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200 font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full">Authorized</Badge>}
                        {!isCompleted && !isLocked && attempts > 0 && <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-3 py-1 rounded-full">{attempts} / {module.maxAttempts} Tries</Badge>}
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">{module.title}</CardTitle>
                    <CardDescription className="font-medium text-slate-500 mt-2 line-clamp-2">{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 flex-1 space-y-4">
                    <div className="h-px bg-slate-50 w-full" />
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span className="flex items-center gap-1.5"><HelpCircle className="h-3.5 w-3.5" /> {module.quiz.length} Challenges</span>
                      <span className="flex items-center gap-1.5"><Target className="h-3.5 w-3.5" /> {Math.round(module.passingScore * 100)}% Pass</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-8 pt-0">
                    {isCompleted ? (
                      <Button variant="outline" className="w-full h-12 rounded-2xl border-slate-200 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all" onClick={() => handleStartModule(module)}>
                        Audit Protocol
                      </Button>
                    ) : isLocked ? (
                      <Button disabled className="w-full h-12 rounded-2xl bg-slate-50 text-slate-300 border-none font-black text-[10px] uppercase tracking-widest">
                        Protocol Locked
                      </Button>
                    ) : (
                      <Button className="w-full h-12 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 font-black text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all shadow-slate-200" onClick={() => handleStartModule(module)}>
                        {attempts > 0 ? "Resume Validation" : "Initialize Certification"}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
