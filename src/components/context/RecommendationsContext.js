import React, { useContext, useState } from 'react'

const RecommendationsContext = React.createContext()
const RecommendationsUpdateContext = React.createContext()

export function useRecommendations() {
return useContext(RecommendationsContext)
}

export function useRecommendationsUpdate() {
return useContext(RecommendationsUpdateContext)
}

export function RecommendationsProvider({ children }) {
    const [recommendations, setRecommendations] = useState([])
      
    async function defineRecommendations() {
      const res = await fetch(process.env.REACT_APP_RECOMMENDATIONS_MS + '/recommendations', {mode: 'cors'})
      const data = await res.json()
      setRecommendations([...data])
    }
  
    return (
      <RecommendationsContext.Provider value={recommendations}>
        <RecommendationsUpdateContext.Provider value={defineRecommendations}>
          {children}
        </RecommendationsUpdateContext.Provider>
      </RecommendationsContext.Provider>
    )
  }