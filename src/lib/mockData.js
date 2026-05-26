// Mock in-memory data store
// Replace SQL queries here when you connect real PostgreSQL

export const mockUsers = [
  { id: 1, name: "Super Admin", email: "admin@school.edu.bd", phone: "01700000000", password: "admin123", role: "admin", avatar: "A", status: "active" },
  { id: 2, name: "Md. Rafiqul Islam", email: "rafiq@school.edu.bd", phone: "01711000001", password: "teacher123", role: "teacher", avatar: "R", status: "active", subject: "Math & Science", class: "Class 4" },
  { id: 3, name: "Nasrin Akter", email: "nasrin@school.edu.bd", phone: "01811000002", password: "teacher123", role: "teacher", avatar: "N", status: "active", subject: "Bangla", class: "Class 3" },
  { id: 4, name: "Sakib Hasan", email: "sakib@student.edu.bd", phone: "01900000001", password: "student123", role: "student", avatar: "S", status: "active", class: "Class 5", roll: "101", batch: "2025" },
  { id: 5, name: "Rahima Akter", email: "rahima@student.edu.bd", phone: "01900000002", password: "student123", role: "student", avatar: "R", status: "active", class: "Class 4", roll: "102", batch: "2025" },
];

export const mockStudents = [
  { id: 1, roll: "101", name: "Sakib Hasan", class: "Class 5", section: "A", batch: "2025", phone: "01900000001", guardian: "Karim Hasan", address: "Uttara, Dhaka", status: "active", feeStatus: "paid", joinDate: "2020-01-15", gender: "male" },
  { id: 2, roll: "102", name: "Rahima Akter", class: "Class 4", section: "A", batch: "2025", phone: "01900000002", guardian: "Rahim Uddin", address: "Mirpur, Dhaka", status: "active", feeStatus: "pending", joinDate: "2021-01-10", gender: "female" },
  { id: 3, roll: "103", name: "Tanvir Ahmed", class: "Class 5", section: "B", batch: "2025", phone: "01900000003", guardian: "Ahmed Ali", address: "Gulshan, Dhaka", status: "active", feeStatus: "paid", joinDate: "2020-01-20", gender: "male" },
  { id: 4, roll: "104", name: "Sona Begum", class: "Class 2", section: "A", batch: "2025", phone: "01900000004", guardian: "Mina Khatun", address: "Banani, Dhaka", status: "active", feeStatus: "overdue", joinDate: "2023-01-05", gender: "female" },
  { id: 5, roll: "105", name: "Raju Islam", class: "Class 3", section: "A", batch: "2025", phone: "01900000005", guardian: "Islam Hossain", address: "Dhanmondi, Dhaka", status: "active", feeStatus: "paid", joinDate: "2022-01-12", gender: "male" },
  { id: 6, roll: "106", name: "Mitu Akter", class: "Class 1", section: "A", batch: "2025", phone: "01900000006", guardian: "Akter Mia", address: "Mohammadpur, Dhaka", status: "active", feeStatus: "paid", joinDate: "2024-01-08", gender: "female" },
  { id: 7, roll: "107", name: "Limon Hasan", class: "Class 5", section: "A", batch: "2025", phone: "01900000007", guardian: "Hasan Mia", address: "Rampura, Dhaka", status: "inactive", feeStatus: "pending", joinDate: "2020-01-18", gender: "male" },
  { id: 8, roll: "108", name: "Popy Begum", class: "Class 3", section: "B", batch: "2025", phone: "01900000008", guardian: "Begum Rashida", address: "Badda, Dhaka", status: "active", feeStatus: "paid", joinDate: "2022-01-25", gender: "female" },
];

export const mockTeachers = [
  { id: 1, empId: "T001", name: "Md. Rafiqul Islam", role: "Head Teacher", subject: "Math & Science", class: "Class 4-5", phone: "01711000001", email: "rafiq@school.edu.bd", address: "Uttara, Dhaka", salary: 25000, joinDate: "2007-01-10", status: "active", gender: "male", exp: "18 years" },
  { id: 2, empId: "T002", name: "Nasrin Akter", role: "Senior Teacher", subject: "Bangla & Literature", class: "Class 3-4", phone: "01811000002", email: "nasrin@school.edu.bd", address: "Mirpur, Dhaka", salary: 20000, joinDate: "2011-01-15", status: "active", gender: "female", exp: "14 years" },
  { id: 3, empId: "T003", name: "Karim Hossain", role: "Assistant Teacher", subject: "English & Social Studies", class: "Class 2-3", phone: "01911000003", email: "karim@school.edu.bd", address: "Mohammadpur, Dhaka", salary: 18000, joinDate: "2015-03-01", status: "active", gender: "male", exp: "10 years" },
  { id: 4, empId: "T004", name: "Fatema Begum", role: "Senior Teacher", subject: "Religion & Arts", class: "Class 1-2", phone: "01611000004", email: "fatema@school.edu.bd", address: "Gulshan, Dhaka", salary: 20000, joinDate: "2013-06-01", status: "active", gender: "female", exp: "12 years" },
  { id: 5, empId: "T005", name: "Alam Hossain", role: "Assistant Teacher", subject: "Science", class: "Class 5", phone: "01511000005", email: "alam@school.edu.bd", address: "Banani, Dhaka", salary: 16000, joinDate: "2018-01-01", status: "active", gender: "male", exp: "7 years" },
];

export const mockFees = [
  { id: 1, studentId: 1, studentName: "Sakib Hasan", class: "Class 5", month: "May 2025", amount: 1500, type: "Tuition", status: "paid", paidDate: "2025-05-05", receipt: "RCP-2025-001" },
  { id: 2, studentId: 2, studentName: "Rahima Akter", class: "Class 4", month: "May 2025", amount: 1200, type: "Tuition", status: "pending", paidDate: null, receipt: null },
  { id: 3, studentId: 3, studentName: "Tanvir Ahmed", class: "Class 5", month: "May 2025", amount: 1500, type: "Tuition", status: "paid", paidDate: "2025-05-08", receipt: "RCP-2025-002" },
  { id: 4, studentId: 4, studentName: "Sona Begum", class: "Class 2", month: "April 2025", amount: 800, type: "Tuition", status: "overdue", paidDate: null, receipt: null },
  { id: 5, studentId: 5, studentName: "Raju Islam", class: "Class 3", month: "May 2025", amount: 1000, type: "Tuition", status: "paid", paidDate: "2025-05-12", receipt: "RCP-2025-003" },
];

export const mockResults = [
  { id: 1, studentId: 1, studentName: "Sakib Hasan", class: "Class 5", exam: "Half-Yearly 2025", bangla: 85, english: 78, math: 92, science: 88, social: 80, total: 423, gpa: "A", grade: "A+", percentage: 84.6, status: "passed" },
  { id: 2, studentId: 2, studentName: "Rahima Akter", class: "Class 4", exam: "Half-Yearly 2025", bangla: 72, english: 65, math: 80, science: 75, social: 70, total: 362, gpa: "A-", grade: "A", percentage: 72.4, status: "passed" },
  { id: 3, studentId: 3, studentName: "Tanvir Ahmed", class: "Class 5", exam: "Half-Yearly 2025", bangla: 90, english: 88, math: 95, science: 91, social: 87, total: 451, gpa: "A+", grade: "A+", percentage: 90.2, status: "passed" },
  { id: 4, studentId: 5, studentName: "Raju Islam", class: "Class 3", exam: "Half-Yearly 2025", bangla: 60, english: 55, math: 70, science: 65, social: 58, total: 308, gpa: "B", grade: "B+", percentage: 61.6, status: "passed" },
];

export const mockNotices = [
  { id: 1, title: "Final Exam Schedule — Class 5", content: "The final examination for Class 5 will commence from June 10, 2025. Students must bring their admit cards and report at 8:00 AM.", category: "Exam", priority: "urgent", date: "2025-05-24", author: "Admin", target: "all" },
  { id: 2, title: "New Admission Open for Session 2025-26", content: "Applications are now open for all classes from Pre-School to Class 5. Last date to apply is June 30, 2025. Visit the office for application forms.", category: "Admission", priority: "normal", date: "2025-05-22", author: "Admin", target: "all" },
  { id: 3, title: "School Closed — Eid ul-Adha Holiday", content: "School will remain closed from June 6 to June 12, 2025 for Eid ul-Adha celebrations. Regular classes will resume from June 13, 2025.", category: "Holiday", priority: "normal", date: "2025-05-20", author: "Admin", target: "all" },
  { id: 4, title: "Annual Sports Day Registration Open", content: "All students from Class 1 to Class 5 are encouraged to register for Annual Sports Day events. Registration forms are available at the school office.", category: "Event", priority: "normal", date: "2025-05-18", author: "Admin", target: "students" },
  { id: 5, title: "Staff Meeting — June 1, 2025", content: "All teaching and non-teaching staff are requested to attend the monthly staff meeting on June 1, 2025 at 3:00 PM in the conference room.", category: "Meeting", priority: "normal", date: "2025-05-15", author: "Admin", target: "teachers" },
  { id: 6, title: "Class Routine Updated for June 2025", content: "The updated class routine for June 2025 is now available. Please check your respective section routines on the notice board.", category: "Academic", priority: "normal", date: "2025-05-12", author: "Head Teacher", target: "all" },
];

export const mockAttendance = [
  { id: 1, studentId: 1, studentName: "Sakib Hasan", class: "Class 5", date: "2025-05-24", status: "present" },
  { id: 2, studentId: 2, studentName: "Rahima Akter", class: "Class 4", date: "2025-05-24", status: "present" },
  { id: 3, studentId: 3, studentName: "Tanvir Ahmed", class: "Class 5", date: "2025-05-24", status: "absent" },
  { id: 4, studentId: 4, studentName: "Sona Begum", class: "Class 2", date: "2025-05-24", status: "late" },
  { id: 5, studentId: 5, studentName: "Raju Islam", class: "Class 3", date: "2025-05-24", status: "present" },
];

export const mockSmsLogs = [
  { id: 1, recipient: "All Parents", message: "School closed tomorrow — Eid Holiday", sentAt: "2025-05-20 09:00", count: 1200, status: "sent" },
  { id: 2, recipient: "Class 5 Parents", message: "Exam starts June 10. Bring admit card.", sentAt: "2025-05-19 10:30", count: 89, status: "sent" },
  { id: 3, recipient: "Due Payers", message: "Your fee for April is overdue. Please pay.", sentAt: "2025-05-15 11:00", count: 38, status: "sent" },
];
