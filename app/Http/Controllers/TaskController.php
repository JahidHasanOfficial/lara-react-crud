<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Inertia\Inertia;
use App\Helpers\ImageHelper;
use Illuminate\Http\Request;
use Symfony\Component\Console\Question\Question;

class TaskController extends Controller
{
    // public function index(){
    //     $tasks = Task::all();
    //     return Inertia::render('Tasks/Index', compact('tasks'));
    // }

    public function index()
    {
        $tasks = Task::all()->map(function ($task) {
            $task->image = $task->image ? ImageHelper::get($task->image) : null;
            return $task;
        });

        return inertia('Tasks/Index', [
            'tasks' => $tasks
        ]);
    }

    public function create()
    {
        return Inertia::render('Tasks/Create');
    }
    public function store(Request $request)
    {
        $request->validate([
            'question' => 'required|string|max:255',
            'answer' => 'nullable|string',
            'image' => 'nullable|image|max:2048' // max 2MB
        ]);



        $task = new Task();
        $task->question = $request->input('question');
        $task->answer = $request->input('answer');
        $task->image =  $request->input('image');
        if ($request->hasFile('image')) {
            $task->image = ImageHelper::upload($request->file('image'), 'tasks');
        } else {
            $task->image = null;
        }
        $task->save();

        return redirect()->route('tasks.index')->with('message', 'Task created successfully');
    }

    public function edit(Task $task)
    {
        return inertia::render('Tasks/Edit', compact('task'));
    }

  public function update(Request $request, Task $task)
{
    $request->validate([
        'question' => 'nullable|string|max:255',
        'answer'   => 'nullable|string',
        'image'    => 'nullable|image|max:2048',
    ]);

    // Update basic fields
   $task->question = $request->question;
$task->answer   = $request->answer;
if ($request->hasFile('image')) {
    $task->image = ImageHelper::update($request->file('image'), $task->image, 'tasks');
}
$task->save();

    return redirect()
        ->route('tasks.index')
        ->with('message', 'Task updated successfully.');
}



    public function destroy(Task $task)
    {
        $task->delete();
        return redirect()->route('tasks.index')->with('message', 'Task deleted successfully');
    }
}
