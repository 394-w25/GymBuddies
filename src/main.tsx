import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { AppProvider } from './context/AppContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <div className='w-screen h-screen flex flex-col justify-center items-center'>
      <div className='w-[430px] h-[932px] border border-black'> */}
    <AppProvider>
      <App />
    </AppProvider>
      {/* </div>
    </div> */}
  </StrictMode>,
)
