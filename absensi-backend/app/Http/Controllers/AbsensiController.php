<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Absensi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class AbsensiController extends Controller
{
    public function checkIn(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'latitude' => 'required|string',
            'longitude' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        // Check if already checked in today
        $todayAbsensi = Absensi::where('employee_id', $request->user()->id)
            ->today()
            ->pending()
            ->first();

        if ($todayAbsensi) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah melakukan check-in hari ini'
            ], 400);
        }

        $absensi = Absensi::create([
            'employee_id' => $request->user()->id,
            'check_in_time' => Carbon::now(),
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Check-in berhasil',
            'data' => $absensi
        ], 201);
    }

    public function checkOut(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'latitude' => 'required|string',
            'longitude' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        // Find today's check-in
        $absensi = Absensi::where('employee_id', $request->user()->id)
            ->today()
            ->pending()
            ->first();

        if (!$absensi) {
            return response()->json([
                'success' => false,
                'message' => 'Anda belum melakukan check-in hari ini'
            ], 400);
        }

        $absensi->update([
            'check_out_time' => Carbon::now(),
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Check-out berhasil',
            'data' => $absensi->load('employee')
        ]);
    }

    public function history(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $query = Absensi::with('employee')
            ->where('employee_id', $request->user()->id)
            ->orderBy('check_in_time', 'desc');

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->betweenDates($request->start_date, $request->end_date);
        }

        $absensis = $query->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $absensis
        ]);
    }

    public function today(Request $request)
    {
        $absensi = Absensi::with('employee')
            ->where('employee_id', $request->user()->id)
            ->today()
            ->first();

        return response()->json([
            'success' => true,
            'data' => $absensi
        ]);
    }

    public function summary(Request $request)
    {
        $user = $request->user();

        $today = Carbon::today();
        $startOfMonth = $today->copy()->startOfMonth();
        $endOfMonth = $today->copy()->endOfMonth();

        // Today's absensi
        $todayAbsensi = Absensi::where('employee_id', $user->id)
            ->today()
            ->first();

        // Monthly summary
        $monthlyAbsensi = Absensi::where('employee_id', $user->id)
            ->betweenDates($startOfMonth, $endOfMonth)
            ->get();

        $workDays = $monthlyAbsensi->count();
        $totalHours = $monthlyAbsensi->sum(function ($absensi) {
            return $absensi->working_duration_in_hours ?? 0;
        });

        return response()->json([
            'success' => true,
            'data' => [
                'today' => $todayAbsensi,
                'summary' => [
                    'work_days' => $workDays,
                    'total_hours' => round($totalHours, 2),
                    'average_hours_per_day' => $workDays > 0 ? round($totalHours / $workDays, 2) : 0,
                ]
            ]
        ]);
    }

    public function report(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
            'employee_id' => 'sometimes|exists:users,id',
            'filter_by' => 'sometimes|in:today,week,month,year',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $query = Absensi::with('employee')
            ->orderBy('check_in_time', 'desc');

        // Priority 1: Jika ada start_date dan end_date
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->betweenDates($request->start_date, $request->end_date);
        }
        // Priority 2: Jika hanya start_date
        else if ($request->has('start_date')) {
            $query->whereDate('check_in_time', '>=', $request->start_date);
        }
        // Priority 3: Jika hanya end_date
        else if ($request->has('end_date')) {
            $query->whereDate('check_in_time', '<=', $request->end_date);
        }
        // Priority 4: Jika ada filter_by
        else if ($request->has('filter_by')) {
            $today = Carbon::today();

            switch ($request->filter_by) {
                case 'today':
                    $query->today();
                    break;

                case 'week':
                    $startOfWeek = $today->copy()->startOfWeek();
                    $endOfWeek = $today->copy()->endOfWeek();
                    $query->betweenDates($startOfWeek, $endOfWeek);
                    break;

                case 'month':
                    $startOfMonth = $today->copy()->startOfMonth();
                    $endOfMonth = $today->copy()->endOfMonth();
                    $query->betweenDates($startOfMonth, $endOfMonth);
                    break;

                case 'year':
                    $startOfYear = $today->copy()->startOfYear();
                    $endOfYear = $today->copy()->endOfYear();
                    $query->betweenDates($startOfYear, $endOfYear);
                    break;
            }
        }
        // Priority 5: Default - last 30 days jika tidak ada filter
        else {
            $query->whereDate('check_in_time', '>=', Carbon::now()->subDays(30));
        }

        // Filter by employee jika ada
        if ($request->has('employee_id')) {
            $query->where('employee_id', $request->employee_id);
        }

        $absensis = $query->paginate(20);

        // Summary data
        $summary = [
            'total_records' => $absensis->total(),
            'completed_absensi' => $query->clone()->completed()->count(),
            'pending_absensi' => $query->clone()->pending()->count(),
            'filter_applied' => $this->getFilterDescription($request),
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'summary' => $summary,
                'absensis' => $absensis
            ]
        ]);
    }

    private function getFilterDescription($request): string
    {
        if ($request->has('start_date') && $request->has('end_date')) {
            return "Custom range: {$request->start_date} to {$request->end_date}";
        }

        if ($request->has('start_date')) {
            return "From: {$request->start_date}";
        }

        if ($request->has('end_date')) {
            return "Until: {$request->end_date}";
        }

        if ($request->has('filter_by')) {
            return ucfirst($request->filter_by);
        }

        return "Last 30 days (default)";
    }
}