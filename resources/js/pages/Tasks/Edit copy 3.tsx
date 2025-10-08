import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { CircleAlert } from 'lucide-react';

interface Task{
    id: number,
    question: string,
    answer: string,
}

interface Props {
    task: Task
}

export default function Edit({task} : Props) {

    const {data, setData, put, processing, errors } = useForm({
        question: task.question,
        answer: task.answer,
    });



    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('tasks.update', task.id))
    }


    return (
        <AppLayout breadcrumbs={[{title: 'Edit a Task', href: `/tasks/${task.id}/edit`}]}>
            <Head title="Update a Task" />
            <div className='w-8/12 p-4'>
                <form onSubmit={handleUpdate} className='space-y-4'>
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
                        <Label htmlFor="product name">Name</Label>
                        <Input placeholder="Product Name" value={data.question} onChange={(e) => setData('question', e.target.value)}></Input>
                    </div>
                  
                    <div className='gap-1.5'>
                        <Label htmlFor="product description">Description</Label>
                        <Textarea placeholder="Description" value={data.answer}  onChange={(e) => setData('answer', e.target.value)}/>
                    </div>
                    <Button disabled={processing} type="submit">Update Product</Button>
                </form>
            </div>
        </AppLayout>
    );
}
