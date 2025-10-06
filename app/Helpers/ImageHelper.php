<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageHelper
{
    /**
     * Upload image to storage/app/public/{path}
     */
    public static function upload($file, $path = 'uploads')
    {
        $fileName = Str::random(20) . '.' . $file->getClientOriginalExtension();
        // storeAs(file_path, file_name, disk)
        $file->storeAs($path, $fileName, 'public');
        return $path . '/' . $fileName;
    }

    /**
     * Update image (delete old & upload new)
     */
    public static function update($newFile, $oldFilePath = null, $path = 'uploads')
    {
        // পুরানো ফাইল থাকলে মুছে দাও
        if ($oldFilePath) {
            self::delete($oldFilePath);
        }

        // নতুন ফাইল আপলোড করো
        return self::upload($newFile, $path);
    }

    /**
     * Delete image from storage
     */
    public static function delete($filePath)
    {
        if (!$filePath) return false;
        $filePath = str_replace('public/', '', $filePath);
        if (Storage::disk('public')->exists($filePath)) {
            Storage::disk('public')->delete($filePath);
            return true;
        }

        return false;
    }

    /**
     * Get image full URL for showing in Blade
     */
    public static function get($filePath)
    {
        if (!$filePath) {
            return asset('default.png');
        }
        $filePath = str_replace('public/', '', $filePath);

        if (Storage::disk('public')->exists($filePath)) {
            return asset('storage/' . $filePath);
        }

        return asset('default.png'); 
    }
}
