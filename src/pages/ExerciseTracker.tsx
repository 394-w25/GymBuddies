import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { WorkoutLogModal } from "@/components/ExerciseTracker/LogModal"
import type { Exercise, Workout, WorkoutLog } from "@/types/workout"
import { useAppContext } from "@/context/AppContext"
import { addFriend, addUser, updateUserStatus } from "@/lib/db"
import { addWorkout, updateWorkout } from "@/lib/db"
// import { User } from "@/types/user"
import type {User as FirebaseUser} from "firebase/auth"

// import { addUser, addWorkout, getUser } from "@/lib/dbManage"

/* 

its 2:30 and i'm sleepy so here goes:

the goal here is to have 'start workout' initiate a workout, all additions of exercises push to the
db immediately, as updates, end workout finalizes the workout and notifies friends (tho they can see
  the unfinished workout the whole time, i.e. we don;t have to filter in the feed)

i had to update some of the type restrictions on workouts to do so, but the setter funcs don't like 
things being set to undefined, so the push for starting an unfinished workout isn't working perfectly rn

i have not integrated compatibility for the log modal, but that'll be pretty easy

i can do all of the above unfinished tasks -- if you're reading this, feel free to work on something else

we are still getting some warnings on the context because it thinks theres a chance the null values
will never be updated (but they will as long as a usr doesn't just sit at the to-be-implemented login screen)

*/

/*

TM TODOS

0. ADD FRIEND FUNCTION ------ DONE
1. REMOVE TIME FROM LOG MODAL
2. HAVE SAVE ON LOG MODAL UPDATE STATE IN EXERCISE TRACKER
3. HAVE SAVE ON LOG MODAL PUSH TO DB
4. HAVE HOME UPDATE EVERY 20 SECONDS

*/

const ExerciseTracker = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [currentWorkout, setCurrentWorkout] = useState<WorkoutLog>(
    { // empty dummy values because i don't know how i should handle typing....
      date : new Date(),
      startTime : new Date,
      exercises : [
        {
          name : '',
          sets : []
        }
      ]
    }
  )
  const {status, setStatus, userId, workoutId, setWorkoutId} = useAppContext();

  const updateStatus = (userId : string, newStatus : boolean) => { // stupid to even take in newStatus
    updateUserStatus(userId, newStatus);
    if (newStatus) {
      // newStatus === true means we MUST BE starting a NEW workout
      // this means we need to ADD an in-progress workout

      const newWorkout: WorkoutLog = {
        date : new Date(),
        startTime : new Date(),
        exercises : [{name : '', sets : []}]
      }

      addWorkout(userId, newWorkout).then((returnVal) => {
        if (!returnVal) {
          // failure to add workout
          console.log("FAILED TO ADD WORKOUT!");
        } else {
          setWorkoutId(returnVal);

        }
      })

    } else {
      // newStatus === false means we MUST be ENDING our CURRENT workout
      // this means we need to update workout one final time
      updateCurrentWorkoutRemote();

    }
    setStatus(newStatus);
  }

  const updateCurrentWorkoutRemote = () => {
    if (userId && workoutId) {
      updateWorkout(userId, workoutId, currentWorkout);
    }
  }

  const appendExerciseToCurrentWorkout = (newExercise : Exercise) => {
    if (JSON.stringify(currentWorkout.exercises) === JSON.stringify([{name : '', sets : []}])) {
      setCurrentWorkout({...currentWorkout, exercises : [newExercise]});
    } else {
      setCurrentWorkout({...currentWorkout, exercises : [...currentWorkout.exercises, newExercise]});
    }


  }



  const handleSaveWorkout = (workout: WorkoutLog) => {
    // Todo: Zero out seconds
    console.log(workout);


  }

  // useEffect(() => {
  //   // addFriend(userId, '')
  //   // if (userId) {
  //   //   // addFriend(userId, 'XMsDS6uCgceKHjB84PuapyaTHJ3'); // tm friend id
  //   // }
  //   const startTime = new Date();
  //   const endTime = new Date();

  //   endTime.setHours(startTime.getHours() + 1)

  //   // give theo some a workout
  //   const tmWkt : WorkoutLog = {
  //     date : new Date(),
  //     startTime : startTime,
  //     endTime : endTime,
  //     title : "My first workout",
  //     caption : "That was hard!",
  //     exercises : [
  //       {
  //         name : "Curl",
  //         sets : [
  //           {
  //             number : 1,
  //             weight : 10,
  //             reps : 5
  //           },
  //           {
  //             number : 2,
  //             weight : 15,
  //             reps : 4
  //           },
  //           {
  //             number : 3,
  //             weight : 20,
  //             reps : 4
  //           },
  //           {
  //             number : 4,
  //             weight : 30,
  //             reps : 4
  //           },
  //         ]
  //       },
  //       {
  //         name : "Bench Press",
  //         sets : [
  //           {
  //             number : 1,
  //             weight : 10,
  //             reps : 5
  //           },
  //           {
  //             number : 2,
  //             weight : 15,
  //             reps : 4
  //           },
  //           {
  //             number : 3,
  //             weight : 20,
  //             reps : 4
  //           },
  //           {
  //             number : 4,
  //             weight : 30,
  //             reps : 4
  //           },
  //         ]
  //       },
  //       {
  //         name : "Weighted Pull Up",
  //         sets : [
  //           {
  //             number : 1,
  //             weight : 10,
  //             reps : 5
  //           },
  //           {
  //             number : 2,
  //             weight : 15,
  //             reps : 4
  //           },
  //           {
  //             number : 3,
  //             weight : 20,
  //             reps : 4
  //           },
  //           {
  //             number : 4,
  //             weight : 30,
  //             reps : 4
  //           },
  //         ]
  //       }
  //     ]


  //   }
  //   addWorkout("XMsDS6uCgceKHjB84PuapyaTHJ3", tmWkt)
  // }, [])
  

  return (
    <div className="container mx-auto">
      <h1 className="text-6xl font-bold mb-6">Tracker</h1>

      {
        !userId
        &&
        <Button
          size='lg'
          className="w-1/2"
          onClick={() => console.log("figure out login at some point ;)")}
          >
            Log In!
          </Button>
      }

      {
        !status && userId
        && 
        <Button
          size='lg'
          className="w-1/2 mb-4"
          onClick={() => updateStatus(userId, true)}
        >
          + Start Workout!
        </Button>
      }

      {
        status && userId
        
        &&
        <div className="workout-management-buttons flex flex-col gap-2 items-center">
          <Button
            size="lg"
            className="w-full"
            onClick={() => updateStatus(userId, false)}
          >
            End Workout
          </Button>

          <Button
            size="lg"
            className="w-full mb-4"
            onClick={() => setIsModalOpen(true)}
          >
            + Log Workout
          </Button>
        </div>
      }


      <WorkoutLogModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={handleSaveWorkout}
      />


    </div>
  )
}

export default ExerciseTracker
