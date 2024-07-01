/* eslint-disable no-unused-vars */
"use client";

import { createQuiz } from "@/actions/quiz";
import { Button } from "@/components/buttons/SubmitButton";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import { any, z } from "zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "@/components/loader";

const FormSchema = z.object({
    answer: z.string(),
    isAnswerCorrect: z.boolean().optional(),
});

interface QuestionData {
    form: {
        question: string;
        options: { value: string, isCorrectAnswer: string }[];
    };
}

function QuizForm() {
    const [currentQuestion, setCurrentQuestion] = useState(0);

    interface QuestionData {
        form: {
            question: string;
            options: { value: string, isCorrectAnswer: string }[];
        };
    }

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });

    const [currentQuestionData, setCurrentQuestionData] = useState<QuestionData>({
        form: {
            question: "",
            options: [],
        },
    });
    const [allQuestions, setAllQuestions] = useState<QuestionData[]>([]);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState<any>({});

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setLoading(true);
        let dataToSend = {
            answeredData: {
                answer: data.answer, isAnswerCorrect: data.isAnswerCorrect
            },
            question: currentQuestionData.form.question,
            options: currentQuestionData.form.options
        };
        let res = await createQuiz(dataToSend, currentQuestion === 10, allQuestions);
        if (res.status === 200) {
            setCurrentQuestionData(res.data);
            setAllQuestions([...allQuestions, res.data]);
            setCurrentQuestion(currentQuestion + 1);
        } else if (res.status === 205) {
            setFeedback(res.message);
        }
        else {
            toast.error(res.message);
        }
        setLoading(false);
    };

    return <div className="flex flex-col gap-y-3 bg-gray-200 p-4 rounded-md w-3/5 mx-auto">
        {
            Object.keys(feedback).length > 0 ? <div>
                <h1 className="text-2xl font-bold">You Have Attempted All Questions</h1>
                <p>Your Score {feedback.score}</p>
                <div>
                    Some Insights: {feedback.insights}
                </div>
            </div> :
                <>
                    {currentQuestion !== 0 && <h1 className="text-2xl font-bold">Question {currentQuestion}</h1>}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                            <FormField
                                control={form.control}
                                name="answer"
                                rules={{ required: "Please select an option" }}
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel>
                                            {currentQuestionData.form.question}
                                        </FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={currentQuestionData.form.question + field.value}
                                                className="flex flex-col space-y-1"
                                            >
                                                {
                                                    currentQuestionData.form.options.map((option, index) => (
                                                        <FormItem key={index} className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value={option.value} />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                {option.value}
                                                            </FormLabel>
                                                        </FormItem>
                                                    ))
                                                }
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="isAnswerCorrect"
                                defaultValue={currentQuestionData.form.options.some(option => option.isCorrectAnswer === "true")}
                                render={({ field }) => (
                                    <></>
                                )}
                            />
                            <div className="flex justify-between gap-x-3">
                                {
                                    currentQuestion === 0 &&
                                    <Button
                                        variant="priviliged"
                                        disabled={loading}
                                        aria-disabled={loading}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setLoading(true);
                                            createQuiz().then((res) => {
                                                if (res.status === 200) {
                                                    setCurrentQuestionData(res.data);
                                                    setAllQuestions([...allQuestions, res.data]);
                                                    setCurrentQuestion(currentQuestion + 1);
                                                } else {
                                                    toast.error(res.message);
                                                }
                                                setLoading(false);
                                            });
                                        }}
                                    >
                                        {loading ? <Loader /> : "Start Quiz"}
                                    </Button>
                                }
                                {(currentQuestion !== 0 && currentQuestion <= 10) &&
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        aria-disabled={loading}
                                    >
                                        {
                                            loading ? <Loader /> : <>{currentQuestion >= 10 ? "Submit Quiz" : "Next Question"} </>
                                        }
                                    </Button>
                                }
                            </div>
                        </form>
                    </Form>
                </>
        }
    </div >;
}

export default QuizForm;