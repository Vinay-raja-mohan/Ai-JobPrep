
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { User } from "@/models/User";
import { Roadmap } from "@/models/Roadmap";

export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const { email, ...updateData } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required to identify user" },
        { status: 400 }
      );
    }

    // 1. Fetch current user to compare
    const currentUser = await User.findOne({ email });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Check if critical fields (goals) have changed
    // If any of these change, we must reset progress/roadmap.
    const isGoalChange =
      (updateData.targetRole && updateData.targetRole !== currentUser.targetRole) ||
      (updateData.coreSkill && updateData.coreSkill !== currentUser.coreSkill) ||
      (updateData.goalTimeline && updateData.goalTimeline !== currentUser.goalTimeline) ||
      (updateData.currentLevel && updateData.currentLevel !== currentUser.currentLevel);

    let finalUpdate = { ...updateData };

    if (isGoalChange) {
      // Reset progress stats only on goal change
      // IMPORTANT: We do NOT reset streak/shields/points anymore to be friendlier.
      finalUpdate = {
        ...finalUpdate,
        // streak: 0, // Keep streak
        // shields: 0, // Keep shields
        // points: 0, // Keep points
        // totalStudyTime: { ... }, // Keep lifetime stats
        // lastActiveDate: new Date(), // Keep last active
        // lastStreakIncrement: null // Keep last increment
      };

      // Delete existing roadmaps
      await Roadmap.deleteMany({ userId: currentUser._id as any });
    }

    // 3. Update User
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: finalUpdate },
      { new: true }
    );

    return NextResponse.json(
      {
        message: isGoalChange ? "Profile updated and progress reset" : "Profile updated",
        user: updatedUser,
        isGoalChange // Send this back so frontend knows whether to trigger regen
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Profile Update Error:", error);
    return NextResponse.json(
      { error: `Profile Update Failed: ${error.message}` },
      { status: 500 }
    );
  }
}
