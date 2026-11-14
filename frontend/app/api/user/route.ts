import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: Missing authorization token" },
        { status: 401 }
      );
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.SUPABASE_URL ||
      "";
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { message: "Server configuration error: Supabase admin credentials missing." },
        { status: 500 }
      );
    }

    // 1. Verify user identity via token
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const {
      data: { user },
      error: userError,
    } = await adminClient.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json(
        { message: "Unauthorized: Invalid or expired session." },
        { status: 401 }
      );
    }

    const userId = user.id;

    // 2. Cascade delete records in user tables
    try {
      await adminClient.from("eligibility_matches").delete().eq("user_id", userId);
      await adminClient.from("citizen_profiles").delete().eq("user_id", userId);
      await adminClient.from("documents").delete().eq("user_id", userId);
      await adminClient.from("applications").delete().eq("user_id", userId);
    } catch (cleanupErr) {
      console.warn("Non-fatal: cleanup of related records had warning:", cleanupErr);
    }

    // 3. Delete user from Supabase Auth
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(userId);
    if (deleteError) {
      return NextResponse.json(
        { message: deleteError.message || "Failed to delete user account." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: "success",
      message: "Account successfully deleted.",
    });
  } catch (err: any) {
    console.error("Error deleting user account:", err);
    return NextResponse.json(
      { message: err.message || "Internal server error deleting account." },
      { status: 500 }
    );
  }
}
