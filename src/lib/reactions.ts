import { ref, get, update, serverTimestamp } from "firebase/database";
import { database } from "@/lib/firebase";

export async function recordReaction(workoutId: string, reactorId: string): Promise<void> {
  const workoutRef = ref(database, `workouts/${workoutId}`);

  const snapshot = await get(workoutRef);
  if (!snapshot.exists()) {
    throw new Error("Workout does not exist!");
  }

  const workoutData = snapshot.val();
  const currentReactionCount = workoutData.reactionCount || 0;

  await update(workoutRef, {
    reactionCount: currentReactionCount + 1,
  });

  const mailboxRef = ref(database, `users/${workoutData.ownerId}/mailbox`);
  await update(mailboxRef, {
    notification: {
      type: "reaction",
      from: reactorId,
      workoutId,
      timestamp: serverTimestamp(),
    },
  });
}
