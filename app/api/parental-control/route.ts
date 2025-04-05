import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { studentId, appName, dailyLimit, isBlocked, blockSchedule } = await request.json();

    // Verify parent relationship
    const { data: student } = await supabase
      .from('auth.users')
      .select('parent_id')
      .eq('id', studentId)
      .single();

    if (!student || student.parent_id !== user.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Update or create parental control settings
    const { data, error } = await supabase
      .from('parental_controls')
      .upsert({
        parent_id: user.id,
        student_id: studentId,
        app_name: appName,
        daily_limit: dailyLimit,
        is_blocked: isBlocked,
        block_schedule: blockSchedule,
      }, {
        onConflict: 'student_id,app_name'
      });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Parental control error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const url = new URL(request.url);
    const studentId = url.searchParams.get('studentId');

    if (!studentId) {
      return new NextResponse('Student ID required', { status: 400 });
    }

    // Verify parent relationship
    const { data: student } = await supabase
      .from('auth.users')
      .select('parent_id')
      .eq('id', studentId)
      .single();

    if (!student || student.parent_id !== user.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get parental control settings
    const { data, error } = await supabase
      .from('parental_controls')
      .select('*')
      .eq('student_id', studentId);

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Parental control error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
