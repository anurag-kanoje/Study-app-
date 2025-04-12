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

    const { appName, startTime } = await request.json();

    // Start tracking app usage
    const { data, error } = await supabase
      .from('app_usage')
      .insert({
        user_id: user.id,
        app_name: appName,
        start_time: startTime || new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('App usage tracking error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { usageId, endTime } = await request.json();

    // End tracking app usage
    const { data, error } = await supabase
      .from('app_usage')
      .update({
        end_time: endTime || new Date().toISOString(),
      })
      .eq('id', usageId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('App usage tracking error:', error);
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
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const studentId = url.searchParams.get('studentId') || user.id;

    // Verify parent relationship if requesting student data
    if (studentId !== user.id) {
      const { data: student } = await supabase
        .from('auth.users')
        .select('parent_id')
        .eq('id', studentId)
        .single();

      if (!student || student.parent_id !== user.id) {
        return new NextResponse('Unauthorized', { status: 401 });
      }
    }

    let query = supabase
      .from('app_usage')
      .select('*')
      .eq('user_id', studentId)
      .order('start_time', { ascending: false });

    if (startDate) {
      query = query.gte('start_time', startDate);
    }
    if (endDate) {
      query = query.lte('start_time', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('App usage tracking error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
