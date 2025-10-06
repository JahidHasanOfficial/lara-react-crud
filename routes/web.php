<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\ProductController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');
    Route::get('/products/create', [ProductController::class, "create"])->name('products.create');
    Route::get('/products/{product}/edit', [ProductController::class, "edit"])->name('products.edit');
    Route::put('/products/{product}', [ProductController::class, "update"])->name('products.update');
    Route::delete('/products/{product}', [ProductController::class, "destroy"])->name('products.destroy');

    // Route Tasks Routes
    Route::get('/tasks', [TaskController::class, 'index'])->name('tasks.index');
    Route::post('/tasks', [TaskController::class, 'store'])->name('tasks.store');
    Route::get('/tasks/create', [TaskController::class, "create"])->name('tasks.create');
    Route::get('/tasks/{task}/edit', [TaskController::class, "edit"])->name('tasks.edit');
    Route::put('/tasks/{task}', [TaskController::class, "update"])->name('tasks.update');
    Route::delete('/tasks/{task}', [TaskController::class, "destroy"])->name('tasks.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
