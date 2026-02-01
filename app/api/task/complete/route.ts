
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { User } from "@/models/User";
import { Roadmap } from "@/models/Roadmap";

export async function POST(req: Request) {
  try {
    const { email, roadmapId, month, week, day, taskType } = await req.json();

    await dbConnect();

    // 1. Find the roadmap
    const roadmap = await Roadmap.findById(roadmapId);
    if (!roadmap) return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });

    // 2. Find the specific day task object
    // Mongoose nested array update is tricky, we'll do it in JS for prototype stability
    const mIndex = roadmap.months.findIndex((m: any) => m.month === month);
    const wIndex = roadmap.months[mIndex].weeks.findIndex((w: any) => w.week === week);
    const dIndex = roadmap.months[mIndex].weeks[wIndex].dailyTasks.findIndex((d: any) => d.day === day);

    if (mIndex === -1 || wIndex === -1 || dIndex === -1) {
      return NextResponse.json({ error: "Task day not found" }, { status: 404 });
    }

    const taskDay = roadmap.months[mIndex].weeks[wIndex].dailyTasks[dIndex];

    // 3. Mark specific subtask as done (we simply assume it's done for this prototype)
    // In a real app we'd have specific boolean flags for 'aptitudeCompleted', 'dsaCompleted', etc.
    // BUT our schema currently only has `isCompleted` for the WHOLE day.
    // Let's IMPROVE the schema dynamically or just use a workaround.
    // Workaround: We will use the `resources` array to store "completed_aptitude", "completed_dsa" flags strictly for this hackathon prototype
    // This avoids schema migration headaches right now.

    const flag = `completed_${taskType}`;
    if (!taskDay.resources) taskDay.resources = [];

    if (!taskDay.resources.includes(flag)) {
      taskDay.resources.push(flag);
    }

    // 4. Check if ALL 3 are done
    const isAptitudeDone = taskDay.resources.includes("completed_aptitude");
    const isDsaDone = taskDay.resources.includes("completed_dsa");
    const isCoreDone = taskDay.resources.includes("completed_core");

    let streakIncremented = false;

    if (isAptitudeDone && isDsaDone && isCoreDone && !taskDay.isCompleted) {
      taskDay.isCompleted = true;

      // Increment user streak
      const user = await User.findOne({ email });
      if (user) {
        // Check if streak was already incremented today
        const today = new Date();
        const lastInc = user.lastStreakIncrement ? new Date(user.lastStreakIncrement) : null;

        const isSameDay = lastInc &&
          lastInc.getDate() === today.getDate() &&
          lastInc.getMonth() === today.getMonth() &&
          lastInc.getFullYear() === today.getFullYear();

        if (!isSameDay) {
          user.streak = (user.streak || 0) + 1;
          user.lastStreakIncrement = today;
          streakIncremented = true;
        }

        user.points = (user.points || 0) + 50;
        await user.save();
      }
    }

    // Always update study time regardless of streak/day completion
    const user = await User.findOne({ email });
    if (user) {
      // Initialize if missing
      if (!user.totalStudyTime) {
        user.totalStudyTime = { aptitude: 0, dsa: 0, core: 0 };
      }

      // Add estimated time (Aptitude: 10m, DSA: 20m, Core: 30m)
      if (taskType === "aptitude") user.totalStudyTime.aptitude += 10;
      if (taskType === "dsa") user.totalStudyTime.dsa += 20;
      if (taskType === "core") user.totalStudyTime.core += 30;

      await user.save();
    }

    // Save roadmap
    // Note: We need to mark modified because we touched deep arrays
    roadmap.markModified('months');
    await roadmap.save();

    return NextResponse.json({
      success: true,
      dayCompleted: taskDay.isCompleted,
      streakIncremented
    });

  } catch (error) {
    console.error("Task Complete Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
