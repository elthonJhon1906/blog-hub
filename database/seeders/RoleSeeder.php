<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = ['admin', 'editor', 'author'];

        foreach ($roles as $roleName) {
            $existingRole = Role::withTrashed()->firstWhere('name', $roleName);

            if ($existingRole) {
                if ($existingRole->trashed()) {
                    $existingRole->restore();
                }

                continue;
            }

            Role::create([ 'name' => $roleName ]);
        }
    }
}
