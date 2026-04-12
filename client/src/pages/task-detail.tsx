import { useParams, useLocation } from "wouter";
import { useStore } from "@/lib/mock-data";
import { CONFIG } from "@/lib/config";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, FileText, AlertCircle, CheckCircle2, ShieldAlert, ListChecks, Download } from "lucide-react";
import { useState, useRef } from "react";

export default function TaskDetail() {
  const { id } = useParams();
  const [_, setLocation] = useLocation();
  const { tasks, submissions, submitTask, currentUser } = useStore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const task = tasks.find(t => t.id === id);
  const submission = submissions.find(s => s.taskId === id && s.workerId === currentUser?.id);

  if (!currentUser) return <Layout><div className="p-8 text-center">Please log in to view task details.</div></Layout>;
  
  // Rule: If task doesn't exist or has no source data, it's not visible/accessible
  if (!task || !task.sourceDataUrl) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20">
          <AlertCircle className="h-12 w-12 text-slate-300 mb-4" />
          <h1 className="text-2xl font-bold text-slate-800">Task Unavailable</h1>
          <p className="text-slate-500">This task is currently inactive or missing source data.</p>
          <Button onClick={() => setLocation("/dashboard")} variant="link">Return to Dashboard</Button>
        </div>
      </Layout>
    );
  }

  const isAssignedToMe = task.assignedTo === currentUser.id;
  const isOpenTask = task.status === 'open';

  if (currentUser.role !== 'admin' && !isAssignedToMe && !isOpenTask) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20 animate-in fade-in slide-in-from-bottom-4">
          <div className="p-4 rounded-full bg-red-50 text-red-600 mb-6">
            <ShieldAlert className="h-12 w-12" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">Access Restricted</h1>
          <p className="text-slate-500 mb-8 max-w-md text-center">You are not authorized to view the details of this specific task as it is not assigned to you.</p>
          <Button onClick={() => setLocation("/dashboard")} className="font-semibold">
            Back to My Tasks
          </Button>
        </div>
      </Layout>
    );
  }

  const validateAndParseFile = async (file: File): Promise<{ success: boolean; data?: any[]; error?: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const rows = content.split('\n').filter(row => row.trim());
          
          if (rows.length < 2) {
            resolve({ success: false, error: "File appears to be empty or missing headers." });
            return;
          }

          const headers = rows[0].split(',').map(h => h.trim().replace(/"/g, ''));
          const dataRows = rows.slice(1);

          // Required Column Check
          const missingColumns = task.dataFields.filter(f => !headers.includes(f));
          if (missingColumns.length > 0) {
            resolve({ 
              success: false, 
              error: `Missing required columns: ${missingColumns.join(', ')}. Please check the template instructions.` 
            });
            return;
          }

          // Row Count Check (Min 1 row of data)
          if (dataRows.length === 0) {
            resolve({ success: false, error: "Submission must contain at least one row of data." });
            return;
          }

          if (dataRows.length > task.maxRows) {
            resolve({ 
              success: false, 
              error: `This task allows a maximum of ${task.maxRows} rows. Your file has ${dataRows.length} rows.` 
            });
            return;
          }

          const parsedData = dataRows.map(row => {
            const values = row.split(',').map(v => v.trim().replace(/"/g, ''));
            const obj: any = {};
            headers.forEach((h, i) => obj[h] = values[i]);
            return obj;
          });

          // Custom Validation: Warehouse Check
          if (task.validWarehouseNames && task.validWarehouseNames.length > 0) {
            const invalidRows = parsedData.filter(row => !task.validWarehouseNames?.includes(row["Warehouse"]));
            if (invalidRows.length > 0) {
              resolve({ 
                success: false, 
                error: `Invalid Warehouse detected. Allowed: ${task.validWarehouseNames.join(", ")}` 
              });
              return;
            }
          }

          resolve({ success: true, data: parsedData });
        } catch (err) {
          resolve({ success: false, error: "Failed to parse file. Ensure it's a valid CSV format." });
        }
      };
      reader.onerror = () => resolve({ success: false, error: "File reading error." });
      reader.readAsText(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    if (!CONFIG.ALLOWED_EXTENSIONS.includes(ext || "")) {
      toast({ title: "Invalid file type", description: `Allowed types: ${CONFIG.ALLOWED_EXTENSIONS.join(", ").toUpperCase()}`, variant: "destructive" });
      return;
    }

    if (selectedFile.size > CONFIG.MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast({ title: "File too large", description: `Maximum file size is ${CONFIG.MAX_FILE_SIZE_MB}MB.`, variant: "destructive" });
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsProcessing(true);

    const validation = await validateAndParseFile(file);
    
    if (!validation.success) {
      toast({ 
        title: "Validation Failed", 
        description: validation.error, 
        variant: "destructive" 
      });
      setIsProcessing(false);
      return;
    }

    submitTask(task.id, file.name, validation.data!);
    toast({ 
      title: "Task Submitted", 
      description: `Successfully uploaded ${file.name} with ${validation.data!.length} rows.` 
    });
    setIsProcessing(false);
    setLocation("/dashboard");
  };

  const canSubmit = (task.status === 'assigned' || task.status === 'rejected') && isAssignedToMe;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="flex items-center justify-between">
          <Button onClick={() => setLocation(currentUser.role === 'admin' ? "/admin" : "/dashboard")} variant="ghost" className="pl-0 gap-3 font-black text-xs uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-all group">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Workspace
          </Button>
          <Badge variant="outline" className="bg-white border-slate-200 text-slate-500 font-black px-4 py-1 rounded-full uppercase tracking-widest text-[10px]">
            SLA Phase: Processing
          </Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <Card className="bg-white border-slate-200/60 premium-shadow rounded-3xl overflow-hidden">
              <CardHeader className="p-10 border-b border-slate-50">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-2">
                    <Badge className="bg-blue-600 hover:bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest px-3 py-1 mb-2">Enterprise Mission</Badge>
                    <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">{task.title}</CardTitle>
                    <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-xl">{task.description}</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center justify-center min-w-[140px]">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Reward Rate</p>
                    <div className="text-2xl font-black text-blue-600">${task.payPerRow.toFixed(2)}<span className="text-sm font-medium text-slate-400 ml-1">/row</span></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-10 space-y-10">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-xl shadow-blue-500/20 group cursor-pointer overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-8 opacity-10 transition-transform group-hover:scale-125 group-hover:rotate-12">
                    <Download className="h-32 w-32" />
                  </div>
                  <div className="p-5 bg-white/10 rounded-2xl text-white backdrop-blur-md border border-white/20 transition-transform group-hover:scale-110">
                    <Download className="h-8 w-8" />
                  </div>
                  <div className="flex-1 text-center md:text-left relative z-10">
                    <p className="text-white font-black text-xl mb-1">Source Intelligence Data</p>
                    <p className="text-blue-100 font-medium text-sm">Download the raw source intelligence file to begin auditing and processing.</p>
                  </div>
                  <Button className="bg-white text-blue-600 hover:bg-blue-50 font-black px-8 h-12 shadow-lg rounded-2xl transition-all relative z-10">
                    Download Package
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100 space-y-6">
                    <h4 className="font-black text-sm uppercase tracking-widest text-slate-900 flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-white border border-slate-100 shadow-sm"><FileText className="h-4 w-4 text-blue-600" /></div>
                      Required Schema
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {task.dataFields.map(f => (
                        <span key={f} className="bg-white border border-slate-200 px-4 py-2 rounded-2xl text-xs font-black text-slate-600 shadow-sm transition-all hover:border-blue-300 hover:text-blue-600 cursor-default">{f}</span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100 space-y-6">
                    <h4 className="font-black text-sm uppercase tracking-widest text-slate-900 flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-white border border-slate-100 shadow-sm"><ListChecks className="h-4 w-4 text-emerald-600" /></div>
                      Quality Standards
                    </h4>
                    <ul className="space-y-4">
                      <li className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Maximum Payload</span>
                        <span className="text-sm font-black text-slate-900">{task.maxRows} Units</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Network Format</span>
                        <span className="text-sm font-black text-slate-900">{CONFIG.ALLOWED_EXTENSIONS.join(", ").toUpperCase()}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">System Policy</span>
                        <span className="text-sm font-black text-slate-900">Standard SLA</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {task.status === 'rejected' && submission?.rejectionReason && (
                  <Alert variant="destructive" className="bg-red-50 border-red-100 text-red-800">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle className="font-bold">Rejection Reason</AlertTitle>
                    <AlertDescription>{submission.rejectionReason}</AlertDescription>
                  </Alert>
                )}

                {task.status === 'submitted' && (
                  <Alert className="bg-blue-50 border-blue-100 text-blue-800">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <AlertTitle className="font-bold">Under Review</AlertTitle>
                    <AlertDescription>Your submission is being reviewed. Duplicate uploads are disabled while review is pending.</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-10">
            <Card className={`${!canSubmit ? "opacity-60 grayscale" : "premium-shadow border-blue-600/20"} bg-white rounded-[2rem] overflow-hidden`}>
              <CardHeader className="p-10 pb-6">
                <CardTitle className="text-xl font-black flex items-center gap-4 text-slate-900 tracking-tight">
                  <div className="p-3 rounded-2xl bg-blue-50 text-blue-600"><Upload className="h-6 w-6" /></div>
                  Mission Submission
                </CardTitle>
                <p className="text-slate-500 font-medium text-sm mt-2">Transmit your processed data unit to the central verification hub.</p>
              </CardHeader>
              <CardContent className="px-10 pb-10 space-y-6">
                <div 
                  className={`border-4 border-dashed rounded-[2rem] p-12 text-center transition-all duration-300 ${file ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 bg-slate-50/50 hover:border-blue-200'} ${canSubmit ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                  onClick={() => canSubmit && fileInputRef.current?.click()}
                >
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept=".csv,.xlsx" disabled={!canSubmit || isProcessing} />
                  {file ? (
                    <div className="space-y-4 animate-in zoom-in-95 duration-300">
                      <div className="h-20 w-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white mx-auto shadow-xl shadow-blue-500/20">
                        <FileText className="h-10 w-10" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-lg font-black text-slate-900 truncate px-4">{file.name}</p>
                        <p className="text-xs font-black text-blue-600 uppercase tracking-widest">{(file.size / 1024).toFixed(1)} KB Ready</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 opacity-60">
                      <div className="h-20 w-20 bg-slate-200 rounded-3xl flex items-center justify-center text-slate-400 mx-auto">
                        <Upload className="h-10 w-10" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Awaiting Payload</p>
                        <p className="text-xs font-medium text-slate-500">Drop CSV/XLSX or click to browse</p>
                      </div>
                    </div>
                  )}
                </div>

                {task.status === 'rejected' && submission?.rejectionReason && (
                  <Alert variant="destructive" className="bg-red-50 border-red-100 rounded-2xl p-6 text-red-800">
                    <AlertCircle className="h-5 w-5" />
                    <div className="ml-4">
                      <AlertTitle className="font-black text-sm uppercase tracking-widest mb-2">Audit Correction Required</AlertTitle>
                      <AlertDescription className="font-medium text-sm">{submission.rejectionReason}</AlertDescription>
                    </div>
                  </Alert>
                )}

                {task.status === 'submitted' && (
                  <Alert className="bg-blue-50 border-blue-100 rounded-2xl p-6 text-blue-800">
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                    <div className="ml-4">
                      <AlertTitle className="font-black text-sm uppercase tracking-widest mb-2">Audit in Progress</AlertTitle>
                      <AlertDescription className="font-medium text-sm">Our QA specialists are currently verifying your submission. You will be notified upon settlement.</AlertDescription>
                    </div>
                  </Alert>
                )}
              </CardContent>
              <CardFooter className="px-10 pb-10 pt-0">
                <Button className="w-full h-14 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-95" disabled={!file || !canSubmit || isProcessing} onClick={handleUpload}>
                  {isProcessing ? "Cryptographic Verification..." : "Authorize Submission"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
