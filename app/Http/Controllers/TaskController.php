<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Inertia\Inertia;
use App\Helpers\ImageHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
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
        dd($request->all());
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

    //  public function edit(Task $task)
    // {
    //     return Inertia::render('Tasks/Edit', compact('task'));
    // }


     public function edit(Task $task)
    {
        return Inertia::render('Tasks/Edit', [
            'task' => [
                'id' => $task->id,
                'question' => $task->question,
                'answer' => $task->answer,
                'image' => $task->image ? Storage::url($task->image) : null,
            ],
        ]);
    }

    public function update(Request $request, Task $task)
    {
        // \Log::info('Update Request Data:', $request->all());
        // \Log::info('Files:', $request->file() ?: 'No files');

        // Validate the request
        $validated = $request->validate([
            'question' => 'required|string|max:255',
            'answer' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        Log::info('Validated Data:', $validated);

        // Update task data
        $task->question = $validated['question'];
        $task->answer = $validated['answer'];



        // Handle image upload

         if ($request->hasFile('image')) {
            $task->image = ImageHelper::update($request->file('image'), $task->image, 'tasks');
        }
        // If no new image is uploaded, retain the existing image
        else {
            $task->image = $task->image;
        }
        // if ($request->hasFile('image')) {
        //     Log::info('Image file detected');
            
        //     // Delete old image if exists
        //     if ($task->image && Storage::exists($task->image)) {
        //         Storage::delete($task->image);
        //     }
            
        //     // Store new image
        //     $imagePath = $request->file('image')->store('tasks', 'public');
        //     $task->image = $imagePath;
            
        //     // Log::info('New image stored at: ' . $imagePath);
        // }

        $task->save();

        return redirect()->route('tasks.index')
            ->with('success', 'Task updated successfully!');
    }


    public function destroy(Task $task)
    {
        $task->delete();
        return redirect()->route('tasks.index')->with('message', 'Task deleted successfully');
    }
}
