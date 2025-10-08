import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { CircleAlert } from 'lucide-react';
import { useState } from 'react';

interface Task {
    id: number;
    question: string;
    answer: string;
    image?: string;
}

interface Props {
    task: Task;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: '/tasks',
    },
    {
        title: 'Edit Task',
        href: '/tasks/edit',
    },
];

export default function Edit({ task }: Props) {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        _method: 'PUT', // Laravel method spoofing
        question: task.question || '',
        answer: task.answer || '',
        image: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        console.log('Form Data:', {
            question: data.question,
            answer: data.answer,
            hasImage: !!data.image
        });

        // Use post with _method for Laravel
        post(route('tasks.update', task.id), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        
        if (file) {
            setData('image', file);
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setData('image', null);
            setPreviewImage(null);
        }
    };

    const clearErrors = (field: string) => {
        if (errors[field]) {
            const newErrors = { ...errors };
            delete newErrors[field];
            // Inertia doesn't provide direct error clearing, so we reset
            reset();
            setData({
                ...data,
                [field]: data[field as keyof typeof data]
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Task" />
            <div className="w-8/12 p-4">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Display errors */}
                    {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive">
                            <CircleAlert className="h-4 w-4" />
                            <AlertTitle>Form Errors</AlertTitle>
                            <AlertDescription>
                                <ul className="list-disc list-inside space-y-1">
                                    {Object.entries(errors).map(([key, message]) => (
                                        <li key={key} className="capitalize">
                                            <strong>{key}:</strong> {message as string}
                                        </li>
                                    ))}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Question Field */}
                    <div className="space-y-2">
                        <Label htmlFor="question" className="text-sm font-medium">
                            Task Question *
                        </Label>
                        <Input
                            id="question"
                            name="question"
                            placeholder="Enter task question"
                            value={data.question}
                            onChange={(e) => {
                                setData('question', e.target.value);
                                clearErrors('question');
                            }}
                            className={errors.question ? 'border-red-500 focus-visible:ring-red-500' : ''}
                            disabled={processing}
                        />
                        {errors.question && (
                            <p className="text-red-500 text-sm font-medium">{errors.question}</p>
                        )}
                    </div>

                    {/* Answer Field */}
                    <div className="space-y-2">
                        <Label htmlFor="answer" className="text-sm font-medium">
                            Task Answer *
                        </Label>
                        <Textarea
                            id="answer"
                            name="answer"
                            placeholder="Enter task answer"
                            value={data.answer}
                            onChange={(e) => {
                                setData('answer', e.target.value);
                                clearErrors('answer');
                            }}
                            className={errors.answer ? 'border-red-500 focus-visible:ring-red-500' : ''}
                            disabled={processing}
                            rows={5}
                        />
                        {errors.answer && (
                            <p className="text-red-500 text-sm font-medium">{errors.answer}</p>
                        )}
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <Label htmlFor="image" className="text-sm font-medium">
                            Task Image
                        </Label>
                        <Input
                            id="image"
                            name="image"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className={errors.image ? 'border-red-500 focus-visible:ring-red-500' : ''}
                            disabled={processing}
                        />
                        {errors.image && (
                            <p className="text-red-500 text-sm font-medium">{errors.image}</p>
                        )}
                        
                        {/* Image Previews */}
                        <div className="flex gap-4 mt-3">
                            {/* Current Image */}
                            {task.image && !previewImage && (
                                <div className="p-3 border rounded-lg">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Current Image:</p>
                                    <img 
                                        src={task.image} 
                                        alt="Current task" 
                                        className="h-32 w-32 object-cover rounded-lg border"
                                    />
                                </div>
                            )}
                            
                            {/* New Image Preview */}
                            {previewImage && (
                                <div className="p-3 border rounded-lg">
                                    <p className="text-sm font-medium text-gray-700 mb-2">New Image:</p>
                                    <img 
                                        src={previewImage} 
                                        alt="New task preview" 
                                        className="h-32 w-32 object-cover rounded-lg border"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <Button 
                            type="submit" 
                            disabled={processing}
                            className="bg-blue-600 hover:bg-blue-700 min-w-32"
                        >
                            {processing ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating...
                                </>
                            ) : (
                                'Update Task'
                            )}
                        </Button>
                        
                        <Link href={route('tasks.index')}>
                            <Button 
                                type="button" 
                                variant="outline" 
                                disabled={processing}
                            >
                                Cancel
                            </Button>
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}