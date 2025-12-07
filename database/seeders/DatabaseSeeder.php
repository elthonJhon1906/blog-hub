<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
        ]);

        $roles = Role::whereIn('name', ['admin', 'editor', 'author'])
            ->get()
            ->keyBy('name');

        User::factory()->create([
            'name' => 'Admin Satu',
            'username' => 'admin.user',
            'email' => 'admin@example.com',
            'role_id' => $roles['admin']->id ?? null,
            'total_posts' => 5,
            'total_views' => 120,
            'total_comments' => 8,
        ]);

        User::factory()->create([
            'name' => 'Editor Dua',
            'username' => 'editor.user',
            'email' => 'editor@example.com',
            'role_id' => $roles['editor']->id ?? null,
            'total_posts' => 12,
            'total_views' => 480,
            'total_comments' => 34,
        ]);

        User::factory()->create([
            'name' => 'Author Tiga',
            'username' => 'author.user',
            'email' => 'author@example.com',
            'role_id' => $roles['author']->id ?? null,
            'total_posts' => 7,
            'total_views' => 215,
            'total_comments' => 19,
        ]);
    }
}
