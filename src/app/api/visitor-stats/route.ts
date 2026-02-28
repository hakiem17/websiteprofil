import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
    try {
        const { page_path } = await request.json();
        const today = new Date().toISOString().split("T")[0];

        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        // Try upsert: increment count if existing, insert if new
        const { data: existing } = await supabase
            .from("visitor_stats")
            .select("id, count")
            .eq("date", today)
            .eq("page_path", page_path || "/")
            .single();

        if (existing) {
            await supabase
                .from("visitor_stats")
                .update({ count: (existing.count || 0) + 1 })
                .eq("id", existing.id);
        } else {
            await supabase
                .from("visitor_stats")
                .insert({ date: today, page_path: page_path || "/", count: 1 });
        }

        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ error: "Failed to track" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        const today = new Date().toISOString().split("T")[0];

        // Today's total
        const { data: todayData } = await supabase
            .from("visitor_stats")
            .select("count")
            .eq("date", today);
        const todayCount = todayData?.reduce((sum, r) => sum + (r.count || 0), 0) || 0;

        // All time total
        const { data: allData } = await supabase
            .from("visitor_stats")
            .select("count");
        const totalCount = allData?.reduce((sum, r) => sum + (r.count || 0), 0) || 0;

        // Last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        const { data: weekData } = await supabase
            .from("visitor_stats")
            .select("date, count")
            .gte("date", sevenDaysAgo.toISOString().split("T")[0])
            .order("date", { ascending: true });

        // Group by date for the chart
        const dailyMap: Record<string, number> = {};
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            dailyMap[d.toISOString().split("T")[0]] = 0;
        }
        weekData?.forEach((r) => {
            if (dailyMap[r.date] !== undefined) {
                dailyMap[r.date] += r.count || 0;
            }
        });

        const daily = Object.entries(dailyMap).map(([date, count]) => ({ date, count }));

        return NextResponse.json({ today: todayCount, total: totalCount, daily });
    } catch {
        return NextResponse.json({ error: "Failed to get stats" }, { status: 500 });
    }
}
