@extends('layouts.admin')

@section('title', 'Detail Percakapan')

@section('content')
<div class="page-title-box">
    <div class="breadcrumb">Admin / Chat / Detail</div>
    <div style="display: flex; justify-content: space-between; align-items: center;">
        <h2>Percakapan: {{ $session->user->name ?? 'Guest' }}</h2>
        <a href="{{ route('admin.chats.index') }}" class="btn btn-white">Kembali</a>
    </div>
</div>

<div style="max-width: 900px; margin: 0 auto;">
    <div class="table-card" style="padding: 0;">
        <div class="table-header" style="border-bottom: 1px solid var(--border); padding: 1.5rem;">
            <div>
                <div style="font-weight: 700;">Sesi #{{ $session->session_id }}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">Dimulai pada {{ $session->created_at->format('d M Y, H:i') }}</div>
            </div>
        </div>
        
        <div style="height: 600px; overflow-y: auto; padding: 2rem; background: #f8fafc; display: flex; flex-direction: column; gap: 1.5rem;">
            @foreach($session->messages as $msg)
                @if($msg->role === 'user')
                    <!-- User Message -->
                    <div style="align-self: flex-end; max-width: 70%;">
                        <div style="background: var(--primary); color: white; padding: 1rem; border-radius: 16px 16px 0 16px; font-size: 0.938rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                            {{ $msg->content }}
                        </div>
                        <div style="text-align: right; font-size: 0.75rem; color: var(--text-muted); margin-top: 0.4rem;">Anda • {{ $msg->created_at->format('H:i') }}</div>
                    </div>
                @else
                    <!-- AI Message -->
                    <div style="align-self: flex-start; max-width: 80%;">
                        <div style="background: white; color: var(--text-main); padding: 1rem; border-radius: 16px 16px 16px 0; font-size: 0.938rem; border: 1px solid var(--border); box-shadow: 0 1px 3px rgba(0,0,0,0.05); line-height: 1.6;">
                            {!! nl2br(e($msg->content)) !!}
                        </div>
                        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.4rem;">AI MataCeria • {{ $msg->created_at->format('H:i') }}</div>
                    </div>
                @endif
            @endforeach
        </div>
    </div>
</div>
@endsection
