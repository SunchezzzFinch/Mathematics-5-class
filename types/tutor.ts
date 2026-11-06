export type WorldTheme = 'minecraft' | 'space' | 'music';

export type VisualizerType = 'number_line' | 'fraction_lab' | 'geometry_3d' | 'protractor' | 'order_of_ops' | 'order_tree';

export type SubjectCategory =
  | 'numbers_scales'    // §1. Натуральные числа, шкалы, диаграммы
  | 'addition_subtraction' // §2. Сложение и вычитание
  | 'multiplication_division' // §3. Умножение и деление, делимость
  | 'areas_volumes'     // §4. Площади и объёмы
  | 'fractions'         // §5. Обыкновенные дроби
  | 'decimals'          // §6. Десятичные дроби
  | 'measurement_tools'; // §7. Инструменты и углы

export type TaskFormat = 
  | 'single_input'      // Одно поле ответа (число или строка)
  | 'multiple_choice'   // Выбор одного из вариантов
  | 'fill_blanks'       // Пошаговое заполнение пропусков (методика Ткачёвой)
  | 'comparison'        // <, >, =
  | 'visual_interactive'; // Требует взаимодействия с виджетом

export interface TaskFillBlankStep {
  textBefore: string;
  expected: string;
  textAfter: string;
  placeholder?: string;
}

export interface TaskItem {
  id: string;
  topicId: string;
  sectionNumber: number; // e.g. 5, 14, 21, 26, 31...
  title: string;
  format: TaskFormat;
  question: string;
  // World adaptations
  contextDescriptions?: Record<WorldTheme, string>;
  options?: string[]; // for multiple_choice
  correctAnswer: string;
  acceptedAnswers?: string[];
  unit?: string; // e.g. "см²", "кубиков", "км/ч", "долей"
  fillBlanks?: TaskFillBlankStep[];
  
  // 3-tiered graduated hints (Сократический метод)
  hintTier1: string; // Наводящий вопрос или зацепка
  hintTier2: string; // Визуальная схема / аналогия из темы мира
  hintTier3: string; // Пошаговый алгоритм решения

  visualType?: 'number_line' | 'fraction_lab' | 'geometry_3d' | 'protractor' | 'order_tree';
  visualConfig?: Record<string, any>;
  explanation: string;
  textbookRef: string; // e.g. "Учебник Виленкина §5 / Тетрадь Ткачёвой с. 14"
}

export interface TopicItem {
  id: string;
  sectionNumber: number;
  title: string;
  category: SubjectCategory;
  categoryTitle: string;
  grade: 5;
  didacticDescription: string;
  worldMetaphors: Record<WorldTheme, { title: string; story: string }>;
  theoryMarkdown: string;
  sampleTask: TaskItem;
  practiceTasks: TaskItem[];
  defaultVisual: 'number_line' | 'fraction_lab' | 'geometry_3d' | 'protractor' | 'order_tree';
}

export interface StudentAttempt {
  id: string;
  taskId: string;
  topicId: string;
  timestamp: number;
  userAnswer: string;
  isCorrect: boolean;
  hintsUsed: number; // 0, 1, 2, 3
  timeSpentSeconds: number;
  world: WorldTheme;
}

export interface TopicProgress {
  topicId: string;
  attemptsCount: number;
  successCount: number;
  hintsCount: number;
  lastPracticed: number;
  masteryLevel: number; // 0 to 100
  needsReview: boolean;
}

export interface StudentProfile {
  name: string;
  grade: 5;
  activeWorld: WorldTheme;
  xp: number;
  streakDays: number;
  lastStreakDate: string;
  totalTimeMinutes: number;
  completedLessonsCount: number;
  parentPin: string;
  avatarSeed: string;
}

export interface ChatMessage {
  id: string;
  sender?: 'student' | 'tutor';
  role?: 'user' | 'assistant';
  text: string;
  timestamp: number;
  theme?: WorldTheme;
  visualSnippet?: 'number_line' | 'fraction_lab' | 'geometry_3d' | 'protractor';
  suggestedPrompts?: string[];
}

