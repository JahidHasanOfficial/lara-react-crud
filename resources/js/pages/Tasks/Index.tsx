import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Megaphone } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: '/tasks',
    },
];

interface Task {
    id: number,
    question: string,
    answer: string,
    image?: string | null
}

interface PageProps {
    flash: {
        message?: string
    },
    tasks: Task[]
}

export default function Index() {

    const { tasks, flash } = usePage().props as PageProps;

    const {processing, delete: destroy} = useForm();

    const handleDelete = (id: number, question: string) => {
        if(confirm(`Do you want to delete a task - ${id}. ${question}`)){
            destroy(route("tasks.destroy", id));
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tasks" />
            <div className='m-4'>
                <Link href={route('tasks.create')}><Button>Create a Task</Button></Link>
            </div>
            <div className='m-4'>
                <div>
                    {flash.message && (
                        <Alert>
                            <Megaphone className="h-4 w-4" />
                            <AlertTitle>Notification!</AlertTitle>
                            <AlertDescription>
                                {flash.message}
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            </div>
            {tasks.length > 0 && (
                <div className='m-4'>
                    <Table>
                        <TableCaption>A list of your recent tasks.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>Question</TableHead>
                                <TableHead>Answer</TableHead>
                                <TableHead>Image</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tasks.map((task) => (
                                <TableRow>
                                    <TableCell className="font-medium">{task.id}</TableCell>
                                    <TableCell>{task.question}</TableCell>
                                    <TableCell>{task.answer}</TableCell>
                                    <TableCell>
                                        {task.image ? (
                                            <img src={task.image} alt={`Task ${task.id} Image`} className="h-20 w-20 object-cover"/>
                                        ) : (
                                            'No Image'
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center space-x-2">
                                        <Link href={route('tasks.edit', task.id)}><Button className="bg-slate-600 hover:bg-slate-700">Edit</Button></Link>
                                        <Button disabled={processing} onClick={() => handleDelete(task.id, task.question)} className="bg-red-500 hover:bg-red-700">Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                           
                        </TableBody>
                    </Table>

                </div>

            )}
        </AppLayout>
    );
}
