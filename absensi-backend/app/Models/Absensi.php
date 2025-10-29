<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class Absensi extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'employee_id',
        'check_in_time',
        'check_out_time',
        'latitude',
        'longitude',
    ];

    protected $casts = [
        'check_in_time' => 'datetime',
        'check_out_time' => 'datetime',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'employee_id');
    }

    public function scopeForEmployee($query, $employeeId)
    {
        return $query->where('employee_id', $employeeId);
    }

    public function scopeToday($query)
    {
        return $query->whereDate('check_in_time', Carbon::today());
    }

    public function scopeBetweenDates($query, $startDate, $endDate)
    {
        return $query->whereBetween('check_in_time', [$startDate, $endDate]);
    }

    public function scopeCompleted($query)
    {
        return $query->whereNotNull('check_out_time');
    }

    public function scopePending($query)
    {
        return $query->whereNull('check_out_time');
    }

    public function isCompleted(): bool
    {
        return !is_null($this->check_out_time);
    }

    public function isPending(): bool
    {
        return is_null($this->check_out_time);
    }

    public function getWorkingDurationAttribute(): ?int
    {
        if ($this->isCompleted()) {
            return $this->check_in_time->diffInMinutes($this->check_out_time);
        }

        return null;
    }

    public function getWorkingDurationInHoursAttribute(): ?float
    {
        if ($this->isCompleted()) {
            return round($this->check_in_time->diffInMinutes($this->check_out_time) / 60, 2);
        }

        return null;
    }

    public function getWorkingDurationFormattedAttribute(): ?string
    {
        if ($this->isCompleted()) {
            $hours = floor($this->working_duration / 60);
            $minutes = $this->working_duration % 60;

            return "{$hours} jam {$minutes} menit";
        }

        return null;
    }

    public function scopeDateFrom($query, $date)
    {
        return $query->whereDate('check_in_time', '>=', $date);
    }

    public function scopeDateTo($query, $date)
    {
        return $query->whereDate('check_in_time', '<=', $date);
    }
}