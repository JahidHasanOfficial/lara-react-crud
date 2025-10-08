import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { CircleAlert } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create a New Task',
        href: '/tasks/create',
    },
];

export default function Edit({task}) {

    const {data, setData, put, processing, errors } = useForm({
        question: task.question || '',
        answer: task.answer || '',
        image: task.image || null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      const formData = new FormData();
      formData.append('question', data.question ?? '');
      formData.append('answer', data.answer ?? '');
      if (data.image) formData.append('image', data.image);

      put(route('tasks.update', task.id), formData);
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create a New Task" />
            <div className='w-8/12 p-4'>
                <form onSubmit={handleSubmit} className='space-y-4'>
                    {/* Display error  */}

                    {Object.keys(errors).length > 0 &&(
                        <Alert>
                        <CircleAlert className="h-4 w-4" />
                        <AlertTitle>Errors!</AlertTitle>
                        <AlertDescription>
                            <ul>
                                {Object.entries(errors).map(([key, message]) => (
                                    <li key={key}>{message as string}</li>
                                ))}
                            </ul>
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className='gap-1.5'>
                        <Label htmlFor="Task Question">Task Question</Label>
                        <Input placeholder="Task Question" name="question" value={data.question} onChange={(e) => setData('question', e.target.value)}></Input>
                    </div>
                   
                    <div className='gap-1.5'>
                        <Label htmlFor="Task Answer">Task Answer</Label>
                        <Textarea placeholder="Task Answer" value={data.answer}  onChange={(e) => setData('answer', e.target.value)}/>
                    </div>
                    {/* image  */}
                    <div>
                        <Label htmlFor="Task Image">Task Image</Label>
                        <Input type="file" accept="image/*" onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                setData('image', e.target.files[0]);
                            }
                        }} />
                    </div>
                    {/* submit button  */}
                    <Button disabled={processing} type="submit">Add Task</Button>
                </form>
            </div>
        </AppLayout>
    );
}
