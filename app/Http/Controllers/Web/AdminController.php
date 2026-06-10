<?php

declare(strict_types=1);

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\User;
use App\Models\RefractionResult;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function dashboard()
    {
        $admin = Auth::user();
        if ($admin && DB::table('notifications')->where('notifiable_id', $admin->id)->count() === 0) {
            $notificationsData = [
                [
                    'id' => \Illuminate\Support\Str::uuid()->toString(),
                    'type' => 'App\Notifications\SystemAlert',
                    'notifiable_type' => 'App\Models\User',
                    'notifiable_id' => $admin->id,
                    'data' => json_encode([
                        'title' => 'Pemeriksaan Baru',
                        'message' => 'Pasien Rina Marlina baru saja menyelesaikan tes silinder dengan hasil terdeteksi distorsi 30°.',
                        'action_url' => route('admin.results.index'),
                    ]),
                    'created_at' => now()->subMinutes(12)->toDateTimeString(),
                    'updated_at' => now()->subMinutes(12)->toDateTimeString(),
                ],
                [
                    'id' => \Illuminate\Support\Str::uuid()->toString(),
                    'type' => 'App\Notifications\SystemAlert',
                    'notifiable_type' => 'App\Models\User',
                    'notifiable_id' => $admin->id,
                    'data' => json_encode([
                        'title' => 'Sesi Chat AI Baru',
                        'message' => 'Sesi chat konsultasi AI baru dimulai oleh Kevin Pratama.',
                        'action_url' => route('admin.chats.index'),
                    ]),
                    'created_at' => now()->subHours(1)->toDateTimeString(),
                    'updated_at' => now()->subHours(1)->toDateTimeString(),
                ],
                [
                    'id' => \Illuminate\Support\Str::uuid()->toString(),
                    'type' => 'App\Notifications\SystemAlert',
                    'notifiable_type' => 'App\Models\User',
                    'notifiable_id' => $admin->id,
                    'data' => json_encode([
                        'title' => 'Pendaftaran Pengguna Baru',
                        'message' => 'Pengguna baru "Budi Santoso" telah mendaftar ke platform MataCeria.',
                        'action_url' => route('admin.users.index'),
                    ]),
                    'created_at' => now()->subHours(3)->toDateTimeString(),
                    'updated_at' => now()->subHours(3)->toDateTimeString(),
                ],
            ];
            DB::table('notifications')->insert($notificationsData);
        }

        $stats = [
            'total_users' => User::count(),
            'total_results' => RefractionResult::count(),
            'total_articles' => Article::count(),
            'total_chats' => \App\Models\ChatSession::count(),
            'total_hospitals' => \App\Models\Hospital::count(),
        ];

        $recent_results = RefractionResult::with('user')->latest()->take(5)->get();
        $recent_articles = Article::latest()->take(5)->get();
        $recent_chats = \App\Models\ChatSession::with('user')->latest()->take(5)->get();

        // Top 5 users by Refraction check count
        $topUsersCheck = User::select('users.name', DB::raw('count(refraction_results.id) as total_checks'))
            ->join('refraction_results', 'users.id', '=', 'refraction_results.user_id')
            ->groupBy('users.id', 'users.name')
            ->orderBy('total_checks', 'desc')
            ->take(5)
            ->get();

        // Daily Traffic Chart Data (Last 7 Days)
        $dates = collect();
        for ($i = 6; $i >= 0; $i--) {
            $dates->push(now()->subDays($i)->format('Y-m-d'));
        }

        $refractionData = [];
        foreach ($dates as $date) {
            $refractionData[] = RefractionResult::whereDate('created_at', $date)->count();
        }

        $chartData = [
            'labels' => $dates->map(fn($d) => \Carbon\Carbon::parse($d)->format('d M'))->toArray(),
            'data' => $refractionData,
        ];

        return view('admin.dashboard', compact('stats', 'recent_results', 'recent_articles', 'recent_chats', 'topUsersCheck', 'chartData'));
    }

    public function userGuide()
    {
        return view('admin.guide');
    }

    public function createArticle()
    {
        return view('admin.articles.create');
    }

    public function storeArticle(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'required|string',
            'image_url' => 'nullable|url',
        ]);

        Article::create($data);

        return redirect()->route('admin.articles.index')->with('success', 'Artikel berhasil diterbitkan!');
    }

    public function editArticle(Article $article)
    {
        return view('admin.articles.edit', compact('article'));
    }

    public function updateArticle(Request $request, Article $article)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'required|string',
            'image_url' => 'nullable|url',
        ]);

        $article->update($data);

        return redirect()->route('admin.articles.index')->with('success', 'Artikel berhasil diperbarui!');
    }

    public function destroyArticle(Article $article)
    {
        $article->delete();
        return back()->with('success', 'Artikel berhasil dihapus!');
    }

    public function usersIndex()
    {
        $users = User::latest()->get();
        return view('admin.users.index', compact('users'));
    }

    public function createUser()
    {
        return view('admin.users.create');
    }

    public function storeUser(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8',
            'role' => 'required|in:admin,user',
            'umur' => 'nullable|integer',
            'kelamin' => 'nullable|string',
            'jenjang_pendidikan' => 'nullable|string',
            'status_pekerjaan' => 'nullable|string',
            'phone' => 'nullable|string',
            'vision_type' => 'nullable|string',
            'allergies' => 'nullable|string',
            'medical_history' => 'nullable|string',
        ]);

        $data['password'] = \Illuminate\Support\Facades\Hash::make($data['password']);
        User::create($data);

        return redirect()->route('admin.users.index')->with('success', 'User berhasil ditambahkan!');
    }

    public function editUser(User $user)
    {
        $refractionHistory = \App\Models\RefractionResult::where('user_id', $user->id)
            ->orderBy('created_at', 'asc')
            ->get();

        return view('admin.users.edit', compact('user', 'refractionHistory'));
    }

    public function updateUser(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'role' => 'required|in:admin,user',
            'umur' => 'nullable|integer',
            'kelamin' => 'nullable|string',
            'jenjang_pendidikan' => 'nullable|string',
            'status_pekerjaan' => 'nullable|string',
            'phone' => 'nullable|string',
            'vision_type' => 'nullable|string',
            'allergies' => 'nullable|string',
            'medical_history' => 'nullable|string',
        ]);

        if ($request->filled('password')) {
            $data['password'] = \Illuminate\Support\Facades\Hash::make($request->password);
        }

        $user->update($data);

        return redirect()->route('admin.users.index')->with('success', 'Data user berhasil diperbarui!');
    }

    public function destroyUser(User $user)
    {
        if ($user->id === Auth::id()) {
            return back()->withErrors(['error' => 'Anda tidak bisa menghapus diri sendiri!']);
        }

        $user->delete();
        return back()->with('success', 'User berhasil dihapus!');
    }

    public function resultsIndex()
    {
        $results = RefractionResult::with('user')->latest()->get();
        return view('admin.results.index', compact('results'));
    }

    public function showResult(RefractionResult $result)
    {
        $result->load('user');
        return view('admin.results.show', compact('result'));
    }

    public function chatsIndex()
    {
        $sessions = \App\Models\ChatSession::with('user')->latest()->get();
        return view('admin.chats.index', compact('sessions'));
    }

    public function showChat(\App\Models\ChatSession $session)
    {
        $session->load(['user', 'messages']);
        return view('admin.chats.show', compact('session'));
    }

    public function exportUsers()
    {
        $users = User::all();
        $csvFileName = 'users_export_' . date('Y-m-d') . '.csv';
        $headers = [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=$csvFileName",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];

        $columns = ['ID', 'Name', 'Email', 'Role', 'Joined At'];

        $callback = function() use($users, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);
            foreach ($users as $user) {
                fputcsv($file, [$user->id, $user->name, $user->email, $user->role, $user->created_at]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function hospitalsIndex()
    {
        $hospitals = \App\Models\Hospital::latest()->get();
        return view('admin.hospitals.index', compact('hospitals'));
    }

    public function storeHospital(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'city' => 'required|string',
            'phone' => 'nullable|string',
        ]);

        \App\Models\Hospital::create($data);

        return back()->with('success', 'Rumah sakit berhasil ditambahkan!');
    }

    public function doctorsIndex()
    {
        $doctors = \App\Models\Doctor::with('hospital')->latest()->get();
        $hospitals = \App\Models\Hospital::all();
        return view('admin.doctors.index', compact('doctors', 'hospitals'));
    }

    public function storeDoctor(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'specialization' => 'nullable|string',
            'hospital_id' => 'nullable|exists:hospitals,id',
            'phone' => 'nullable|string',
            'schedule' => 'nullable|string',
        ]);

        \App\Models\Doctor::create($data);

        return back()->with('success', 'Dokter rujukan berhasil ditambahkan!');
    }

    public function destroyDoctor(\App\Models\Doctor $doctor)
    {
        $doctor->delete();
        return back()->with('success', 'Dokter rujukan berhasil dihapus!');
    }

    public function toggleUserRole(User $user)
    {
        if ($user->id === Auth::id()) {
            return back()->withErrors(['error' => 'Anda tidak bisa mengubah role diri sendiri!']);
        }

        $user->role = ($user->role === 'admin') ? 'user' : 'admin';
        $user->save();

        return back()->with('success', 'Role pengguna ' . $user->name . ' berhasil diubah!');
    }

    public function loginForm()
    {
        if (Auth::check() && Auth::user()->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }
        return view('admin.login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            if (Auth::user()->role === 'admin') {
                $request->session()->regenerate();
                return redirect()->intended(route('admin.dashboard'));
            }
            Auth::logout();
            return back()->withErrors(['email' => 'Hanya admin yang dapat mengakses panel ini.']);
        }

        return back()->withErrors(['email' => 'Kredensial tidak cocok dengan data kami.']);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('login');
    }

    public function systemIndex()
    {
        $serverInfo = [
            'PHP Version' => phpversion(),
            'Laravel Version' => app()->version(),
            'Server OS' => php_uname('s') . ' ' . php_uname('r'),
            'Timezone' => config('app.timezone'),
            'Environment' => config('app.env'),
            'Debug Mode' => config('app.debug') ? 'Enabled' : 'Disabled',
            'Database Driver' => DB::connection()->getDriverName(),
            'AI Inference Base URL' => env('API_BASE_URL', 'Not Configured'),
        ];

        // API & Token Traffic Data
        $apiTraffic = [
            'sanctum_total_tokens' => DB::table('personal_access_tokens')->count(),
            'sanctum_active_last_24h' => DB::table('personal_access_tokens')
                                            ->where('last_used_at', '>=', now()->subDay())
                                            ->count(),
            'gemini_api_calls' => \App\Models\ChatMessage::where('role', 'model')->count(),
            'gemini_estimated_tokens' => (int) (\App\Models\ChatMessage::where('role', 'model')->sum(DB::raw('CHAR_LENGTH(content)')) / 4),
            'refraction_api_calls' => \App\Models\RefractionResult::count(),
        ];

        // Daily Traffic Chart Data (Last 7 Days)
        $dates = collect();
        for ($i = 6; $i >= 0; $i--) {
            $dates->push(now()->subDays($i)->format('Y-m-d'));
        }

        $geminiData = [];
        $refractionData = [];

        foreach ($dates as $date) {
            $geminiData[] = \App\Models\ChatMessage::where('role', 'model')
                                ->whereDate('created_at', $date)->count();
            $refractionData[] = \App\Models\RefractionResult::whereDate('created_at', $date)->count();
        }

        $chartData = [
            'labels' => $dates->map(fn($d) => \Carbon\Carbon::parse($d)->format('d M'))->toArray(),
            'gemini' => $geminiData,
            'refraction' => $refractionData,
        ];

        return view('admin.system', compact('serverInfo', 'apiTraffic', 'chartData'));
    }

    public function clearSystemCache()
    {
        try {
            Artisan::call('cache:clear');
            Artisan::call('view:clear');
            Artisan::call('route:clear');
            Artisan::call('config:clear');
            
            return redirect()->back()->with('success', 'Semua cache sistem berhasil dibersihkan.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal membersihkan cache: ' . $e->getMessage());
        }
    }

    public function backupIndex()
    {
        $tables = DB::select('SHOW TABLES');
        $dbName = env('DB_DATABASE', 'backend-refraksi');
        $tableKey = 'Tables_in_' . $dbName;
        
        $tableStats = [];
        foreach ($tables as $tableObj) {
            // Retrieve table name dynamically regardless of the exact key (which depends on DB name)
            $tableName = current((array)$tableObj);
            try {
                $count = DB::table($tableName)->count();
                $tableStats[] = [
                    'name' => $tableName,
                    'rows' => $count
                ];
            } catch (\Exception $e) {
                // Ignore views or unreadable tables
            }
        }

        return view('admin.backup', compact('tableStats'));
    }

    public function downloadBackup()
    {
        $tables = DB::select('SHOW TABLES');
        $dbName = env('DB_DATABASE', 'backend-refraksi');
        $tableKey = 'Tables_in_' . $dbName;
        
        $backupData = [
            'meta' => [
                'generated_at' => now()->toIso8601String(),
                'version' => '1.0',
            ],
            'data' => []
        ];

        foreach ($tables as $tableObj) {
            $tableName = current((array)$tableObj);
            try {
                $backupData['data'][$tableName] = DB::table($tableName)->get();
            } catch (\Exception $e) {
                // Ignore
            }
        }

        $fileName = 'mataceria_backup_' . date('Y-m-d_H-i-s') . '.json';
        
        return response()->streamDownload(function () use ($backupData) {
            echo json_encode($backupData, JSON_PRETTY_PRINT);
        }, $fileName, [
            'Content-Type' => 'application/json',
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
        ]);
    }

    public function getNotifications()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $notifications = DB::table('notifications')
            ->where('notifiable_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($n) {
                $data = json_decode($n->data, true);
                return [
                    'id' => $n->id,
                    'title' => $data['title'] ?? 'Notifikasi',
                    'message' => $data['message'] ?? '',
                    'action_url' => $data['action_url'] ?? '#',
                    'is_read' => !is_null($n->read_at),
                    'time_ago' => \Carbon\Carbon::parse($n->created_at)->diffForHumans(),
                ];
            });

        return response()->json([
            'success' => true,
            'notifications' => $notifications,
            'unread_count' => DB::table('notifications')
                ->where('notifiable_id', $user->id)
                ->whereNull('read_at')
                ->count()
        ]);
    }

    public function markNotificationRead($id)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        DB::table('notifications')
            ->where('notifiable_id', $user->id)
            ->where('id', $id)
            ->update(['read_at' => now()]);

        return response()->json(['success' => true]);
    }

    public function markAllNotificationsRead()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        DB::table('notifications')
            ->where('notifiable_id', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json(['success' => true]);
    }
}
