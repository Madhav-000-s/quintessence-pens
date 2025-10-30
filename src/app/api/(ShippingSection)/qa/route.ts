import { serviceClient } from "@/supabase-client";
import { NextRequest } from "next/server";

// Get all QA records (bypasses RLS for superadmin access)
export async function GET(request: NextRequest) {
    const adminClient = serviceClient();

    const { data, error } = await adminClient
        .from("QualityAssurance")
        .select("*")
        .order("inspection_date", { ascending: false });

    if (error) {
        return new Response(JSON.stringify(error), { status: 400 });
    }

    return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    });
}

// Create new QA record (bypasses RLS for superadmin access)
export async function POST(request: NextRequest) {
    const adminClient = serviceClient();
    const body = await request.json();

    const { data, error } = await adminClient
        .from("QualityAssurance")
        .insert([body])
        .select();

    if (error) {
        return new Response(JSON.stringify(error), { status: 400 });
    }

    return new Response(JSON.stringify(data), {
        status: 201,
        headers: { "Content-Type": "application/json" }
    });
}

// Update QA record (bypasses RLS for superadmin access)
export async function PATCH(request: NextRequest) {
    const adminClient = serviceClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
        return new Response(JSON.stringify({ message: "Missing id" }), { status: 400 });
    }

    const body = await request.json();

    const { data, error } = await adminClient
        .from("QualityAssurance")
        .update(body)
        .eq("id", id)
        .select();

    if (error) {
        return new Response(JSON.stringify(error), { status: 400 });
    }

    return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    });
}

// Delete QA record (bypasses RLS for superadmin access)
export async function DELETE(request: NextRequest) {
    const adminClient = serviceClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
        return new Response(JSON.stringify({ message: "Missing id" }), { status: 400 });
    }

    const { error } = await adminClient
        .from("QualityAssurance")
        .delete()
        .eq("id", id);

    if (error) {
        return new Response(JSON.stringify(error), { status: 400 });
    }

    return new Response(JSON.stringify({ message: "QA record deleted" }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    });
}
