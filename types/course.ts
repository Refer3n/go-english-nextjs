export interface Video {
  id: number
  url: string
  title: string
}

export interface TestOption {
  id: number
  text: string
  isCorrect: boolean
}

export interface TestQuestion {
  id: number
  text: string
  type: "SingleChoice" | "MultiChoice"
  options: TestOption[]
}

export interface Test {
  id: number
  title: string
  questions: TestQuestion[]
}

export interface Lesson {
  id: number
  title: string
  description: string
  order: number
  estimatedTimeInMinutes: number
  isCompleted: boolean
  lessonType: "Video" | "VideoWithTest" | "Test"
  video?: Video
  test?: Test
}

export interface Module {
  id: number
  name: string
  order: number
  lessonsCount: number
  completedLessonsCount: number
  estimatedTimeInMinutes: number
  isCompleted: boolean
  lessons: Lesson[]
}

export interface CourseContent {
  id: number
  title: string
  modulesCount: number
  completedModulesCount: number
  progress: number
  modules: Module[]
}

export interface CourseDetails {
  id: number
  title: string
  description: string
  level: string
  price: number
  lessonsCount: number,
  modulesCount: number,
  rating: number
  feedbacksNumber: number
  imageUrl: string
  estimatedTimeInMinutes: number
  videoTimeInMinutes: number
}

