"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { HelpCircle, CheckCircle, XCircle, RotateCw } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LessonCompletionButton } from "./lesson-completion-button"
import type { Test, Lesson, CourseContent } from "@/types/course"

interface TestQuestionsProps {
  test: Test
  lessonType: Lesson["lessonType"]
  lessonId: string | number
  prevLesson: Lesson | null
  nextLesson: Lesson | null
  onNavigate: (lesson: Lesson) => void
  onScoreChange?: (score: number) => void
  hideSubmitButton?: boolean
  courseContent?: CourseContent
  updateCourseContent?: (updatedContent: CourseContent) => void
}

export function TestQuestions({
  test,
  lessonType,
  lessonId,
  nextLesson,
  onScoreChange,
  hideSubmitButton = false,
  courseContent,
  updateCourseContent,
}: TestQuestionsProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number[]>>({})
  const [showAnswers, setShowAnswers] = useState(false)
  const [showNoSelectionMessage, setShowNoSelectionMessage] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [currentScore, setCurrentScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)

  const handleSingleChoiceChange = (questionId: number, optionId: number) => {
    setShowNoSelectionMessage(false)
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: [optionId],
    }))
  }

  const handleMultipleChoiceChange = (questionId: number, optionId: number, checked: boolean) => {
    setShowNoSelectionMessage(false)
    setSelectedAnswers((prev) => {
      const currentSelections = prev[questionId] || []

      if (checked) {
        return {
          ...prev,
          [questionId]: [...currentSelections, optionId],
        }
      } else {
        return {
          ...prev,
          [questionId]: currentSelections.filter((id) => id !== optionId),
        }
      }
    })
  }

  const calculateScore = () => {
    let correctAnswers = 0
    const totalQuestions = test.questions.length

    test.questions.forEach((question) => {
      const selectedOptions = selectedAnswers[question.id] || []
      const correctOptions = question.options.filter((option) => option.isCorrect).map((option) => option.id)

      if (question.type === "SingleChoice") {
        if (selectedOptions.length === 1 && correctOptions.includes(selectedOptions[0])) {
          correctAnswers++
        }
      }
      else if (question.type === "MultipleChoice") {
        if (
          selectedOptions.length === correctOptions.length &&
          selectedOptions.every((option) => correctOptions.includes(option))
        ) {
          correctAnswers++
        }
      }
    })

    return Math.round((correctAnswers / totalQuestions) * 100)
  }

  const handleCheckAnswers = () => {
    const hasSelections = Object.keys(selectedAnswers).length > 0

    if (!hasSelections) {
      setShowNoSelectionMessage(true)
      return
    }

    const score = calculateScore()
    setCurrentScore(score)

    if (score > bestScore) {
      setBestScore(score)
    }

    if (onScoreChange) {
      onScoreChange(score)
    }

    setShowAnswers(true)
  }

  const handleRestart = () => {
    setSelectedAnswers({})
    setShowAnswers(false)
    setShowNoSelectionMessage(false)
    setSubmitted(false)
  }

  const handleComplete = () => {
    setSubmitted(true)
  }

  const isComplete = test.questions.every(
    (question) => selectedAnswers[question.id] && selectedAnswers[question.id].length > 0,
  )

  const isOptionCorrect = (questionId: number, optionId: number) => {
    const option = test.questions.find((q) => q.id === questionId)?.options.find((o) => o.id === optionId)
    return option?.isCorrect || false
  }

  const getOptionClassName = (questionId: number, optionId: number) => {
    if (!showAnswers) return ""

    const isSelected = selectedAnswers[questionId]?.includes(optionId)
    const isCorrect = isOptionCorrect(questionId, optionId)

    if (isSelected && isCorrect) return "bg-green-50 border-green-200"
    if (isSelected && !isCorrect) return "bg-red-50 border-red-200"
    if (!isSelected && isCorrect) return "bg-green-50 border-green-200"

    return ""
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center max-w-sm 2xl:max-w-xl">
          <HelpCircle className="mr-2 h-6 w-6 text-primary" />
          {lessonType === "VideoWithTest"
            ? "Watch the video and answer the questions below"
            : "Answer the questions below"}
        </h2>

        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-base text-primary border-primary hover:bg-primary/10"
            onClick={handleCheckAnswers}
            disabled={showAnswers}
          >
            <CheckCircle className="h-4 w-4" />
            Check Answers
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-base text-primary border-primary hover:bg-primary/10"
            onClick={handleRestart}
          >
            <RotateCw className="h-4 w-4" />
            Restart
          </Button>
        </div>
      </div>

      {showNoSelectionMessage && (
        <Alert className="mb-4 bg-amber-50 border-amber-200">
          <AlertDescription className="text-amber-700">
            Please select at least one answer before checking the correct answers.
          </AlertDescription>
        </Alert>
      )}

      {showAnswers && (
        <Alert className="mb-4 bg-blue-50 border-blue-200">
          <AlertDescription className="text-blue-700">
            Your score: {currentScore}% | Best score: {bestScore}%
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {test.questions.map((question, qIndex) => (
          <Card key={question.id} className="overflow-hidden border border-gray-200">
            <CardContent className="p-0">
              <div className="bg-gray-50 p-4 border-b border-gray-200">
                <h3 className="font-medium flex items-start">
                  <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2 flex-shrink-0">
                    {qIndex + 1}
                  </span>
                  <span>{question.text}</span>
                </h3>
              </div>

              <div className="p-4">
                {question.type === "SingleChoice" ? (
                  <RadioGroup
                    value={selectedAnswers[question.id]?.[0]?.toString() || ""}
                    onValueChange={(value) => handleSingleChoiceChange(question.id, Number.parseInt(value))}
                    className="space-y-3"
                  >
                    {question.options.map((option) => {
                      const isCorrect = option.isCorrect
                      const isSelected = selectedAnswers[question.id]?.[0] === option.id

                      return (
                        <div
                          key={option.id}
                          className={`flex items-center space-x-2 p-3 rounded-md border transition-colors ${getOptionClassName(
                            question.id,
                            option.id,
                          )}`}
                        >
                          <RadioGroupItem
                            value={option.id.toString()}
                            id={`q${question.id}-o${option.id}`}
                            disabled={showAnswers}
                          />
                          <Label htmlFor={`q${question.id}-o${option.id}`} className="flex-1 cursor-pointer">
                            {option.text}
                          </Label>

                          {showAnswers && (
                            <div className="ml-auto">
                              {isCorrect ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : isSelected ? (
                                <XCircle className="h-5 w-5 text-red-500" />
                              ) : null}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </RadioGroup>
                ) : (
                  <div className="space-y-3">
                    {question.options.map((option) => {
                      const isCorrect = option.isCorrect
                      const isSelected = selectedAnswers[question.id]?.includes(option.id) || false

                      return (
                        <div
                          key={option.id}
                          className={`flex items-center space-x-2 p-3 rounded-md border transition-colors ${getOptionClassName(
                            question.id,
                            option.id,
                          )}`}
                        >
                          <Checkbox
                            id={`q${question.id}-o${option.id}`}
                            checked={isSelected}
                            onCheckedChange={(checked) =>
                              handleMultipleChoiceChange(question.id, option.id, checked as boolean)
                            }
                            disabled={showAnswers}
                          />
                          <Label htmlFor={`q${question.id}-o${option.id}`} className="flex-1 cursor-pointer">
                            {option.text}
                          </Label>

                          {showAnswers && (
                            <div className="ml-auto">
                              {isCorrect ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : isSelected ? (
                                <XCircle className="h-5 w-5 text-red-500" />
                              ) : null}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex justify-between">
        <div>
          {showAnswers && (
            <div className="text-sm text-gray-500">
              Review your answers above. Correct answers are marked with{" "}
              <CheckCircle className="inline h-4 w-4 text-green-500" />.
            </div>
          )}
        </div>

        {showAnswers && !hideSubmitButton && (
          <LessonCompletionButton
            lessonId={lessonId}
            testId={test.id}
            score={currentScore}
            nextLesson={nextLesson}
            onComplete={handleComplete}
            className="bg-primary hover:bg-primary/90 text-white"
            courseContent={courseContent}
            updateCourseContent={updateCourseContent}
          />
        )}
      </div>
    </div>
  )
}

