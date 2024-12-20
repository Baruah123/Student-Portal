import React, { useState } from 'react';
import { useQuizStore } from '../store/quizStore';
import { Plus, Trash2, Users, UserPlus, X } from 'lucide-react';
import { nanoid } from 'nanoid';

interface QuestionForm {
text: string;
options: string[];
correctAnswer: number;
}

export default function AdminDashboard() {
const { quizzes, addQuiz, deleteQuiz, updateQuiz } = useQuizStore();
const [showNewQuizForm, setShowNewQuizForm] = useState(false);
const [showPermissionModal, setShowPermissionModal] = useState(false);
const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
const [newStudentId, setNewStudentId] = useState('');
const [currentStep, setCurrentStep] = useState(1);
const [newQuiz, setNewQuiz] = useState({
title: '',
description: '',
duration: 30,
questions: [] as QuestionForm[],
isActive: false,
allowedStudents: [] as string[],
});
const [currentQuestion, setCurrentQuestion] = useState<QuestionForm>({
text: '',
options: ['', '', '', ''],
correctAnswer: 0,
});

// Custom input field styles
const inputStyles = "mt-1 block w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-white text-gray-700 text-sm placeholder-gray-400 shadow-sm transition-all duration-200 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-gray-300";

const textareaStyles = "mt-1 block w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-white text-gray-700 text-sm placeholder-gray-400 shadow-sm transition-all duration-200 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-gray-300 min-h-[100px] resize-y";

const handleCreateQuiz = (e: React.FormEvent) => {
e.preventDefault();
if (currentStep === 1) {
setCurrentStep(2);
return;
}

if (newQuiz.questions.length === 0) {
alert('Please add at least one question');
return;
}

addQuiz({
...newQuiz,
questions: newQuiz.questions.map(q => ({ ...q, id: nanoid() })),
});
setShowNewQuizForm(false);
setNewQuiz({
title: '',
description: '',
duration: 30,
questions: [],
isActive: false,
allowedStudents: [],
});
setCurrentStep(1);
};

const handleAddQuestion = () => {
if (!currentQuestion.text.trim() || currentQuestion.options.some(opt => !opt.trim())) {
alert('Please fill in all fields for the question');
return;
}

setNewQuiz(prev => ({
...prev,
questions: [...prev.questions, { ...currentQuestion }],
}));
setCurrentQuestion({
text: '',
options: ['', '', '', ''],
correctAnswer: 0,
});
};

const handleRemoveQuestion = (index: number) => {
setNewQuiz(prev => ({
...prev,
questions: prev.questions.filter((_, i) => i !== index),
}));
};

const handleAddStudent = (quizId: string) => {
if (!newStudentId.trim()) return;

const quiz = quizzes.find(q => q.id === quizId);
if (!quiz) return;

const updatedAllowedStudents = [...quiz.allowedStudents, newStudentId];
updateQuiz(quizId, { allowedStudents: updatedAllowedStudents });
setNewStudentId('');
};

const handleRemoveStudent = (quizId: string, studentId: string) => {
const quiz = quizzes.find(q => q.id === quizId);
if (!quiz) return;

const updatedAllowedStudents = quiz.allowedStudents.filter(id => id !== studentId);
updateQuiz(quizId, { allowedStudents: updatedAllowedStudents });
};

return (
<div className="space-y-6">
<div className="flex justify-between items-center">
<h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
<button
onClick={() => setShowNewQuizForm(true)}
className="inline-flex items-center px-5 py-3 border border-transparent rounded-md shadow-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
>
<Plus className="h-5 w-5 mr-2" />
Create New Quiz
</button>
</div>

{showNewQuizForm && (
<div className="fixed inset-0 bg-gray-700 bg-opacity-70 overflow-y-auto h-full w-full z-50">
<div className="relative top-20 mx-auto p-6 border w-[600px] shadow-lg rounded-lg bg-white">
<div className="flex justify-between items-center mb-4">
<h2 className="text-2xl font-semibold text-gray-800">
{currentStep === 1 ? 'Quiz Details' : 'Add Questions'}
</h2>
<button
onClick={() => {
setShowNewQuizForm(false);
setCurrentStep(1);
}}
className="text-gray-600 hover:text-gray-800"
>
<X className="h-6 w-6" />
</button>
</div>

<form onSubmit={handleCreateQuiz} className="space-y-5">
{currentStep === 1 ? (
<>
<div>
<label className="block text-sm font-semibold text-gray-700 mb-1">
Title
</label>
<input
type="text"
required
placeholder="Enter quiz title"
className={inputStyles}
value={newQuiz.title}
onChange={(e) =>
setNewQuiz({ ...newQuiz, title: e.target.value })
}
/>
</div>
<div>
<label className="block text-sm font-semibold text-gray-700 mb-1">
Description
</label>
<textarea
required
placeholder="Enter quiz description"
className={textareaStyles}
value={newQuiz.description}
onChange={(e) =>
setNewQuiz({ ...newQuiz, description: e.target.value })
}
/>
</div>
<div>
<label className="block text-sm font-semibold text-gray-700 mb-1">
Duration (minutes)
</label>
<input
type="number"
required
min="1"
placeholder="Enter duration in minutes"
className={inputStyles}
value={newQuiz.duration}
onChange={(e) =>
setNewQuiz({
...newQuiz,
duration: parseInt(e.target.value),
})
}
/>
</div>
</>
) : (
<div className="space-y-6">
<div className="bg-gray-50 p-6 rounded-lg space-y-4">
<div>
<label className="block text-sm font-semibold text-gray-700 mb-1">
Question Text
</label>
<input
type="text"
value={currentQuestion.text}
onChange={(e) =>
setCurrentQuestion({
...currentQuestion,
text: e.target.value,
})
}
className={inputStyles}
placeholder="Enter your question"
/>
</div>
<div className="space-y-3">
<label className="block text-sm font-semibold text-gray-700">
Options
</label>
{currentQuestion.options.map((option, index) => (
<div key={index} className="flex items-center space-x-3">
<input
type="radio"
name="correctAnswer"
checked={currentQuestion.correctAnswer === index}
onChange={() =>
setCurrentQuestion({
...currentQuestion,
correctAnswer: index,
})
}
className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
/>
<input
type="text"
value={option}
onChange={(e) => {
const newOptions = [...currentQuestion.options];
newOptions[index] = e.target.value;
setCurrentQuestion({
...currentQuestion,
options: newOptions,
});
}}
className={inputStyles}
placeholder={`Option ${index + 1}`}
/>
</div>
))}
</div>
</div>

<div className="space-y-2">
<h3 className="text-sm font-medium text-gray-700">
Added Questions ({newQuiz.questions.length})
</h3>
{newQuiz.questions.map((q, index) => (
<div
key={index}
className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
>
<span className="text-sm text-gray-700">
{q.text}
</span>
<button
type="button"
onClick={() => handleRemoveQuestion(index)}
className="text-red-600 hover:text-red-900"
>
<Trash2 className="h-5 w-5" />
</button>
</div>
))}
</div>
</div>
)}

<div className="flex justify-end space-x-2 pt-4 border-t">
<button
type="button"
onClick={() => {
setShowNewQuizForm(false);
setCurrentStep(1);
}}
className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
>
Cancel
</button>
<button
type="submit"
className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
>
{currentStep === 1 ? 'Next' : 'Create Quiz'}
</button>
</div>
</form>
</div>
</div>
)}

<div className="bg-white shadow overflow-hidden sm:rounded-md">
<ul className="divide-y divide-gray-200">
{quizzes.map((quiz) => (
<li key={quiz.id} className="px-4 py-4 sm:px-6">
<div className="flex items-center justify-between">
<div className="flex-1">
<h3 className="text-lg font-medium text-gray-900">
{quiz.title}
</h3>
<p className="mt-1 text-sm text-gray-500">
{quiz.description}
</p>
<div className="mt-2">
<div className="flex items-center justify-between">
<div className="flex items-center text-sm text-gray-500">
<Users className="h-4 w-4 mr-1" />
{quiz.allowedStudents.length} students allowed
</div>
<button
onClick={() => {
setSelectedQuiz(quiz.id);
setShowPermissionModal(true);
}}
className="text-sm text-indigo-600 hover:text-indigo-900"
>
Manage Access
</button>
</div>
</div>
</div>
<div className="flex items-center space-x-2">
<button
onClick={() =>
updateQuiz(quiz.id, { isActive: !quiz.isActive })
}
className={`px-3 py-1 rounded-full text-sm font-medium ${
quiz.isActive
? 'bg-green-100 text-green-800'
: 'bg-red-100 text-red-800'
}`}
>
{quiz.isActive ? 'Active' : 'Inactive'}
</button>
<button
onClick={() => deleteQuiz(quiz.id)}
className="text-red-600 hover:text-red-900"
>
<Trash2 className="h-5 w-5" />
</button>
</div>
</div>

{showPermissionModal && selectedQuiz === quiz.id && (
<div className="mt-4 border-t pt-4">
<div className="flex items-center space-x-2 mb-4">
<input
type="text"
placeholder="Enter student ID"
className={inputStyles}
value={newStudentId}
onChange={(e) => setNewStudentId(e.target.value)}
/>
<button
onClick={() => handleAddStudent(quiz.id)}
className="inline-flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
>
<UserPlus className="h-4 w-4 mr-2" />
Add
</button>
</div>
<div className="space-y-2">
{quiz.allowedStudents.map((studentId) => (
<div
key={studentId}
className="flex items-center justify-between bg-gray-50 p-2 rounded"
>
<span className="text-sm text-gray-700">{studentId}</span>
<button
onClick={() => handleRemoveStudent(quiz.id, studentId)}
className="text-red-600 hover:text-red-900 text-sm"
>
Remove
</button>
</div>
))}
</div>
</div>
)}
</li>
))}
</ul>
</div>
</div>
);
}