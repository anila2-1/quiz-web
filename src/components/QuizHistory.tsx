// // src/app/(frontend)/components/QuizHistory.tsx
// import { motion } from 'framer-motion';
// import { useEffect, useState } from 'react';

// interface QuizAttempt {
//   title: string;
//   date: string;
//   score: string;
//   points: number;
// }

// export default function QuizHistory({ userId }: { userId: string }) {
//   const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);

//   // Simulate fetching user quiz history
//   useEffect(() => {
//     // In real app: fetch from API
//     const mockData: QuizAttempt[] = [
//       { title: 'JavaScript Basics', date: '2025-04-01', score: '8/10', points: 80 },
//       { title: 'React Hooks', date: '2025-04-03', score: '10/10', points: 100 },
//       { title: 'CSS Grid & Flexbox', date: '2025-04-05', score: '9/10', points: 90 },
//     ];
//     setQuizAttempts(mockData);
//   }, [userId]);

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 8 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4, ease: "easeOut" }}
//       className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/60 dark:border-gray-700 p-7 transition-all duration-300 hover:shadow-2xl hover:scale-101 relative overflow-hidden"
//     >
//       {/* Background Gradient Blob */}
//       <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full blur-3xl opacity-70"></div>
      
//       {/* Card Content */}
//       <div className="relative z-10">
//         <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-5 flex items-center gap-2">
//           📝 Recent Quiz Attempts
//         </h3>
//         <div className="space-y-4">
//           {quizAttempts.map((attempt, idx) => (
//             <motion.div
//               key={idx}
//               initial={{ opacity: 0, x: -10 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: idx * 0.1 }}
//               className="flex justify-between items-center py-2 border-b border-gray-200/50 dark:border-gray-700/50 last:border-0 group"
//             >
//               <div>
//                 <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
//                   {attempt.title}
//                 </h4>
//                 <p className="text-gray-600 dark:text-gray-400 text-sm">{attempt.date}</p>
//               </div>
//               <div className="text-right">
//                 <span className="text-green-600 dark:text-green-400 font-bold">{attempt.score}</span>
//                 <p className="text-indigo-600 dark:text-indigo-400 text-sm font-medium">+{attempt.points} pts</p>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>

//       {/* Shine Effect */}
//       <motion.div
//         className="absolute inset-0 -left-full bg-gradient-to-r from-transparent via-white/40 to-transparent transform group-hover:animate-shine"
//         style={{ height: '100%', width: '50%' }}
//       ></motion.div>

//       <style jsx>{`
//         @keyframes shine {
//           0% { transform: translateX(-100%); }
//           100% { transform: translateX(200%); }
//         }
//         .animate-shine {
//           animation: shine 1.5s ease-in-out infinite;
//         }
//       `}</style>
//     </motion.div>
//   );
// }