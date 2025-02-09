import { Workout } from "@/types/workout";
import { calculateWorkoutVolume } from "./utils";

export interface WeightData {
    timePeriod : string;
    weight : number;
}

export const getPoundsPerPeriod = (workouts : Workout[], month : number) => {

    // unnecessary amount of re-calculation -- should just calculate weeks for every month but alas...


    const weekBreakdown = [
        {timePeriod : "Week 1", weight : 0},
        {timePeriod : "Week 2", weight : 0},
        {timePeriod : "Week 3", weight : 0},
        {timePeriod : "Week 4", weight : 0},

    ];

    const monthBreakdown = [
        {timePeriod : "January", weight : 0},
        {timePeriod : "February", weight : 0},
        {timePeriod : "March", weight : 0},
        {timePeriod : "April", weight : 0},
        {timePeriod : "May", weight : 0},
        {timePeriod : "June", weight : 0},
        {timePeriod : "July", weight : 0},
        {timePeriod : "August", weight : 0},
        {timePeriod : "September", weight : 0},
        {timePeriod : "October", weight : 0},
        {timePeriod : "November", weight : 0},
        {timePeriod : "December", weight : 0},
    ];


    for(const wkt of workouts) {
        const d = (new Date(wkt.date));
        let wktMonth = d.getMonth();
        // console.log(`DATE : ${d} - MONTH : ${wktMonth}`);
        monthBreakdown[wktMonth].weight += calculateWorkoutVolume(wkt.exercises);


        if(wktMonth === month) {
            let week = Math.floor(d.getDate() / 7);


            if(week === 4) week=3;

            // console.log(`DATE : ${d} - DAY - ${d.getDate()} WEEK : ${week}`);

            // console.log(`weekBreakdown : ${JSON.stringify(weekBreakdown[week])}`);
            weekBreakdown[week].weight += calculateWorkoutVolume(wkt.exercises);
        }
    }

    console.log(`months : ${JSON.stringify(monthBreakdown)}\nweeks : ${JSON.stringify(weekBreakdown)}`);
    return [weekBreakdown, monthBreakdown];
}
