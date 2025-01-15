import { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
    userId : string | null;
    setUserId: (id: string | null) => void;
    workoutId: string | null;
    setWorkoutId : (id: string | null) => void;
    status : boolean;
    setStatus : (status : boolean) => void; // status = true --> currently in workout , status = false --> not
}


const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({children} : {children : ReactNode}) => {
    const [userId, setUserId] = useState<string | null>("VEQzDS6uCgceKHjB84PuapyaDLM2"); // setting chip's ID as default -- future iterations make id username? unique anyway 
    const [workoutId, setWorkoutId] = useState<string | null>(null);
    const [status, setStatus] = useState<boolean>(false);




    return (
        <AppContext.Provider value={{userId, setUserId, workoutId, setWorkoutId, status, setStatus}}>
            {children}
        </AppContext.Provider>
    )
}


export const useAppContext = () => {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error('usecontext must be used within app provider');

    }

    return context;
}

