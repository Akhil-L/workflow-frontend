import { create } from "zustand";
import { CONFIG } from "./config";

// --- DATA MODELS ---

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "worker" | "client";
  balance: number;
  completedModules: string[]; // Track training progress
  moduleAttempts: Record<string, number>; // moduleId -> attemptCount
  accuracyScore?: number; // 0-100
  approvedSubmissions?: number;
  rejectedSubmissions?: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  content: string;
  quiz: QuizQuestion[];
  passingScore: number; // e.g., 0.8 for 80%
  maxAttempts: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  payPerRow: number;
  status: "pending_review" | "open" | "assigned" | "submitted" | "approved" | "rejected";
  clientId?: string; 
  assignedTo?: string; 
  dataFields: string[];
  maxRows: number;
  createdAt: string;
  sourceDataUrl?: string; 
  validWarehouseNames?: string[]; 
  slaHours?: number; // Target turnaround time
  revisionPolicy?: string; // e.g. "Standard", "Strict"
  priority?: "low" | "medium" | "high";
}

export interface Submission {
  id: string;
  taskId: string;
  workerId: string;
  submittedAt: string;
  fileName: string;
  rowCount: number;
  previewData: any[];
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
}

export interface Earning {
  id: string;
  submissionId: string;
  workerId: string;
  amount: number;
  createdAt: string;
}

export interface Payout {
  id: string;
  workerId: string;
  earningIds: string[];
  amount: number;
  status: "pending" | "paid";
  createdAt: string;
  paidAt?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning";
  relatedId?: string;
  read: boolean;
  createdAt: string;
}

// --- TRAINING DATA ---

export const TRAINING_MODULES: TrainingModule[] = [
  {
    id: "m1",
    title: "Enterprise Data Integrity & Accuracy",
    description: "Core principles of high-precision data processing and verification.",
    content: `Precision is the cornerstone of Lexington Global Systems. In this module, you will master the 'Scan & Verify' methodology, a rigorous protocol designed to eliminate input variances and ensure 99.9% data fidelity.

Key Learning Objectives:
• Implementation of the Double-Entry Verification (DEV) cycle.
• Identification and remediation of character transposition errors.
• Maintaining data lineage from source material to digital output.

Accuracy isn't just a goal; it's our product. Every row you process contributes to the integrity of global enterprise systems.`,
    quiz: [
      {
        question: "What defines the 'Scan & Verify' methodology in our operations?",
        options: ["Automated OCR processing with no oversight", "Manual source-to-target alignment with secondary verification", "Using basic spreadsheet filters", "Quickly glancing at row headers"],
        correctAnswer: 1,
        explanation: "The Lexington 'Scan & Verify' protocol requires specialists to align digital entries directly with authenticated source materials before secondary audit."
      },
      {
        question: "Which error type represents the highest risk to data utility in bulk sets?",
        options: ["Minor capitalization variance", "Format inconsistency", "Numeric transposition in financial fields", "Missing optional metadata"],
        correctAnswer: 2,
        explanation: "Numeric transposition can lead to significant fiscal discrepancies in enterprise reporting and is a primary focus of our Quality Assurance (QA) audits."
      }
    ],
    passingScore: 1.0,
    maxAttempts: 3
  },
  {
    id: "m2",
    title: "Detecting Duplicates & Inconsistencies",
    description: "Ensuring data integrity in bulk sets.",
    content: `Data Integrity is vital...`,
    quiz: [
      {
        question: "How should you handle inconsistent country names like 'USA' and 'United States'?",
        options: ["Leave them as they are", "Delete all of them", "Standardize them to the format in task instructions", "Choose whichever you like best"],
        correctAnswer: 2,
        explanation: "Standardization ensures data is usable and professional."
      }
    ],
    passingScore: 1.0,
    maxAttempts: 3
  },
  {
    id: "m3",
    title: "Handling Messy or Unclear Data",
    description: "Strategies for low-quality source material.",
    content: `Unclear Source...`,
    quiz: [
      {
        question: "What should you do if a source scan is illegible?",
        options: ["Make your best guess", "Leave it blank without checking rules", "Follow task rules for 'N/A' or flag it", "Skip the entire row"],
        correctAnswer: 2,
        explanation: "Guessing leads to data errors. Always follow specific fallback instructions provided by the Admin."
      }
    ],
    passingScore: 1.0,
    maxAttempts: 3
  },
  {
    id: "m4",
    title: "Data Privacy & Ethical Handling",
    description: "Confidentiality and client information safety.",
    content: `Privacy...`,
    quiz: [
      {
        question: "Is it acceptable to save a copy of client data for your personal records?",
        options: ["Yes, for portfolio use", "Only if it doesn't contain names", "Never, it's a breach of confidentiality", "Only if the task is finished"],
        correctAnswer: 2,
        explanation: "Confidentiality is a legal and ethical requirement. Client data must never leave the secure platform environment."
      }
    ],
    passingScore: 1.0,
    maxAttempts: 3
  }
];

// --- MOCK DATA ---

export const MOCK_USERS: User[] = [
  { id: "u1", name: "Admin User", email: "admin@dataentry.pro", role: "admin", balance: 0, completedModules: [], moduleAttempts: {}, accuracyScore: 100, approvedSubmissions: 0, rejectedSubmissions: 0 },
  { id: "u2", name: "Sarah Worker", email: "sarah@worker.com", role: "worker", balance: 125.50, completedModules: ["m1", "m2", "m3", "m4"], moduleAttempts: { "m1": 1, "m2": 1, "m3": 1, "m4": 1 }, accuracyScore: 98, approvedSubmissions: 45, rejectedSubmissions: 1 },
  { id: "u3", name: "John Data", email: "john@worker.com", role: "worker", balance: 45.00, completedModules: [], moduleAttempts: {}, accuracyScore: 85, approvedSubmissions: 12, rejectedSubmissions: 2 },
  { id: "u4", name: "Acme Corp", email: "client@acme.com", role: "client", balance: 0, completedModules: [], moduleAttempts: {} },
];

export const MOCK_TASKS: Task[] = [
  { 
    id: "t1", 
    title: "Fiscal Audit: Q1 Invoice Processing", 
    description: "Verify and normalize high-volume invoice metadata from authenticated PDF sources into structured CSV output for enterprise ledger integration.", 
    payPerRow: 0.25, 
    status: "open", 
    dataFields: ["Vendor ID", "Fiscal Date", "Net Amount", "Tax ID"], 
    maxRows: CONFIG.DEFAULT_MAX_ROWS,
    createdAt: "2024-02-10T10:00:00Z",
    sourceDataUrl: "/data/enterprise_audit_q1.pdf",
    clientId: "u4"
  },
  { 
    id: "t2", 
    title: "Inventory Asset Verification Cycle", 
    description: "Perform secondary validation on global inventory logs. Specialists must cross-reference product identifiers with valid regional warehouse codes.", 
    payPerRow: 0.15, 
    status: "assigned", 
    assignedTo: "u2",
    dataFields: ["SKU-ID", "Asset Quantity", "Regional Hub"], 
    maxRows: 50,
    createdAt: "2024-02-11T09:30:00Z",
    sourceDataUrl: "/data/inventory_verification_m2.xlsx",
    validWarehouseNames: ["North-Hub", "East-Terminal", "South-Depot", "Central-Logistics"],
    clientId: "u4"
  }
];

// --- APP STATE ---

interface AppState {
  currentUser: User | null;
  tasks: Task[];
  submissions: Submission[];
  earnings: Earning[];
  payouts: Payout[];
  notifications: Notification[];
  
  login: (email: string, role: "admin" | "worker" | "client", name?: string) => void;
  logout: () => void;
  
  registerAttempt: (moduleId: string) => void;
  completeModule: (moduleId: string) => void;
  
  addTask: (task: Omit<Task, "id" | "createdAt" | "status">) => Promise<void>;
  clientSubmitTask: (task: Omit<Task, "id" | "createdAt" | "status">) => void;
  approveTask: (taskId: string) => Promise<void>;
  assignTask: (taskId: string, workerId?: string) => Promise<void>;
  submitTask: (taskId: string, fileName: string, data: any[]) => Promise<void>;
  reviewSubmission: (submissionId: string, status: "approved" | "rejected", reason?: string) => Promise<void>;
  markAsPaid: (payoutId: string) => void;
  markNotificationRead: (id: string) => void;
  // The initial tasks fetch logic needs to be moved to the component level 
  // since Zustand store actions shouldn't typically manage their own async lifecycle
  // outside of explicit action calls. We'll add a setTasks action.
  setTasks: (tasks: Task[]) => void;
  setSubmissions: (submissions: Submission[]) => void;
  fetchTasks: () => Promise<void>;
  fetchSubmissions: () => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  currentUser: null, 
  tasks: [],
  submissions: [],
  earnings: [],
  payouts: [],
  notifications: [
    { id: "n1", userId: "u2", title: "Welcome!", message: `Thanks for joining ${CONFIG.APP_NAME}.`, type: "info", read: false, createdAt: new Date().toISOString() }
  ],
  
  setTasks: (tasks) => set({ tasks }),
  setSubmissions: (submissions) => set({ submissions }),
  
  login: (email, role, name) => {
    // Check if user exists in mock data, or create a temporary one for the session
    const existingUser = MOCK_USERS.find(u => u.email === email);
    
    if (existingUser) {
       set({ currentUser: existingUser });
    } else {
       // Initialize dynamic stats as 0 for new sessions
       set({ 
         currentUser: { 
           id: "session_" + Math.random().toString(36).substr(2, 9), 
           name: name || "User", 
           email, 
           role, 
           balance: 0, 
           completedModules: ["m1", "m2", "m3", "m4"], 
           moduleAttempts: { "m1": 1, "m2": 1, "m3": 1, "m4": 1 },
           accuracyScore: 0,
           approvedSubmissions: 0,
           rejectedSubmissions: 0
         } 
       });
    }
  },

  logout: () => set({ currentUser: null }),

  registerAttempt: (moduleId) => set((state) => {
    if (!state.currentUser) return state;
    const attempts = { ...state.currentUser.moduleAttempts };
    attempts[moduleId] = (attempts[moduleId] || 0) + 1;
    return {
      currentUser: { ...state.currentUser, moduleAttempts: attempts }
    };
  }),

  completeModule: (moduleId) => set((state) => {
    if (!state.currentUser) return state;
    if (state.currentUser.completedModules.includes(moduleId)) return state;
    
    return {
      currentUser: {
        ...state.currentUser,
        completedModules: [...state.currentUser.completedModules, moduleId]
      }
    };
  }),

  addTask: async (taskData) => {
    const { currentUser } = get();
    if (currentUser?.role !== 'admin') return;
    
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(taskData)
      });
      
      if (response.ok) {
        const newTask = await response.json();
        set((state) => ({
          tasks: [...state.tasks, newTask]
        }));
      }
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  },

  clientSubmitTask: async (taskData) => {
    const { currentUser } = get();
    if (currentUser?.role !== 'client') return;
    
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ ...taskData, clientId: currentUser.id, status: 'pending_review' })
      });
      
      if (response.ok) {
        const newTask = await response.json();
        set((state) => ({
          tasks: [...state.tasks, newTask]
        }));
      }
    } catch (error) {
      console.error("Failed to submit client task:", error);
    }
  },

  approveTask: async (taskId) => {
    const { currentUser } = get();
    if (currentUser?.role !== 'admin') return;
    
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/api/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: 'open' })
      });
      
      if (response.ok) {
        set((state) => ({
          tasks: state.tasks.map(t => t.id === taskId ? { ...t, status: "open" } : t)
        }));
      }
    } catch (error) {
      console.error("Failed to approve task:", error);
    }
  },

  assignTask: async (taskId, workerId) => {
    const { currentUser } = get();
    if (currentUser?.role !== 'admin' && currentUser?.id !== workerId) return;
    
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/api/tasks/${taskId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ workerId })
      });
      
      if (response.ok) {
        set((state) => ({
          tasks: state.tasks.map(t => t.id === taskId ? { ...t, status: "assigned", assignedTo: workerId } : t)
        }));
      }
    } catch (error) {
      console.error("Failed to assign task:", error);
    }
  },

  submitTask: async (taskId, fileName, data) => {
    const state = get();
    const task = state.tasks.find(t => t.id === taskId);
    if (!task || !state.currentUser || task.assignedTo !== state.currentUser.id) return;
    if (task.status === 'submitted' || task.status === 'approved') return;

    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/api/tasks/${taskId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ fileName, rowCount: data.length, previewData: data.slice(0, 10) })
      });
      
      if (response.ok) {
        const newSubmission = await response.json();
        set((state) => ({
          submissions: [...state.submissions, newSubmission],
          tasks: state.tasks.map(t => t.id === taskId ? { ...t, status: "submitted" } : t)
        }));
      } else {
        // Fallback for mockup if API fails
        const newSubmission: Submission = {
          id: Math.random().toString(36).substr(2, 9),
          taskId,
          workerId: state.currentUser.id,
          submittedAt: new Date().toISOString(),
          fileName,
          rowCount: data.length,
          previewData: data.slice(0, 10),
          status: "pending"
        };

        set((state) => ({
          submissions: [...state.submissions, newSubmission],
          tasks: state.tasks.map(t => t.id === taskId ? { ...t, status: "submitted" } : t)
        }));
      }
    } catch (error) {
      console.error("Failed to submit task:", error);
      
      // Fallback for mockup if API fails
      const newSubmission: Submission = {
        id: Math.random().toString(36).substr(2, 9),
        taskId,
        workerId: state.currentUser!.id,
        submittedAt: new Date().toISOString(),
        fileName,
        rowCount: data.length,
        previewData: data.slice(0, 10),
        status: "pending"
      };

      set((state) => ({
        submissions: [...state.submissions, newSubmission],
        tasks: state.tasks.map(t => t.id === taskId ? { ...t, status: "submitted" } : t)
      }));
    }
  },

  reviewSubmission: async (submissionId, status, reason) => {
    const state = get();
    if (state.currentUser?.role !== 'admin') return;
    
    const submission = state.submissions.find(s => s.id === submissionId);
    if (!submission) return;

    const task = state.tasks.find(t => t.id === submission.taskId);
    if (!task) return;
    
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/api/submissions/${submissionId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status, reason })
      });
      
      if (response.ok) {
        // Process the local state updates since we need to update earnings, payouts, etc.
        let newEarnings = [...state.earnings];
        let newPayouts = [...state.payouts];
        let newBalance = state.currentUser?.id === submission.workerId ? state.currentUser.balance : 0;
        
        const earningAmount = status === "approved" ? submission.rowCount * task.payPerRow : 0;

        if (status === "approved") {
          const earningId = Math.random().toString(36).substr(2, 9);
          const earning: Earning = {
            id: earningId,
            submissionId: submission.id,
            workerId: submission.workerId,
            amount: earningAmount,
            createdAt: new Date().toISOString()
          };
          newEarnings.push(earning);

          const payoutId = Math.random().toString(36).substr(2, 9);
          newPayouts.push({
            id: payoutId,
            workerId: submission.workerId,
            earningIds: [earningId],
            amount: earningAmount,
            status: "pending",
            createdAt: new Date().toISOString()
          });
          
          if (state.currentUser?.id === submission.workerId) {
            newBalance = state.currentUser.balance + earningAmount;
          }
        }
        
        const notification: Notification = {
          id: Math.random().toString(36).substr(2, 9),
          userId: submission.workerId,
          title: status === "approved" ? "Task Approved!" : "Task Rejected",
          message: status === "approved" 
            ? `Your submission for "${task.title}" was approved. $${earningAmount.toFixed(2)} added to pending payouts.`
            : `Your submission for "${task.title}" was rejected. Reason: ${reason || "No reason provided."}`,
          type: status === "approved" ? "success" : "warning",
          relatedId: submission.id,
          read: false,
          createdAt: new Date().toISOString()
        };

        set((state) => ({
          earnings: newEarnings,
          payouts: newPayouts,
          notifications: [...state.notifications, notification],
          submissions: state.submissions.map(s => s.id === submissionId ? { ...s, status, rejectionReason: reason } : s),
          tasks: state.tasks.map(t => t.id === submission.taskId ? { ...t, status: status === "approved" ? "approved" : "rejected" } : t),
          currentUser: state.currentUser?.id === submission.workerId ? { ...state.currentUser, balance: newBalance } : state.currentUser
        }));
      }
    } catch (error) {
      console.error("Failed to review submission:", error);
    }
  },

  markAsPaid: (payoutId) => set((state) => {
    if (state.currentUser?.role !== 'admin') return state;
    
    const payout = state.payouts.find(p => p.id === payoutId);
    if (!payout) return state;

    const notification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId: payout.workerId,
      title: "Payout Released",
      message: `Your payout of $${payout.amount.toFixed(2)} has been marked as paid.`,
      type: "success",
      relatedId: payout.id,
      read: false,
      createdAt: new Date().toISOString()
    };

    return {
      payouts: state.payouts.map(p => p.id === payoutId ? { ...p, status: "paid", paidAt: new Date().toISOString() } : p),
      notifications: [...state.notifications, notification]
    };
  }),

  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),

  addNotification: (userId: string, title: string, message: string, type: "info" | "success" | "warning", relatedId?: string) => set((state) => ({
    notifications: [...state.notifications, {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      title,
      message,
      type,
      relatedId,
      read: false,
      createdAt: new Date().toISOString()
    }]
  })),

  fetchTasks: async () => {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/api/tasks`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        set({ tasks: data });
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  },

  fetchSubmissions: async () => {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/api/submissions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        set({ submissions: data });
      }
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
    }
  }
}));
